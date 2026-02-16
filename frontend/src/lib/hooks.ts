import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { analyzeStock, ingestDocument, getHistory } from "./api";
import type { AnalyzeResponse, IngestResponse, ChatHistoryItem } from "./api";

export function useAnalyze() {
    const queryClient = useQueryClient();
    return useMutation<AnalyzeResponse, Error, { query: string; userId: string }>({
        mutationFn: ({ query, userId }) => analyzeStock(query, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["history"] });
        },
    });
}

export function useIngest() {
    return useMutation<IngestResponse, Error, File>({
        mutationFn: (file) => ingestDocument(file),
    });
}

export function useHistory(userId: string) {
    return useQuery<ChatHistoryItem[], Error>({
        queryKey: ["history", userId],
        queryFn: () => getHistory(userId),
        enabled: !!userId,
        staleTime: 30_000,
    });
}
