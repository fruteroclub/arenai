// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/GymBadge.sol";
import "../src/GymChallenge.sol";

contract DeployGymChallengeScript is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy GymBadge
        GymBadge badge = new GymBadge();
        console.log("GymBadge deployed at:", address(badge));

        // Deploy GymChallenge with badge + registry
        address registry = 0xebDeae236ED701195823214e59D7a4245a2F1B3C;
        GymChallenge gymChallenge = new GymChallenge(address(badge), registry);
        console.log("GymChallenge deployed at:", address(gymChallenge));

        // Set minter
        badge.setMinter(address(gymChallenge));
        console.log("Minter set to GymChallenge");

        // Set challenge fees for 4 demo gyms (1 MON each)
        gymChallenge.setChallengeFeeFor(address(0x1001), 1 ether);
        gymChallenge.setChallengeFeeFor(address(0x1002), 1 ether);
        gymChallenge.setChallengeFeeFor(address(0x1003), 1 ether);
        gymChallenge.setChallengeFeeFor(address(0x1004), 1 ether);
        console.log("Challenge fees set for 4 gyms");

        vm.stopBroadcast();
    }
}
