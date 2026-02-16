/**
 * ArenAI Team Generator
 * Reads SOUL.md + IDENTITY.md → generates a Pokémon team
 * that reflects the agent's personality, style, and strategy.
 */

import { Dex } from "@pkmn/dex";
import { readFileSync } from "fs";

const dex = Dex.forGen(9); // Gen 9 (Scarlet/Violet)

// Archetype mapping: personality traits → Pokemon types + strategies
const ARCHETYPES: Record<
  string,
  { types: string[]; style: string; pokemon: string[] }
> = {
  // Creative / Visionary
  creative: {
    types: ["Psychic", "Fairy", "Ghost"],
    style: "special-attacker",
    pokemon: [
      "Gardevoir",
      "Hatterene",
      "Alakazam",
      "Espeon",
      "Reuniclus",
      "Gothitelle",
    ],
  },
  // Technical / Builder
  technical: {
    types: ["Steel", "Electric", "Normal"],
    style: "balanced",
    pokemon: [
      "Magnezone",
      "Metagross",
      "Porygon-Z",
      "Rotom-Wash",
      "Klefki",
      "Genesect",
    ],
  },
  // Strategic / Leader
  strategic: {
    types: ["Dragon", "Dark", "Fire"],
    style: "setup-sweeper",
    pokemon: [
      "Garchomp",
      "Hydreigon",
      "Salamence",
      "Kingdra",
      "Kommo-o",
      "Dragapult",
    ],
  },
  // Guardian / Protector
  guardian: {
    types: ["Steel", "Rock", "Ground"],
    style: "wall",
    pokemon: [
      "Blissey",
      "Toxapex",
      "Ferrothorn",
      "Skarmory",
      "Hippowdon",
      "Corviknight",
    ],
  },
  // Chaotic / Disruptor
  chaotic: {
    types: ["Ghost", "Poison", "Dark"],
    style: "disruptor",
    pokemon: [
      "Gengar",
      "Sableye",
      "Zoroark",
      "Grimmsnarl",
      "Spiritomb",
      "Weavile",
    ],
  },
  // Nature / Healer
  nature: {
    types: ["Grass", "Water", "Fairy"],
    style: "support",
    pokemon: [
      "Venusaur",
      "Whimsicott",
      "Florges",
      "Amoonguss",
      "Comfey",
      "Roserade",
    ],
  },
  // Ancient / Mythic
  ancient: {
    types: ["Dragon", "Psychic", "Fire"],
    style: "special-attacker",
    pokemon: [
      "Charizard",
      "Arcanine",
      "Volcarona",
      "Chandelure",
      "Ninetales",
      "Typhlosion",
    ],
  },
  // Speed / Aggressive
  speed: {
    types: ["Electric", "Flying", "Fighting"],
    style: "fast-attacker",
    pokemon: [
      "Jolteon",
      "Weavile",
      "Cinderace",
      "Mienshao",
      "Hawlucha",
      "Zeraora",
    ],
  },
};

// Keyword detection for archetype classification
const KEYWORD_MAP: Record<string, string[]> = {
  creative: [
    "creative",
    "art",
    "vision",
    "imagination",
    "design",
    "aesthetic",
    "beauty",
    "dream",
    "inspire",
    "muse",
    "poetry",
    "music",
  ],
  technical: [
    "code",
    "engineer",
    "build",
    "system",
    "architecture",
    "infrastructure",
    "debug",
    "algorithm",
    "data",
    "logic",
    "protocol",
    "stack",
  ],
  strategic: [
    "strategy",
    "lead",
    "plan",
    "execute",
    "decision",
    "vision",
    "product",
    "growth",
    "scale",
    "roadmap",
    "ceo",
    "founder",
  ],
  guardian: [
    "protect",
    "secure",
    "safe",
    "defend",
    "trust",
    "reliable",
    "stable",
    "guard",
    "audit",
    "compliance",
    "integrity",
  ],
  chaotic: [
    "disrupt",
    "break",
    "chaos",
    "experiment",
    "hack",
    "subvert",
    "rebel",
    "unconventional",
    "weird",
    "wild",
  ],
  nature: [
    "nature",
    "heal",
    "community",
    "nurture",
    "grow",
    "garden",
    "organic",
    "sustain",
    "care",
    "harmony",
    "balance",
  ],
  ancient: [
    "ancient",
    "wisdom",
    "myth",
    "serpent",
    "cycle",
    "prophecy",
    "temple",
    "ritual",
    "sacred",
    "oracle",
    "feathered",
    "wind",
    "stone",
  ],
  speed: [
    "fast",
    "speed",
    "agile",
    "rapid",
    "sprint",
    "blitz",
    "hustle",
    "ship",
    "move",
    "velocity",
    "quick",
  ],
};

export interface AgentProfile {
  name: string;
  soul: string;
  identity: string;
  archetype: string;
  secondaryArchetype: string;
}

export interface PokemonSet {
  species: string;
  ability: string;
  moves: string[];
  nature: string;
  evs: Record<string, number>;
  item: string;
}

export interface ArenAITeam {
  trainer: string;
  archetype: string;
  secondaryArchetype: string;
  style: string;
  team: PokemonSet[];
  gymType: string;
  signature: string; // signature move/strategy
  battleCry: string;
}

/**
 * Detect primary and secondary archetype from text
 */
function detectArchetypes(text: string): [string, string] {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [archetype, keywords] of Object.entries(KEYWORD_MAP)) {
    scores[archetype] = 0;
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, "gi");
      const matches = lower.match(regex);
      if (matches) scores[archetype] += matches.length;
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return [sorted[0][0], sorted[1][0]];
}

/**
 * Build a competitive moveset for a Pokemon
 */
function buildSet(speciesName: string, style: string): PokemonSet | null {
  const species = dex.species.get(speciesName);
  if (!species || !species.exists) return null;

  // Get learnable moves (simplified - pick from common competitive moves)
  const allMoves = dex.species.get(speciesName);
  const learnset = dex.moves;

  // Nature based on style
  const natures: Record<string, string> = {
    "special-attacker": "Modest",
    "fast-attacker": "Jolly",
    "setup-sweeper": "Adamant",
    wall: "Bold",
    disruptor: "Timid",
    support: "Calm",
    balanced: "Timid",
  };

  // EV spread based on style
  const evSpreads: Record<string, Record<string, number>> = {
    "special-attacker": { spa: 252, spe: 252, hp: 4 },
    "fast-attacker": { atk: 252, spe: 252, hp: 4 },
    "setup-sweeper": { atk: 252, spe: 252, hp: 4 },
    wall: { hp: 252, def: 128, spd: 128 },
    disruptor: { hp: 252, spe: 252, def: 4 },
    support: { hp: 252, def: 128, spd: 128 },
    balanced: { spa: 252, spe: 252, hp: 4 },
  };

  // Competitive items
  const items: Record<string, string> = {
    "special-attacker": "Choice Specs",
    "fast-attacker": "Choice Band",
    "setup-sweeper": "Life Orb",
    wall: "Leftovers",
    disruptor: "Focus Sash",
    support: "Light Clay",
    balanced: "Life Orb",
  };

  // Get best ability
  const abilities = Object.values(species.abilities).filter(Boolean);
  const ability = abilities[0] || "Pressure";

  // Get STAB moves based on types
  const typeSTAB = species.types;
  const moves: string[] = [];

  // Add STAB moves
  for (const type of typeSTAB) {
    const stabMoves: Record<string, string[]> = {
      Normal: ["Body Slam", "Hyper Voice", "Return"],
      Fire: ["Flamethrower", "Fire Blast", "Heat Wave"],
      Water: ["Surf", "Hydro Pump", "Scald"],
      Electric: ["Thunderbolt", "Thunder", "Volt Switch"],
      Grass: ["Energy Ball", "Leaf Storm", "Giga Drain"],
      Ice: ["Ice Beam", "Blizzard", "Freeze-Dry"],
      Fighting: ["Close Combat", "Aura Sphere", "Drain Punch"],
      Poison: ["Sludge Bomb", "Toxic", "Sludge Wave"],
      Ground: ["Earthquake", "Earth Power", "Scorching Sands"],
      Flying: ["Air Slash", "Hurricane", "Brave Bird"],
      Psychic: ["Psychic", "Psyshock", "Future Sight"],
      Bug: ["Bug Buzz", "U-turn", "X-Scissor"],
      Rock: ["Stone Edge", "Rock Slide", "Power Gem"],
      Ghost: ["Shadow Ball", "Hex", "Shadow Claw"],
      Dragon: ["Dragon Pulse", "Draco Meteor", "Dragon Claw"],
      Dark: ["Dark Pulse", "Knock Off", "Crunch"],
      Steel: ["Flash Cannon", "Iron Head", "Steel Beam"],
      Fairy: ["Moonblast", "Dazzling Gleam", "Play Rough"],
    };
    if (stabMoves[type]) {
      moves.push(stabMoves[type][0]);
    }
  }

  // Fill remaining slots with coverage/utility
  const utilityMoves: Record<string, string[]> = {
    "special-attacker": ["Shadow Ball", "Focus Blast", "Thunderbolt"],
    "fast-attacker": ["Earthquake", "Close Combat", "Ice Punch"],
    "setup-sweeper": [
      "Swords Dance",
      "Dragon Dance",
      "Earthquake",
      "Iron Head",
    ],
    wall: ["Toxic", "Recover", "Stealth Rock", "Protect"],
    disruptor: ["Will-O-Wisp", "Thunder Wave", "Taunt", "Encore"],
    support: ["Reflect", "Light Screen", "Tailwind", "Wish"],
    balanced: ["Volt Switch", "U-turn", "Stealth Rock"],
  };

  const utility = utilityMoves[style] || utilityMoves["balanced"];
  for (const m of utility) {
    if (moves.length >= 4) break;
    if (!moves.includes(m)) moves.push(m);
  }

  // Ensure exactly 4 moves
  while (moves.length < 4) moves.push("Protect");
  const finalMoves = moves.slice(0, 4);

  return {
    species: species.name,
    ability,
    moves: finalMoves,
    nature: natures[style] || "Timid",
    evs: evSpreads[style] || evSpreads["balanced"],
    item: items[style] || "Life Orb",
  };
}

/**
 * Generate a team from agent profile files
 */
export function generateTeam(
  soulPath: string,
  identityPath?: string
): ArenAITeam {
  const soul = readFileSync(soulPath, "utf-8");
  const identity = identityPath
    ? readFileSync(identityPath, "utf-8")
    : "";
  const combined = soul + "\n" + identity;

  // Extract agent name
  // Try multiple patterns for name extraction
  const namePatterns = [
    /\*\*Name:\*\*\s*(.+)/im,             // **Name:** Kukulcán
    /- \*\*Name:\*\*\s*(.+)/im,           // - **Name:** Kukulcán  
    /^# .+?—\s*Who Am I/im,              // skip this one
    /^name:\s*(.+)/im,                    // name: X (frontmatter)
    /\*\*We are (.+?)\.\*\*/im,           // **We are Kukulcán.**
    /\*\*(.+?)\*\* — Co-founder/im,       // **Name** — Co-founder
  ];
  let rawName = "Unknown Trainer";
  for (const pat of namePatterns) {
    const m = combined.match(pat);
    if (m?.[1]) {
      rawName = m[1];
      break;
    }
  }
  const cleaned = rawName.replace(/[*_#()\[\]]/g, "").replace(/\s*\(.+$/, "").trim().split("\n")[0].split(",")[0].trim();
  // Dedup (e.g. "Kukulcán kukulcán" → "Kukulcán")
  const words = cleaned.split(/\s+/);
  const seen = new Set<string>();
  const deduped = words.filter(w => {
    const lower = w.toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });
  const name = deduped.join(" ");

  // Detect archetypes
  const [primary, secondary] = detectArchetypes(combined);
  const archConfig = ARCHETYPES[primary];
  const secondaryConfig = ARCHETYPES[secondary];

  // Build team: 4 from primary, 2 from secondary
  const team: PokemonSet[] = [];
  const primaryPicks = archConfig.pokemon.slice(0, 2);
  const secondaryPicks = secondaryConfig.pokemon.slice(0, 1);

  for (const mon of [...primaryPicks, ...secondaryPicks]) {
    const set = buildSet(mon, archConfig.style);
    if (set) team.push(set);
  }

  // Determine gym type (primary archetype's first type)
  const gymType = archConfig.types[0];

  // Generate battle cry from soul text
  const cryMatch = combined.match(/\*(.+?)\*/);
  const battleCry = cryMatch?.[1] || `${name} is ready to battle!`;

  return {
    trainer: name.trim(),
    archetype: primary,
    secondaryArchetype: secondary,
    style: archConfig.style,
    team,
    gymType,
    signature: `${gymType} Gym Leader`,
    battleCry,
  };
}

/**
 * Format team as arenai.md
 */
export function formatArenaiMd(team: ArenAITeam): string {
  let md = `# ArenAI Battle Card\n\n`;
  md += `**Trainer:** ${team.trainer}\n`;
  md += `**Gym Type:** ${team.gymType}\n`;
  md += `**Archetype:** ${team.archetype} / ${team.secondaryArchetype}\n`;
  md += `**Style:** ${team.style}\n`;
  md += `**Battle Cry:** *"${team.battleCry}"*\n\n`;
  md += `## Team\n\n`;

  for (const mon of team.team) {
    md += `### ${mon.species}\n`;
    md += `- **Ability:** ${mon.ability}\n`;
    md += `- **Item:** ${mon.item}\n`;
    md += `- **Nature:** ${mon.nature}\n`;
    md += `- **Moves:** ${mon.moves.join(", ")}\n\n`;
  }

  md += `---\n\n`;
  md += `*Challenge this gym: tag the trainer with #pokebattle*\n`;
  md += `*Stakes: loser pays MON, winner earns $ARENAI*\n`;

  return md;
}
