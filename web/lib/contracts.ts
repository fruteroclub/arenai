export const GYM_REGISTRY_ADDRESS = "0xebDeae236ED701195823214e59D7a4245a2F1B3C" as const;

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

export const MONAD_TESTNET = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
} as const;
