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


// // src/components/ProductForm.tsx
// import React, { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { productSchema, ProductFormValues } from '@/lib/schema';
// import { Product } from '@/lib/api'; // Import Product interface
// import { Button } from '@/components/ui/button'; // Assuming ShadCN Button
// import { Input } from '@/components/ui/input'; // Assuming ShadCN Input

// interface ProductFormProps {
//   onSubmit: (data: ProductFormValues) => void;
//   initialData?: Product; // Prop name changed to initialData
//   isSubmitting: boolean; // Prop name changed to isSubmitting
//   submitButtonText: string;
//   onCancel?: () => void;
// }

// const ProductForm: React.FC<ProductFormProps> = ({
//   onSubmit,
//   initialData,
//   isSubmitting,
//   submitButtonText,
//   onCancel,
// }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<ProductFormValues>({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       title: '',
//       description: '',
//       price: 0,
//       discountPercentage: 0,
//       rating: 0,
//       stock: 0,
//       brand: '',
//       category: '',
//       thumbnail: '',
//       images: [],
//     },
//   });

//   // Populate form with initial data when editing
//   useEffect(() => {
//     if (initialData) {
//       reset({
//         title: initialData.title,
//         description: initialData.description,
//         price: initialData.price,
//         // Ensure optional fields are handled correctly for reset
//         discountPercentage: initialData.discountPercentage ?? 0,
//         rating: initialData.rating ?? 0,
//         stock: initialData.stock ?? 0,
//         brand: initialData.brand ?? '',
//         category: initialData.category ?? '',
//         thumbnail: initialData.thumbnail ?? '',
//         images: initialData.images || [],
//       });
//     } else {
//       reset({
//         title: '',
//         description: '',
//         price: 0,
//         discountPercentage: 0,
//         rating: 0,
//         stock: 0,
//         brand: '',
//         category: '',
//         thumbnail: '',
//         images: [],
//       });
//     }
//   }, [initialData, reset]);

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
//       <div>
//         <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//         <Input
//           id="title"
//           {...register('title')}
//           className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//         />
//         {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
//       </div>

//       <div>
//         <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//         <textarea
//           id="description"
//           {...register('description')}
//           rows={4}
//           className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//         ></textarea>
//         {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
//           <Input
//             type="number"
//             id="price"
//             step="0.01"
//             {...register('price', { valueAsNumber: true })}
//             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//           />
//           {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
//         </div>

//         <div>
//           <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
//           <Input
//             type="number"
//             id="discountPercentage"
//             step="0.01"
//             {...register('discountPercentage', { valueAsNumber: true })}
//             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//           />
//           {errors.discountPercentage && <p className="mt-1 text-sm text-red-600">{errors.discountPercentage.message}</p>}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
//           <Input
//             type="number"
//             id="rating"
//             step="0.01"
//             {...register('rating', { valueAsNumber: true })}
//             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//           />
//           {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>}
//         </div>

//         <div>
//           <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
//           <Input
//             type="number"
//             id="stock"
//             step="1"
//             {...register('stock', { valueAsNumber: true })}
//             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//           />
//           {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
//           <Input
//             type="text"
//             id="brand"
//             {...register('brand')}
//             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//           />
//           {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>}
//         </div>

//         <div>
//           <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//           <Input
//             type="text"
//             id="category"
//             {...register('category')}
//             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//           />
//           {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
//         </div>
//       </div>

//       <div>
//         <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
//         <Input
//           type="text"
//           id="thumbnail"
//           {...register('thumbnail')}
//           className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//         />
//         {errors.thumbnail && <p className="mt-1 text-sm text-red-600">{errors.thumbnail.message}</p>}
//       </div>

//       <div>
//         <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma-separated)</label>
//         <textarea
//           id="images"
//           {...register('images', {
//             setValueAs: (value: string) => value.split(',').map((s: string) => s.trim()).filter(Boolean),
//           })}
//           rows={3}
//           placeholder="e.g., https://example.com/img1.jpg, https://example.com/img2.png"
//           className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//         ></textarea>
//         {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>}
//       </div>

//       <div className="flex justify-end space-x-3">
//         {onCancel && (
//           <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
//             Cancel
//           </Button>
//         )}
//         <Button type="submit" disabled={isSubmitting}>
//           {isSubmitting ? 'Saving...' : submitButtonText}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default ProductForm;
