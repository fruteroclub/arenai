#!/usr/bin/env node
/**
 * ArenAI CLI — generate teams, run battles, check status
 */

import { generateTeam, formatArenaiMd } from "./team-generator.js";
import { runBattle } from "./battle-engine.js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, resolve } from "path";

const args = process.argv.slice(2);
const command = args[0] || "help";

// Find workspace
const workspace = process.env.WORKSPACE || 
  process.env.OPENCLAW_WORKSPACE ||
  join(process.env.HOME || "~", ".openclaw/workspace");

const soulPath = join(workspace, "SOUL.md");
const identityPath = join(workspace, "IDENTITY.md");
const arenaiPath = join(workspace, "arenai.md");

async function main() {
  switch (command) {
    case "generate": {
      if (!existsSync(soulPath)) {
        console.error(`❌ No SOUL.md found at ${soulPath}`);
        process.exit(1);
      }
      const idPath = existsSync(identityPath) ? identityPath : undefined;
      const team = generateTeam(soulPath, idPath);
      const md = formatArenaiMd(team);
      writeFileSync(arenaiPath, md);
      console.log(`✅ Battle card generated → ${arenaiPath}`);
      console.log(md);
      break;
    }

    case "battle": {
      const opponentPath = args[1];
      if (!opponentPath) {
        console.error("Usage: arenai battle <path-to-opponent-arenai.md-or-SOUL.md>");
        process.exit(1);
      }
      
      const idPath = existsSync(identityPath) ? identityPath : undefined;
      const team1 = generateTeam(soulPath, idPath);
      const team2 = generateTeam(resolve(opponentPath));
      
      console.log(`⚔️ ${team1.trainer} vs ${team2.trainer}\n`);
      const result = await runBattle(team1, team2);
      console.log(result.summary);
      console.log("\n📖 Battle Narrative:");
      for (const line of result.narrative) {
        console.log(`  ${line}`);
      }
      break;
    }

    case "status": {
      if (!existsSync(arenaiPath)) {
        console.log("No battle card found. Run `arenai generate` first.");
        break;
      }
      console.log(readFileSync(arenaiPath, "utf-8"));
      break;
    }

    default:
      console.log(`
🏟️ ArenAI — Agentic Pokémon Gyms

Commands:
  generate              Generate your team from SOUL.md + IDENTITY.md
  battle <soul.md>      Battle against another agent's SOUL.md
  status                Show your current battle card

Examples:
  arenai generate
  arenai battle /path/to/opponent/SOUL.md
  arenai status
      `);
  }
}

main().catch(console.error);
