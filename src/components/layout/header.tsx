"use client"

import { Button } from "@/components/ui/button"
import { Bell, Search } from "lucide-react"
import { CircleConnectButton } from "@/components/wallet/circle-connect-button"

export function Header() {
    return (
        <header className="flex h-16 items-center gap-4 border-b border-border/50 bg-card/30 backdrop-blur-xl px-6 sticky top-0 z-50">
            <div className="flex flex-1 items-center gap-4">
                <form className="ml-auto flex-1 sm:flex-initial">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <input
                            type="search"
                            placeholder="Search invoices, transactions..."
                            className="pl-10 h-10 w-[200px] lg:w-[400px] rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 focus-visible:w-[250px] lg:focus-visible:w-[450px]"
                        />
                    </div>
                </form>
            </div>
            <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse">
                    <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
                </span>
            </Button>
            <CircleConnectButton />
        </header>
    )
}
