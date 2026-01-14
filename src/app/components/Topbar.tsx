"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmPrompt from "./ConfirmPrompt";
import { checkLoggedIn } from "../lib/util";
import { FaBars } from "react-icons/fa";

interface TopbarProps {
  collapsed: boolean;
  toggleMobileMenu?: () => void;
}

export default function Topbar({ collapsed, toggleMobileMenu }: TopbarProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = checkLoggedIn();
    if (token?.name) setUserName(token.name);
  }, []);

  const logout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleLogout = () => setShowConfirm(true);
  const confirmLogout = () => {
    setShowConfirm(false);
    logout();
  };
  const cancelPrompt = () => setShowConfirm(false);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="h-22 bg-white border-b shadow flex flex-col sm:flex-row items-start sm:items-center px-4 gap-4 transition-all duration-300">
      {toggleMobileMenu && (
        <button
          aria-label="Toggle sidebar"
          onClick={toggleMobileMenu}
          className="md:hidden mr-2 p-2 rounded text-black mt-4"
        >
          <FaBars size={24} />
        </button>
      )}
      <div className="-mt-16 md:mt-0 h-16  ml-5 flex flex-col sm:flex-row items-start sm:items-center px-4 w-full">
        <div className="px-5">
          <h2 className="text-lg font-semibold text-black capitalize">
            {userName ? `Hi, ${userName} 👋🏽` : "Welcome 👋🏽"}
          </h2>
          <h2 className="text-sm font-semibold text-black">{currentDate}</h2>
        </div>

        <button
          className="ml-auto text-red-400 border border-borderColor px-4 rounded cursor-pointer hover:bg-red-50 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {showConfirm && (
        <ConfirmPrompt
          message="Are you sure you want to logout?"
          onConfirm={confirmLogout}
          onClose={cancelPrompt}
        />
      )}
    </div>
  );
}
