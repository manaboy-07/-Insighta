"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  const linkStyle = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
      pathname === path
        ? "bg-white text-black"
        : "text-white/80 hover:text-white hover:bg-white/10"
    }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-linear-to-r from-black via-zinc-900 to-black border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-lnear-to-r from-blue-500 to-purple-500"></div>
          <div className="font-bold text-white text-lg tracking-wide">
            Insighta
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-full border border-white/10">
          <Link className={linkStyle("/dashboard")} href="/dashboard">
            Dashboard
          </Link>
          <Link className={linkStyle("/profiles")} href="/profiles">
            Profiles
          </Link>
          <Link className={linkStyle("/search")} href="/search">
            Search
          </Link>
          <Link className={linkStyle("/account")} href="/account">
            Account
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="px-4 py-2 rounded-full text-sm font-medium bg-linear-to-r from-red-500 to-pink-500 hover:opacity-90 transition-all shadow-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
