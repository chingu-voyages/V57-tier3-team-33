import { useAuth } from "../../context/AuthContext";
import { PBIcon, PBLogo } from "../brand";
import DateDisplay from "../ui/DateDisplay";
import HamburgerComponent from "./Hamburger";
import { Link } from "react-router-dom";
import { GitPR, Docs } from "../icons";
import ClosedPR from "../icons/closedPR";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

          {!user && (
            <Link to="/auth" className="">
              <PBIcon />
            </Link>
          )}
        </div>
        <div>
          {user && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm hover:bg-gray-50"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-7 h-7 rounded-full"
                />
                <span className="ml-2 text-sm text-gray-700 font-medium">
                  {user.username}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  className={`ml-2 text-gray-500 transition-transform ${menuOpen ? "rotate-180" : "rotate-0"}`}
                  fill="currentColor"
                >
                  <path d="M7 10l5 5 5-5H7z" />
                </svg>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                >
                  <Link
                    to="/open-prs"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <GitPR width={18} height={18} fill="currentColor" className="text-gray-600" />
                    <span>Open PRs</span>
                  </Link>
                  <Link
                    to="/closed-prs"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <ClosedPR width={18} height={18} className="text-gray-600" />
                    <span>Closed PRs</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Docs width={18} height={18} fill="currentColor" className="text-gray-600" />
                    <span>Dashboard</span>
                  </Link>

                  <div className="my-2 border-t border-gray-200" />

                  <button
                    onClick={() => { setMenuOpen(false); logOut(); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 2a1 1 0 011 1v8a1 1 0 11-2 0V3a1 1 0 011-1z" />
                      <path d="M7.05 4.55a8 8 0 1110.9 0 1 1 0 11-1.4-1.4 6 6 0 10-8.1 0 1 1 0 11-1.4 1.4z" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
