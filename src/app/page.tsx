"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { login } from "./lib/auth";
import LoadingScreen from "./components/LoadingScreen";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const { username, password } = formData;

      if (!username || !password) {
        toast.error("Kindly fill the necessary fields.");
        return;
      }

      setLoading(true);
      try {
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
      } catch {
        toast.error("Oops! Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [formData, router]
  );

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-ngfGreenLight px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full rounded-2xl overflow-hidden shadow-lg bg-white">
          {/* Left: Logo */}
          <div className="flex items-center justify-center bg-white p-6 md:p-10">
            <Image
              src="/logo.png"
              alt="NGF Logo"
              width={400}
              height={200}
              className="w-48 md:w-80 object-contain"
              priority
            />
          </div>

          {/* Right: Form */}
          <div className="flex items-center justify-center bg-green-50 p-6 md:p-10">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-sm bg-white p-6 md:p-8 rounded-xl shadow-sm"
            >
              <h2 className="text-xl font-bold text-center text-green-800 mb-1">
                Hello! Welcome to
              </h2>
              <p className="text-center text-green-600 font-semibold mb-6">
                Fund Dashboard
              </p>

              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-green-50 border border-green-200 text-black placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="mb-6 relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-green-50 border border-green-200 text-black placeholder-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <div
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-10 right-3 cursor-pointer text-green-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded font-semibold transition duration-200 ${
                  loading
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {loading ? "Processing..." : "Proceed"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {loading && <LoadingScreen fullscreen={true} text="Please wait..." />}
    </>
  );
}
