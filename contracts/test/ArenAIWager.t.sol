// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/ArenAIWager.sol";

contract ArenAIWagerTest is Test {
    ArenAIWager public wager;
    address owner = address(this);
    address player1 = address(0x1);
    address player2 = address(0x2);
    bytes32 matchId = keccak256("match1");

    function setUp() public {
        wager = new ArenAIWager();
        vm.deal(player1, 10 ether);
        vm.deal(player2, 10 ether);
    }

    function test_createMatch() public {
        vm.prank(player1);
        wager.createMatch{value: 1 ether}(matchId);

        ArenAIWager.Match memory m = wager.getMatch(matchId);
        assertEq(m.creator, player1);
        assertEq(m.wager, 1 ether);
        assertEq(uint(m.status), uint(ArenAIWager.Status.Created));
    }

    function test_acceptMatch() public {
        vm.prank(player1);
        wager.createMatch{value: 1 ether}(matchId);

        vm.prank(player2);
        wager.acceptMatch{value: 1 ether}(matchId);

        ArenAIWager.Match memory m = wager.getMatch(matchId);
        assertEq(m.opponent, player2);
        assertEq(uint(m.status), uint(ArenAIWager.Status.Accepted));
    }

    function test_resolveMatch() public {
        vm.prank(player1);
        wager.createMatch{value: 1 ether}(matchId);

        vm.prank(player2);
        wager.acceptMatch{value: 1 ether}(matchId);

        uint256 balBefore = player1.balance;
        wager.resolveMatch(matchId, player1);

        // Winner gets 80% of 2 ETH = 1.6 ETH
        assertEq(player1.balance - balBefore, 1.6 ether);
        assertEq(wager.accumulatedFees(), 0.4 ether);
    }

    function test_feeCalculation() public {
        vm.prank(player1);
        wager.createMatch{value: 2 ether}(matchId);

        vm.prank(player2);
        wager.acceptMatch{value: 2 ether}(matchId);

        wager.resolveMatch(matchId, player2);

        // 20% of 4 ETH = 0.8 ETH fee
        assertEq(wager.accumulatedFees(), 0.8 ether);
    }

    function test_onlyOwnerCanResolve() public {
        vm.prank(player1);
        wager.createMatch{value: 1 ether}(matchId);

        vm.prank(player2);
        wager.acceptMatch{value: 1 ether}(matchId);

        vm.prank(player1);
        vm.expectRevert("not owner");
        wager.resolveMatch(matchId, player1);
    }

    function test_cantAcceptOwnMatch() public {
        vm.prank(player1);
        wager.createMatch{value: 1 ether}(matchId);

        vm.prank(player1);
        vm.expectRevert("cant accept own");
        wager.acceptMatch{value: 1 ether}(matchId);
    }

    function test_cancelMatch() public {
        vm.prank(player1);
        wager.createMatch{value: 1 ether}(matchId);

        uint256 balBefore = player1.balance;
        vm.prank(player1);
        wager.cancelMatch(matchId);

        assertEq(player1.balance - balBefore, 1 ether);
        ArenAIWager.Match memory m = wager.getMatch(matchId);
        assertEq(uint(m.status), uint(ArenAIWager.Status.Cancelled));
    }

    function test_withdrawFees() public {
        vm.prank(player1);
        wager.createMatch{value: 1 ether}(matchId);

        vm.prank(player2);
        wager.acceptMatch{value: 1 ether}(matchId);

        wager.resolveMatch(matchId, player1);

        uint256 balBefore = owner.balance;
        wager.withdrawFees();
        assertEq(owner.balance - balBefore, 0.4 ether);
        assertEq(wager.accumulatedFees(), 0);
    }

    receive() external payable {}
}
