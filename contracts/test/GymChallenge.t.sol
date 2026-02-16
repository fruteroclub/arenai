// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/GymChallenge.sol";
import "../src/GymBadge.sol";

contract GymChallengeTest is Test {
    GymBadge badge;
    GymChallenge gymChallenge;
    address owner = address(this);
    address gymLeader = address(0x1111);
    address challenger = address(0x2222);

    function setUp() public {
        badge = new GymBadge();
        gymChallenge = new GymChallenge(address(badge), address(0));
        badge.setMinter(address(gymChallenge));
        vm.deal(challenger, 100 ether);
        vm.deal(gymLeader, 10 ether);
    }

    function testSetChallengeFee() public {
        vm.prank(gymLeader);
        gymChallenge.setChallengeFee(1 ether);
        assertEq(gymChallenge.challengeFee(gymLeader), 1 ether);
    }

    function testMinFeeEnforcement() public {
        vm.prank(gymLeader);
        vm.expectRevert("Fee below minimum");
        gymChallenge.setChallengeFee(0.1 ether);
    }

    function testChallengeFlow_ChallengerWins() public {
        vm.prank(gymLeader);
        gymChallenge.setChallengeFee(1 ether);

        uint256 leaderBalBefore = gymLeader.balance;

        vm.prank(challenger);
        uint256 id = gymChallenge.challenge{value: 1 ether}(gymLeader);

        // Resolve — challenger wins
        gymChallenge.resolveChallenge(id, true);

        GymChallenge.Challenge memory c = gymChallenge.getChallenge(id);
        assertEq(uint256(c.status), uint256(GymChallenge.ChallengeStatus.ChallengerWon));

        // Leader gets 80%
        assertEq(gymLeader.balance - leaderBalBefore, 0.8 ether);

        // Platform gets 20%
        assertEq(gymChallenge.platformFees(), 0.2 ether);

        // Badge minted
        assertEq(badge.ownerOf(0), challenger);
        assertEq(badge.totalSupply(), 1);
    }

    function testChallengeFlow_GymLeaderWins() public {
        vm.prank(gymLeader);
        gymChallenge.setChallengeFee(1 ether);

        vm.prank(challenger);
        uint256 id = gymChallenge.challenge{value: 1 ether}(gymLeader);

        gymChallenge.resolveChallenge(id, false);

        GymChallenge.Challenge memory c = gymChallenge.getChallenge(id);
        assertEq(uint256(c.status), uint256(GymChallenge.ChallengeStatus.GymLeaderWon));

        // No badge minted
        assertEq(badge.totalSupply(), 0);
    }

    function testRefundAfterExpiry() public {
        vm.prank(gymLeader);
        gymChallenge.setChallengeFee(1 ether);

        vm.prank(challenger);
        uint256 id = gymChallenge.challenge{value: 1 ether}(gymLeader);

        // Cannot refund before expiry
        vm.prank(challenger);
        vm.expectRevert("Not expired");
        gymChallenge.refundChallenge(id);

        // Warp past expiry
        vm.warp(block.timestamp + 25 hours);

        uint256 balBefore = challenger.balance;
        vm.prank(challenger);
        gymChallenge.refundChallenge(id);

        assertEq(challenger.balance - balBefore, 1 ether);
        GymChallenge.Challenge memory c = gymChallenge.getChallenge(id);
        assertEq(uint256(c.status), uint256(GymChallenge.ChallengeStatus.Refunded));
    }

    function testOnlyOwnerCanResolve() public {
        vm.prank(gymLeader);
        gymChallenge.setChallengeFee(1 ether);

        vm.prank(challenger);
        uint256 id = gymChallenge.challenge{value: 1 ether}(gymLeader);

        vm.prank(challenger);
        vm.expectRevert("Not owner");
        gymChallenge.resolveChallenge(id, true);
    }

    function testFeeDistribution() public {
        vm.prank(gymLeader);
        gymChallenge.setChallengeFee(2 ether);

        vm.prank(challenger);
        uint256 id = gymChallenge.challenge{value: 2 ether}(gymLeader);

        uint256 leaderBefore = gymLeader.balance;
        gymChallenge.resolveChallenge(id, false);

        // 80% of 2 ETH = 1.6 ETH to leader
        assertEq(gymLeader.balance - leaderBefore, 1.6 ether);
        // 20% of 2 ETH = 0.4 ETH platform
        assertEq(gymChallenge.platformFees(), 0.4 ether);
    }

    function testWithdrawPlatformFees() public {
        vm.prank(gymLeader);
        gymChallenge.setChallengeFee(1 ether);

        vm.prank(challenger);
        uint256 id = gymChallenge.challenge{value: 1 ether}(gymLeader);
        gymChallenge.resolveChallenge(id, true);

        uint256 ownerBefore = owner.balance;
        gymChallenge.withdrawPlatformFees();
        assertEq(owner.balance - ownerBefore, 0.2 ether);
        assertEq(gymChallenge.platformFees(), 0);
    }

    function testGymStats() public {
        vm.prank(gymLeader);
        gymChallenge.setChallengeFee(1 ether);

        vm.prank(challenger);
        uint256 id1 = gymChallenge.challenge{value: 1 ether}(gymLeader);
        gymChallenge.resolveChallenge(id1, true);

        vm.prank(challenger);
        uint256 id2 = gymChallenge.challenge{value: 1 ether}(gymLeader);
        gymChallenge.resolveChallenge(id2, false);

        (uint256 wins, uint256 losses, uint256 earned) = gymChallenge.getGymStats(gymLeader);
        assertEq(wins, 1);
        assertEq(losses, 1);
        assertEq(earned, 1.6 ether); // 0.8 + 0.8
    }

    function testBadgeDataCorrect() public {
        vm.prank(gymLeader);
        gymChallenge.setChallengeFee(1 ether);

        vm.prank(challenger);
        uint256 id = gymChallenge.challenge{value: 1 ether}(gymLeader);
        gymChallenge.resolveChallenge(id, true);

        GymBadge.BadgeData memory b = badge.getBadge(0);
        assertEq(b.gymLeader, gymLeader);
        assertEq(b.challenger, challenger);
        assertEq(b.challengeId, id);
    }

    receive() external payable {}
}
