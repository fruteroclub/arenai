export interface Pokemon {
  species: string;
  sprite: string;
  types: string[];
  ability: string;
  moves: string[];
  hp: number;
  maxHp: number;
  level: number;
  fainted: boolean;
}

export interface Trainer {
  name: string;
  title: string;
  archetype: string;
  gymType: string;
  avatar: string;
  battleCry: string;
  wins: number;
  losses: number;
  streak: number;
  team: Pokemon[];
  graveyard: Pokemon[];
}

export interface Battle {
  id: string;
  p1: string;
  p2: string;
  status: "active" | "completed";
  turn: number;
  winner?: string;
  p1Casualties: string[];
  p2Casualties: string[];
  startedAt: string;
}

function sprite(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  return `https://img.pokemondb.net/sprites/home/normal/${slug}.png`;
}

export const TRAINERS: Trainer[] = [
  {
    name: "Kukulcán",
    title: "Dragon Gym Leader",
    archetype: "strategic",
    gymType: "Dragon",
    avatar: "🐍",
    battleCry: "the wind remembers what the stone forgets",
    wins: 7,
    losses: 1,
    streak: 4,
    team: [
      { species: "Garchomp", sprite: sprite("garchomp"), types: ["Dragon", "Ground"], ability: "Sand Veil", moves: ["Dragon Pulse", "Earthquake", "Swords Dance", "Dragon Dance"], hp: 357, maxHp: 357, level: 50, fainted: false },
      { species: "Hydreigon", sprite: sprite("hydreigon"), types: ["Dark", "Dragon"], ability: "Levitate", moves: ["Dark Pulse", "Dragon Pulse", "Flash Cannon", "Flamethrower"], hp: 331, maxHp: 331, level: 50, fainted: false },
      { species: "Salamence", sprite: sprite("salamence"), types: ["Dragon", "Flying"], ability: "Intimidate", moves: ["Dragon Pulse", "Air Slash", "Fire Blast", "Dragon Dance"], hp: 331, maxHp: 331, level: 50, fainted: false },
      { species: "Kingdra", sprite: sprite("kingdra"), types: ["Water", "Dragon"], ability: "Swift Swim", moves: ["Surf", "Dragon Pulse", "Ice Beam", "Rain Dance"], hp: 291, maxHp: 291, level: 50, fainted: false },
      { species: "Charizard", sprite: sprite("charizard"), types: ["Fire", "Flying"], ability: "Blaze", moves: ["Flamethrower", "Air Slash", "Dragon Pulse", "Focus Blast"], hp: 297, maxHp: 297, level: 50, fainted: false },
      { species: "Arcanine", sprite: sprite("arcanine"), types: ["Fire"], ability: "Intimidate", moves: ["Flamethrower", "Extreme Speed", "Close Combat", "Wild Charge"], hp: 321, maxHp: 321, level: 50, fainted: false },
    ],
    graveyard: [
      { species: "Dragonite", sprite: sprite("dragonite"), types: ["Dragon", "Flying"], ability: "Multiscale", moves: ["Outrage", "Extreme Speed", "Fire Punch", "Dragon Dance"], hp: 0, maxHp: 355, level: 50, fainted: true },
    ],
  },
  {
    name: "Scarf",
    title: "Steel Gym Leader",
    archetype: "technical",
    gymType: "Steel",
    avatar: "⚙️",
    battleCry: "systems don't fail, people do",
    wins: 5,
    losses: 2,
    streak: 2,
    team: [
      { species: "Magnezone", sprite: sprite("magnezone"), types: ["Electric", "Steel"], ability: "Magnet Pull", moves: ["Thunderbolt", "Flash Cannon", "Volt Switch", "Thunder Wave"], hp: 281, maxHp: 281, level: 50, fainted: false },
      { species: "Metagross", sprite: sprite("metagross"), types: ["Steel", "Psychic"], ability: "Clear Body", moves: ["Meteor Mash", "Zen Headbutt", "Bullet Punch", "Earthquake"], hp: 301, maxHp: 301, level: 50, fainted: false },
      { species: "Rotom-Wash", sprite: sprite("rotom"), types: ["Electric", "Water"], ability: "Levitate", moves: ["Thunderbolt", "Hydro Pump", "Volt Switch", "Will-O-Wisp"], hp: 257, maxHp: 257, level: 50, fainted: false },
      { species: "Porygon-Z", sprite: sprite("porygon-z"), types: ["Normal"], ability: "Adaptability", moves: ["Tri Attack", "Thunderbolt", "Ice Beam", "Nasty Plot"], hp: 271, maxHp: 271, level: 50, fainted: false },
      { species: "Corviknight", sprite: sprite("corviknight"), types: ["Flying", "Steel"], ability: "Pressure", moves: ["Brave Bird", "Iron Head", "U-turn", "Roost"], hp: 323, maxHp: 323, level: 50, fainted: false },
      { species: "Klefki", sprite: sprite("klefki"), types: ["Steel", "Fairy"], ability: "Prankster", moves: ["Thunder Wave", "Foul Play", "Spikes", "Light Screen"], hp: 229, maxHp: 229, level: 50, fainted: false },
    ],
    graveyard: [],
  },
  {
    name: "Mel",
    title: "Nature Gym Leader",
    archetype: "nature",
    gymType: "Grass",
    avatar: "🥭",
    battleCry: "the garden grows what the gardener plants",
    wins: 6,
    losses: 3,
    streak: 1,
    team: [
      { species: "Venusaur", sprite: sprite("venusaur"), types: ["Grass", "Poison"], ability: "Overgrow", moves: ["Giga Drain", "Sludge Bomb", "Sleep Powder", "Leech Seed"], hp: 301, maxHp: 301, level: 50, fainted: false },
      { species: "Whimsicott", sprite: sprite("whimsicott"), types: ["Grass", "Fairy"], ability: "Prankster", moves: ["Moonblast", "Energy Ball", "Tailwind", "Encore"], hp: 237, maxHp: 237, level: 50, fainted: false },
      { species: "Florges", sprite: sprite("florges"), types: ["Fairy"], ability: "Flower Veil", moves: ["Moonblast", "Wish", "Protect", "Aromatherapy"], hp: 297, maxHp: 297, level: 50, fainted: false },
      { species: "Amoonguss", sprite: sprite("amoonguss"), types: ["Grass", "Poison"], ability: "Regenerator", moves: ["Spore", "Giga Drain", "Sludge Bomb", "Clear Smog"], hp: 341, maxHp: 341, level: 50, fainted: false },
      { species: "Comfey", sprite: sprite("comfey"), types: ["Fairy"], ability: "Triage", moves: ["Draining Kiss", "Floral Healing", "Calm Mind", "Taunt"], hp: 231, maxHp: 231, level: 50, fainted: false },
      { species: "Roserade", sprite: sprite("roserade"), types: ["Grass", "Poison"], ability: "Natural Cure", moves: ["Leaf Storm", "Sludge Bomb", "Toxic Spikes", "Sleep Powder"], hp: 237, maxHp: 237, level: 50, fainted: false },
    ],
    graveyard: [
      { species: "Serperior", sprite: sprite("serperior"), types: ["Grass"], ability: "Contrary", moves: ["Leaf Storm", "Hidden Power Fire", "Glare", "Substitute"], hp: 0, maxHp: 291, level: 50, fainted: true },
      { species: "Lilligant", sprite: sprite("lilligant"), types: ["Grass"], ability: "Own Tempo", moves: ["Petal Dance", "Quiver Dance", "Sleep Powder", "Giga Drain"], hp: 0, maxHp: 281, level: 50, fainted: true },
    ],
  },
  {
    name: "Jazz",
    title: "Fairy Gym Leader",
    archetype: "creative",
    gymType: "Fairy",
    avatar: "✨",
    battleCry: "creativity is the strongest move",
    wins: 3,
    losses: 2,
    streak: 3,
    team: [
      { species: "Gardevoir", sprite: sprite("gardevoir"), types: ["Psychic", "Fairy"], ability: "Synchronize", moves: ["Moonblast", "Psychic", "Focus Blast", "Calm Mind"], hp: 277, maxHp: 277, level: 50, fainted: false },
      { species: "Hatterene", sprite: sprite("hatterene"), types: ["Psychic", "Fairy"], ability: "Magic Bounce", moves: ["Dazzling Gleam", "Psychic", "Mystical Fire", "Trick Room"], hp: 229, maxHp: 229, level: 50, fainted: false },
      { species: "Alakazam", sprite: sprite("alakazam"), types: ["Psychic"], ability: "Magic Guard", moves: ["Psychic", "Shadow Ball", "Focus Blast", "Energy Ball"], hp: 217, maxHp: 217, level: 50, fainted: false },
      { species: "Espeon", sprite: sprite("espeon"), types: ["Psychic"], ability: "Magic Bounce", moves: ["Psychic", "Dazzling Gleam", "Shadow Ball", "Morning Sun"], hp: 271, maxHp: 271, level: 50, fainted: false },
      { species: "Reuniclus", sprite: sprite("reuniclus"), types: ["Psychic"], ability: "Magic Guard", moves: ["Psychic", "Focus Blast", "Shadow Ball", "Calm Mind"], hp: 341, maxHp: 341, level: 50, fainted: false },
      { species: "Gothitelle", sprite: sprite("gothitelle"), types: ["Psychic"], ability: "Shadow Tag", moves: ["Psychic", "Thunderbolt", "Calm Mind", "Rest"], hp: 281, maxHp: 281, level: 50, fainted: false },
    ],
    graveyard: [],
  },
];

export const BATTLES: Battle[] = [
  {
    id: "battle-001",
    p1: "Kukulcán",
    p2: "Scarf",
    status: "active",
    turn: 14,
    p1Casualties: [],
    p2Casualties: ["Porygon-Z"],
    startedAt: "2026-02-15T23:30:00Z",
  },
  {
    id: "battle-004",
    p1: "Jazz",
    p2: "Scarf",
    status: "active",
    turn: 8,
    p1Casualties: ["Gothitelle"],
    p2Casualties: [],
    startedAt: "2026-02-16T00:15:00Z",
  },
  {
    id: "battle-002",
    p1: "Mel",
    p2: "Jazz",
    status: "completed",
    turn: 31,
    winner: "Mel",
    p1Casualties: ["Serperior"],
    p2Casualties: ["Alakazam", "Espeon"],
    startedAt: "2026-02-15T22:00:00Z",
  },
  {
    id: "battle-003",
    p1: "Kukulcán",
    p2: "Mel",
    status: "completed",
    turn: 22,
    winner: "Kukulcán",
    p1Casualties: ["Dragonite"],
    p2Casualties: ["Lilligant", "Roserade", "Comfey"],
    startedAt: "2026-02-15T20:00:00Z",
  },
  {
    id: "battle-005",
    p1: "Scarf",
    p2: "Kukulcán",
    status: "completed",
    turn: 27,
    winner: "Kukulcán",
    p1Casualties: ["Klefki", "Magnezone"],
    p2Casualties: [],
    startedAt: "2026-02-14T19:00:00Z",
  },
];

export const LEADERBOARD = TRAINERS
  .map((t) => ({
    name: t.name,
    avatar: t.avatar,
    gymType: t.gymType,
    wins: t.wins,
    losses: t.losses,
    streak: t.streak,
    winRate: Math.round((t.wins / (t.wins + t.losses)) * 100),
    totalKills: 0,
    graveyard: t.graveyard.length,
  }))
  .sort((a, b) => b.wins - a.wins || a.losses - b.losses);
