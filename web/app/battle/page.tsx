"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TRAINERS } from "@/lib/mock-data";
import { simulateBattle, type BattleEvent } from "@/lib/battle-simulator";

function sprite(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  return `https://img.pokemondb.net/sprites/home/normal/${slug}.png`;
}

type BattleState = "select" | "battling" | "finished";

interface ActiveMon {
  species: string;
  hp: number;
  maxHp: number;
  fainted: boolean;
}

export default function BattlePage() {
  const [p1Idx, setP1Idx] = useState(0);
  const [p2Idx, setP2Idx] = useState(1);
  const [state, setState] = useState<BattleState>("select");
  const [events, setEvents] = useState<BattleEvent[]>([]);
  const [eventIdx, setEventIdx] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [p1Active, setP1Active] = useState<ActiveMon | null>(null);
  const [p2Active, setP2Active] = useState<ActiveMon | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [p1Fainted, setP1Fainted] = useState<string[]>([]);
  const [p2Fainted, setP2Fainted] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  const processEvent = useCallback((ev: BattleEvent) => {
    switch (ev.type) {
      case "text":
        setLog(prev => [...prev, ev.text || ""]);
        break;
      case "switch":
        if (ev.side === "p1") {
          const mon = TRAINERS[p1Idx].team.find(p => p.species === ev.pokemon);
          if (mon) setP1Active({ species: mon.species, hp: mon.maxHp, maxHp: mon.maxHp, fainted: false });
        } else {
          const mon = TRAINERS[p2Idx].team.find(p => p.species === ev.pokemon);
          if (mon) setP2Active({ species: mon.species, hp: mon.maxHp, maxHp: mon.maxHp, fainted: false });
        }
        setLog(prev => [...prev, `Go, ${ev.pokemon}!`]);
        break;
      case "move":
        setLog(prev => [...prev, `${ev.pokemon} used ${ev.move}!`]);
        break;
      case "supereffective":
        setLog(prev => [...prev, "⚡ It's super effective!"]);
        break;
      case "crit":
        setLog(prev => [...prev, "💥 A critical hit!"]);
        break;
      case "damage":
        if (ev.side === "p1") {
          setP1Active(prev => prev ? { ...prev, hp: ev.hpAfter ?? 0 } : null);
        } else {
          setP2Active(prev => prev ? { ...prev, hp: ev.hpAfter ?? 0 } : null);
        }
        break;
      case "faint":
        setLog(prev => [...prev, `💀 ${ev.pokemon} fainted!`]);
        if (ev.side === "p1") {
          setP1Active(prev => prev ? { ...prev, fainted: true, hp: 0 } : null);
          setP1Fainted(prev => [...prev, ev.pokemon || ""]);
        } else {
          setP2Active(prev => prev ? { ...prev, fainted: true, hp: 0 } : null);
          setP2Fainted(prev => [...prev, ev.pokemon || ""]);
        }
        break;
      case "win":
        setWinner(ev.winner || null);
        setLog(prev => [...prev, `🏆 ${ev.winner} wins the battle!`]);
        setState("finished");
        break;
    }
  }, [p1Idx, p2Idx]);

  useEffect(() => {
    if (state !== "battling" || eventIdx >= events.length) return;
    const delay = events[eventIdx].type === "move" ? 800 :
                  events[eventIdx].type === "faint" ? 1200 :
                  events[eventIdx].type === "win" ? 1500 :
                  events[eventIdx].type === "damage" ? 400 : 500;
    const timer = setTimeout(() => {
      processEvent(events[eventIdx]);
      setEventIdx(prev => prev + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [state, eventIdx, events, processEvent]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const startBattle = () => {
    const battleEvents = simulateBattle(TRAINERS[p1Idx], TRAINERS[p2Idx]);
    setEvents(battleEvents);
    setEventIdx(0);
    setLog([]);
    setP1Active(null);
    setP2Active(null);
    setWinner(null);
    setP1Fainted([]);
    setP2Fainted([]);
    setState("battling");
  };

  const hpPercent = (mon: ActiveMon | null) => mon ? Math.max(0, (mon.hp / mon.maxHp) * 100) : 100;
  const hpColor = (pct: number) => pct > 50 ? "#10b981" : pct > 20 ? "#fbbf24" : "#ef4444";

  return (
    <main className="min-h-screen pt-24 pb-16 px-6 relative">
      <div className="fixed inset-0 opacity-15 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 20% 50%, #ef444433 0%, transparent 40%), radial-gradient(circle at 80% 50%, #7c3aed33 0%, transparent 40%)",
      }} />

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-6xl font-[family-name:var(--font-orbitron)] font-black tracking-wider mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] via-[#fbbf24] to-[#ef4444]">
              ⚔️ BATTLE ARENA
            </span>
          </h1>
          <p className="text-[#8b82a8]">pick two gym leaders. watch them fight.</p>
        </div>

        {state === "select" && (
          <div className="animate-fade-in-up">
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-start">
              {/* Player 1 */}
              <div>
                <label className="block text-sm font-[family-name:var(--font-orbitron)] text-[#ef4444] tracking-wider mb-3">
                  PLAYER 1
                </label>
                <div className="space-y-3">
                  {TRAINERS.map((t, i) => (
                    <button
                      key={t.name}
                      onClick={() => setP1Idx(i)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        p1Idx === i
                          ? "border-[#ef4444] bg-[#ef4444]/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                          : "border-[#2a1f4e] bg-[#1a1030]/60 hover:border-[#ef4444]/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{t.avatar}</span>
                        <div>
                          <div className="font-[family-name:var(--font-orbitron)] font-bold text-sm">{t.name}</div>
                          <div className="text-xs text-[#8b82a8]">{t.title} · {t.wins}W-{t.losses}L</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* VS */}
              <div className="hidden md:flex flex-col items-center justify-center pt-10">
                <div className="text-4xl font-[family-name:var(--font-orbitron)] font-black text-[#ef4444] animate-pulse-battle rounded-full w-20 h-20 flex items-center justify-center border-2 border-[#ef4444]/30">
                  VS
                </div>
              </div>

              {/* Player 2 */}
              <div>
                <label className="block text-sm font-[family-name:var(--font-orbitron)] text-[#7c3aed] tracking-wider mb-3">
                  PLAYER 2
                </label>
                <div className="space-y-3">
                  {TRAINERS.map((t, i) => (
                    <button
                      key={t.name}
                      onClick={() => setP2Idx(i)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        p2Idx === i
                          ? "border-[#7c3aed] bg-[#7c3aed]/10 shadow-[0_0_20px_rgba(124,58,237,0.2)]"
                          : "border-[#2a1f4e] bg-[#1a1030]/60 hover:border-[#7c3aed]/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{t.avatar}</span>
                        <div>
                          <div className="font-[family-name:var(--font-orbitron)] font-bold text-sm">{t.name}</div>
                          <div className="text-xs text-[#8b82a8]">{t.title} · {t.wins}W-{t.losses}L</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <button
                onClick={startBattle}
                disabled={p1Idx === p2Idx}
                className="px-12 py-4 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-xl font-[family-name:var(--font-orbitron)] font-bold text-lg tracking-wider hover:shadow-[0_0_60px_rgba(239,68,68,0.5)] transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 animate-pulse-battle"
              >
                ⚔️ START BATTLE!
              </button>
              {p1Idx === p2Idx && (
                <p className="text-[#ef4444] text-sm mt-3">pick two different trainers</p>
              )}
            </div>
          </div>
        )}

        {(state === "battling" || state === "finished") && (
          <div className="animate-fade-in-up">
            {/* Battle field */}
            <div className="bg-[#1a1030]/80 border border-[#2a1f4e] rounded-2xl overflow-hidden">
              {/* Pokemon display */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 p-6 items-center">
                {/* P1 side */}
                <div className="text-center">
                  <div className="text-sm font-[family-name:var(--font-orbitron)] text-[#ef4444] mb-2">
                    {TRAINERS[p1Idx].avatar} {TRAINERS[p1Idx].name}
                  </div>
                  {p1Active && (
                    <div className={`transition-all duration-500 ${p1Active.fainted ? "grayscale opacity-40" : ""}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sprite(p1Active.species)}
                        alt={p1Active.species}
                        className="w-28 h-28 mx-auto object-contain animate-float"
                      />
                      <div className="font-[family-name:var(--font-orbitron)] text-sm font-bold mt-1">
                        {p1Active.species}
                        {p1Active.fainted && " 💀"}
                      </div>
                      {/* HP bar */}
                      <div className="w-40 mx-auto mt-2 bg-[#0f0a1e] rounded-full h-3 border border-[#2a1f4e] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${hpPercent(p1Active)}%`,
                            backgroundColor: hpColor(hpPercent(p1Active)),
                          }}
                        />
                      </div>
                      <div className="text-[10px] text-[#8b82a8] mt-1">
                        {p1Active.hp}/{p1Active.maxHp} HP
                      </div>
                    </div>
                  )}
                  {/* Fainted list */}
                  {p1Fainted.length > 0 && (
                    <div className="flex gap-1 justify-center mt-2">
                      {p1Fainted.map(f => (
                        <span key={f} className="text-[10px] text-[#ef4444] line-through">{f}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* VS */}
                <div className="text-2xl font-[family-name:var(--font-orbitron)] font-black text-[#ef4444]/50">
                  VS
                </div>

                {/* P2 side */}
                <div className="text-center">
                  <div className="text-sm font-[family-name:var(--font-orbitron)] text-[#7c3aed] mb-2">
                    {TRAINERS[p2Idx].avatar} {TRAINERS[p2Idx].name}
                  </div>
                  {p2Active && (
                    <div className={`transition-all duration-500 ${p2Active.fainted ? "grayscale opacity-40" : ""}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sprite(p2Active.species)}
                        alt={p2Active.species}
                        className="w-28 h-28 mx-auto object-contain animate-float"
                        style={{ animationDelay: "1.5s" }}
                      />
                      <div className="font-[family-name:var(--font-orbitron)] text-sm font-bold mt-1">
                        {p2Active.species}
                        {p2Active.fainted && " 💀"}
                      </div>
                      <div className="w-40 mx-auto mt-2 bg-[#0f0a1e] rounded-full h-3 border border-[#2a1f4e] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${hpPercent(p2Active)}%`,
                            backgroundColor: hpColor(hpPercent(p2Active)),
                          }}
                        />
                      </div>
                      <div className="text-[10px] text-[#8b82a8] mt-1">
                        {p2Active.hp}/{p2Active.maxHp} HP
                      </div>
                    </div>
                  )}
                  {p2Fainted.length > 0 && (
                    <div className="flex gap-1 justify-center mt-2">
                      {p2Fainted.map(f => (
                        <span key={f} className="text-[10px] text-[#ef4444] line-through">{f}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Battle log */}
              <div
                ref={logRef}
                className="border-t border-[#2a1f4e]/50 bg-[#0f0a1e]/80 p-4 h-48 overflow-y-auto font-mono text-sm"
              >
                {log.map((line, i) => (
                  <div
                    key={i}
                    className={`animate-fade-in-up py-0.5 ${
                      line.includes("💀") ? "text-[#ef4444]" :
                      line.includes("🏆") ? "text-[#fbbf24] font-bold text-lg" :
                      line.includes("⚡") ? "text-[#fbbf24]" :
                      line.includes("💥") ? "text-[#ef4444]" :
                      "text-[#8b82a8]"
                    }`}
                  >
                    {line}
                  </div>
                ))}
                {state === "battling" && eventIdx < events.length && (
                  <div className="text-[#7c3aed] animate-pulse">▸</div>
                )}
              </div>
            </div>

            {/* Winner celebration */}
            {state === "finished" && winner && (
              <div className="mt-8 text-center animate-fade-in-up">
                <div className="inline-block bg-gradient-to-r from-[#fbbf24]/20 to-[#ef4444]/20 border-2 border-[#fbbf24]/40 rounded-2xl p-8">
                  <div className="text-6xl mb-4">🏆</div>
                  <h2 className="text-3xl font-[family-name:var(--font-orbitron)] font-black tracking-wider">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#ef4444]">
                      {winner} WINS!
                    </span>
                  </h2>
                  <p className="text-[#8b82a8] mt-2">
                    {p1Fainted.length + p2Fainted.length} pokémon fainted in battle
                  </p>
                </div>
                <div className="mt-6 flex gap-4 justify-center">
                  <button
                    onClick={() => { setState("select"); setLog([]); setWinner(null); setP1Fainted([]); setP2Fainted([]); }}
                    className="px-8 py-3 border-2 border-[#7c3aed]/40 hover:border-[#7c3aed] rounded-xl font-[family-name:var(--font-orbitron)] font-bold text-sm tracking-wider text-[#7c3aed] transition-all duration-300"
                  >
                    ← REMATCH
                  </button>
                  <button
                    onClick={startBattle}
                    className="px-8 py-3 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-xl font-[family-name:var(--font-orbitron)] font-bold text-sm tracking-wider hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] transition-all duration-300"
                  >
                    ⚔️ BATTLE AGAIN
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
