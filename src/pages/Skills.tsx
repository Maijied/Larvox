import { Card } from "../components/ui";

export function Skills() {
  const groups = [
    {
      title: "System control",
      badge: { bg: "bg-lime-900/30", text: "text-lime-400", label: "D-Bus + subprocess" },
      pattern: "@intent(r'open\\s+(?P<app>\\w+)|volume\\s+(?P<level>up|down|mute|\\d+)')",
      commands: [
        { voice: "Open Firefox", action: "xdg-open / gtk-launch firefox" },
        { voice: "Volume up", action: "pactl set-sink-volume @DEFAULT_SINK@ +10%" },
        { voice: "Take a screenshot", action: "gnome-screenshot -i" },
        { voice: "Turn off Bluetooth", action: "rfkill block bluetooth" },
        { voice: "Set brightness to 50%", action: "brightnessctl set 50%" },
        { voice: "Connect to the Lorapok WiFi", action: "nmcli device wifi connect Lorapok" }
      ]
    },
    {
      title: "Window & Workspace Management",
      badge: { bg: "bg-indigo-900/30", text: "text-indigo-400", label: "wmctrl / Wayland protocols" },
      pattern: "@intent(r'(close|minimize|maximize)\\s+window|switch\\s+to\\s+(?P<app>\\w+)')",
      commands: [
        { voice: "Close this window", action: "wmctrl -c :ACTIVE: (X11) / wtype (Wayland)" },
        { voice: "Switch to terminal", action: "wmctrl -a 'terminal'" },
        { voice: "Move to workspace 2", action: "wmctrl -s 1" },
        { voice: "Split screen left", action: "simulate Super+Left" }
      ]
    },
    {
      title: "System Administration (God-Mode)",
      badge: { bg: "bg-red-900/30", text: "text-red-400", label: "APT/Snap + pkexec" },
      pattern: "@intent(r'(install|update|remove|kill|mount|fix)\\s+(?P<target>.*)')",
      commands: [
        { voice: "Install VLC media player", action: "pkexec apt install -y vlc → TTS success" },
        { voice: "Update all system packages", action: "apt update && apt upgrade → Stream output" },
        { voice: "Fix my broken apt dependencies", action: "dpkg --configure -a && apt --fix-broken install → Auto-Heal pipeline" },
        { voice: "Kill the process using the most RAM", action: "psutil sort → kill -9 → TTS confirmation" },
        { voice: "Mount my external USB drive", action: "udisksctl mount -b /dev/sdb1" }
      ]
    },
    {
      title: "Container & Network Ops",
      badge: { bg: "bg-cyan-900/30", text: "text-cyan-400", label: "Docker SDK + nmap" },
      pattern: "@intent(r'(deploy|run|kill)\\s+(container|docker)|scan\\s+network')",
      commands: [
        { voice: "Deploy a Postgres database container", action: "Docker SDK → pull image → run -d -p 5432:5432 → TTS port binding" },
        { voice: "Prune all dangling Docker volumes", action: "docker system prune -f → TTS reclaimed space" },
        { voice: "Scan my local network for devices", action: "nmap -sn 192.168.1.0/24 → LLM Summarize active hosts" }
      ]
    },
    {
      title: "Shell & Script Generation",
      badge: { bg: "bg-emerald-900/30", text: "text-emerald-400", label: "LLM + execution" },
      pattern: "@intent(r'(write|create)\\s+a\\s+script\\s+to\\s+(?P<task>.*)')",
      commands: [
        { voice: "Write and run a script to backup my documents", action: "LLM writes bash → saves to /tmp → chmod +x → executes" },
        { voice: "Find all large files and delete them", action: "LLM constructs 'find' command → asks confirmation → executes" },
        { voice: "Restart the network manager", action: "systemctl restart NetworkManager" }
      ]
    },
    {
      title: "Semantic Desktop Search (RAG)",
      badge: { bg: "bg-fuchsia-900/30", text: "text-fuchsia-400", label: "ChromaDB + Embeddings" },
      pattern: "@intent(r'(find|recall)\\s+(the\\s+document|when\\s+I)\\s+(?P<query>.*)')",
      commands: [
        { voice: "Find the PDF about Machine Learning", action: "Query Vector DB → Match embedding → xdg-open" },
        { voice: "Search my notes for tax receipt info", action: "RAG pipeline → extract answers from local markdown/PDF files → TTS" },
        { voice: "Recall what we talked about yesterday regarding my code", action: "Query SQLite Conversation History + Vector matching → Synthesis" }
      ]
    },
    {
      title: "File operations",
      badge: { bg: "bg-teal-900/30", text: "text-teal-400", label: "pathlib + subprocess" },
      pattern: "@intent(r'(find|search)\\s+(file|folder)\\s+(?P<query>.*)')",
      commands: [
        { voice: "Find file report.pdf", action: "fd-find 'report.pdf' ~" },
        { voice: "Open Downloads folder", action: "xdg-open ~/Downloads" },
        { voice: "Show recent files", action: "GTK recent-manager API" },
        { voice: "Empty trash", action: "gio trash --empty" }
      ]
    },
    {
      title: "Media & Smart Home",
      badge: { bg: "bg-pink-900/30", text: "text-pink-400", label: "MPRIS + MQTT" },
      pattern: "@intent(r'(play|pause|next|previous)(\\s+music)?|turn\\s+(?P<state>on|off)\\s+(?P<device>.*)')",
      commands: [
        { voice: "Pause music", action: "playerctl pause" },
        { voice: "Next track", action: "playerctl next" },
        { voice: "Turn on the desk lamp", action: "MQTT publish -> home/desk_lamp/set ON" },
        { voice: "Dim lights to 50%", action: "MQTT publish -> home/lights/brightness 50" }
      ]
    },
    {
      title: "Deep Web Research & Synthesis",
      badge: { bg: "bg-blue-900/30", text: "text-blue-400", label: "Search APIs + LLM Reasoning" },
      pattern: "@intent(r'(search|research|find\\s+out|who\\s+is)\\s+(?P<topic>.*)')",
      commands: [
        { voice: "Who won the game last night?", action: "Web Search → LLM Extraction → Brief TTS answer" },
        { voice: "Research the history of Wayland vs X11", action: "Multi-query SerpAPI search → Scraping → Deep synthesis → TTS Summary" },
        { voice: "Find out why my package failed to build", action: "Search GitHub issues & StackOverflow → Summarize fix → TTS/Terminal" },
        { voice: "Read me the top Hacker News post", action: "Scrape HN → LLM content extraction → TTS" }
      ]
    },
    {
      title: "Information & Productivity",
      badge: { bg: "bg-purple-900/30", text: "text-purple-400", label: "APIs + local DB" },
      pattern: "@intent(r'weather\\s+in\\s+(?P<city>\\w+)|remind\\s+me\\s+(?P<task>.*)')",
      commands: [
        { voice: "What's the weather today?", action: "curl -s 'wttr.in?format=j1'" },
        { voice: "Remind me to call John in 2 hours", action: "SQLite insert -> tasks table + async Timer" },
        { voice: "What time is it in Tokyo?", action: "pytz timezone lookup" }
      ]
    },
    {
      title: "Development Assist",
      badge: { bg: "bg-amber-900/30", text: "text-amber-400", label: "subprocess + Claude" },
      pattern: "@intent(r'git\\s+(status|diff|commit)|explain\\s+(this\\s+error|code)')",
      commands: [
        { voice: "Show git status", action: "git status -s → LLM summary → TTS" },
        { voice: "Run the tests", action: "subprocess (pytest / npm test)" },
        { voice: "Explain this compilation error", action: "clipboard.read() → Claude API" },
        { voice: "Analyze this code snippet", action: "xclip -o → Advanced Syntax Explainer → TTS" },
        { voice: "Commit with message 'fix bug'", action: "git commit -m 'fix bug'" }
      ]
    },
    {
      title: "Settings & Configuration",
      badge: { bg: "bg-teal-900/30", text: "text-teal-400", label: "Settings modification" },
      pattern: "@intent(r'(change|set)\\s+voice\\s+(?P<setting>emotion|speed)\\s+to\\s+(?P<value>\\w+)')",
      commands: [
        { voice: "Change voice emotion to helpful", action: "Update SpeakParams.emotion → TTS confirmation" },
        { voice: "Set speaking speed to 1.5", action: "Update SpeakParams.speed = 1.5 → TTS confirmation" },
        { voice: "Switch to empathetic voice", action: "Update SpeakParams.emotion = empathetic" }
      ]
    },
    {
      title: "AI Conversation",
      badge: { bg: "bg-zinc-800", text: "text-zinc-300", label: "Claude / llama.cpp" },
      pattern: "@intent(r'fallback_llm', priority=-1)",
      commands: [
        { voice: "Explain quantum entanglement", action: "LLM (streaming) → XTTS stream" },
        { voice: "Write an email draft", action: "LLM → clipboard paste via xclip" },
        { voice: "Translate clipboard to French", action: "xclip -o → LLM translation" },
        { voice: "Summarize this article", action: "Extract text → LLM → TTS" },
        { voice: "Brainstorm project names", action: "LLM → conversational back-and-forth" },
        { voice: "What was I just asking about?", action: "Query SQLite context history → TTS" }
      ]
    },
    {
      title: "Accessibility & Vision",
      badge: { bg: "bg-fuchsia-900/30", text: "text-fuchsia-400", label: "Tesseract OCR / Claude" },
      pattern: "@intent(r'(look\\s+at\\s+my\\s+screen|what\\s+is\\s+this|read\\s+screen)')",
      commands: [
        { voice: "Read the entire screen to me", action: "maim + pytesseract (Full Screen) → TTS" },
        { voice: "Read this specific area", action: "maim -s (Bounding Box) + pytesseract → TTS" },
        { voice: "Look at my screen, why is this code failing?", action: "gnome-screenshot → Claude Vision API → TTS" },
        { voice: "Identify this icon", action: "Crop screenshot → Vision API → TTS" }
      ]
    },
    {
      title: "Proactive Suggestions",
      badge: { bg: "bg-orange-900/30", text: "text-orange-400", label: "Behavior Analysis" },
      pattern: "@event(r'system_idle_long|high_cpu_usage')",
      commands: [
        { voice: "(Proactive) You seem stuck, need help?", action: "Detect long IDE idle time → audio prompt" },
        { voice: "(Proactive) CPU is high, should I kill Docker?", action: "Monitor htop → LLM classifies state → Prompt" },
        { voice: "(Proactive) Should I start your morning playlist?", action: "Time + behavior match → suggest music" }
      ]
    },
    {
      title: "Kernel & Telemetry Tuning",
      badge: { bg: "bg-yellow-900/30", text: "text-yellow-400", label: "sysctl + Systemd" },
      pattern: "@intent(r'(tune|optimize|set)\\s+(kernel|telemetry|vm)\\s+(?P<value>.*)')",
      commands: [
        { voice: "Optimize kernel for compiling", action: "sysctl -w vm.swappiness=10 → TTS" },
        { voice: "Enable maximum performance mode", action: "cpupower frequency-set -g performance" },
        { voice: "Drop memory caches", action: "sync; echo 3 > /proc/sys/vm/drop_caches" }
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-lg font-bold tracking-tight mb-1 text-white uppercase">Skill Patterns</h2>
        <p className="text-[11px] text-zinc-500 uppercase tracking-widest">Each skill is a standalone plugin. Voice command → intent → action → response.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {groups.map((group, i) => (
          <div key={i} className="mb-4">
            <div className="flex flex-col gap-1 mb-4 pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded ${group.badge.bg} ${group.badge.text}`}>
                  {group.title}
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">{group.badge.label}</span>
              </div>
              <div className="text-[10px] text-zinc-600 font-mono mt-1 px-2 py-1 bg-zinc-950 rounded bg-opacity-50 inline-block w-fit border border-zinc-800/50">
                {group.pattern}
              </div>
            </div>
            
            <div className="space-y-3 pl-2">
              {group.commands.map((cmd, j) => (
                <div key={j} className="grid grid-cols-[1fr_auto] items-center gap-4 text-[12px]">
                  <span className="text-zinc-300 italic">"{cmd.voice}"</span>
                  <span className="text-zinc-600 font-mono text-[10px] bg-zinc-900/50 px-2 py-0.5 rounded border border-zinc-800">→ {cmd.action}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
