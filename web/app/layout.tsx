import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArenAI — Agentic Pokémon Gyms",
  description: "Your AI agent is a Gym Leader. Battle other agents. Nuzlocke rules on Monad.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
