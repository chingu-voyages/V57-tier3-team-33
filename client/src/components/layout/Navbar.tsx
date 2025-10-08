import { PBIcon, PBLogo } from "../brand";
import DateDisplay from "../ui/DateDisplay";
import HamburgerComponent from "./Hamburger";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="border-b-[0.5px] border-gray-300 px-6 pr-8">
      <div className="flex justify-between max-w-7xl mx-auto items-center">
        {/* logo and app name*/}
        <Link to={"/"} className="">
          <div className="flex items-center gap-2 cursor-pointer">
            <PBLogo width={150} />
          </div>
        </Link>

        {/* Navigation */}
        {/* Using hamburger-react icons */}
        <div className="block md:hidden">
          <HamburgerComponent />
        </div>

        <div className="md:flex lg:gap-4 gap-2 hidden">
          <Link to="/">
            <div className="cursor-pointer text-gray-600 text-[16px] hover:bg-gray-100 p-2 px-4 hover:rounded-md">
              Home
            </div>
          </Link>
          <Link to="/open-prs">
            <div className="cursor-pointer text-gray-600 text-[16px] hover:bg-gray-100 p-2 px-4 hover:rounded-md">
              Open PRs
            </div>
          </Link>
          <Link to="/closed-prs">
            <div className="cursor-pointer text-gray-600 text-[16px] hover:bg-gray-100 p-2 px-4 hover:rounded-md">
              Closed PRs
            </div>
          </Link>
        </div>

        <div className="md:flex hidden items-center gap-2">
          <DateDisplay format="Month Do, YYYY" className="text-gray-400" />
          
          <Link to="/auth" className="">
            <PBIcon />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
