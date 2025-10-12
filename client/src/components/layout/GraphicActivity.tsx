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

// Sample Data for PR Activity (Bar Chart)
const prActivityData = [
  { name: "Jan", "PRs Created": 40, "PRs Merged": 24 },
  { name: "Feb", "PRs Created": 30, "PRs Merged": 13 },
  { name: "Mar", "PRs Created": 20, "PRs Merged": 98 },
  { name: "Apr", "PRs Created": 27, "PRs Merged": 39 },
  { name: "May", "PRs Created": 18, "PRs Merged": 48 },
  { name: "Jun", "PRs Created": 23, "PRs Merged": 38 },
  { name: "Jul", "PRs Created": 34, "PRs Merged": 43 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // Colors for Pie Chart segments

export default function GraphicActivit({ allprs }: { allprs: PullRequest[] }) {

  const prStats = useMemo(() => {
    const openPRs = allprs.filter((pr) => pr.state === "open").length;
    const mergedPRs = allprs.filter((pr) => pr.state === "closed" && !!pr.merged_at).length;
    const closedPRs = allprs.length - openPRs - mergedPRs;

    const prStatusData = [
      { name: "Open", value: openPRs },
      { name: "Closed", value: closedPRs },
      { name: "Merged", value: mergedPRs },
    ]

    return { prStatusData }
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
              data={prActivityData}
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
