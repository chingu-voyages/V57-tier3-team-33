import React, { useState } from "react"; // Import useState
import { Export, Filter, GitPR, Refresh, X } from "../components/icons";
import LottieLoader from "../components/ui/LottieLoader"; // Import LottieLoader
import LottieEmptyState from "../components/ui/LottieEmptyState"; // Import LottieEmptyState

const OpenPRs: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const [prs, setPrs] = useState([]); // State for PRs data

  // Simulate data fetching
  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     // setPrs([...some data...]); // Uncomment and add data to test empty state
  //   }, 2000);
  // }, []);

  return (
    <main className="max-w-screen-xl mx-auto py-8 px-4">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-3xl font-bold text-gray-800">
            Open Pull Requests
          </h2>
          <p className="text-gray-600">
            Track and manage all open pull requests
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {" "}
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
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="status"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Status
            </label>
            <select
              id="status"
              className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="merged">Merged</option>
            </select>
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
              0 Open Pull Requests
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
        ) : prs.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <LottieEmptyState message="No open pull requests found." />
          </div>
        ) : (
          <div className="p-20 text-center text-gray-500">
            {/* Render your PRs list here */}
            List of Open Pull Requests
          </div>
        )}
      </section>
    </main>
  );
};

export default OpenPRs;
