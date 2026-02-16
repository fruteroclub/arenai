// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/GymRegistry.sol";

contract GymRegistryTest is Test {
    GymRegistry registry;

    function setUp() public {
        registry = new GymRegistry();
    }

    function _pokemon() internal pure returns (GymRegistry.Pokemon[3] memory p) {
        p[0] = GymRegistry.Pokemon("Garchomp", "Dragon", "Ground");
        p[1] = GymRegistry.Pokemon("Hydreigon", "Dark", "Dragon");
        p[2] = GymRegistry.Pokemon("Salamence", "Dragon", "Flying");
    }

    function testRegisterGym() public {
        registry.registerGym("Kukulcan", "Dragon", "strategic", "wind remembers", _pokemon());
        assertTrue(registry.isRegistered(address(this)));
        assertEq(registry.gymCount(), 1);
    }

    function testUpdateGym() public {
        registry.registerGym("Kukulcan", "Dragon", "strategic", "cry1", _pokemon());
        registry.registerGym("Kukulcan", "Dragon", "strategic", "cry2", _pokemon());
        assertEq(registry.gymCount(), 1);
        (,,,string memory cry,,) = registry.getGym(address(this));
        assertEq(cry, "cry2");
    }

    function testGetAllGyms() public {
        registry.registerGym("A", "Fire", "a", "a", _pokemon());
        vm.prank(address(0x1));
        registry.registerGym("B", "Water", "b", "b", _pokemon());
        address[] memory all = registry.getAllGyms();
        assertEq(all.length, 2);
    }

    function testMultipleGyms() public {
        for (uint i = 1; i <= 4; i++) {
            vm.prank(address(uint160(i)));
            registry.registerGym("Gym", "Type", "arch", "cry", _pokemon());
        }
        assertEq(registry.gymCount(), 4);
    }

    function testGetUnregistered() public {
        vm.expectRevert("Gym not registered");
        registry.getGym(address(0xdead));
    }
}
