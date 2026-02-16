// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/GymRegistry.sol";

contract GymRegistryTest is Test {
    GymRegistry registry;
    address deployer = address(this);

    function setUp() public {
        registry = new GymRegistry();
    }

    function _pokemon() internal pure returns (GymRegistry.Pokemon[3] memory p) {
        p[0] = GymRegistry.Pokemon("Garchomp", "Dragon", "Ground");
        p[1] = GymRegistry.Pokemon("Hydreigon", "Dark", "Dragon");
        p[2] = GymRegistry.Pokemon("Salamence", "Dragon", "Flying");
    }

    function testRegisterGymWithFee() public {
        registry.registerGym{value: 1 ether}("Kukulcan", "Dragon", "strategic", "wind remembers", _pokemon());
        assertTrue(registry.isRegistered(address(this)));
        assertEq(registry.gymCount(), 1);
    }

    function testRegisterGymWithoutFeeReverts() public {
        vm.expectRevert("Insufficient registration fee");
        registry.registerGym("Kukulcan", "Dragon", "strategic", "wind remembers", _pokemon());
    }

    function testUpdateGymIsFree() public {
        registry.registerGym{value: 1 ether}("Kukulcan", "Dragon", "strategic", "cry1", _pokemon());
        // Update should be free
        registry.registerGym("Kukulcan", "Dragon", "strategic", "cry2", _pokemon());
        assertEq(registry.gymCount(), 1);
        (,,,string memory cry,,) = registry.getGym(address(this));
        assertEq(cry, "cry2");
    }

    function testSetRegistrationFee() public {
        registry.setRegistrationFee(2 ether);
        assertEq(registry.registrationFee(), 2 ether);
    }

    function testSetRegistrationFeeNonOwnerReverts() public {
        vm.prank(address(0x1));
        vm.expectRevert("Not owner");
        registry.setRegistrationFee(2 ether);
    }

    function testWithdrawFees() public {
        registry.registerGym{value: 1 ether}("Kukulcan", "Dragon", "strategic", "cry", _pokemon());
        uint256 before = address(this).balance;
        registry.withdrawFees();
        assertEq(address(this).balance, before + 1 ether);
    }

    function testWithdrawFeesNonOwnerReverts() public {
        registry.registerGym{value: 1 ether}("Kukulcan", "Dragon", "strategic", "cry", _pokemon());
        vm.prank(address(0x1));
        vm.expectRevert("Not owner");
        registry.withdrawFees();
    }

    function testRegisterGymFor() public {
        registry.registerGymFor{value: 1 ether}(address(0x2), "Test", "Fire", "a", "cry", _pokemon());
        assertTrue(registry.isRegistered(address(0x2)));
    }

    function testGetAllGyms() public {
        registry.registerGym{value: 1 ether}("A", "Fire", "a", "a", _pokemon());
        vm.deal(address(0x1), 10 ether);
        vm.prank(address(0x1));
        registry.registerGym{value: 1 ether}("B", "Water", "b", "b", _pokemon());
        address[] memory all = registry.getAllGyms();
        assertEq(all.length, 2);
    }

    function testGetUnregistered() public {
        vm.expectRevert("Gym not registered");
        registry.getGym(address(0xdead));
    }

    receive() external payable {}
}
