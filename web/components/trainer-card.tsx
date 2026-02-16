"use client";
import type { Trainer, Pokemon } from "@/lib/mock-data";

function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`type-${type.toLowerCase()} text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider`}>
      {type}
    </span>
  );
}

function PokemonSlot({ mon, small }: { mon: Pokemon; small?: boolean }) {
  const size = small ? "w-14 h-14" : "w-20 h-20";
  return (
    <div className={`relative group ${mon.fainted ? "fallen-pokemon opacity-40 grayscale" : ""}`}>
      <div className={`${size} relative`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mon.sprite}
          alt={mon.species}
          className={`${size} object-contain ${mon.fainted ? "" : "animate-float"} drop-shadow-[0_0_8px_rgba(124,58,237,0.3)]`}
          style={{ animationDelay: `${Math.random() * 2}s` }}
        />
      </div>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
        <div className="bg-[#1a1030] border border-[#7c3aed]/30 rounded-xl p-3 min-w-[200px] shadow-[0_0_30px_rgba(124,58,237,0.2)]">
          <div className="font-[family-name:var(--font-orbitron)] font-bold text-sm mb-1">{mon.species}</div>
          <div className="flex gap-1 mb-2">
            {mon.types.map((t) => <TypeBadge key={t} type={t} />)}
          </div>
          <div className="text-xs text-[#8b82a8]">
            <div className="mb-1">Ability: <span className="text-[#06b6d4]">{mon.ability}</span></div>
            {mon.moves.map((m) => <div key={m} className="text-[#6b6290]">• {m}</div>)}
          </div>
          {!mon.fainted && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#8b82a8]">HP</span>
                <span className="font-bold">{mon.hp}/{mon.maxHp}</span>
              </div>
              <div className="h-2 bg-[#0f0a1e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#10b981] to-[#06b6d4] rounded-full transition-all"
                  style={{ width: `${(mon.hp / mon.maxHp) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TrainerCard({ trainer }: { trainer: Trainer }) {
  const winRate = Math.round((trainer.wins / (trainer.wins + trainer.losses)) * 100);
  const glowClass = `glow-${trainer.gymType.toLowerCase()}`;

  return (
    <div className={`holo-card ${glowClass} bg-gradient-to-br from-[#1a1030] to-[#150d28] border border-[#2a1f4e] rounded-2xl p-6 relative overflow-hidden`}>
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--glow)]/10 to-transparent rounded-bl-[60px]" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-4xl drop-shadow-lg">{trainer.avatar}</span>
            <div>
              <h3 className="text-xl font-[family-name:var(--font-orbitron)] font-black tracking-wide">{trainer.name}</h3>
              <p className="text-xs text-[#6b6290] font-[family-name:var(--font-orbitron)] tracking-wider uppercase">{trainer.title}</p>
            </div>
          </div>
          <p className="text-sm italic text-[#8b82a8] mt-3 border-l-2 border-[#7c3aed]/30 pl-3">&ldquo;{trainer.battleCry}&rdquo;</p>
        </div>
        <div className={`type-${trainer.gymType.toLowerCase()} px-3 py-1.5 rounded-lg text-xs font-[family-name:var(--font-orbitron)] font-bold tracking-wider shadow-lg`}>
          {trainer.gymType}
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-4 gap-3 mb-5 bg-[#0f0a1e]/50 rounded-xl p-3">
        {[
          { value: trainer.wins, label: "WINS", color: "#10b981" },
          { value: trainer.losses, label: "LOSSES", color: "#ef4444" },
          { value: `${winRate}%`, label: "RATE", color: "#fbbf24" },
          { value: `${trainer.streak}🔥`, label: "STREAK", color: "#7c3aed" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-lg font-[family-name:var(--font-orbitron)] font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[9px] text-[#6b6290] tracking-[0.15em]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="relative z-10 mb-4">
        <div className="text-[10px] text-[#8b82a8] uppercase tracking-[0.2em] mb-3 font-[family-name:var(--font-orbitron)]">Active Team</div>
        <div className="flex gap-2 flex-wrap">
          {trainer.team.map((mon) => (
            <PokemonSlot key={mon.species} mon={mon} />
          ))}
        </div>
      </div>

      {/* Graveyard */}
      {trainer.graveyard.length > 0 && (
        <div className="relative z-10 border-t border-[#ef4444]/20 pt-4 mt-4">
          <div className="text-[10px] text-[#ef4444] uppercase tracking-[0.2em] mb-3 font-[family-name:var(--font-orbitron)] flex items-center gap-2">
            <span className="inline-block w-4 h-[1px] bg-[#ef4444]/50" />
            GRAVEYARD — {trainer.graveyard.length} FALLEN
            <span className="inline-block w-4 h-[1px] bg-[#ef4444]/50" />
          </div>
          <div className="flex gap-3">
            {trainer.graveyard.map((mon) => (
              <div key={mon.species} className="text-center">
                <PokemonSlot mon={mon} small />
                <div className="text-[9px] text-[#ef4444]/60 mt-1 line-through">{mon.species}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
