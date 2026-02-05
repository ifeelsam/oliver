import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, DollarSign, Activity, FileText, TrendingUp, Zap, ArrowDownRight } from "lucide-react"

export default function DashboardPage() {
    const stats = [
        {
            title: "Total Liquidity",
            value: "$1,254,320.00",
            change: "+20.1%",
            changeType: "positive",
            icon: DollarSign,
            gradient: "from-blue-500/20 to-cyan-500/20",
            iconBg: "bg-blue-500/20",
            iconColor: "text-blue-400"
        },
        {
            title: "Active Invoices",
            value: "24",
            change: "$340k pending",
            changeType: "neutral",
            icon: FileText,
            gradient: "from-purple-500/20 to-pink-500/20",
            iconBg: "bg-purple-500/20",
            iconColor: "text-purple-400"
        },
        {
            title: "Treasury Yield",
            value: "+12.5%",
            change: "APY across 3 pools",
            changeType: "positive",
            icon: TrendingUp,
            gradient: "from-green-500/20 to-emerald-500/20",
            iconBg: "bg-green-500/20",
            iconColor: "text-green-400"
        },
        {
            title: "Cross-Chain",
            value: "5 Chains",
            change: "Circle Arc Enabled",
            changeType: "neutral",
            icon: Zap,
            gradient: "from-orange-500/20 to-yellow-500/20",
            iconBg: "bg-orange-500/20",
            iconColor: "text-orange-400"
        }
    ]

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground mt-1">Welcome back to TreasuryFlow</p>
                </div>
                <Button className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    New Invoice
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 group">
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                            <div className={`${stat.iconBg} p-2 rounded-lg relative`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg" />
                                <stat.icon className={`h-4 w-4 ${stat.iconColor} relative`} />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-2xl font-bold mb-1">{stat.value}</div>
                            <p className={`text-xs flex items-center gap-1 ${stat.changeType === 'positive' ? 'text-green-400' :
                                    stat.changeType === 'negative' ? 'text-red-400' :
                                        'text-muted-foreground'
                                }`}>
                                {stat.changeType === 'positive' && <TrendingUp className="h-3 w-3" />}
                                {stat.changeType === 'negative' && <ArrowDownRight className="h-3 w-3" />}
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Treasury Performance</CardTitle>
                        <CardDescription>Cross-chain liquidity distribution over time</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] flex items-center justify-center rounded-lg border border-dashed border-border/50 bg-gradient-to-br from-primary/5 to-purple-500/5">
                            <div className="text-center space-y-2">
                                <Activity className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                                <p className="text-sm text-muted-foreground">Chart visualization coming soon</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest transactions and events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[
                                { title: "Invoice #1024 Funded", subtitle: "Acme Corp • 2 min ago", amount: "+$24,000", positive: true },
                                { title: "Yield Harvested", subtitle: "Aave Market • 2 hours ago", amount: "+$124.50", positive: true },
                                { title: "Payroll Batch", subtitle: "12 Recipients • 5 hours ago", amount: "-$45,000", positive: false }
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center group">
                                    <div className={`h-10 w-10 rounded-lg ${activity.positive ? 'bg-green-500/10' : 'bg-red-500/10'} flex items-center justify-center mr-3`}>
                                        {activity.positive ? (
                                            <ArrowUpRight className="h-4 w-4 text-green-400" />
                                        ) : (
                                            <ArrowDownRight className="h-4 w-4 text-red-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{activity.title}</p>
                                        <p className="text-xs text-muted-foreground">{activity.subtitle}</p>
                                    </div>
                                    <div className={`font-semibold ${activity.positive ? 'text-green-400' : 'text-red-400'}`}>
                                        {activity.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
