"use client";
import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const DataTableComponent = ({
  columns,
  data,
  pagination,
  setPagination,
  totalRows,
  columnVisibility,
  setColumnVisibility,
}) => {
  const defaultData = React.useMemo(() => [], []);

  const table = useReactTable({
    data: data ?? defaultData,
    columns,
    rowCount: totalRows,
    state: {
      pagination,
      columnVisibility,
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      setPagination(newPagination);
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    debugTable: true,
  });

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="table-base">
          <thead className="table-head">
            {table.getHeaderGroups()?.map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers?.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="table-head-cell"
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel()?.rows?.map((row) => (
              <tr key={row.id} className="table-row">
                {row.getVisibleCells()?.map((cell) => (
                  <td key={cell.id} className="table-cell">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalRows > 10 && (
        <div className="pagination-wrapper">
          <ul className="pagination-list">
            <li>
              <button
                className="pagination-btn"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </button>
            </li>

            {table.getCanPreviousPage() && (
              <li>
                <button
                  className="pagination-btn-outline"
                  onClick={() =>
                    table.setPageIndex(
                      table.getState().pagination.pageIndex - 1
                    )
                  }
                >
                  {table.getState().pagination.pageIndex}
                </button>
              </li>
            )}

            <li>
              <button className="pagination-btn-active">
                {table.getState().pagination.pageIndex + 1}
              </button>
            </li>

            {table.getCanNextPage() && (
              <li>
                <button
                  className="pagination-btn-outline"
                  onClick={() =>
                    table.setPageIndex(
                      table.getState().pagination.pageIndex + 1
                    )
                  }
                >
                  {table.getState().pagination.pageIndex + 2}
                </button>
              </li>
            )}

            <li>
              <button
                className="pagination-btn"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DataTableComponent;
