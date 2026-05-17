import { useState } from "react";
import { Card, Tag } from "../components/ui";
import { cn } from "../lib/utils";

const DAEMON_CODE = `"""
larvox/ipc/server.py

Async Unix domain socket server. Handles multiple simultaneous clients
(HUD, CLI, test harness) with no blocking between them.

Architecture:
  - One asyncio task per connected client (handle_client coroutine)
  - Handler registry maps method names to async callables
  - Broadcast pushes events to all clients subscribed to that event name
  - ClientSession encapsulates per-connection state (subscriptions, writer)
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import signal
import time
from pathlib import Path
from typing import Any, Awaitable, Callable, Optional

from .protocol import (
    ErrorCode, Method, RpcError, RpcRequest, RpcResponse,
    default_socket_path, notification,
)

log = logging.getLogger("larvox.ipc.server")

HandlerFn = Callable[["RpcRequest", "ClientSession"], Awaitable[Any]]


# ── Client session ─────────────────────────────────────────────────────────────

class ClientSession:
    """Represents one connected IPC client with its own subscription set."""

    def __init__(self, reader: asyncio.StreamReader, writer: asyncio.StreamWriter):
        self._reader = reader
        self._writer = writer
        self._subscriptions: set[str] = set()
        self._lock = asyncio.Lock()
        peer = writer.get_extra_info("peername")
        self.peer = peer or "unix"

    async def send(self, data: bytes) -> None:
        """Thread-safe write — guards against concurrent notifications racing."""
        async with self._lock:
            try:
                self._writer.write(data)
                await self._writer.drain()
            except (ConnectionResetError, BrokenPipeError):
                pass  # Caller (handle_client) will detect EOF and clean up

    async def notify(self, event: str, params: dict) -> None:
        await self.send(notification(event, params))

    def subscribe(self, *events: str) -> None:
        self._subscriptions.update(events)

    def unsubscribe(self, *events: str) -> None:
        self._subscriptions.difference_update(events)

    def is_subscribed(self, event: str) -> bool:
        return event in self._subscriptions

    @property
    def subscriptions(self) -> frozenset[str]:
        return frozenset(self._subscriptions)

    def close(self) -> None:
        try:
            self._writer.close()
        except Exception:
            pass


# ── Daemon ─────────────────────────────────────────────────────────────────────

class LarvoxDaemon:
    """
    Core IPC server. Owns the Unix socket, dispatches JSON-RPC calls to
    registered handlers, and broadcasts push notifications to subscribers.

    Usage:
        daemon = LarvoxDaemon()
        daemon.register(Method.TRANSCRIBE, my_transcribe_handler)
        await daemon.run()  # blocks until SIGTERM/SIGINT
    """

    def __init__(self, socket_path: Optional[Path] = None):
        self._socket_path = socket_path or default_socket_path()
        self._handlers: dict[str, HandlerFn] = {}
        self._clients: set[ClientSession] = set()
        self._server: Optional[asyncio.AbstractServer] = None
        self._state = "idle"
        self._start_time = time.monotonic()

        self._register_builtins()

    # ── Handler registration ───────────────────────────────────────────────────

    def register(self, method: str, handler: HandlerFn) -> None:
        """Register an async handler for a JSON-RPC method name."""
        self._handlers[method] = handler
        log.debug("Registered handler: %s", method)

    def _register_builtins(self) -> None:
        self.register(Method.PING,        self._h_ping)
        self.register(Method.STATUS,      self._h_status)
        self.register(Method.SUBSCRIBE,   self._h_subscribe)
        self.register(Method.UNSUBSCRIBE, self._h_unsubscribe)
        self.register(Method.INTERRUPT,   self._h_interrupt)

    # ── Built-in handlers ──────────────────────────────────────────────────────

    async def _h_ping(self, req: RpcRequest, client: ClientSession) -> dict:
        return {"pong": True, "clients": len(self._clients)}

    async def _h_status(self, req: RpcRequest, client: ClientSession) -> dict:
        return {
            "state":          self._state,
            "clients":        len(self._clients),
            "uptime_seconds": round(time.monotonic() - self._start_time, 1),
            "methods":        sorted(self._handlers.keys()),
        }

    async def _h_subscribe(self, req: RpcRequest, client: ClientSession) -> dict:
        events = req.params.get("events", [])
        client.subscribe(*events)
        log.debug("Client subscribed to: %s", events)
        return {"subscribed": list(client.subscriptions)}

    async def _h_unsubscribe(self, req: RpcRequest, client: ClientSession) -> dict:
        events = req.params.get("events", [])
        client.unsubscribe(*events)
        return {"subscribed": list(client.subscriptions)}

    async def _h_interrupt(self, req: RpcRequest, client: ClientSession) -> dict:
        # TODO: signal the pipeline task to cancel
        return {"interrupted": True}

    # ── Dispatch ───────────────────────────────────────────────────────────────

    async def _dispatch(self, raw: str, client: ClientSession) -> Optional[bytes]:
        """
        Parse one newline-delimited JSON message, route to handler, return
        encoded response bytes — or None for valid notifications that need
        no reply.
        """
        try:
            data = json.loads(raw)
        except json.JSONDecodeError as e:
            return RpcResponse.err(None, ErrorCode.PARSE_ERROR, f"JSON parse error: {e}").encode()

        req_id  = data.get("id")
        method  = data.get("method")

        if not isinstance(method, str) or not method:
            return RpcResponse.err(req_id, ErrorCode.INVALID_REQUEST, "Missing or invalid 'method'").encode()

        handler = self._handlers.get(method)

        if handler is None:
            if req_id is None:
                return None  # Unknown notification — silently drop per spec
            return RpcResponse.err(req_id, ErrorCode.METHOD_NOT_FOUND, f"No handler for '{method}'").encode()

        req = RpcRequest(method=method, params=data.get("params", {}), id=req_id)

        try:
            result = await handler(req, client)
        except RpcError as e:
            if req_id is None:
                return None
            return RpcResponse.err(req_id, e.code, e.message, e.data).encode()
        except Exception as e:
            log.exception("Unhandled exception in handler '%s'", method)
            if req_id is None:
                return None
            return RpcResponse.err(req_id, ErrorCode.INTERNAL_ERROR, repr(e)).encode()

        if req_id is None:
            return None  # Valid notification — no response
        return RpcResponse.ok(req_id, result).encode()

    # ── Broadcast ──────────────────────────────────────────────────────────────

    async def broadcast(self, event: str, params: dict) -> None:
        """
        Push a notification to every client subscribed to \`event\`.
        Dead connections are silently pruned.
        """
        dead: set[ClientSession] = set()
        for client in list(self._clients):
            if client.is_subscribed(event):
                try:
                    await client.notify(event, params)
                except Exception:
                    dead.add(client)
        self._clients -= dead

    async def set_state(self, state: str) -> None:
        """Update daemon state and broadcast to all STATE subscribers."""
        self._state = state
        await self.broadcast(Method.EVT_STATE, {"state": state})

    # ── Connection lifecycle ───────────────────────────────────────────────────

    async def _handle_client(
        self,
        reader: asyncio.StreamReader,
        writer: asyncio.StreamWriter,
    ) -> None:
        session = ClientSession(reader, writer)
        self._clients.add(session)
        log.info("Client connected — total: %d", len(self._clients))

        try:
            while not reader.at_eof():
                try:
                    line = await asyncio.wait_for(reader.readline(), timeout=300.0)
                except asyncio.TimeoutError:
                    log.debug("Client idle 5 min, disconnecting")
                    break

                raw = line.decode(errors="replace").strip()
                if not raw:
                    continue

                response = await self._dispatch(raw, session)
                if response:
                    await session.send(response)

        except (ConnectionResetError, BrokenPipeError):
            pass
        except Exception:
            log.exception("Unexpected error in client handler")
        finally:
            self._clients.discard(session)
            session.close()
            log.info("Client disconnected — total: %d", len(self._clients))

    # ── Server lifecycle ───────────────────────────────────────────────────────

    async def start(self) -> None:
        self._socket_path.parent.mkdir(parents=True, exist_ok=True)
        self._socket_path.unlink(missing_ok=True)

        self._server = await asyncio.start_unix_server(
            self._handle_client,
            path=str(self._socket_path),
        )
        os.chmod(self._socket_path, 0o600)  # Owner-only: no other user can connect
        log.info("LARVOX IPC daemon on %s", self._socket_path)

    async def stop(self) -> None:
        if self._server:
            self._server.close()
            await self._server.wait_closed()
        self._socket_path.unlink(missing_ok=True)
        log.info("LARVOX daemon stopped")

    async def run(self) -> None:
        """Start and block until SIGTERM or SIGINT, then shut down cleanly."""
        await self.start()

        loop    = asyncio.get_running_loop()
        stopped = asyncio.Event()

        for sig in (signal.SIGTERM, signal.SIGINT):
            loop.add_signal_handler(sig, stopped.set)

        await stopped.wait()
        await self.stop()
`;

const CLIENT_CODE = `"""
larvox/ipc/client.py

Async client for the LARVOX IPC daemon. Used by the HUD, CLI tool,
skill testing harness, and any other process that needs to talk to the daemon.

Key design choices:
  - asyncio.Future per in-flight request maps responses back by id
  - Event subscriptions call registered Python callbacks as asyncio Tasks
  - Auto-reconnect with exponential backoff for long-lived clients (HUD)
  - Context manager support for short-lived clients (CLI one-shots)
"""

from __future__ import annotations

import asyncio
import json
import logging
from pathlib import Path
from typing import Any, Callable, Coroutine, Optional

from .protocol import (
    ErrorCode, Method, RpcError, RpcRequest, RpcResponse,
    TranscribeParams, ExecuteParams, default_socket_path,
)

log = logging.getLogger("larvox.ipc.client")

EventCallback = Callable[[dict], Coroutine[Any, Any, None]]


# ── Client ─────────────────────────────────────────────────────────────────────

class LarvoxClient:
    """
    Async JSON-RPC client over a Unix domain socket.

    Short-lived usage (CLI):
        async with LarvoxClient() as c:
            print(await c.status())

    Long-lived usage (HUD, always connected):
        client = LarvoxClient(auto_reconnect=True)
        client.on(Method.EVT_RESPONSE, handle_response)
        await client.connect()
        await client.subscribe(Method.EVT_RESPONSE, Method.EVT_STATE)
        # client stays connected in background
    """

    def __init__(
        self,
        socket_path: Optional[Path] = None,
        auto_reconnect: bool = False,
        reconnect_max_delay: float = 30.0,
    ):
        self._socket_path       = socket_path or default_socket_path()
        self._auto_reconnect    = auto_reconnect
        self._reconnect_max_d   = reconnect_max_delay

        self._reader: Optional[asyncio.StreamReader] = None
        self._writer: Optional[asyncio.StreamWriter] = None
        self._read_task: Optional[asyncio.Task]      = None

        self._pending:        dict[str, asyncio.Future] = {}
        self._event_handlers: dict[str, list[EventCallback]] = {}
        self._connected       = False
        self._subscriptions:  set[str] = set()  # Track for auto-resubscribe

    # ── Connection ─────────────────────────────────────────────────────────────

    async def connect(self) -> None:
        self._reader, self._writer = await asyncio.open_unix_connection(
            str(self._socket_path)
        )
        self._connected = True
        self._read_task = asyncio.create_task(self._read_loop(), name="larvox-ipc-reader")
        log.debug("Connected to %s", self._socket_path)

        if self._subscriptions:
            await self._resubscribe()

    async def disconnect(self) -> None:
        self._connected = False
        if self._read_task:
            self._read_task.cancel()
            try:
                await self._read_task
            except asyncio.CancelledError:
                pass
        if self._writer:
            self._writer.close()
            try:
                await self._writer.wait_closed()
            except Exception:
                pass

    async def _reconnect_loop(self) -> None:
        delay = 1.0
        while not self._connected:
            log.info("Reconnecting in %.0fs …", delay)
            await asyncio.sleep(delay)
            try:
                await self.connect()
                log.info("Reconnected to daemon")
                return
            except (OSError, ConnectionRefusedError):
                delay = min(delay * 2, self._reconnect_max_d)

    # ── Read loop ──────────────────────────────────────────────────────────────

    async def _read_loop(self) -> None:
        """
        Reads newline-delimited messages from the daemon indefinitely.
        Messages are either responses (have an id, resolve a pending Future)
        or notifications (no id, routed to event handlers).
        """
        while self._connected and self._reader:
            try:
                line = await self._reader.readline()
            except (ConnectionResetError, asyncio.CancelledError):
                break

            if not line:
                log.warning("Daemon closed the connection")
                break

            raw = line.decode(errors="replace").strip()
            if raw:
                self._dispatch_message(raw)

        self._connected = False
        self._fail_pending(RpcError(ErrorCode.INTERNAL_ERROR, "Connection lost"))

        if self._auto_reconnect:
            asyncio.create_task(self._reconnect_loop())

    def _dispatch_message(self, raw: str) -> None:
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            log.warning("Bad JSON from daemon: %.120s", raw)
            return

        msg_id = data.get("id")
        method = data.get("method")

        if method and msg_id is None:
            # Push notification from daemon
            self._fire_event(method, data.get("params", {}))
            return

        if msg_id and msg_id in self._pending:
            fut = self._pending.pop(msg_id)
            if fut.done():
                return
            if "error" in data:
                e = data["error"]
                fut.set_exception(RpcError(code=e["code"], message=e["message"], data=e.get("data")))
            else:
                fut.set_result(data.get("result"))

    def _fire_event(self, method: str, params: dict) -> None:
        for handler in self._event_handlers.get(method, []):
            asyncio.create_task(handler(params))

    def _fail_pending(self, error: RpcError) -> None:
        for fut in self._pending.values():
            if not fut.done():
                fut.set_exception(error)
        self._pending.clear()

    # ── RPC call / notify ──────────────────────────────────────────────────────

    async def call(self, method: str, params: dict | None = None, timeout: float = 15.0) -> Any:
        """
        Send a request and await the response. Raises RpcError on failure.
        """
        req  = RpcRequest(method=method, params=params or {})
        fut  = asyncio.get_event_loop().create_future()
        self._pending[req.id] = fut

        self._writer.write(req.encode())
        await self._writer.drain()

        try:
            return await asyncio.wait_for(asyncio.shield(fut), timeout=timeout)
        except asyncio.TimeoutError:
            self._pending.pop(req.id, None)
            raise RpcError(ErrorCode.PIPELINE_TIMEOUT, f"'{method}' timed out after {timeout}s")

    async def notify(self, method: str, params: dict | None = None) -> None:
        """Send a notification (fire-and-forget, no response expected)."""
        req = RpcRequest(method=method, params=params or {}, id=None)
        self._writer.write(req.encode())
        await self._writer.drain()

    # ── Event subscription ─────────────────────────────────────────────────────

    def on(self, event: str, callback: EventCallback) -> "LarvoxClient":
        """
        Register an async callback for a daemon push event.
        Callbacks are fired as independent asyncio Tasks so they cannot block
        the read loop.

        Example:
            @client.on(Method.EVT_RESPONSE)
            async def handle_response(params):
                print("Larva says:", params["text"])
        """
        self._event_handlers.setdefault(event, []).append(callback)
        return self

    async def subscribe(self, *events: str) -> dict:
        """Tell the daemon to start pushing these events to this connection."""
        self._subscriptions.update(events)
        return await self.call(Method.SUBSCRIBE, {"events": list(events)})

    async def unsubscribe(self, *events: str) -> dict:
        self._subscriptions.difference_update(events)
        return await self.call(Method.UNSUBSCRIBE, {"events": list(events)})

    async def _resubscribe(self) -> None:
        """Called after auto-reconnect to restore subscriptions."""
        if self._subscriptions:
            await self.call(Method.SUBSCRIBE, {"events": list(self._subscriptions)})

    # ── Typed helper methods ───────────────────────────────────────────────────
    #
    # These wrap self.call() with the correct method name and param schema.
    # External callers should use these rather than calling call() directly.

    async def ping(self) -> dict:
        return await self.call(Method.PING)

    async def status(self) -> dict:
        return await self.call(Method.STATUS)

    async def transcribe(self, text: str, lang: str = "en") -> dict:
        """Submit a text transcript for full pipeline processing."""
        params = TranscribeParams(text=text, lang=lang).to_dict()
        return await self.call(Method.TRANSCRIBE, params, timeout=30.0)

    async def execute_skill(self, skill: str, entities: dict | None = None) -> dict:
        """Bypass NLU and call a specific registered skill directly."""
        params = ExecuteParams(skill=skill, entities=entities or {}).to_dict()
        return await self.call(Method.EXECUTE, params, timeout=20.0)

    async def interrupt(self) -> dict:
        """Cancel whatever pipeline step is currently running."""
        return await self.call(Method.INTERRUPT)

    # ── Context manager ────────────────────────────────────────────────────────

    async def __aenter__(self) -> "LarvoxClient":
        await self.connect()
        return self

    async def __aexit__(self, *_: Any) -> None:
        await self.disconnect()
`;

const PROTOCOL_CODE = `"""
larvox/ipc/protocol.py

JSON-RPC 2.0 message types and LARVOX-specific constants.
All wire messages are newline-delimited JSON, encoded as UTF-8.
"""

from __future__ import annotations

import json
import os
import uuid
from dataclasses import asdict, dataclass, field
from enum import IntEnum
from pathlib import Path
from typing import Any, Optional


# ── Socket location ────────────────────────────────────────────────────────────

def default_socket_path() -> Path:
    """XDG-compliant per-user socket path, isolated to the running user."""
    run_dir = Path(f"/run/user/{os.getuid()}")
    return run_dir / "larvox.sock"


JSONRPC_VERSION = "2.0"


# ── Error codes ────────────────────────────────────────────────────────────────

class ErrorCode(IntEnum):
    # Standard JSON-RPC 2.0 codes
    PARSE_ERROR      = -32700
    INVALID_REQUEST  = -32600
    METHOD_NOT_FOUND = -32601
    INVALID_PARAMS   = -32602
    INTERNAL_ERROR   = -32603

    # LARVOX application codes (-32000 to -32099)
    DAEMON_BUSY      = -32000  # Pipeline already processing an utterance
    SKILL_NOT_FOUND  = -32001  # No registered skill matched the intent
    PIPELINE_TIMEOUT = -32002  # STT / AI step exceeded timeout budget
    NOT_SUBSCRIBED   = -32003  # Client tried to use an event it never subscribed to
    AI_UNAVAILABLE   = -32004  # Both Claude API and local LLM are unreachable


# ── Wire types ─────────────────────────────────────────────────────────────────

@dataclass
class RpcError(Exception):
    """Represents a JSON-RPC error object. Also raised as a Python exception."""
    code: int
    message: str
    data: Any = None

    def to_dict(self) -> dict:
        d = {"code": self.code, "message": self.message}
        if self.data is not None:
            d["data"] = self.data
        return d

    def __str__(self) -> str:
        return f"RpcError({self.code}): {self.message}"


@dataclass
class RpcRequest:
    """
    A JSON-RPC 2.0 request or notification.
    Notifications have id=None and never receive a response.
    """
    method: str
    params: dict = field(default_factory=dict)
    id: Optional[str] = field(default_factory=lambda: str(uuid.uuid4())[:8])
    jsonrpc: str = field(default=JSONRPC_VERSION, init=False)

    def is_notification(self) -> bool:
        return self.id is None

    def encode(self) -> bytes:
        return (json.dumps(asdict(self)) + "\\n").encode()

    @classmethod
    def decode(cls, raw: str) -> "RpcRequest":
        d = json.loads(raw)
        return cls(
            method=d["method"],
            params=d.get("params", {}),
            id=d.get("id"),
        )


@dataclass
class RpcResponse:
    """
    A JSON-RPC 2.0 response. Exactly one of result/error is set.
    """
    id: Optional[str]
    result: Any = None
    error: Optional[RpcError] = None
    jsonrpc: str = field(default=JSONRPC_VERSION, init=False)

    def encode(self) -> bytes:
        d: dict = {"jsonrpc": self.jsonrpc, "id": self.id}
        if self.error is not None:
            d["error"] = self.error.to_dict()
        else:
            d["result"] = self.result
        return (json.dumps(d) + "\\n").encode()

    @classmethod
    def ok(cls, req_id: Optional[str], result: Any) -> "RpcResponse":
        return cls(id=req_id, result=result)

    @classmethod
    def err(cls, req_id: Optional[str], code: int, message: str, data: Any = None) -> "RpcResponse":
        return cls(id=req_id, error=RpcError(code=code, message=message, data=data))


def notification(method: str, params: dict) -> bytes:
    """Convenience builder for daemon-to-client push notifications."""
    return RpcRequest(method=method, params=params, id=None).encode()


# ── Method name constants ──────────────────────────────────────────────────────
#
# Using constants rather than bare strings means a typo is a NameError, not a
# silent routing miss. Group by direction: C→D (client calls daemon) and
# D→C (daemon pushes to subscribed clients).

class Method:
    # Client → Daemon (request/response)
    PING         = "larvox.ping"          # Health check
    STATUS       = "larvox.status"        # Daemon state snapshot
    SUBSCRIBE    = "larvox.subscribe"     # Register for push events
    UNSUBSCRIBE  = "larvox.unsubscribe"   # Deregister events
    TRANSCRIBE   = "larvox.transcribe"    # Submit text for pipeline processing
    EXECUTE      = "larvox.skill.execute" # Bypass NLU, call a skill directly
    INTERRUPT    = "larvox.interrupt"     # Cancel the current pipeline step

    # Daemon → Client (push notifications, no response expected)
    EVT_WAKEWORD   = "larvox.event.wakeword"   # Wake phrase detected
    EVT_LISTENING  = "larvox.event.listening"  # STT stream opened
    EVT_TRANSCRIPT = "larvox.event.transcript" # STT completed, text ready
    EVT_THINKING   = "larvox.event.thinking"   # AI/skill is processing
    EVT_RESPONSE   = "larvox.event.response"   # TTS text ready to speak
    EVT_DONE       = "larvox.event.done"       # Full pipeline complete
    EVT_ERROR      = "larvox.event.error"      # Pipeline error
    EVT_STATE      = "larvox.event.state"      # Daemon state changed


# ── Typed param/result schemas ─────────────────────────────────────────────────
#
# These are not enforced at the wire level — JSON-RPC params are free-form dicts.
# They serve as the authoritative documentation for each method's contract and
# are used by the client helpers to build well-formed calls.

@dataclass
class TranscribeParams:
    text: str
    session_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    lang: str = "en"

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class ExecuteParams:
    skill: str         # Registered skill name, e.g. "system.volume"
    entities: dict = field(default_factory=dict)
    session_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class WakewordParams:
    wakeword: str           # The specific wakeword that was triggered
    confidence: float       # Confidence score
    timestamp: float        # Time of trigger

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class SpeakParams:
    text: str               # Text to be spoken
    emotion: str = "neutral" # e.g. "neutral", "helpful", "empathetic", "serious"
    speed: float = 1.0      # Speed multiplier
    session_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class StatusResult:
    state: str              # "idle" | "listening" | "thinking" | "speaking"
    session_id: Optional[str]
    clients: int
    uptime_seconds: float
    methods: list[str]
`;

const TTS_CODE = `"""
larvox/core/tts.py

Text-to-Speech integration using Coqui XTTS v2.
Supports adaptive emotion and tone manipulation based on the SpeakParams.
"""

import logging
import torch
import sounddevice as sd
import numpy as np
from typing import Optional
from TTS.api import TTS
from .protocol import SpeakParams

log = logging.getLogger("larvox.core.tts")

# Maps emotion strings to reference audio voices (XTTS requires audio samples for voice cloning)
EMOTION_REFERENCES = {
    "neutral": "assets/voices/neutral_ref.wav",
    "helpful": "assets/voices/helpful_ref.wav",
    "empathetic": "assets/voices/empathetic_ref.wav",
    "serious": "assets/voices/serious_ref.wav",
    "excited": "assets/voices/excited_ref.wav",
    "urgent": "assets/voices/urgent_ref.wav"
}

class CoquiTTSWrapper:
    def __init__(self, model_name: str = "tts_models/multilingual/multi-dataset/xtts_v2"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        log.info(f"Loading Coqui TTS model {model_name} on {self.device}")
        self.tts = TTS(model_name).to(self.device)
        self.sample_rate = 24000
        
    def speak(self, params: SpeakParams) -> None:
        """
        Generate audio from text, adapt tone based on params.emotion.
        """
        log.debug(f"Speaking: '{params.text}' [emotion: {params.emotion}, speed: {params.speed}]")
        
        speaker_wav = EMOTION_REFERENCES.get(params.emotion, EMOTION_REFERENCES["neutral"])
        
        # XTTS generates list/arrays natively
        audio_data = self.tts.tts(
            text=params.text,
            speaker_wav=speaker_wav,
            language="en",
            speed=params.speed
        )
        
        # Play the generated audio using sounddevice
        log.debug("Playing audio buffer...")
        
        # Scale amplitude or apply filters here if needed
        audio_np = np.array(audio_data, dtype=np.float32)
        
        # Blocking play (we run this in a thread or executor if needed)
        sd.play(audio_np, samplerate=self.sample_rate)
        sd.wait()
        
        log.debug("Audio playback complete.")
`;

const STT_CODE = `"""
larvox/core/stt.py

Speech-to-Text integration using faster-whisper.
Includes robust error handling, detection of recognition failures,
and timeout handling with user feedback (TTS) on failure.
"""

import logging
import asyncio
import numpy as np
from faster_whisper import WhisperModel
from concurrent.futures import ThreadPoolExecutor
from .protocol import ErrorCode, RpcError

log = logging.getLogger("larvox.core.stt")

class STTError(Exception):
    def __init__(self, message: str, should_speak: bool = True):
        super().__init__(message)
        self.should_speak = should_speak

class FasterWhisperSTT:
    def __init__(self, model_size: str = "medium.en", compute_type: str = "float16"):
        self.executor = ThreadPoolExecutor(max_workers=1)
        try:
            log.info(f"Loading faster-whisper model '{model_size}'...")
            self.model = WhisperModel(model_size, device="cuda", compute_type=compute_type)
        except Exception as e:
            log.error(f"Failed to load STT model: {e}")
            raise STTError("Speech recognition system failed to initialize.", should_speak=False)

    async def transcribe(self, audio_data: np.ndarray, timeout: float = 10.0) -> str:
        """
        Transcribe incoming audio buffer.
        Raises STTError with user-friendly messages on failure or timeout.
        """
        if len(audio_data) < 16000 * 0.5:
             raise STTError("I didn't quite catch that. Audio was too short.")

        log.debug(f"Transcribing {len(audio_data)} samples...")
        
        try:
            # Run the blocking transcription in a thread pool and apply timeout
            loop = asyncio.get_running_loop()
            
            # Using asyncio.wait_for to enforce the maximum processing time
            segments_iter, info = await asyncio.wait_for(
                loop.run_in_executor(self.executor, self.model.transcribe, audio_data, "en"),
                timeout=timeout
            )
            
            transcript_parts = []
            for segment in segments_iter:
                transcript_parts.append(segment.text)
                
            final_text = " ".join(transcript_parts).strip()
            
            if not final_text:
                raise STTError("I can hear you, but the audio was unclear. Could you repeat that?")
                
            log.debug(f"Transcription result: {final_text}")
            return final_text
            
        except asyncio.TimeoutError:
            log.error(f"Transcription timed out after {timeout} seconds.")
            raise STTError("Sorry, speech recognition timed out.")
        except STTError:
            raise
        except Exception as e:
            log.exception("Unexpected error during STT transcription.")
            raise STTError(f"I encountered an internal error with speech recognition: {str(e)}")
`;

const PROACTIVE_CODE = `"""
larvox/core/proactive.py

Proactive Event Monitor daemon thread.
Monitors hardware telemetry (psutil), active window contexts, and idle times.
Triggers unsolicited voice prompts via the orchestrator when thresholds are met.
"""

import logging
import asyncio
import psutil
import time
import subprocess
from typing import Callable, Awaitable
from .protocol import Method

log = logging.getLogger("larvox.core.proactive")


class ProactiveMonitor:
    def __init__(self, tts_callback: Callable[[str, str], Awaitable[None]]):
        self.tts_callback = tts_callback
        self.running = False
        self.check_interval = 30.0  # Check every 30 seconds
        
        # Thresholds
        self.cpu_threshold = 90.0
        self.mem_threshold = 85.0
        self.idle_threshold_seconds = 60 * 60  # 1 hour
        
        # State tracking
        self.last_cpu_warning = 0
        self.last_mem_warning = 0
        self.last_idle_warning = 0
        self.warning_cooldown = 300  # Only warn every 5 mins

    async def start(self):
        log.info("Starting proactive system monitor...")
        self.running = True
        asyncio.create_task(self._monitor_loop())

    def stop(self):
        log.info("Stopping proactive system monitor...")
        self.running = False

    async def _monitor_loop(self):
        while self.running:
            await self._check_telemetry()
            await self._check_idle_time()
            await asyncio.sleep(self.check_interval)

    async def _check_telemetry(self):
        now = time.time()
        
        # CPU Check
        cpu_percent = psutil.cpu_percent(interval=1)
        if cpu_percent > self.cpu_threshold and (now - self.last_cpu_warning > self.warning_cooldown):
            log.warning(f"High CPU usage detected: {cpu_percent}%")
            self.last_cpu_warning = now
            # Find the top process
            procs = sorted(psutil.process_iter(['pid', 'name', 'cpu_percent']), key=lambda p: p.info['cpu_percent'] or 0, reverse=True)
            top_process = procs[0].info['name'] if procs else "a background task"
            await self.tts_callback(f"My sensors indicate your CPU is running very hot at {int(cpu_percent)} percent, mostly due to {top_process}. Would you like me to kill it or investigate further?", "urgent")

        # Memory Check
        mem = psutil.virtual_memory()
        if mem.percent > self.mem_threshold and (now - self.last_mem_warning > self.warning_cooldown):
            log.warning(f"High RAM usage detected: {mem.percent}%")
            self.last_mem_warning = now
            await self.tts_callback(f"Memory usage is critical at {int(mem.percent)} percent. I can try freeing up some RAM or show you the top consumers if you'd like.", "empathetic")

    def _get_system_idle_seconds(self) -> float:
        try:
            # Assuming xprintidle is installed on X11
            result = subprocess.run(['xprintidle'], capture_output=True, text=True, timeout=1)
            if result.returncode == 0:
                idle_ms = int(result.stdout.strip())
                return idle_ms / 1000.0
        except Exception as e:
            log.debug(f"Failed to get idle time via xprintidle: {e}")
        return 0.0

    def _get_active_window_class(self) -> str:
        try:
            # Find the active window ID
            root_id_proc = subprocess.run(
                ["xprop", "-root", "_NET_ACTIVE_WINDOW"],
                capture_output=True, text=True, timeout=1
            )
            if root_id_proc.returncode == 0:
                root_id = root_id_proc.stdout.split()[-1]
                if root_id != "0x0" and root_id.startswith("0x"):
                    # Get the window class name
                    wm_class_output = subprocess.run(
                        ["xprop", "-id", root_id, "WM_CLASS"],
                        capture_output=True, text=True, timeout=1
                    ).stdout
                    if "WM_CLASS" in wm_class_output:
                        # Output format: WM_CLASS(STRING) = "name", "class"
                        parts = wm_class_output.split('"')
                        if len(parts) >= 4:
                            return parts[3].lower()
        except Exception as e:
            log.debug(f"Failed to get active window class: {e}")
        return ""

    async def _check_idle_time(self):
        now = time.time()
        system_idle_sec = self._get_system_idle_seconds()
        active_window_class = self._get_active_window_class()

        # Check if they are in a known coding environment
        if active_window_class in ["code", "jetbrains-pycharm", "gnome-terminal", "alacritty", "kitty"]:
             # If they've been sitting on this window without input for a long time
             if system_idle_sec > self.idle_threshold_seconds and (now - self.last_idle_warning > self.warning_cooldown):
                self.last_idle_warning = now
                log.info(f"User idle for {system_idle_sec}s in {active_window_class}. Suggesting assistance.")
                await self.tts_callback("You seem to have been stuck on this code for a while. Want me to review the recent error logs or suggest an approach?", "empathetic")
`;

const REMOTE_CODE = `"""
larvox/api/remote.py

FastAPI application providing WebSockets for real-time collaboration.
Allows multiple remote dashboards to connect, view HUD telemetry, and 
interact with the LARVOX daemon instance securely.
"""

import asyncio
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from typing import List

log = logging.getLogger("larvox.api.remote")
app = FastAPI(title="LARVOX Remote API")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        log.info(f"Client connected. Total active: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        log.info("Client disconnected.")

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                log.error(f"Failed to send message to client: {e}")

manager = ConnectionManager()

def verify_token(token: str = Depends(oauth2_scheme)):
    # Placeholder for actual JWT verification
    if token != "supersecrettoken": # Use a proper config secret
        raise HTTPException(status_code=401, detail="Invalid auth token")
    return token

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket, token: str = Depends(verify_token)):
    await manager.connect(websocket)
    try:
        while True:
            # Wait for any control messages from remote
            data = await websocket.receive_json()
            log.debug(f"Received remote command: {data}")
            # Forward data to the daemon IPC here
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Background task to pump IPC events to WebSockets
async def pump_events_to_remote(daemon_client):
    """
    Subscribes to daemon events and broadcasts them to all connected remote clients.
    """
    async for event in daemon_client.listen_events():
        await manager.broadcast({
            "type": "event",
            "event": event.name,
            "data": event.payload
        })
`;

const OCR_CODE = `"""
larvox/skills/screen_reader.py

Implements screen reading functionality via Optical Character Recognition (OCR).
Allows capturing a region of the screen or the entire screen and reading the
extracted text aloud using the TTS system. Uses Tesseract OCR and Pillow/maim.
"""

import logging
import subprocess
from PIL import Image
import pytesseract
import tempfile
import os

log = logging.getLogger("larvox.skills.screen_reader")

class ScreenReaderSkill:
    def __init__(self, tts_callback):
        self.tts_callback = tts_callback

    async def read_screen_area(self):
        """
        Allows the user to select an area of the screen and reads the text aloud.
        Uses maim (or grim on Wayland) for selection and pytesseract for OCR.
        """
        try:
            # Use 'maim -s' to let the user select a region
            with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp_file:
                tmp_path = tmp_file.name

            log.info("Prompting user to select screen area...")
            await self.tts_callback("Please select the area you want me to read.", "neutral")
            
            # maim -s allows interactive selection
            result = subprocess.run(["maim", "-s", tmp_path], capture_output=True)
            if result.returncode != 0:
                log.warning("Screen selection cancelled or failed.")
                return

            text = self._extract_text(tmp_path)
            
            if text.strip():
                log.info(f"Extracted text: {text}")
                await self.tts_callback(f"Here is what I see: {text}", "neutral")
            else:
                await self.tts_callback("I couldn't detect any text in that area.", "empathetic")
                
        except Exception as e:
            log.error(f"Failed to read screen area: {e}")
            await self.tts_callback("I encountered an error trying to read the screen.", "urgent")
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    async def read_full_screen(self):
        """
        Captures the entire screen and reads the text aloud.
        """
        try:
            with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp_file:
                tmp_path = tmp_file.name

            log.info("Capturing full screen...")
            # maim captures the full screen
            subprocess.run(["maim", tmp_path], check=True)

            text = self._extract_text(tmp_path)
            
            if text.strip():
                log.info(f"Extracted text: {text[:100]}...") # Log just beginning
                await self.tts_callback("Reading the screen. " + text, "neutral")
            else:
                await self.tts_callback("I couldn't detect any text on the screen.", "empathetic")
                
        except Exception as e:
            log.error(f"Failed to capture full screen: {e}")
            await self.tts_callback("I encountered an error trying to capture the screen.", "urgent")
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    def _extract_text(self, image_path: str) -> str:
        """Helper to run OCR on an image file."""
        img = Image.open(image_path)
        # Using pytesseract for OCR
        text = pytesseract.image_to_string(img)
        # Clean up text (remove excessive newlines etc)
        text = " ".join(text.split())
        return text

class TTSSettingsSkill:
    def __init__(self, tts_callback, config):
        self.tts_callback = tts_callback
        self.config = config

    async def change_emotion(self, request):
        """
        Changes the default voice emotion for TTS based on user command.
        """
        emotion = request.get("emotion")
        if emotion in ["neutral", "helpful", "empathetic", "serious", "excited", "urgent"]:
            self.config.set("tts_default_emotion", emotion)
            await self.tts_callback(f"I will now speak with a {emotion} tone.", emotion)
        else:
            await self.tts_callback(f"I don't support the emotion {emotion}.", "empathetic")

    async def change_speed(self, request):
        """
        Changes the default voice speed for TTS based on user command.
        """
        try:
            speed = float(request.get("speed"))
            if 0.5 <= speed <= 2.0:
                self.config.set("tts_default_speed", speed)
                await self.tts_callback(f"Speaking speed set to {speed}.", "neutral")
            else:
                await self.tts_callback("Please provide a speed between 0.5 and 2.0.", "empathetic")
        except ValueError:
            await self.tts_callback("I didn't understand the speed value.", "urgent")
`;

const SYSTEMD_CODE = `[Unit]
Description=LARVOX Contextual Voice Assistant Daemon
After=network.target sound.target

[Service]
Type=simple
WorkingDirectory=%h/larvox
ExecStart=%h/larvox/.venv/bin/python -m larvox_core.daemon
Restart=on-failure
RestartSec=5
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=default.target
`;

const SYSTEM_CODE = `"""
larvox/skills/system.py

Implements system administration skills running under elevated privileges
via pkexec. This includes package management and system services control.
"""

import logging
import asyncio
from larvox_core.skills import LarvoxSkill, intent

log = logging.getLogger("larvox.skills.system")

class SystemUpdateSkill(LarvoxSkill):
    @intent(r'(update|upgrade)\\s+(the\\s+)?system|update\\s+packages')
    async def update_system(self, request):
        """
        Updates the APT package cache and upgrades all packages.
        Provides voice feedback during the process and upon completion.
        """
        await self.speak("Initiating system update. This may take a moment depending on your network.", tone="technical")
        
        # Execute the update command with pkexec to elevate privileges securely.
        # It's assumed the environment allows pkexec for apt without interactive prompt
        # if configured properly in Desktop.
        process = await asyncio.create_subprocess_shell(
            "pkexec sh -c 'apt update && apt upgrade -y'",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        
        if process.returncode == 0:
            log.info("System update completed successfully.")
            return await self.speak("The system packages have been successfully updated.", tone="success")
        else:
            error_details = stderr.decode('utf-8').strip()
            log.error(f"System update failed: {error_details}")
            return await self.speak("There was an error updating the system packages. Please check the logs.", tone="urgent")
`;

const TREE_CODE = `larvox/
├── .github/workflows/
│   └── ci.yml
├── docs/
│   └── SKILLS.md
├── larvox_core/
│   ├── __init__.py
│   ├── daemon.py         # Main entry point & IPC Unix Socket server
│   ├── protocol.py       # JSON-RPC spec & validation
│   ├── models.py         # Pydantic schemas for data
│   ├── config.py         # TOML parser & settings loader
│   ├── stt.py            # faster-whisper integration
│   ├── nlu.py            # Intent router & local LLM integration
│   └── audio.py          # PyAudio stream & OpenWakeWord management
├── larvox_api/
│   ├── Makefile
│   ├── main.py           # FastAPI WebSockets Server
│   └── routers/          # API endpoints for remote frontend
├── larvox_skills/
│   ├── __init__.py
│   ├── core.py           # Base LarvoxSkill class & decorators
│   ├── system.py         # God-mode bash/pkexec execution skills
│   ├── RAG.py            # ChromaDB local embeddings search skill
│   ├── docker.py         # DevOps container orchestration skill
│   ├── vision.py         # pytesseract & OCR bounding box skills
│   └── web.py            # SerpAPI & web scraping research skills
├── larvox_hud/
│   ├── __init__.py
│   ├── main.py           # GTK4 Overlay Entry point
│   ├── widgets.py        # Layer-shell Biological UI components
│   └── ipc_client.py     # Connects to /tmp/larvox-ipc to receive state
├── debian/               # Rules and controls for APT deb generation
│   ├── control
│   ├── rules
│   ├── larvox.service    # Systemd daemon boot script
│   └── postinst          # Pre-compile hook and user generation
├── tests/
├── requirements.txt
├── setup.py              # Packaging for pip/PyInstaller
└── README.md
`;

export function Code() {
  const [activeTab, setActiveTab] = useState<"tree" | "daemon" | "client" | "protocol" | "tts" | "stt" | "proactive" | "remote" | "systemd" | "ocr" | "system">("tree");

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-[calc(100vh-120px)]">
      <div>
        <h2 className="text-lg font-bold tracking-tight mb-1 text-white uppercase">Python Implementation</h2>
        <p className="text-[11px] text-zinc-500 uppercase tracking-widest">The foundation for the LARVOX UNIX socket IPC layer.</p>
      </div>

      <div className="flex gap-2 w-full overflow-x-auto pb-1 hide-scrollbar">
        <button 
          onClick={() => setActiveTab("tree")}
          className={cn("whitespace-nowrap px-4 py-2 rounded-t transition-colors text-[11px] uppercase tracking-widest font-bold", activeTab === "tree" ? "bg-zinc-900 border-t border-l border-r border-zinc-800 text-lime-400" : "bg-panel-bg text-zinc-500 hover:text-white")}
        >
          repo_tree
        </button>
        <button 
          onClick={() => setActiveTab("daemon")}
          className={cn("whitespace-nowrap px-4 py-2 rounded-t transition-colors text-[11px] uppercase tracking-widest font-bold", activeTab === "daemon" ? "bg-zinc-900 border-t border-l border-r border-zinc-800 text-lime-400" : "bg-panel-bg text-zinc-500 hover:text-white")}
        >
          server.py
        </button>
        <button 
          onClick={() => setActiveTab("client")}
          className={cn("whitespace-nowrap px-4 py-2 rounded-t transition-colors text-[11px] uppercase tracking-widest font-bold", activeTab === "client" ? "bg-zinc-900 border-t border-l border-r border-zinc-800 text-lime-400" : "bg-panel-bg text-zinc-500 hover:text-white")}
        >
          client.py
        </button>
        <button 
          onClick={() => setActiveTab("protocol")}
          className={cn("whitespace-nowrap px-4 py-2 rounded-t transition-colors text-[11px] uppercase tracking-widest font-bold", activeTab === "protocol" ? "bg-zinc-900 border-t border-l border-r border-zinc-800 text-lime-400" : "bg-panel-bg text-zinc-500 hover:text-white")}
        >
          protocol.py
        </button>
        <button 
          onClick={() => setActiveTab("stt")}
          className={cn("whitespace-nowrap px-4 py-2 rounded-t transition-colors text-[11px] uppercase tracking-widest font-bold", activeTab === "stt" ? "bg-zinc-900 border-t border-l border-r border-zinc-800 text-lime-400" : "bg-panel-bg text-zinc-500 hover:text-white")}
        >
          stt.py
        </button>
        <button 
          onClick={() => setActiveTab("tts")}
          className={cn("whitespace-nowrap px-4 py-2 rounded-t transition-colors text-[11px] uppercase tracking-widest font-bold", activeTab === "tts" ? "bg-zinc-900 border-t border-l border-r border-zinc-800 text-lime-400" : "bg-panel-bg text-zinc-500 hover:text-white")}
        >
          tts.py
        </button>
        <button 
          onClick={() => setActiveTab("proactive")}
          className={cn("whitespace-nowrap px-4 py-2 rounded-t transition-colors text-[11px] uppercase tracking-widest font-bold", activeTab === "proactive" ? "bg-zinc-900 border-t border-l border-r border-zinc-800 text-lime-400" : "bg-panel-bg text-zinc-500 hover:text-white")}
        >
          proactive.py
        </button>
        <button 
          onClick={() => setActiveTab("remote")}
          className={cn("whitespace-nowrap px-4 py-2 rounded-t transition-colors text-[11px] uppercase tracking-widest font-bold", activeTab === "remote" ? "bg-zinc-900 border-t border-l border-r border-zinc-800 text-lime-400" : "bg-panel-bg text-zinc-500 hover:text-white")}
        >
          remote.py
        </button>
        <button 
          onClick={() => setActiveTab("system")}
          className={cn("whitespace-nowrap px-4 py-2 rounded-t transition-colors text-[11px] uppercase tracking-widest font-bold", activeTab === "system" ? "bg-zinc-900 border-t border-l border-r border-zinc-800 text-lime-400" : "bg-panel-bg text-zinc-500 hover:text-white")}
        >
          system.py
        </button>
        <button 
          onClick={() => setActiveTab("systemd")}
          className={cn("whitespace-nowrap px-4 py-2 rounded-t transition-colors text-[11px] uppercase tracking-widest font-bold", activeTab === "systemd" ? "bg-zinc-900 border-t border-l border-r border-zinc-800 text-lime-400" : "bg-panel-bg text-zinc-500 hover:text-white")}
        >
          larvox.service
        </button>
        <button 
          onClick={() => setActiveTab("ocr")}
          className={cn("whitespace-nowrap px-4 py-2 rounded-t transition-colors text-[11px] uppercase tracking-widest font-bold", activeTab === "ocr" ? "bg-zinc-900 border-t border-l border-r border-zinc-800 text-lime-400" : "bg-panel-bg text-zinc-500 hover:text-white")}
        >
          screen_reader.py
        </button>
      </div>

      <Card className="flex-1 overflow-hidden p-0 rounded-tl-none flex flex-col border-zinc-800 bg-zinc-900">
        <div className="p-4 flex-1 overflow-auto">
          <pre className="text-[12px] font-mono text-zinc-300 leading-relaxed">
            {activeTab === "tree" ? TREE_CODE : activeTab === "daemon" ? DAEMON_CODE : activeTab === "client" ? CLIENT_CODE : activeTab === "protocol" ? PROTOCOL_CODE : activeTab === "stt" ? STT_CODE : activeTab === "tts" ? TTS_CODE : activeTab === "proactive" ? PROACTIVE_CODE : activeTab === "remote" ? REMOTE_CODE : activeTab === "systemd" ? SYSTEMD_CODE : activeTab === "system" ? SYSTEM_CODE : OCR_CODE}
          </pre>
        </div>
      </Card>
      
      <div className="flex justify-end">
         <Tag variant="success">Code ready for phase 1</Tag>
      </div>
    </div>
  );
}
