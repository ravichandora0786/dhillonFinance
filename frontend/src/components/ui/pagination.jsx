import React from "react";

const CustomPagination = ({ pageIndex, pageSize, total, onPageChange }) => {
  if (!total || total <= pageSize) return null;

  const totalPages = Math.ceil(total / pageSize);
  const windowSize = 3; // aapne bola tha 3 chahiye

  let pages = [];

  // agar total pages chhote hain to sab dikhao
  if (totalPages <= windowSize) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    // Center current page in the window when possible
    const current = pageIndex + 1;
    let start = current - Math.floor(windowSize / 2);
    let end = start + windowSize - 1;

    // Adjust bounds
    if (start < 1) {
      start = 1;
      end = windowSize;
    }
    // We reserve the actual last page for the "last" button, so don't include it in the window
    if (end > totalPages - 1) {
      end = totalPages - 1;
      start = end - (windowSize - 1);
      if (start < 1) start = 1;
    }

    for (let i = start; i <= end; i++) pages.push(i);
  }

  const go = (p) => {
    // safety: clamp page index
    const newIndex = Math.max(0, Math.min(totalPages - 1, p));
    if (newIndex !== pageIndex) onPageChange(newIndex);
  };

  return (
    <div className="pagination-wrapper">
      <ul className="pagination-list">
        {/* Previous */}
        <li>
          <button
            className="pagination-btn"
            onClick={() => go(pageIndex - 1)}
            disabled={pageIndex === 0}
          >
            Previous
          </button>
        </li>

        {/* Page Numbers (window) */}
        {pages.map((page) => (
          <li key={page}>
            <button
              className={`${
                page - 1 === pageIndex
                  ? "pagination-btn-active"
                  : "pagination-btn-outline"
              }`}
              onClick={() => go(page - 1)}
            >
              {page}
            </button>
          </li>
        ))}

        {/* separator + Last Page (show only when we reserved a last button) */}
        {totalPages > windowSize && (
          <li className="flex items-end">
            <span className="border-b-2 border-dashed mb-1 mr-1 px-4 border-gray" />
            <button
              className={`${
                pageIndex === totalPages - 1
                  ? "pagination-btn-active"
                  : "pagination-btn-outline"
              }`}
              onClick={() => go(totalPages - 1)}
            >
              {totalPages}
            </button>
          </li>
        )}

        {/* Next */}
        <li>
          <button
            className="pagination-btn"
            onClick={() => go(pageIndex + 1)}
            disabled={pageIndex + 1 >= totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </div>
  );
};

export default CustomPagination;
