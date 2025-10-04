import { PBIcon } from "../brand";

const Welcome = () => {
  return (
    <div className="bg-gray-custom md:py-14 py-18 px-4">
      <div className="max-w-6xl mx-auto flex md:flex-row flex-col justify-between font-semibold text-gray-800 items-center">
        {/* Description */}
        <div className="md:w-[55%] p-6">
          <PBIcon />
          <div className="md:pb-6 pb-8 pt-4 pl-2">
            <h3 className="text-2xl font-semibold text-gray-900">
              Welcom to PullBoard
            </h3>
            <div>Your PR tracker.</div>
          </div>

          <div className="outline-1 w-fit p-2 rounded-full">
            What is PullBoard?
          </div>
          <div className="pl-10 pt-10">
            <div className="flex flex-col gap-4">
              <span>
                PullBoard is your team's mission control for GitHub pull requests.</span> 
              <span> Get a real-time overview of all open and closed PRs in one
              dashboard,Identify bottlenecks and track progress with clear,
              actionable insights.Never lose track of a review with smart
              filters and highlighted priorities.</span>
              
              <span>Save time by streamlining your workflow and reducing context
              switching.Make your team's code review process more efficient and
              transparent.</span>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="lg:h-90 h-80 md:block hidden mt-10">
          <img src="/github3D.png" alt="" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
