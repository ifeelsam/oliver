import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

export default function TreasuryPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Treasury Management</h1>
                <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Rebalance
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Allocation by Chain</CardTitle>
                        <CardDescription>Current liquidity distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground border-t bg-secondary/10">
                        Chart Placeholder
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Yield Performance</CardTitle>
                        <CardDescription>Historical APY over time</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground border-t bg-secondary/10">
                        Chart Placeholder
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
