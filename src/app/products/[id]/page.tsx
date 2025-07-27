"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { getProductById, type Product } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/navbar";
import { ArrowLeft, ShoppingCart, Star, Package, Tag, Heart } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery<Product, Error>({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });

  // Set document title dynamically based on product data
  React.useEffect(() => {
    if (product) {
      document.title = `${product.title} – MyShop`;
    } else if (isLoading) {
      document.title = "Loading Product – MyShop";
    } else if (isError) {
      document.title = "Product Not Found – MyShop";
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = "MyShop";
    };
  }, [product, isLoading, isError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
        <span className="ml-2">Loading product details...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h1>
          <p className="text-gray-600 mb-4">{error?.message || "Failed to load product details"}</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Product Not Found</h1>
          <p className="text-gray-500 mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar - Fixed */}
      <div className="flex-shrink-0">
        <Navbar />
      </div>
      
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0 p-6 pb-4">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <Link href="/products" className="hover:text-foreground transition-colors">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">{product.title}</span>
        </nav>

        {/* Back Button */}
        <Button 
          onClick={() => router.back()} 
          variant="ghost" 
          className="hover:bg-accent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {/* Product Images */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                    }}
                  />
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      -{product.discountPercentage}% OFF
                    </div>
                  )}
                </div>
                
                {/* Additional Images */}
                {product.images && product.images.length > 0 && (
                  <div className="p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {product.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-50 border-2 border-transparent hover:border-primary transition-colors cursor-pointer">
                          <img
                            src={image}
                            alt={`${product.title} ${index + 1}`}
                            className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Title and Brand Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl sm:text-3xl xl:text-4xl font-bold text-foreground leading-tight">
                    {product.title}
                  </CardTitle>
                  {product.brand && (
                    <CardDescription className="text-base sm:text-lg flex items-center mt-3">
                      <Tag className="w-5 h-5 mr-2 text-primary" />
                      {product.brand}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>

              {/* Rating and Stock Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Rating */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-base sm:text-lg font-medium text-foreground">
                          {product.rating} out of 5
                        </span>
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-muted-foreground" />
                      <span className={`text-base sm:text-lg font-semibold ${
                        product.stock > 0 
                          ? product.stock > 10 
                            ? "text-green-600" 
                            : "text-yellow-600"
                          : "text-red-600"
                      }`}>
                        {product.stock > 0 
                          ? `${product.stock} in stock`
                          : "Out of stock"
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Card */}
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <span className="text-2xl sm:text-3xl xl:text-4xl font-bold text-foreground">
                        {formatPrice(discountedPrice)}
                      </span>
                      {product.discountPercentage > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-lg sm:text-xl xl:text-2xl text-muted-foreground line-through">
                            {formatPrice(product.price)}
                          </span>
                          <span className="bg-red-500 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full">
                            {product.discountPercentage}% OFF
                          </span>
                        </div>
                      )}
                    </div>
                    {product.discountPercentage > 0 && (
                      <p className="text-sm text-muted-foreground">
                        You save {formatPrice(product.price - discountedPrice)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Category and Description Card */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-lg sm:text-xl">Product Details</CardTitle>
                    {product.category && (
                      <span className="bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full font-medium w-fit">
                        {product.category}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3">Description</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                        {product.description || "No description available."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Button 
                      className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold" 
                      size="lg"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
                      {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button variant="outline" size="lg" className="h-10 sm:h-12">
                        Buy Now
                      </Button>
                      <Button variant="outline" size="lg" className="h-10 sm:h-12">
                        <Heart className="w-4 h-4 mr-2" />
                        Wishlist
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Product Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-muted-foreground font-medium text-sm sm:text-base">Product ID</span>
                        <span className="font-semibold text-sm sm:text-base">{product.id}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-muted-foreground font-medium text-sm sm:text-base">Brand</span>
                        <span className="font-semibold text-sm sm:text-base">{product.brand || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-muted-foreground font-medium text-sm sm:text-base">Category</span>
                        <span className="font-semibold text-sm sm:text-base">{product.category || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-muted-foreground font-medium text-sm sm:text-base">Rating</span>
                        <span className="font-semibold text-sm sm:text-base">{product.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
