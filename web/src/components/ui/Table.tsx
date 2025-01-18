import React from 'react';
import { clsx } from 'clsx';

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (value: any, item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}

export function Table<T>({
  data,
  columns,
  isLoading,
  emptyState
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        {emptyState || <p className="text-gray-500">No data available</p>}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={clsx(
                    "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                    colIndex === 0 && "font-medium text-gray-900"
                  )}
                >
                  {column.cell
                    ? column.cell(item[column.accessorKey], item)
                    : item[column.accessorKey] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}