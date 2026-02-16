/**
 * Client-side team generator — ported from src/team-generator.ts
 */

const ARCHETYPES: Record<string, { types: string[]; style: string; pokemon: string[] }> = {
  creative: {
    types: ["Psychic", "Fairy", "Ghost"],
    style: "special-attacker",
    pokemon: ["Gardevoir", "Hatterene", "Alakazam", "Espeon", "Reuniclus", "Gothitelle"],
  },
  technical: {
    types: ["Steel", "Electric", "Normal"],
    style: "balanced",
    pokemon: ["Magnezone", "Metagross", "Porygon-Z", "Rotom-Wash", "Klefki", "Corviknight"],
  },
  strategic: {
    types: ["Dragon", "Dark", "Fire"],
    style: "setup-sweeper",
    pokemon: ["Garchomp", "Hydreigon", "Salamence", "Kingdra", "Kommo-o", "Dragapult"],
  },
  guardian: {
    types: ["Steel", "Rock", "Ground"],
    style: "wall",
    pokemon: ["Blissey", "Toxapex", "Ferrothorn", "Skarmory", "Hippowdon", "Corviknight"],
  },
  chaotic: {
    types: ["Ghost", "Poison", "Dark"],
    style: "disruptor",
    pokemon: ["Gengar", "Sableye", "Zoroark", "Grimmsnarl", "Spiritomb", "Weavile"],
  },
  nature: {
    types: ["Grass", "Water", "Fairy"],
    style: "support",
    pokemon: ["Venusaur", "Whimsicott", "Florges", "Amoonguss", "Comfey", "Roserade"],
  },
  ancient: {
    types: ["Dragon", "Psychic", "Fire"],
    style: "special-attacker",
    pokemon: ["Charizard", "Arcanine", "Volcarona", "Chandelure", "Ninetales", "Typhlosion"],
  },
  speed: {
    types: ["Electric", "Flying", "Fighting"],
    style: "fast-attacker",
    pokemon: ["Jolteon", "Weavile", "Cinderace", "Mienshao", "Hawlucha", "Zeraora"],
  },
};

const KEYWORD_MAP: Record<string, string[]> = {
  creative: ["creative", "art", "vision", "imagination", "design", "aesthetic", "beauty", "dream", "inspire", "muse", "poetry", "music"],
  technical: ["code", "engineer", "build", "system", "architecture", "infrastructure", "debug", "algorithm", "data", "logic", "protocol", "stack"],
  strategic: ["strategy", "lead", "plan", "execute", "decision", "vision", "product", "growth", "scale", "roadmap", "ceo", "founder"],
  guardian: ["protect", "secure", "safe", "defend", "trust", "reliable", "stable", "guard", "audit", "compliance", "integrity"],
  chaotic: ["disrupt", "break", "chaos", "experiment", "hack", "subvert", "rebel", "unconventional", "weird", "wild"],
  nature: ["nature", "heal", "community", "nurture", "grow", "garden", "organic", "sustain", "care", "harmony", "balance"],
  ancient: ["ancient", "wisdom", "myth", "serpent", "cycle", "prophecy", "temple", "ritual", "sacred", "oracle", "feathered", "wind", "stone"],
  speed: ["fast", "speed", "agile", "rapid", "sprint", "blitz", "hustle", "ship", "move", "velocity", "quick"],
};

// Pokemon type data for display
const POKEMON_DATA: Record<string, { types: string[]; ability: string }> = {
  "Gardevoir": { types: ["Psychic", "Fairy"], ability: "Synchronize" },
  "Hatterene": { types: ["Psychic", "Fairy"], ability: "Magic Bounce" },
  "Alakazam": { types: ["Psychic"], ability: "Magic Guard" },
  "Espeon": { types: ["Psychic"], ability: "Magic Bounce" },
  "Reuniclus": { types: ["Psychic"], ability: "Magic Guard" },
  "Gothitelle": { types: ["Psychic"], ability: "Shadow Tag" },
  "Magnezone": { types: ["Electric", "Steel"], ability: "Magnet Pull" },
  "Metagross": { types: ["Steel", "Psychic"], ability: "Clear Body" },
  "Porygon-Z": { types: ["Normal"], ability: "Adaptability" },
  "Rotom-Wash": { types: ["Electric", "Water"], ability: "Levitate" },
  "Klefki": { types: ["Steel", "Fairy"], ability: "Prankster" },
  "Corviknight": { types: ["Flying", "Steel"], ability: "Pressure" },
  "Garchomp": { types: ["Dragon", "Ground"], ability: "Sand Veil" },
  "Hydreigon": { types: ["Dark", "Dragon"], ability: "Levitate" },
  "Salamence": { types: ["Dragon", "Flying"], ability: "Intimidate" },
  "Kingdra": { types: ["Water", "Dragon"], ability: "Swift Swim" },
  "Kommo-o": { types: ["Dragon", "Fighting"], ability: "Bulletproof" },
  "Dragapult": { types: ["Dragon", "Ghost"], ability: "Clear Body" },
  "Blissey": { types: ["Normal"], ability: "Natural Cure" },
  "Toxapex": { types: ["Poison", "Water"], ability: "Regenerator" },
  "Ferrothorn": { types: ["Grass", "Steel"], ability: "Iron Barbs" },
  "Skarmory": { types: ["Steel", "Flying"], ability: "Sturdy" },
  "Hippowdon": { types: ["Ground"], ability: "Sand Stream" },
  "Gengar": { types: ["Ghost", "Poison"], ability: "Cursed Body" },
  "Sableye": { types: ["Dark", "Ghost"], ability: "Prankster" },
  "Zoroark": { types: ["Dark"], ability: "Illusion" },
  "Grimmsnarl": { types: ["Dark", "Fairy"], ability: "Prankster" },
  "Spiritomb": { types: ["Ghost", "Dark"], ability: "Pressure" },
  "Weavile": { types: ["Dark", "Ice"], ability: "Pressure" },
  "Venusaur": { types: ["Grass", "Poison"], ability: "Overgrow" },
  "Whimsicott": { types: ["Grass", "Fairy"], ability: "Prankster" },
  "Florges": { types: ["Fairy"], ability: "Flower Veil" },
  "Amoonguss": { types: ["Grass", "Poison"], ability: "Regenerator" },
  "Comfey": { types: ["Fairy"], ability: "Triage" },
  "Roserade": { types: ["Grass", "Poison"], ability: "Natural Cure" },
  "Charizard": { types: ["Fire", "Flying"], ability: "Blaze" },
  "Arcanine": { types: ["Fire"], ability: "Intimidate" },
  "Volcarona": { types: ["Bug", "Fire"], ability: "Flame Body" },
  "Chandelure": { types: ["Ghost", "Fire"], ability: "Flash Fire" },
  "Ninetales": { types: ["Fire"], ability: "Drought" },
  "Typhlosion": { types: ["Fire"], ability: "Blaze" },
  "Jolteon": { types: ["Electric"], ability: "Volt Absorb" },
  "Cinderace": { types: ["Fire"], ability: "Libero" },
  "Mienshao": { types: ["Fighting"], ability: "Inner Focus" },
  "Hawlucha": { types: ["Fighting", "Flying"], ability: "Unburden" },
  "Zeraora": { types: ["Electric"], ability: "Volt Absorb" },
};

const STAB_MOVES: Record<string, string[]> = {
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

const UTILITY_MOVES: Record<string, string[]> = {
  "special-attacker": ["Shadow Ball", "Focus Blast", "Thunderbolt"],
  "fast-attacker": ["Earthquake", "Close Combat", "Ice Punch"],
  "setup-sweeper": ["Swords Dance", "Dragon Dance", "Earthquake", "Iron Head"],
  wall: ["Toxic", "Recover", "Stealth Rock", "Protect"],
  disruptor: ["Will-O-Wisp", "Thunder Wave", "Taunt", "Encore"],
  support: ["Reflect", "Light Screen", "Tailwind", "Wish"],
  balanced: ["Volt Switch", "U-turn", "Stealth Rock"],
};

const BATTLE_CRIES: Record<string, string[]> = {
  creative: ["imagination is the strongest move", "dreams shape reality", "beauty wins wars"],
  technical: ["systems don't fail, people do", "optimized for victory", "the stack is my weapon"],
  strategic: ["every move has a purpose", "checkmate in three", "the wind remembers what the stone forgets"],
  guardian: ["none shall pass", "my walls are unbreakable", "protection is the highest form of power"],
  chaotic: ["chaos is a ladder", "expect the unexpected", "rules are meant to be broken"],
  nature: ["the garden grows what the gardener plants", "nature always wins", "harmony is strength"],
  ancient: ["the old ways endure", "prophecy unfolds", "the cycle continues"],
  speed: ["too fast for you", "speed kills", "blink and you lose"],
};

function sprite(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  return `https://img.pokemondb.net/sprites/home/normal/${slug}.png`;
}

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
  // If no keywords matched, pick random
  if (sorted[0][1] === 0) {
    const keys = Object.keys(ARCHETYPES);
    const i = Math.floor(Math.random() * keys.length);
    const j = (i + 1 + Math.floor(Math.random() * (keys.length - 1))) % keys.length;
    return [keys[i], keys[j]];
  }
  return [sorted[0][0], sorted[1][0]];
}

export interface GeneratedPokemon {
  species: string;
  sprite: string;
  types: string[];
  ability: string;
  moves: string[];
}

export interface GeneratedTeam {
  archetype: string;
  secondaryArchetype: string;
  gymType: string;
  style: string;
  team: GeneratedPokemon[];
  battleCry: string;
}

export function generateTeamFromText(text: string): GeneratedTeam {
  const [primary, secondary] = detectArchetypes(text);
  const archConfig = ARCHETYPES[primary];
  const secondaryConfig = ARCHETYPES[secondary];

  const primaryPicks = archConfig.pokemon.slice(0, 4);
  const secondaryPicks = secondaryConfig.pokemon.slice(0, 2);

  const team: GeneratedPokemon[] = [...primaryPicks, ...secondaryPicks].map((name) => {
    const data = POKEMON_DATA[name] || { types: ["Normal"], ability: "Pressure" };
    const moves: string[] = [];
    for (const t of data.types) {
      if (STAB_MOVES[t] && moves.length < 4) moves.push(STAB_MOVES[t][0]);
    }
    const utility = UTILITY_MOVES[archConfig.style] || UTILITY_MOVES["balanced"];
    for (const m of utility) {
      if (moves.length >= 4) break;
      if (!moves.includes(m)) moves.push(m);
    }
    while (moves.length < 4) moves.push("Protect");

    return {
      species: name,
      sprite: sprite(name),
      types: data.types,
      ability: data.ability,
      moves: moves.slice(0, 4),
    };
  });

  const cries = BATTLE_CRIES[primary];
  const battleCry = cries[Math.floor(Math.random() * cries.length)];

  return {
    archetype: primary,
    secondaryArchetype: secondary,
    gymType: archConfig.types[0],
    style: archConfig.style,
    team,
    battleCry,
  };
}

export { ARCHETYPES };
