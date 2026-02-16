"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useHistory } from "@/lib/hooks";
import { getUserId, formatDate, truncate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
    History,
    Search,
    MessageSquare,
    Clock,
    ChevronRight,
    X,
    Bot,
    TrendingUp,
} from "lucide-react";

export default function IntelligenceArchive() {
    const [userId, setUserId] = useState("");
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        setUserId(getUserId());
    }, []);

    const { data: history, isLoading, error } = useHistory(userId);

    const filtered = history?.filter(
        (item) =>
            item.query.toLowerCase().includes(search.toLowerCase()) ||
            item.response.toLowerCase().includes(search.toLowerCase())
    );

    const selectedItem = history?.find((item) => item.id === selectedId);

    const extractTicker = (text: string): string | null => {
        const match = text.match(/\b[A-Z]{2,5}\b/);
        return match ? match[0] : null;
    };

    return (
        <div className="h-screen flex flex-col">

            <div className="h-14 border-b border-border flex items-center px-6 gap-3 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-mint/10 flex items-center justify-center">
                    <History className="w-4 h-4 text-mint" />
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-slate-heading">Intelligence Archive</h2>
                    <p className="text-[11px] text-slate-muted">Past analysis reports</p>
                </div>
                {history && (
                    <Badge variant="secondary" className="ml-auto">
                        {history.length} reports
                    </Badge>
                )}
            </div>

            <div className="flex-1 flex min-h-0">

                <div className="w-full lg:w-[400px] xl:w-[450px] border-r border-border flex flex-col">

                    <div className="p-4 border-b border-border">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-muted" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by ticker, keyword..."
                                className="pl-9"
                            />
                        </div>
                    </div>


                    <ScrollArea className="flex-1">
                        <div className="p-3 space-y-2">
                            {isLoading && (
                                <>
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="p-3 rounded-lg bg-surface-light/30 space-y-2">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    ))}
                                </>
                            )}

                            {error && (
                                <div className="p-4 text-center text-sm text-danger">
                                    Failed to load history. Is the backend running?
                                </div>
                            )}

                            {filtered && filtered.length === 0 && (
                                <div className="p-8 text-center">
                                    <MessageSquare className="w-10 h-10 text-slate-muted/30 mx-auto mb-3" />
                                    <p className="text-sm text-slate-muted">No reports found</p>
                                    <p className="text-xs text-slate-muted mt-1">
                                        {search ? "Try a different search term" : "Start by asking a question in the Command Center"}
                                    </p>
                                </div>
                            )}

                            <AnimatePresence>
                                {filtered?.map((item, i) => {
                                    const ticker = extractTicker(item.query);
                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <button
                                                onClick={() => setSelectedId(item.id)}
                                                className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 ${selectedId === item.id
                                                    ? "bg-mint/10 border border-mint/20 shadow-glow"
                                                    : "hover:bg-surface-light/50 border border-transparent"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                                    <span className="text-sm font-medium text-slate-heading leading-tight line-clamp-2">
                                                        {item.query}
                                                    </span>
                                                    <ChevronRight className="w-4 h-4 text-slate-muted shrink-0 mt-0.5" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3 h-3 text-slate-muted" />
                                                    <span className="text-[11px] text-slate-muted">
                                                        {formatDate(item.timestamp)}
                                                    </span>
                                                    {ticker && (
                                                        <Badge variant="default" className="text-[10px] h-4 px-1.5">
                                                            {ticker}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </ScrollArea>
                </div>


                <div className="hidden lg:flex flex-1 flex-col min-w-0">
                    {selectedItem ? (
                        <>
                            <div className="h-14 border-b border-border flex items-center px-5 justify-between shrink-0">
                                <div className="flex items-center gap-2 min-w-0">
                                    <Bot className="w-4 h-4 text-mint shrink-0" />
                                    <span className="text-sm font-medium text-slate-heading truncate">
                                        {selectedItem.query}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedId(null)}
                                    className="h-8 w-8 shrink-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <ScrollArea className="flex-1">
                                <div className="p-6">
                                    <div className="markdown-content">
                                        <ReactMarkdown>{selectedItem.response}</ReactMarkdown>
                                    </div>
                                </div>
                            </ScrollArea>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-center p-8">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-surface-light flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="w-7 h-7 text-slate-muted/30" />
                                </div>
                                <h3 className="text-base font-semibold text-slate-muted mb-1">
                                    Select a Report
                                </h3>
                                <p className="text-sm text-slate-muted">
                                    Click on any past analysis to view the full report
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
