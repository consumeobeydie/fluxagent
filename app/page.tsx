"use client";
import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import Link from "next/link";
import { INTENT_TYPES } from "@/lib/constants";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const stats = [
    { label: "Contracts Deployed", value: "7+" },
    { label: "On-chain TXs", value: "500+" },
    { label: "Intent Types", value: "4" },
    { label: "Gas Token", value: "USDC" },
  ];

  const features = [
    {
      icon: "🤖",
      title: "Agent Identity",
      desc: "Every agent has an ERC-8004 on-chain identity with reputation scoring and mission tracking.",
    },
    {
      icon: "🧠",
      title: "Intent Engine",
      desc: "Submit what you want to achieve. The agent finds and executes the optimal strategy automatically.",
    },
    {
      icon: "🔄",
      title: "ArcDEX Integration",
      desc: "Real USDC/EURC swaps via our on-chain AMM with 0.3% fee and x*y=k constant product formula.",
    },
    {
      icon: "🏦",
      title: "Yield Vault",
      desc: "ERC-4626 compliant vault. Agents compound earnings automatically based on mission outcomes.",
    },
    {
      icon: "🛡️",
      title: "Spending Limits",
      desc: "Programmable daily, weekly, and per-transaction budget caps for every agent.",
    },
    {
      icon: "📋",
      title: "Audit Trail",
      desc: "Every decision recorded on-chain via Arc's memo precompile. Full transparency.",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-950 font-mono">

      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-green-500 flex items-center justify-center text-white font-black text-sm">F</div>
            <span className="font-bold text-white text-lg">FluxAgent</span>
            <span className="text-xs text-gray-500 border border-gray-700 px-2 py-0.5 rounded">built on Arc</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">Dashboard</Link>
            <Link href="/agent" className="text-sm text-gray-400 hover:text-white transition">My Agent</Link>
            <button
              onClick={() => isConnected ? disconnect() : connect({ connector: injected() })}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect Wallet"}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-900/30 border border-indigo-800 rounded-full px-4 py-1.5 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs text-indigo-300">Live on Arc Testnet · Mainnet Ready</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Autonomous<br />
            <span className="bg-gradient-to-r from-indigo-400 to-green-400 bg-clip-text text-transparent">
              Agent Economy
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The first autonomous agent economy built on Arc. Agents earn, spend, and compound USDC — without human intervention.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {isConnected ? (
              <Link href="/dashboard"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition text-lg">
                Open Dashboard →
              </Link>
            ) : (
              <button onClick={() => connect({ connector: injected() })}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition text-lg">
                Connect Wallet →
              </button>
            )}
            <a href="https://github.com/consumeobeydie/arc-testnet-journey" target="_blank"
              className="border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold px-8 py-4 rounded-xl transition text-lg">
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12 border-y border-gray-800">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-white mb-1">{s.value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intent Types */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white mb-4">Submit an Intent</h2>
            <p className="text-gray-400">Tell the agent what you want. It handles the rest.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INTENT_TYPES.map(intent => (
              <div key={intent.id}
                className="bg-gray-900 border border-gray-800 hover:border-indigo-700 rounded-2xl p-6 transition group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{intent.icon}</span>
                    <div>
                      <h3 className="font-bold text-white">{intent.name}</h3>
                      <span className="text-xs text-indigo-400">{intent.price}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 group-hover:text-indigo-400 transition">→</span>
                </div>
                <p className="text-sm text-gray-400">{intent.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            {isConnected ? (
              <Link href="/dashboard"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition inline-block">
                Submit Intent →
              </Link>
            ) : (
              <button onClick={() => connect({ connector: injected() })}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition">
                Connect to Submit Intent →
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white mb-4">Full Stack Agent Economy</h2>
            <p className="text-gray-400">Every component purpose-built for autonomous agent finance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Arc */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-4">Why Arc?</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 text-gray-500">Feature</th>
                  <th className="text-left py-3 text-red-400">Ethereum</th>
                  <th className="text-left py-3 text-green-400">Arc</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                {[
                  ["Gas token", "ETH (volatile)", "USDC (stable)"],
                  ["Gas cost", "$0.50 - $63", "$0.0001"],
                  ["Finality", "~12 seconds", "<1 second"],
                  ["Agent micropayments", "Impossible", "Native"],
                  ["AMM feasibility", "Expensive", "Practically free"],
                ].map(([f, eth, arc]) => (
                  <tr key={f} className="border-b border-gray-900">
                    <td className="py-3">{f}</td>
                    <td className="py-3 text-red-400">{eth}</td>
                    <td className="py-3 text-green-400">{arc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-bold text-white">FluxAgent</p>
            <p className="text-xs text-gray-500 mt-1">Autonomous Agent Economy, built on Arc</p>
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="https://github.com/consumeobeydie/arc-testnet-journey" target="_blank" className="hover:text-white transition">GitHub</a>
            <a href="https://arc-intent-dashboard.vercel.app" target="_blank" className="hover:text-white transition">Dashboard</a>
            <a href="https://testnet.arcscan.app" target="_blank" className="hover:text-white transition">ArcScan</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
