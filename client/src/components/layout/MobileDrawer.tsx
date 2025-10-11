import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { PBLogo } from "../brand";
import { useAuth } from "../../context/AuthContext";
import DateDisplay from "../ui/DateDisplay";
import { Copyright } from "../ui";
import { Logout } from "../icons";
import GitHub from "../icons/github";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileDrawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { user, logOut, logIn, loading, error: authError } = useAuth(); // assuming loginWithGithub exists
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Open PRs", path: "/open-prs" },
    { name: "Closed PRs", path: "/closed-prs" },
  ];

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-gradient-to-br from-black/40 via-black/30 to-black/50 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      {/* Drawer panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          absolute top-0 left-0 h-full w-[80vw] sm:w-[65vw] md:w-[320px]
          bg-white/90 backdrop-blur-xl shadow-2xl border-r border-gray-200/60
          rounded-r-2xl transform transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${
            isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }
          flex flex-col justify-between
        `}
      >
        {/* Header */}
        <div className="pr-6 border-b border-gray-300 flex justify-between items-center">
          <PBLogo width={160} />
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl transition-transform hover:rotate-90"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* User Greeting */}
        {user && (
          <div className="px-6 py-3 border-b border-gray-100">
            <p className="text-gray-800 font-semibold text-lg tracking-tight">
              Hey, {user.username} 👋
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-col gap-2 px-5 py-6 overflow-y-auto flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={`block rounded-xl px-4 py-3 text-base font-medium transition-all
                ${
                  location.pathname === link.path
                    ? "bg-gray-100 text-gray-900 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Footer / Auth Buttons */}
        <div className="border-t border-gray-100 p-6 flex flex-col gap-4">
          {!user ? (
            <button
              onClick={() => {
                logIn("/dashboard");
                onClose();
              }}
              className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-4 text-base rounded-lg font-medium hover:bg-gray-800 active:scale-[0.98] transition-all"
            >
              <GitHub />
              Login with GitHub {loading && "..."}
            </button>
          ) : (
            <button
              onClick={() => {
                logOut();
                onClose();
              }}
              className="flex items-center justify-center gap-2 bg-red-500 text-white py-3 px-4 text-base rounded-lg font-medium hover:bg-red-600 active:scale-[0.98] transition-all"
            >
              <Logout width={20} height={20} />
              Logout
            </button>
          )}
          {authError && (
            <p className="text-red-500 text-sm text-center">{authError}</p>
          )}

          {/* Footer info */}
          <section className="text-center text-gray-500 text-xs space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Copyright width={18} />
              <p className="text-sm">
                <DateDisplay format="YYYY" /> PullBoard
              </p>
            </div>
            <p className="text-[11px]">All Rights Reserved.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
