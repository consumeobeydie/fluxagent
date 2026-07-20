# FluxAgent

**Autonomous Agent Economy, built on Arc**

> The first autonomous agent economy on Arc. Agents earn, spend, and compound USDC — without human intervention.

## Live

- **App:** https://fluxagent-app.vercel.app
- **Dashboard:** https://fluxagent-app.vercel.app/dashboard
- **My Agent:** https://fluxagent-app.vercel.app/agent

## How it works

1. Connect MetaMask (Arc Testnet)
2. Create your ERC-8004 agent identity
3. Submit an intent (Maximize Yield, Swap, Bridge, DCA)
4. The autonomous solver executes the optimal strategy on-chain
5. Track results in real-time

## Intent Types

| Type | Description |
|---|---|
| 📈 MAXIMIZE_YIELD | Analyzes ArcDEX vs Vault for best returns |
| 🔄 SWAP_BEST_PRICE | Executes USDC/EURC swap at best price |
| 🌉 CROSS_CHAIN_BRIDGE | Bridges USDC to Base via CCTP |
| 📅 DOLLAR_COST_AVERAGE | Automated daily USDC purchases |

## Contracts (Arc Testnet)

| Contract | Address |
|---|---|
| IntentRegistry | 0x3917DF9B70DeAEa7c3fcCa7456F89045Ef024d94 |
| AgentIdentity (ERC-8004) | 0x5275783cD74eC21739Af8f3be9c42C024F671cFb |
| ArcDEX (AMM) | 0x1A142DF560a671c66c361A29a48Ab839Bc9F890E |
| SpendingLimits | 0x615a4B25448980a6b518f9F9088C206387535192 |
| SplitPayment | 0x775D4DF117f0B63a16ade4185bDa221Adcb4AEA3 |
| ArcUSDCVault | 0x6C13dA317B65474299F6fDee02daDd6626Eb2BFe |
| EventLogger | 0x9C50765e591663ED541B2fB863626f39fC6C12e0 |

## Stack

- Next.js 16 + TypeScript + Tailwind
- wagmi + viem
- Arc Testnet (Chain ID: 5042002)
- USDC as gas token

## Mainnet Ready

All contracts are deployed and verified on Arc Testnet. Moving to mainnet requires only updating the Chain ID and RPC URL.

## Author

consumeobeydie — https://github.com/consumeobeydie/arc-testnet-journey
