"use client"

import { Button } from "@/components/ui/button"
import { Bell, Search } from "lucide-react"

export function Header() {
    return (
        <header className="flex h-16 items-center gap-4 border-b bg-background/50 backdrop-blur-xl px-6">
            <div className="flex flex-1 items-center gap-4">
                <form className="ml-auto flex-1 sm:flex-initial">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Search invoices..."
                            className="pl-8 h-9 w-[150px] lg:w-[300px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>
                </form>
            </div>
            <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </Button>
            <Button variant="outline" size="sm">
                Connect Wallet
            </Button>
        </header>
    )
}
