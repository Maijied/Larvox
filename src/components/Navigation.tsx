import { Bug, Cpu, Waypoints, Code2, TerminalSquare, Info, Layout, Route, Calendar, PlaySquare, Mic, Volume2, BookOpen } from "lucide-react";
import { type ElementType } from "react";
import { cn } from "../lib/utils";
import logoUrl from "../assets/images/larvox_final_logo_1779017218383.png";

type NavItem = {
  id: string;
  label: string;
  icon: ElementType;
};

const ITEMS: NavItem[] = [
  { id: "about", label: "About LARVOX", icon: BookOpen },
  { id: "onboarding", label: "Onboarding", icon: PlaySquare },
  { id: "hud", label: "HUD Interactive", icon: TerminalSquare },
  { id: "wakeword", label: "Wake Word Training", icon: Mic },
  { id: "tts", label: "TTS Settings", icon: Volume2 },
  { id: "overview", label: "Overview", icon: Info },
  { id: "arch", label: "Architecture", icon: Layout },
  { id: "stack", label: "Tech Stack", icon: Cpu },
  { id: "ipc", label: "IPC Protocol", icon: Waypoints },
  { id: "code", label: "Python Source", icon: Code2 },
  { id: "controlpanel", label: "Control Panel", icon: Layout },
  { id: "skills", label: "Skill Patterns", icon: Route },
  { id: "roadmap", label: "Roadmap", icon: Calendar }
];

export function Navigation({ activeItem, onSelect }: { activeItem: string, onSelect: (id: string) => void }) {
  return (
    <div className="w-[280px] bg-panel-bg h-screen border-r border-zinc-800 flex flex-col shrink-0">
      <div className="h-16 flex items-center px-8 border-b border-zinc-800">
        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-4 bg-black/50 overflow-hidden mix-blend-screen shadow-sm ring-1 ring-zinc-700">
          <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-bold tracking-tight text-white uppercase leading-none">LARVOX</span>
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">Daemon IPC Spec</span>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-4">
        <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-2">Core Navigation</h3>
        <ul className="space-y-1">
          {ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSelect(item.id)}
                className={cn(
                  "w-full flex items-center px-3 py-2.5 rounded transition-all duration-200 text-[13px] font-medium",
                  activeItem === item.id 
                    ? "bg-zinc-900 border-glass text-zinc-100 shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
                )}
              >
                <item.icon className={cn("w-4 h-4 mr-3", activeItem === item.id ? "text-lime-400" : "text-zinc-500")} />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-6 border-t border-zinc-800">
        <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800 text-center">
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest leading-none">Lorapok Labs © 2024</p>
        </div>
      </div>
    </div>
  );
}
