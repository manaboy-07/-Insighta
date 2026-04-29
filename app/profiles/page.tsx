"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Protected from "@/components/Protected";

type Profile = {
  id: string;
  name: string;
  gender: string;
  gender_probability: number;
  country_name: string;
};

export default function Profiles() {
  const router = useRouter();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [next, setNext] = useState<string | null>(null);
  const [prev, setPrev] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    age_group: "",
    country_id: "",
    gender: "",
    min_age: "",
    max_age: "",
    min_gender_probability: "",
    max_gender_probability: "",
    min_country_probability: "",
    sort_by: "",
    order: "asc",
  });

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const fetchProfiles = async () => {
    setLoading(true);

    try {
      const res = await api.get("/api/profiles", {
        params: {
          page,
          limit,

          ...Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== ""),
          ),
        },
        headers: {
          "X-API-Version": "1",
        },
      });

      const data = res?.data;

      setProfiles(data?.data ?? []);
      setPage(data?.page ?? 1);
      setNext(data?.links?.next ?? null);
      setPrev(data?.links?.prev ?? null);
    } catch (err) {
      console.error(err);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const goNext = () => next && setPage((prev) => prev + 1);
  const goPrev = () => prev && setPage((prev) => prev - 1);
  useEffect(() => {
    fetchProfiles();
  }, [limit, page]);

  const exportCSV = async () => {
    try {
      const res = await api.get("/api/profiles/export", {
        params: {
          format: "csv",
          page,
          limit,

          ...Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== ""),
          ),
        },
        headers: {
          "X-API-Version": "1",
        },
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `profiles_page_${page}_limit_${limit}.csv`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export failed:", err);
    }
  };

  return (
    <Protected>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Profiles</h1>
            <p className="text-gray-500 text-sm">
              Filter, paginate and export data
            </p>
          </div>

          <div className="flex gap-2">
            {/* LIMIT */}
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="border px-3 py-2 rounded-lg"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            {/* APPLY */}
            <button
              onClick={() => fetchProfiles()}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Apply
            </button>

            {/* CSV EXPORT */}
            <button
              onClick={exportCSV}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Export CSV
            </button>
            {/* CSV EXPORT */}
            <button
              onClick={() => {
                router.push("/profiles/create");
              }}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              +
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border rounded-xl bg-gray-80">
          <input
            placeholder="Gender"
            className="border p-2 rounded"
            onChange={(e) => updateFilter("gender", e.target.value)}
          />

          <input
            placeholder="Country ID"
            className="border p-2 rounded"
            onChange={(e) => updateFilter("country_id", e.target.value)}
          />

          <input
            placeholder="Age Group"
            className="border p-2 rounded"
            onChange={(e) => updateFilter("age_group", e.target.value)}
          />

          <input
            placeholder="Sort By"
            className="border p-2 rounded"
            onChange={(e) => updateFilter("sort_by", e.target.value)}
          />

          <input
            placeholder="Min Age"
            className="border p-2 rounded"
            onChange={(e) => updateFilter("min_age", e.target.value)}
          />

          <input
            placeholder="Max Age"
            className="border p-2 rounded"
            onChange={(e) => updateFilter("max_age", e.target.value)}
          />

          <select
            className="border p-2 rounded"
            onChange={(e) => updateFilter("order", e.target.value)}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* EMPTY */}
        {!loading && profiles.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No profiles found
          </div>
        )}

        {/* GRID */}
        {!loading && profiles.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {profiles.map((p) => (
              <div
                key={p.id}
                onClick={() => router.push(`/profiles/${p.id}`)}
                className="cursor-pointer border rounded-xl p-4 hover:shadow-lg transition bg-white"
              >
                <div className="flex justify-between">
                  <h2 className="font-semibold text-black">{p.name}</h2>

                  <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                    {p.gender}
                  </span>
                </div>

                <p className="text-sm mt-2 text-gray-600">{p.country_name}</p>

                <p className="text-sm text-black">
                  Confidence: {(p.gender_probability * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && profiles.length > 0 && (
          <div className="flex justify-between pt-6">
            <button
              onClick={goPrev}
              disabled={!prev}
              className="px-4 py-2 bg-gray-900 rounded disabled:opacity-40"
            >
              ⬅ Prev
            </button>

            <p>Page {page}</p>

            <button
              onClick={goNext}
              disabled={!next}
              className="px-4 py-2 bg-gray-900 rounded disabled:opacity-40"
            >
              Next ➡
            </button>
          </div>
        )}
      </div>
    </Protected>
  );
}
