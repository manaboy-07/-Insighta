"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function Protected({ children }: any) {
  const router = useRouter();

  useEffect(() => {
    api.get("/auth/me").catch(() => {
      router.push("/login");
    });
  }, []);

  return children;
}
