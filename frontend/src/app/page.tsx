"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useAnalyze } from "@/lib/hooks";
import { getUserId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Send,
    Copy,
    Download,
    Check,
    Bot,
    User,
    BookOpen,
    BarChart3,
    Newspaper,
    Sparkles,
    Loader2,
    TrendingUp,
    Shield,
    Zap,
} from "lucide-react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const agentSteps = [
    { icon: BookOpen, label: "Librarian searching 10-K filings...", color: "text-blue-400" },
    { icon: BarChart3, label: "Quant computing RSI, MACD, SMA...", color: "text-purple-400" },
    { icon: Newspaper, label: "Journalist scanning news sentiment...", color: "text-amber-400" },
    { icon: Sparkles, label: "Aggregator synthesizing final report...", color: "text-mint" },
];

export default function CommandCenter() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const analyzeMutation = useAnalyze();

    const scrollToBottom = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);


    useEffect(() => {
        if (!analyzeMutation.isPending) {
            setCurrentStep(0);
            return;
        }
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev < agentSteps.length - 1 ? prev + 1 : prev));
        }, 3000);
        return () => clearInterval(interval);
    }, [analyzeMutation.isPending]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || analyzeMutation.isPending) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setCurrentStep(0);

        try {
            const result = await analyzeMutation.mutateAsync({
                query: input.trim(),
                userId: getUserId(),
            });
            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: result.response,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
        } catch {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "An error occurred while analyzing. Please check your backend connection and try again.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        }
    };

    const copyToClipboard = async (content: string, id: string) => {
        await navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const exportToPdf = async (content: string) => {
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF();
        const lines = doc.splitTextToSize(content, 180);
        doc.setFontSize(10);
        doc.text(lines, 15, 20);
        doc.save("financial-report.pdf");
    };

    return (
        <div className="h-screen flex">

            <div className="flex-1 flex flex-col min-w-0">

                <div className="h-14 border-b border-border flex items-center px-5 gap-3 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-mint/10 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-mint" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-slate-heading">Command Center</h2>
                        <p className="text-[11px] text-slate-muted">Multi-agent financial intelligence</p>
                    </div>
                    <Badge variant="success" className="ml-auto">Online</Badge>
                </div>


                <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4" ref={scrollRef}>
                    {messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center h-full text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mint/20 to-mint-dark/20 flex items-center justify-center mb-5 shadow-glow">
                                <Zap className="w-8 h-8 text-mint" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-heading mb-2">
                                Financial Intelligence Suite
                            </h2>
                            <p className="text-slate-muted text-sm max-w-md mb-8">
                                Ask anything about stocks, markets, or companies. Our AI team of analysts will research and provide comprehensive reports.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                                {[
                                    { icon: TrendingUp, text: "Analyze NVDA stock performance and technicals" },
                                    { icon: Shield, text: "What are the key risks in AAPL's 10-K filing?" },
                                    { icon: Newspaper, text: "Latest market sentiment for Tesla" },
                                ].map((suggestion, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInput(suggestion.text)}
                                        className="flex items-start gap-2.5 p-3.5 rounded-xl bg-surface-light/50 border border-border hover:border-mint/30 hover:bg-surface-hover transition-all duration-200 text-left"
                                    >
                                        <suggestion.icon className="w-4 h-4 text-mint mt-0.5 shrink-0" />
                                        <span className="text-xs text-slate-text leading-relaxed">{suggestion.text}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role === "assistant" && (
                                    <div className="w-8 h-8 rounded-lg bg-mint/10 flex items-center justify-center shrink-0 mt-1">
                                        <Bot className="w-4 h-4 text-mint" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] rounded-xl px-4 py-3 ${msg.role === "user"
                                        ? "bg-mint/15 border border-mint/20 text-slate-heading"
                                        : "bg-surface-light border border-border"
                                        }`}
                                >
                                    {msg.role === "assistant" ? (
                                        <>
                                            <div className="markdown-content">
                                                <ReactMarkdown
                                                    components={{
                                                        code(props) {
                                                            const { children, className, ...rest } = props;
                                                            const match = /language-(\w+)/.exec(className || "");
                                                            return match ? (
                                                                <div className="relative my-3 rounded-lg overflow-hidden">
                                                                    <div className="flex items-center justify-between px-3 py-1.5 bg-[#1a1b26] text-xs text-slate-muted">
                                                                        <span>{match[1]}</span>
                                                                        <button
                                                                            onClick={() => copyToClipboard(String(children), `code-${msg.id}`)}
                                                                            className="hover:text-slate-heading transition-colors"
                                                                        >
                                                                            <Copy className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                    <SyntaxHighlighter
                                                                        style={oneDark}
                                                                        language={match[1]}
                                                                        PreTag="div"
                                                                        customStyle={{
                                                                            margin: 0,
                                                                            borderRadius: 0,
                                                                            fontSize: "13px",
                                                                        }}
                                                                    >
                                                                        {String(children).replace(/\n$/, "")}
                                                                    </SyntaxHighlighter>
                                                                </div>
                                                            ) : (
                                                                <code
                                                                    className="bg-surface px-1.5 py-0.5 rounded text-mint text-sm font-mono"
                                                                    {...rest}
                                                                >
                                                                    {children}
                                                                </code>
                                                            );
                                                        },
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(msg.content, msg.id)}
                                                    className="h-7 text-xs gap-1.5"
                                                >
                                                    {copiedId === msg.id ? (
                                                        <Check className="w-3 h-3 text-mint" />
                                                    ) : (
                                                        <Copy className="w-3 h-3" />
                                                    )}
                                                    {copiedId === msg.id ? "Copied" : "Copy"}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => exportToPdf(msg.content)}
                                                    className="h-7 text-xs gap-1.5"
                                                >
                                                    <Download className="w-3 h-3" />
                                                    Export PDF
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                    )}
                                </div>
                                {msg.role === "user" && (
                                    <div className="w-8 h-8 rounded-lg bg-surface-light border border-border flex items-center justify-center shrink-0 mt-1">
                                        <User className="w-4 h-4 text-slate-muted" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>


                    {analyzeMutation.isPending && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3"
                        >
                            <div className="w-8 h-8 rounded-lg bg-mint/10 flex items-center justify-center shrink-0 mt-1">
                                <Loader2 className="w-4 h-4 text-mint animate-spin" />
                            </div>
                            <div className="bg-surface-light border border-border rounded-xl px-4 py-3 max-w-[75%]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-mint" />
                                    <span className="text-sm font-medium text-slate-heading">
                                        Analyzing...
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-4/5" />
                                    <Skeleton className="h-3 w-3/5" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>


                <div className="border-t border-border p-4 shrink-0">
                    <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
                        <Input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about any stock, company, or market trend..."
                            disabled={analyzeMutation.isPending}
                            className="flex-1"
                        />
                        <Button
                            type="submit"
                            disabled={!input.trim() || analyzeMutation.isPending}
                            className="shrink-0"
                        >
                            {analyzeMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                    </form>
                </div>
            </div>


            <div className="hidden xl:flex w-[300px] flex-col border-l border-border shrink-0">
                <div className="h-14 border-b border-border flex items-center px-5">
                    <h3 className="text-sm font-semibold text-slate-heading">Live Intelligence</h3>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">

                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-slate-muted uppercase tracking-wider">Agent Pipeline</h4>
                            {agentSteps.map((step, i) => {
                                const isActive = analyzeMutation.isPending && i === currentStep;
                                const isDone = analyzeMutation.isPending && i < currentStep;
                                const isWaiting = !analyzeMutation.isPending || i > currentStep;
                                return (
                                    <motion.div
                                        key={i}
                                        className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300 ${isActive
                                            ? "bg-surface-light border border-mint/20 shadow-glow"
                                            : isDone
                                                ? "bg-surface-light/30 border border-border opacity-60"
                                                : "opacity-30"
                                            }`}
                                        animate={isActive ? { scale: [1, 1.01, 1] } : {}}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    >
                                        <step.icon className={`w-4 h-4 ${isActive ? step.color : isDone ? "text-mint" : "text-slate-muted"}`} />
                                        <span className={`text-xs ${isActive ? "text-slate-heading font-medium" : "text-slate-muted"}`}>
                                            {isDone ? step.label.replace("...", " ✓") : step.label}
                                        </span>
                                        {isActive && <Loader2 className="w-3 h-3 text-mint animate-spin ml-auto" />}
                                    </motion.div>
                                );
                            })}
                            {analyzeMutation.isPending && (
                                <Progress value={((currentStep + 1) / agentSteps.length) * 100} className="mt-2" />
                            )}
                        </div>


                        <div className="space-y-3 mt-6">
                            <h4 className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
                                Analysis Capabilities
                            </h4>
                            {[
                                { icon: BarChart3, label: "Technical Analysis", desc: "RSI, MACD, SMA, EMA" },
                                { icon: BookOpen, label: "Fundamental Analysis", desc: "10-K, 10-Q, Financial Filings" },
                                { icon: Newspaper, label: "Sentiment Analysis", desc: "News, Headlines, Market Mood" },
                            ].map((cap, i) => (
                                <div
                                    key={i}
                                    className="p-3 rounded-lg bg-surface-light/30 border border-border"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <cap.icon className="w-3.5 h-3.5 text-mint" />
                                        <span className="text-xs font-semibold text-slate-heading">{cap.label}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-muted">{cap.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
