import { useEffect, useState } from "react";
import GraphicActivity from "../components/layout/GraphicActivity";
import TopContributers from "../components/layout/TopContributers";
import { useToken } from "../hooks/useToken";
import { useFetchAllPRsOfRepo } from "../hooks/useFetchAllPRsOfRepo";
import PRStatusStat from "../components/statistics/PRStatusStat";
import { PullRequest } from "../types/PullRequest.types";
import RepoForm from "../components/RepoForm";
import LottieLoader from "../components/ui/LottieLoader";

export default function DashBoard() {
  const [owner, setOwner] = useState<string | null>(null);
  const [repo, setRepo] = useState<string | null>(null);

  const url = owner && repo ? `${import.meta.env.VITE_API_URL}/api/prs/${owner}/${repo}` : null;
  const { data: token } = useToken();
  const { data, isLoading, error } = useFetchAllPRsOfRepo<{ data: PullRequest[] }>(url, token);

  const handleSubmit = (ownerInput: string, repoInput: string) => {
    setOwner(ownerInput);
    setRepo(repoInput);
  }

  return (
    <>
      {" "}
      <main className="max-w-screen-xl mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8">
          <div>
            <h2 className="font-bold text-3xl text-gray-800 mb-2">
              Analytics Dashboard
            </h2>
            <p className="text-gray-600">
              Insight into your team's pull request performance.
            </p>
          </div>

          <RepoForm handleSubmit={handleSubmit} isLoading={isLoading} className="w-auto self-end" />
        </div>
        {error && <p>Something went wrong: {error.message}</p>}
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <LottieLoader />
          </div>
        )}
        {!isLoading && data &&
          <>
            <PRStatusStat allprs={data.data} />
            <GraphicActivity allprs={data.data} />
            <TopContributers allprs={data.data} />
          </>
        }
      </main > {" "}
    </>
  );
}
