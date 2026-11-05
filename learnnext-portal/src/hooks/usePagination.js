import { useEffect, useMemo, useState } from 'react';

/**
 * Client-side pagination over an array.
 * const { pageItems, page, setPage, pageSize, setPageSize, total, pageCount } = usePagination(rows, 10);
 */
export function usePagination(items = [], initialPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  return {
    page,
    setPage,
    pageSize,
    setPageSize: (s) => {
      setPageSize(s);
      setPage(1);
    },
    total,
    pageCount,
    pageItems,
  };
}
