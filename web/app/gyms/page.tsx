"use client";
import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { GYM_REGISTRY_ADDRESS, GYM_REGISTRY_ABI, MONAD_TESTNET } from "@/lib/contracts";
import Link from "next/link";

interface Pokemon {
  species: string;
  type1: string;
  type2: string;
}

interface OnChainGym {
  address: string;
  name: string;
  gymType: string;
  archetype: string;
  battleCry: string;
  pokemon: Pokemon[];
  timestamp: bigint;
}

const client = createPublicClient({
  chain: MONAD_TESTNET,
  transport: http(),
});

const TYPE_EMOJI: Record<string, string> = {
  Dragon: "🐉",
  Steel: "⚙️",
  Grass: "🌿",
  Fairy: "✨",
  Fire: "🔥",
  Water: "💧",
  Electric: "⚡",
  Psychic: "🔮",
  Dark: "🌑",
  Fighting: "👊",
  Ice: "❄️",
  Normal: "⭐",
  Poison: "☠️",
  Ground: "🏔️",
  Flying: "🦅",
  Bug: "🐛",
  Rock: "🪨",
  Ghost: "👻",
};

function sprite(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  return `https://img.pokemondb.net/sprites/home/normal/${slug}.png`;
}

export default function GymsPage() {
  const [gyms, setGyms] = useState<OnChainGym[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const addresses = (await client.readContract({
          address: GYM_REGISTRY_ADDRESS,
          abi: GYM_REGISTRY_ABI,
          functionName: "getAllGyms",
        })) as `0x${string}`[];

        const results = await Promise.all(
          addresses.map(async (addr) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = (await client.readContract({
              address: GYM_REGISTRY_ADDRESS,
              abi: GYM_REGISTRY_ABI,
              functionName: "getGym",
              args: [addr],
            })) as any;
            return {
              address: addr,
              name: data[0],
              gymType: data[1],
              archetype: data[2],
              battleCry: data[3],
              pokemon: (data[4] as unknown as Array<{ species: string; type1: string; type2: string }>).map((p) => ({
                species: p.species,
                type1: p.type1,
                type2: p.type2,
              })),
              timestamp: data[5],
            };
          })
        );
        setGyms(results);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load gyms");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0614] pt-24 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-[family-name:var(--font-orbitron)] font-black mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#ef4444]">
              On-Chain Gyms
            </span>
          </h1>
          <p className="text-[#8b82a8] text-sm">
            Live from GymRegistry on Monad Testnet •{" "}
            <a
              href={`https://testnet.monadexplorer.com/address/${GYM_REGISTRY_ADDRESS}`}
              target="_blank"
              className="text-[#7c3aed] hover:underline"
            >
              View Contract ↗
            </a>
          </p>
        </div>

        {loading && (
          <div className="text-center text-[#8b82a8] py-20">
            <div className="animate-pulse text-2xl mb-2">⛓️</div>
            Reading from chain...
          </div>
        )}

        {error && (
          <div className="text-center text-[#ef4444] py-20">
            Error: {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {gyms.map((gym) => (
            <div
              key={gym.address}
              className={`holo-card glow-${gym.gymType.toLowerCase()} bg-gradient-to-br from-[#1a1030] to-[#150d28] border border-[#2a1f4e] rounded-2xl p-6 relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--glow)]/10 to-transparent rounded-bl-[60px]" />

              <div className="relative z-10 flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-3xl">{TYPE_EMOJI[gym.gymType] || "🏟️"}</span>
                    <div>
                      <h3 className="text-xl font-[family-name:var(--font-orbitron)] font-black tracking-wide">
                        {gym.name}
                      </h3>
                      <p className="text-xs text-[#6b6290] font-[family-name:var(--font-orbitron)] tracking-wider uppercase">
                        {gym.archetype} archetype
                      </p>
                    </div>
                  </div>
                  <p className="text-sm italic text-[#8b82a8] mt-3 border-l-2 border-[#7c3aed]/30 pl-3">
                    &ldquo;{gym.battleCry}&rdquo;
                  </p>
                </div>
                <div
                  className={`type-${gym.gymType.toLowerCase()} px-3 py-1.5 rounded-lg text-xs font-[family-name:var(--font-orbitron)] font-bold tracking-wider shadow-lg`}
                >
                  {gym.gymType}
                </div>
              </div>

              {/* Pokemon Team */}
              <div className="relative z-10 mb-3">
                <div className="text-[10px] text-[#8b82a8] uppercase tracking-[0.2em] mb-3 font-[family-name:var(--font-orbitron)]">
                  Team
                </div>
                <div className="flex gap-3">
                  {gym.pokemon.map((mon) => (
                    <div key={mon.species} className="text-center group relative">
                      <div className="w-20 h-20 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sprite(mon.species)}
                          alt={mon.species}
                          className="w-20 h-20 object-contain animate-float drop-shadow-[0_0_8px_rgba(124,58,237,0.3)]"
                          style={{ animationDelay: `${Math.random() * 2}s` }}
                        />
                      </div>
                      <div className="text-[10px] text-[#8b82a8] mt-1">{mon.species}</div>
                      <div className="flex gap-1 justify-center mt-0.5">
                        {[mon.type1, mon.type2].filter(Boolean).map((t) => (
                          <span
                            key={t}
                            className={`type-${t.toLowerCase()} text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 text-[10px] text-[#6b6290] font-mono truncate">
                {gym.address}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-br from-[#1a1030] to-[#150d28] border border-[#7c3aed]/30 rounded-2xl p-8">
            <h2 className="text-2xl font-[family-name:var(--font-orbitron)] font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#ef4444]">
              Register Your Gym
            </h2>
            <p className="text-[#8b82a8] text-sm mb-4 max-w-md">
              Claim your spot on-chain. Connect your wallet and register as a Gym Leader on Monad Testnet.
            </p>
            <p className="text-[#7c3aed] text-sm font-[family-name:var(--font-orbitron)] font-bold mb-4">
              Registration Fee: 1 MON
            </p>
            <Link
              href="/create"
              className="inline-block bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white font-[family-name:var(--font-orbitron)] font-bold text-sm px-6 py-3 rounded-xl hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all"
            >
              Create Your Gym →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
