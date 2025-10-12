import { useQueries } from "@tanstack/react-query";
import { api } from "../lib/axios";

type PaginatedResponse<TItem> = {
    success: boolean;
    data: TItem[];
    pagination: {
        page: number;
        per_page: number;
        total_pages: number;
        total_records: number;
    };
    filters?: Record<string, any>;
    sort?: Record<string, any>;
    rate_limit?: Record<string, any>;
};

export function useAllPages<TItem = any>(
    url: string,
    totalPages: number,
    token?: string
) {
    const queries = useQueries({
        queries: Array.from({ length: totalPages }, (_, i) => ({
            queryKey: ["page", i + 1],
            queryFn: async (): Promise<PaginatedResponse<TItem>> => {
                const response = await api.get(`${url}?state=all&page=${i + 1}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                return response.data;
            },
            enabled: !!token && !!totalPages,
        })),
    });

    const isLoading = queries.some((q) => q.isLoading);
    const error = queries.find((q) => q.error)?.error;

    const flattenedData: TItem[] = queries
        .flatMap((q) => q.data?.data ?? [])
        .filter(Boolean);

    const meta = queries[0]?.data;

    return { data: flattenedData, meta, isLoading, error };
}
