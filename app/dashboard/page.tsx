"use client";

import Protected from "@/components/Protected";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type DashboardData = {
  total?: number;
};

export default function Dashboard() {
  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/api/profiles", {
          headers: {
            "X-API-Version": "1",
          },
        });

        // assuming backend returns pagination-style response
        setData({
          total: res?.data?.total,
        });
        console.log(res.data);
      } catch (err: any) {
        const status = err?.response?.status;

        if (status === 403) {
          router.replace("/unauthorized");
          return;
        }

        console.error("Dashboard error:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  return (
    <Protected>
      <div className="p-6 space-y-4">
        {/* HEADER */}
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* LOADING */}
        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            Loading dashboard...
          </div>
        )}

        {/* CONTENT */}
        {!loading && (
          <div className="p-4 border rounded-xl bg-white shadow-sm">
            <p className="text-gray-600">Total Profiles</p>

            <p className="text-3xl text-black font-bold">{data?.total ?? 0}</p>
          </div>
        )}
      </div>
    </Protected>
  );
}
