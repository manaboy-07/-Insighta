"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type User = {
  sub: string;
  role: string;
  username: string;
  email: string;
  avatar_url: string;
  iat: number;
  exp: number;
};

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me", {
          headers: {
            "X-API-Version": "1",
          },
        });

        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // fallback
  if (!user) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg font-medium">No account data found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* HEADER CARD */}
      <div className="bg-gray-600 shadow-md rounded-2xl p-6 border">
        <div className="flex items-center gap-4">
          {/* AVATAR */}
          <img
            src={user.avatar_url}
            alt="avatar"
            className="w-16 h-16 rounded-full border"
          />

          <div>
            <h1 className="text-xl font-bold">{user.username}</h1>
            <p className="text-gray-50">{user.email}</p>

            {/* ROLE BADGE */}
            <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* DETAILS CARD */}
      <div className="mt-6 bg-gray-600 shadow-md rounded-2xl p-6 border space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-50">User ID</span>
          <span className="font-mono text-sm">{user.sub}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-50">Issued At</span>
          <span>{new Date(user.iat * 1000).toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-50">Expires At</span>
          <span>{new Date(user.exp * 1000).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
