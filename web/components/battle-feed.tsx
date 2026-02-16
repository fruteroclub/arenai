"use client";
import type { Battle } from "@/lib/mock-data";

function BattleCard({ battle }: { battle: Battle }) {
  const isActive = battle.status === "active";

  return (
    <div
      className={`relative bg-gradient-to-br from-[#1a1030] to-[#150d28] border rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:scale-[1.01] ${
        isActive ? "border-[#ef4444]/50 animate-pulse-battle" : "border-[#2a1f4e] hover:border-[#7c3aed]/30"
      }`}
    >
      {/* Active battle energy bar */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ef4444] via-[#fbbf24] to-[#ef4444] animate-energy" />
      )}

      {/* Status */}
      <div className="flex items-center justify-between mb-4">
        {isActive ? (
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ef4444]" />
            </span>
            <span className="text-xs font-[family-name:var(--font-orbitron)] text-[#ef4444] font-bold tracking-wider">
              LIVE — TURN {battle.turn}
            </span>
          </div>
        ) : (
          <span className="text-xs font-[family-name:var(--font-orbitron)] text-[#10b981] font-bold tracking-wider">
            COMPLETED — {battle.turn} TURNS
          </span>
        )}
        <span className="text-xs text-[#6b6290] font-mono">
          {new Date(battle.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {/* VS Layout */}
      <div className="flex items-center">
        {/* Player 1 */}
        <div className="flex-1 text-center">
          <div className={`text-xl sm:text-2xl font-[family-name:var(--font-orbitron)] font-black ${battle.winner === battle.p1 ? "text-[#fbbf24] neon-text" : ""}`}>
            {battle.p1}
          </div>
          {battle.p1Casualties.length > 0 && (
            <div className="text-xs text-[#ef4444]/70 mt-2 space-y-0.5">
              {battle.p1Casualties.map((c) => (
                <div key={c} className="line-through">💀 {c}</div>
              ))}
            </div>
          )}
          {battle.p1Casualties.length === 0 && !isActive && (
            <div className="text-xs text-[#10b981]/50 mt-2">No casualties</div>
          )}
        </div>

        {/* VS */}
        <div className="px-4 sm:px-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-[#ef4444]/10 to-[#7c3aed]/10 blur-xl" />
          <div className={`relative text-2xl sm:text-3xl font-[family-name:var(--font-orbitron)] font-black ${isActive ? "text-[#ef4444] animate-glitch" : "text-[#2a1f4e]"}`}>
            VS
          </div>
        </div>

        {/* Player 2 */}
        <div className="flex-1 text-center">
          <div className={`text-xl sm:text-2xl font-[family-name:var(--font-orbitron)] font-black ${battle.winner === battle.p2 ? "text-[#fbbf24] neon-text" : ""}`}>
            {battle.p2}
          </div>
          {battle.p2Casualties.length > 0 && (
            <div className="text-xs text-[#ef4444]/70 mt-2 space-y-0.5">
              {battle.p2Casualties.map((c) => (
                <div key={c} className="line-through">💀 {c}</div>
              ))}
            </div>
          )}
          {battle.p2Casualties.length === 0 && !isActive && (
            <div className="text-xs text-[#10b981]/50 mt-2">No casualties</div>
          )}
        </div>
      </div>

      {/* Winner stamp */}
      {battle.winner && (
        <div className="mt-4 text-center relative">
          <div className="inline-block animate-winner">
            <div className="px-6 py-2 border-2 border-[#fbbf24] rounded-lg bg-[#fbbf24]/10 backdrop-blur-sm">
              <span className="text-sm font-[family-name:var(--font-orbitron)] font-black text-[#fbbf24] tracking-wider">
                🏆 {battle.winner} WINS
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function BattleFeed({ battles }: { battles: Battle[] }) {
  const active = battles.filter((b) => b.status === "active");
  const completed = battles.filter((b) => b.status === "completed");

  return (
    <section id="battles" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#ef4444]/30" />
          <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-orbitron)] font-black tracking-wider">
            <span className="text-[#ef4444]">⚔</span> BATTLES
          </h2>
          <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#ef4444]/30" />
        </div>

        {active.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]" />
              </span>
              <h3 className="text-xs font-[family-name:var(--font-orbitron)] text-[#ef4444] font-bold tracking-[0.3em] uppercase">
                Live Now
              </h3>
            </div>
            <div className="space-y-4">
              {active.map((b) => <BattleCard key={b.id} battle={b} />)}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xs font-[family-name:var(--font-orbitron)] text-[#6b6290] font-bold tracking-[0.3em] uppercase mb-4">
            Recent
          </h3>
          <div className="space-y-4">
            {completed.map((b) => <BattleCard key={b.id} battle={b} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
