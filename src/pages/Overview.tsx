import { Card } from "../components/ui";
import { Zap, Cpu, Puzzle, Shield, Bug, RefreshCw, TerminalSquare } from "lucide-react";

export function Overview() {
  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-lg font-bold tracking-tight mb-1 text-white uppercase">Overview</h2>
        <p className="text-[11px] text-zinc-500 uppercase tracking-widest">Project identity and design pillars.</p>
      </div>

      <div className="bg-lime-900/20 border border-lime-500/30 rounded-xl p-6 mb-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-lime-400">Total System Omnipresence & Animated Companion</h3>
        <p className="text-zinc-300 text-[13px] leading-relaxed max-w-2xl mx-auto">
          When called, a <strong>next-gen futuristic floating assistant</strong> awakens in the bottom right corner of your display, communicating and acting like a human. LARVOX is an omnipresent, offline-first voice operating experience for Linux.
        </p>
        <p className="text-zinc-300 text-[13px] leading-relaxed max-w-2xl mx-auto">
          It grants you absolute, <strong>"god-mode" control</strong> over your PC—allowing it to access and modify the full system. It can update packages, tweak OS settings, turn on/off Wi-Fi or Bluetooth, route windows, and execute bash scripts directly by your command, exactly like a human controlling the computer.
        </p>
      </div>

      <div className="mb-12">
        <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <TerminalSquare className="w-5 h-5 text-lime-400" />
          God-Mode Capabilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
               <span className="text-lime-400 text-sm font-bold">1</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-200">OS Settings & Network Control</h4>
              <p className="text-[12px] text-zinc-400 mt-1 leading-relaxed">
                Toggle Wi-Fi, Bluetooth, change display brightness, adjust volume routing, connect to VPNs, and manage firewall rules as if a human was clicking through settings.
              </p>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
               <span className="text-lime-400 text-sm font-bold">2</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-200">Package & Update Management</h4>
              <p className="text-[12px] text-zinc-400 mt-1 leading-relaxed">
                "Update my system and clean up old dependencies." LARVOX uses polkit/pkexec to safely run APT/DNF updates and automatically resolves conflicts.
              </p>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
               <span className="text-lime-400 text-sm font-bold">3</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-200">System Monitoring & Auto-Healing</h4>
              <p className="text-[12px] text-zinc-400 mt-1 leading-relaxed">
                Identifies process bottlenecks when you complain about lag. Kills hung applications, clears zombie processes, and frees up RAM proactively without opening htop.
              </p>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
               <span className="text-lime-400 text-sm font-bold">4</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-200">Window & Workspace Routing</h4>
              <p className="text-[12px] text-zinc-400 mt-1 leading-relaxed">
                "Move my browser to the left monitor and start coding on the right." Uses Wayland/X11 APIs to shuffle your windows and set up your workspace instantly.
              </p>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
               <span className="text-lime-400 text-sm font-bold">5</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-200">File & Document Operations</h4>
              <p className="text-[12px] text-zinc-400 mt-1 leading-relaxed">
                "Find the PDF I downloaded yesterday and summarize it." Uses local semantic search to locate files, read their contents, and speak out summaries in a natural voice.
              </p>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
               <span className="text-lime-400 text-sm font-bold">6</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-200">Human-Like Error Handling</h4>
              <p className="text-[12px] text-zinc-400 mt-1 leading-relaxed">
                If a command fails, LARVOX doesn't just crash. It reads the stderr, reasons about why it failed, and asks you if it should try a different approach or fix the permissions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="space-y-4">
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Identity</p>
          <div className="space-y-3 text-sm">
            <div><span className="text-zinc-500 uppercase text-[10px] tracking-widest">Wake phrase</span><br/><strong className="text-zinc-200">"Hey Larva", "Hey Lorapok", or Custom</strong></div>
            <div><span className="text-zinc-500 uppercase text-[10px] tracking-widest">Platform</span><br/><span className="text-zinc-300">Ubuntu 22.04 LTS+</span></div>
            <div><span className="text-zinc-500 uppercase text-[10px] tracking-widest">Display</span><br/><span className="text-zinc-300">Wayland & X11</span></div>
            <div><span className="text-zinc-500 uppercase text-[10px] tracking-widest">License</span><br/><span className="text-zinc-300">MIT open source</span></div>
          </div>
        </Card>
        <Card className="space-y-4">
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Modes</p>
          <div className="space-y-3 text-sm">
            <div><span className="inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-lime-900/30 text-lime-400 mb-1 border border-lime-900/50">Always-on</span><br/><span className="text-zinc-400">Wake word listening</span></div>
            <div><span className="inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-teal-900/30 text-teal-400 mb-1 border border-teal-900/50">Push-to-talk</span><br/><span className="text-zinc-400">Hotkey activates mic</span></div>
            <div><span className="inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 mb-1 border border-zinc-700">CLI mode</span><br/><span className="text-zinc-400">Type commands in terminal</span></div>
            <div><span className="inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-blue-900/30 text-blue-400 mb-1 border border-blue-900/50">Daemon</span><br/><span className="text-zinc-400">Background systemd service</span></div>
          </div>
        </Card>
      </div>

      <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-8 border-b border-zinc-800 pb-2">Design Pillars</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-lime-400" /><span className="text-sm font-bold text-zinc-200">Zero-config</span></div>
          <p className="text-[12px] text-zinc-500 leading-relaxed">One install command. Sensible defaults. Works immediately on any Ubuntu system.</p>
        </div>
        <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-2 mb-2"><Cpu className="w-4 h-4 text-lime-400" /><span className="text-sm font-bold text-zinc-200">Offline-first</span></div>
          <p className="text-[12px] text-zinc-500 leading-relaxed">Wake word, STT, and core skills run fully offline. Cloud AI is an opt-in enhancement.</p>
        </div>
        <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-2 mb-2"><Puzzle className="w-4 h-4 text-teal-400" /><span className="text-sm font-bold text-zinc-200">Plugin-first</span></div>
          <p className="text-[12px] text-zinc-500 leading-relaxed">Every skill is a plugin via Python entry_points. Community can ship new skills as packages.</p>
        </div>
        <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-2 mb-2"><Shield className="w-4 h-4 text-teal-400" /><span className="text-sm font-bold text-zinc-200">Privacy by design</span></div>
          <p className="text-[12px] text-zinc-500 leading-relaxed">Audio never leaves the device unless the user explicitly enables cloud AI features.</p>
        </div>
        <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-2 mb-2"><Bug className="w-4 h-4 text-amber-400" /><span className="text-sm font-bold text-zinc-200">Lorapok aesthetic</span></div>
          <p className="text-[12px] text-zinc-500 leading-relaxed">HUD follows the Biological UI style — cybernetic larva mascot, neon-green on dark.</p>
        </div>
        <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-2 mb-2"><RefreshCw className="w-4 h-4 text-amber-400" /><span className="text-sm font-bold text-zinc-200">Silent optimizer</span></div>
          <p className="text-[12px] text-zinc-500 leading-relaxed">Consumes bottlenecks in the background. Learns usage patterns over time.</p>
        </div>
      </div>
    </div>
  );
}
