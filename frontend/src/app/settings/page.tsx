"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Key, Server, Brain } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="h-screen flex flex-col">
            <div className="h-14 border-b border-border flex items-center px-6 gap-3 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-mint/10 flex items-center justify-center">
                    <SettingsIcon className="w-4 h-4 text-mint" />
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-slate-heading">Settings</h2>
                    <p className="text-[11px] text-slate-muted">System configuration</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-6 max-w-2xl mx-auto w-full space-y-6">
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
                                http://localhost:8000
                            </code>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-text">Status</span>
                            <Badge variant="success">Connected</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-mint" />
                            <CardTitle className="text-base">AI Agents</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {[
                            { name: "Supervisor", desc: "Lead Financial Strategist" },
                            { name: "Librarian", desc: "Fundamental Analyst (RAG)" },
                            { name: "Quant", desc: "Technical Analyst" },
                            { name: "Journalist", desc: "Sentiment Analyst" },
                            { name: "Aggregator", desc: "Report Synthesis" },
                        ].map((agent, i) => (
                            <React.Fragment key={agent.name}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm font-medium text-slate-heading">{agent.name}</span>
                                        <p className="text-xs text-slate-muted">{agent.desc}</p>
                                    </div>
                                    <Badge variant="success">Active</Badge>
                                </div>
                                {i < 4 && <Separator />}
                            </React.Fragment>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Key className="w-4 h-4 text-mint" />
                            <CardTitle className="text-base">API Keys</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-muted">
                            API keys are managed in the backend <code className="text-mint">.env</code> file. Restart the backend after making changes.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
