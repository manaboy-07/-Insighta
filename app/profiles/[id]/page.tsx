"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    api
      .get(`/api/profiles/${id}`, {
        headers: { "X-API-Version": "1" },
      })
      .then((res) => setProfile(res.data.data));
  }, [id]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1>{profile.name}</h1>
      <p>Gender: {profile.gender}</p>
      <p>Age: {profile.age}</p>
      <p>Country: {profile.country_name}</p>
    </div>
  );
}
