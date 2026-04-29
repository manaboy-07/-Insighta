"use client";

import Protected from "@/components/Protected";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default async function CreateProfile() {
  const router = useRouter();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await api.get("/auth/me", {
          headers: {
            "X-API-Version": "1",
          },
        });

        const role = res?.data?.user?.role;

        if (role !== "ADMIN") {
          router.replace("/unauthorized");
          return;
        }

        setUserRole(role);
      } catch (err) {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [router]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      await api.post(
        "/api/profiles",
        {
          name,
          country_name: country,
        },
        {
          headers: {
            "X-API-Version": "1",
          },
        },
      );

      router.push("/profiles");
    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Protected>
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Create Profile</h1>

        <p className="text-sm text-gray-500">Admin-only action</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              className="w-full border px-3 py-2 rounded-lg mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Country</label>
            <input
              className="w-full border px-3 py-2 rounded-lg mt-1"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Create Profile
          </button>
        </form>
      </div>
    </Protected>
  );
}
