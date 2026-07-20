export const CONTRACTS = {
  IntentRegistry:  "0x3917DF9B70DeAEa7c3fcCa7456F89045Ef024d94",
  AgentIdentity:   "0x5275783cD74eC21739Af8f3be9c42C024F671cFb",
  SpendingLimits:  "0x615a4B25448980a6b518f9F9088C206387535192",
  SplitPayment:    "0x775D4DF117f0B63a16ade4185bDa221Adcb4AEA3",
  ArcDEX:          "0x1A142DF560a671c66c361A29a48Ab839Bc9F890E",
  ArcUSDCVault:    "0x6C13dA317B65474299F6fDee02daDd6626Eb2BFe",
  EventLogger:     "0x9C50765e591663ED541B2fB863626f39fC6C12e0",
  USDC:            "0x3600000000000000000000000000000000000000",
  EURC:            "0x89b50855aa3be2f677cd6303cec089b5f319d72a",
} as const;

export const INTENT_TYPES = [
  { id: 0, name: "MAXIMIZE_YIELD", icon: "📈", description: "Maximize returns across ArcDEX and Vault", price: "0.001 USDC" },
  { id: 1, name: "SWAP_BEST_PRICE", icon: "🔄", description: "Swap USDC to EURC at best available price", price: "0.001 USDC" },
  { id: 2, name: "CROSS_CHAIN_BRIDGE", icon: "🌉", description: "Bridge USDC to Base via CCTP", price: "0.002 USDC" },
  { id: 3, name: "DOLLAR_COST_AVERAGE", icon: "📅", description: "Automated daily USDC purchases", price: "0.001 USDC" },
] as const;

export const INTENT_STATUSES = ["PENDING", "SOLVING", "SOLVED", "FAILED"] as const;

export const ARC_TESTNET = {
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpcUrls: { default: { http: ["https://arc-testnet.drpc.org"] } },
  blockExplorers: { default: { name: "ArcScan", url: "https://testnet.arcscan.app" } },
  testnet: true,
} as const;

export const ARC_MAINNET = {
  id: 5042,
  name: "Arc",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.blockdaemon.mainnet.arc.io"] } },
  blockExplorers: { default: { name: "ArcScan", url: "https://arc-mainnet.cloud.blockscout.com" } },
  testnet: false,
} as const;
