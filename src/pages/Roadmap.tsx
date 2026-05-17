import { Card } from "../components/ui";

export function Roadmap() {
  const phases = [
    {
      title: "Phase 0: Foundation & Tooling",
      weeks: "Weeks 1–2",
      color: "bg-zinc-600",
      focus: "Repo structure, DevOps, and Core Daemon",
      tasks: [
        {
          name: "Initialize Architecture",
          subtasks: [
            "Initialize monorepo (larvox-core, larvox-skills, larvox-hud)",
            "Setup GitHub Actions: linters (flake8, mypy), pytest, and build matrix"
          ]
        },
        {
          name: "Core IPC Daemon",
          subtasks: [
            "Implement Base Daemon using asyncio and Unix Domain Sockets",
            "Design and document the JSON-RPC IPC protocol (protocol.py)"
          ]
        },
        {
          name: "Audio Subsystem",
          subtasks: [
            "Build audio capture thread using sounddevice (16kHz mono buffer)",
            "Integrate webrtcvad for precise silence detection and audio segmentation"
          ]
        }
      ]
    },
    {
      title: "Phase 1: Local Voice Pipeline",
      weeks: "Weeks 3–6",
      color: "bg-blue-600",
      focus: "End-to-End Voice Capture and Basic Skills",
      tasks: [
        {
          name: "Wake Word & STT",
          subtasks: [
             "Integrate OpenWakeWord with multi-model concurrent listening",
             "Integrate faster-whisper (small.en) for high-speed offline local STT"
          ]
        },
        {
          name: "NLU processing via Rules & local LLMs",
          subtasks: [
             "Implement the NLU Router: Regex and keyword-based intent classification",
             "Draft the LarvoxSkill Plugin API and load system via Python entry_points"
          ]
        },
        {
          name: "Base Feedback",
          subtasks: [
             "Develop Core System Skills: volume control, app launcher, screen lock, status reporting",
             "Implement basic TTS using pyttsx3/espeak for immediate feedback"
          ]
        }
      ]
    },
    {
      title: "Phase 2: The UI & UX Layer",
      weeks: "Weeks 7–10",
      color: "bg-lime-500",
      focus: "HUD, Visuals, and Lorapok Aesthetic",
      tasks: [
        {
          name: "Display Server Integration",
          subtasks: [
             "Build the GTK4 transparent overlay window via PyGObject",
             "Implement Wayland layer-shell protocol support for floating HUD"
          ]
        },
        {
          name: "Aesthetics & Logic",
          subtasks: [
             "Design 'Biological UI' animations: pulsating mic, state transitions (idle, listening, processing)",
             "Integrate the IPC client in Python HUD to listen to daemon event streams",
             "Implement a CLI interaction tool (larvox-cli) for headless testing"
          ]
        }
      ]
    },
    {
      title: "Phase 3: The AI Orchestrator",
      weeks: "Weeks 11–14",
      color: "bg-teal-500",
      focus: "Cloud Fallback, Memory, RAG, and Advanced Logic",
      tasks: [
        {
          name: "LLM Backend Integration",
          subtasks: [
             "Integrate Google Gemini API / Claude for handling unmapped intents (fallback_llm)",
             "Integrate llama-cpp-python for deep offline local LLM capability"
          ]
        },
        {
          name: "Knowledge Representation",
          subtasks: [
             "Set up SQLite history tracking via SQLAlchemy (Remember past interactions)",
             "Implement Local Vector Database (ChromaDB) for RAG and Semantic Desktop Search"
          ]
        },
        {
          name: "Advanced Capabilities",
          subtasks: [
              "Develop Advanced Syntax Explainer skill for on-the-fly code explanation",
              "Implement Deep Web Research System: Multi-query search, background scraping",
              "Enable streaming AI responses mapping to streaming XTTS for low-latency voice"
          ]
        }
      ]
    },
    {
      title: "Phase 4: Omnipresent OS Integration",
      weeks: "Weeks 15–18",
      color: "bg-amber-500",
      focus: "God-Mode System Control, DevOps, and Automation",
      tasks: [
        {
           name: "Deep System Operations",
           subtasks: [
             "Implement deep system control using pkexec and D-Bus",
             "Develop Shell Generation: LLM writes, verifies, and executes dynamic bash scripts",
             "Implement Self-Healing Workflows: Auto-detecting and repairing broken system states"
           ]
        },
        {
           name: "Proactive Actions",
           subtasks: [
             "Implement Proactive Event daemon (Monitor CPU/RAM, active window IDE duration)",
             "Build logic to trigger unsolicited voice prompts ('You seem stuck, need help?')"
           ]
        },
        {
           name: "Telemetry & Tools",
           subtasks: [
             "Implement WebSockets API for multi-user remote access and telemetry monitoring",
             "Implement Screen Reader Accessibility: full-screen OCR via pytesseract"
           ]
        }
      ]
    },
    {
      title: "Phase 5: Polish & Deployment",
      weeks: "Week 19+",
      color: "bg-green-500",
      focus: "Packaging, Control Panel, and Launch",
      tasks: [
        {
          name: "Distributables",
          subtasks: [
            "Package project utilizing PyInstaller or standard wheels for distribution",
            "Generate a .deb package for native APT distributions, including the systemd service files",
            "Create Ubuntu Snap package with strict confinement and plug declarations"
          ]
        },
        {
          name: "User Experience",
          subtasks: [
            "Build the Control Panel GUI for user tuning",
            "User Onboarding CLI / First-run tutorial & microphone calibration tool",
            "Deploy documentation site (Sphinx/MkDocs)"
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-2 text-white uppercase">The Perfect Roadmap</h2>
        <p className="text-[11px] text-zinc-500 uppercase tracking-widest">Master project timeline, structured into definitive tasks and subtasks.</p>
      </div>

      <div className="pt-6">
        <div className="relative border-l-2 border-zinc-800 ml-4 space-y-12 pb-8">
          {phases.map((phase, i) => (
            <div key={i} className="relative pl-8">
              <div className={`absolute left-[-6px] top-1.5 w-[10px] h-[10px] rounded-full ${phase.color} shadow-[0_0_15px_currentColor] opacity-90`} />
              
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-zinc-200 uppercase tracking-wide">{phase.title}</h3>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px] font-mono text-zinc-400">{phase.weeks}</span>
              </div>
              <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-widest mb-4 inline-block pb-1 border-b border-zinc-800">{phase.focus}</p>
              
              <div className="space-y-4 bg-zinc-900/30 p-5 rounded-xl border border-zinc-800/50 shadow-inner">
                {phase.tasks.map((task, j) => (
                  <div key={j} className="mb-4 last:mb-0">
                    <h4 className="text-[13px] font-bold text-lime-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-lime-400 rounded-sm"></div>
                      Task: {task.name}
                    </h4>
                    <ul className="space-y-2 pl-4 border-l border-zinc-800/60 ml-[3px]">
                      {task.subtasks.map((sub, k) => (
                        <li key={k} className="flex items-start gap-2 group">
                          <div className="flex-shrink-0 mt-[5px] w-2 h-2 rounded-[2px] border border-zinc-600 bg-zinc-950 group-hover:border-zinc-400 transition-colors flex items-center justify-center">
                          </div>
                          <span className="text-[12px] text-zinc-400 leading-relaxed font-mono">{sub}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
