"use client";
import { useState, useEffect, useRef } from "react";
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { injected } from "wagmi/connectors";
import { formatEther, parseEther } from "viem";
import { GYM_CHALLENGE_ADDRESS, GYM_CHALLENGE_ABI } from "@/lib/contracts";
import { simulateBattle, type BattleEvent } from "@/lib/battle-simulator";
import type { Trainer } from "@/lib/mock-data";

interface GymData {
  address: string;
  name: string;
  gymType: string;
  archetype: string;
  battleCry: string;
  pokemon: { species: string; type1: string; type2: string }[];
  challengeFee: bigint | null;
}

interface ChallengeModalProps {
  gym: GymData;
  onClose: () => void;
}

type ModalPhase = "confirm" | "pending" | "success" | "battle" | "result" | "error";

function gymToTrainer(gym: GymData, name: string): Trainer {
  return {
    name,
    title: "Gym Leader",
    archetype: gym.archetype,
    gymType: gym.gymType,
    avatar: "",
    battleCry: gym.battleCry,
    wins: 0, losses: 0, streak: 0,
    team: gym.pokemon.map((p) => ({
      species: p.species,
      sprite: "",
      types: [p.type1, p.type2].filter(Boolean),
      ability: "Unknown",
      moves: getDefaultMoves(p.type1),
      hp: 100, maxHp: 100, level: 50, fainted: false,
    })),
    graveyard: [],
  };
}

function getDefaultMoves(type: string): string[] {
  const moveSets: Record<string, string[]> = {
    Fire: ["Flamethrower", "Fire Blast", "Heat Wave", "Close Combat"],
    Water: ["Surf", "Hydro Pump", "Ice Beam", "Scald"],
    Grass: ["Energy Ball", "Leaf Storm", "Giga Drain", "Sludge Bomb"],
    Electric: ["Thunderbolt", "Thunder", "Volt Switch", "Ice Beam"],
    Psychic: ["Psychic", "Psyshock", "Shadow Ball", "Focus Blast"],
    Dragon: ["Dragon Pulse", "Draco Meteor", "Fire Blast", "Earthquake"],
    Dark: ["Dark Pulse", "Knock Off", "Crunch", "Close Combat"],
    Fairy: ["Moonblast", "Dazzling Gleam", "Psychic", "Shadow Ball"],
    Steel: ["Flash Cannon", "Iron Head", "Earthquake", "Close Combat"],
    Ghost: ["Shadow Ball", "Hex", "Dark Pulse", "Psychic"],
    Fighting: ["Close Combat", "Aura Sphere", "Drain Punch", "Stone Edge"],
    Flying: ["Air Slash", "Hurricane", "Thunderbolt", "Ice Beam"],
    Poison: ["Sludge Bomb", "Sludge Wave", "Earth Power", "Shadow Ball"],
    Ground: ["Earthquake", "Earth Power", "Stone Edge", "Ice Beam"],
    Rock: ["Stone Edge", "Rock Slide", "Earthquake", "Close Combat"],
    Bug: ["Bug Buzz", "U-turn", "Energy Ball", "Psychic"],
    Ice: ["Ice Beam", "Blizzard", "Thunderbolt", "Focus Blast"],
    Normal: ["Body Slam", "Hyper Voice", "Extreme Speed", "Earthquake"],
  };
  return moveSets[type] || moveSets["Normal"];
}

// Default challenger team
function getChallenger(): Trainer {
  return {
    name: "Challenger",
    title: "Trainer",
    archetype: "Balanced",
    gymType: "Normal",
    avatar: "",
    battleCry: "Let's battle!",
    wins: 0, losses: 0, streak: 0,
    team: [
      { species: "Garchomp", sprite: "", types: ["Dragon", "Ground"], ability: "Rough Skin", moves: ["Earthquake", "Dragon Claw", "Stone Edge", "Swords Dance"], hp: 100, maxHp: 100, level: 50, fainted: false },
      { species: "Gengar", sprite: "", types: ["Ghost", "Poison"], ability: "Cursed Body", moves: ["Shadow Ball", "Sludge Bomb", "Focus Blast", "Thunderbolt"], hp: 100, maxHp: 100, level: 50, fainted: false },
      { species: "Togekiss", sprite: "", types: ["Fairy", "Flying"], ability: "Serene Grace", moves: ["Air Slash", "Dazzling Gleam", "Flamethrower", "Aura Sphere"], hp: 100, maxHp: 100, level: 50, fainted: false },
    ],
    graveyard: [],
  };
}

export function ChallengeModal({ gym, onClose }: ChallengeModalProps) {
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const { writeContract, data: txHash, error: writeError, isPending: isWriting } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  const [phase, setPhase] = useState<ModalPhase>("confirm");
  const [errorMsg, setErrorMsg] = useState("");
  const [battleEvents, setBattleEvents] = useState<BattleEvent[]>([]);
  const [visibleEvents, setVisibleEvents] = useState<BattleEvent[]>([]);
  const [battleResult, setBattleResult] = useState<string | null>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

  const fee = gym.challengeFee && Number(gym.challengeFee) > 0
    ? gym.challengeFee
    : parseEther("1");

  // Handle TX confirmation
  useEffect(() => {
    if (isConfirmed && phase === "pending") {
      setPhase("success");
      // Auto-start battle after 2s
      setTimeout(() => startBattle(), 2000);
    }
  }, [isConfirmed]);

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      const msg = writeError.message || "Transaction failed";
      if (msg.includes("User rejected") || msg.includes("user rejected")) {
        setErrorMsg("Transaction rejected by user");
      } else if (msg.includes("insufficient")) {
        setErrorMsg("Insufficient MON balance");
      } else {
        setErrorMsg(msg.length > 120 ? msg.slice(0, 120) + "..." : msg);
      }
      setPhase("error");
    }
  }, [writeError]);

  function handleChallenge() {
    if (!isConnected) {
      connect({ connector: injected() });
      return;
    }
    setPhase("pending");
    writeContract({
      address: GYM_CHALLENGE_ADDRESS,
      abi: GYM_CHALLENGE_ABI,
      functionName: "challenge",
      args: [gym.address as `0x${string}`],
      value: fee,
    });
  }

  function startBattle() {
    const gymTrainer = gymToTrainer(gym, gym.name);
    const challenger = getChallenger();
    const events = simulateBattle(challenger, gymTrainer);
    setBattleEvents(events);
    setPhase("battle");

    // Animate events one by one
    let i = 0;
    const interval = setInterval(() => {
      if (i < events.length) {
        setVisibleEvents((prev) => [...prev, events[i]]);
        i++;
        // Scroll to bottom
        if (eventsRef.current) {
          eventsRef.current.scrollTop = eventsRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
        const winEvent = events.find((e) => e.type === "win");
        setBattleResult(winEvent?.winner || null);
        setPhase("result");
      }
    }, 400);
  }

  function renderEvent(event: BattleEvent, idx: number) {
    switch (event.type) {
      case "text":
        return <div key={idx} className="text-[#8b82a8] text-sm py-1">{event.text}</div>;
      case "switch":
        return <div key={idx} className="text-cyan-400 text-sm py-1">↪ Go, <span className="font-bold text-white">{event.pokemon}</span>!</div>;
      case "move":
        return <div key={idx} className="text-white text-sm py-0.5"><span className="text-[#7c3aed] font-bold">{event.pokemon}</span> used <span className="text-yellow-300 font-bold">{event.move}</span>!</div>;
      case "supereffective":
        return <div key={idx} className="text-green-400 text-xs py-0.5 pl-4 font-bold animate-pulse">⚡ It&apos;s super effective!</div>;
      case "crit":
        return <div key={idx} className="text-orange-400 text-xs py-0.5 pl-4 font-bold">💥 Critical hit!</div>;
      case "damage":
        const hpPct = event.hpMax ? Math.round((event.hpAfter! / event.hpMax) * 100) : 0;
        const barColor = hpPct > 50 ? "bg-green-500" : hpPct > 20 ? "bg-yellow-500" : "bg-red-500";
        return (
          <div key={idx} className="pl-4 py-0.5">
            <span className="text-red-400 text-xs">-{event.damage} HP</span>
            <div className="w-32 h-1.5 bg-[#1a1030] rounded-full mt-0.5 overflow-hidden">
              <div className={`h-full ${barColor} rounded-full transition-all duration-300`} style={{ width: `${hpPct}%` }} />
            </div>
          </div>
        );
      case "faint":
        return <div key={idx} className="text-red-500 text-sm py-1 font-bold">💀 {event.pokemon} fainted!</div>;
      case "win":
        return <div key={idx} className="text-yellow-400 text-lg py-2 font-bold font-[family-name:var(--font-orbitron)]">🏆 {event.winner} wins!</div>;
      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-gradient-to-br from-[#1a1030] to-[#0f0a1e] border border-[#7c3aed]/40 rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto shadow-[0_0_60px_rgba(124,58,237,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-[family-name:var(--font-orbitron)] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#ef4444]">
            {phase === "battle" || phase === "result" ? "⚔️ Battle" : "⚔️ Challenge Gym"}
          </h2>
          <button onClick={onClose} className="text-[#6b6290] hover:text-white text-2xl cursor-pointer">×</button>
        </div>

        {/* Confirm Phase */}
        {phase === "confirm" && (
          <>
            <div className="bg-[#0f0a1e]/60 border border-[#7c3aed]/20 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🏟️</span>
                <div>
                  <div className="text-white font-[family-name:var(--font-orbitron)] font-bold">{gym.name}</div>
                  <div className="text-[#6b6290] text-xs font-[family-name:var(--font-orbitron)]">{gym.gymType} • {gym.archetype}</div>
                </div>
              </div>
              <p className="text-[#8b82a8] text-sm italic border-l-2 border-[#7c3aed]/30 pl-3 mt-2">
                &ldquo;{gym.battleCry}&rdquo;
              </p>
              <div className="flex gap-3 mt-3">
                {gym.pokemon.map((p) => (
                  <div key={p.species} className="text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.pokemondb.net/sprites/home/normal/${p.species.toLowerCase().replace(/[^a-z0-9]/g, "-")}.png`}
                      alt={p.species}
                      className="w-14 h-14 object-contain"
                    />
                    <div className="text-[9px] text-[#8b82a8]">{p.species}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0f0a1e]/60 border border-[#ef4444]/20 rounded-xl p-4 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-[#8b82a8] text-sm">Challenge Fee</span>
                <span className="text-[#ef4444] font-[family-name:var(--font-orbitron)] font-bold text-lg">
                  {formatEther(fee)} MON
                </span>
              </div>
            </div>

            {!isConnected ? (
              <button
                onClick={() => connect({ connector: injected() })}
                className="w-full bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white font-[family-name:var(--font-orbitron)] font-bold text-sm py-3 rounded-xl hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
              >
                Connect Wallet to Challenge
              </button>
            ) : (
              <button
                onClick={handleChallenge}
                className="w-full bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white font-[family-name:var(--font-orbitron)] font-bold text-sm py-3 rounded-xl hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
              >
                ⚔️ Pay &amp; Challenge
              </button>
            )}
          </>
        )}

        {/* Pending Phase */}
        {phase === "pending" && (
          <div className="text-center py-8">
            <div className="text-4xl animate-spin mb-4">⚡</div>
            <p className="text-white font-[family-name:var(--font-orbitron)] font-bold mb-2">
              {isWriting ? "Confirm in wallet..." : isConfirming ? "Waiting for confirmation..." : "Submitting..."}
            </p>
            <p className="text-[#6b6290] text-xs">
              {txHash && <>TX: <span className="font-mono">{txHash.slice(0, 10)}...{txHash.slice(-8)}</span></>}
            </p>
          </div>
        )}

        {/* Success Phase */}
        {phase === "success" && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-green-400 font-[family-name:var(--font-orbitron)] font-bold mb-2">
              Challenge Submitted!
            </p>
            <p className="text-[#8b82a8] text-sm mb-4">Simulating battle...</p>
            <div className="animate-pulse text-2xl">⚔️</div>
          </div>
        )}

        {/* Battle Phase */}
        {(phase === "battle" || phase === "result") && (
          <>
            <div
              ref={eventsRef}
              className="bg-[#0a0614] border border-[#2a1f4e] rounded-xl p-4 max-h-[50vh] overflow-y-auto space-y-0.5 scroll-smooth"
            >
              {visibleEvents.map((event, i) => renderEvent(event, i))}
              {phase === "battle" && (
                <div className="text-[#7c3aed] animate-pulse text-sm">▌</div>
              )}
            </div>

            {phase === "result" && (
              <div className="mt-4 space-y-3">
                <div className={`text-center p-3 rounded-xl border ${
                  battleResult === "Challenger"
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}>
                  <span className="font-[family-name:var(--font-orbitron)] font-bold">
                    {battleResult === "Challenger" ? "🎉 Victory!" : "💀 Defeated"}
                  </span>
                </div>
                <p className="text-[#6b6290] text-xs text-center italic">
                  ⏳ Result will be resolved on-chain by the oracle
                </p>
                <button
                  onClick={onClose}
                  className="w-full bg-[#1a1030] border border-[#7c3aed]/40 text-[#7c3aed] font-[family-name:var(--font-orbitron)] font-bold text-sm py-2.5 rounded-xl hover:border-[#7c3aed] transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}
          </>
        )}

        {/* Error Phase */}
        {phase === "error" && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-red-400 font-[family-name:var(--font-orbitron)] font-bold mb-2">
              Challenge Failed
            </p>
            <p className="text-[#8b82a8] text-sm mb-4 break-all">{errorMsg}</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setPhase("confirm"); setErrorMsg(""); }}
                className="flex-1 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white font-[family-name:var(--font-orbitron)] font-bold text-xs py-2.5 rounded-xl cursor-pointer"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-[#1a1030] border border-[#7c3aed]/40 text-[#7c3aed] font-[family-name:var(--font-orbitron)] font-bold text-xs py-2.5 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
