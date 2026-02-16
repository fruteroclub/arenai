export const GYM_REGISTRY_ADDRESS = "0x4D2f65e1460b2Bed024126E4E61428745A6De47D" as const;

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
] as const;

export const MONAD_TESTNET = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
} as const;
