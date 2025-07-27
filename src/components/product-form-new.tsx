import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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
  initialValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  loading?: boolean;
}

export function ProductForm({
  initialValues = {},
  onSubmit,
  loading,
}: ProductFormProps) {
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
      ...initialValues,
    },
  });

  React.useEffect(() => {
    reset({
      title: "",
      price: 0,
      description: "",
      brand: "",
      thumbnail: "",
      ...initialValues,
    });
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Title *</label>
        <Input {...register("title")} placeholder="Enter product title" />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Price *</label>
        <Input 
          type="number" 
          step="0.01" 
          {...register("price")} 
          placeholder="0.00"
        />
        {errors.price && (
          <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <Input 
          {...register("description")} 
          placeholder="Enter product description"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Brand</label>
        <Input 
          {...register("brand")} 
          placeholder="Enter brand name"
        />
        {errors.brand && (
          <p className="mt-1 text-xs text-red-500">{errors.brand.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Thumbnail URL</label>
        <Input 
          {...register("thumbnail")} 
          placeholder="https://example.com/image.jpg"
        />
        {errors.thumbnail && (
          <p className="mt-1 text-xs text-red-500">{errors.thumbnail.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </form>
  );
}
