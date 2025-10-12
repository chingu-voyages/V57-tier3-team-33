import React, { useState, useEffect, useMemo } from "react"; // Import useState
import { Export, Filter, GitPR, Refresh, X } from "../components/icons";
import LottieLoader from "../components/ui/LottieLoader"; // Import LottieLoader
import LottieEmptyState from "../components/ui/LottieEmptyState"; // Import LottieEmptyState
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebase";
import ClosedPR from "../components/icons/closedPR";
import MergedPR from "../components/icons/mergedPR";
import { format, isToday, isYesterday } from "date-fns";

const ClosedPRs: React.FC = () => {
  // Fetching prs from the backend
  const { user } = useAuth();
  const username = user?.username;
  const [token, setToken] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("updated"); // 'newest' | 'oldest' | 'comments' | 'updated'

  //  Getting Firebase token
  useEffect(() => {
    const fetchToken = async () => {
      const token = await auth.currentUser?.getIdToken();
      setToken(token || undefined);
    };
    fetchToken();
  }, []);

  // Calling custom hook when token + username exist
  const { data, isLoading, error, refetch } = useFetch(
    ["closedPRs", username],
    username
      ? `${import.meta.env.VITE_API_URL}/api/prs/${username}?state=closed`
      : "",
    {},
    undefined,
    token
  );

  // Flatten server response groups { repo, pullRequests: [...] } into a single list
  const prs = useMemo(() => {
    const groups = (data?.data as any[]) || [];
    return groups.flatMap((g: any) =>
      (g?.pullRequests || []).map((pr: any) => ({
        ...pr,
        repo: pr?.repo ?? g?.repo,
      }))
    );
  }, [data]);

  // Helpers for safe date parsing
  const safeTime = (d?: string | null): number => {
    if (!d) return 0;
    const n = new Date(d).getTime();
    return isNaN(n) ? 0 : n;
  };

  const closedTime = (pr: any): number => {
    // Prefer merged_at, then closed_at, then updated_at, finally created_at
    return (
      safeTime(pr?.merged_at) ||
      safeTime(pr?.closed_at) ||
      safeTime(pr?.updated_at) ||
      safeTime(pr?.created_at)
    );
  };

  // Sorted list based on UI selection
  const sortedPRs = useMemo(() => {
    const list = [...prs];
    switch (sortBy) {
      case "newest":
        return list.sort((a, b) => closedTime(b) - closedTime(a));
      case "oldest":
        return list.sort((a, b) => closedTime(a) - closedTime(b));
      case "comments": {
        // If comments count is not available, fallback to updated_at descending
        const getComments = (p: any) => (typeof p?.comments === "number" ? p.comments : 0);
        return list.sort((a, b) => {
          const c = getComments(b) - getComments(a);
          return c !== 0 ? c : safeTime(b?.updated_at) - safeTime(a?.updated_at);
        });
      }
      case "updated":
      default:
        return list.sort((a, b) => safeTime(b?.updated_at) - safeTime(a?.updated_at));
    }
  }, [prs, sortBy]);

  // formatting date with guards for null/invalid values
  const formatDate = (isoString?: string | null) => {
    if (!isoString) return "Unknown";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Unknown";
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d, yyyy"); // e.g., "Dec 8, 2025"
  };

  console.log("pages", data);

  return (
    <main className="max-w-screen-xl mx-auto py-8 px-4">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-3xl font-bold text-gray-800">
            {data?.pagination.total_records} Closed Pull Requests
          </h2>
          <p className="text-gray-600">
            Track and manage all closed pull requests
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200" onClick={() => refetch()}>
            <Refresh width={20} fill="#fff" />
            <span>Refresh</span>
          </button>
          <button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200">
            <Export width={20} fill="#000" />
            <span>Export JSON</span>
          </button>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          {/* Adjusted grid for inputs + buttons */}
          <div className="flex flex-col ">
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
            />
          </div>
          {/* Buttons now part of the same grid */}
          <div className="flex sm:flex-row gap-4 lg:col-span-1 justify-end">
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200">
              <Filter fill="#fff" width={20} />
              <span>Apply</span>
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200">
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
              {data?.pagination.total_records} Closed Pull Requests
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
              <option value="comments">Most Comments</option>
              <option value="updated">Last Updated</option>
            </select>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <LottieLoader />
          </div>
        ) : error || data === undefined || sortedPRs.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <LottieEmptyState message="No closed pull requests found." />
          </div>
        ) : (
          <div className="flex flex-col rounded-md overflow-hidden p-4 border-gray-400">
            {/* Render your PRs list here */}
            {sortedPRs.map((PR, index) => (
              <div
                key={PR?.id ?? index}
                className="p-4 border-[0.5px] border-gray-300 hover:bg-gray-100"
              >
                {/* details */}
                <a href={PR?.url} target="_blank" rel="noopener noreferrer">
                  <div className="flex flex-col gap-2 cursor-pointer">
                    <div className="flex gap-2 font-semibold">
                      {/* checking for merged for icon */}
                      {PR?.merged_at ? (
                        <MergedPR className="w-5 h-5 text-purple-700" />
                      ) : (
                        <ClosedPR className="w-5 h-5 text-red-700" />
                      )}
                      <div className="text-gray-600">{PR?.repo}</div>
                      <div>{PR?.title}</div>
                    </div>
                    <div className="text-gray-600 text-sm">
                      #{PR?.number} by {PR?.author?.username} was {PR?.merged_at ? "merged" : "closed"} {" "}
                      {PR?.merged_at ? (
                        <span>{formatDate(PR?.merged_at)}</span>
                      ) : (
                        <span>{formatDate(PR?.closed_at)}</span>
                      )}
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ClosedPRs;
