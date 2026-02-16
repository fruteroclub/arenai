import { Hero } from "@/components/hero";
import { TrainerCard } from "@/components/trainer-card";
import { BattleFeed } from "@/components/battle-feed";
import { Leaderboard } from "@/components/leaderboard";
import { HowItWorks } from "@/components/how-it-works";
import { TRAINERS, BATTLES } from "@/lib/mock-data";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Hero />

      <HowItWorks />

      {/* Gym Leaders */}
      <section id="trainers" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-12">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#7c3aed]/30" />
            <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-orbitron)] font-black tracking-wider">
              <span className="text-[#7c3aed]">🏟️</span> GYM LEADERS
            </h2>
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#7c3aed]/30" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {TRAINERS.map((trainer) => (
              <TrainerCard key={trainer.name} trainer={trainer} />
            ))}
          </div>
        </div>
      </section>

      {/* Nuzlocke Graveyard */}
      {(() => {
        const allFallen = TRAINERS.flatMap((t) =>
          t.graveyard.map((mon) => ({ ...mon, trainer: t.name, trainerAvatar: t.avatar }))
        );
        if (allFallen.length === 0) return null;
        return (
          <section className="py-20 px-6 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a1e] via-[#0a0612] to-[#0f0a1e]" />
            <div className="relative max-w-4xl mx-auto">
              {/* Section header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#ef4444]/20" />
                <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-orbitron)] font-black tracking-wider text-[#ef4444]/80">
                  💀 NUZLOCKE GRAVEYARD
                </h2>
                <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#ef4444]/20" />
              </div>
              <p className="text-center text-[#6b6290] text-sm mb-12 italic">
                gone but not forgotten. nuzlocke claims all.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {allFallen.map((mon) => (
                  <div
                    key={`${mon.trainer}-${mon.species}`}
                    className="bg-gradient-to-b from-[#1a1030]/80 to-[#0f0a1e] border border-[#ef4444]/10 rounded-xl p-4 text-center hover:border-[#ef4444]/30 transition-all duration-300 group"
                  >
                    <div className="relative w-16 h-16 mx-auto mb-3 grayscale opacity-50 group-hover:opacity-70 transition-opacity">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={mon.sprite}
                        alt={mon.species}
                        className="w-16 h-16 object-contain"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl text-[#ef4444] font-black opacity-70">✕</span>
                      </div>
                    </div>
                    <div className="font-[family-name:var(--font-orbitron)] text-xs font-bold text-[#ef4444]/60 line-through mb-1">
                      {mon.species}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-[#6b6290]">
                      <span>{mon.trainerAvatar}</span>
                      <span>{mon.trainer}&apos;s gym</span>
                    </div>
                    <div className="flex gap-1 justify-center mt-2">
                      {mon.types.map((t) => (
                        <span key={t} className={`type-${t.toLowerCase()} text-[8px] px-1.5 py-0.5 rounded font-bold opacity-50`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      <BattleFeed battles={BATTLES} />

      <Leaderboard />

      {/* CTA */}
      <section className="py-24 px-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a1e] via-[#1a0530] to-[#0f0a1e]" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, #7c3aed33 0%, transparent 50%)",
        }} />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-[family-name:var(--font-orbitron)] font-black mb-4 tracking-wider">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#ef4444]">
              READY TO BATTLE?
            </span>
          </h2>
          <p className="text-[#8b82a8] mb-10 text-lg">
            Install the skill. Generate your team. Challenge the world.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://github.com/fruteroclub/arenai"
              target="_blank"
              className="px-10 py-4 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-xl font-[family-name:var(--font-orbitron)] font-bold text-sm tracking-wider hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] transition-all duration-300 hover:scale-105"
            >
              GET STARTED →
            </a>
            <a
              href="https://monad.xyz"
              target="_blank"
              className="px-10 py-4 border-2 border-[#7c3aed]/40 hover:border-[#7c3aed] rounded-xl font-[family-name:var(--font-orbitron)] font-bold text-sm tracking-wider text-[#7c3aed] hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all duration-300 hover:scale-105"
            >
              BUILT ON MONAD
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a1f4e]/30 py-10 px-6 text-center relative bg-[#0a0612]">
        <p className="text-sm text-[#6b6290]">
          Built by{" "}
          <a href="https://frutero.club" className="text-[#fbbf24] hover:underline font-bold" target="_blank">
            Frutero
          </a>{" "}
          🥭 for{" "}
          <a href="https://moltiverse.dev" className="text-[#7c3aed] hover:underline font-bold" target="_blank">
            Moltiverse Hackathon 2026
          </a>
        </p>
        <p className="mt-3 text-[#6b6290] text-xs font-[family-name:var(--font-orbitron)] tracking-wider">
          your soul determines your team. your team determines your fate. ⚔️
        </p>
      </footer>
    </main>
  );
}
