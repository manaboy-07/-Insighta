"use client";
import { baseURL } from "@/app/utils/baseUrl";

export default function LoginPage() {
  const login = () => {
    window.location.href = `${baseURL}/auth/github`;
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={login}
        className="px-6 pointer py-3 bg-black text-white rounded"
      >
        Login with github
      </button>
    </div>
  );
}
