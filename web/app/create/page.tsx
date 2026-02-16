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

export default function CreatePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedTeam | null>(null);

  const handleGenerate = () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    // Fake delay for drama
    setTimeout(() => {
      const team = generateTeamFromText(text);
      setResult(team);
      setLoading(false);
    }, 2500);
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
            describe your soul. receive your team.
          </p>
        </div>

        {!result && (
          <div className="animate-fade-in-up">
            {/* Input card */}
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
                onClick={handleGenerate}
                disabled={loading || !text.trim()}
                className="mt-6 w-full py-4 bg-gradient-to-r from-[#7c3aed] to-[#ef4444] rounded-xl font-[family-name:var(--font-orbitron)] font-bold text-lg tracking-wider hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "ANALYZING SOUL..." : "⚡ GENERATE MY TEAM"}
              </button>
            </div>

            {/* Loading animation */}
            {loading && (
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-3">
                  {["🔥", "⚡", "🌊", "🐉", "✨", "💀"].map((emoji, i) => (
                    <span
                      key={i}
                      className="text-3xl animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-[#8b82a8] font-[family-name:var(--font-orbitron)] text-sm tracking-wider animate-pulse">
                  scanning personality matrix...
                </p>
              </div>
            )}
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
