export default function WhyChoose() {
  const CardData = [
    {
      title: "SAVE TIME",
      desc: "Quickly identify PRs that need your attention and streamline your review process.",
    },
    {
      title: "TEAM COLLABRATION",
      desc: "Keep everyone informed about the status of pull requests and assignment.",
    },
    {
      title: "PROJECT INSIGHTS",
      desc: "Analyze historical data to improve your development workflow and process.",
    },
    {
      title: "SECURE AND RELIABLE",
      desc: "Built with security in mind and designed to handle your team's workflow and realiably.",
    },
  ];

  return (
    <div className="bg-gray-custom md:py-14 py-14 px-4">
      <div className="max-w-6xl mx-auto flex md:flex-row flex-col justify-between text-gray-800 items-center font-semibold">
        <div className="lg:w-[55%] md:w-[50%] p-6">
          <h3 className="text-2xl font-semibold text-gray-900 py-10">
            Why choose PullBoard?
          </h3>
          <div className="flex flex-col gap-10">
            {CardData.map((card, index) => (
              <div key={index}>
                <div className="outline-1 mb-4 w-fit p-2 rounded-full">
                  {card.title}
                </div>

                <span>
                  Quickly identify PRs that need your attention and streamline
                  your review process.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="lg:h-[70vh] h-[64vh] md:block hidden mt-10">
          <img
            src="/PR.png"
            alt=""
            className="w-full h-full grayscale brightness-75"
          />
        </div>
      </div>
    </div>
  );
}
