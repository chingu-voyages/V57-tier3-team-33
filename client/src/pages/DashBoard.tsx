import { useEffect } from "react";
import GraphicActivity from "../components/layout/GraphicActivity";
import TopContributers from "../components/layout/TopContributers";
import { useToken } from "../hooks/useToken";
import { useFetchAllPRsOfRepo } from "../hooks/useFetchAllPRsOfRepo";
import PRStatusStat from "../components/statistics/PRStatusStat";
import { PullRequest } from "../types/PullRequest.types";

export default function DashBoard() {
  const url = `${import.meta.env.VITE_API_URL}/api/prs/chingu-voyages/V57-tier3-team-33`;
  const { data: token } = useToken();
  const { data, isLoading } = useFetchAllPRsOfRepo<{ data: PullRequest[] }>(url, token);

  useEffect(() => {
    if (!isLoading) {
      console.log(isLoading)
      console.log(data)
    }
  }, [isLoading])

  return (
    <>
      {" "}
      <main className="max-w-screen-xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h2 className="font-bold text-3xl text-gray-800 mb-2">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600">
            Insight into your team's pull request performance.
          </p>
        </div>
        {!isLoading && data && <PRStatusStat allprs={data.data} />}
      </main>{" "}
      {!isLoading && data &&
        <>
          <GraphicActivity allprs={data.data} />
          <TopContributers allprs={data.data}/>
        </>
      }
    </>
  );
}
