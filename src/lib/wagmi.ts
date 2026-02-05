"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
    arbitrum,
    base,
    mainnet,
    optimism,
    polygon,
    sepolia,
} from "wagmi/chains";

export const config = getDefaultConfig({
    appName: "TreasuryFlow",
    projectId: "YOUR_PROJECT_ID", // TODO: Replace with env variable
    chains: [
        mainnet,
        polygon,
        optimism,
        arbitrum,
        base,
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
    ],
    ssr: true,
});
