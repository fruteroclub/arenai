"use client";
import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import { injected } from "wagmi/connectors";
import { monadTestnet } from "@/lib/wagmi";

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  if (!isConnected) {
    return (
      <button
        onClick={() => connect({ connector: injected() })}
        disabled={isPending}
        className="bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white font-[family-name:var(--font-orbitron)] font-bold text-xs px-4 py-2 rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all cursor-pointer disabled:opacity-50"
      >
        {isPending ? "Connecting..." : "Connect Wallet"}
      </button>
    );
  }

  const wrongNetwork = chainId !== monadTestnet.id;
  const truncated = `${address?.slice(0, 6)}...${address?.slice(-4)}`;

  return (
    <div className="flex items-center gap-2">
      {wrongNetwork && (
        <span className="text-[10px] text-[#ef4444] font-[family-name:var(--font-orbitron)] animate-pulse">
          Wrong Network
        </span>
      )}
      <button
        onClick={() => disconnect()}
        className="bg-[#1a1030] border border-[#7c3aed]/40 text-[#7c3aed] font-[family-name:var(--font-orbitron)] font-bold text-xs px-4 py-2 rounded-xl hover:border-[#7c3aed] transition-all cursor-pointer"
      >
        {truncated}
      </button>
    </div>
  );
}
