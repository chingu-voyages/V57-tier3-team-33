import {useQuery ,UseQueryOptions} from '@tanstack/react-query';
import { AxiosRequestConfig } from "axios";
import { api } from '../lib/axios';


export function useFetch<TData = unknown>(
  key: string | any[],
  url: string,
  config?: AxiosRequestConfig,
  options?: UseQueryOptions<TData>
) {
  return useQuery<TData>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const response = await api.request<TData>({
        url,
        method: config?.method || "GET",
        ...config,
      });
      return response.data;
    },
    ...options,
  });
}
