"use client";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-600">
          {searchParams && typeof searchParams === 'object' && 'error' in searchParams ? String(searchParams.error) : "An error occurred during authentication"}
        </p>
      </div>
    </div>
  );
}
