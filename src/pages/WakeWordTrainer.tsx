import { useState } from "react";
import { Card } from "../components/ui";
import { Mic, CheckCircle2, Loader2, Play, Save } from "lucide-react";
import { cn } from "../lib/utils";

export function WakeWordTrainer() {
  const [phrase, setPhrase] = useState("");
  const [step, setStep] = useState<"input" | "recording" | "training" | "done">("input");
  const [recordings, setRecordings] = useState<number>(0);
  const targetRecordings = 3;

  const handleStartRecording = () => {
    if (!phrase.trim()) return;
    setStep("recording");
    setRecordings(0);
  };

  const handleRecordSample = () => {
    if (recordings < targetRecordings - 1) {
      setRecordings(prev => prev + 1);
    } else {
      setRecordings(targetRecordings);
      setStep("training");
      setTimeout(() => {
        setStep("done");
      }, 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-2 text-white uppercase">Wake Word Training</h2>
        <p className="text-[11px] text-zinc-500 uppercase tracking-widest">Train a custom openwakeword model on device.</p>
      </div>

      <Card className="bg-[#0c0c0e] border-zinc-800 p-8 min-h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden">
        
        {step === "input" && (
          <div className="w-full max-w-sm space-y-6 animate-in fade-in zoom-in-95">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Target Phrase</label>
              <input 
                type="text" 
                value={phrase}
                onChange={e => setPhrase(e.target.value)}
                placeholder="e.g., Computer, Nexus, System"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-all font-mono"
              />
            </div>
            <button 
              onClick={handleStartRecording}
              disabled={!phrase.trim()}
              className="w-full flex items-center justify-center gap-2 bg-lime-900/30 text-lime-400 border border-lime-500/50 hover:bg-lime-900/50 font-bold uppercase tracking-widest text-[11px] py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mic className="w-4 h-4" /> Start Calibration
            </button>
          </div>
        )}

        {step === "recording" && (
          <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in-95 flex flex-col items-center">
            <div className="text-center space-y-2">
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Speak the phrase</p>
              <h3 className="text-2xl font-bold text-zinc-200">"{phrase}"</h3>
            </div>

            <button 
              onClick={handleRecordSample}
              className="w-24 h-24 rounded-full border-2 border-red-500/50 flex flex-col items-center justify-center gap-1 hover:border-red-400 hover:bg-red-950/30 transition-all group relative"
            >
              <div className="absolute inset-0 rounded-full bg-red-500/10 animate-ping opacity-50"></div>
              <Mic className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
            </button>

            <div className="w-full space-y-3">
              <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500">
                <span>Progress</span>
                <span>{recordings} / {targetRecordings}</span>
              </div>
              <div className="flex gap-2">
                {Array.from({ length: targetRecordings }).map((_, i) => (
                  <div key={i} className={cn(
                    "h-2 flex-1 rounded-full transition-all duration-500",
                    i < recordings ? "bg-lime-500" : "bg-zinc-800"
                  )} />
                ))}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono text-center pt-2">Click mic to simulate recording completion...</p>
            </div>
          </div>
        )}

        {step === "training" && (
          <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in-95 flex flex-col items-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-zinc-800 rounded-full border-t-lime-500 animate-spin"></div>
              <Loader2 className="w-8 h-8 text-lime-400 animate-spin" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-zinc-200">Training Model</h3>
              <p className="text-[11px] font-mono text-zinc-400">Extracting features & training openwakeword...</p>
            </div>
            <div className="w-full bg-zinc-900 rounded border border-zinc-800 p-3 text-left space-y-2 font-mono text-[10px] text-zinc-500 h-32 overflow-hidden flex flex-col justify-end relative">
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-zinc-900/80 pointer-events-none"></div>
              <div className="animate-pulse">Loading fine-tuning weights...</div>
              <div>Computing mel-spectrograms [3/3]</div>
              <div>Training epoch 1/5... loss: 0.842</div>
              <div>Training epoch 2/5... loss: 0.412</div>
              <div>Training epoch 3/5... loss: 0.158</div>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in-95 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-lime-900/30 border-2 border-lime-500 flex items-center justify-center shadow-[0_0_30px_rgba(132,204,22,0.2)]">
              <CheckCircle2 className="w-12 h-12 text-lime-400" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-zinc-200">Model Ready</h3>
              <p className="text-[12px] text-zinc-400">"{phrase}" is now active.</p>
            </div>

            <div className="w-full flex flex-col gap-3">
              <div className="flex justify-between items-center bg-zinc-900 px-4 py-3 rounded border border-zinc-800 text-sm">
                <span className="text-zinc-500 font-mono text-[10px]">OUTPUT FILE</span>
                <span className="text-lime-400 font-mono text-[11px]">{phrase.toLowerCase().replace(/\s+/g, '_')}_v1.onnx</span>
              </div>
              <button 
                onClick={() => {
                  setPhrase("");
                  setRecordings(0);
                  setStep("input");
                }}
                className="w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white font-bold uppercase tracking-widest text-[11px] py-3 rounded-lg transition-colors"
              >
                Train Another
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
