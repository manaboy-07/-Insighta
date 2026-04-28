"use client";

export default function Error({ error }: any) {
  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}
