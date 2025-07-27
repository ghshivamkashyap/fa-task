import React from "react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Card } from "./ui/card";
import { ShoppingBag, Package } from "lucide-react";

export default function Navbar() {
  return (
    <Card className="rounded-none border-x-0 border-t-0 shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <ShoppingBag className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">MyShop</h1>
              <p className="text-sm text-muted-foreground">Your Online Store</p>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              href="/products" 
              className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </Card>
  );
}
