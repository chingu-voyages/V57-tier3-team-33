import { Github } from "../icons";

const CTA = () => {
  return (
    <div>
      <div className="md:py-40 py-30 md:px-20 px-15">
        <div className="bg-green-400 p-10 rounded-2xl md:text-start ">
          <div className="max-w-2xl">
            <div className="outline-2 mb-4 w-fit p-2 rounded-full font-semibold text-gray-700 outline-gray-700">
              Quick Setup
            </div>
            <h2 className="text-white lg:text-6xl md:text-5xl text-4xl pt-4 pb-10 font-semibold">
              Connect your GitHub repository
            </h2>
            <button className="flex bg-black rounded-full py-3 px-5 gap-2 cursor-pointer hover:bg-gray-800">
              <Github />
              <div className="text-white ">Connect repository</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
