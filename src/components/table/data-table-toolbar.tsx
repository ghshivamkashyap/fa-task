"use client"

import { type Table } from "@tanstack/react-table"
import { X, Search, Filter } from "lucide-react"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

interface FilterOption {
  columnId: string;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters?: FilterOption[];
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  filters: _filters = [],
  searchTerm,
  onSearchChange,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || (searchTerm && searchTerm.length > 0);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by title or brand..."
            value={searchTerm ?? ""}
            onChange={(event) => onSearchChange?.(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px] pl-8 cursor-text"
          />
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              onSearchChange?.("");
            }}
            className="h-8 px-2 lg:px-3 cursor-pointer hover:bg-accent"
          >
            Reset
            <X className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Filter className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">Filters & View</span>
        </div>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
