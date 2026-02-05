import { NextResponse } from "next/server";
import { runInvoiceVerificationAgent } from "@/lib/ai/invoice-agent";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { invoiceId, debtorAddress } = body;

        // Simulate AI Agent processing
        const result = await runInvoiceVerificationAgent(invoiceId, debtorAddress);

        return NextResponse.json({ success: true, analysis: result });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Processing failed" }, { status: 500 });
    }
}
