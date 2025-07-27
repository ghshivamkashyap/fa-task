"use client";

import React from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/table/data-table";
import { usePaginationStore } from "@/store/pagination";
import { sortProducts } from "@/lib/utils";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  type ProductsResponse,
  type Product,
} from "@/lib/api";
import { ProductForm, type ProductFormValues } from "@/components/product-form";
import Modal from "@/components/Modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Eye, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { useDebounce } from "@/hooks/useDebounce";
import { ProductTableSkeleton } from "@/components/ProductTableSkeleton";

// const columns = [
//   { accessorKey: "id", header: "ID" },
//   { accessorKey: "title", header: "Title", enableSorting: true },
//   { accessorKey: "price", header: "Price", enableSorting: true },
//   { accessorKey: "rating", header: "Rating", enableSorting: true },
//   { accessorKey: "brand", header: "Brand" },
  
// ];

export default function ProductsPage() {
  
  const { pagination, sortConfig, setPage, setPerPage, setTotalCount, toggleSort } =
    usePaginationStore();
  const queryClient = useQueryClient();

  const [open, setOpen] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState<Product | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(null);
  
  // Search functionality
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Set document title for products listing page
  React.useEffect(() => {
    document.title = "All Products – MyShop";
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = "MyShop";
    };
  }, []);

  const {
    data: productsResponse,
    isLoading,
    isError,
    error,
  } = useQuery<ProductsResponse, Error>({
    queryKey: ["products", pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      const skip = pagination.pageIndex * pagination.pageSize;
      const limit = pagination.pageSize;
      const res = await getProducts(limit, skip);
      setTotalCount(res.total);
      return res;
    },
    placeholderData: (previousData) => previousData,
  });

  // Mutations with optimistic updates
  const addMutation = useMutation({
    mutationFn: addProduct,
    onMutate: async (newProductData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData<ProductsResponse>(["products", pagination.pageIndex, pagination.pageSize]);

      // Create optimistic product with temporary ID
      const optimisticProduct: Product = {
        id: Date.now(), // Temporary ID
        title: newProductData.title,
        price: newProductData.price,
        description: newProductData.description ?? "",
        brand: newProductData.brand ?? "",
        thumbnail: newProductData.thumbnail ?? "",
        discountPercentage: newProductData.discountPercentage ?? 0,
        rating: newProductData.rating ?? 0,
        stock: newProductData.stock ?? 0,
        category: newProductData.category ?? "",
        images: newProductData.images ?? [],
      };

      // Optimistically update the cache
      if (previousProducts) {
        const updatedProducts = [optimisticProduct, ...previousProducts.products];
        
        // If we're adding to a full page, we might need to remove the last item
        // to maintain consistent page size
        const finalProducts = updatedProducts.length > pagination.pageSize 
          ? updatedProducts.slice(0, pagination.pageSize)
          : updatedProducts;

        queryClient.setQueryData<ProductsResponse>(
          ["products", pagination.pageIndex, pagination.pageSize],
          {
            ...previousProducts,
            products: finalProducts,
            total: previousProducts.total + 1,
          }
        );
      }

      return { previousProducts, optimisticProduct };
    },
    onSuccess: (actualProduct, variables, context) => {
      // Replace the optimistic product with the actual one from the API
      const currentData = queryClient.getQueryData<ProductsResponse>(["products", pagination.pageIndex, pagination.pageSize]);
      
      if (currentData && context?.optimisticProduct) {
        queryClient.setQueryData<ProductsResponse>(
          ["products", pagination.pageIndex, pagination.pageSize],
          {
            ...currentData,
            products: currentData.products.map(product => 
              product.id === context.optimisticProduct.id ? actualProduct : product
            ),
          }
        );
      }

      // Also update individual product cache
      queryClient.setQueryData(["product", actualProduct.id], actualProduct);
      
      setOpen(false);
    },
    onError: (error, variables, context) => {
      // Rollback to previous state
      if (context?.previousProducts) {
        queryClient.setQueryData(
          ["products", pagination.pageIndex, pagination.pageSize],
          context.previousProducts
        );
      }
      console.error("Add product failed:", error);
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      updateProduct(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData<ProductsResponse>(["products", pagination.pageIndex, pagination.pageSize]);

      // Optimistically update the cache
      if (previousProducts) {
        queryClient.setQueryData<ProductsResponse>(
          ["products", pagination.pageIndex, pagination.pageSize],
          {
            ...previousProducts,
            products: previousProducts.products.map(product =>
              product.id === id ? { ...product, ...data } : product
            ),
          }
        );
      }

      return { previousProducts };
    },
    onSuccess: (updatedProduct) => {
      // Update with actual product data from API response
      const currentData = queryClient.getQueryData<ProductsResponse>(["products", pagination.pageIndex, pagination.pageSize]);
      
      if (currentData) {
        queryClient.setQueryData<ProductsResponse>(
          ["products", pagination.pageIndex, pagination.pageSize],
          {
            ...currentData,
            products: currentData.products.map(product =>
              product.id === updatedProduct.id ? updatedProduct : product
            ),
          }
        );
      }

      // Also update individual product cache
      queryClient.setQueryData(["product", updatedProduct.id], updatedProduct);

      setOpen(false);
      setEditProduct(null);
    },
    onError: (error, variables, context) => {
      // Rollback to previous state
      if (context?.previousProducts) {
        queryClient.setQueryData(
          ["products", pagination.pageIndex, pagination.pageSize],
          context.previousProducts
        );
      }
      console.error("Edit product failed:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData<ProductsResponse>(["products", pagination.pageIndex, pagination.pageSize]);

      // Optimistically update the cache by removing the deleted product
      if (previousProducts) {
        queryClient.setQueryData<ProductsResponse>(
          ["products", pagination.pageIndex, pagination.pageSize],
          {
            ...previousProducts,
            products: previousProducts.products.filter(product => product.id !== deletedId),
            total: previousProducts.total - 1,
          }
        );
      }

      // Return a context object with the snapshotted value
      return { previousProducts };
    },
    onSuccess: (deletedProduct, deletedId) => {
      // Keep the optimistic update, no need to refetch
      // Also remove from individual product cache
      queryClient.removeQueries({ queryKey: ["product", deletedId] });
      
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    },
    onError: (error, deletedId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProducts) {
        queryClient.setQueryData(
          ["products", pagination.pageIndex, pagination.pageSize],
          context.previousProducts
        );
      }
      console.error("Delete failed:", error);
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    },
  });

  // Handle delete confirmation
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.id);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setProductToDelete(null);
  };

  // Sort and filter the products data on the client side
  const sortedAndFilteredProducts = React.useMemo(() => {
    const products = productsResponse?.products ?? [];
    
    // First, filter by search term (title or brand)
    const filteredProducts = debouncedSearchTerm
      ? products.filter(product => 
          product.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (product.brand?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
        )
      : products;
    
    // Then sort the filtered results
    return sortProducts(filteredProducts, sortConfig.key, sortConfig.direction);
  }, [productsResponse?.products, sortConfig.key, sortConfig.direction, debouncedSearchTerm]);

  // Early returns after all hooks
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen max-w-7xl mx-auto">
        {/* Navbar - Fixed */}
        <div className="flex-shrink-0">
          <Navbar />
        </div>
        
        {/* Header Card - Fixed */}
        <Card className="m-6 mb-4 flex-shrink-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold">Products</CardTitle>
                <CardDescription className="text-lg mt-2">
                  Manage your product catalog with ease
                </CardDescription>
              </div>
              <Button size="lg" className="gap-2 px-6" disabled>
                <Plus className="h-5 w-5" /> Add Product
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Skeleton Loader */}
        <Card className="mx-6 mb-6 flex-1 flex flex-col overflow-hidden">
          <CardContent className="p-4 flex-1">
            <ProductTableSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isError) return <div>Error loading products: {error.message}</div>;

  // Columns with actions
  const columns = [
    { accessorKey: "id", header: "ID" },
    { 
      accessorKey: "title", 
      header: ({ column: _column }: { column: unknown }) => (
        <button
          className="flex items-center gap-1 hover:text-primary cursor-pointer hover:bg-accent px-2 py-1 rounded transition-colors"
          onClick={() => toggleSort('title')}
          title="Click to sort by title"
        >
          Title
          {sortConfig.key === 'title' ? (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4" /> : 
              <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
        </button>
      ),
      cell: ({ row }: { row: { original: Product } }) => (
        <Link 
          href={`/products/${row.original.id}`}
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
          {row.original.title}
        </Link>
      ),
      enableSorting: true 
    },
    { 
      accessorKey: "price", 
      header: ({ column: _column }: { column: unknown }) => (
        <button
          className="flex items-center gap-1 hover:text-primary cursor-pointer hover:bg-accent px-2 py-1 rounded transition-colors"
          onClick={() => toggleSort('price')}
          title="Click to sort by price"
        >
          Price
          {sortConfig.key === 'price' ? (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4" /> : 
              <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
        </button>
      ),
      enableSorting: true 
    },
    { 
      accessorKey: "rating", 
      header: ({ column: _column }: { column: unknown }) => (
        <button
          className="flex items-center gap-1 hover:text-primary cursor-pointer hover:bg-accent px-2 py-1 rounded transition-colors"
          onClick={() => toggleSort('rating')}
          title="Click to sort by rating"
        >
          Rating
          {sortConfig.key === 'rating' ? (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4" /> : 
              <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
        </button>
      ),
      enableSorting: true 
    },
    { accessorKey: "brand", header: "Brand" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Product } }) => (
        <div className="flex gap-2">
          <Link href={`/products/${row.original.id}`}>
            <Button
              size="icon"
              variant="ghost"
              title="View Details"
            >
              <Eye className="h-4 w-4 text-blue-500" />
              <span className="sr-only">View Details</span>
            </Button>
          </Link>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setEditProduct(row.original);
              setOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleDeleteClick(row.original)}
            disabled={deleteMutation.status === "pending"}
            className={deleteMutation.status === "pending" ? "opacity-50" : ""}
          >
            <Trash2 className={`h-4 w-4 text-red-500 ${deleteMutation.status === "pending" && productToDelete?.id === row.original.id ? "animate-pulse" : ""}`} />
            <span className="sr-only">
              {deleteMutation.status === "pending" && productToDelete?.id === row.original.id ? "Deleting..." : "Delete"}
            </span>
          </Button>
        </div>
      ),
    },
  ];




  // Handle form submit
  const handleFormSubmit = (
    values: ProductFormValues,
  ) => {
    if (editProduct) {
      editMutation.mutate({ id: editProduct.id, data: values });
    } else {
      // Create new product with form values and default values for API compatibility
      addMutation.mutate({
        title: values.title,
        price: values.price,
        description: values.description ?? "",
        brand: values.brand ?? "",
        thumbnail: values.thumbnail ?? "",
        // Default values for required API fields
        discountPercentage: 0,
        rating: 0,
        stock: 0,
        category: "",
        images: [],
      });
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-7xl mx-auto">
      {/* Navbar - Fixed */}
      <div className="flex-shrink-0">
        <Navbar />
      </div>
      
      {/* Header Card - Fixed */}
      <Card className="m-6 mb-4 flex-shrink-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">Products</CardTitle>
              <CardDescription className="text-lg mt-2">
                Manage your product catalog with ease
                {debouncedSearchTerm && (
                  <span className="block text-sm text-muted-foreground mt-1">
                    Found {sortedAndFilteredProducts.length} results for &quot;{debouncedSearchTerm}&quot;
                  </span>
                )}
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditProduct(null);
                    setOpen(true);
                  }}
                  size="lg"
                  className="gap-2 px-6"
                >
                  <Plus className="h-5 w-5" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-foreground">
                    {editProduct ? "Edit Product" : "Add New Product"}
                  </DialogTitle>
                </DialogHeader>
                <div className="py-6">
                  <ProductForm
                    productId={editProduct?.id} // Pass product ID for fetching data
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                      setOpen(false);
                      setEditProduct(null);
                    }}
                    loading={
                      addMutation.status === "pending" ||
                      editMutation.status === "pending"
                    }
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Data Table Card - Scrollable */}
      <Card className="mx-6 mb-6 flex-1 flex flex-col overflow-hidden">
        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <DataTable
              columns={columns}
              data={sortedAndFilteredProducts}
              pageIndex={pagination.pageIndex}
              pageSize={pagination.pageSize}
              totalCount={debouncedSearchTerm ? sortedAndFilteredProducts.length : (productsResponse?.total ?? 0)}
              onPageChange={(page) => setPage(page)}
              onPageSizeChange={(size) => setPerPage(size)}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirm Delete"
        confirmText="Delete"
        cancelText="Cancel"
        isConfirmDisabled={deleteMutation.status === "pending"}
      >
        <p>
          Are you sure you want to delete <strong>{productToDelete?.title}</strong>?
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This action cannot be undone.
        </p>
        {deleteMutation.status === "pending" && (
          <p className="text-sm text-primary mt-2">Deleting...</p>
        )}
      </Modal>
    </div>
  );
}


