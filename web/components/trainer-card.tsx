"use client";
import type { Trainer, Pokemon } from "@/lib/mock-data";

function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`type-${type.toLowerCase()} text-xs px-2 py-0.5 rounded-full font-bold`}>
      {type}
    </span>
  );
}

function PokemonSlot({ mon, small }: { mon: Pokemon; small?: boolean }) {
  const size = small ? "w-12 h-12" : "w-20 h-20";
  return (
    <div className={`relative group ${mon.fainted ? "opacity-30 grayscale" : ""}`}>
      <div className={`${size} relative`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mon.sprite}
          alt={mon.species}
          className={`${size} object-contain pokemon-sprite`}
          style={{ animationDelay: `${Math.random() * 2}s` }}
        />
        {mon.fainted && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">💀</span>
          </div>
        )}
      </div>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
        <div className="bg-[#1a1a2e] border border-[#333] rounded-lg p-3 min-w-[200px] shadow-xl">
          <div className="font-bold text-sm mb-1">{mon.species}</div>
          <div className="flex gap-1 mb-2">
            {mon.types.map((t) => <TypeBadge key={t} type={t} />)}
          </div>
          <div className="text-xs text-[#a0a0b0]">
            <div>Ability: {mon.ability}</div>
            <div className="mt-1">
              {mon.moves.map((m) => <div key={m}>• {m}</div>)}
            </div>
          </div>
          {!mon.fainted && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>HP</span>
                <span>{mon.hp}/{mon.maxHp}</span>
              </div>
              <div className="h-1.5 bg-[#333] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2a9d8f] rounded-full"
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

  return (
    <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-6 hover:border-[#e63946] transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">{trainer.avatar}</span>
            <div>
              <h3 className="text-xl font-black">{trainer.name}</h3>
              <p className="text-xs text-[#707080]">{trainer.title}</p>
            </div>
          </div>
          <p className="text-sm italic text-[#a0a0b0] mt-2">"{trainer.battleCry}"</p>
        </div>
        <div className={`type-${trainer.gymType.toLowerCase()} px-3 py-1 rounded-full text-xs font-bold`}>
          {trainer.gymType}
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-4 text-center">
        <div>
          <div className="text-lg font-black text-[#2a9d8f]">{trainer.wins}</div>
          <div className="text-[10px] text-[#707080] uppercase">Wins</div>
        </div>
        <div>
          <div className="text-lg font-black text-[#e63946]">{trainer.losses}</div>
          <div className="text-[10px] text-[#707080] uppercase">Losses</div>
        </div>
        <div>
          <div className="text-lg font-black text-[#f4a261]">{winRate}%</div>
          <div className="text-[10px] text-[#707080] uppercase">Win Rate</div>
        </div>
        <div>
          <div className="text-lg font-black text-[#6f35fc]">{trainer.streak}🔥</div>
          <div className="text-[10px] text-[#707080] uppercase">Streak</div>
        </div>
      </div>

      {/* Team */}
      <div className="mb-3">
        <div className="text-xs text-[#707080] uppercase tracking-wider mb-2">Active Team</div>
        <div className="flex gap-2 flex-wrap">
          {trainer.team.map((mon) => (
            <PokemonSlot key={mon.species} mon={mon} />
          ))}
        </div>
      </div>

      {/* Graveyard */}
      {trainer.graveyard.length > 0 && (
        <div>
          <div className="text-xs text-[#e63946] uppercase tracking-wider mb-2">
            ☠️ Graveyard ({trainer.graveyard.length})
          </div>
          <div className="flex gap-2">
            {trainer.graveyard.map((mon) => (
              <PokemonSlot key={mon.species} mon={mon} small />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
