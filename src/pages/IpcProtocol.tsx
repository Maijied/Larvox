import { Card, Tag } from "../components/ui";

export function IpcProtocol() {
  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-lg font-bold tracking-tight mb-1 text-white uppercase">JSON-RPC Protocol Design</h2>
        <p className="text-[11px] text-zinc-500 uppercase tracking-widest">Schema for communication over <code className="text-lime-400 bg-lime-400/10 px-1 py-0.5 rounded">/tmp/larvox-ipc.sock</code></p>
      </div>

      <Card>
        <h3 className="text-[14px] font-bold text-zinc-300 uppercase tracking-widest mb-4">Why JSON-RPC 2.0?</h3>
        <p className="text-zinc-500 text-[11px] mb-4">
          JSON-RPC provides a standardized, lightweight format for both requests (which need responses) and notifications (which don't). Over a Unix Domain Socket, it's incredibly fast and easy to debug using standard tools like <code className="text-zinc-300">socat</code> or <code className="text-zinc-300">nc</code>.
        </p>
      </Card>

      <h3 className="text-[11px] font-bold text-lime-400 uppercase tracking-widest mt-8 border-b border-zinc-800 pb-2">Core Payloads</h3>

      <div className="space-y-6">
        
        <div>
          <h4 className="text-zinc-300 font-medium text-sm mb-3">1. Client Request to Daemon (Method Call)</h4>
          <Card className="p-0 overflow-hidden">
            <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 font-mono uppercase">Example: Trigger a skill</span>
              <Tag variant="default">Request</Tag>
            </div>
            <pre className="p-4 text-[12px] font-mono text-zinc-300 overflow-x-auto">
{`{
  "jsonrpc": "2.0",
  "method": "execute_intent",
  "params": {
    "intent": "system_volume_up",
    "entities": {"amount": 10},
    "context": {"client": "larvox-cli"}
  },
  "id": 1
}`}
            </pre>
          </Card>
        </div>

        <div>
          <h4 className="text-zinc-300 font-medium text-sm mb-3">2. Daemon Response (Success)</h4>
          <Card className="p-0 overflow-hidden">
            <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 font-mono uppercase">Example: Skill executed</span>
              <Tag variant="success">Response</Tag>
            </div>
            <pre className="p-4 text-[12px] font-mono text-zinc-300 overflow-x-auto">
{`{
  "jsonrpc": "2.0",
  "result": {
    "status": "success",
    "action": "speak",
    "text": "Volume increased by 10 percent.",
    "execution_time_ms": 42
  },
  "id": 1
}`}
            </pre>
          </Card>
        </div>

        <div>
          <h4 className="text-zinc-300 font-medium text-sm mb-3">3. Daemon Notification (Event Broadcast)</h4>
          <Card className="p-0 overflow-hidden">
            <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 font-mono uppercase">Example: Wakeword detected</span>
              <Tag variant="warning">Notification</Tag>
            </div>
            <pre className="p-4 text-[12px] font-mono text-zinc-300 overflow-x-auto">
{`{
  "jsonrpc": "2.0",
  "method": "event.wakeword_detected",
  "params": {
    "engine": "openwakeword",
    "confidence": 0.98,
    "timestamp": 1715923942.123
  }
}`}
            </pre>
          </Card>
        </div>

      </div>

      <Card className="mt-8">
        <h3 className="text-[14px] font-bold text-zinc-300 uppercase mb-2">Supported RPC Methods</h3>
        <ul className="space-y-2 text-[12px] text-zinc-500">
          <li><code className="text-lime-400 bg-lime-400/5 px-1 rounded">ping</code> - Health check</li>
          <li><code className="text-lime-400 bg-lime-400/5 px-1 rounded">get_status</code> - Returns current daemon state</li>
          <li><code className="text-lime-400 bg-lime-400/5 px-1 rounded">execute_intent</code> - Force-trigger a specific intent bypassing STT</li>
          <li><code className="text-lime-400 bg-lime-400/5 px-1 rounded">process_text</code> - Send text as if it was spoken to trigger the NLU pipeline</li>
          <li><code className="text-lime-400 bg-lime-400/5 px-1 rounded">subscribe_events</code> - Request the daemon to send notifications for specific event types</li>
        </ul>
      </Card>

    </div>
  );
}
