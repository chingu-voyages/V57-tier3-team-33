import { PBIcon } from "../brand";

const Welcome = () => {
  return (
    <div className="bg-gray-custom md:py-20 py-16 px-4">
      <div className="max-w-6xl mx-auto flex md:flex-row flex-col justify-between items-center gap-12">
        {/* Description */}
        <div className="md:w-1/2">
          <div className="flex items-center gap-4">
            <PBIcon />
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                Welcome to PullBoard
              </h3>
              <p className="text-gray-600">Your PR tracker.</p>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">
              What is PullBoard?
            </h4>
            <div className="flex flex-col gap-4 text-gray-600">
              <p>
                PullBoard is your team's mission control for GitHub pull requests.
              </p>
              <p>
                Get a real-time overview of all open and closed PRs in one
                dashboard, identify bottlenecks, and track progress with clear,
                actionable insights. Never lose track of a review with smart
                filters and highlighted priorities.
              </p>
              <p>
                Save time by streamlining your workflow, reducing context
                switching, and making your team's code review process more
                efficient and transparent.
              </p>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="md:w-1/2 md:block hidden">
          <img src="/github3D.png" alt="PullBoard 3D Github" className="w-full h-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Welcome;