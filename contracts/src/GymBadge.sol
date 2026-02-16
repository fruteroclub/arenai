// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GymBadge is ERC721 {
    using Strings for uint256;
    using Strings for address;

    struct BadgeData {
        address gymLeader;
        address challenger;
        string gymName;
        string gymType;
        uint256 challengeId;
        uint256 earnedAt;
    }

    address public owner;
    address public minter;
    uint256 private _nextTokenId;

    mapping(uint256 => BadgeData) private _badges;
    mapping(address => uint256[]) private _ownerBadges;

    event MinterSet(address indexed minter);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyMinter() {
        require(msg.sender == minter, "Not minter");
        _;
    }

    constructor() ERC721("ArenAI Gym Badge", "BADGE") {
        owner = msg.sender;
    }

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
        emit MinterSet(_minter);
    }

    function mint(address to, BadgeData memory data) external onlyMinter returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        _badges[tokenId] = data;
        _ownerBadges[to].push(tokenId);
        return tokenId;
    }

    function getBadge(uint256 tokenId) external view returns (BadgeData memory) {
        require(tokenId < _nextTokenId, "Badge does not exist");
        return _badges[tokenId];
    }

    function getBadgesByOwner(address _owner) external view returns (uint256[] memory) {
        return _ownerBadges[_owner];
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(tokenId < _nextTokenId, "Badge does not exist");
        return string(abi.encodePacked("https://arenai.vercel.app/api/badge/", tokenId.toString()));
    }
}
