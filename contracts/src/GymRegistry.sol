// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract GymRegistry {
    struct Pokemon {
        string species;
        string type1;
        string type2;
    }

    struct Gym {
        string name;
        string gymType;
        string archetype;
        string battleCry;
        Pokemon[3] pokemon;
        uint256 timestamp;
        bool exists;
    }

    mapping(address => Gym) private gyms;
    address[] private gymAddresses;

    address public owner;
    uint256 public registrationFee = 1 ether;

    event GymRegistered(address indexed trainer, string name, string gymType);
    event GymUpdated(address indexed trainer, string name, string gymType);
    event FeeCollected(address indexed trainer, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerGym(
        string calldata name,
        string calldata gymType,
        string calldata archetype,
        string calldata battleCry,
        Pokemon[3] calldata pokemonData
    ) external payable {
        _register(msg.sender, name, gymType, archetype, battleCry, pokemonData);
    }

    function registerGymFor(
        address trainer,
        string calldata name,
        string calldata gymType,
        string calldata archetype,
        string calldata battleCry,
        Pokemon[3] calldata pokemonData
    ) external payable {
        _register(trainer, name, gymType, archetype, battleCry, pokemonData);
    }

    function _register(
        address trainer,
        string calldata name,
        string calldata gymType,
        string calldata archetype,
        string calldata battleCry,
        Pokemon[3] calldata pokemonData
    ) internal {
        bool updating = gyms[trainer].exists;

        if (!updating) {
            require(msg.value >= registrationFee, "Insufficient registration fee");
            emit FeeCollected(trainer, msg.value);
        }

        Gym storage g = gyms[trainer];
        g.name = name;
        g.gymType = gymType;
        g.archetype = archetype;
        g.battleCry = battleCry;
        g.pokemon[0] = pokemonData[0];
        g.pokemon[1] = pokemonData[1];
        g.pokemon[2] = pokemonData[2];
        g.timestamp = block.timestamp;

        if (!updating) {
            g.exists = true;
            gymAddresses.push(trainer);
            emit GymRegistered(trainer, name, gymType);
        } else {
            emit GymUpdated(trainer, name, gymType);
        }
    }

    function setRegistrationFee(uint256 newFee) external onlyOwner {
        registrationFee = newFee;
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        (bool ok,) = owner.call{value: balance}("");
        require(ok, "Transfer failed");
    }

    receive() external payable {}

    function getGym(address trainer) external view returns (
        string memory name,
        string memory gymType,
        string memory archetype,
        string memory battleCry,
        Pokemon[3] memory pokemon,
        uint256 timestamp
    ) {
        require(gyms[trainer].exists, "Gym not registered");
        Gym storage g = gyms[trainer];
        return (g.name, g.gymType, g.archetype, g.battleCry, g.pokemon, g.timestamp);
    }

    function getAllGyms() external view returns (address[] memory) {
        return gymAddresses;
    }

    function isRegistered(address trainer) external view returns (bool) {
        return gyms[trainer].exists;
    }

    function gymCount() external view returns (uint256) {
        return gymAddresses.length;
    }
}
