export const INTENT_REGISTRY_ABI = [
  { name: "nextId", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "getPendingCount", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "getIntent", type: "function", stateMutability: "view", inputs: [{ name: "id", type: "uint256" }], outputs: [{ components: [{ name: "id", type: "uint256" }, { name: "user", type: "address" }, { name: "intentType", type: "uint8" }, { name: "status", type: "uint8" }, { name: "amount", type: "uint256" }, { name: "tokenIn", type: "address" }, { name: "params", type: "string" }, { name: "createdAt", type: "uint256" }, { name: "solvedAt", type: "uint256" }, { name: "solver", type: "address" }, { name: "result", type: "string" }, { name: "outputAmount", type: "uint256" }], name: "", type: "tuple" }] },
  { name: "getUserIntents", type: "function", stateMutability: "view", inputs: [{ name: "user", type: "address" }], outputs: [{ type: "uint256[]" }] },
  { name: "submitIntent", type: "function", stateMutability: "nonpayable", inputs: [{ name: "intentType", type: "uint8" }, { name: "amount", type: "uint256" }, { name: "tokenIn", type: "address" }, { name: "params", type: "string" }], outputs: [{ name: "id", type: "uint256" }] },
] as const;

export const AGENT_IDENTITY_ABI = [
  { name: "register", type: "function", stateMutability: "nonpayable", inputs: [{ name: "name", type: "string" }, { name: "agentURI", type: "string" }, { name: "capabilities", type: "string" }], outputs: [{ name: "agentId", type: "uint256" }] },
  { name: "getSuccessRate", type: "function", stateMutability: "view", inputs: [{ name: "agentId", type: "uint256" }], outputs: [{ type: "uint256" }] },
  { name: "walletToAgentId", type: "function", stateMutability: "view", inputs: [{ name: "wallet", type: "address" }], outputs: [{ type: "uint256" }] },
  { name: "agents", type: "function", stateMutability: "view", inputs: [{ name: "", type: "uint256" }], outputs: [{ name: "id", type: "uint256" }, { name: "wallet", type: "address" }, { name: "name", type: "string" }, { name: "agentURI", type: "string" }, { name: "capabilities", type: "string" }, { name: "reputationScore", type: "uint256" }, { name: "totalMissions", type: "uint256" }, { name: "successfulMissions", type: "uint256" }, { name: "registeredAt", type: "uint256" }, { name: "status", type: "uint8" }] },
] as const;

export const ARCDEX_ABI = [
  { name: "getPrice", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "priceAInB", type: "uint256" }, { name: "priceBInA", type: "uint256" }] },
  { name: "getAmountOut", type: "function", stateMutability: "view", inputs: [{ name: "tokenIn", type: "address" }, { name: "amountIn", type: "uint256" }], outputs: [{ name: "amountOut", type: "uint256" }] },
  { name: "reserveA", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "reserveB", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "swap", type: "function", stateMutability: "nonpayable", inputs: [{ name: "tokenIn", type: "address" }, { name: "amountIn", type: "uint256" }, { name: "minAmountOut", type: "uint256" }], outputs: [{ name: "amountOut", type: "uint256" }] },
  { name: "addLiquidity", type: "function", stateMutability: "nonpayable", inputs: [{ name: "amountA", type: "uint256" }, { name: "amountB", type: "uint256" }, { name: "minShares", type: "uint256" }], outputs: [{ name: "mintedShares", type: "uint256" }] },
  { name: "totalShares", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "shares", type: "function", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ type: "uint256" }] },
] as const;

export const ERC20_ABI = [
  { name: "approve", type: "function", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] },
  { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
  { name: "allowance", type: "function", stateMutability: "view", inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], outputs: [{ type: "uint256" }] },
] as const;

export const VAULT_ABI = [
  { name: "deposit", type: "function", stateMutability: "nonpayable", inputs: [{ name: "assets", type: "uint256" }, { name: "receiver", type: "address" }], outputs: [{ name: "shares", type: "uint256" }] },
  { name: "totalAssets", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
] as const;
