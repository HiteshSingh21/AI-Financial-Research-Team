"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSystemStatus } from "@/lib/hooks";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Settings as SettingsIcon,
    Key,
    Server,
    Brain,
    Database,
    Clock,
    Cpu,
    CheckCircle2,
    XCircle,
    RefreshCw,
    AlertTriangle,
} from "lucide-react";

function StatusDot({ ok }: { ok: boolean }) {
    return (
        <span
            className={`inline-block w-2 h-2 rounded-full ${ok ? "bg-mint animate-pulse" : "bg-danger"}`}
        />
    );
}

export default function SettingsPage() {
    const { data: status, isLoading, error, dataUpdatedAt } = useSystemStatus();

    return (
        <div className="h-screen flex flex-col">
            <div className="h-14 border-b border-border flex items-center px-6 gap-3 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-mint/10 flex items-center justify-center">
                    <SettingsIcon className="w-4 h-4 text-mint" />
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-slate-heading">Settings</h2>
                    <p className="text-[11px] text-slate-muted">Live system configuration</p>
                </div>
                {status && (
                    <div className="ml-auto flex items-center gap-2 text-[11px] text-slate-muted">
                        <RefreshCw className="w-3 h-3" />
                        <span>Auto-refresh 10s</span>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-6 max-w-2xl mx-auto w-full space-y-6">

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card className="border-danger/30">
                            <CardContent className="py-6">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-danger" />
                                    <div>
                                        <p className="text-sm font-semibold text-danger">Backend Unreachable</p>
                                        <p className="text-xs text-slate-muted mt-0.5">
                                            Cannot connect to API. Is the backend running on port 8000?
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}


                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Server className="w-4 h-4 text-mint" />
                                <CardTitle className="text-base">Backend Connection</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-text">API URL</span>
                                <code className="text-xs bg-surface-light px-2 py-1 rounded text-mint font-mono">
                                    {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
                                </code>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-text">Status</span>
                                {isLoading ? (
                                    <Skeleton className="h-5 w-20" />
                                ) : status ? (
                                    <Badge variant="success">
                                        <StatusDot ok={true} />
                                        <span className="ml-1.5">Connected</span>
                                    </Badge>
                                ) : (
                                    <Badge variant="danger">Disconnected</Badge>
                                )}
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-text">Version</span>
                                {isLoading ? (
                                    <Skeleton className="h-4 w-12" />
                                ) : (
                                    <span className="text-xs text-slate-muted font-mono">
                                        v{status?.version ?? "—"}
                                    </span>
                                )}
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-slate-muted" />
                                    <span className="text-sm text-slate-text">Uptime</span>
                                </div>
                                {isLoading ? (
                                    <Skeleton className="h-4 w-20" />
                                ) : (
                                    <span className="text-xs text-slate-muted font-mono">
                                        {status?.uptime ?? "—"}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Brain className="w-4 h-4 text-mint" />
                                <CardTitle className="text-base">AI Agents</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {isLoading
                                ? [...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <Skeleton className="h-5 w-40" />
                                        <Skeleton className="h-5 w-16" />
                                    </div>
                                ))
                                : status?.agents.map((agent, i) => (
                                    <React.Fragment key={agent.name}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-sm font-medium text-slate-heading">
                                                    {agent.name}
                                                </span>
                                                <p className="text-xs text-slate-muted">{agent.role}</p>
                                            </div>
                                            <Badge variant={agent.status === "active" ? "success" : "danger"}>
                                                {agent.status === "active" ? (
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                ) : (
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                )}
                                                {agent.status === "active" ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                        {i < (status?.agents.length ?? 0) - 1 && <Separator />}
                                    </React.Fragment>
                                ))}
                        </CardContent>
                    </Card>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-mint" />
                                <CardTitle className="text-base">Infrastructure</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-text">Database</span>
                                {isLoading ? (
                                    <Skeleton className="h-5 w-24" />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <code className="text-[11px] bg-surface-light px-1.5 py-0.5 rounded text-slate-muted font-mono">
                                            {status?.database.url_scheme ?? "—"}
                                        </code>
                                        <StatusDot ok={status?.database.connected ?? false} />
                                    </div>
                                )}
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-text">RAG Index</span>
                                {isLoading ? (
                                    <Skeleton className="h-5 w-32" />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-muted">
                                            {status?.rag.total_chunks ?? 0} chunks
                                        </span>
                                        <Badge variant={status?.rag.ready ? "success" : "secondary"}>
                                            {status?.rag.ready ? "Ready" : "Empty"}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Cpu className="w-3.5 h-3.5 text-slate-muted" />
                                    <span className="text-sm text-slate-text">LLM Model</span>
                                </div>
                                {isLoading ? (
                                    <Skeleton className="h-4 w-28" />
                                ) : (
                                    <code className="text-xs bg-surface-light px-2 py-1 rounded text-mint font-mono">
                                        {status?.model ?? "—"}
                                    </code>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Key className="w-4 h-4 text-mint" />
                                <CardTitle className="text-base">API Keys</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {isLoading ? (
                                <>
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-5 w-full" />
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-text">Gemini API Key</span>
                                        <Badge variant={status?.api_keys.gemini ? "success" : "danger"}>
                                            {status?.api_keys.gemini ? (
                                                <>
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Configured
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                    Missing
                                                </>
                                            )}
                                        </Badge>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-text">Tavily API Key</span>
                                        <Badge variant={status?.api_keys.tavily ? "success" : "secondary"}>
                                            {status?.api_keys.tavily ? (
                                                <>
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Configured
                                                </>
                                            ) : (
                                                <>
                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                    Optional
                                                </>
                                            )}
                                        </Badge>
                                    </div>
                                </>
                            )}
                            <Separator />
                            <p className="text-xs text-slate-muted pt-1">
                                API keys are configured in the backend{" "}
                                <code className="text-mint">.env</code> file. Restart the backend after
                                making changes.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
