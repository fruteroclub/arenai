"use client";
import type { Battle } from "@/lib/mock-data";

function BattleCard({ battle }: { battle: Battle }) {
  const isActive = battle.status === "active";

  return (
    <div className={`bg-[#1a1a2e] border rounded-xl p-5 ${isActive ? "border-[#e63946] battle-active" : "border-[#2a2a3e]"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isActive ? (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#e63946] rounded-full animate-pulse" />
              <span className="text-xs text-[#e63946] font-bold uppercase">Live — Turn {battle.turn}</span>
            </span>
          ) : (
            <span className="text-xs text-[#2a9d8f] font-bold uppercase">Completed — {battle.turn} turns</span>
          )}
        </div>
        <span className="text-xs text-[#707080]">
          {new Date(battle.startedAt).toLocaleTimeString()}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <div className="text-xl font-black">{battle.p1}</div>
          {battle.p1Casualties.length > 0 && (
            <div className="text-xs text-[#e63946] mt-1">
              💀 {battle.p1Casualties.join(", ")}
            </div>
          )}
        </div>

        <div className="px-4">
          <div className="text-2xl font-black text-[#f4a261]">VS</div>
        </div>

        <div className="text-center flex-1">
          <div className="text-xl font-black">{battle.p2}</div>
          {battle.p2Casualties.length > 0 && (
            <div className="text-xs text-[#e63946] mt-1">
              💀 {battle.p2Casualties.join(", ")}
            </div>
          )}
        </div>
      </div>

      {battle.winner && (
        <div className="mt-3 text-center">
          <span className="text-sm font-bold text-[#f4a261]">🏆 {battle.winner} wins!</span>
        </div>
      )}
    </div>
  );
}

export function BattleFeed({ battles }: { battles: Battle[] }) {
  const active = battles.filter((b) => b.status === "active");
  const completed = battles.filter((b) => b.status === "completed");

  return (
    <section id="battles" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black mb-8">
          ⚔️ Battles
        </h2>

        {active.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm text-[#e63946] font-bold uppercase tracking-wider mb-4">
              🔴 Live Now
            </h3>
            <div className="space-y-4">
              {active.map((b) => <BattleCard key={b.id} battle={b} />)}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm text-[#707080] font-bold uppercase tracking-wider mb-4">
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
