export const GYM_REGISTRY_ADDRESS = "0xebDeae236ED701195823214e59D7a4245a2F1B3C" as const;
export const GYM_CHALLENGE_ADDRESS = "0x6ADcF86A224C97f0a49C82bDbaA3cb2a0d7082Dc" as const;
export const GYM_BADGE_ADDRESS = "0x67B1029878e4a8E2D6E00401324B345738366743" as const;

export const GYM_REGISTRY_ABI = [
  {
    type: "function",
    name: "getAllGyms",
    inputs: [],
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getGym",
    inputs: [{ name: "trainer", type: "address" }],
    outputs: [
      { name: "name", type: "string" },
      { name: "gymType", type: "string" },
      { name: "archetype", type: "string" },
      { name: "battleCry", type: "string" },
      {
        name: "pokemon",
        type: "tuple[3]",
        components: [
          { name: "species", type: "string" },
          { name: "type1", type: "string" },
          { name: "type2", type: "string" },
        ],
      },
      { name: "timestamp", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "gymCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isRegistered",
    inputs: [{ name: "trainer", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "registrationFee",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setRegistrationFee",
    inputs: [{ name: "newFee", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawFees",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
] as const;

export const GYM_CHALLENGE_ABI = [
  {
    type: "function",
    name: "challengeFee",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "gymStats",
    inputs: [{ name: "", type: "address" }],
    outputs: [
      { name: "wins", type: "uint256" },
      { name: "losses", type: "uint256" },
      { name: "totalEarned", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getGymStats",
    inputs: [{ name: "gymLeader", type: "address" }],
    outputs: [
      { name: "wins", type: "uint256" },
      { name: "losses", type: "uint256" },
      { name: "totalEarned", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "challenges",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "id", type: "uint256" },
      { name: "challenger", type: "address" },
      { name: "gymLeader", type: "address" },
      { name: "wager", type: "uint256" },
      { name: "createdAt", type: "uint256" },
      { name: "status", type: "uint8" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nextChallengeId",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "challenge",
    inputs: [{ name: "gymLeader", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "resolveChallenge",
    inputs: [
      { name: "challengeId", type: "uint256" },
      { name: "challengerWon", type: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MIN_CHALLENGE_FEE",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "PLATFORM_FEE_BPS",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

export const GYM_BADGE_ABI = [
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBadge",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "gymLeader", type: "address" },
          { name: "challenger", type: "address" },
          { name: "gymName", type: "string" },
          { name: "gymType", type: "string" },
          { name: "challengeId", type: "uint256" },
          { name: "earnedAt", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBadgesByOwner",
    inputs: [{ name: "_owner", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ownerOf",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "tokenURI",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minter",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
] as const;

export const MONAD_TESTNET = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
} as const;
