"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/auth";


export default function LoginPage() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [auth, setAuth, { login }] = useAuth();

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        user,
      );

      if (res.data.success) {
        // Use auth context login function
        login(res.data.user);
        toast.success(res.data.message || "Login successful");
        setUser({ email: "", password: "" });

      } else {
        toast.error(res.data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle axios error response
      if (error.response && error.response.data) {
        toast.error(
          error.response.data.error ||
            error.response.data.message ||
            "Login failed",
        );
      } else {
        toast.error("Error in login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Main Card */}
        <div className="bg-white text-black rounded-2xl border border-gray-100 overflow-hidden">

          {/* Form */}
          <div className="px-8 pb-8">
            <div className="md:px-8 pb-8">
              <form onSubmit={onLogin} className="space-y-6">
                {/* Name Field */}
                <div className="bg-white border border-stone-200 rounded-2xl px-8 py-9 shadow-sm">
                  <p className="text-2xl font-medium mb-4 tracking-tight">
                    Log In to your account
                  </p>

                  <div className="flex flex-col gap-3.5">
                    <input
                      type="email"
                      placeholder="Enter Your Email"
                      required
                      value={user.email}
                      onChange={(e) =>
                        setUser((user) => ({ ...user, email: e.target.value }))
                      }
                      className="w-full px-4 py-3 rounded-lg border border-stone-200 text-sm placeholder:text-stone-300 focus:outline-none focus:border-stone-900 bg-white transition-colors duration-150"
                    />

                    <input
                      type="password"
                      placeholder="Enter Your Password"
                      required
                      value={user.password}
                      onChange={(e) =>
                        setUser((user) => ({
                          ...user,
                          password: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-lg border border-stone-200 text-sm placeholder:text-stone-300 focus:outline-none focus:border-stone-900 bg-white transition-colors duration-150"
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-lg bg-stone-900 text-stone-50 font-medium hover:bg-stone-700 transition-all duration-200 tracking-wide"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Logging In...
                        </div>
                      ) : (
                        "Log In →"
                      )}
                    </button>
                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                      <div className="flex-1 h-px bg-stone-100" />
                      <span className="text-xs whitespace-nowrap">
                        {" "}
                        Already have an account?{" "}
                        <Link href="/signup" className="">
                          Sign Up
                        </Link>
                      </span>
                      <div className="flex-1 h-px bg-stone-100" />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}