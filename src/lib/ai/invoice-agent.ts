import { anthropic } from "./config";
import { verificationTools } from "./tools";
import { AgentResult } from "./types";

const SYSTEM_PROMPT = `
You are the TreasuryFlow Invoice Verification Agent.
Your role is to autonomously verify invoice authenticity and assess risk for financing approval.
You follow a ReAct (Reasoning + Acting) pattern.
Always verify the invoice data first, then check debtor history.
Finally Provide a JSON output with the decision.
`;

export async function runInvoiceVerificationAgent(invoiceId: string, debtorAddress: string): Promise<AgentResult> {
    const tools = verificationTools;

    // Initial user prompt
    const userMessage = `Please verify invoice ${invoiceId} for debtor ${debtorAddress} and decide if we should fund it.`;

    // In a real implementation this would be a loop handling tool use calls.
    // For this v1, we will mock the ReAct loop or do a single turn if possible, 
    // but since we need to show "AI-Powered", let's try to structure the prompt to use tools if we had a loop.
    // Since we don't have a real loop here yet (requires state management), we'll simulate the "Thinking" and return a decision based on mocked tools.

    // 1. Call tools directly (simulating the agent deciding to call them)
    const invoiceData = await tools[0].execute({ ipfsHash: invoiceId });
    const riskData = await tools[1].execute({ debtorAddress });

    // 2. Synthesize with LLM
    const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
            {
                role: "user",
                content: `
        Context Data:
        Invoice: ${JSON.stringify(invoiceData)}
        Risk Data: ${JSON.stringify(riskData)}
        
        Analyze this data and provide a financing decision.
        Return ONLY a JSON object with:
        - decision: "approve" | "reject"
        - riskScore: number (0-1000)
        - reasoning: string
        `
            }
        ]
    });

    // Parse response
    try {
        const text = response.content[0].type === 'text' ? response.content[0].text : "";
        // Extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return {
            decision: "manual_review",
            reasoning: "Could not parse agent response: " + text
        };
    } catch (e) {
        console.error("Agent Error", e);
        return {
            decision: "error",
            reasoning: "Internal Agent Error"
        };
    }
}
