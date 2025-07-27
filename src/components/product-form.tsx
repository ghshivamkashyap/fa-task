import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getProductById } from "@/lib/api";
import LoadingSpinner from "./LoadingSpinner";

// Updated schema to include requested fields: title, price, description, brand, thumbnail
export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  price: z.coerce.number().min(0.01, "Price must be a positive number"),
  description: z.string().min(10, "Description must be at least 10 characters long").optional(),
  brand: z.string().min(2, "Brand must be at least 2 characters long").optional(),
  thumbnail: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  productId?: number; // ID of product to edit
  initialValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  onCancel?: () => void; // Optional cancel callback
  loading?: boolean;
}

export function ProductForm({
  productId,
  initialValues,
  onSubmit,
  onCancel,
  loading,
}: ProductFormProps) {
  // Fetch product data if editing (productId provided)
  const {
    data: productData,
    isLoading: isProductLoading,
    error: productError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId!),
    enabled: !!productId, // Only fetch if productId is provided
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      price: 0,
      description: "",
      brand: "",
      thumbnail: "",
    },
  });

  // Reset form when productData changes (for editing)
  React.useEffect(() => {
    if (productData) {
      reset({
        title: productData.title || "",
        price: productData.price || 0,
        description: productData.description || "",
        brand: productData.brand || "",
        thumbnail: productData.thumbnail || "",
      });
    }
  }, [productData?.id]); // Only depend on product ID to avoid unnecessary resets

  // Reset form to empty state when not editing (for new products)
  React.useEffect(() => {
    if (!productId && !productData) {
      const defaultValues = {
        title: "",
        price: 0,
        description: "",
        brand: "",
        thumbnail: "",
        ...(initialValues ?? {}),
      };
      reset(defaultValues);
    }
  }, [productId, productData, JSON.stringify(initialValues ?? {})]);

  // Show loading spinner while fetching product data
  if (isProductLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
        <span className="ml-2">Loading product data...</span>
      </div>
    );
  }

  // Show error if failed to fetch product data
  if (productError) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Error loading product data</p>
        <p className="text-sm">{productError.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Title *</label>
          <Input 
            {...register("title")} 
            placeholder="Enter product title"
            className="h-11"
          />
          {errors.title && (
            <p className="mt-2 text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Price *</label>
          <Input 
            type="number" 
            step="0.01" 
            {...register("price")} 
            placeholder="0.00"
            className="h-11"
          />
          {errors.price && (
            <p className="mt-2 text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
          <Input 
            {...register("description")} 
            placeholder="Enter product description"
            className="h-11"
          />
          {errors.description && (
            <p className="mt-2 text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Brand</label>
          <Input 
            {...register("brand")} 
            placeholder="Enter brand name"
            className="h-11"
          />
          {errors.brand && (
            <p className="mt-2 text-sm text-destructive">{errors.brand.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Thumbnail URL</label>
          <Input 
            {...register("thumbnail")} 
            placeholder="https://example.com/image.jpg"
            className="h-11"
          />
          {errors.thumbnail && (
            <p className="mt-2 text-sm text-destructive">{errors.thumbnail.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
            className="h-11 px-6"
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading} className="flex-1 h-11 font-semibold">
          {loading ? "Saving..." : productId ? "Update Product" : "Save Product"}
        </Button>
      </div>
    </form>
  );
}
