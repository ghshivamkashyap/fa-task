// src/lib/api.ts
// This file defines the data structures and specific API functions for DummyJSON,
// using your configured 'api' instance from src/api/index.ts.

import api from "@/api"; // <-- This imports your configured Axios instance from src/api/index.ts

// Interface for a single product
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

// Interface for the products list response from the API
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Interface for a new product to be added (excluding ID)
export type NewProduct = {
  title: string;
  price: number;
  description?: string;
  brand?: string;
  thumbnail?: string;
  // Optional fields with defaults for API compatibility
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  category?: string;
  images?: string[];
};

/**
 * Fetches a list of products from the API.
 * @param limit - The number of products to fetch.
 * @param skip - The number of products to skip.
 * @returns A promise that resolves to ProductsResponse.
 */
export const getProducts = async (limit = 1000, skip = 0): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>(`/products`, { 
    params: { limit, skip },
  });
  return response.data;
};

/**
 * Fetches a single product by its ID.
 * @param id - The ID of the product.
 * @returns A promise that resolves to a Product.
 */
export const getProductById = async (id: string | number): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`); // <-- Using your 'api' instance here
  return response.data;
};

/**
 * Adds a new product to the API.
 * @param productData - The data for the new product.
 * @returns A promise that resolves to the added Product (with ID).
 */
export const addProduct = async (productData: NewProduct): Promise<Product> => {
  const response = await api.post<Product>(`/products/add`, JSON.stringify(productData), { // <-- Using your 'api' instance here
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

/**
 * Updates an existing product by its ID.
 * @param id - The ID of the product to update.
 * @param productData - The updated data for the product.
 * @returns A promise that resolves to the updated Product.
 */
export const updateProduct = async (id: number, productData: Partial<Product>): Promise<Product> => {
  const response = await api.put<Product>(`/products/${id}`, JSON.stringify(productData), { // <-- Using your 'api' instance here
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

/**
 * Deletes a product by its ID.
 * @param id - The ID of the product to delete.
 * @returns A promise that resolves to the deleted Product (often includes isDeleted: true).
 */
export const deleteProduct = async (id: number): Promise<Product> => {
  const response = await api.delete<Product>(`/products/${id}`);
  return response.data;
};
