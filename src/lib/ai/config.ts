import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "dummy_key", // Fallback for build time
    dangerouslyAllowBrowser: true, // For hackathon demos/prototyping primarily
});
