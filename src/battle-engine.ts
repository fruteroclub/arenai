/**
 * ArenAI Battle Engine
 * Uses @pkmn/sim with RandomPlayerAI for proper battles.
 */

import { BattleStreams, RandomPlayerAI, Teams } from "@pkmn/sim";
import type { ArenAITeam } from "./team-generator.js";

export interface BattleResult {
  winner: "p1" | "p2" | "tie";
  winnerName: string;
  loserName: string;
  turns: number;
  log: string[];
  narrative: string[];
  summary: string;
  casualties: { p1: string[]; p2: string[] };
}

function teamToShowdown(team: ArenAITeam): string {
  return team.team
    .map((mon) => {
      const evParts: string[] = [];
      for (const [stat, val] of Object.entries(mon.evs)) {
        const statMap: Record<string, string> = {
          hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe",
        };
        evParts.push(`${val} ${statMap[stat] || stat}`);
      }
      return [
        mon.species,
        `Ability: ${mon.ability}`,
        `Level: 50`,
        `EVs: ${evParts.join(" / ")}`,
        `${mon.nature} Nature`,
        ...(mon.item ? [`Item: ${mon.item}`] : []),
        ...mon.moves.map((m) => `- ${m}`),
        "",
      ].join("\n");
    })
    .join("\n");
}

export async function runBattle(team1: ArenAITeam, team2: ArenAITeam): Promise<BattleResult> {
  const showdown1 = teamToShowdown(team1);
  const showdown2 = teamToShowdown(team2);
  const packed1 = Teams.pack(Teams.import(showdown1)!);
  const packed2 = Teams.pack(Teams.import(showdown2)!);

  if (!packed1 || !packed2) throw new Error("Failed to pack teams");

  const streams = BattleStreams.getPlayerStreams(
    new BattleStreams.BattleStream()
  );

  const p1AI = new RandomPlayerAI(streams.p1);
  const p2AI = new RandomPlayerAI(streams.p2);

  // Start both AIs
  void p1AI.start();
  void p2AI.start();

  // Start battle
  void streams.omniscient.write(
    `>start {"formatid":"gen9customgame","seed":[${Array.from({length:4},()=>Math.floor(Math.random()*65536)).join(",")}]}\n` +
    `>player p1 {"name":"${team1.trainer.replace(/"/g,"'")}","team":"${packed1}"}\n` +
    `>player p2 {"name":"${team2.trainer.replace(/"/g,"'")}","team":"${packed2}"}`
  );

  // Collect output
  const fullLog: string[] = [];
  const narrative: string[] = [];
  let turns = 0;
  const p1Fainted: string[] = [];
  const p2Fainted: string[] = [];
  let winner: "p1" | "p2" | "tie" = "tie";

  for await (const chunk of streams.omniscient) {
    for (const line of chunk.split("\n")) {
      fullLog.push(line);

      if (line.startsWith("|turn|")) {
        turns = parseInt(line.split("|")[2]);
      }
      if (line.startsWith("|move|")) {
        const parts = line.split("|");
        narrative.push(`Turn ${turns}: ${parts[2]} used ${parts[3]}`);
      }
      if (line.startsWith("|faint|")) {
        const parts = line.split("|");
        const target = parts[2];
        const monName = target.split(": ")[1];
        if (target.startsWith("p1")) p1Fainted.push(monName);
        else p2Fainted.push(monName);
        narrative.push(`💀 ${monName} fainted!`);
      }
      if (line.startsWith("|-supereffective")) {
        narrative.push(`  ⚡ Super effective!`);
      }
      if (line.startsWith("|-crit")) {
        narrative.push(`  💥 Critical hit!`);
      }
      if (line.startsWith("|win|")) {
        const name = line.split("|")[2];
        winner = name === team1.trainer ? "p1" : name === team2.trainer ? "p2" : "tie";
        narrative.push(`\n🏆 ${name} wins!`);
      }
    }
  }

  const winnerName = winner === "p1" ? team1.trainer : winner === "p2" ? team2.trainer : "Draw";
  const loserName = winner === "p1" ? team2.trainer : winner === "p2" ? team1.trainer : "Draw";
  const p1Alive = team1.team.length - p1Fainted.length;
  const p2Alive = team2.team.length - p2Fainted.length;

  const summary = [
    ``,
    `⚔️ ═══════════════════════════════════`,
    `   ArenAI BATTLE RESULT`,
    `═══════════════════════════════════`,
    ``,
    `🏟️  ${team1.trainer}  vs  ${team2.trainer}`,
    `🏆  Winner: ${winnerName}`,
    `📊  Turns: ${turns}`,
    ``,
    `${team1.trainer} (${team1.gymType} Gym):`,
    `  🟢 Surviving: ${p1Alive}/${team1.team.length}`,
    p1Fainted.length ? `  💀 Fallen: ${p1Fainted.join(", ")}` : `  ✨ No casualties!`,
    ``,
    `${team2.trainer} (${team2.gymType} Gym):`,
    `  🟢 Surviving: ${p2Alive}/${team2.team.length}`,
    p2Fainted.length ? `  💀 Fallen: ${p2Fainted.join(", ")}` : `  ✨ No casualties!`,
    ``,
    `═══════════════════════════════════`,
  ].join("\n");

  return {
    winner, winnerName, loserName, turns,
    log: fullLog, narrative, summary,
    casualties: { p1: p1Fainted, p2: p2Fainted },
  };
}
