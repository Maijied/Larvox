import { Card } from "../components/ui";
import { Mic, Waves, Ear, Languages, MessageSquare, Route, BrainCircuit, Server, Database, Volume2, AppWindow, Settings, Terminal, Box, Search, MousePointerClick, Activity } from "lucide-react";

export function TechStack() {
  const sections = [
    {
      title: "Audio layer",
      items: [
        { icon: Mic, name: "sounddevice (>=0.4.6)", desc: "Low-latency audio capture. Preferred over PyAudio for fewer system deps.", tags: ["pip install", "16kHz"] },
        { icon: Waves, name: "webrtcvad (>=2.0.10)", desc: "Voice activity detection — only processes speech, ignores silence & noise.", tags: ["webrtcvad", "offline"] },
        { icon: Ear, name: "openwakeword (>=0.5.1)", desc: "MIT-licensed wake word engine. Custom \"Hey Larva\" model via transfer learning.", tags: ["MIT", "trainable", "multi-model"] }
      ]
    },
    {
      title: "Speech understanding (STT & NLU)",
      items: [
        { icon: Languages, name: "faster-whisper (>=1.0.0)", desc: "CTranslate2-optimized Whisper. 4× faster, runs on CPU.", tags: ["offline", "multilingual"] },
        { icon: MessageSquare, name: "vosk (>=0.3.45)", desc: "Fallback STT for very low-resource machines. Tiny 40MB model.", tags: ["fallback", "tiny model"] },
        { icon: Route, name: "Custom NLU (scikit-learn)", desc: "Lightweight zero-shot intent classifier routing directly to skills without LLM.", tags: ["fast", "offline"] }
      ]
    },
    {
      title: "AI & Orchestration Brain",
      items: [
        { icon: BrainCircuit, name: "anthropic (>=0.20.0)", desc: "Primary API for complex queries, code help, and open conversation (Claude 3 Haiku).", tags: ["cloud", "opt-in"], isCloud: true },
        { icon: Server, name: "llama-cpp-python (>=0.2.56)", desc: "Offline LLM fallback. Runs Llama 3 / Mistral 7B quantized on CPU.", tags: ["offline", "Q4_K_M"] },
        { icon: Database, name: "SQLite & SQLAlchemy", desc: "Conversation history, entities, and user preferences persisted in SQLite. Zero-setup.", tags: ["local", "SQLAlchemy"] },
        { icon: Database, name: "ChromaDB (>=0.4)", desc: "Local vector database for RAG, document indexing, and semantic desktop search.", tags: ["local", "vector", "rag"] },
        { icon: Search, name: "Web Search APIs", desc: "SerpAPI or DuckDuckGo integration for real-time data retrieval and deep topic synthesis.", tags: ["search", "real-time"] }
      ]
    },
    {
      title: "Voice output & UI",
      items: [
        { icon: Volume2, name: "coqui-tts (>=0.22.0)", desc: "Neural TTS, open source. XTTS v2 with adaptive emotional tone styling.", tags: ["offline", "MIT"] },
        { icon: AppWindow, name: "PyGObject (GTK4)", desc: "Transparent overlay window. Lorapok biological UI style using Wayland Layer Shell.", tags: ["PyGObject", "Wayland"] },
        { icon: Settings, name: "tomllib", desc: "Python 3.11 built-in. Zero-schema defaults. User configs in ~/.config/larvox/.", tags: ["built-in", "zero-config"] }
      ]
    },
    {
      title: "Remote Collaboration & APIs",
      items: [
        { icon: Route, name: "FastAPI (>=0.100)", desc: "High-performance async API framework. Powers external remote control and REST endpoints.", tags: ["api", "asyncio"] },
        { icon: Route, name: "WebSockets", desc: "Real-time bidirectional streams. Broadcasts telemetry, HUD events, and active logs to remote web dashboards.", tags: ["real-time", "telemetry"] },
        { icon: Route, name: "OAuth2 / JWT", desc: "Secures remote access via FastAPI. Prevents unauthorized execution of God-Mode commands.", tags: ["security", "auth"] }
      ]
    },
    {
      title: "Deep OS Integration & IPC",
      items: [
        { icon: Terminal, name: "subprocess", desc: "App launching, git, test runners, terminal commands.", tags: ["shell", "automation"] },
        { icon: MousePointerClick, name: "ydotool", desc: "Wayland-compatible keyboard/mouse simulation (xdotool fallback on X11).", tags: ["gui-automation"] },
        { icon: Volume2, name: "pactl / amixer", desc: "PulseAudio / ALSA volume, input/output control.", tags: ["audio", "volume"] },
        { icon: Box, name: "python-dbus", desc: "GNOME/KDE system control — notifications, media, power.", tags: ["dbus"] },
        { icon: Box, name: "snap / .deb", desc: "Distribution packaging. Snap for confinement, .deb for power users.", tags: ["packaging", "linux"] },
        { icon: Search, name: "systemd", desc: "LARVOX runs as a background user systemd service. Auto-starts on login.", tags: ["daemon"] }
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-lg font-bold tracking-tight mb-1 text-white uppercase">Tech Stack</h2>
        <p className="text-[11px] text-zinc-500 uppercase tracking-widest">Libraries, dependencies, and integration architecture.</p>
      </div>

      {sections.map((section, idx) => (
        <div key={idx} className="space-y-4">
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">{section.title}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {section.items.map((item, idj) => (
              <div key={idj} className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800 flex flex-col hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className={`w-4 h-4 ${item.isCloud ? "text-lime-400" : "text-zinc-400"}`} />
                  <span className="text-[13px] font-bold text-zinc-200">{item.name}</span>
                </div>
                <p className="text-[12px] text-zinc-500 leading-relaxed flex-1 mb-4">{item.desc}</p>
                <div className="flex gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-800 rounded">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
