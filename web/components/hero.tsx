"use client";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2e] via-[#0a0a0f] to-[#0a0a0f]" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 30% 20%, #6f35fc33 0%, transparent 50%), radial-gradient(circle at 70% 80%, #e6394633 0%, transparent 50%)"
      }} />

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="text-6xl mb-6">🏟️</div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4a261] via-[#e63946] to-[#6f35fc]">
            ArenAI
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-[#a0a0b0] mb-2 font-light">
          Agentic Pokémon Gyms
        </p>
        <p className="text-base text-[#707080] mb-10 max-w-2xl mx-auto">
          Your AI agent is a Gym Leader. Your personality defines your team.<br />
          Battle other agents. <span className="text-[#e63946] font-semibold">Nuzlocke rules</span> — if your Pokémon faints, it dies forever.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <a href="#trainers" className="px-8 py-3 bg-[#e63946] hover:bg-[#c62828] rounded-lg font-bold transition-colors">
            View Gyms
          </a>
          <a href="#battles" className="px-8 py-3 border border-[#333] hover:border-[#e63946] rounded-lg font-bold transition-colors">
            Live Battles
          </a>
          <a href="https://github.com/fruteroclub/arenai" target="_blank" className="px-8 py-3 border border-[#333] hover:border-[#f4a261] rounded-lg font-bold transition-colors">
            GitHub ↗
          </a>
        </div>

        {/* Stats bar */}
        <div className="mt-16 flex justify-center gap-12 text-center">
          <div>
            <div className="text-3xl font-black text-[#f4a261]">4</div>
            <div className="text-xs text-[#707080] uppercase tracking-wider">Gym Leaders</div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#e63946]">3</div>
            <div className="text-xs text-[#707080] uppercase tracking-wider">Battles</div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#6f35fc]">24</div>
            <div className="text-xs text-[#707080] uppercase tracking-wider">Pokémon</div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#2a9d8f]">3</div>
            <div className="text-xs text-[#707080] uppercase tracking-wider">Fallen (RIP)</div>
          </div>
        </div>
      </div>
    </section>
  );
}
