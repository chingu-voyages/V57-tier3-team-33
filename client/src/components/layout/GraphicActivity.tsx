import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { PullRequest } from "../../types/PullRequest.types";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // Colors for Pie Chart segments
const SHORT_MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

interface MonthlyStats {
  created: Record<string, number>;
  merged: Record<string, number>;
}

export default function GraphicActivit({ allprs }: { allprs: PullRequest[] }) {

  const prStats = useMemo(() => {

    // Nmbuer of opened and merged PR by month
    const activity: MonthlyStats = {
      created: {},
      merged: {}
    };

    allprs.forEach((pr) => {
      const createdMonth = new Date(pr.created_at).getMonth();
      activity.created[createdMonth] = (activity.created[createdMonth] || 0) + 1;

      if (pr.merged_at) {
        const mergedMonth = new Date(pr.merged_at).getMonth();
        activity.merged[mergedMonth] = (activity.merged[mergedMonth] || 0) + 1;
      }
    });
    
    const months = new Set([
      ...Object.keys(activity.created),
      ...Object.keys(activity.merged),
    ]);

    const prActivityData = Array.from(months).sort().map((month) => ({
      name: SHORT_MONTHS[parseInt(month)],
      "PRs Created": activity.created[month] || 0,
      "PRs Merged": activity.merged[month] || 0
    }));

    // PR count by state
    const openPRs = allprs.filter((pr) => pr.state === "open").length;
    const mergedPRs = allprs.filter((pr) => pr.state === "closed" && !!pr.merged_at).length;
    const closedPRs = allprs.length - openPRs - mergedPRs;

    const prStatusData = [
      { name: "Open", value: openPRs },
      { name: "Closed", value: closedPRs },
      { name: "Merged", value: mergedPRs },
    ]

    return { prStatusData, prActivityData }
  }, [allprs]);

  return (
    <main className="max-w-screen-xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Pull Request Activity & Status
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PR Activity Bar Chart */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            PR Activity Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={prStats.prActivityData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="PRs Created" fill="#8884d8" />
              <Bar dataKey="PRs Merged" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* PR Status Pie Chart */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            PR Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={prStats.prStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {prStats.prStatusData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>
    </main>
  );
}
