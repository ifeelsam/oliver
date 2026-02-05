import { AgentTool } from "./types";

export const verificationTools: AgentTool[] = [
    {
        name: "extract_invoice_data",
        description: "Extract structured data from invoice document using OCR",
        inputSchema: {
            type: "object",
            properties: {
                ipfsHash: { type: "string", description: "IPFS hash of invoice document" },
            },
            required: ["ipfsHash"],
        },
        execute: async ({ ipfsHash }) => {
            // Mock implementation for now
            console.log(`Extracting data from ${ipfsHash}`);
            return {
                invoiceNumber: "INV-2024-001",
                amount: 50000,
                currency: "USDC",
                dueDate: "2024-06-01",
                issuer: "Acme Corp",
                debtor: "Global Enterprises Ltd",
            };
        },
    },
    {
        name: "verify_debtor_history",
        description: "Check debtor payment history and on-chain activity",
        inputSchema: {
            type: "object",
            properties: {
                debtorAddress: { type: "string" },
                timeframe: { type: "string", enum: ["3months", "6months", "1year"] },
            },
            required: ["debtorAddress"],
        },
        execute: async ({ debtorAddress }) => {
            console.log(`Checking history for ${debtorAddress}`);
            return {
                rating: "A",
                latePayments: 0,
                averageVolume: 120000,
                onChainScore: 85,
            };
        },
    },
];
