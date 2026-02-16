"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useIngest } from "@/lib/hooks";
import { useToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Upload,
    FileText,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Database,
    HardDrive,
    Trash2,
} from "lucide-react";

interface IngestedFile {
    id: string;
    name: string;
    size: number;
    status: "uploading" | "processing" | "vectorized" | "error";
    chunksAdded?: number;
    totalChunks?: number;
    dateAdded: Date;
    error?: string;
}

export default function KnowledgeVault() {
    const [files, setFiles] = useState<IngestedFile[]>([]);
    const ingestMutation = useIngest();
    const { toast } = useToast();

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            for (const file of acceptedFiles) {
                const fileId = Date.now().toString() + Math.random().toString(36).substring(7);
                const newFile: IngestedFile = {
                    id: fileId,
                    name: file.name,
                    size: file.size,
                    status: "uploading",
                    dateAdded: new Date(),
                };
                setFiles((prev) => [newFile, ...prev]);

                try {
                    setFiles((prev) =>
                        prev.map((f) => (f.id === fileId ? { ...f, status: "processing" } : f))
                    );
                    const result = await ingestMutation.mutateAsync(file);
                    if (result.error) {
                        setFiles((prev) =>
                            prev.map((f) =>
                                f.id === fileId ? { ...f, status: "error", error: result.error } : f
                            )
                        );
                        toast({ title: "Ingestion Failed", description: result.error, variant: "error" });
                    } else {
                        setFiles((prev) =>
                            prev.map((f) =>
                                f.id === fileId
                                    ? {
                                        ...f,
                                        status: "vectorized",
                                        chunksAdded: result.chunks_added,
                                        totalChunks: result.total_chunks,
                                    }
                                    : f
                            )
                        );
                        toast({
                            title: "PDF Ingested",
                            description: `${file.name} — ${result.chunks_added} chunks vectorized`,
                            variant: "success",
                        });
                    }
                } catch (err: unknown) {
                    const errorMsg = err instanceof Error ? err.message : "Unknown error";
                    setFiles((prev) =>
                        prev.map((f) =>
                            f.id === fileId ? { ...f, status: "error", error: errorMsg } : f
                        )
                    );
                    toast({ title: "Upload Failed", description: errorMsg, variant: "error" });
                }
            }
        },
        [ingestMutation, toast]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        maxSize: 50 * 1024 * 1024,
    });

    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getStatusBadge = (status: IngestedFile["status"]) => {
        switch (status) {
            case "uploading":
                return <Badge variant="processing">Uploading</Badge>;
            case "processing":
                return <Badge variant="processing">Processing</Badge>;
            case "vectorized":
                return <Badge variant="success">Vectorized</Badge>;
            case "error":
                return <Badge variant="danger">Error</Badge>;
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="h-14 border-b border-border flex items-center px-6 gap-3 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-mint/10 flex items-center justify-center">
                    <Database className="w-4 h-4 text-mint" />
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-slate-heading">Knowledge Vault</h2>
                    <p className="text-[11px] text-slate-muted">Upload and manage financial filings</p>
                </div>
                <div className="ml-auto flex items-center gap-3 text-xs text-slate-muted">
                    <div className="flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>{files.filter((f) => f.status === "vectorized").length} files ingested</span>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-6 max-w-4xl mx-auto space-y-6">
                    {/* Upload Zone */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div
                            {...getRootProps()}
                            className={`relative rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 ${isDragActive
                                    ? "border-mint bg-mint/5 shadow-glow-lg"
                                    : "border-border hover:border-mint/30 hover:bg-surface-light/30"
                                }`}
                        >
                            <input {...getInputProps()} />
                            <motion.div
                                animate={isDragActive ? { scale: 1.05, y: -5 } : { scale: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="w-14 h-14 rounded-2xl bg-mint/10 flex items-center justify-center mx-auto mb-4">
                                    <Upload className={`w-7 h-7 ${isDragActive ? "text-mint" : "text-slate-muted"}`} />
                                </div>
                                <h3 className="text-base font-semibold text-slate-heading mb-1">
                                    {isDragActive ? "Drop PDF here" : "Upload Financial Filings"}
                                </h3>
                                <p className="text-sm text-slate-muted mb-3">
                                    Drag & drop 10-K, 10-Q, or annual reports (PDF, up to 50MB)
                                </p>
                                <Button variant="outline" size="sm" className="pointer-events-none">
                                    Browse Files
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Ingested Files Table */}
                    {files.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Ingested Filings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <AnimatePresence>
                                            {files.map((file) => (
                                                <motion.div
                                                    key={file.id}
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="flex items-center gap-4 p-3 rounded-lg bg-surface-light/30 border border-border"
                                                >
                                                    <div className="w-9 h-9 rounded-lg bg-surface-light flex items-center justify-center shrink-0">
                                                        {file.status === "vectorized" ? (
                                                            <CheckCircle2 className="w-4 h-4 text-mint" />
                                                        ) : file.status === "error" ? (
                                                            <AlertCircle className="w-4 h-4 text-danger" />
                                                        ) : (
                                                            <Loader2 className="w-4 h-4 text-mint animate-spin" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-3.5 h-3.5 text-slate-muted shrink-0" />
                                                            <span className="text-sm font-medium text-slate-heading truncate">
                                                                {file.name}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-muted">
                                                            <span>{formatSize(file.size)}</span>
                                                            <span>
                                                                {file.dateAdded.toLocaleDateString("en-US", {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                })}
                                                            </span>
                                                            {file.chunksAdded && <span>{file.chunksAdded} chunks</span>}
                                                        </div>
                                                        {file.status === "processing" && (
                                                            <Progress value={65} className="mt-2 h-1" />
                                                        )}
                                                        {file.error && (
                                                            <p className="text-xs text-danger mt-1">{file.error}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {getStatusBadge(file.status)}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7"
                                                            onClick={() => removeFile(file.id)}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 text-slate-muted hover:text-danger" />
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Empty state */}
                    {files.length === 0 && (
                        <Card className="border-dashed">
                            <CardContent className="py-10 text-center">
                                <FileText className="w-10 h-10 text-slate-muted/30 mx-auto mb-3" />
                                <h4 className="text-sm font-semibold text-slate-muted mb-1">No filings uploaded yet</h4>
                                <p className="text-xs text-slate-muted">Upload PDF documents to enable the Librarian Agent&apos;s fundamental analysis</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
