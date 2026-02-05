"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, PiggyBank, CreditCard, Settings, Wallet, Sparkles } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/",
            active: pathname === "/",
        },
        {
            label: "Invoices",
            icon: FileText,
            href: "/invoices",
            active: pathname.startsWith("/invoices"),
        },
        {
            label: "Treasury",
            icon: PiggyBank,
            href: "/treasury",
            active: pathname.startsWith("/treasury"),
        },
        {
            label: "Payments",
            icon: CreditCard,
            href: "/payments",
            active: pathname.startsWith("/payments"),
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/settings",
            active: pathname.startsWith("/settings"),
        },
    ]

    return (
        <div className={cn("pb-12 min-h-screen border-r border-border/50 bg-card/50 backdrop-blur-xl", className)}>
            <div className="space-y-4 py-6">
                <div className="px-4 py-2">
                    <div className="flex items-center gap-2 px-4 mb-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                            <Sparkles className="h-8 w-8 text-primary relative" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            <span className="gradient-text">TreasuryFlow</span>
                        </h2>
                    </div>
                    <div className="space-y-2">
                        {routes.map((route) => (
                            <Button
                                key={route.href}
                                variant={route.active ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start transition-all duration-200 group relative overflow-hidden",
                                    route.active && "bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20"
                                )}
                                asChild
                            >
                                <Link href={route.href}>
                                    {route.active && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
                                    )}
                                    <route.icon className={cn(
                                        "mr-3 h-4 w-4 transition-transform group-hover:scale-110",
                                        route.active && "text-primary"
                                    )} />
                                    <span className="relative">{route.label}</span>
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-6 left-4 right-4">
                <div className="glass-effect flex items-center gap-3 p-3 rounded-xl">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500/30 blur-md rounded-full" />
                        <div className="bg-green-500/20 p-2 rounded-full relative border border-green-500/30">
                            <Wallet className="h-4 w-4 text-green-400" />
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-xs text-muted-foreground">Connected</span>
                        <span className="text-sm font-medium truncate">0x1234...AB4B</span>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
            </div>
        </div>
    )
}
