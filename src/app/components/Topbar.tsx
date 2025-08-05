"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmPrompt from "./ConfirmPrompt";
import { checkLoggedIn } from "../lib/util";

export default function Topbar({ collapsed }: { collapsed: boolean }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    setShowConfirm(false);
    logout();
  };

  const cancelPrompt = () => {
    setShowConfirm(false);
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const router = useRouter();

  useEffect(() => {
    const token = checkLoggedIn();
    if (token) {
      setUserName(token.name);
    }
  }, [router]);

  const logout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <>
      <div className="h-16 bg-white border-b shadow flex  items-center px-4 transition-all duration-300">
        <div className="px-5">
          <h2 className="text-lg font-semibold text-black capitalize">
            {userName ? `Hi, ${userName} 👋🏽` : "Welcome 👋🏽"}
          </h2>
          <h2 className="text-sm font-semibold text-black">{currentDate}</h2>
        </div>
        <button
          className="ml-auto text-red-400 border border-borderColor px-4 rounded cursor-pointer"
          onClick={handleLogout}
        >
          logout
        </button>
      </div>
      {showConfirm && (
        <ConfirmPrompt
          message="Are you sure you want to Logout?"
          onConfirm={confirmLogout}
          onClose={cancelPrompt}
        />
      )}
    </>
  );
}
