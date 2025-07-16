"use client";

import Image from "next/image";
import { useState } from "react";
import { login } from "../lib/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await login(username, password);
      if (result.success) {
        toast.success("Login successful!");
        localStorage.setItem("auth", "true");
        localStorage.setItem("token", result.token || "");
        localStorage.setItem("user", JSON.stringify(result.user));
        router.push("/dashboard");
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Oops! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ngfGreenLight px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden max-w-5xl w-full rounded-2xl">
        {/* Left section */}
        <div className="flex justify-center items-center p-6 md:p-10">
          <div className="w-full flex justify-center">
            <Image
              src="/logo.png"
              alt="NGF Logo"
              width={400}
              height={200}
              className="w-50 md:w-80 h-auto object-contain  "
              priority
            />
          </div>
        </div>
        {/* Right section */}
        <div className="flex flex-col justify-center items-center p-6 md:p-10">
          <form
            onSubmit={handleSubmit}
            className="bg-green-100 p-6 md:p-8 rounded-xl shadow-md w-full max-w-sm"
          >
            <h2 className="text-center text-lg font-semibold mb-1 text-black">
              Hello!, Welcome to
            </h2>
            <p className="text-center text-green-700 font-bold mb-6">
              Fund Dashboard
            </p>

            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-green-50 border border-green-200 text-orange-600 placeholder-orange-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-6 rounded bg-green-50 border border-green-200 text-orange-600 placeholder-orange-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition-colors duration-200 cursor-pointer "
            >
              {loading? "Please wait ..." : "Proceed"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
