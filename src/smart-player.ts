/**
 * SmartPlayerAI — Type-advantage-aware battle AI for @pkmn/sim
 * Replaces RandomPlayerAI with strategic move selection:
 * 1. Type effectiveness scoring
 * 2. STAB bonus consideration
 * 3. Smart switching on type disadvantage
 */

import { ObjectReadWriteStream } from "@pkmn/sim";
import { Dex } from "@pkmn/dex";

const dex = Dex.forGen(9);

// Type effectiveness chart
const TYPE_CHART: Record<string, Record<string, number>> = {
  Normal:   { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire:     { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water:    { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Grass:    { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Ice:      { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2, Fairy: 0.5 },
  Poison:   { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
  Ground:   { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
  Flying:   { Electric: 0.5, Grass: 2, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
  Psychic:  { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug:      { Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5, Fairy: 0.5 },
  Rock:     { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost:    { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon:   { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark:     { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
  Steel:    { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
  Fairy:    { Fire: 0.5, Poison: 0.5, Fighting: 2, Dragon: 2, Dark: 2, Steel: 0.5 },
};

function getEffectiveness(moveType: string, defTypes: string[]): number {
  let mult = 1;
  for (const dt of defTypes) {
    mult *= TYPE_CHART[moveType]?.[dt] ?? 1;
  }
  return mult;
}

function scoreMove(
  moveId: string,
  attackerTypes: string[],
  defenderTypes: string[],
): number {
  const move = dex.moves.get(moveId);
  if (!move || !move.exists) return 0;

  // Skip status moves — score them lower but not zero
  if (move.category === "Status") return 0.5;

  const effectiveness = getEffectiveness(move.type, defenderTypes);
  if (effectiveness === 0) return 0;

  let score = move.basePower * effectiveness;

  // STAB bonus
  if (attackerTypes.includes(move.type)) {
    score *= 1.5;
  }

  return score;
}

function getDefensiveMatchup(myTypes: string[], oppTypes: string[]): number {
  // How much damage opponent's STAB moves do to us (lower = better for us)
  let worstMult = 1;
  for (const ot of oppTypes) {
    const eff = getEffectiveness(ot, myTypes);
    if (eff > worstMult) worstMult = eff;
  }
  return worstMult;
}

export class SmartPlayerAI {
  readonly stream: ObjectReadWriteStream<string>;
  readonly log: string[] = [];

  constructor(stream: ObjectReadWriteStream<string>) {
    this.stream = stream;
  }

  async start() {
    for await (const chunk of this.stream) {
      this.receive(chunk);
    }
  }

  private receive(chunk: string) {
    for (const line of chunk.split("\n")) {
      this.log.push(line);
      if (line.startsWith("|request|")) {
        const json = line.slice(9);
        if (!json) continue;
        try {
          const request = JSON.parse(json);
          this.handleRequest(request);
        } catch {}
      }
      if (line.startsWith("|error|")) {
        // On error, do nothing — game is over or will resend
      }
    }
  }

  private handleRequest(request: any) {
    if (request.wait) return;

    if (request.forceSwitch) {
      // Must switch
      const pokemon = request.side?.pokemon || [];
      const choice = this.pickBestSwitch(request, pokemon);
      this.choose(choice);
      return;
    }

    if (request.active) {
      const active = request.active[0];
      const pokemon = request.side?.pokemon || [];
      const choice = this.pickBestAction(active, pokemon, request);
      this.choose(choice);
      return;
    }

    // Team preview or other — pick default order
    if (request.teamPreview) {
      this.choose("default");
      return;
    }

    this.choose("default");
  }

  private getOpponentTypes(): string[] {
    // Parse from log — find opponent's active Pokémon
    let oppSpecies = "";
    for (let i = this.log.length - 1; i >= 0; i--) {
      const line = this.log[i];
      // |switch|p2a: Gardevoir|Gardevoir, L50, F|100/100
      // or |switch|p1a: ...
      // We need the opponent's, determine our player side
      const switchMatch = line.match(/\|(switch|drag)\|p([12])a: [^|]+\|([^,|]+)/);
      if (switchMatch) {
        const side = switchMatch[2];
        // Our side is determined by our request — but we can infer from active pokemon
        // For simplicity: check both sides, skip our own
        oppSpecies = switchMatch[3].trim();
        // We'll just use the last switch that isn't ours
        // Since we don't know our side easily, use the species and check both
        break;
      }
    }

    if (oppSpecies) {
      const species = dex.species.get(oppSpecies);
      if (species?.exists) return species.types;
    }

    return [];
  }

  private getMyPlayerSide(): string {
    // Scan log for our player assignment
    for (const line of this.log) {
      if (line.startsWith("|player|p1|") || line.startsWith("|player|p2|")) {
        // Can't easily distinguish — use request pokemon names
      }
    }
    return "p1"; // fallback
  }

  private pickBestAction(active: any, pokemon: any[], request: any): string {
    const moves = active.moves || [];
    const oppTypes = this.getOpponentTypes();

    // Get our active pokemon's types
    const myActive = pokemon.find((p: any) => p.active);
    const mySpecies = myActive ? dex.species.get(myActive.details?.split(",")[0]) : null;
    const myTypes = mySpecies?.types || [];
    const myHpPercent = myActive ? parseHp(myActive.condition) : 100;

    // Score each move
    let bestMoveIdx = 0;
    let bestScore = -1;

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      if (move.disabled) continue;
      if (move.pp === 0) continue;

      const score = scoreMove(move.id, myTypes, oppTypes);
      if (score > bestScore) {
        bestScore = score;
        bestMoveIdx = i;
      }
    }

    // Consider switching if we're at type disadvantage
    const defensiveMatchup = getDefensiveMatchup(myTypes, oppTypes);
    if (defensiveMatchup >= 2 && myHpPercent > 30) {
      // We're weak to their STAB — check bench
      const switchTarget = this.findBetterMatchup(pokemon, oppTypes);
      if (switchTarget !== null) {
        return `switch ${switchTarget}`;
      }
    }

    // If all moves are bad (score 0), try switching
    if (bestScore <= 0) {
      const switchTarget = this.findBetterMatchup(pokemon, oppTypes);
      if (switchTarget !== null) {
        return `switch ${switchTarget}`;
      }
    }

    return `move ${bestMoveIdx + 1}`;
  }

  private findBetterMatchup(pokemon: any[], oppTypes: string[]): number | null {
    let bestIdx: number | null = null;
    let bestDefScore = 999;

    for (let i = 0; i < pokemon.length; i++) {
      const p = pokemon[i];
      if (p.active) continue;
      if (p.condition === "0 fnt") continue;

      const species = dex.species.get(p.details?.split(",")[0]);
      if (!species?.exists) continue;

      const defScore = getDefensiveMatchup(species.types, oppTypes);
      const hpPct = parseHp(p.condition);

      // Only switch to pokemon with decent HP and better matchup
      if (defScore < bestDefScore && hpPct > 25) {
        bestDefScore = defScore;
        bestIdx = i + 1; // 1-indexed for switch command
      }
    }

    // Only suggest switch if it's actually better (< 1x means we resist)
    if (bestIdx !== null && bestDefScore <= 1) {
      return bestIdx;
    }
    return null;
  }

  private pickBestSwitch(request: any, pokemon: any[]): string {
    const oppTypes = this.getOpponentTypes();

    let bestIdx = -1;
    let bestScore = 999;

    for (let i = 0; i < pokemon.length; i++) {
      const p = pokemon[i];
      if (p.active) continue;
      if (p.condition === "0 fnt") continue;

      const species = dex.species.get(p.details?.split(",")[0]);
      if (!species?.exists) {
        if (bestIdx === -1) bestIdx = i;
        continue;
      }

      const defScore = getDefensiveMatchup(species.types, oppTypes);
      const hpPct = parseHp(p.condition);
      // Combine defensive matchup and HP
      const score = defScore * (1 - hpPct / 200); // weight HP slightly

      if (score < bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    if (bestIdx === -1) bestIdx = 0;
    return `switch ${bestIdx + 1}`;
  }

  private choose(choice: string) {
    void this.stream.write(choice);
  }
}

function parseHp(condition: string): number {
  if (!condition || condition === "0 fnt") return 0;
  const parts = condition.split("/");
  if (parts.length < 2) return 100;
  const current = parseInt(parts[0]);
  const max = parseInt(parts[1]);
  if (!max) return 100;
  return (current / max) * 100;
}
