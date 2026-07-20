"use client";
import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { injected } from "wagmi/connectors";
import { defineChain, createPublicClient, http } from "viem";
import Link from "next/link";
import { CONTRACTS, ARC_TESTNET } from "@/lib/constants";
import { AGENT_IDENTITY_ABI } from "@/lib/abis";

const arcChain = defineChain(ARC_TESTNET);
const client = createPublicClient({ chain: arcChain as any, transport: http() });

export default function AgentPage() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });

  const [name, setName] = useState("");
  const [capabilities, setCapabilities] = useState("payments,trading,missions");
  const [agentData, setAgentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function fetchAgent() {
    if (!address) return;
    try {
      setLoading(true);
      const agentId = await client.readContract({
        address: CONTRACTS.AgentIdentity as `0x${string}`,
        abi: AGENT_IDENTITY_ABI,
        functionName: "walletToAgentId",
        args: [address],
      }) as bigint;

      if (Number(agentId) > 0) {
        const [agent, rate] = await Promise.all([
          client.readContract({
            address: CONTRACTS.AgentIdentity as `0x${string}`,
            abi: AGENT_IDENTITY_ABI,
            functionName: "agents",
            args: [agentId],
          }),
          client.readContract({
            address: CONTRACTS.AgentIdentity as `0x${string}`,
            abi: AGENT_IDENTITY_ABI,
            functionName: "getSuccessRate",
            args: [agentId],
          }),
        ]);
        const a = agent as unknown as any[];
        setAgentData({
          id: Number(a[0]),
          wallet: a[1],
          name: a[2],
          capabilities: a[4],
          reputationScore: Number(a[5]),
          totalMissions: Number(a[6]),
          successfulMissions: Number(a[7]),
          registeredAt: Number(a[8]),
          successRate: Number(rate as bigint),
          status: Number(a[9]) === 1 ? "Active" : "Suspended",
        });
      } else {
        setAgentData(null);
      }
    } catch (e) {
      console.error(e);
      setAgentData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (address) fetchAgent();
    else setLoading(false);
  }, [address]);

  useEffect(() => {
    if (isSuccess) fetchAgent();
  }, [isSuccess]);

  async function handleRegister() {
    if (!name || !address) return;
    writeContract({
      address: CONTRACTS.AgentIdentity as `0x${string}`,
      abi: AGENT_IDENTITY_ABI,
      functionName: "register",
      args: [name, `https://fluxagent-app.vercel.app/agent/${address}`, capabilities],
      chain: arcChain as any,
    });
  }

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center font-mono">
        <div className="text-center">
          <h1 className="text-2xl font-black text-white mb-4">My Agent</h1>
          <p className="text-gray-400 mb-8">Connect your wallet to create or view your agent.</p>
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
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-green-500 flex items-center justify-center text-white font-black text-sm">F</div>
              <span className="font-bold text-white">FluxAgent</span>
            </Link>
            <span className="text-xs text-gray-600">/</span>
            <span className="text-xs text-gray-400">My Agent</span>
          </div>
          <button onClick={() => disconnect()}
            className="text-xs text-gray-400 border border-gray-700 px-3 py-1.5 rounded-lg hover:border-gray-500 transition">
            {address?.slice(0, 6)}...{address?.slice(-4)} ✕
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading agent data...</div>
        ) : agentData ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-green-500 flex items-center justify-center text-white font-black text-3xl mx-auto mb-4">
                {agentData.name?.[0] || "A"}
              </div>
              <h1 className="text-3xl font-black text-white">{agentData.name}</h1>
              <p className="text-gray-400 mt-1">Agent #{agentData.id}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${agentData.status === "Active" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                ● {agentData.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Reputation", value: agentData.reputationScore, color: "text-indigo-400" },
                { label: "Success Rate", value: `${agentData.successRate}%`, color: "text-green-400" },
                { label: "Total Missions", value: agentData.totalMissions, color: "text-white" },
                { label: "Successful", value: agentData.successfulMissions, color: "text-green-400" },
              ].map(s => (
                <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Agent Details</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Wallet</span>
                  <a href={`https://testnet.arcscan.app/address/${agentData.wallet}`} target="_blank"
                    className="text-indigo-400 hover:underline font-mono text-xs">
                    {agentData.wallet?.slice(0, 10)}...{agentData.wallet?.slice(-8)}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Capabilities</span>
                  <span className="text-gray-300 text-xs">{agentData.capabilities}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Registered</span>
                  <span className="text-gray-300 text-xs">{new Date(agentData.registeredAt * 1000).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Contract</span>
                  <a href={`https://testnet.arcscan.app/address/${CONTRACTS.AgentIdentity}`} target="_blank"
                    className="text-indigo-400 hover:underline text-xs">ERC-8004 on Arc Testnet</a>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/dashboard"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition inline-block">
                Submit Intent →
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center text-3xl mx-auto mb-4">🤖</div>
              <h1 className="text-2xl font-black text-white mb-2">Create Your Agent</h1>
              <p className="text-gray-400 text-sm">Register an ERC-8004 on-chain identity for your autonomous agent.</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">Agent Name</p>
                <input type="text" placeholder="My FluxAgent" value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition placeholder-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Capabilities</p>
                <input type="text" value={capabilities} onChange={e => setCapabilities(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition" />
              </div>
              <div className="bg-gray-950 rounded-xl p-3 text-xs text-gray-500 space-y-1">
                <p>✓ ERC-8004 standard on-chain identity</p>
                <p>✓ Reputation scoring system</p>
                <p>✓ Mission tracking</p>
                <p>✓ Permanent on Arc Testnet</p>
              </div>
              <button onClick={handleRegister} disabled={!name || isPending || isConfirming}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition">
                {isPending ? "Confirm in wallet..." : isConfirming ? "Creating agent..." : "Create Agent →"}
              </button>
              {txHash && (
                <a href={`https://testnet.arcscan.app/tx/${txHash}`} target="_blank"
                  className="block text-xs text-indigo-400 text-center hover:underline truncate">
                  TX: {txHash.slice(0, 30)}...
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
