import { HardDrive, Server, Cpu, ShieldAlert, Sparkles, Wand2, Terminal, Shield, Zap, Info } from "lucide-react";
import logoUrl from "../assets/images/larvox_final_logo_1779017218383.png";

export function About() {
  return (
    <div className="space-y-12 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col items-center text-center space-y-6">
        <div className="relative group">
          <div className="absolute -inset-8 bg-lime-500/20 blur-2xl rounded-full group-hover:bg-lime-500/30 transition-all duration-700"></div>
          <img 
            src={logoUrl} 
            alt="LARVOX Logo" 
            className="w-56 h-56 rounded-full border-2 border-zinc-700 relative z-10 bg-black/40 shadow-2xl transition-transform hover:scale-105 duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h1 className="text-6xl font-black tracking-tighter text-white mb-2">
            LARVOX<span className="text-lime-400">.</span>
          </h1>
          <p className="text-zinc-500 uppercase tracking-[0.3em] font-bold text-[10px]">
            Lorapok AI Response & Voice Operating eXperience
          </p>
        </div>
      </header>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Info className="w-24 h-24 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Terminal className="w-6 h-6 text-lime-400" /> System Overview
        </h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-400 leading-relaxed text-lg">
            LARVOX is a distributed, biological-inspired system controller for Ubuntu-based environments. 
            It merges high-performance Offline NLP with Kernel-level execution capabilities. 
            Designed as a "God-Mode" assistant, it doesn't just answer questions—it manipulates 
            the operating system state to maintain peak performance and operational security.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-lime-500/50 transition-colors group">
          <div className="w-12 h-12 bg-lime-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-lime-500/20 transition-colors">
            <Shield className="text-lime-400 w-6 h-6" />
          </div>
          <h3 className="text-white font-bold text-xl mb-4">Privileged Execution</h3>
          <p className="text-zinc-500 leading-relaxed text-sm">
            Tying directly into <code className="text-lime-400 bg-lime-950/30 px-1 rounded">pkexec</code>, LARVOX can execute administrative tasks (apt updates, service restarts, firewall rules) securely. It acts as an intelligent proxy for your root terminal.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-cyan-500/50 transition-colors group">
          <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
            <Zap className="text-cyan-400 w-6 h-6" />
          </div>
          <h3 className="text-white font-bold text-xl mb-4">Real-time HUD</h3>
          <p className="text-zinc-500 leading-relaxed text-sm">
            The Assistant HUD is rendered as a Wayland top-layer. It provides visual feedback for system state transitions, including the "God-Mode" scan overlay during critical package updates or system optimizations.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-amber-500/50 transition-colors group">
          <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
            <Cpu className="text-amber-400 w-6 h-6" />
          </div>
          <h3 className="text-white font-bold text-xl mb-4">Offline LLM Core</h3>
          <p className="text-zinc-500 leading-relaxed text-sm">
            Powered by <code className="text-amber-400 bg-amber-950/30 px-1 rounded">llama.cpp</code>, LARVOX interprets natural language intent locally. No system data ever leaves your hardware, ensuring privacy-first system management.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-fuchsia-500/50 transition-colors group">
          <div className="w-12 h-12 bg-fuchsia-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-fuchsia-500/20 transition-colors">
            <Sparkles className="text-fuchsia-400 w-6 h-6" />
          </div>
          <h3 className="text-white font-bold text-xl mb-4">Proactive Nodes</h3>
          <p className="text-zinc-500 leading-relaxed text-sm">
            Monitor process clusters and system health metrics. LARVOX proactively suggests interventions when it detects runaway processes or memory leaks, acting as a sentient health-check for your Linux installation.
          </p>
        </div>
      </div>

      <footer className="text-center py-10 border-t border-zinc-800">
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
          &copy; 2026 Lorapok System Architecture • All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
