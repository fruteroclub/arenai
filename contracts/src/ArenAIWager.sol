// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ArenAIWager {
    enum Status { None, Created, Accepted, Resolved, Cancelled }

    struct Match {
        address creator;
        address opponent;
        uint256 wager;
        Status status;
        address winner;
        uint256 createdAt;
    }

    address public owner;
    uint256 public platformFeePercent = 20;
    uint256 public accumulatedFees;
    uint256 public matchExpiry = 1 days;

    mapping(bytes32 => Match) public matches;

    event MatchCreated(bytes32 indexed matchId, address indexed creator, uint256 wager);
    event MatchAccepted(bytes32 indexed matchId, address indexed opponent);
    event MatchResolved(bytes32 indexed matchId, address indexed winner, uint256 payout);
    event MatchCancelled(bytes32 indexed matchId);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createMatch(bytes32 matchId) external payable {
        require(msg.value > 0, "no wager");
        require(matches[matchId].status == Status.None, "match exists");

        matches[matchId] = Match({
            creator: msg.sender,
            opponent: address(0),
            wager: msg.value,
            status: Status.Created,
            winner: address(0),
            createdAt: block.timestamp
        });

        emit MatchCreated(matchId, msg.sender, msg.value);
    }

    function acceptMatch(bytes32 matchId) external payable {
        Match storage m = matches[matchId];
        require(m.status == Status.Created, "not open");
        require(msg.sender != m.creator, "cant accept own");
        require(msg.value == m.wager, "wrong wager");

        m.opponent = msg.sender;
        m.status = Status.Accepted;

        emit MatchAccepted(matchId, msg.sender);
    }

    function resolveMatch(bytes32 matchId, address winner) external onlyOwner {
        Match storage m = matches[matchId];
        require(m.status == Status.Accepted, "not accepted");
        require(winner == m.creator || winner == m.opponent, "invalid winner");

        m.status = Status.Resolved;
        m.winner = winner;

        uint256 pot = m.wager * 2;
        uint256 fee = (pot * platformFeePercent) / 100;
        uint256 payout = pot - fee;
        accumulatedFees += fee;

        (bool ok, ) = winner.call{value: payout}("");
        require(ok, "transfer failed");

        emit MatchResolved(matchId, winner, payout);
    }

    function cancelMatch(bytes32 matchId) external {
        Match storage m = matches[matchId];
        require(m.status == Status.Created, "not open");
        require(
            msg.sender == m.creator ||
            (msg.sender == owner) ||
            (block.timestamp > m.createdAt + matchExpiry),
            "cant cancel"
        );

        m.status = Status.Cancelled;

        (bool ok, ) = m.creator.call{value: m.wager}("");
        require(ok, "refund failed");

        emit MatchCancelled(matchId);
    }

    function withdrawFees() external onlyOwner {
        uint256 amount = accumulatedFees;
        require(amount > 0, "no fees");
        accumulatedFees = 0;

        (bool ok, ) = owner.call{value: amount}("");
        require(ok, "withdraw failed");
    }

    function getMatch(bytes32 matchId) external view returns (Match memory) {
        return matches[matchId];
    }
}
