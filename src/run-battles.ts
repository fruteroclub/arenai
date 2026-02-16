/**
 * Run 5 ArenAI battles with SmartPlayerAI + on-chain wagers
 */

import { BattleStreams, Teams } from "@pkmn/sim";
import { SmartPlayerAI } from "./smart-player.js";
import { generateTeam, type ArenAITeam, type PokemonSet } from "./team-generator.js";
import { writeFileSync, existsSync } from "fs";
import { execSync } from "child_process";

const CONTRACT = "0xfEf8833dE1956f24a134c77D30D2A64569637448";
const PRIVATE_KEY = "0x49c75f1b4077bc75308d492f0099da7466f24e6bddf9e438a3866d9180739cb3";
const DEPLOYER = "0x5bE78a03706958cEA2b647600A634a58a69A7a06";
const RPC = "https://testnet-rpc.monad.xyz";
const FORGE_BIN = `${process.env.HOME}/.foundry/bin`;

// 5 agent personalities as inline "soul" text
const AGENTS = [
  { name: "Blaze", soul: "I am fire and speed. I move fast, strike hard, burn everything. Aggressive disruptor who experiments wildly.", archetype: "speed" },
  { name: "Ironwall", soul: "I protect what matters. Reliable, stable, secure. A guardian who never breaks under pressure.", archetype: "guardian" },
  { name: "Phantom", soul: "I thrive in chaos. Subvert expectations, hack the system, rebel against convention. Weird and wild.", archetype: "chaotic" },
  { name: "Sage", soul: "Ancient wisdom flows through me. Sacred oracle, prophetic vision, temple ritual. The feathered serpent guides.", archetype: "ancient" },
  { name: "Pixel", soul: "I build systems and engineer solutions. Code is my craft. Protocol architect, data logic, algorithm designer.", archetype: "technical" },
];

// Battle pairs: indices into AGENTS
const MATCHUPS = [
  [0, 1], // Blaze vs Ironwall
  [2, 3], // Phantom vs Sage
  [0, 4], // Blaze vs Pixel
  [1, 2], // Ironwall vs Phantom
  [3, 4], // Sage vs Pixel
];

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

interface BattleResult {
  matchId: string;
  player1: string;
  player2: string;
  winner: string;
  turns: number;
  p1Casualties: string[];
  p2Casualties: string[];
  txCreate?: string;
  txAccept?: string;
  txResolve?: string;
}

async function runSmartBattle(team1: ArenAITeam, team2: ArenAITeam): Promise<{winner: "p1"|"p2"|"tie", turns: number, p1Fainted: string[], p2Fainted: string[]}> {
  const showdown1 = teamToShowdown(team1);
  const showdown2 = teamToShowdown(team2);
  const packed1 = Teams.pack(Teams.import(showdown1)!);
  const packed2 = Teams.pack(Teams.import(showdown2)!);

  if (!packed1 || !packed2) throw new Error("Failed to pack teams");

  const streams = BattleStreams.getPlayerStreams(
    new BattleStreams.BattleStream()
  );

  const p1AI = new SmartPlayerAI(streams.p1);
  const p2AI = new SmartPlayerAI(streams.p2);

  void p1AI.start();
  void p2AI.start();

  void streams.omniscient.write(
    `>start {"formatid":"gen9customgame","seed":[${Array.from({length:4},()=>Math.floor(Math.random()*65536)).join(",")}]}\n` +
    `>player p1 {"name":"${team1.trainer}","team":"${packed1}"}\n` +
    `>player p2 {"name":"${team2.trainer}","team":"${packed2}"}`
  );

  let turns = 0;
  const p1Fainted: string[] = [];
  const p2Fainted: string[] = [];
  let winner: "p1" | "p2" | "tie" = "tie";

  for await (const chunk of streams.omniscient) {
    for (const line of chunk.split("\n")) {
      if (line.startsWith("|turn|")) turns = parseInt(line.split("|")[2]);
      if (line.startsWith("|faint|")) {
        const target = line.split("|")[2];
        const name = target.split(": ")[1];
        if (target.startsWith("p1")) p1Fainted.push(name);
        else p2Fainted.push(name);
      }
      if (line.startsWith("|win|")) {
        const name = line.split("|")[2];
        winner = name === team1.trainer ? "p1" : name === team2.trainer ? "p2" : "tie";
      }
    }
  }

  return { winner, turns, p1Fainted, p2Fainted };
}

function cast(args: string): string {
  const cmd = `${FORGE_BIN}/cast ${args} --rpc-url ${RPC} --private-key ${PRIVATE_KEY}`;
  try {
    return execSync(cmd, { encoding: "utf-8", timeout: 30000 }).trim();
  } catch (e: any) {
    console.error(`  cast error: ${e.message?.split("\n")[0]}`);
    return "";
  }
}

function createOnChainMatch(matchId: string): string {
  console.log(`  📝 Creating on-chain match ${matchId.slice(0, 10)}...`);
  const result = cast(`send ${CONTRACT} "createMatch(bytes32)" ${matchId} --value 0.001ether`);
  // Extract tx hash
  const txMatch = result.match(/transactionHash\s+(0x[a-f0-9]+)/i) || result.match(/(0x[a-f0-9]{64})/);
  return txMatch?.[1] || result.split("\n")[0] || "pending";
}

function acceptOnChainMatch(matchId: string): string {
  console.log(`  ✅ Accepting on-chain match...`);
  // Since we're the same wallet (owner), we can't accept our own match on-chain
  // The contract prevents this. For demo purposes, we'll just record the intent.
  // In production, two different wallets would be used.
  return "skipped-same-wallet";
}

function resolveOnChainMatch(matchId: string, winner: string): string {
  console.log(`  🏆 Resolving on-chain match...`);
  // Can only resolve accepted matches, so we'll cancel instead (since accept is skipped)
  const result = cast(`send ${CONTRACT} "cancelMatch(bytes32)" ${matchId}`);
  const txMatch = result.match(/(0x[a-f0-9]{64})/);
  return txMatch?.[1] || result.split("\n")[0] || "pending";
}

// Build inline teams from archetypes
function buildInlineTeam(agent: typeof AGENTS[0]): ArenAITeam {
  // Write temp soul file
  const tmpPath = `/tmp/arenai-soul-${agent.name}.md`;
  writeFileSync(tmpPath, `# ${agent.name}\n\n${agent.soul}\n\n**Name:** ${agent.name}\n`);
  return generateTeam(tmpPath);
}

async function main() {
  console.log("🐍 ArenAI Battle Series — 5 Matches with Smart AI\n");
  console.log(`📋 Contract: ${CONTRACT}`);
  console.log(`💰 Deployer: ${DEPLOYER}\n`);

  // Generate teams
  const teams = AGENTS.map(a => {
    const team = buildInlineTeam(a);
    console.log(`🎮 ${a.name} (${team.gymType} Gym): ${team.team.map(t => t.species).join(", ")}`);
    return team;
  });
  console.log("");

  const results: BattleResult[] = [];

  for (let i = 0; i < MATCHUPS.length; i++) {
    const [a, b] = MATCHUPS[i];
    const matchIdHex = `0x${Buffer.from(`arenai-match-${i + 1}-${Date.now()}`).toString("hex").padEnd(64, "0")}`;
    
    console.log(`\n⚔️  Match ${i + 1}: ${AGENTS[a].name} vs ${AGENTS[b].name}`);

    // Run battle
    const battle = await runSmartBattle(teams[a], teams[b]);
    const winnerName = battle.winner === "p1" ? AGENTS[a].name : battle.winner === "p2" ? AGENTS[b].name : "Draw";

    console.log(`  🏆 Winner: ${winnerName} (${battle.turns} turns)`);
    console.log(`  💀 ${AGENTS[a].name} lost: ${battle.p1Fainted.join(", ") || "none"}`);
    console.log(`  💀 ${AGENTS[b].name} lost: ${battle.p2Fainted.join(", ") || "none"}`);

    // On-chain wager
    const txCreate = createOnChainMatch(matchIdHex);
    // Since same wallet can't accept own match, we create + cancel (recording the match)
    const txResolve = resolveOnChainMatch(matchIdHex, DEPLOYER);

    results.push({
      matchId: matchIdHex,
      player1: AGENTS[a].name,
      player2: AGENTS[b].name,
      winner: winnerName,
      turns: battle.turns,
      p1Casualties: battle.p1Fainted,
      p2Casualties: battle.p2Fainted,
      txCreate,
      txAccept: "same-wallet-demo",
      txResolve,
    });

    // Small delay between matches
    await new Promise(r => setTimeout(r, 2000));
  }

  // Write results
  const output = {
    contract: CONTRACT,
    network: "monad-testnet",
    chainId: 10143,
    deployer: DEPLOYER,
    timestamp: new Date().toISOString(),
    aiEngine: "SmartPlayerAI",
    matches: results,
  };

  writeFileSync("/home/kukulcan/projects/arenai/battle-results.json", JSON.stringify(output, null, 2));
  console.log("\n✅ Results written to battle-results.json");
  console.log(`📊 ${results.length} matches completed`);

  // Summary
  console.log("\n═══════════════════════════════════");
  console.log("   ARENAI BATTLE SERIES RESULTS");
  console.log("═══════════════════════════════════");
  for (const r of results) {
    console.log(`  ${r.player1} vs ${r.player2} → 🏆 ${r.winner} (${r.turns}T)`);
  }
}

main().catch(console.error);
