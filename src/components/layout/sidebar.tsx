"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, PiggyBank, CreditCard, Settings, Wallet } from "lucide-react"

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
        <div className={cn("pb-12 min-h-screen border-r bg-card", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center px-4 mb-8">
                        <h2 className="text-2xl font-bold tracking-tight text-primary">
                            Treasury<span className="text-blue-500">Flow</span>
                        </h2>
                    </div>
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Button
                                key={route.href}
                                variant={route.active ? "secondary" : "ghost"}
                                className={cn("w-full justify-start", route.active && "bg-secondary/50")}
                                asChild
                            >
                                <Link href={route.href}>
                                    <route.icon className="mr-2 h-4 w-4" />
                                    {route.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-4 px-7 w-full">
                <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
                    <div className="bg-green-500/20 p-2 rounded-full">
                        <Wallet className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Connected</span>
                        <span className="text-sm font-medium">0x12...4B</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
