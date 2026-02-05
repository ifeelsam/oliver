"use client";

import { useEffect, useState, useCallback } from "react";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";

let sdk: W3SSdk | null = null;

export function useCircleWallet() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [challengeId, setChallengeId] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const appId = process.env.NEXT_PUBLIC_CIRCLE_APP_ID;
        if (!appId) {
            console.warn("Circle App ID not configured. Please set NEXT_PUBLIC_CIRCLE_APP_ID in your .env file");
            setError("Circle App ID not configured");
            return;
        }

        try {
            // Initialize Circle SDK
            sdk = new W3SSdk();
            setIsInitialized(true);
            console.log("✅ Circle SDK initialized");
        } catch (err) {
            console.error("Failed to initialize Circle SDK:", err);
            setError("Failed to initialize wallet SDK");
        }

        return () => {
            sdk = null;
        };
    }, []);

    const connect = useCallback(async () => {
        if (!sdk || !isInitialized) {
            setError("SDK not initialized");
            return;
        }

        const appId = process.env.NEXT_PUBLIC_CIRCLE_APP_ID;
        if (!appId) {
            setError("Circle App ID not configured");
            return;
        }

        setIsConnecting(true);
        setError(null);

        try {
            console.log("🔄 Starting Circle Wallet connection...");

            // Step 1: Configure SDK with your App ID
            sdk.setAppSettings({
                appId: appId,
            });
            console.log("✅ SDK configured with App ID");

            // Step 2: Call our backend to get authentication tokens from Circle
            console.log("🔄 Calling backend for authentication...");
            const response = await fetch('/api/circle/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: `user_${Date.now()}` // In production, use your actual user ID
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Authentication failed');
            }

            const { userToken, encryptionKey } = await response.json();
            console.log("✅ Received tokens from backend");

            // Step 3: Set authentication with Circle SDK
            sdk.setAuthentication({
                userToken: userToken,
                encryptionKey: encryptionKey,
            });
            console.log("✅ SDK authenticated");

            // Step 4: Execute the challenge (this will show Circle's UI for PIN/biometric)
            sdk.execute(challengeId || '', (error, result) => {
                if (error) {
                    console.error('❌ Challenge failed:', error);
                    setError(error.message || 'Authentication challenge failed');
                    setIsConnecting(false);
                    return;
                }

                console.log("✅ Challenge completed successfully", result);

                // Success! Extract wallet address from result
                const resultData = result as any; // Type assertion for Circle SDK result
                if (resultData?.data?.resultType === 'INIT_USER') {
                    // User initialized, now we need to create a wallet
                    console.log("🔄 User initialized, creating wallet...");
                    // In production, you'd call another endpoint to create the wallet
                    // For now, we'll set a demo address
                    setAddress("0x" + Math.random().toString(16).substr(2, 40));
                } else if (resultData?.data?.walletAddress) {
                    setAddress(resultData.data.walletAddress);
                }

                setIsConnecting(false);
            });

        } catch (err: any) {
            console.error("❌ Failed to connect wallet:", err);
            setError(err.message || "Failed to connect wallet");
            setIsConnecting(false);
        }
    }, [isInitialized, challengeId]);

    const disconnect = useCallback(() => {
        setAddress(null);
        setChallengeId(null);
        setError(null);
    }, []);

    return {
        isInitialized,
        isConnected: !!address,
        address,
        isConnecting,
        error,
        connect,
        disconnect,
        sdk,
    };
}
