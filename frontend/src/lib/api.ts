import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export interface AnalyzeResponse {
    response: string;
}

export interface IngestResponse {
    status: string;
    file: string;
    pages: number;
    chunks_added: number;
    total_chunks: number;
    error?: string;
}

export interface ChatHistoryItem {
    id: number;
    user_id: string;
    query: string;
    response: string;
    timestamp: string;
}

export interface AgentStatus {
    name: string;
    role: string;
    status: string;
}

export interface SystemStatus {
    status: string;
    version: string;
    uptime: string;
    uptime_seconds: number;
    agents: AgentStatus[];
    rag: {
        ready: boolean;
        total_chunks: number;
    };
    database: {
        connected: boolean;
        url_scheme: string;
    };
    api_keys: {
        gemini: boolean;
        tavily: boolean;
    };
    model: string;
}

export async function analyzeStock(
    query: string,
    userId: string
): Promise<AnalyzeResponse> {
    const { data } = await api.post<AnalyzeResponse>(
        `/api/v1/analyze?query=${encodeURIComponent(query)}&user_id=${encodeURIComponent(userId)}`
    );
    return data;
}

export async function ingestDocument(file: File): Promise<IngestResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post<IngestResponse>("/api/v1/ingest", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
}

export async function getHistory(userId: string): Promise<ChatHistoryItem[]> {
    const { data } = await api.get<ChatHistoryItem[]>(
        `/api/v1/history/${encodeURIComponent(userId)}`
    );
    return data;
}

export async function getSystemStatus(): Promise<SystemStatus> {
    const { data } = await api.get<SystemStatus>("/api/v1/status");
    return data;
}

