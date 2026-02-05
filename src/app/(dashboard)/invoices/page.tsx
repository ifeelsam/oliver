import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

export default function InvoicesPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Invoice
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                    <CardDescription>Manage and track your RWA-backed invoices</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border p-4 text-center text-muted-foreground">
                        No invoices found. Upload one to get started.
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
