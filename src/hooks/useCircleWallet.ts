"use client";

import { useEffect, useState } from "react";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";

let sdk: W3SSdk | null = null;

export function useCircleWallet() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [userToken, setUserToken] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const appId = process.env.NEXT_PUBLIC_CIRCLE_APP_ID;
        if (!appId) {
            console.warn("Circle App ID not configured");
            return;
        }

        // Initialize SDK
        sdk = new W3SSdk();
        setIsInitialized(true);

        return () => {
            sdk = null;
        };
    }, []);

    const connect = async () => {
        if (!sdk || !isInitialized) {
            console.error("SDK not initialized");
            return;
        }

        setIsConnecting(true);
        try {
            // In production, you'd get this from your backend after user authentication
            // For now, we'll simulate the flow
            const mockUserToken = "user_token_from_backend";
            setUserToken(mockUserToken);

            // Execute wallet creation/login
            sdk.setAppSettings({
                appId: process.env.NEXT_PUBLIC_CIRCLE_APP_ID!,
            });

            sdk.setAuthentication({
                userToken: mockUserToken,
                encryptionKey: "encryption_key_from_backend", // In production, get from secure backend
            });

            // For demo purposes, set a mock address
            // In production, this would come from the SDK after wallet creation
            const mockAddress = "0x1234567890123456789012345678901234567890";
            setAddress(mockAddress);
        } catch (error) {
            console.error("Failed to connect wallet:", error);
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnect = () => {
        setUserToken(null);
        setAddress(null);
    };

    return {
        isInitialized,
        isConnected: !!address,
        address,
        isConnecting,
        connect,
        disconnect,
        sdk,
    };
}
