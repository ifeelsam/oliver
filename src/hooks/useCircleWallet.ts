"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { setCookie, getCookie } from "cookies-next";
import { SocialLoginProvider } from "@circle-fin/w3s-pw-web-sdk/dist/src/types";
import type { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";

const appId = process.env.NEXT_PUBLIC_CIRCLE_APP_ID as string;
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

type LoginResult = {
    userToken: string;
    encryptionKey: string;
};

type Wallet = {
    id: string;
    address: string;
    blockchain: string;
    [key: string]: unknown;
};

export function useCircleWallet() {
    const sdkRef = useRef<W3SSdk | null>(null);

    const [sdkReady, setSdkReady] = useState(false);
    const [deviceId, setDeviceId] = useState<string>("");
    const [deviceIdLoading, setDeviceIdLoading] = useState(false);

    const [deviceToken, setDeviceToken] = useState<string>("");
    const [deviceEncryptionKey, setDeviceEncryptionKey] = useState<string>("");

    const [loginResult, setLoginResult] = useState<LoginResult | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);

    const [challengeId, setChallengeId] = useState<string | null>(null);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
    const [status, setStatus] = useState<string>("Initializing...");
    const [isConnecting, setIsConnecting] = useState(false);

    // Initialize SDK on mount
    useEffect(() => {
        let cancelled = false;

        const initSdk = async () => {
            try {
                const { W3SSdk } = await import("@circle-fin/w3s-pw-web-sdk");

                const onLoginComplete = (error: unknown, result: any) => {
                    if (cancelled) return;

                    if (error) {
                        const err = error as any;
                        console.error("❌ Login failed:", err);
                        setLoginError(err.message || "Login failed");
                        setLoginResult(null);
                        setStatus("Login failed");
                        setIsConnecting(false);
                        return;
                    }

                    console.log("✅ Login successful");
                    setLoginResult({
                        userToken: result.userToken,
                        encryptionKey: result.encryptionKey,
                    });
                    setLoginError(null);
                    setStatus("Login successful. Ready to create wallet.");
                    setIsConnecting(false);
                };

                const restoredAppId = (getCookie("appId") as string) || appId || "";
                const restoredGoogleClientId =
                    (getCookie("google.clientId") as string) || googleClientId || "";
                const restoredDeviceToken = (getCookie("deviceToken") as string) || "";
                const restoredDeviceEncryptionKey =
                    (getCookie("deviceEncryptionKey") as string) || "";

                const initialConfig = {
                    appSettings: { appId: restoredAppId },
                    loginConfigs: {
                        deviceToken: restoredDeviceToken,
                        deviceEncryptionKey: restoredDeviceEncryptionKey,
                        google: {
                            clientId: restoredGoogleClientId,
                            redirectUri:
                                typeof window !== "undefined" ? window.location.origin : "",
                            selectAccountPrompt: true,
                        },
                    },
                };

                const sdk = new W3SSdk(initialConfig, onLoginComplete);
                sdkRef.current = sdk;

                if (!cancelled) {
                    setSdkReady(true);
                    setStatus("SDK initialized");
                }
            } catch (err) {
                console.error("❌ Failed to initialize SDK:", err);
                if (!cancelled) {
                    setStatus("Failed to initialize SDK");
                }
            }
        };

        void initSdk();

        return () => {
            cancelled = true;
        };
    }, []);

    // Get deviceId
    useEffect(() => {
        const fetchDeviceId = async () => {
            if (!sdkRef.current) return;

            try {
                const cached =
                    typeof window !== "undefined"
                        ? window.localStorage.getItem("deviceId")
                        : null;

                if (cached) {
                    setDeviceId(cached);
                    return;
                }

                setDeviceIdLoading(true);
                const id = await sdkRef.current.getDeviceId();
                setDeviceId(id);

                if (typeof window !== "undefined") {
                    window.localStorage.setItem("deviceId", id);
                }
            } catch (error) {
                console.error("❌ Failed to get deviceId:", error);
                setStatus("Failed to get deviceId");
            } finally {
                setDeviceIdLoading(false);
            }
        };

        if (sdkReady) {
            void fetchDeviceId();
        }
    }, [sdkReady]);

    // Load USDC balance
    const loadUsdcBalance = useCallback(async (userToken: string, walletId: string) => {
        try {
            const response = await fetch("/api/endpoints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "getTokenBalance",
                    userToken,
                    walletId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("❌ Failed to load balance:", data);
                return null;
            }

            const balances = (data.tokenBalances as any[]) || [];
            const usdcEntry =
                balances.find((t) => {
                    const symbol = t.token?.symbol || "";
                    const name = t.token?.name || "";
                    return symbol.startsWith("USDC") || name.includes("USDC");
                }) ?? null;

            const amount = usdcEntry?.amount ?? "0";
            setUsdcBalance(amount);
            return amount;
        } catch (err) {
            console.error("❌ Failed to load balance:", err);
            return null;
        }
    }, []);

    // Load wallets
    const loadWallets = useCallback(async (userToken: string) => {
        try {
            setStatus("Loading wallets...");

            const response = await fetch("/api/endpoints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "listWallets",
                    userToken,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("❌ Failed to load wallets:", data);
                setStatus("Failed to load wallets");
                return;
            }

            const wallets = (data.wallets as Wallet[]) || [];
            setWallets(wallets);

            if (wallets.length > 0) {
                await loadUsdcBalance(userToken, wallets[0].id);
                setStatus("Wallet loaded successfully");
            } else {
                setStatus("No wallets found");
            }
        } catch (err) {
            console.error("❌ Failed to load wallets:", err);
            setStatus("Failed to load wallets");
        }
    }, [loadUsdcBalance]);

    // Connect wallet flow
    const connect = useCallback(async () => {
        if (!sdkRef.current || !deviceId) {
            setStatus("SDK not ready");
            return;
        }

        setIsConnecting(true);

        try {
            // Step 1: Create device token
            console.log("🔄 Creating device token...");
            setStatus("Creating device token...");

            const tokenResponse = await fetch("/api/endpoints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "createDeviceToken",
                    deviceId,
                }),
            });

            const tokenData = await tokenResponse.json();

            if (!tokenResponse.ok) {
                throw new Error(tokenData.error || "Failed to create device token");
            }

            setDeviceToken(tokenData.deviceToken);
            setDeviceEncryptionKey(tokenData.deviceEncryptionKey);

            setCookie("deviceToken", tokenData.deviceToken);
            setCookie("deviceEncryptionKey", tokenData.deviceEncryptionKey);
            setCookie("appId", appId);
            setCookie("google.clientId", googleClientId);

            console.log("✅ Device token created");

            // Step 2: Login with Google
            console.log("🔄 Initiating Google login...");
            setStatus("Redirecting to Google...");

            sdkRef.current.updateConfigs({
                appSettings: { appId },
                loginConfigs: {
                    deviceToken: tokenData.deviceToken,
                    deviceEncryptionKey: tokenData.deviceEncryptionKey,
                    google: {
                        clientId: googleClientId,
                        redirectUri: window.location.origin,
                        selectAccountPrompt: true,
                    },
                },
            });

            sdkRef.current.performLogin(SocialLoginProvider.GOOGLE);
        } catch (err: any) {
            console.error("❌ Connection failed:", err);
            setStatus(err.message || "Connection failed");
            setLoginError(err.message || "Connection failed");
            setIsConnecting(false);
        }
    }, [deviceId]);

    // Initialize user and create wallet
    const createWallet = useCallback(async () => {
        if (!loginResult?.userToken) {
            setStatus("Please login first");
            return;
        }

        try {
            setIsConnecting(true);

            // Step 1: Initialize user
            console.log("🔄 Initializing user...");
            setStatus("Initializing user...");

            const initResponse = await fetch("/api/endpoints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "initializeUser",
                    userToken: loginResult.userToken,
                }),
            });

            const initData = await initResponse.json();

            if (!initResponse.ok) {
                // User already initialized
                if (initData.code === 155106) {
                    console.log("✅ User already initialized, loading wallet...");
                    await loadWallets(loginResult.userToken);
                    setIsConnecting(false);
                    return;
                }

                throw new Error(initData.error || "Failed to initialize user");
            }

            const newChallengeId = initData.challengeId;
            setChallengeId(newChallengeId);

            console.log("✅ User initialized, executing challenge...");
            setStatus("Creating wallet...");

            // Step 2: Execute challenge
            sdkRef.current?.setAuthentication({
                userToken: loginResult.userToken,
                encryptionKey: loginResult.encryptionKey,
            });

            sdkRef.current?.execute(newChallengeId, async (error) => {
                if (error) {
                    const err = error as any;
                    console.error("❌ Challenge failed:", err);
                    setStatus(err.message || "Failed to create wallet");
                    setIsConnecting(false);
                    return;
                }

                console.log("✅ Wallet created!");
                setStatus("Wallet created! Loading details...");

                // Wait for Circle to index the wallet
                await new Promise((resolve) => setTimeout(resolve, 2000));

                setChallengeId(null);
                await loadWallets(loginResult.userToken);
                setIsConnecting(false);
            });
        } catch (err: any) {
            console.error("❌ Failed to create wallet:", err);
            setStatus(err.message || "Failed to create wallet");
            setIsConnecting(false);
        }
    }, [loginResult, loadWallets]);

    const disconnect = useCallback(() => {
        setLoginResult(null);
        setWallets([]);
        setUsdcBalance(null);
        setChallengeId(null);
        setStatus("Disconnected");
    }, []);

    return {
        // State
        isInitialized: sdkReady && !!deviceId,
        isConnected: wallets.length > 0,
        isConnecting,
        address: wallets[0]?.address || null,
        wallets,
        usdcBalance,
        status,
        error: loginError,

        // Actions
        connect,
        createWallet,
        disconnect,

        // Flags
        needsWalletCreation: !!loginResult && wallets.length === 0,
        initializationError: !sdkReady && status.includes("Failed"),
    };
}
