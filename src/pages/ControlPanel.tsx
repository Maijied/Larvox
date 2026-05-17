import { Card } from "../components/ui";
import { Settings, Sliders, Server, HardDrive, Shield } from "lucide-react";

export function ControlPanel() {
  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-lg font-bold tracking-tight mb-1 text-white uppercase">Control Panel</h2>
        <p className="text-[11px] text-zinc-500 uppercase tracking-widest">Master Configuration for LARVOX</p>
      </div>

      <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Settings className="w-32 h-32 text-cyan-400" />
        </div>
        <h3 className="text-xl font-bold text-cyan-400 mb-2 relative z-10 text-shadow-sm shadow-cyan-500/20">System-Wide Tuning</h3>
        <p className="text-zinc-300 text-[13px] leading-relaxed max-w-2xl relative z-10">
          Adjust the fundamental behavior of LARVOX. Here, users can modify memory limits, control how aggressive proactive background monitoring is, and specify global permissions for file access and package management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
            <Sliders className="w-4 h-4 text-lime-400" />
            <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest">Behavior Tuning</h4>
          </div>
          <p className="text-[12px] text-zinc-400 leading-relaxed min-h-[60px]">
            Adjust the response speed vs. accuracy trade-off. Modify the prompt structure limits and tweak proactive threshold sensitivity.
          </p>
          <div className="space-y-3">
             <div className="flex justify-between items-center bg-zinc-900/50 p-2 border border-zinc-800 rounded">
                <span className="text-[11px] font-mono text-zinc-400">PROACTIVE_LEVEL</span>
                <span className="text-[11px] font-mono text-lime-400 bg-lime-900/30 px-2 rounded">AGGRESSIVE</span>
             </div>
             <div className="flex justify-between items-center bg-zinc-900/50 p-2 border border-zinc-800 rounded">
                <span className="text-[11px] font-mono text-zinc-400">RESPONSE_VERBOSITY</span>
                <span className="text-[11px] font-mono text-lime-400 bg-lime-900/30 px-2 rounded">CONCISE</span>
             </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest">Permissions & Security</h4>
          </div>
          <p className="text-[12px] text-zinc-400 leading-relaxed min-h-[60px]">
            Define the god-mode boundaries. Limit which system directories LARVOX can traverse and set require-confirmation for dangerous commands.
          </p>
          <div className="space-y-3">
             <div className="flex justify-between items-center bg-zinc-900/50 p-2 border border-zinc-800 rounded">
                <span className="text-[11px] font-mono text-zinc-400">REQUIRE_SUDO_CONFIRM</span>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-900/30 px-2 rounded">TRUE</span>
             </div>
             <div className="flex justify-between items-center bg-zinc-900/50 p-2 border border-zinc-800 rounded">
                <span className="text-[11px] font-mono text-zinc-400">ALLOWED_PATHS</span>
                <span className="text-[11px] font-mono text-zinc-300 bg-zinc-800 px-2 rounded">/home, /etc/NetworkManager</span>
             </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
            <HardDrive className="w-4 h-4 text-fuchsia-400" />
            <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest">Model Storage</h4>
          </div>
          <p className="text-[12px] text-zinc-400 leading-relaxed min-h-[60px]">
            Manage downloaded STT and TTS models. Switch between smaller models for speed or larger models for accuracy, and monitor disk usage.
          </p>
          <div className="space-y-2 mt-4">
             <div className="flex justify-between items-center group cursor-pointer hover:bg-zinc-900/50 p-1.5 rounded transition">
                <span className="text-[11px] text-zinc-400">faster-whisper-small.en</span>
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded group-hover:text-fuchsia-400 transition">300MB</span>
             </div>
             <div className="flex justify-between items-center group cursor-pointer hover:bg-zinc-900/50 p-1.5 rounded transition">
                <span className="text-[11px] text-zinc-400">coqui-tts-v2</span>
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded group-hover:text-fuchsia-400 transition">1.2GB</span>
             </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
            <Server className="w-4 h-4 text-blue-400" />
            <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest">Daemon Status</h4>
          </div>
          <p className="text-[12px] text-zinc-400 leading-relaxed min-h-[60px]">
            View the underlying daemon health, current resource usage (RAM/CPU), and debug logs for the IPC sockets.
          </p>
          <div className="bg-black border border-zinc-800 rounded p-3 h-24 overflow-hidden relative">
            <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-black to-transparent"></div>
            <pre className="text-[9px] text-green-400 font-mono leading-relaxed opacity-80">
              [INFO] daemon ok - mem: 48MB cpu: 2%
              {"\n"}[DEBUG] socket connected /tmp/larvox-ipc
              {"\n"}[TRACE] routing voice chunk id=4593
              {"\n"}[INFO] proactive thread spawned
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}
