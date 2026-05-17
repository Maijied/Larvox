import { useState } from "react";
import { Volume2, Settings2 } from "lucide-react";

export function TTSSettings() {
  const [emotion, setEmotion] = useState("neutral");

  const simulateSpeech = () => {
    const speakParams = {
      text: "This is a test of the text-to-speech system.",
      emotion: emotion
    };
    console.log("Invoking TTS with SpeakParams:", speakParams);
    alert(`Speaking with emotion: ${emotion}`);
  };

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight mb-2 text-white uppercase flex items-center gap-2">
          <Settings2 className="w-6 h-6 text-lime-400" /> TTS Settings
        </h2>
        <p className="text-[11px] text-zinc-400 uppercase tracking-widest">
          Configure Text-to-Speech voices and emotion parameters.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">
          Voice Configuration
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
              Default Emotion Tone
            </label>
            <p className="text-[11px] text-zinc-500 mb-4">
              Select the default emotional tone used by the TTS engine (coqui-tts). This value will be passed to `SpeakParams` when invoking the TTS module.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['neutral', 'helpful', 'empathetic', 'excited'].map((t) => (
                <button
                  key={t}
                  onClick={() => setEmotion(t)}
                  className={`px-4 py-3 rounded text-sm font-medium transition-all duration-200 border capitalize text-center ${
                    emotion === t
                      ? "bg-zinc-800 border-lime-400 text-lime-400 shadow-sm"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
              Generated SpeakParams
            </h4>
            <pre className="p-4 bg-zinc-950 rounded border border-zinc-800 text-zinc-300 font-mono text-[11px]">
{`const params = new SpeakParams({
  text: "This is a test of the text-to-speech system.",
  emotion: "${emotion}",
  speed: 1.0,
  session_id: "test-session"
});`}
            </pre>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={simulateSpeech}
                className="flex items-center gap-2 px-4 py-2 bg-lime-500 hover:bg-lime-400 text-zinc-950 font-bold rounded shadow-sm transition-colors text-xs uppercase tracking-widest"
              >
                <Volume2 className="w-4 h-4" />
                Test Voice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
