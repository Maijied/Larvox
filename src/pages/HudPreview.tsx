import { Mic, TerminalSquare, Settings2, Activity, Cpu, Wifi, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";

type LogEntry = {
  id: string;
  time: string;
  type: "recv" | "exec" | "resp" | "info" | "err";
  message: string;
  details?: string;
};

const AnimatedOrb = ({ state }: { state: "idle" | "listening" | "thinking" | "executing" | "speaking" | "suggesting" }) => {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
       {/* Outer rings */}
       <div className={cn(
           "absolute inset-0 rounded-[40%] transition-all duration-1000 mix-blend-screen",
           state === "idle" ? "border border-zinc-700 rotate-0" :
           state === "listening" ? "border-2 border-lime-500 shadow-[0_0_20px_#84cc16] animate-[spin_3s_linear_infinite]" :
           state === "thinking" ? "border-2 border-amber-500 shadow-[0_0_30px_#f59e0b] animate-[spin_1s_linear_infinite_reverse]" :
           state === "executing" ? "border-2 border-cyan-400 shadow-[0_0_40px_#22d3ee] animate-[spin_0.5s_linear_infinite]" :
           state === "suggesting" ? "border-2 border-fuchsia-400 shadow-[0_0_40px_#e879f9] animate-pulse" :
           "border-[3px] border-lime-400 shadow-[0_0_40px_#a3e635] animate-[spin_4s_linear_infinite]"
       )} />
       
       {/* Inner Eye / Core */}
       <div className={cn(
           "absolute inset-4 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-500",
           state === "idle" ? "bg-zinc-800/50" :
           state === "listening" ? "bg-lime-500/20 scale-95" :
           state === "thinking" ? "bg-amber-500/40 scale-110" :
           state === "executing" ? "bg-cyan-500/30 scale-125" :
           state === "suggesting" ? "bg-fuchsia-500/30 scale-110" :
           "bg-lime-400/40 scale-105"
       )}>
          {state === "thinking" ? (
             <Cpu className="w-6 h-6 text-amber-300 animate-pulse" />
          ) : state === "executing" ? (
             <Settings2 className="w-8 h-8 text-cyan-300 animate-[spin_2s_linear_infinite]" />
          ) : state === "suggesting" ? (
             <Sparkles className="w-6 h-6 text-fuchsia-300 animate-pulse" />
          ) : (
             <Mic className={cn(
               "w-6 h-6 transition-colors duration-300",
               state === "idle" ? "text-zinc-500" :
               state === "listening" ? "text-lime-400" :
               "text-lime-200"
             )} />
          )}
       </div>
    </div>
  )
}

export function HudPreview() {
  const [state, setState] = useState<"idle" | "listening" | "thinking" | "executing" | "speaking" | "suggesting">("idle");
  const [lastError, setLastError] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: "1", time: "14:20:00", type: "info", message: "LARVOX daemon connected on /tmp/larvox-ipc.sock" }
  ]);

  const handleMicClick = (simulateError: boolean = false) => {
    if (state !== "idle") return;
    
    setState("listening");
    const newLogs: LogEntry[] = [];
    
    const timeNow = () => {
      const d = new Date();
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
    };

    setTimeout(() => {
      newLogs.push({ id: Math.random().toString(), time: timeNow(), type: "info", message: "Wakeword triggered (model: 'hey_larva', conf: 0.98)" });
      setLogs(prev => [...prev, ...newLogs]);
    }, 500);

    if (simulateError) {
      setTimeout(() => {
        setState("thinking");
      }, 1500);
      
      setTimeout(() => {
        setState("idle");
        setLastError("STT engine timeout");
        setLogs(prev => [...prev, { 
          id: Math.random().toString(), 
          time: timeNow(), 
          type: "err", 
          message: "STT Recognition Failed / Timeout",
          details: '{"code": -32002, "message": "Sorry, speech recognition timed out.", "speak": true}'
        }]);
        setTimeout(() => setLastError(null), 3000);
      }, 3500);
      return;
    }

    setTimeout(() => {
      setState("thinking");
      newLogs.push({ id: Math.random().toString(), time: timeNow(), type: "recv", message: '"update the system and turn off bluetooth"' });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 2500);

    setTimeout(() => {
      newLogs.push({ 
        id: Math.random().toString(), 
        time: timeNow(), 
        type: "info", 
        message: "Routed to intent: system.admin.update && system.settings.bluetooth",
        details: '{"actions": ["apt update", "rfkill block bluetooth"], "confidence": 0.97}'
      });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 3200);

    setTimeout(() => {
      setState("executing");
      newLogs.push({ id: Math.random().toString(), time: timeNow(), type: "exec", message: "pkexec apt update -y && rfkill block bluetooth" });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 4500);

    setTimeout(() => {
      setState("speaking");
      newLogs.push({ 
        id: Math.random().toString(), 
        time: timeNow(), 
        type: "resp", 
        message: "I've successfully updated your system packages and disabled the Bluetooth to save power.",
        details: '{"tone": "helpful", "speed": 1.0}'
      });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 6000);

    setTimeout(() => {
      setState("idle");
    }, 10000);
  };

  const handleProactiveClick = () => {
    if (state !== "idle") return;
    
    setState("suggesting");
    const newLogs: LogEntry[] = [];
    
    const timeNow = () => {
      const d = new Date();
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
    };

    setTimeout(() => {
      newLogs.push({ 
        id: Math.random().toString(), 
        time: timeNow(), 
        type: "info", 
        message: "Triggered proactive suggestion API: system.idle && memory.high" 
      });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 500);

    setTimeout(() => {
      setState("executing");
      newLogs.push({ id: Math.random().toString(), time: timeNow(), type: "exec", message: "ps aux --sort=-%mem | head -n 5" });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 1500);

    setTimeout(() => {
      setState("speaking");
      newLogs.push({ 
        id: Math.random().toString(), 
        time: timeNow(), 
        type: "resp", 
        message: "I noticed your RAM usage is very high. Should I close Docker and Electron apps that are idling?",
        details: '{"tone": "helpful", "speed": 1.0}'
      });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 3000);

    setTimeout(() => {
      setState("idle");
    }, 7000);
  };

  const handleAppControlClick = () => {
    if (state !== "idle") return;
    
    setState("listening");
    const newLogs: LogEntry[] = [];
    
    const timeNow = () => {
      const d = new Date();
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
    };

    setTimeout(() => {
      newLogs.push({ id: Math.random().toString(), time: timeNow(), type: "info", message: "Wakeword triggered (model: 'hey_larva', conf: 0.99)" });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 500);

    setTimeout(() => {
      setState("thinking");
      newLogs.push({ id: Math.random().toString(), time: timeNow(), type: "recv", message: '"open terminal and start a new react project named my-app"' });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 2500);

    setTimeout(() => {
      newLogs.push({ 
        id: Math.random().toString(), 
        time: timeNow(), 
        type: "info", 
        message: "Routed to intent: app.launch && terminal.execute",
        details: '{"app": "gnome-terminal", "command": "npx create-react-app my-app", "confidence": 0.96}'
      });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 3200);

    setTimeout(() => {
      setState("executing");
      newLogs.push({ id: Math.random().toString(), time: timeNow(), type: "exec", message: "gnome-terminal -- bash -c 'npx create-react-app my-app; exec bash'" });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 4500);

    setTimeout(() => {
      setState("speaking");
      newLogs.push({ 
        id: Math.random().toString(), 
        time: timeNow(), 
        type: "resp", 
        message: "Opening terminal and setting up your new React project.",
        details: '{"tone": "excited", "speed": 1.05}'
      });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 6000);

    setTimeout(() => {
      setState("idle");
    }, 9500);
  };

  const handleTTSConfigClick = () => {
    if (state !== "idle") return;
    
    setState("listening");
    const newLogs: LogEntry[] = [];
    
    const timeNow = () => {
      const d = new Date();
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
    };

    setTimeout(() => {
      newLogs.push({ id: Math.random().toString(), time: timeNow(), type: "info", message: "Wakeword triggered (model: 'hey_larva', conf: 0.99)" });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 500);

    setTimeout(() => {
      setState("thinking");
      newLogs.push({ id: Math.random().toString(), time: timeNow(), type: "recv", message: '"change voice emotion to excited and set speaking speed to 1.2"' });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 2500);

    setTimeout(() => {
      newLogs.push({ 
        id: Math.random().toString(), 
        time: timeNow(), 
        type: "info", 
        message: "Routed to intent: tts.settings.update",
        details: '{"emotion": "excited", "speed": 1.2, "confidence": 0.98}'
      });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 3200);

    setTimeout(() => {
      setState("executing");
      newLogs.push({ id: Math.random().toString(), time: timeNow(), type: "exec", message: "Update tts_default_emotion = 'excited' | tts_default_speed = 1.2" });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 4500);

    setTimeout(() => {
      setState("speaking");
      newLogs.push({ 
        id: Math.random().toString(), 
        time: timeNow(), 
        type: "resp", 
        message: "I will now speak with an excited tone at speed 1.2.",
        details: '{"tone": "excited", "speed": 1.2}'
      });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 6000);

    setTimeout(() => {
      setState("idle");
    }, 9000);
  };

  const handleReadScreenClick = () => {
    if (state !== "idle") return;
    
    setState("listening");
    const newLogs: LogEntry[] = [];
    
    const timeNow = () => {
      const d = new Date();
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
    };

    setTimeout(() => {
      newLogs.push({ id: Math.random().toString(), time: timeNow(), type: "info", message: "Wakeword triggered (model: 'hey_larva', conf: 0.99)" });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 500);

    setTimeout(() => {
      setState("thinking");
      newLogs.push({ id: Math.random().toString(), time: timeNow(), type: "recv", message: '"read the text in the area I select"' });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 2500);

    setTimeout(() => {
      newLogs.push({ 
        id: Math.random().toString(), 
        time: timeNow(), 
        type: "info", 
        message: "Routed to intent: screen.reader.area",
        details: '{"confidence": 0.97}'
      });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 3200);

    setTimeout(() => {
      setState("executing");
      newLogs.push({ id: Math.random().toString(), time: timeNow(), type: "exec", message: "maim -s /tmp/larvox-screen.png && tesseract /tmp/larvox-screen.png stdout" });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 4500);

    setTimeout(() => {
      setState("speaking");
      newLogs.push({ 
        id: Math.random().toString(), 
        time: timeNow(), 
        type: "resp", 
        message: "Here is what I see: Example text detected from the selected region.",
        details: '{"tone": "neutral", "speed": 1.0}'
      });
      setLogs(prev => [...prev, newLogs[newLogs.length - 1]]);
    }, 6500);

    setTimeout(() => {
      setState("idle");
    }, 10000);
  };

  return (
    <div className="max-w-4xl xl:max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold tracking-tight mb-2 text-white uppercase flex items-center gap-2">
            <TerminalSquare className="w-6 h-6 text-lime-400" /> LARVOX HUD Preview
          </h2>
          <p className="text-[12px] text-zinc-400 uppercase tracking-widest max-w-xl">
            Simulating the Next-Gen Floating Assistant modifying system-level settings on command.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end max-w-lg">
          <button 
            onClick={() => handleReadScreenClick()}
            disabled={state !== "idle"}
            className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#09090b] border border-blue-400/50 bg-blue-400 rounded shadow-sm hover:bg-blue-300 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            Read Screen
          </button>
          <button 
            onClick={() => handleTTSConfigClick()}
            disabled={state !== "idle"}
            className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#09090b] border border-amber-400/50 bg-amber-400 rounded shadow-sm hover:bg-amber-300 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            TTS Config
          </button>
          <button 
            onClick={() => handleProactiveClick()}
            disabled={state !== "idle"}
            className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-900 bg-fuchsia-500 rounded shadow-sm hover:bg-fuchsia-400 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            Simulate Proactive
          </button>
          <button 
            onClick={() => handleAppControlClick()}
            disabled={state !== "idle"}
            className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#09090b] border border-cyan-400/50 bg-cyan-400 rounded shadow-sm hover:bg-cyan-300 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            App Control
          </button>
          <button 
            onClick={() => handleMicClick(false)}
            disabled={state !== "idle"}
            className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-900 bg-lime-500 rounded shadow-sm hover:bg-lime-400 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            Simulate God-Mode
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Main Interface / Mock Desktop */}
        <div className="lg:col-span-2 bg-[#09090b] border border-zinc-800 rounded-xl flex flex-col overflow-hidden relative">
          
          <div className="h-10 border-b border-zinc-800/80 bg-black/60 backdrop-blur flex items-center justify-between px-4 z-10">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-zinc-300">Ubuntu 22.04 LTS</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-400">
              <Wifi className="w-3 h-3" />
              <Activity className="w-3 h-3" />
              <span className="text-[12px] font-bold">14:20</span>
            </div>
          </div>

          <div className="relative flex-1 bg-zinc-950 overflow-hidden">
             {/* Mock Desktop Content */}
             <div className="p-8 opacity-20">
                <div className="w-48 h-32 bg-zinc-900 border border-zinc-800 rounded mb-4 shadow-xl"></div>
                <div className="w-64 h-48 bg-zinc-900 border border-zinc-800 rounded shadow-xl"></div>
             </div>

             {/* God Mode Visual Overlay */}
             {state === "executing" && (
                <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                   {/* Scanning Glow */}
                   <div className="absolute inset-0 bg-cyan-500/5 mix-blend-screen animate-pulse"></div>
                   
                   {/* Vertical Scan Line */}
                   <div className="absolute top-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_15px_#22d3ee,0_0_30px_#22d3ee] animate-[scan_3s_linear_infinite] z-20"></div>
                   
                   {/* Grid Overlay */}
                   <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                   
                   {/* Radial Vignette */}
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>

                   {/* Execution Text Overlay */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="text-cyan-400 font-bold text-[10px] uppercase tracking-[0.5em] mb-2 animate-pulse">
                         System Privilege Escalation Active
                      </div>
                      <div className="text-white font-black text-4xl tracking-tighter opacity-20">
                         GOD MODE
                      </div>
                   </div>
                </div>
             )}
             
             {/* The Assistant in bottom right */}
             <div className={cn(
                 "absolute bottom-8 right-8 flex flex-col items-end transition-all duration-700 ease-out z-20",
                 state === 'idle' ? 'opacity-50 hover:opacity-100 scale-95' : 'opacity-100 blur-0 scale-100'
               )}>
               
                 {/* Communication Bubble */}
                 <div className={cn(
                    "mb-6 relative transition-all duration-500 origin-bottom-right",
                    state === 'idle' ? 'opacity-0 translate-y-4 scale-90 pointer-events-none' : 'opacity-100 translate-y-0 scale-100'
                 )}>
                     <div className="bg-zinc-900/90 backdrop-blur-xl border border-lime-500/40 text-lime-100 p-5 rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl shadow-[0_10px_40px_rgba(132,204,22,0.15)] max-w-sm">
                        {state === 'listening' && (
                          <div className="flex items-center gap-2 text-lime-400 font-medium">
                            <Mic className="w-4 h-4 animate-pulse" /> Listening...
                          </div>
                        )}
                        {state === 'thinking' && (
                          <div className="flex flex-col gap-2">
                             <div className="text-[12px] text-amber-300 font-bold tracking-widest uppercase">Analyzing Intent</div>
                             <div className="h-1 w-full bg-zinc-800 rounded overflow-hidden">
                                <div className="h-full bg-amber-400 w-1/2 animate-[bounce_1s_infinite]"></div>
                             </div>
                          </div>
                        )}
                        {state === 'suggesting' && (
                          <div className="flex flex-col gap-2">
                             <div className="text-[12px] text-fuchsia-300 font-bold tracking-widest uppercase flex items-center gap-2">
                               <Sparkles className="w-4 h-4 animate-pulse" /> Proactive Suggestion
                             </div>
                             <div className="h-1 w-full bg-zinc-800 rounded overflow-hidden">
                                <div className="h-full bg-fuchsia-400 w-full animate-[pulse]"></div>
                             </div>
                          </div>
                        )}
                        {state === 'executing' && (
                          <div className="flex flex-col gap-2">
                             <div className="text-[12px] text-cyan-300 font-bold tracking-widest uppercase flex items-center gap-2">
                               <Settings2 className="w-3 h-3 animate-[spin_2s_linear_infinite]" /> Modifying System
                             </div>
                             <div className="font-mono text-[10px] text-cyan-500 bg-zinc-950 p-2 rounded">
                               ➔ {logs.filter(l => l.type === 'exec').pop()?.message || "Executing..."}
                             </div>
                          </div>
                        )}
                        {state === 'speaking' && (
                          <div className="text-[14px] leading-relaxed">
                            {logs.filter(l => l.type === 'resp').pop()?.message || "..."}
                          </div>
                        )}
                     </div>
                 </div>

                 {/* The Floating Avatar (Next Gen) */}
                 <button onClick={() => handleMicClick()} className="outline-none focus:outline-none"> 
                    <AnimatedOrb state={state} />
                 </button>
             </div>
          </div>
        </div>

        {/* Debug Console stream */}
        <div className="lg:col-span-1 bg-[#09090b] border border-zinc-800 rounded-xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Daemon IPC Stream</span>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-[11px] leading-relaxed flex flex-col scroll-smooth">
            {logs.map(log => (
              <div key={log.id} className="animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-start gap-2">
                  <span className="text-zinc-600 shrink-0">[{log.time}]</span>
                  <span className={cn(
                    "uppercase shrink-0 font-bold",
                    log.type === "recv" ? "text-blue-400" :
                    log.type === "exec" ? "text-amber-400" :
                    log.type === "resp" ? "text-lime-400" :
                    log.type === "err" ? "text-red-400" :
                    "text-zinc-500"
                  )}>{log.type}:</span>
                  <span className={cn(
                    "break-all",
                    log.type === "recv" ? "text-zinc-300 italic" :
                    log.type === "exec" ? "text-amber-100" :
                    log.type === "resp" ? "text-lime-200" :
                    "text-zinc-400"
                  )}>{log.message}</span>
                </div>
                {log.details && (
                  <div className="mt-1.5 ml-[72px] p-2 bg-zinc-950/50 rounded border border-zinc-800/60 text-zinc-500 overflow-x-auto whitespace-pre">
                    {log.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
