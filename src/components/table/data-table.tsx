// "use client";

// import * as React from "react";
// import {
//   type ColumnDef,
//   type ColumnFiltersState,
//   type SortingState,
//   type VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
// } from "@tanstack/react-table";
// import { useReactTable } from "@tanstack/react-table";

// import { DataTablePagination } from "./data-table-pagination";
// import { DataTableToolbar } from "./data-table-toolbar";
// import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";

// interface FilterOption {
//   columnId: string;
//   title: string;
//   options: {
//     label: string;
//     value: string;
//     icon?: React.ComponentType<{ className?: string }>;
//   }[];
// }

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
//   filters?: FilterOption[];
//   pageIndex?: number;
//   pageSize?: number;
//   totalCount: number;
//   onPageChange?: (page: number) => void;
//   onPageSizeChange?: (size: number) => void;
// }

// export function DataTable<TData, TValue>({
//   columns,
//   data,
//   filters,
// }: DataTableProps<TData, TValue>) {
//   const [rowSelection, setRowSelection] = React.useState({});
//   const [columnVisibility, setColumnVisibility] =
//     React.useState<VisibilityState>({});
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//     [],
//   );
//   const [sorting, setSorting] = React.useState<SortingState>([]);

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       columnVisibility,
//       rowSelection,
//       columnFilters,
//     },
//     enableRowSelection: true,
//     onRowSelectionChange: setRowSelection,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//   });

//   return (
//     <div className="space-y-4">
//       <DataTableToolbar table={table} filters={filters} />
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   // <TableHead key={header.id} colSpan={header.colSpan}>
//                   //   {header.isPlaceholder
//                   //     ? null
//                   //     : flexRender(
//                   //         header.column.columnDef.header,
//                   //         header.getContext(),
//                   //       )}
//                   // </TableHead>
//                   <TableHead
//                     key={header.id}
//                     colSpan={header.colSpan}
//                     onClick={
//                       header.column.getCanSort()
//                         ? header.column.getToggleSortingHandler()
//                         : undefined
//                     }
//                     style={{
//                       cursor: header.column.getCanSort()
//                         ? "pointer"
//                         : "default",
//                       userSelect: "none",
//                     }}
//                   >
//                     {header.isPlaceholder ? null : (
//                       <span className="inline-flex items-center gap-1">
//                         {flexRender(
//                           header.column.columnDef.header,
//                           header.getContext(),
//                         )}
//                         {header.column.getCanSort() &&
//                           (header.column.getIsSorted() === "asc" ? (
//                             <ArrowUp className="text-primary h-4 w-4" />
//                           ) : header.column.getIsSorted() === "desc" ? (
//                             <ArrowDown className="text-primary h-4 w-4" />
//                           ) : (
//                             <ArrowUpDown className="text-muted-foreground h-4 w-4 opacity-50" />
//                           ))}
//                       </span>
//                     )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext(),
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <DataTablePagination table={table} />
//     </div>
//   );
// }



"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  // getPaginationRowModel, // <--- REMOVE THIS LINE for server-side pagination
  getSortedRowModel,
  type PaginationState, // Import PaginationState
  useReactTable,
} from "@tanstack/react-table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface FilterOption {
  columnId: string;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filters?: FilterOption[];
  pageIndex: number; // Required for controlled pagination
  pageSize: number; // Required for controlled pagination
  totalCount: number; // Total number of items from the server
  onPageChange: (page: number) => void; // Callback to update parent's pageIndex
  onPageSizeChange: (size: number) => void; // Callback to update parent's pageSize
  searchTerm?: string; // Search term for filtering
  onSearchChange?: (term: string) => void; // Search change handler
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filters,
  pageIndex, // Destructure pagination props
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  searchTerm,
  onSearchChange,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Controlled pagination state for react-table
  const paginationState: PaginationState = {
    pageIndex: pageIndex,
    pageSize: pageSize,
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: paginationState, // Link react-table's pagination to our external state
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    // --- Server-side Pagination Configuration ---
    manualPagination: true, // Crucial: Tells react-table that pagination is handled externally
    manualSorting: true, // Tells react-table that sorting is handled externally
    pageCount: Math.ceil(totalCount / pageSize), // Calculate total pages from server's totalCount
    onPaginationChange: (updater) => {
      // This updater can be a function or a new state object
      const newState =
        typeof updater === "function"
          ? updater(table.getState().pagination)
          : updater;

      // Only call parent callbacks if the state actually changed
      if (newState.pageIndex !== pageIndex) {
        onPageChange(newState.pageIndex);
      }
      if (newState.pageSize !== pageSize) {
        onPageSizeChange(newState.pageSize);
      }
    },
    // --- End Server-side Pagination Configuration ---
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 p-4">
        <DataTableToolbar 
          table={table} 
          filters={filters} 
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="rounded-md border mx-4">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <span className="inline-flex items-center gap-1">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex-shrink-0 p-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
