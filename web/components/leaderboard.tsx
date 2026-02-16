"use client";
import { LEADERBOARD } from "@/lib/mock-data";

const RANK_STYLES = [
  { badge: "🥇", color: "#fbbf24", bg: "from-[#fbbf24]/10 to-transparent", border: "border-[#fbbf24]/30" },
  { badge: "🥈", color: "#c0c0c0", bg: "from-[#c0c0c0]/5 to-transparent", border: "border-[#c0c0c0]/20" },
  { badge: "🥉", color: "#cd7f32", bg: "from-[#cd7f32]/5 to-transparent", border: "border-[#cd7f32]/20" },
  { badge: "", color: "#6b6290", bg: "from-transparent to-transparent", border: "border-transparent" },
];

export function Leaderboard() {
  return (
    <section id="leaderboard" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#fbbf24]/30" />
          <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-orbitron)] font-black tracking-wider">
            <span className="text-[#fbbf24]">🏆</span> RANKINGS
          </h2>
          <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#fbbf24]/30" />
        </div>

        {/* Table */}
        <div className="bg-gradient-to-br from-[#1a1030] to-[#150d28] border border-[#2a1f4e] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-[60px_1fr_80px_60px_60px_80px_70px_50px] gap-2 px-5 py-3 border-b border-[#2a1f4e] text-[9px] font-[family-name:var(--font-orbitron)] text-[#6b6290] tracking-[0.2em] uppercase">
            <div>RANK</div>
            <div>TRAINER</div>
            <div className="text-center">GYM</div>
            <div className="text-center">W</div>
            <div className="text-center">L</div>
            <div className="text-center">WIN %</div>
            <div className="text-center">STREAK</div>
            <div className="text-center">☠️</div>
          </div>

          {/* Rows */}
          {LEADERBOARD.map((entry, i) => {
            const rank = RANK_STYLES[Math.min(i, 3)];
            return (
              <div
                key={entry.name}
                className={`grid grid-cols-[auto_1fr_auto] sm:grid-cols-[60px_1fr_80px_60px_60px_80px_70px_50px] gap-2 sm:gap-2 items-center px-5 py-4 border-b border-[#2a1f4e]/50 last:border-0 bg-gradient-to-r ${rank.bg} hover:bg-[#221540] transition-all duration-300 group`}
              >
                {/* Rank */}
                <div className="flex items-center gap-1">
                  {rank.badge ? (
                    <span className="text-2xl">{rank.badge}</span>
                  ) : (
                    <span className="text-lg font-[family-name:var(--font-orbitron)] font-black text-[#6b6290] ml-1">{i + 1}</span>
                  )}
                </div>

                {/* Trainer */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{entry.avatar}</span>
                  <span className="font-[family-name:var(--font-orbitron)] font-bold text-sm tracking-wide" style={{ color: rank.color }}>
                    {entry.name}
                  </span>
                </div>

                {/* Gym type */}
                <div className="text-center hidden sm:block">
                  <span className={`type-${entry.gymType.toLowerCase()} text-[10px] px-2.5 py-1 rounded-lg font-bold`}>
                    {entry.gymType}
                  </span>
                </div>

                {/* Mobile: compact stats row */}
                <div className="sm:hidden col-span-3 flex gap-4 text-xs mt-1 ml-10">
                  <span className={`type-${entry.gymType.toLowerCase()} text-[10px] px-2 py-0.5 rounded font-bold`}>{entry.gymType}</span>
                  <span className="text-[#10b981] font-bold">{entry.wins}W</span>
                  <span className="text-[#ef4444] font-bold">{entry.losses}L</span>
                  <span className="font-bold">{entry.winRate}%</span>
                  <span className="text-[#fbbf24]">{entry.streak}🔥</span>
                </div>

                {/* Desktop stats */}
                <div className="text-center font-bold text-[#10b981] hidden sm:block">{entry.wins}</div>
                <div className="text-center font-bold text-[#ef4444] hidden sm:block">{entry.losses}</div>
                <div className="text-center hidden sm:block">
                  <span className="font-[family-name:var(--font-orbitron)] font-bold text-sm">{entry.winRate}%</span>
                </div>
                <div className="text-center hidden sm:block">
                  <span className="font-bold text-[#fbbf24]">{entry.streak}🔥</span>
                </div>
                <div className="text-center text-[#6b6290] hidden sm:block">{entry.graveyard}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
