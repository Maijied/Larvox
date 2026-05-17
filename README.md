<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/terminal-square.svg" width="80" height="80" alt="LARVOX Logo" />
  <h1>LARVOX</h1>
  <p><strong>Lorapok AI Response & Voice Operating eXperience</strong></p>
  <p><em>"Your system, listening. Always."</em></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#skills-api">Skills API</a>
  </p>
</div>

---

**LARVOX** is a next-generation, offline-first voice assistant specifically engineered for Linux environments (Ubuntu 22.04 LTS+). Blending an organic "Biological UI" aesthetic with deep OS integration, LARVOX isn't just a chatbot—it’s an omnipresent command center. It leverages an advanced IPC architecture to control system internals, parse your screen, manage Docker infrastructure, and synthesize voice responses locally.

Whether you're debugging deep dependency chains or just want to dim your screen, LARVOX executes actions securely, swiftly, and locally.

## ✨ Core Features

* **Absolute System Control (God-Mode):** Update packages via `pkexec`, control system states via `D-Bus`, terminate errant processes, and route Wayland windows purely by voice.
* **Proactive Intelligence:** LARVOX monitors telemetry (CPU spikes, memory leaks, IDE idle times). If you're stuck, it notices and proactively offers assistance.
* **Hybrid Local/Cloud Inference:** Operates fiercely offline using fast `llama-cpp-python` and `faster-whisper`. For immense cognitive lifting, seamlessly escalates to Google Gemini or Anthropic Claude.
* **DevOps & Infrastructure Ready:** Native integration with `docker` SDKs and networking utilities (`nmap`). Deploy databases and map local networks effortlessly.
* **Persistent Knowledge (RAG):** Embeds your local documents into a local ChromaDB instance, forming an encyclopedic memory of your files and past interactions.
* **On-the-fly Shell Execution:** Understands intent, writes validated shell scripts dynamically, and executes complex pipelines (e.g., "Find all logs > 1GB and zip them").
* **Transparent HUD / Biological UI:** An overlay interface written in GTK4 utilizing Wayland's layer-shell, pulsing naturally to visualize thinking, listening, and executing states.
* **Extensible RPC Plugin System:** Write skills in pure Python, hooking effortlessly into the core NLU router.

## 🚀 Example Capabilities

> **"Hey Larva, deploy a Postgres instance on port 5432."**
> *Action: Resolves intent, leverages Docker SDK, pulls the image, binds the port, and verbally confirms readiness.*

> **"Hey Larva, fix my broken apt dependencies."**
> *Action: Chains `dpkg --configure -a` and `apt --fix-broken install` using secure `pkexec` policies.*

> **"Hey Larva, I'm stuck on this codebase. Analyze my screen."**
> *Action: Captures a bounding-box screenshot via `maim`, pipes through local OCR (`pytesseract`) or vision model, and synthesizes strategic coaching.*

## 🏗️ Architecture

LARVOX is divided into heavily decoupled domains, communicating over lightning-fast Unix Domain Sockets via JSON-RPC.

1. **`larvox-core`**: The omniscient daemon. Implements the `asyncio` event loop, manages the PyAudio stream, handles multi-model Wake Word detection (`openwakeword`), and orchestrates the NLU router.
2. **`larvox-hud`**: The visual layer. A low-overhead GTK4/Wayland transparent overlay that consumes telemetry from the IPC server.
3. **`larvox-skills`**: The capability matrix. Dynamically loaded python modules implementing the `LarvoxSkill` interface.
4. **`larvox-api`**: A FastAPI component exposing WebSockets for Control Panel administration and remote access.

## 📦 Installation & Setup

### Requirements
* **OS:** Ubuntu 22.04 LTS, Debian 12, or equivalent (Wayland heavily preferred).
* **Environment:** Python 3.11+, `pip`, `venv`.
* **Hardware:** A working microphone. (NVIDIA GPU with CUDA highly recommended for latency-free STT/TTS).

### Step 1: System Dependencies
```bash
sudo apt update
sudo apt install portaudio19-dev python3-gi python3-gi-cairo gir1.2-gtk-4.0
```

### Step 2: Clone and Bootstrap
```bash
git clone https://github.com/lorapoklabs/larvox.git ~/larvox
cd ~/larvox
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Step 3: Run the Ecosystem

It's highly recommended to use `tmux` or multiple terminals during the initial setup.

**Start the IPC Daemon (Core Logic):**
```bash
source ~/larvox/.venv/bin/activate
python -m larvox_core.daemon
```

**Start the HUD (Visual Layer):**
```bash
source ~/larvox/.venv/bin/activate
python -m larvox_hud.main
```

### Step 4: Configuration & God-Mode Tuning
Upon the first boot, `larvox-core` generates `~/.config/larvox/config.toml`. 

Open this file (or use the web **Control Panel**) to insert your API keys for fallback models (Gemini/Claude) and tune proactive threshold limits.

## ⚙️ Enable Auto-Start (Systemd Service)

To allow the LARVOX daemon to start automatically upon login and run in the background without keeping a terminal open, you can install the provided systemd user service.

1. **Copy the service file:**
   ```bash
   mkdir -p ~/.config/systemd/user/
   cp larvox.service ~/.config/systemd/user/
   ```

2. **Reload systemd and enable the service:**
   ```bash
   systemctl --user daemon-reload
   systemctl --user enable --now larvox.service
   ```

3. **Check the status & view logs:**
   ```bash
   systemctl --user status larvox.service
   journalctl --user -u larvox.service -f
   ```

## 🛠️ The Skills API

Writing a skill is simple. LARVOX utilizes decorator-based intent mapping.

```python
from larvox_core.skills import LarvoxSkill, intent

class SystemSanitizeSkill(LarvoxSkill):
    @intent(r'(clean|sanitize|optimize)\s+my\s+(system|os)')
    async def handle_cleanup(self, request):
        self.speak("Initiating system purge. Removing orphaned dependencies.", tone="technical")
        
        # Built-in context allows root execution with configured polkit rules
        success, logs = await self.system.exec_root("apt-get autoremove -y && journalctl --vacuum-time=3d")
        
        if success:
            return self.speak("System optimized. We reclaimed 1.2 Gigabytes of space.")
        else:
            return self.speak(f"Optimization failed. The trace is: {logs[-1]}")
```

## 🌍 Community & Roadmap

We are moving fast. The Control Panel UI, advanced snap packaging (`snapcraft`), and deep GNOME Shell integrations are landing soon.

* **Check the extensive roadmap inside the React documentation package.**
* **Simulate the architecture locally:** `npm install && npm run dev` inside this repository to launch the interactive documentation and HUD simulator.

## 📜 License

LARVOX is released under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <p>Built with precision by <strong>Lorapok Labs © 2024</strong></p>
</div>
