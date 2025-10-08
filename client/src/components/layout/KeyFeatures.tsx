import { GitPR } from "../icons";
import Timer from "../ui/timer"; // New import
import Filter from "../icons/filter"; // New import

export default function KeyFeatures() {
  const cardData = [
    {
      icon: <GitPR />,
      title: "Open PR Tracking",
      description:
        "Monitor all open pull requests with detailed information including reviewers, creation dates and last actions.",
    },
    {
      icon: <Timer />,
      title: "Historical data",
      description:
        "Access comprehensive records of all closed and merged of all closed and merged pull requests for project insights.",
    },
    {
      icon: <Filter />,
      title: "Advanced filtering",
      description:
        "Filter results by team members, dates and other criteria to find exactly what you need.",
    },
  ];

  return (
    <main className="md:pt-30 pt-55 pb-40 px-6">
      <img src="/box-elements.webp" alt="" className="w-full" />
      <div className="max-w-screen-lg mx-auto z-0 mt-[-140px]">
        <h2 className="text-center text-4xl font-semibold text-gray-800 mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {cardData.map((card, index) => (
            <section
              key={index}
              className="bg-white p-8 rounded-xl border-[0.5px] border-gray-300 text-left"
            >
              <div className="flex flex-col justify-between gap-7 h-full">
                <div className="outline-1 w-fit p-2 rounded-full font-semibold">
                  {card.title}
                </div>
                <p className="text-gray-600">{card.description}</p>
                <div>{card.icon}</div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
