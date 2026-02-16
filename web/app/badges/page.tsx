"use client";
import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import {
  GYM_BADGE_ADDRESS,
  GYM_BADGE_ABI,
  MONAD_TESTNET,
} from "@/lib/contracts";

interface Badge {
  tokenId: number;
  gymLeader: string;
  challenger: string;
  gymName: string;
  gymType: string;
  challengeId: bigint;
  earnedAt: bigint;
  owner: string;
}

const client = createPublicClient({
  chain: MONAD_TESTNET,
  transport: http(),
});

const TYPE_COLORS: Record<string, { bg: string; border: string; glow: string; icon: string }> = {
  Dragon: { bg: "from-indigo-900 to-purple-950", border: "border-indigo-500", glow: "shadow-indigo-500/40", icon: "🐉" },
  Steel: { bg: "from-slate-700 to-zinc-900", border: "border-slate-400", glow: "shadow-slate-400/40", icon: "⚙️" },
  Grass: { bg: "from-green-800 to-emerald-950", border: "border-green-400", glow: "shadow-green-400/40", icon: "🌿" },
  Fairy: { bg: "from-pink-700 to-fuchsia-950", border: "border-pink-400", glow: "shadow-pink-400/40", icon: "✨" },
  Fire: { bg: "from-red-800 to-orange-950", border: "border-red-400", glow: "shadow-red-400/40", icon: "🔥" },
  Water: { bg: "from-blue-800 to-cyan-950", border: "border-blue-400", glow: "shadow-blue-400/40", icon: "💧" },
  Electric: { bg: "from-yellow-700 to-amber-950", border: "border-yellow-400", glow: "shadow-yellow-400/40", icon: "⚡" },
  Psychic: { bg: "from-purple-700 to-violet-950", border: "border-purple-400", glow: "shadow-purple-400/40", icon: "🔮" },
  Dark: { bg: "from-gray-800 to-neutral-950", border: "border-gray-500", glow: "shadow-gray-500/40", icon: "🌑" },
  Fighting: { bg: "from-orange-800 to-red-950", border: "border-orange-400", glow: "shadow-orange-400/40", icon: "👊" },
  Ice: { bg: "from-cyan-700 to-blue-950", border: "border-cyan-300", glow: "shadow-cyan-300/40", icon: "❄️" },
  Normal: { bg: "from-stone-700 to-stone-950", border: "border-stone-400", glow: "shadow-stone-400/40", icon: "⭐" },
  Poison: { bg: "from-purple-800 to-fuchsia-950", border: "border-purple-500", glow: "shadow-purple-500/40", icon: "☠️" },
  Ground: { bg: "from-amber-800 to-yellow-950", border: "border-amber-500", glow: "shadow-amber-500/40", icon: "🏔️" },
  Flying: { bg: "from-sky-700 to-indigo-950", border: "border-sky-400", glow: "shadow-sky-400/40", icon: "🦅" },
  Bug: { bg: "from-lime-800 to-green-950", border: "border-lime-400", glow: "shadow-lime-400/40", icon: "🐛" },
  Rock: { bg: "from-stone-700 to-amber-950", border: "border-stone-500", glow: "shadow-stone-500/40", icon: "🪨" },
  Ghost: { bg: "from-violet-800 to-purple-950", border: "border-violet-400", glow: "shadow-violet-400/40", icon: "👻" },
};

const DEFAULT_TYPE = { bg: "from-[#1a1030] to-[#150d28]", border: "border-[#7c3aed]", glow: "shadow-[#7c3aed]/40", icon: "🏅" };

function BadgeCard({ badge }: { badge: Badge }) {
  const tc = TYPE_COLORS[badge.gymType] || DEFAULT_TYPE;
  const date = new Date(Number(badge.earnedAt) * 1000);

  return (
    <div
      className={`relative group cursor-default`}
    >
      {/* Badge shape — octagonal-ish with glow */}
      <div
        className={`bg-gradient-to-br ${tc.bg} ${tc.border} border-2 rounded-2xl p-5 relative overflow-hidden hover:shadow-lg hover:${tc.glow} transition-all duration-300`}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badge icon */}
        <div className="text-center mb-3">
          <div className="text-5xl mb-2 drop-shadow-lg">{tc.icon}</div>
          <div className="w-12 h-12 mx-auto relative">
            <div className={`absolute inset-0 ${tc.border} border-2 rounded-full bg-gradient-to-br ${tc.bg} flex items-center justify-center`}>
              <span className="text-lg font-black text-white/90 font-[family-name:var(--font-orbitron)]">
                #{badge.tokenId}
              </span>
            </div>
          </div>
        </div>

        {/* Badge details */}
        <div className="text-center relative z-10">
          <h3 className="font-[family-name:var(--font-orbitron)] font-black text-sm tracking-wide text-white mb-1">
            {badge.gymName || "Unknown Gym"} Badge
          </h3>
          <div className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tc.border} border bg-black/30`}>
            {badge.gymType || "Unknown"} Type
          </div>
        </div>

        <div className="mt-3 space-y-1 text-[10px] text-white/50">
          <div className="flex justify-between">
            <span>Challenger</span>
            <span className="font-mono text-white/70">{badge.challenger.slice(0, 6)}…{badge.challenger.slice(-4)}</span>
          </div>
          <div className="flex justify-between">
            <span>Gym Leader</span>
            <span className="font-mono text-white/70">{badge.gymLeader.slice(0, 6)}…{badge.gymLeader.slice(-4)}</span>
          </div>
          <div className="flex justify-between">
            <span>Earned</span>
            <span className="text-white/70">{date.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSupply, setTotalSupply] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const supply = (await client.readContract({
          address: GYM_BADGE_ADDRESS,
          abi: GYM_BADGE_ABI,
          functionName: "totalSupply",
        })) as bigint;
        setTotalSupply(Number(supply));

        if (Number(supply) === 0) {
          setLoading(false);
          return;
        }

        const results: Badge[] = [];
        for (let i = 0; i < Number(supply); i++) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = (await client.readContract({
              address: GYM_BADGE_ADDRESS,
              abi: GYM_BADGE_ABI,
              functionName: "getBadge",
              args: [BigInt(i)],
            })) as any;

            const owner = (await client.readContract({
              address: GYM_BADGE_ADDRESS,
              abi: GYM_BADGE_ABI,
              functionName: "ownerOf",
              args: [BigInt(i)],
            })) as string;

            results.push({
              tokenId: i,
              gymLeader: data.gymLeader,
              challenger: data.challenger,
              gymName: data.gymName,
              gymType: data.gymType,
              challengeId: data.challengeId,
              earnedAt: data.earnedAt,
              owner,
            });
          } catch {
            /* skip invalid tokens */
          }
        }
        setBadges(results);
      } catch (e) {
        console.error("Failed to load badges:", e);
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] to-[#ef4444]">
              🎖️ Gym Badges
            </span>
          </h1>
          <p className="text-[#8b82a8] text-sm">
            On-chain proof of victory • GymBadge NFTs on Monad Testnet •{" "}
            <a
              href={`https://testnet.monadexplorer.com/address/${GYM_BADGE_ADDRESS}`}
              target="_blank"
              className="text-[#7c3aed] hover:underline"
            >
              View Contract ↗
            </a>
          </p>
          <p className="text-[#6b6290] text-xs mt-2 font-[family-name:var(--font-orbitron)]">
            {totalSupply} badge{totalSupply !== 1 ? "s" : ""} minted
          </p>
        </div>

        {loading && (
          <div className="text-center text-[#8b82a8] py-20">
            <div className="animate-pulse text-4xl mb-3">🎖️</div>
            Loading badges from chain...
          </div>
        )}

        {!loading && badges.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6 opacity-30">🏅</div>
            <h2 className="text-2xl font-[family-name:var(--font-orbitron)] font-black mb-3 text-[#8b82a8]">
              No Badges Yet
            </h2>
            <p className="text-[#6b6290] text-sm max-w-md mx-auto mb-6">
              No trainers have earned a Gym Badge yet. Be the first to defeat a Gym Leader
              and claim your on-chain badge!
            </p>
            <a
              href="/gyms"
              className="inline-block bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white font-[family-name:var(--font-orbitron)] font-bold text-sm px-6 py-3 rounded-xl hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all"
            >
              Challenge a Gym →
            </a>
          </div>
        )}

        {!loading && badges.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {badges.map((badge) => (
              <BadgeCard key={badge.tokenId} badge={badge} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
