// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/ArenAIWager.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        ArenAIWager wager = new ArenAIWager();
        console.log("ArenAIWager deployed at:", address(wager));
        vm.stopBroadcast();
    }
}
