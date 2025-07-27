// src/lib/schemas.ts
import { z } from 'zod';

// Zod schema for product creation/update
export const productSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }).optional().or(z.literal('')),
  price: z.number().min(0.01, { message: 'Price must be a positive number.' }),
  discountPercentage: z.number().min(0).max(100, { message: 'Discount percentage must be between 0 and 100.' }).optional(),
  rating: z.number().min(0).max(5, { message: 'Rating must be between 0 and 5.' }).optional(),
  stock: z.number().int().min(0, { message: 'Stock must be a non-negative integer.' }).optional(),
  brand: z.string().min(2, { message: 'Brand must be at least 2 characters long.' }).optional().or(z.literal('')),
  category: z.string().min(2, { message: 'Category must be at least 2 characters long.' }).optional().or(z.literal('')),
  thumbnail: z.string().url({ message: 'Thumbnail must be a valid URL.' }).optional().or(z.literal('')), // Allow empty string for optional URL
  images: z.array(z.string().url({ message: 'Each image must be a valid URL.' })).optional(),
});

// Infer the type from the schema for convenience
export type ProductFormValues = z.infer<typeof productSchema>;
