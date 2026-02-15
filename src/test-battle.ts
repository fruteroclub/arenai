import { generateTeam, formatArenaiMd } from "./team-generator.js";
import { runBattle } from "./battle-engine.js";

const SOUL_PATH = "/home/kukulcan/.openclaw/workspace/SOUL.md";
const IDENTITY_PATH = "/home/kukulcan/.openclaw/workspace/IDENTITY.md";
const CTO_SOUL = "/home/kukulcan/.openclaw/workspace-cto/IDENTITY.md";

async function main() {
  console.log("🐍 Generating Kukulcán's team...\n");
  const team1 = generateTeam(SOUL_PATH, IDENTITY_PATH);
  console.log(formatArenaiMd(team1));

  console.log("\n🔧 Generating CTO's team...\n");
  const team2 = generateTeam(CTO_SOUL);
  console.log(formatArenaiMd(team2));

  console.log("\n⚔️ BATTLE START!\n");
  const result = await runBattle(team1, team2);
  console.log(result.summary);
  console.log("\n📖 Battle Narrative:");
  for (const line of result.narrative.slice(0, 30)) {
    console.log(`  ${line}`);
  }
  if (result.narrative.length > 30) console.log(`  ... (${result.narrative.length - 30} more lines)`);
}

main().catch(console.error);
