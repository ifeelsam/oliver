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
            // Step 1: Configure SDK with your App ID
            sdk.setAppSettings({
                appId: appId,
            });

            // Step 2: In a real implementation, you would:
            // 1. Call your backend to get a userToken and encryptionKey
            // 2. Your backend calls Circle's API to create/authenticate the user
            // 3. Backend returns the tokens to frontend

            // For now, we'll show the proper flow but note it needs backend integration
            console.log("⚠️ Circle Wallet requires backend integration:");
            console.log("1. Create an API endpoint that calls Circle's API");
            console.log("2. Get userToken and encryptionKey from your backend");
            console.log("3. Pass those to sdk.setAuthentication()");

            // Example of what the backend call would look like:
            // const response = await fetch('/api/circle/authenticate', {
            //   method: 'POST',
            //   body: JSON.stringify({ userId: 'user123' })
            // });
            // const { userToken, encryptionKey } = await response.json();

            // Then you would call:
            // sdk.setAuthentication({
            //   userToken: userToken,
            //   encryptionKey: encryptionKey,
            // });

            // Step 3: Execute the challenge (PIN entry, biometrics, etc.)
            // sdk.execute(challengeId, (error, result) => {
            //   if (error) {
            //     console.error('Challenge failed:', error);
            //     setError(error.message);
            //     return;
            //   }
            //   
            //   // Success! User is authenticated
            //   if (result?.data?.walletAddress) {
            //     setAddress(result.data.walletAddress);
            //   }
            // });

            // For demo purposes, show that backend is needed
            setError("Backend integration required. See console for setup instructions.");

        } catch (err: any) {
            console.error("Failed to connect wallet:", err);
            setError(err.message || "Failed to connect wallet");
        } finally {
            setIsConnecting(false);
        }
    }, [isInitialized]);

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
