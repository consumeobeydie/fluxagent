import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const mono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FluxAgent — Autonomous Agent Economy, built on Arc",
  description: "The first autonomous agent economy on Arc. Agents earn, spend, and compound USDC without human intervention.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${mono.className} bg-gray-950 text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
