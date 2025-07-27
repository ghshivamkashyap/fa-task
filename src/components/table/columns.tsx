// src/components/table/columns.tsx
import React from "react";
import { type ColumnDef } from "@tanstack/react-table"; // Use TanStack's ColumnDef
import { type Product } from "@/lib/api"; // Import Product interface
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming ShadCN Button component
import { ArrowUpDown } from "lucide-react"; // For sort icon

// Define the columns for the Product table
export const productColumns = (
  onEdit: (product: Product) => void,
  onDelete: (id: number) => void,
  handleSort: (columnId: keyof Product) => void, // New prop for sorting handler
  _sortBy: keyof Product | null, // Current sort column
  _sortOrder: "asc" | "desc", // Current sort order
): ColumnDef<Product>[] => [
  {
    accessorKey: "id",
    header: ({ column: _column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => handleSort("id")} // Use the passed handleSort
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true, // Enable sorting for this column
  },
  {
    accessorKey: "title",
    header: ({ column: _column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => handleSort("title")} // Use the passed handleSort
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true, // Enable sorting for this column
    cell: ({ row }) => (
      <Link
        href={`/products/${row.original.id}`}
        className="text-blue-600 hover:underline"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "brand",
    header: "Brand",
    enableSorting: true, // Enable sorting for this column
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: ({ column: _column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => handleSort("price")} // Use the passed handleSort
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true, // Enable sorting for this column
    cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
  },
  {
    accessorKey: "rating",
    header: ({ column: _column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => handleSort("rating")} // Use the passed handleSort
        >
          Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true, // Enable sorting for this column
    cell: ({ row }) => row.original.rating.toFixed(2),
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => (
      <img
        src={row.original.thumbnail}
        alt={row.original.title}
        className="h-16 w-16 rounded-md object-cover"
        onError={(e) => {
          e.currentTarget.src = `https://placehold.co/64x64/E0E0E0/6C757D?text=No+Image`;
          e.currentTarget.onerror = null; // Prevent infinite loop if placeholder also fails
        }}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click navigation
            onEdit(row.original);
          }}
          className="rounded-md bg-yellow-500 px-3 py-1 text-sm text-white transition-colors hover:bg-yellow-600"
        >
          Edit
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click navigation
            onDelete(row.original.id);
          }}
          className="rounded-md bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700"
        >
          Delete
        </Button>
      </div>
    ),
  },
];
