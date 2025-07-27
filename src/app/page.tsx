"use client";

import React from "react";
import Navbar from "@/components/navbar";

export default function HomePage() {
  // Set document title for home page
  React.useEffect(() => {
    document.title = "MyShop – Your Online Store";
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = "MyShop";
    };
  }, []);

  return (
    <main className="min-h-screen overflow-auto">
      <Navbar />
    </main>
  );
}
