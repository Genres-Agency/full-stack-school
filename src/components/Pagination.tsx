"use client";

import { useRouter } from "next/navigation";

const Pagination = ({ page, count, perPage }: { page: number; count: number; perPage: number }) => {
  const router = useRouter();

  const hasPrev = perPage * (page - 1) > 0;
  const hasNext = perPage * (page - 1) + perPage < count;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    params.set("perPage", perPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  const changePerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(event.target.value, 10);
    const params = new URLSearchParams(window.location.search);
    params.set("perPage", newPerPage.toString());
    params.set("page", "1"); // Reset to first page when changing items per page
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
        disabled={!hasPrev}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => changePage(page - 1)}
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        {Array.from({ length: Math.ceil(count / perPage) }, (_, index) => {
          const pageIndex = index + 1;
          return (
            <button
              key={pageIndex}
              className={`px-2 rounded-sm ${page === pageIndex ? "bg-lamaSky" : ""}`}
              onClick={() => changePage(pageIndex)}
            >
              {pageIndex}
            </button>
          );
        })}
      </div>
      <button
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!hasNext}
        onClick={() => changePage(page + 1)}
      >
        Next
      </button>
      <select
        className="ml-4 p-2 border rounded-md"
        value={perPage}
        onChange={changePerPage}
      >
        {[10, 20, 50, 100].map((size) => (
          <option key={size} value={size}>
            Show {size}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Pagination;
