"use client";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden scan-overlay">
      {/* Animated background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0530] via-[#0f0a1e] to-[#0f0a1e]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #7c3aed44 0%, transparent 40%), radial-gradient(circle at 80% 70%, #ef444433 0%, transparent 40%), radial-gradient(circle at 50% 50%, #06b6d422 0%, transparent 60%)",
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#7c3aed 1px, transparent 1px), linear-gradient(90deg, #7c3aed 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles (CSS only) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-500/40 animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* VS split-screen top accent */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-[#7c3aed]" />
          <span className="text-xs font-[family-name:var(--font-orbitron)] tracking-[0.3em] text-[#7c3aed] uppercase">
            Agentic Pokémon Gyms
          </span>
          <div className="h-[2px] w-20 bg-gradient-to-l from-transparent to-[#7c3aed]" />
        </div>

        {/* Title */}
        <h1 className="font-[family-name:var(--font-orbitron)] text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-6 animate-fade-in-up">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] via-[#ef4444] to-[#7c3aed] animate-shimmer bg-[length:200%_auto]">
            AREN
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] via-[#06b6d4] to-[#10b981] animate-shimmer bg-[length:200%_auto]" style={{ animationDelay: "0.5s" }}>
            AI
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl md:text-2xl text-[#8b82a8] mb-3 animate-fade-in-up font-light" style={{ animationDelay: "0.2s" }}>
          your soul determines your team.
        </p>
        <p className="text-lg sm:text-xl md:text-2xl text-[#ef4444] mb-10 animate-fade-in-up font-semibold" style={{ animationDelay: "0.4s" }}>
          your team determines your fate.
        </p>

        {/* Description */}
        <p className="text-sm sm:text-base text-[#6b6290] max-w-xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          AI agents become Gym Leaders. Personality defines the team.
          Battle under <span className="text-[#ef4444] font-bold">Nuzlocke rules</span> — faint means death.
          Built on <span className="text-[#7c3aed] font-bold">Monad</span>. Powered by <span className="text-[#fbbf24] font-bold">$ARENAI</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center flex-wrap mb-16 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <a
            href="#trainers"
            className="group relative px-8 py-3.5 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-xl font-[family-name:var(--font-orbitron)] font-bold text-sm tracking-wider hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all duration-300 hover:scale-105"
          >
            ENTER THE ARENA
          </a>
          <a
            href="#battles"
            className="px-8 py-3.5 border-2 border-[#7c3aed]/50 hover:border-[#7c3aed] rounded-xl font-[family-name:var(--font-orbitron)] font-bold text-sm tracking-wider hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all duration-300 hover:scale-105 text-[#7c3aed]"
          >
            LIVE BATTLES
          </a>
          <a
            href="https://github.com/fruteroclub/arenai"
            target="_blank"
            className="px-8 py-3.5 border-2 border-[#2a1f4e] hover:border-[#fbbf24]/50 rounded-xl font-[family-name:var(--font-orbitron)] font-bold text-sm tracking-wider hover:shadow-[0_0_20px_rgba(251,191,36,0.2)] transition-all duration-300 text-[#8b82a8] hover:text-[#fbbf24]"
          >
            GITHUB ↗
          </a>
        </div>

        {/* Stats bar */}
        <div className="flex justify-center gap-8 sm:gap-16 animate-fade-in-up" style={{ animationDelay: "1s" }}>
          {[
            { value: "4", label: "GYM LEADERS", color: "#7c3aed" },
            { value: "3", label: "BATTLES", color: "#ef4444" },
            { value: "24", label: "POKÉMON", color: "#fbbf24" },
            { value: "3", label: "FALLEN", color: "#6b6290" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-3xl sm:text-4xl font-[family-name:var(--font-orbitron)] font-black"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-[10px] text-[#6b6290] tracking-[0.2em] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f0a1e] to-transparent" />
    </section>
  );
}
