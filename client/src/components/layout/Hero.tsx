
const Hero = () => {
  return (
    <section className="md:h-[80vh] h-[74vh] relative overflow-hidden">
      <div className="sm:px-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center md:pt-36 pt-30">
          {/* Headline */}
          <h2 className="md:text-7xl sm:text-6xl text-[38px] text-gray-800 md:max-w-4xl font-semibold">
            Track Your GitHub Pull Requests
          </h2>

          {/* Description */}
          <p className="max-w-2xl text-gray-600 md:py-8 py-10 sm:pb-10 pb-12 text-[18px]">
            Stay on top of your team's development workflow with our
            comprehensive PR tracking solution. Moniter open pull requests,
            review closed ones, and keep your development process running
            smoothly.
          </p>

          {/* Buttons */}
          <div className="flex md:flex-row gap-6 flex-col">
            <button className="md:p-2 p-4 md:px-4 px-6 rounded-md bg-black text-white cursor-pointer hover:bg-gray-700">
              View Open PRs
            </button>
            <button className="border-[0.5px] border-gray-400 md:p-2 p-4 md:px-4 px-6 rounded-md cursor-pointer hover:bg-gray-200">
              Browse Closed PRs
            </button>
          </div>

          {/* 3D Images */}
          <div>
            <img src="/cube.png" alt="" className="lg:block hidden w-1/4 h-1/2 absolute top-10 left-[-140px]" />
            <img src="/cube.png" alt="" className="lg:block hidden w-1/4 h-1/2 absolute top-80 right-[-100px]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
