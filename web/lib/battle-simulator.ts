/**
 * Simulated battle engine for the demo.
 * Generates realistic-looking Pokemon battle sequences.
 */

import type { Trainer, Pokemon } from "./mock-data";

export interface BattleEvent {
  type: "switch" | "move" | "damage" | "faint" | "supereffective" | "crit" | "miss" | "win" | "text";
  side?: "p1" | "p2";
  pokemon?: string;
  move?: string;
  target?: string;
  damage?: number;
  hpAfter?: number;
  hpMax?: number;
  winner?: string;
  text?: string;
}

// Type effectiveness (simplified)
const EFFECTIVENESS: Record<string, Record<string, number>> = {
  Fire: { Grass: 2, Ice: 2, Bug: 2, Steel: 2, Water: 0.5, Rock: 0.5, Fire: 0.5, Dragon: 0.5 },
  Water: { Fire: 2, Ground: 2, Rock: 2, Water: 0.5, Grass: 0.5, Dragon: 0.5 },
  Grass: { Water: 2, Ground: 2, Rock: 2, Fire: 0.5, Grass: 0.5, Poison: 0.5, Flying: 0.5, Bug: 0.5, Dragon: 0.5, Steel: 0.5 },
  Electric: { Water: 2, Flying: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Dragon: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5, Dark: 0 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark: { Psychic: 2, Ghost: 2, Fighting: 0.5, Dark: 0.5, Fairy: 0.5 },
  Fairy: { Fighting: 2, Dragon: 2, Dark: 2, Fire: 0.5, Poison: 0.5, Steel: 0.5 },
  Steel: { Ice: 2, Rock: 2, Fairy: 2, Fire: 0.5, Water: 0.5, Electric: 0.5, Steel: 0.5 },
  Ghost: { Psychic: 2, Ghost: 2, Dark: 0.5, Normal: 0 },
  Fighting: { Normal: 2, Ice: 2, Rock: 2, Dark: 2, Steel: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Fairy: 0.5, Ghost: 0 },
  Flying: { Grass: 2, Fighting: 2, Bug: 2, Electric: 0.5, Rock: 0.5, Steel: 0.5 },
  Poison: { Grass: 2, Fairy: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0 },
  Ground: { Fire: 2, Electric: 2, Poison: 2, Rock: 2, Steel: 2, Grass: 0.5, Bug: 0.5, Flying: 0 },
  Rock: { Fire: 2, Ice: 2, Flying: 2, Bug: 2, Fighting: 0.5, Ground: 0.5, Steel: 0.5 },
  Bug: { Grass: 2, Psychic: 2, Dark: 2, Fire: 0.5, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Ghost: 0.5, Steel: 0.5, Fairy: 0.5 },
  Ice: { Grass: 2, Ground: 2, Flying: 2, Dragon: 2, Fire: 0.5, Water: 0.5, Ice: 0.5, Steel: 0.5 },
  Normal: { Rock: 0.5, Steel: 0.5, Ghost: 0 },
};

function getMoveType(move: string): string {
  const moveTypes: Record<string, string> = {
    "Flamethrower": "Fire", "Fire Blast": "Fire", "Heat Wave": "Fire", "Mystical Fire": "Fire",
    "Surf": "Water", "Hydro Pump": "Water", "Scald": "Water",
    "Thunderbolt": "Electric", "Thunder": "Electric", "Volt Switch": "Electric",
    "Energy Ball": "Grass", "Leaf Storm": "Grass", "Giga Drain": "Grass",
    "Ice Beam": "Ice", "Blizzard": "Ice", "Freeze-Dry": "Ice",
    "Close Combat": "Fighting", "Aura Sphere": "Fighting", "Drain Punch": "Fighting", "Focus Blast": "Fighting",
    "Sludge Bomb": "Poison", "Toxic": "Poison", "Sludge Wave": "Poison",
    "Earthquake": "Ground", "Earth Power": "Ground",
    "Air Slash": "Flying", "Hurricane": "Flying", "Brave Bird": "Flying",
    "Psychic": "Psychic", "Psyshock": "Psychic", "Future Sight": "Psychic",
    "Shadow Ball": "Ghost", "Hex": "Ghost", "Shadow Claw": "Ghost",
    "Dragon Pulse": "Dragon", "Draco Meteor": "Dragon", "Dragon Claw": "Dragon",
    "Dark Pulse": "Dark", "Knock Off": "Dark", "Crunch": "Dark", "Foul Play": "Dark",
    "Flash Cannon": "Steel", "Iron Head": "Steel", "Meteor Mash": "Steel", "Bullet Punch": "Steel",
    "Moonblast": "Fairy", "Dazzling Gleam": "Fairy", "Play Rough": "Fairy", "Draining Kiss": "Fairy",
    "Body Slam": "Normal", "Hyper Voice": "Normal", "Extreme Speed": "Normal", "Tri Attack": "Normal",
    "Bug Buzz": "Bug", "U-turn": "Bug", "X-Scissor": "Bug",
    "Stone Edge": "Rock", "Rock Slide": "Rock", "Power Gem": "Rock",
    "Wild Charge": "Electric",
  };
  return moveTypes[move] || "Normal";
}

function getEffectiveness(moveType: string, defTypes: string[]): number {
  let mult = 1;
  for (const dt of defTypes) {
    const eff = EFFECTIVENESS[moveType]?.[dt];
    if (eff !== undefined) mult *= eff;
  }
  return mult;
}

export function simulateBattle(t1: Trainer, t2: Trainer): BattleEvent[] {
  const events: BattleEvent[] = [];

  // Clone teams with HP
  const p1Team = t1.team.filter(p => !p.fainted).map(p => ({ ...p, hp: p.maxHp }));
  const p2Team = t2.team.filter(p => !p.fainted).map(p => ({ ...p, hp: p.maxHp }));

  let p1Active = 0;
  let p2Active = 0;

  events.push({ type: "text", text: `⚔️ ${t1.name} vs ${t2.name}!` });
  events.push({ type: "switch", side: "p1", pokemon: p1Team[0].species });
  events.push({ type: "switch", side: "p2", pokemon: p2Team[0].species });

  let turn = 0;
  const maxTurns = 60;

  while (turn < maxTurns) {
    turn++;
    const p1Mon = p1Team[p1Active];
    const p2Mon = p2Team[p2Active];
    if (!p1Mon || !p2Mon) break;

    // Each side attacks
    for (const [attacker, defender, aSide, dSide] of [
      [p1Mon, p2Mon, "p1" as const, "p2" as const],
      [p2Mon, p1Mon, "p2" as const, "p1" as const],
    ] as [typeof p1Mon, typeof p2Mon, "p1" | "p2", "p1" | "p2"][]) {
      if (attacker.hp <= 0 || defender.hp <= 0) continue;

      // Pick a damaging move (skip status)
      const damagingMoves = attacker.moves.filter(m =>
        !["Toxic", "Thunder Wave", "Will-O-Wisp", "Stealth Rock", "Spikes", "Light Screen", "Reflect",
          "Tailwind", "Wish", "Protect", "Recover", "Roost", "Swords Dance", "Dragon Dance",
          "Calm Mind", "Nasty Plot", "Sleep Powder", "Spore", "Leech Seed", "Encore", "Taunt",
          "Rain Dance", "Aromatherapy", "Clear Smog", "Floral Healing", "Morning Sun", "Rest",
          "Substitute", "Trick Room", "Quiver Dance", "Glare"].includes(m)
      );
      const move = damagingMoves.length > 0
        ? damagingMoves[Math.floor(Math.random() * damagingMoves.length)]
        : attacker.moves[0];

      const moveType = getMoveType(move);
      const eff = getEffectiveness(moveType, defender.types);

      if (eff === 0) {
        events.push({ type: "move", side: aSide, pokemon: attacker.species, move, target: defender.species });
        events.push({ type: "text", text: `It doesn't affect ${defender.species}...` });
        continue;
      }

      // Damage calc (simplified)
      const baseDamage = 30 + Math.floor(Math.random() * 25);
      const crit = Math.random() < 0.0625;
      let damage = Math.floor(baseDamage * eff * (crit ? 1.5 : 1));
      // Random variance
      damage = Math.floor(damage * (0.85 + Math.random() * 0.15));
      damage = Math.max(1, damage);

      events.push({ type: "move", side: aSide, pokemon: attacker.species, move, target: defender.species });

      if (eff > 1) events.push({ type: "supereffective" });
      if (crit) events.push({ type: "crit" });

      defender.hp = Math.max(0, defender.hp - damage);
      events.push({
        type: "damage",
        side: dSide,
        pokemon: defender.species,
        damage,
        hpAfter: defender.hp,
        hpMax: defender.maxHp,
      });

      if (defender.hp <= 0) {
        events.push({ type: "faint", side: dSide, pokemon: defender.species });

        // Switch to next
        const team = dSide === "p1" ? p1Team : p2Team;
        const nextIdx = team.findIndex((p, i) => i !== (dSide === "p1" ? p1Active : p2Active) && p.hp > 0);

        if (nextIdx === -1) {
          // Winner!
          const winner = dSide === "p1" ? t2.name : t1.name;
          events.push({ type: "win", winner });
          return events;
        }

        if (dSide === "p1") p1Active = nextIdx;
        else p2Active = nextIdx;
        events.push({ type: "switch", side: dSide, pokemon: team[nextIdx].species });
      }
    }
  }

  // Tiebreak: whoever has more HP
  const p1TotalHp = p1Team.reduce((s, p) => s + p.hp, 0);
  const p2TotalHp = p2Team.reduce((s, p) => s + p.hp, 0);
  events.push({ type: "win", winner: p1TotalHp >= p2TotalHp ? t1.name : t2.name });

  return events;
}
