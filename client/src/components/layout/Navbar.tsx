import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { PBIcon } from "../brand";
import DateDisplay from "../ui/DateDisplay";
import HamburgerComponent from "./Hamburger";
import { Link, useLocation } from "react-router-dom";
import GitPR from "../icons/gitPR";
import { Logout } from "../icons";
import Command from "../icons/command";
import ChartDonut from "../icons/chartDonut";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Open PRs", path: "/open-prs" },
    { name: "Closed PRs", path: "/closed-prs" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 lg:gap-6">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <div
                className={`cursor-pointer text-gray-700 text-[16px] font-medium px-4 py-2 rounded-md transition-all duration-200 
                  ${
                    location.pathname === link.path
                      ? "bg-gray-100 text-black"
                      : "hover:bg-gray-100"
                  }`}
              >
                {link.name}
              </div>
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div
          className="hidden md:flex items-center gap-4 relative"
          ref={menuRef}
        >
          <DateDisplay
            format="Month Do, YYYY"
            className="text-gray-400 text-sm"
          />

          {!user ? (
            <Link to="/auth" aria-label="User profile">
              <PBIcon />
            </Link>
          ) : (
            <div className="relative">
              {/* User avatar cluster */}
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 transition-all px-3 py-1.5 rounded-full border border-gray-200 shadow-sm"
              >
                {/* Avatar / Initials */}
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-gray-700 font-medium text-sm">
                  {user.username}
                </span>
              </button>

              {/* Dropdown Menu */}
              {openMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden backdrop-blur-md animate-fadeIn">
                  {/* Navigation Links */}
                  <div className="flex flex-col p-2 gap-y-1">
                    <Link
                      to="/"
                      className={`flex items-center gap-2 px-4 py-2 text-sm transition-all ${
                        location.pathname === "/"
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setOpenMenu(false)}
                    >
                      <Command width={20} fill="#9A89C0" />
                      Home
                    </Link>
                    <Link
                      to="/dashboard"
                      className={`flex items-center gap-2 px-4 py-2 text-sm transition-all ${
                        location.pathname === "/dashboard"
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setOpenMenu(false)}
                    >
                      <ChartDonut width={20} fill="#9A89C0" />
                      Dashboard
                    </Link>
                    <Link
                      to="/open-prs"
                      className={`flex items-center gap-2 px-4 py-2 text-sm transition-all ${
                        location.pathname === "/open-prs"
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setOpenMenu(false)}
                    >
                      <GitPR width={20} fill="#58AD58" />
                      Open PRs
                    </Link>
                    <Link
                      to="/closed-prs"
                      className={`flex items-center gap-2 px-4 py-2 text-sm transition-all ${
                        location.pathname === "/closed-prs"
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setOpenMenu(false)}
                    >
                      <GitPR width={20} fill="#EB5B53" />
                      Closed PRs
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={() => {
                        logOut();
                        setOpenMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-all flex items-center gap-2"
                    >
                      <Logout width={20} fill="#fb2c36" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <HamburgerComponent />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
