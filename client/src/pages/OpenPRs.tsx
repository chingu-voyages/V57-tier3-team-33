import React, { useState, useEffect, useMemo } from "react"; // Import useState
import { Filter, GitPR, Refresh, X } from "../components/icons";
import LottieLoader from "../components/ui/LottieLoader"; // Import LottieLoader
import LottieEmptyState from "../components/ui/LottieEmptyState"; // Import LottieEmptyState
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebase";
import PRListItem, { PullRequestItem } from "../components/PRListItem";
import type { PRResponseEnvelope } from "../types/pr";
import ExportButton from "../components/ExportButton";

const OpenPRs: React.FC = () => {
  // Fetching prs from the backend
  const { user } = useAuth();
  const username = user?.username;
  const [token, setToken] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const perPage = 10;

  //  Getting Firebase token
  useEffect(() => {
    const fetchToken = async () => {
      const token = await auth.currentUser?.getIdToken();
      setToken(token || undefined);
    };
    fetchToken();
  }, []);

  
  const { data, isLoading, isFetching, error, refetch } =
    useFetch<PRResponseEnvelope>(
      ["openPRs", username, page, perPage],
      username
        ? `${
            import.meta.env.VITE_API_URL
          }/api/prs/${username}?state=open&per_page=${perPage}&page=${page}`
        : "",
      {},
      undefined,
      token
    );

  // Local UI state: filters and sorting
  const [authorFilter, setAuthorFilter] = useState<string>("");
  const [repoFilter, setRepoFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("updated"); // 'newest' | 'oldest' | 'updated'

  // Flatten server response: it returns groups { repo, pullRequests: [...] }
  const prs: PullRequestItem[] = useMemo(() => {
    const groups = data?.data ?? [];
    return groups.flatMap((g: any) =>
      (g?.pullRequests || []).map((pr: any) => ({
        ...pr,
        // ensure repo is present on each item
        repo: pr?.repo ?? g?.repo,
      }))
    );
  }, [data]);

  const filteredAndSortedPRs = useMemo(() => {
    const normalized = prs.filter((pr) => {
      const matchesAuthor = authorFilter
        ? (pr.author?.username || "")
            .toLowerCase()
            .includes(authorFilter.toLowerCase())
        : true;
      const matchesRepo = repoFilter
        ? (pr.repo || "").toLowerCase().includes(repoFilter.toLowerCase())
        : true;
      return matchesAuthor && matchesRepo;
    });

    const sorted = [...normalized].sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      // default: updated desc
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });
    return sorted;
  }, [prs, authorFilter, repoFilter, sortBy]);

  const totalCount =
    data?.pagination?.total_records ?? filteredAndSortedPRs.length;
  const totalPages = Math.max(
    1,
    data?.pagination?.total_pages ?? Math.ceil(totalCount / perPage)
  );

  const handleClearFilters = () => {
    setAuthorFilter("");
    setRepoFilter("");
    setSortBy("updated");
  };

  const handleApply = () => {
    // Placeholder for future server-side filtering integration
    refetch();
  };

  return (
    <main className="max-w-screen-xl mx-auto py-8 px-4">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-3xl font-bold text-gray-800">
            {isLoading ? "Loading" : totalCount} Open Pull Requests
          </h2>
          <p className="text-gray-600">
            Track and manage all open pull requests
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
          >
            <Refresh width={20} fill="#fff" />
            <span>{isFetching ? "Refreshing..." : "Refresh"}</span>
          </button>
          <ExportButton
            data={filteredAndSortedPRs}
            filename={`open-prs-${username || "user"}.json`}
          />
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          {/* Adjusted grid for inputs + buttons */}
          <div className="flex flex-col">
            <label
              htmlFor="author"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Author
            </label>
            <input
              type="text"
              id="author"
              className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Username"
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="repository"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Repository
            </label>
            <input
              type="text"
              id="repository"
              className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Repository Name"
              value={repoFilter}
              onChange={(e) => setRepoFilter(e.target.value)}
            />
          </div>
          {/* Buttons now part of the same grid */}
          <div className="flex sm:flex-row gap-4 lg:col-span-1 justify-end">
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
              onClick={handleApply}
            >
              <Filter fill="#fff" width={20} />
              <span>Apply</span>
            </button>
            <button
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
              onClick={handleClearFilters}
            >
              <X fill="#fff" width={20} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </section>

      {/* PRs Summary and List */}
      <section className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GitPR fill="#28a745" width={20} />
            <span className="text-lg font-semibold text-gray-800">
              {isLoading ? "Loading" : totalCount} Open Pull Requests
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-by"
              className="text-sm font-medium text-gray-700"
            >
              Sort by:
            </label>
            <select
              id="sort-by"
              className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="updated">Last Updated</option>
            </select>
            {/* Per-page fixed at 10; selector removed */}
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <LottieLoader />
          </div>
        ) : error || !data || data?.data?.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <LottieEmptyState message="No open pull requests found." />
          </div>
        ) : (
          <div className="flex flex-col rounded-md overflow-hidden p-4 border-gray-400">
            {/* Render your PRs list here */}
            {filteredAndSortedPRs.map((pr) => (
              <PRListItem key={pr.id ?? pr.number} pr={pr} />
            ))}
            <div className="flex items-center justify-between mt-4 text-sm text-gray-700">
              <div>
                Showing {(page - 1) * perPage + 1}–
                {Math.min(page * perPage, totalCount)} of {totalCount}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {(() => {
                  const getPageNumbers = (current: number, total: number) => {
                    if (total <= 7)
                      return Array.from({ length: total }, (_, i) => i + 1);
                    const pages: (number | string)[] = [1];
                    const start = Math.max(2, current - 2);
                    const end = Math.min(total - 1, current + 2);
                    if (start > 2) pages.push("...");
                    for (let i = start; i <= end; i++) pages.push(i);
                    if (end < total - 1) pages.push("...");
                    pages.push(total);
                    return pages;
                  };
                  return getPageNumbers(page, totalPages).map((p, idx) =>
                    typeof p === "number" ? (
                      <button
                        key={p}
                        className={`border px-3 py-1 rounded ${
                          p === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 hover:bg-gray-100"
                        }`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ) : (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 text-gray-500"
                      >
                        …
                      </span>
                    )
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default OpenPRs;
