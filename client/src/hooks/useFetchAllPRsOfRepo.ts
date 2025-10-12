import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";

export function useFetchAllPRsOfRepo<TData = unknown>(url: string | null, token?: string) {
    return useQuery({
        queryKey: ["all-prs", url],
        queryFn: async () => {
            const first = await api.get(`${url}?state=all&page=1`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const totalPages = first.data.pagination.total_pages;

            const pages = await Promise.all(
                Array.from({ length: totalPages - 1 }, (_, i) =>
                    api.get(`${url}?state=all&page=${i + 2}`, {
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                    })
                )
            );

            return {
                data: [
                    ...first.data.data,
                    ...pages.flatMap((r) => r.data.data ?? []),
                ],
            };
        },
        enabled: !!token && !!url,
        staleTime: 1000 * 60 * 10,
    });
}