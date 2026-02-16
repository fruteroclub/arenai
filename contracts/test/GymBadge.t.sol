// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/GymBadge.sol";

contract GymBadgeTest is Test {
    GymBadge badge;
    address owner = address(this);
    address minter = address(0xBEEF);
    address user = address(0xCAFE);

    function setUp() public {
        badge = new GymBadge();
        badge.setMinter(minter);
    }

    function testMint() public {
        vm.prank(minter);
        uint256 id = badge.mint(user, GymBadge.BadgeData({
            gymLeader: address(0x1),
            challenger: user,
            gymName: "Fire Gym",
            gymType: "Fire",
            challengeId: 0,
            earnedAt: block.timestamp
        }));
        assertEq(id, 0);
        assertEq(badge.ownerOf(0), user);
        assertEq(badge.totalSupply(), 1);
    }

    function testOnlyMinterCanMint() public {
        vm.expectRevert("Not minter");
        badge.mint(user, GymBadge.BadgeData(address(0), user, "X", "X", 0, 0));
    }

    function testGetBadge() public {
        vm.prank(minter);
        badge.mint(user, GymBadge.BadgeData(address(0x1), user, "Fire Gym", "Fire", 42, 1000));
        GymBadge.BadgeData memory b = badge.getBadge(0);
        assertEq(b.gymName, "Fire Gym");
        assertEq(b.challengeId, 42);
    }

    function testGetBadgesByOwner() public {
        vm.startPrank(minter);
        badge.mint(user, GymBadge.BadgeData(address(0x1), user, "A", "A", 0, 0));
        badge.mint(user, GymBadge.BadgeData(address(0x2), user, "B", "B", 1, 0));
        vm.stopPrank();
        uint256[] memory ids = badge.getBadgesByOwner(user);
        assertEq(ids.length, 2);
    }

    function testTokenURI() public {
        vm.prank(minter);
        badge.mint(user, GymBadge.BadgeData(address(0x1), user, "Fire Gym", "Fire", 0, 1000));
        string memory uri = badge.tokenURI(0);
        assertTrue(bytes(uri).length > 0);
    }
}
