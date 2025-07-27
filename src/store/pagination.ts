import { create } from "zustand";

interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc' | null;
}

interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  has_next: boolean;
  total_count: number;
}

interface PaginationStore {
  pagination: PaginationProps;
  sortConfig: SortConfig;
  setPagination: (pagination: PaginationProps) => void;
  setPerPage: (perPage: number) => void;
  setPage: (page: number) => void;
  setHasNext: (hasNext: boolean) => void;
  setTotalCount: (totalCount: number) => void;
  setTotalNext: (hasNext: boolean, totalCount: number) => void;
  setSortConfig: (sortConfig: SortConfig) => void;
  toggleSort: (key: string) => void;
  resetPagination: () => void;
}

export const usePaginationStore = create<PaginationStore>((set) => ({
  pagination: { pageIndex: 0, pageSize: 10, has_next: false, total_count: 0 },
  sortConfig: { key: null, direction: null },
  setPagination: (pagination: PaginationProps) => set({ pagination }),
  setPerPage: (perPage: number) =>
    set((state) => ({
      pagination: { ...state.pagination, pageSize: perPage },
    })),
  setPage: (page: number) =>
    set((state) => ({
      pagination: { ...state.pagination, pageIndex: page },
    })),
  setHasNext: (hasNext: boolean) =>
    set((state) => ({
      pagination: { ...state.pagination, has_next: hasNext },
    })),
  setTotalCount: (totalCount: number) =>
    set((state) => ({
      pagination: { ...state.pagination, total_count: totalCount },
    })),
  setTotalNext: (hasNext: boolean, totalCount: number) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        has_next: hasNext,
        total_count: totalCount,
      },
    })),
  setSortConfig: (sortConfig: SortConfig) => set({ sortConfig }),
  toggleSort: (key: string) =>
    set((state) => {
      if (state.sortConfig.key === key) {
        // Same key: toggle direction or reset
        if (state.sortConfig.direction === 'asc') {
          return { sortConfig: { key, direction: 'desc' } };
        } else if (state.sortConfig.direction === 'desc') {
          return { sortConfig: { key: null, direction: null } };
        } else {
          return { sortConfig: { key, direction: 'asc' } };
        }
      } else {
        // Different key: start with ascending
        return { sortConfig: { key, direction: 'asc' } };
      }
    }),
  resetPagination: () =>
    set(() => ({
      pagination: {
        pageIndex: 0,
        pageSize: 10,
        has_next: false,
        total_count: 0,
      },
      sortConfig: { key: null, direction: null },
    })),
}));
