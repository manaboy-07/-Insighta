"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Profile = {
  id: string;
  name: string;
  gender: string;
  gender_probability: number;
  age: number;
  age_group: string;
  country_name: string;
  createdAt: string;
};

export default function SearchPage() {
  // =====================
  // STATE (SAFE INITIALS)
  // =====================
  const [data, setData] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [next, setNext] = useState<string | null>(null);
  const [prev, setPrev] = useState<string | null>(null);

  // =====================
  // FETCH FUNCTION
  // =====================
  const fetchData = async (pageNum = 1) => {
    setLoading(true);
    setHasSearched(true);

    try {
      const res = await api.get("/api/profiles/search", {
        params: {
          q: query,
          page: pageNum,
          limit,
        },
        headers: {
          "X-API-Version": "1",
        },
      });

      const payload = res?.data;

      // 🛡 SAFE GUARDS (CRASH PROOF)
      setData(payload?.data ?? []);
      setPage(payload?.page ?? 1);
      setTotalPages(payload?.total_pages ?? 1);

      setNext(payload?.links?.next ?? null);
      setPrev(payload?.links?.prev ?? null);
    } catch (err) {
      console.error("API ERROR:", err);

      // fallback safe state
      setData([]);
      setNext(null);
      setPrev(null);
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    fetchData(1);
  }, []);

  // =====================
  // HANDLERS
  // =====================
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(1);
  };

  const goNext = () => {
    if (!next) return;
    fetchData(page + 1);
  };

  const goPrev = () => {
    if (!prev) return;
    fetchData(page - 1);
  };

  // =====================
  // UI
  // =====================
  return (
    <div className="space-y-6">
      {/* SEARCH + FILTERS */}
      <form
        onSubmit={handleSearch}
        className="flex flex-wrap gap-2 items-center"
      >
        {/* SEARCH INPUT */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search profiles..."
          className="flex-1 min-w-200px px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* LIMIT */}
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="px-3 py-2 border rounded-lg"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>

        {/* BUTTON */}
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Search
        </button>
      </form>

      {/* LOADER */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-500 mt-3">Loading profiles...</p>
        </div>
      )}

      {/* BEFORE SEARCH */}
      {!loading && !hasSearched && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium">Start searching profiles</p>
          <p className="text-sm">Use the filters above</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && hasSearched && (data?.length ?? 0) === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium">No profiles found</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}

      {/* TABLE */}
      {!loading && (data?.length ?? 0) > 0 && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Age Group</th>
                <th>Country</th>
                <th>Confidence</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {(data ?? []).map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-500">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td>{p.gender}</td>
                  <td>{p.age}</td>
                  <td>{p.age_group}</td>
                  <td>{p.country_name}</td>
                  <td>{(p.gender_probability * 100).toFixed(1)}%</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {!loading && (data?.length ?? 0) > 0 && (
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={goPrev}
            disabled={!prev}
            className="px-4 py-2 text-black bg-gray-200 rounded disabled:opacity-40"
          >
            ⬅ Previous
          </button>

          <p className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </p>

          <button
            onClick={goNext}
            disabled={!next}
            className="px-4 py-2 text-black bg-gray-200 rounded disabled:opacity-40"
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
}
