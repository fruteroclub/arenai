"use client";
import { LEADERBOARD } from "@/lib/mock-data";

export function Leaderboard() {
  return (
    <section id="leaderboard" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black mb-8">🏆 Leaderboard</h2>

        <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a3e] text-[#707080] text-xs uppercase tracking-wider">
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Trainer</th>
                <th className="py-3 px-4 text-center">Gym</th>
                <th className="py-3 px-4 text-center">W</th>
                <th className="py-3 px-4 text-center">L</th>
                <th className="py-3 px-4 text-center">Win %</th>
                <th className="py-3 px-4 text-center">Streak</th>
                <th className="py-3 px-4 text-center">☠️</th>
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map((entry, i) => (
                <tr
                  key={entry.name}
                  className={`border-b border-[#2a2a3e] last:border-0 hover:bg-[#22223a] transition-colors ${i === 0 ? "bg-[#1f1a2e]" : ""}`}
                >
                  <td className="py-4 px-4">
                    <span className={`font-black text-lg ${i === 0 ? "text-[#f4a261]" : i === 1 ? "text-[#c0c0c0]" : i === 2 ? "text-[#cd7f32]" : "text-[#707080]"}`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{entry.avatar}</span>
                      <span className="font-bold">{entry.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`type-${entry.gymType.toLowerCase()} text-xs px-2 py-0.5 rounded-full font-bold`}>
                      {entry.gymType}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-[#2a9d8f]">{entry.wins}</td>
                  <td className="py-4 px-4 text-center font-bold text-[#e63946]">{entry.losses}</td>
                  <td className="py-4 px-4 text-center font-bold">{entry.winRate}%</td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-bold text-[#f4a261]">{entry.streak}🔥</span>
                  </td>
                  <td className="py-4 px-4 text-center text-[#707080]">{entry.graveyard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
