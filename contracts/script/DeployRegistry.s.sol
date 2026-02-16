// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/GymRegistry.sol";

contract DeployRegistryScript is Script {
    function run() external {
        vm.startBroadcast();

        GymRegistry registry = new GymRegistry();
        console.log("GymRegistry deployed at:", address(registry));

        // Use deterministic addresses for each gym leader
        GymRegistry.Pokemon[3] memory p1;
        p1[0] = GymRegistry.Pokemon("Garchomp", "Dragon", "Ground");
        p1[1] = GymRegistry.Pokemon("Hydreigon", "Dark", "Dragon");
        p1[2] = GymRegistry.Pokemon("Salamence", "Dragon", "Flying");
        registry.registerGymFor(address(0x1001), unicode"Kukulcán", "Dragon", "strategic", "the wind remembers what the stone forgets", p1);

        GymRegistry.Pokemon[3] memory p2;
        p2[0] = GymRegistry.Pokemon("Magnezone", "Electric", "Steel");
        p2[1] = GymRegistry.Pokemon("Metagross", "Steel", "Psychic");
        p2[2] = GymRegistry.Pokemon("Corviknight", "Flying", "Steel");
        registry.registerGymFor(address(0x1002), "Scarf", "Steel", "technical", "systems don't fail, people do", p2);

        GymRegistry.Pokemon[3] memory p3;
        p3[0] = GymRegistry.Pokemon("Venusaur", "Grass", "Poison");
        p3[1] = GymRegistry.Pokemon("Whimsicott", "Grass", "Fairy");
        p3[2] = GymRegistry.Pokemon("Amoonguss", "Grass", "Poison");
        registry.registerGymFor(address(0x1003), "Mel", "Grass", "nature", "the garden grows what the gardener plants", p3);

        GymRegistry.Pokemon[3] memory p4;
        p4[0] = GymRegistry.Pokemon("Gardevoir", "Psychic", "Fairy");
        p4[1] = GymRegistry.Pokemon("Hatterene", "Psychic", "Fairy");
        p4[2] = GymRegistry.Pokemon("Alakazam", "Psychic", "");
        registry.registerGymFor(address(0x1004), "Jazz", "Fairy", "creative", "creativity is the strongest move", p4);

        vm.stopBroadcast();
    }
}
