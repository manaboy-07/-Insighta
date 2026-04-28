export default function UnauthorizedPage() {
  return (
    <div className="h-screen flex items-center justify-center flex-col text-center">
      <h1 className="text-4xl font-bold text-red-500">403 - Unauthorized</h1>

      <p className="mt-2 text-gray-600">
        You do not have permission to access this page.
      </p>

      <a
        href="/dashboard"
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        Go back
      </a>
    </div>
  );
}
