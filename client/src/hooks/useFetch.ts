import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { api } from "../lib/axios";

export function useFetch<TData = unknown>(
  key: string | any[],
  url: string,
  config?: AxiosRequestConfig,
  options?: UseQueryOptions<TData>,
  token?: string
) {
  return useQuery<TData>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const response = await api.request<TData>({
        url,
        method: config?.method || "GET",
        headers: {
          ...config?.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...config,
      });
      return response.data;
    },
    ...options,
  });
}
