import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFetch } from "../hooks/useFetch";

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useFetch hook", () => {
  it("fetches posts from JSONPlaceholder", async () => {
    const { result } = renderHook(
      () =>
        useFetch<{ id: number; title: string }[]>(
          "posts",
          "https://jsonplaceholder.typicode.com/users/1/posts"
        ),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.length).toBeGreaterThan(0);
    expect(result.current.data?.[0]).toHaveProperty("title");
  });
});
