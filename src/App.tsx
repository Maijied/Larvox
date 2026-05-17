import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { HudPreview } from "./pages/HudPreview";
import { Onboarding } from "./pages/Onboarding";
import { WakeWordTrainer } from "./pages/WakeWordTrainer";
import { Overview } from "./pages/Overview";
import { Architecture } from "./pages/Architecture";
import { TechStack } from "./pages/TechStack";
import { IpcProtocol } from "./pages/IpcProtocol";
import { Code } from "./pages/Code";
import { Skills } from "./pages/Skills";
import { Roadmap } from "./pages/Roadmap";
import { TTSSettings } from "./pages/TTSSettings";
import { ControlPanel } from "./pages/ControlPanel";
import { About } from "./pages/About";
import logoUrl from "./assets/images/larvox_final_logo_1779017218383.png";

export default function App() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="flex h-screen bg-dark-bg selection:bg-lime-400/30 selection:text-white overflow-hidden">
      <Navigation activeItem={activeTab} onSelect={setActiveTab} />
      
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-8 flex flex-col overflow-y-auto">
          <header className="mb-8 border-b border-zinc-800 pb-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-black/40 border border-zinc-700 shadow-lg ring-1 ring-white/5">
                <img src={logoUrl} alt="LARVOX" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white uppercase leading-none">
                  LARVOX
                </h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                  System Orchestrator <span className="text-lime-500/50 mx-1">/</span> BIOS-LEVEL AI
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></div>
                <span className="text-xs font-medium font-mono text-lime-400">LISTENING / 127.0.0.1:5050</span>
              </div>
            </div>
          </header>
          
          <div className="flex-1 pb-10 max-w-5xl">
            {activeTab === "about" && <About />}
            {activeTab === "onboarding" && <Onboarding />}
            {activeTab === "hud" && <HudPreview />}
            {activeTab === "wakeword" && <WakeWordTrainer />}
            {activeTab === "overview" && <Overview />}
            {activeTab === "arch" && <Architecture />}
            {activeTab === "stack" && <TechStack />}
            {activeTab === "ipc" && <IpcProtocol />}
            {activeTab === "code" && <Code />}
            {activeTab === "controlpanel" && <ControlPanel />}
            {activeTab === "skills" && <Skills />}
            {activeTab === "tts" && <TTSSettings />}
            {activeTab === "roadmap" && <Roadmap />}
          </div>
        </div>
      </main>
    </div>
  );
}
