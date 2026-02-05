export interface AgentTool {
    name: string;
    description: string;
    inputSchema: any;
    execute: (input: any) => Promise<any>;
}

export interface AgentResult {
    decision: string;
    reasoning: string;
    data?: any;
}
