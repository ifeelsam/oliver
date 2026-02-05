import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <Sidebar className="hidden lg:block" />
            <div className="flex flex-col">
                <Header />
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
