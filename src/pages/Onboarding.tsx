import { useState } from "react";
import { Card } from "../components/ui";
import { Mic, Activity, Shield, TerminalSquare, ChevronRight, Check } from "lucide-react";
import { cn } from "../lib/utils";

export function Onboarding() {
  const [step, setStep] = useState(1);

  const steps = [
    {
      title: "Welcome to LARVOX",
      icon: TerminalSquare,
      content: "Meet your new biological-inspired Ubuntu voice assistant. LARVOX integrates deeply with your system to provide fast, offline-first voice control.",
      color: "text-lime-400",
      bg: "bg-lime-900/20",
      border: "border-lime-500/30"
    },
    {
      title: "Say the Wake Word",
      icon: Mic,
      content: "Just say \"Hey Larva\" to get started. You can also train your own custom wake words, like \"Listen Lorapok.\" The system is always listening, but processes everything locally.",
      color: "text-teal-400",
      bg: "bg-teal-900/20",
      border: "border-teal-500/30"
    },
    {
      title: "Issue a Command",
      icon: Activity,
      content: "Try saying \"Open Firefox\", \"Take a screenshot\", or \"What's the weather like?\" LARVOX handles system controls, file operations, and AI tasks seamlessly.",
      color: "text-amber-400",
      bg: "bg-amber-900/20",
      border: "border-amber-500/30"
    },
    {
      title: "Privacy First",
      icon: Shield,
      content: "Your data stays on your machine. Wake word detection, speech-to-text, and core intents run fully offline. Cloud AI is only used when explicitly requested.",
      color: "text-blue-400",
      bg: "bg-blue-900/20",
      border: "border-blue-500/30"
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col justify-center min-h-[60vh]">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-2 text-white uppercase">Initialize LARVOX</h2>
        <p className="text-xs text-zinc-500 uppercase tracking-widest">System setup & orientation sequence</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-500",
              step === i + 1 ? cn(s.color, s.border, s.bg, "scale-110 shadow-[0_0_15px_rgba(0,255,0,0.2)]") :
              step > i + 1 ? "bg-zinc-800 text-zinc-400 border-zinc-700" : "bg-zinc-950 text-zinc-600 border-zinc-800"
            )}>
              {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <div className={cn(
              "text-[10px] uppercase tracking-widest mt-2 font-bold transition-colors",
              step === i + 1 ? s.color : step > i + 1 ? "text-zinc-500" : "text-zinc-700"
            )}>
              {s.title.split(' ')[0]}
            </div>
          </div>
        ))}
      </div>

      <Card className="relative overflow-hidden bg-[#0c0c0e] border-zinc-800 p-8 min-h-[300px] flex flex-col justify-center items-center text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-[#09090b] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          {steps.map((s, i) => (
            <div key={i} className={cn(
              "transition-all duration-500 absolute w-full",
              step === i + 1 ? "opacity-100 translate-y-0 relative" : "opacity-0 translate-y-4 hidden"
            )}>
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6", s.bg, s.border, "border")}>
                <s.icon className={cn("w-8 h-8", s.color)} />
              </div>
              <h3 className="text-xl font-bold text-zinc-200 mb-4">{s.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-md mx-auto">
                {s.content}
              </p>
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-12 flex justify-between w-full max-w-md">
          <button 
            onClick={() => setStep(Math.max(1, step - 1))}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded border transition-colors",
              step === 1 ? "opacity-0 pointer-events-none" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            )}
          >
            Previous
          </button>
          
          <button 
            onClick={() => setStep(Math.min(steps.length, step + 1))}
            className={cn(
              "flex items-center gap-2 px-6 py-2 text-xs font-bold uppercase tracking-widest rounded border transition-colors",
              step === steps.length 
                ? "bg-lime-900/30 border-lime-500/50 text-lime-400 hover:bg-lime-900/50" 
                : "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
            )}
          >
            {step === steps.length ? "Complete Setup" : "Next sequence"} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </Card>
    </div>
  );
}
