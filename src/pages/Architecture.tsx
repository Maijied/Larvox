import { Card, Tag } from "../components/ui";

export function Architecture() {
  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-2 text-white uppercase">Core Architecture</h2>
        <p className="text-[11px] text-zinc-500 uppercase tracking-widest">Comprehensive Systems Design, Data Flow, and Load-Bearing Decisions.</p>
      </div>

      <Card className="overflow-hidden bg-[#0c0c0e] border-zinc-800 p-0 relative">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
          <div>
            <h3 className="text-[13px] font-bold text-zinc-200 mb-1">Modular Pipeline</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Seven-stage modular pipeline. Each stage is independently swappable.</p>
          </div>
        </div>
        <div className="p-6 overflow-x-auto flex justify-center bg-zinc-950/50">
          <svg width="680" height="520" viewBox="0 0 680 520" className="opacity-90 max-w-full">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
            </defs>

            {/* Stage 1: Mic */}
            <g className="cursor-pointer group">
              <rect x="230" y="16" width="220" height="44" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1" className="group-hover:stroke-zinc-300 transition-colors"/>
              <text x="340" y="34" textAnchor="middle" fill="#e4e4e7" fontSize="12" fontWeight="bold">Microphone input</text>
              <text x="340" y="50" textAnchor="middle" fill="#a1a1aa" fontSize="10">PyAudio / sounddevice — 16kHz mono</text>
            </g>
            <line x1="340" y1="60" x2="340" y2="82" stroke="#52525b" strokeWidth="2" markerEnd="url(#arrow)"/>

            {/* Stage 2: Wake Word */}
            <g className="cursor-pointer group">
              <rect x="200" y="84" width="280" height="52" rx="8" fill="#14532d" fillOpacity="0.2" stroke="#22c55e" strokeOpacity="0.5" strokeWidth="1" className="group-hover:stroke-opacity-100 transition-colors"/>
              <text x="340" y="104" textAnchor="middle" fill="#4ade80" fontSize="12" fontWeight="bold">Wake word engine</text>
              <text x="340" y="122" textAnchor="middle" fill="#a1a1aa" fontSize="10">OpenWakeWord (MIT) — Multiple concurrent models</text>
            </g>
            <line x1="340" y1="136" x2="340" y2="158" stroke="#52525b" strokeWidth="2" markerEnd="url(#arrow)"/>

            {/* Stage 3: STT */}
            <g className="cursor-pointer group">
              <rect x="200" y="160" width="280" height="52" rx="8" fill="#0f766e" fillOpacity="0.2" stroke="#14b8a6" strokeOpacity="0.5" strokeWidth="1" className="group-hover:stroke-opacity-100 transition-colors"/>
              <text x="340" y="180" textAnchor="middle" fill="#2dd4bf" fontSize="12" fontWeight="bold">Speech-to-text (STT)</text>
              <text x="340" y="198" textAnchor="middle" fill="#a1a1aa" fontSize="10">faster-whisper (local) → Vosk fallback</text>
            </g>
            <line x1="340" y1="212" x2="340" y2="234" stroke="#52525b" strokeWidth="2" markerEnd="url(#arrow)"/>

            {/* NLU */}
            <g className="cursor-pointer group">
              <rect x="200" y="236" width="280" height="52" rx="8" fill="#0f766e" fillOpacity="0.2" stroke="#14b8a6" strokeOpacity="0.5" strokeWidth="1" className="group-hover:stroke-opacity-100 transition-colors"/>
              <text x="340" y="256" textAnchor="middle" fill="#2dd4bf" fontSize="12" fontWeight="bold">NLU / intent router</text>
              <text x="340" y="274" textAnchor="middle" fill="#a1a1aa" fontSize="10">Intent classify + entity extract + context</text>
            </g>
            <line x1="340" y1="288" x2="340" y2="310" stroke="#52525b" strokeWidth="2" markerEnd="url(#arrow)"/>

            {/* AI Orchestrator */}
            <g className="cursor-pointer group">
              <rect x="170" y="312" width="340" height="52" rx="8" fill="#14532d" fillOpacity="0.2" stroke="#22c55e" strokeOpacity="0.5" strokeWidth="1" className="group-hover:stroke-opacity-100 transition-colors"/>
              <text x="340" y="332" textAnchor="middle" fill="#4ade80" fontSize="12" fontWeight="bold">AI orchestrator (God Mode)</text>
              <text x="340" y="350" textAnchor="middle" fill="#a1a1aa" fontSize="10">Claude API / local LLM + Reasoning Loop</text>
            </g>

            {/* Context Store */}
            <g className="cursor-pointer group">
              <rect x="18" y="272" width="140" height="52" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1"/>
              <text x="88" y="292" textAnchor="middle" fill="#e4e4e7" fontSize="12" fontWeight="bold">Context Store</text>
              <text x="88" y="310" textAnchor="middle" fill="#a1a1aa" fontSize="10">SQLite History</text>
            </g>
            <line x1="158" y1="298" x2="168" y2="318" stroke="#52525b" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrow)"/>

            {/* RAG Vector DB */}
            <g className="cursor-pointer group">
              <rect x="18" y="352" width="140" height="52" rx="8" fill="#18181b" border="#3f3f46" stroke="#3f3f46" strokeWidth="1"/>
              <text x="88" y="372" textAnchor="middle" fill="#e4e4e7" fontSize="12" fontWeight="bold">Semantic RAG</text>
              <text x="88" y="390" textAnchor="middle" fill="#a1a1aa" fontSize="10">ChromaDB Embeddings</text>
            </g>
            <line x1="158" y1="378" x2="168" y2="358" stroke="#52525b" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrow)"/>

            {/* Plugin Registry */}
            <g className="cursor-pointer group">
              <rect x="522" y="312" width="140" height="52" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1"/>
              <text x="592" y="332" textAnchor="middle" fill="#e4e4e7" fontSize="12" fontWeight="bold">Plugin registry</text>
              <text x="592" y="350" textAnchor="middle" fill="#a1a1aa" fontSize="10">entry_points API</text>
            </g>
            <line x1="512" y1="338" x2="522" y2="338" stroke="#52525b" strokeWidth="1.5" strokeDasharray="4 3"/>
            <line x1="512" y1="338" x2="512" y2="338" stroke="#52525b" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrow)"/>

            {/* Remote Collaboration Node */}
            <g className="cursor-pointer group">
              <rect x="522" y="388" width="140" height="52" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeOpacity="0.5" strokeWidth="1" />
              <text x="592" y="408" textAnchor="middle" fill="#a5b4fc" fontSize="12" fontWeight="bold">Remote APIs</text>
              <text x="592" y="426" textAnchor="middle" fill="#818cf8" fontSize="10">FastAPI WebSockets</text>
            </g>
            <line x1="512" y1="414" x2="522" y2="414" stroke="#52525b" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrow)"/>

            <line x1="340" y1="364" x2="340" y2="386" stroke="#52525b" strokeWidth="2" markerEnd="url(#arrow)"/>

            {/* Stage 6: Skill Executor */}
            <g className="cursor-pointer group">
              <rect x="170" y="388" width="340" height="52" rx="8" fill="#78350f" fillOpacity="0.2" stroke="#f59e0b" strokeOpacity="0.5" strokeWidth="1"/>
              <text x="340" y="408" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">Skill executor</text>
              <text x="340" y="426" textAnchor="middle" fill="#a1a1aa" fontSize="10">System · DevOps · RAG · Web · Auto-Heal</text>
            </g>

            {/* Fork to TTS + HUD */}
            <line x1="298" y1="440" x2="210" y2="464" stroke="#52525b" strokeWidth="2" markerEnd="url(#arrow)"/>
            <line x1="382" y1="440" x2="470" y2="464" stroke="#52525b" strokeWidth="2" markerEnd="url(#arrow)"/>

            {/* TTS */}
            <g className="cursor-pointer group">
              <rect x="98" y="466" width="220" height="44" rx="8" fill="#14532d" fillOpacity="0.2" stroke="#22c55e" strokeOpacity="0.5" strokeWidth="1"/>
              <text x="208" y="482" textAnchor="middle" fill="#4ade80" fontSize="12" fontWeight="bold">Voice output (TTS)</text>
              <text x="208" y="498" textAnchor="middle" fill="#a1a1aa" fontSize="10">Coqui XTTS · Adaptive emotional tone</text>
            </g>

            {/* HUD */}
            <g className="cursor-pointer group">
              <rect x="362" y="466" width="220" height="44" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1"/>
              <text x="472" y="482" textAnchor="middle" fill="#e4e4e7" fontSize="12" fontWeight="bold">HUD overlay</text>
              <text x="472" y="498" textAnchor="middle" fill="#a1a1aa" fontSize="10">GTK4 · Lorapok biological UI</text>
            </g>
          </svg>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        <Card className="flex flex-col h-full bg-zinc-900/20">
          <h3 className="text-[13px] font-bold text-zinc-200 mb-4 pb-2 border-b border-zinc-800">State Machine & Lifecycle</h3>
          <ul className="space-y-4 text-[12px] text-zinc-400 font-mono flex-1">
            <li className="flex gap-3">
              <span className="text-lime-400 font-bold w-20 flex-shrink-0">IDLE</span>
              <span>Daemon active, wake word engine listening continuously via circular audio buffer.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-400 font-bold w-20 flex-shrink-0">LISTENING</span>
              <span>Triggered by openwakeword. Streams buffered audio + active voice to VAD until silence is detected.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 font-bold w-20 flex-shrink-0">THINKING</span>
              <span>Audio passed to faster-whisper STT. Transcript passed to NLU Router. Intent executes or hits LLM.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-teal-400 font-bold w-20 flex-shrink-0">SPEAKING</span>
              <span>System plays Coqui TTS output whilst concurrently executing any system sub-processes (e.g. launching an app).</span>
            </li>
          </ul>
        </Card>

        <Card className="flex flex-col h-full bg-zinc-900/20">
          <h3 className="text-[13px] font-bold text-zinc-200 mb-4 pb-2 border-b border-zinc-800">Process & Data Isolation</h3>
          <p className="text-[12px] text-zinc-400 leading-relaxed mb-4">
            Security and stability necessitate isolating the voice daemon from the UI.
          </p>
          <ul className="space-y-3 text-[12px] text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-1.5 flex-shrink-0"></span>
              <span><b>larvox-daemon</b>: Headless service. Owns the microphone, AI models, and SQLite DB. Connects over <code>/run/user/$UID/larvox.sock</code>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
              <span><b>larvox-hud</b>: GTK4 client. Only connects to the socket to listen for state changes to animate the Lorapok mascot.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
              <span><b>larvox-api</b>: Optional FastAPI WebSocket server to stream telemetry and support remote multi-user collaboration across devices.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
              <span><b>Skills (Plugins)</b>: Loaded into isolated async Task execution pools inside the daemon to prevent blocking the main pipeline.</span>
            </li>
          </ul>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-4 border-b border-zinc-800 pb-2">Load-bearing Decisions</h3>
        
        <Card className="border-l-4 border-l-red-900/80">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-zinc-200 font-bold text-sm flex items-center">
                <span className="text-zinc-500 mr-3 font-mono text-[10px]">01</span> 
                Process architecture: daemon + IPC vs monolith
              </h4>
              <p className="mt-2 text-zinc-400 text-[12px] leading-relaxed">
                A monolith is tempting to start with, but if LARVOX runs as a systemd user service, the HUD is a separate GTK4 window, and skills need isolation from crashes, you need IPC from day one.
              </p>
            </div>
            <Tag variant="critical">Load-bearing</Tag>
          </div>
          <div className="mt-4 bg-zinc-900/50 p-3 rounded border border-zinc-800">
            <p className="text-[12px] text-zinc-400"><span className="text-lime-400 font-bold mr-2">Recommendation:</span>Use a Unix domain socket daemon from the start. Core daemon handles audio + AI, exposes a simple JSON-RPC socket. HUD and CLI both connect as clients.</p>
          </div>
        </Card>

        <Card className="border-l-4 border-l-red-900/80">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-zinc-200 font-bold text-sm flex items-center">
                <span className="text-zinc-500 mr-3 font-mono text-[10px]">02</span> 
                Skill plugin API contract
              </h4>
              <p className="mt-2 text-zinc-400 text-[12px] leading-relaxed">
                Once the community ships skills as pip packages, any breaking change to your plugin interface breaks every downstream skill. Design the API as if version 1 is final.
              </p>
            </div>
            <Tag variant="critical">Load-bearing</Tag>
          </div>
          <div className="mt-4 bg-zinc-900/50 p-3 rounded border border-zinc-800">
            <p className="text-[12px] text-zinc-400"><span className="text-lime-400 font-bold mr-2">Recommendation:</span>Define a LarvoxSkill base class with @intent(pattern) decorator registration. Each skill acts on a SkillRequest dataclass. Version the API.</p>
          </div>
        </Card>

        <Card className="border-l-4 border-l-red-900/80">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-zinc-200 font-bold text-sm flex items-center">
                <span className="text-zinc-500 mr-3 font-mono text-[10px]">03</span> 
                Audio pipeline segmentation strategy
              </h4>
              <p className="mt-2 text-zinc-400 text-[12px] leading-relaxed">
                The pipeline has three audio consumers with different needs: wake word (always-on), VAD (needs to detect speech end), and STT (needs a complete utterance).
              </p>
            </div>
            <Tag variant="critical">Load-bearing</Tag>
          </div>
          <div className="mt-4 bg-zinc-900/50 p-3 rounded border border-zinc-800">
            <p className="text-[12px] text-zinc-400"><span className="text-lime-400 font-bold mr-2">Recommendation:</span>Circular buffer with 80ms chunks. Wake word reads continuously. On trigger, swap to VAD mode, accumulate until 600ms silence, then flush to STT.</p>
          </div>
        </Card>

        <Card className="border-l-4 border-l-red-900/80">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-zinc-200 font-bold text-sm flex items-center">
                <span className="text-zinc-500 mr-3 font-mono text-[10px]">04</span> 
                Intent routing boundary: local classifier vs always-LLM
              </h4>
              <p className="mt-2 text-zinc-400 text-[12px] leading-relaxed">
                This decision defines your latency profile and your offline capability. Sending everything to the LLM feels elegant but kills responsiveness — "volume up" should execute in 150ms, not 2 seconds. The boundary you draw here becomes a constraint every future skill must respect.
              </p>
            </div>
            <Tag variant="critical">Load-bearing</Tag>
          </div>
          <div className="mt-4 bg-zinc-900/50 p-3 rounded border border-zinc-800">
            <p className="text-[12px] text-zinc-400"><span className="text-lime-400 font-bold mr-2">Recommendation:</span>Two-tier routing. Tier 1: keyword + regex matcher for the ~30 most common command patterns. Tier 2: anything that doesn't match tier 1 goes to the LLM with a 2s timeout.</p>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-500/80">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-zinc-200 font-bold text-sm flex items-center">
                <span className="text-zinc-500 mr-3 font-mono text-[10px]">05</span> 
                LLM cloud/local routing heuristics
              </h4>
              <p className="mt-2 text-zinc-400 text-[12px] leading-relaxed">
                You need a rule for when to use Claude API vs llama.cpp. This affects cost, latency, and offline usability. The wrong default (always cloud) will frustrate users on slow connections and cost money. But always local gives worse answers for complex queries.
              </p>
            </div>
            <Tag variant="default">Medium stakes</Tag>
          </div>
          <div className="mt-4 bg-zinc-900/50 p-3 rounded border border-zinc-800">
            <p className="text-[12px] text-zinc-400"><span className="text-lime-400 font-bold mr-2">Recommendation:</span>Default to local. Escalate to cloud if: (a) user config enables it, AND (b) the query is longer than 15 words, OR uses known-complex intent tags. Add a prefer_cloud: bool per-skill decorator.</p>
          </div>
        </Card>

        <Card className="border-l-4 border-l-blue-500/80">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-zinc-200 font-bold text-sm flex items-center">
                <span className="text-zinc-500 mr-3 font-mono text-[10px]">06</span> 
                Wake word engine choice
              </h4>
              <p className="mt-2 text-zinc-400 text-[12px] leading-relaxed">
                Both major options expose the same conceptual interface — you feed audio chunks and get a confidence score. Switching between them is a config + adapter change, not an architectural one.
              </p>
            </div>
            <Tag variant="default">Swappable</Tag>
          </div>
          <div className="mt-4 bg-zinc-900/50 p-3 rounded border border-zinc-800">
            <p className="text-[12px] text-zinc-400"><span className="text-lime-400 font-bold mr-2">Recommendation:</span>Start with OpenWakeWord — fully MIT, trainable, no API key. Use the pre-built "alexa" model as a stand-in for "Hey Larva" during development. Train a real custom model later.</p>
          </div>
        </Card>

        <Card className="border-l-4 border-l-blue-500/80">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-zinc-200 font-bold text-sm flex items-center">
                <span className="text-zinc-500 mr-3 font-mono text-[10px]">07</span> 
                STT model size and engine
              </h4>
              <p className="mt-2 text-zinc-400 text-[12px] leading-relaxed">
                faster-whisper makes model size a slider, not an architectural decision. You can switch from small.en to medium to large-v3 with one config line.
              </p>
            </div>
            <Tag variant="default">Swappable</Tag>
          </div>
          <div className="mt-4 bg-zinc-900/50 p-3 rounded border border-zinc-800">
            <p className="text-[12px] text-zinc-400"><span className="text-lime-400 font-bold mr-2">Recommendation:</span>Ship with small.en as default. Let power users set stt_model: medium in config. Add Vosk as an opt-in fallback for machines below 4GB RAM.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
