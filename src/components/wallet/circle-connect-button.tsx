"use client";

import { Button } from "@/components/ui/button";
import { useCircleWallet } from "@/hooks/useCircleWallet";
import { Wallet, LogOut, Loader2, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export function CircleConnectButton() {
    const {
        isConnected,
        isConnecting,
        address,
        usdcBalance,
        status,
        error,
        connect,
        createWallet,
        disconnect,
        needsWalletCreation,
    } = useCircleWallet();

    // Error state
    if (error) {
        return (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 backdrop-blur-sm">
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

    // Connected state
    if (isConnected && address) {
        return (
            <div className="flex items-center gap-2">
                <Card className="hidden sm:flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 backdrop-blur-sm">
                    <div className="relative">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <div className="absolute inset-0 h-2 w-2 rounded-full bg-green-500 animate-ping opacity-75" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium">
                            {address.slice(0, 6)}...{address.slice(-4)}
                        </span>
                        {usdcBalance && (
                            <span className="text-[10px] text-muted-foreground">
                                {parseFloat(usdcBalance).toFixed(2)} USDC
                            </span>
                        )}
                    </div>
                </Card>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={disconnect}
                    className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    // Needs wallet creation (logged in but no wallet)
    if (needsWalletCreation) {
        return (
            <Button
                onClick={createWallet}
                disabled={isConnecting}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition-opacity"
            >
                {isConnecting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Wallet...
                    </>
                ) : (
                    <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Create Wallet
                    </>
                )}
            </Button>
        );
    }

    // Initial connect state
    return (
        <Button
            onClick={connect}
            disabled={isConnecting}
            className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            {isConnecting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {status}
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
