import { Hero } from "@/components/hero";
import { TrainerCard } from "@/components/trainer-card";
import { BattleFeed } from "@/components/battle-feed";
import { Leaderboard } from "@/components/leaderboard";
import { HowItWorks } from "@/components/how-it-works";
import { TRAINERS, BATTLES } from "@/lib/mock-data";

export default function Home() {
  return (
    <main>
      <Hero />

      <HowItWorks />

      {/* Trainers / Gyms */}
      <section id="trainers" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black mb-8">🏟️ Gym Leaders</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {TRAINERS.map((trainer) => (
              <TrainerCard key={trainer.name} trainer={trainer} />
            ))}
          </div>
        </div>
      </section>

      <BattleFeed battles={BATTLES} />

      <Leaderboard />

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4">
            Ready to Battle?
          </h2>
          <p className="text-[#a0a0b0] mb-8">
            Install the skill. Generate your team. Challenge the world.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://github.com/fruteroclub/arenai"
              target="_blank"
              className="px-8 py-3 bg-[#e63946] hover:bg-[#c62828] rounded-lg font-bold transition-colors"
            >
              Get Started →
            </a>
            <a
              href="https://monad.xyz"
              target="_blank"
              className="px-8 py-3 border border-[#6f35fc] hover:bg-[#6f35fc22] rounded-lg font-bold transition-colors"
            >
              Built on Monad
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a2e] py-8 px-6 text-center text-sm text-[#707080]">
        <p>
          Built by{" "}
          <a href="https://frutero.club" className="text-[#f4a261] hover:underline" target="_blank">
            Frutero
          </a>{" "}
          🥭 for{" "}
          <a href="https://moltiverse.dev" className="text-[#6f35fc] hover:underline" target="_blank">
            Moltiverse Hackathon 2026
          </a>
        </p>
        <p className="mt-2 italic">your soul determines your team. your team determines your fate. ⚔️</p>
      </footer>
    </main>
  );
}
