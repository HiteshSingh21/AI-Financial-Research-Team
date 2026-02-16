"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import {
    LayoutDashboard,
    Database,
    History,
    Settings,
    Menu,
    Zap,
    TrendingUp,
} from "lucide-react";

const navItems = [
    { href: "/", label: "Command Center", icon: LayoutDashboard },
    { href: "/knowledge-vault", label: "Knowledge Vault", icon: Database },
    { href: "/history", label: "Intelligence Archive", icon: History },
];

function NavContent() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-5 pb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-mint to-mint-dark flex items-center justify-center shadow-glow">
                        <Zap className="w-5 h-5 text-background" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-slate-heading leading-tight">
                            FinAI Suite
                        </h1>
                        <p className="text-[10px] text-slate-muted font-medium tracking-wider uppercase">
                            Intelligence Platform
                        </p>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-mint/10 text-mint border border-mint/20 shadow-glow"
                                    : "text-slate-muted hover:text-slate-heading hover:bg-surface-light"
                            )}
                        >
                            <item.icon className={cn("w-4 h-4", isActive && "text-mint")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <Separator />

            {/* Bottom section */}
            <div className="p-3 space-y-2">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-muted hover:text-slate-heading hover:bg-surface-light transition-all duration-200"
                >
                    <Settings className="w-4 h-4" />
                    Settings
                </Link>
                <div className="px-3 py-3 rounded-lg bg-surface-light/50 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-3.5 h-3.5 text-mint" />
                        <span className="text-xs font-semibold text-slate-heading">
                            Market Open
                        </span>
                    </div>
                    <p className="text-[11px] text-slate-muted">
                        S&P 500 • NASDAQ • DOW
                    </p>
                </div>
            </div>
        </div>
    );
}

export function Sidebar() {
    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex w-[260px] h-screen flex-col fixed left-0 top-0 z-40 glass border-r border-border">
                <NavContent />
            </aside>

            {/* Mobile hamburger */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 glass border-b border-border flex items-center px-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <NavContent />
                    </SheetContent>
                </Sheet>
                <div className="flex items-center gap-2 ml-3">
                    <Zap className="w-5 h-5 text-mint" />
                    <span className="text-sm font-bold text-slate-heading">
                        FinAI Suite
                    </span>
                </div>
            </div>
        </>
    );
}
