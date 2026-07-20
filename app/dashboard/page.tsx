"use client";
import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { injected } from "wagmi/connectors";
import { parseUnits, formatUnits, createPublicClient, http } from "viem";
import { defineChain } from "viem";
import Link from "next/link";
import { CONTRACTS, INTENT_TYPES, INTENT_STATUSES, ARC_TESTNET } from "@/lib/constants";
import { INTENT_REGISTRY_ABI, AGENT_IDENTITY_ABI, ARCDEX_ABI, ERC20_ABI } from "@/lib/abis";

const arcChain = defineChain(ARC_TESTNET);

const STATUS_STYLE: Record<number, string> = {
  0: "text-yellow-400 bg-yellow-900/30",
  1: "text-blue-400 bg-blue-900/30",
  2: "text-green-400 bg-green-900/30",
  3: "text-red-400 bg-red-900/30",
};

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });

  const [selectedIntent, setSelectedIntent] = useState(0);
  const [amount, setAmount] = useState("");
  const [intents, setIntents] = useState<any[]>([]);
  const [dexData, setDexData] = useState<any>(null);
  const [agentData, setAgentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev].slice(0, 10));

  // Read USDC balance
  const { data: usdcBalance } = useReadContract({
    address: CONTRACTS.USDC as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // Read total intents
  const { data: totalIntents, refetch: refetchTotal } = useReadContract({
    address: CONTRACTS.IntentRegistry as `0x${string}`,
    abi: INTENT_REGISTRY_ABI,
    functionName: "nextId",
  });

  // Read agent ID
  const { data: agentId } = useReadContract({
    address: CONTRACTS.AgentIdentity as `0x${string}`,
    abi: AGENT_IDENTITY_ABI,
    functionName: "walletToAgentId",
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (isSuccess) {
      addLog("✅ Transaction confirmed!");
      refetchTotal();
      fetchData();
    }
  }, [isSuccess]);

  async function fetchData() {
    try {
      const client = createPublicClient({ chain: arcChain as any, transport: http() });

      // Fetch DEX data
      const [price, rA, rB] = await Promise.all([
        client.readContract({ address: CONTRACTS.ArcDEX as `0x${string}`, abi: ARCDEX_ABI, functionName: "getPrice" }),
        client.readContract({ address: CONTRACTS.ArcDEX as `0x${string}`, abi: ARCDEX_ABI, functionName: "reserveA" }),
        client.readContract({ address: CONTRACTS.ArcDEX as `0x${string}`, abi: ARCDEX_ABI, functionName: "reserveB" }),
      ]);
      const [priceAInB, priceBInA] = price as [bigint, bigint];
      setDexData({
        priceUSDCinEURC: (Number(priceAInB) / 1e18).toFixed(6),
        priceEURCinUSDC: (Number(priceBInA) / 1e18).toFixed(6),
        reserveUSDC: (Number(rA as bigint) / 1e6).toFixed(4),
        reserveEURC: (Number(rB as bigint) / 1e6).toFixed(4),
      });

      // Fetch intents
      const total = Number(await client.readContract({ address: CONTRACTS.IntentRegistry as `0x${string}`, abi: INTENT_REGISTRY_ABI, functionName: "nextId" }));
      const intentList = [];
      for (let i = 0; i < total; i++) {
        const intent = await client.readContract({ address: CONTRACTS.IntentRegistry as `0x${string}`, abi: INTENT_REGISTRY_ABI, functionName: "getIntent", args: [BigInt(i)] }) as unknown as any;
        intentList.push({
          id: Number(intent.id),
          user: intent.user,
          intentType: Number(intent.intentType),
          status: Number(intent.status),
          amount: Number(intent.amount) / 1e6,
          outputAmount: Number(intent.outputAmount) / 1e6,
          createdAt: Number(intent.createdAt),
          result: intent.result,
        });
      }
      setIntents(intentList.reverse());

      // Fetch agent data if registered
      if (address) {
        try {
          const aId = await client.readContract({ address: CONTRACTS.AgentIdentity as `0x${string}`, abi: AGENT_IDENTITY_ABI, functionName: "walletToAgentId", args: [address] }) as bigint;
          if (Number(aId) > 0) {
            const agent = await client.readContract({ address: CONTRACTS.AgentIdentity as `0x${string}`, abi: AGENT_IDENTITY_ABI, functionName: "agents", args: [aId] }) as unknown as any;
            const rate = await client.readContract({ address: CONTRACTS.AgentIdentity as `0x${string}`, abi: AGENT_IDENTITY_ABI, functionName: "getSuccessRate", args: [aId] }) as bigint;
            setAgentData({
              id: Number(agent.id),
              name: agent.name,
              reputationScore: Number(agent.reputationScore),
              totalMissions: Number(agent.totalMissions),
              successRate: Number(rate),
              status: Number(agent.status) === 1 ? "Active" : "Suspended",
            });
          }
        } catch {}
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, [address]);

  async function handleSubmitIntent() {
    if (!amount || !address) return;
    const amountParsed = parseUnits(amount, 6);
    addLog(`Submitting intent: ${INTENT_TYPES[selectedIntent].name} — ${amount} USDC`);
    writeContract({
      address: CONTRACTS.IntentRegistry as `0x${string}`,
      abi: INTENT_REGISTRY_ABI,
      functionName: "submitIntent",
      args: [selectedIntent, amountParsed, CONTRACTS.USDC as `0x${string}`, JSON.stringify({ slippage: "0.5%" })],
      chain: arcChain as any,
    });
  }

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-green-500 flex items-center justify-center text-white font-black text-2xl mx-auto mb-6">F</div>
          <h1 className="text-2xl font-black text-white mb-2">FluxAgent Dashboard</h1>
          <p className="text-gray-400 mb-8">Connect your wallet to submit intents and track agent execution.</p>
          <button onClick={() => connect({ connector: injected() })}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition">
            Connect Wallet
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 font-mono">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-green-500 flex items-center justify-center text-white font-black text-sm">F</div>
              <span className="font-bold text-white">FluxAgent</span>
            </Link>
            <span className="text-xs text-gray-600">/</span>
            <span className="text-xs text-gray-400">Dashboard</span>
          </div>
          <button onClick={() => disconnect()}
            className="text-xs text-gray-400 border border-gray-700 px-3 py-1.5 rounded-lg hover:border-gray-500 transition">
            {address?.slice(0, 6)}...{address?.slice(-4)} ✕
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6">

          {/* LEFT — Submit Intent */}
          <div className="col-span-1 space-y-4">

            {/* Agent Card */}
            {agentData ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">My Agent</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-green-500 flex items-center justify-center text-white font-black">A</div>
                  <div>
                    <p className="font-bold text-white text-sm">{agentData.name}</p>
                    <p className="text-xs text-green-400">{agentData.status}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-950 rounded-lg p-2 text-center">
                    <p className="font-bold text-indigo-400">{agentData.reputationScore}</p>
                    <p className="text-gray-500">Reputation</p>
                  </div>
                  <div className="bg-gray-950 rounded-lg p-2 text-center">
                    <p className="font-bold text-green-400">{agentData.successRate}%</p>
                    <p className="text-gray-500">Success</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 border border-dashed border-gray-700 rounded-2xl p-5 text-center">
                <p className="text-gray-500 text-sm mb-3">No agent registered</p>
                <Link href="/agent" className="text-xs text-indigo-400 hover:underline">Create Agent →</Link>
              </div>
            )}

            {/* Submit Intent */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Submit Intent</p>

              <div className="space-y-2 mb-4">
                {INTENT_TYPES.map(intent => (
                  <button key={intent.id} onClick={() => setSelectedIntent(intent.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition text-left ${selectedIntent === intent.id ? "border-indigo-600 bg-indigo-900/20" : "border-gray-800 hover:border-gray-600"}`}>
                    <span>{intent.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white">{intent.name}</p>
                      <p className="text-xs text-gray-500">{intent.price}</p>
                    </div>
                    {selectedIntent === intent.id && <span className="text-indigo-400 text-xs">✓</span>}
                  </button>
                ))}
              </div>

              <div className="bg-gray-950 rounded-xl p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">Amount (USDC)</p>
                <input
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-transparent text-xl font-bold text-white outline-none placeholder-gray-700"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Balance: {usdcBalance ? (Number(usdcBalance as bigint) / 1e6).toFixed(2) : "0.00"} USDC
                </p>
              </div>

              <button onClick={handleSubmitIntent}
                disabled={!amount || isPending || isConfirming}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition">
                {isPending ? "Confirm in wallet..." : isConfirming ? "Processing..." : "Submit Intent →"}
              </button>

              {txHash && (
                <a href={`https://testnet.arcscan.app/tx/${txHash}`} target="_blank"
                  className="block mt-2 text-xs text-indigo-400 text-center hover:underline truncate">
                  TX: {txHash.slice(0, 20)}...
                </a>
              )}
            </div>

            {/* DEX Live */}
            {dexData && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">ArcDEX Live</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-400">USDC→EURC</span><span className="text-indigo-400 font-bold">{dexData.priceUSDCinEURC}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">EURC→USDC</span><span className="text-indigo-400 font-bold">{dexData.priceEURCinUSDC}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Reserve USDC</span><span className="text-gray-300">{dexData.reserveUSDC}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Reserve EURC</span><span className="text-gray-300">{dexData.reserveEURC}</span></div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Intents */}
          <div className="col-span-2 space-y-4">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total Intents", value: intents.length, color: "text-white" },
                { label: "Solved", value: intents.filter(i => i.status === 2).length, color: "text-green-400" },
                { label: "Pending", value: intents.filter(i => i.status === 0).length, color: "text-yellow-400" },
              ].map(s => (
                <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Intents Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                <p className="text-sm font-bold">Intent History</p>
                <button onClick={fetchData} className="text-xs text-gray-500 hover:text-white transition">↻ Refresh</button>
              </div>
              {loading ? (
                <div className="p-8 text-center text-gray-500 text-sm">Loading on-chain data...</div>
              ) : intents.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">No intents yet. Submit your first intent!</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500">
                        <th className="px-5 py-3 text-left">#</th>
                        <th className="px-5 py-3 text-left">Type</th>
                        <th className="px-5 py-3 text-left">Amount</th>
                        <th className="px-5 py-3 text-left">Output</th>
                        <th className="px-5 py-3 text-left">Status</th>
                        <th className="px-5 py-3 text-left">Strategy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {intents.map(intent => {
                        let strategy = "—";
                        try { strategy = intent.result ? JSON.parse(intent.result)?.strategy || "—" : "—"; } catch {}
                        return (
                          <tr key={intent.id} className="border-b border-gray-900 hover:bg-gray-800/30 transition">
                            <td className="px-5 py-3 text-gray-400">{intent.id}</td>
                            <td className="px-5 py-3">
                              <span>{INTENT_TYPES[intent.intentType]?.icon}</span>
                              <span className="ml-2 text-gray-300">{INTENT_TYPES[intent.intentType]?.name}</span>
                            </td>
                            <td className="px-5 py-3 font-bold text-white">{intent.amount.toFixed(2)} USDC</td>
                            <td className="px-5 py-3 text-green-400">{intent.outputAmount > 0 ? intent.outputAmount.toFixed(4) : "—"}</td>
                            <td className="px-5 py-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${STATUS_STYLE[intent.status]}`}>
                                {INTENT_STATUSES[intent.status]}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-gray-400">{strategy}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Activity Log */}
            {log.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Activity</p>
                <div className="space-y-1">
                  {log.map((l, i) => <p key={i} className="text-xs text-gray-400">{l}</p>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
