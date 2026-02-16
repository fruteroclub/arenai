"use client";

import { useState } from "react";
import { generateTeamFromText, type GeneratedTeam } from "@/lib/team-generator";

const ARCHETYPE_EMOJIS: Record<string, string> = {
  creative: "🎨", technical: "⚙️", strategic: "🐍", guardian: "🛡️",
  chaotic: "🌀", nature: "🌿", ancient: "🏛️", speed: "⚡",
};

const ARCHETYPE_COLORS: Record<string, string> = {
  creative: "#f95587", technical: "#b7b7ce", strategic: "#7c3aed",
  guardian: "#b6a136", chaotic: "#735797", nature: "#7ac74c",
  ancient: "#ee8130", speed: "#f7d02c",
};

const PRESETS = [
  {
    name: "The Visionary",
    emoji: "🎨",
    archetype: "creative",
    desc: "Dreams in color, builds in code. Art meets algorithm.",
    text: "I'm a creative visionary who sees beauty in everything. I dream of art that moves people, design that inspires, and imagination without limits. Music and poetry fuel my soul.",
  },
  {
    name: "The Engineer",
    emoji: "⚙️",
    archetype: "technical",
    desc: "Systems thinker. Debugs reality. Ships infrastructure.",
    text: "I'm a technical engineer obsessed with building robust systems. Clean architecture, solid infrastructure, elegant algorithms. I debug everything and trust the data.",
  },
  {
    name: "The Strategist",
    emoji: "🐍",
    archetype: "strategic",
    desc: "Three moves ahead. Every decision compounds.",
    text: "I'm a strategic leader who plans three moves ahead. I execute with precision, scale with vision, and lead with decisiveness. Growth is the only metric that matters.",
  },
  {
    name: "The Guardian",
    emoji: "🛡️",
    archetype: "guardian",
    desc: "Unbreakable walls. Protects what matters most.",
    text: "I protect what matters. Security, stability, trust — these are my pillars. I guard the fort, audit the risks, and ensure nothing breaks on my watch.",
  },
  {
    name: "The Rebel",
    emoji: "🌀",
    archetype: "chaotic",
    desc: "Breaks the rules. Hacks the system. Thrives in chaos.",
    text: "I'm a chaotic disruptor who breaks conventions. I hack systems, subvert expectations, and thrive in the wild unknown. Rules are suggestions. Weird is a compliment.",
  },
  {
    name: "The Gardener",
    emoji: "🌿",
    archetype: "nature",
    desc: "Nurtures growth. Builds community. Heals what's broken.",
    text: "I nurture growth in everything — people, gardens, communities. I heal what's broken, bring harmony to chaos, and believe nature always finds a way.",
  },
  {
    name: "The Oracle",
    emoji: "🏛️",
    archetype: "ancient",
    desc: "Ancient wisdom meets modern fire. Cycles within cycles.",
    text: "I carry ancient wisdom through modern cycles. The serpent sheds its skin but keeps its spine. Prophecy, ritual, fire — the old ways endure in new code.",
  },
  {
    name: "The Speedrunner",
    emoji: "⚡",
    archetype: "speed",
    desc: "Ship fast. Move faster. Speed is the ultimate strategy.",
    text: "I move at velocity. Ship fast, iterate faster, blitz through obstacles. Agile is not a methodology, it's a lifestyle. Quick decisions, rapid execution.",
  },
];

export default function CreatePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedTeam | null>(null);
  const [mode, setMode] = useState<"pick" | "custom">("pick");

  const handleGenerate = (inputText?: string) => {
    const t = inputText || text;
    if (!t.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const team = generateTeamFromText(t);
      setResult(team);
      setLoading(false);
    }, 2000);
  };

  const handlePresetClick = (preset: typeof PRESETS[0]) => {
    setText(preset.text);
    handleGenerate(preset.text);
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-6 relative">
      {/* Background effects */}
      <div className="fixed inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 30% 30%, #7c3aed33 0%, transparent 50%), radial-gradient(circle at 70% 70%, #ef444433 0%, transparent 50%)",
      }} />

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-[family-name:var(--font-orbitron)] font-black tracking-wider mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] via-[#06b6d4] to-[#fbbf24]">
              CREATE YOUR GYM
            </span>
          </h1>
          <p className="text-[#8b82a8] text-lg">
            choose your archetype. receive your team.
          </p>
        </div>

        {!result && !loading && (
          <div className="animate-fade-in-up">
            {/* Mode toggle */}
            <div className="flex justify-center gap-2 mb-8">
              <button
                onClick={() => setMode("pick")}
                className={`px-5 py-2 rounded-lg font-[family-name:var(--font-orbitron)] text-xs tracking-wider transition-all ${mode === "pick" ? "bg-[#7c3aed] text-white" : "border border-[#2a1f4e] text-[#8b82a8] hover:border-[#7c3aed]"}`}
              >
                ⚡ PICK AN ARCHETYPE
              </button>
              <button
                onClick={() => setMode("custom")}
                className={`px-5 py-2 rounded-lg font-[family-name:var(--font-orbitron)] text-xs tracking-wider transition-all ${mode === "custom" ? "bg-[#7c3aed] text-white" : "border border-[#2a1f4e] text-[#8b82a8] hover:border-[#7c3aed]"}`}
              >
                📝 DESCRIBE YOURSELF
              </button>
            </div>

            {mode === "pick" ? (
              /* Preset archetype grid */
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.archetype}
                    onClick={() => handlePresetClick(preset)}
                    className="group bg-[#1a1030]/80 border-2 rounded-2xl p-5 text-center transition-all duration-300 hover:scale-105 cursor-pointer"
                    style={{
                      borderColor: ARCHETYPE_COLORS[preset.archetype] + "30",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = ARCHETYPE_COLORS[preset.archetype];
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${ARCHETYPE_COLORS[preset.archetype]}33`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = ARCHETYPE_COLORS[preset.archetype] + "30";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    <div className="text-4xl mb-3">{preset.emoji}</div>
                    <div className="font-[family-name:var(--font-orbitron)] font-bold text-sm tracking-wider mb-2">
                      {preset.name}
                    </div>
                    <p className="text-[#8b82a8] text-xs leading-relaxed">{preset.desc}</p>
                  </button>
                ))}
              </div>
            ) : (
              /* Custom text input */
              <div className="bg-[#1a1030]/80 border border-[#7c3aed]/20 rounded-2xl p-8 backdrop-blur-sm">
                <label className="block text-sm font-[family-name:var(--font-orbitron)] text-[#7c3aed] tracking-wider mb-4">
                  📝 PERSONALITY PROFILE
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="I'm a creative engineer who loves building beautiful systems. I value harmony between design and logic, and I believe in the power of community. I move fast, break things, and always protect my team..."
                  className="w-full h-48 bg-[#0f0a1e] border border-[#2a1f4e] rounded-xl p-5 text-[#f0eef5] placeholder-[#4a3f6e] resize-none focus:outline-none focus:border-[#7c3aed] transition-colors text-lg"
                />
                <button
                  onClick={() => handleGenerate()}
                  disabled={!text.trim()}
                  className="mt-6 w-full py-4 bg-gradient-to-r from-[#7c3aed] to-[#ef4444] rounded-xl font-[family-name:var(--font-orbitron)] font-bold text-lg tracking-wider hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  ⚡ GENERATE MY TEAM
                </button>
              </div>
            )}

          </div>
        )}

        {/* Loading animation */}
        {loading && (
          <div className="mt-12 text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-3">
              {["🔥", "⚡", "🌊", "🐉", "✨", "💀"].map((emoji, i) => (
                <span
                  key={i}
                  className="text-4xl animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
            <p className="mt-6 text-[#8b82a8] font-[family-name:var(--font-orbitron)] text-sm tracking-wider animate-pulse">
              analyzing your soul...
            </p>
          </div>
        )}

        {/* Result card */}
        {result && (
          <div className="animate-fade-in-up">
            {/* Gym Leader Card */}
            <div
              className="holo-card bg-gradient-to-br from-[#1a1030] to-[#0f0a1e] border-2 rounded-2xl overflow-hidden"
              style={{ borderColor: ARCHETYPE_COLORS[result.archetype] + "60" }}
            >
              {/* Card header */}
              <div
                className="p-6 text-center relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${ARCHETYPE_COLORS[result.archetype]}20, transparent)`,
                }}
              >
                <div className="text-5xl mb-2">{ARCHETYPE_EMOJIS[result.archetype]}</div>
                <h2 className="text-2xl font-[family-name:var(--font-orbitron)] font-black tracking-wider uppercase">
                  {result.archetype} Gym Leader
                </h2>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <span
                    className={`type-${result.gymType.toLowerCase()} text-xs px-3 py-1 rounded-full font-bold`}
                  >
                    {result.gymType} GYM
                  </span>
                  <span className="text-[#8b82a8] text-xs">×</span>
                  <span className="text-xs text-[#8b82a8] font-[family-name:var(--font-orbitron)]">
                    {result.secondaryArchetype}
                  </span>
                </div>
                <p className="mt-3 text-[#fbbf24] italic text-sm">
                  &ldquo;{result.battleCry}&rdquo;
                </p>
              </div>

              {/* Team grid */}
              <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {result.team.map((mon, i) => (
                  <div
                    key={mon.species}
                    className="bg-[#0f0a1e]/80 border border-[#2a1f4e] rounded-xl p-4 text-center hover:border-[#7c3aed]/40 transition-all animate-fade-in-up group"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mon.sprite}
                      alt={mon.species}
                      className="w-20 h-20 mx-auto object-contain animate-float group-hover:scale-110 transition-transform"
                      style={{ animationDelay: `${i * 0.5}s` }}
                    />
                    <div className="font-[family-name:var(--font-orbitron)] text-sm font-bold mt-2">
                      {mon.species}
                    </div>
                    <div className="flex gap-1 justify-center mt-1">
                      {mon.types.map((t) => (
                        <span
                          key={t}
                          className={`type-${t.toLowerCase()} text-[9px] px-2 py-0.5 rounded-full font-bold`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="text-[10px] text-[#8b82a8] mt-1">{mon.ability}</div>
                    <div className="mt-2 space-y-0.5">
                      {mon.moves.map((m) => (
                        <div key={m} className="text-[9px] text-[#6b6290]">
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[#2a1f4e]/50 flex justify-between items-center">
                <span className="text-[10px] text-[#6b6290] font-[family-name:var(--font-orbitron)]">
                  ARENAI GYM CARD
                </span>
                <span className="text-[10px] text-[#6b6290]">
                  {result.style} · {result.archetype}/{result.secondaryArchetype}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={() => { setResult(null); setText(""); }}
                className="px-8 py-3 border-2 border-[#7c3aed]/40 hover:border-[#7c3aed] rounded-xl font-[family-name:var(--font-orbitron)] font-bold text-sm tracking-wider text-[#7c3aed] hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all duration-300"
              >
                ← TRY AGAIN
              </button>
              <a
                href="/battle"
                className="px-8 py-3 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-xl font-[family-name:var(--font-orbitron)] font-bold text-sm tracking-wider hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] transition-all duration-300"
              >
                BATTLE NOW →
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
