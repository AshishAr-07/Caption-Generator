"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth";


export default function Layout({ children }) {
  const [auth, , ,loading] = useAuth();
  const [authorized, setAuthorized] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (loading) {
      setAuthorized(false);
      return;
    }

    if (!auth?.isAuthenticated) {
      setAuthorized(false);
      router.push("/login");
      return;
    }

    setAuthorized(true);
  }, [auth?.isAuthenticated, router, loading]);


  return authorized ? (
    <div>{children}</div>
  ) : (
    <div className="h-screen flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-stone-900 animate-spin"></div>
    </div>
  );
}