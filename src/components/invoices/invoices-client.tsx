"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Upload, FileText, CheckCircle2, Clock, AlertTriangle } from "lucide-react"

type Invoice = {
    id: string
    filename: string
    status: "pending" | "verified" | "rejected"
    amount: string
    date: string
}

export function InvoicesClient() {
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [isUploading, setIsUploading] = useState(false)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        const newInvoice: Invoice = {
            id: Math.random().toString(36).substring(7),
            filename: file.name,
            status: "pending",
            amount: "$10,000.00", // Mock amount extraction
            date: new Date().toLocaleDateString(),
        }

        setInvoices([newInvoice, ...invoices])
        setIsUploading(false)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
                <div className="relative">
                    <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                        accept=".pdf,.png,.jpg,.jpeg"
                        disabled={isUploading}
                    />
                    <Button disabled={isUploading}>
                        {isUploading ? (
                            <>Uploading...</>
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                Upload Invoice
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                    <CardDescription>Manage and track your RWA-backed invoices</CardDescription>
                </CardHeader>
                <CardContent>
                    {invoices.length === 0 ? (
                        <div className="rounded-md border p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8 opacity-50" />
                            <p>No invoices found. Upload one to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {invoices.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-full bg-primary/10">
                                            <FileText className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{invoice.filename}</p>
                                            <p className="text-sm text-muted-foreground">{invoice.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-medium">{invoice.amount}</p>
                                            <div className="flex items-center gap-1 justify-end">
                                                {invoice.status === "verified" ? (
                                                    <span className="flex items-center text-xs text-green-500">
                                                        <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                                                    </span>
                                                ) : invoice.status === "pending" ? (
                                                    <span className="flex items-center text-xs text-yellow-500">
                                                        <Clock className="h-3 w-3 mr-1" /> Pending Verification
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-xs text-red-500">
                                                        <AlertTriangle className="h-3 w-3 mr-1" /> Rejected
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
