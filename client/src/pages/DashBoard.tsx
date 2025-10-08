import { GitPR, Team } from "../components/icons";
import GraphicActivity from "../components/layout/GraphicActivity";
import TopContributers from "../components/layout/TopContributers";
import { Clock } from "../components/ui"; // Import Clock icon
import CheckCircle from "../components/ui/checkCircle";

export default function DashBoard() {
  const stats = [
    {
      icon: <GitPR width={28} />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      title: "Total PRs",
      value: "0",
    },
    {
      icon: <CheckCircle width={28} fill="#06d6a0" />,
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      title: "Merged PRs",
      value: "0",
    },
    {
      icon: <Clock width={28} fill="#ef476f" />,
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      title: "Average Merge Time",
      value: "0d",
    },
    {
      icon: <Team width={28} fill="#9368b7" />,
      bgColor: "bg-amner-500",
      textColor: "text-purple-700",
      title: "Contributors",
      value: "0",
    },
  ];

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
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4"
            >
              <div className={`${stat.bgColor} p-1 rounded-lg`}>
                {stat.icon}
              </div>
              <div className="flex flex-col">
                <h3 className="font-medium text-gray-600">{stat.title}</h3>
                <span className={`font-bold text-2xl ${stat.textColor}`}>
                  {stat.value}
                </span>
              </div>
            </div>
          ))}
        </section>
      </main>{" "}
      <GraphicActivity />
      <TopContributers />
    </>
  );
}
