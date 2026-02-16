// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./GymBadge.sol";

interface IGymRegistry {
    function isRegistered(address trainer) external view returns (bool);
    function getGym(address trainer) external view returns (
        string memory name, string memory gymType, string memory archetype,
        string memory battleCry, GymRegistry_Pokemon[3] memory pokemon, uint256 timestamp
    );
}

struct GymRegistry_Pokemon {
    string species;
    string type1;
    string type2;
}

contract GymChallenge {
    enum ChallengeStatus { Pending, ChallengerWon, GymLeaderWon, Refunded }

    struct Challenge {
        uint256 id;
        address challenger;
        address gymLeader;
        uint256 wager;
        uint256 createdAt;
        ChallengeStatus status;
    }

    struct GymStats {
        uint256 wins;
        uint256 losses;
        uint256 totalEarned;
    }

    uint256 public constant PLATFORM_FEE_BPS = 2000;
    uint256 public constant MIN_CHALLENGE_FEE = 0.5 ether;
    uint256 public constant CHALLENGE_EXPIRY = 24 hours;

    address public owner;
    GymBadge public badge;
    address public registry;

    uint256 public nextChallengeId;
    uint256 public platformFees;

    mapping(uint256 => Challenge) public challenges;
    mapping(address => uint256) public challengeFee;
    mapping(address => GymStats) public gymStats;
    mapping(address => uint256[]) private _gymChallenges;
    mapping(address => uint256[]) private _challengerHistory;

    event ChallengeFeeSet(address indexed gymLeader, uint256 fee);
    event ChallengeCreated(uint256 indexed id, address indexed challenger, address indexed gymLeader, uint256 wager);
    event ChallengeResolved(uint256 indexed id, bool challengerWon);
    event ChallengeRefunded(uint256 indexed id);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _badge, address _registry) {
        owner = msg.sender;
        badge = GymBadge(_badge);
        registry = _registry;
    }

    function setChallengeFee(uint256 fee) external {
        require(fee >= MIN_CHALLENGE_FEE, "Fee below minimum");
        challengeFee[msg.sender] = fee;
        emit ChallengeFeeSet(msg.sender, fee);
    }

    function setChallengeFeeFor(address gymLeader, uint256 fee) external onlyOwner {
        require(fee >= MIN_CHALLENGE_FEE, "Fee below minimum");
        challengeFee[gymLeader] = fee;
        emit ChallengeFeeSet(gymLeader, fee);
    }

    function challenge(address gymLeader) external payable returns (uint256) {
        uint256 fee = challengeFee[gymLeader];
        require(fee > 0, "Gym has no fee set");
        require(msg.value >= fee, "Insufficient fee");
        require(msg.sender != gymLeader, "Cannot challenge self");

        uint256 id = nextChallengeId++;
        challenges[id] = Challenge({
            id: id,
            challenger: msg.sender,
            gymLeader: gymLeader,
            wager: msg.value,
            createdAt: block.timestamp,
            status: ChallengeStatus.Pending
        });

        _gymChallenges[gymLeader].push(id);
        _challengerHistory[msg.sender].push(id);

        emit ChallengeCreated(id, msg.sender, gymLeader, msg.value);
        return id;
    }

    function resolveChallenge(uint256 challengeId, bool challengerWon) external onlyOwner {
        Challenge storage c = challenges[challengeId];
        require(c.status == ChallengeStatus.Pending, "Not pending");

        uint256 platformCut = (c.wager * PLATFORM_FEE_BPS) / 10000;
        uint256 leaderCut = c.wager - platformCut;
        platformFees += platformCut;

        if (challengerWon) {
            c.status = ChallengeStatus.ChallengerWon;
            gymStats[c.gymLeader].losses++;

            // Mint badge
            string memory gymName = "";
            string memory gymType = "";
            if (registry != address(0)) {
                try IGymRegistry(registry).getGym(c.gymLeader) returns (
                    string memory _name, string memory _type, string memory, string memory,
                    GymRegistry_Pokemon[3] memory, uint256
                ) {
                    gymName = _name;
                    gymType = _type;
                } catch {}
            }

            badge.mint(c.challenger, GymBadge.BadgeData({
                gymLeader: c.gymLeader,
                challenger: c.challenger,
                gymName: gymName,
                gymType: gymType,
                challengeId: challengeId,
                earnedAt: block.timestamp
            }));
        } else {
            c.status = ChallengeStatus.GymLeaderWon;
            gymStats[c.gymLeader].wins++;
        }

        gymStats[c.gymLeader].totalEarned += leaderCut;

        (bool ok,) = c.gymLeader.call{value: leaderCut}("");
        require(ok, "Leader transfer failed");

        emit ChallengeResolved(challengeId, challengerWon);
    }

    function refundChallenge(uint256 challengeId) external {
        Challenge storage c = challenges[challengeId];
        require(c.status == ChallengeStatus.Pending, "Not pending");
        require(block.timestamp > c.createdAt + CHALLENGE_EXPIRY, "Not expired");
        require(msg.sender == c.challenger || msg.sender == owner, "Not authorized");

        c.status = ChallengeStatus.Refunded;

        (bool ok,) = c.challenger.call{value: c.wager}("");
        require(ok, "Refund failed");

        emit ChallengeRefunded(challengeId);
    }

    function withdrawPlatformFees() external onlyOwner {
        uint256 amount = platformFees;
        require(amount > 0, "No fees");
        platformFees = 0;

        (bool ok,) = owner.call{value: amount}("");
        require(ok, "Withdraw failed");
    }

    function getChallenge(uint256 id) external view returns (Challenge memory) {
        return challenges[id];
    }

    function getGymStats(address gymLeader) external view returns (uint256 wins, uint256 losses, uint256 totalEarned) {
        GymStats memory s = gymStats[gymLeader];
        return (s.wins, s.losses, s.totalEarned);
    }

    function getGymChallenges(address gymLeader) external view returns (uint256[] memory) {
        return _gymChallenges[gymLeader];
    }

    function getChallengerHistory(address challenger) external view returns (uint256[] memory) {
        return _challengerHistory[challenger];
    }

    receive() external payable {}
}
