"use client";

import { Button } from "@/components/ui/button";
import { useCircleWallet } from "@/hooks/useCircleWallet";
import { Wallet, LogOut, Loader2, AlertCircle } from "lucide-react";

export function CircleConnectButton() {
    const { isConnected, address, isConnecting, error, connect, disconnect } = useCircleWallet();

    if (error) {
        return (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-xs text-destructive max-w-[200px] truncate">
                        {error}
                    </span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={connect}
                    className="hover:bg-primary/10"
                >
                    Retry
                </Button>
            </div>
        );
    }

    if (isConnected && address) {
        return (
            <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium">
                        {address.slice(0, 6)}...{address.slice(-4)}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={disconnect}
                    className="hover:bg-destructive/10 hover:text-destructive"
                >
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <Button
            onClick={connect}
            disabled={isConnecting}
            className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity"
        >
            {isConnecting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                </>
            ) : (
                <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                </>
            )}
        </Button>
    );
}
