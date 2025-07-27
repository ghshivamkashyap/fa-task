# 🚀 Enhanced Product Management System

## Overview

A modern, feature-rich product management application built with **Next.js 15**, **TanStack Query**, and **shadcn/ui**. This application provides a comprehensive solution for managing product catalogs with advanced features like optimistic updates, debounced search, skeleton loading, and responsive design.

🌐 **Live Demo**: [http://localhost:3001/products](http://localhost:3001/products)

---

## ✨ Key Features

### 🎯 **Core Functionality**
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete products
- ✅ **Server-Side Pagination** - Efficient data loading with TanStack Table
- ✅ **Multi-Column Sorting** - Sort by title, price, rating with visual indicators
- ✅ **Dynamic Routing** - Individual product detail pages
- ✅ **Form Validation** - Zod schema validation with React Hook Form

### ⚡ **Advanced Features**
- ✅ **Optimistic Updates** - Instant UI updates for all CRUD operations
- ✅ **Debounced Search** - 300ms debounced client-side search by title/brand
- ✅ **Skeleton Loading** - Professional loading states with shimmer animations
- ✅ **Responsive Design** - Mobile-first approach with Tailwind CSS
- ✅ **Enhanced UX** - Icons, hover effects, and smooth transitions

### 🎨 **UI/UX Enhancements**
- ✅ **shadcn/ui Components** - Professional design system
- ✅ **Dark/Light Theme** - System-aware theme switching
- ✅ **Scrollable Layouts** - Container-level scrolling for better UX
- ✅ **Filter Indicators** - Visual feedback for all interactive elements
- ✅ **Loading States** - Comprehensive skeleton UI during data fetching

---

## 🛠 Tech Stack

### **Frontend**
- **Next.js 15.4.4** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library

### **State Management**
- **TanStack Query** - Server state management
- **Zustand** - Client state management (pagination)

### **Form & Validation**
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **@hookform/resolvers** - Form validation integration

### **Data Fetching**
- **Axios** - HTTP client
- **DummyJSON API** - Mock product data

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm/yarn/pnpm

### **Installation**

```bash
# Clone the repository
git clone <repository-url>
cd fe-task

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── products/          # Products routes
│       ├── page.tsx       # Products listing
│       └── [id]/          # Dynamic product detail
│           └── page.tsx   # Individual product page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── table/            # Data table components
│   ├── product-form.tsx  # Product form component
│   ├── Modal.tsx         # Modal component
│   └── LoadingSpinner.tsx # Loading component
├── lib/                  # Utilities
│   ├── api.ts           # API functions
│   ├── utils.ts         # Helper utilities
│   └── schema.ts        # Zod schemas
├── hooks/               # Custom hooks
│   └── useDebounce.ts   # Debounce hook
└── store/               # State management
    └── pagination.ts    # Pagination store
```

---

## Requirements

### 1. Data Table Integration

- Fetch product data from `https://dummyjson.com/products` using **TanStack Query**.
- Display the data in the existing table (data-table) component.

### 2. Pagination

- Implement pagination using the API's `limit` and `skip` query parameters.
- Allow users to navigate through different pages of products.

### 3. Sorting

- Enable sorting of products on the table based on fields like `title`, `price`, and `rating`.
- Implement both ascending and descending order sorting.

### 4. CRUD Functionality

- **Add Product**:

  - Create a form to add a new product.
  - Use **Zod** with `react-hook-form` for form validation.
  - Send a POST request to `https://dummyjson.com/products/add`.
  - Upon successful addition, update the TanStack Query's cache to include the new product.
- **Update Product**:

  - Allow editing of existing product details.
  - Use **Zod** for validating the updated data.
  - Send a PUT request to `https://dummyjson.com/products/{id}`.
  - Reflect the changes in the TanStack Query's cache upon successful update.
- **Delete Product**:

  - Implement a delete functionality for each product.
  - Send a DELETE request to `https://dummyjson.com/products/{id}`.
  - Remove the product from the TanStack Query's cache upon successful deletion.

### 5. Product Detail Page (View Page)

- Clicking on a table row should navigate to a product view page at `/products/[id]`.
- Fetch the product using `GET https://dummyjson.com/products/{id}`.
- Display key information: title, price, description, brand, thumbnail, etc.

### 6. Dynamic Page Titles

- Use the product name (or relevant context) as the document `<title>` for each page.
  - Example:
    - `/products`: “All Products – MyShop”
    - `/products/12`: “iPhone 9 – MyShop”

---

## Form Validation with Zod

Use `zod` and `@hookform/resolvers/zod` for schema validation. Example schema:

```typescript
import { z } from 'zod';

export const productSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' })
});
```

Integrate this schema with `react-hook-form` to validate form inputs and display appropriate error messages.

---

## Evaluation Criteria

* **Functionality** : Correct implementation of data fetching, pagination, sorting, CRUD operations, and routing.
* **Code Quality** : Clean, readable, and maintainable code.
* **User Experience** : Intuitive and responsive UI/UX.
* **Validation** : Effective use of Zod for form validation with appropriate error messages.
* **State Management** : Efficient use of TanStack Query for data fetching and state management.
* **Error Handling** : Proper handling of API errors and edge cases.

---

## Submission Guidelines

1. **Fork the Repository.**
2. **Make Your Changes**
3. **Push Changes and Create a Pull Request** :

* Ensure the base repository is `QarbonaAI/fe-task` and the base branch is `main`.
* Set the title of the pull request to your  **full name** .
* Provide a brief description of the changes you've made.

---

## 🎯 Feature Implementation

### **1. Optimistic Updates** ⚡
Real-time UI updates for enhanced user experience:

```typescript
// Example: Add Product with Optimistic Update
const addMutation = useMutation({
  mutationFn: addProduct,
  onMutate: async (newProductData) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries(['products']);
    
    // Create optimistic product
    const optimisticProduct = {
      id: Date.now(), // Temporary ID
      ...newProductData
    };
    
    // Update cache immediately
    queryClient.setQueryData(['products'], oldData => ({
      ...oldData,
      products: [optimisticProduct, ...oldData.products]
    }));
    
    return { optimisticProduct };
  },
  onSuccess: (actualProduct, variables, context) => {
    // Replace optimistic data with real API response
    queryClient.setQueryData(['products'], oldData => ({
      ...oldData,
      products: oldData.products.map(p => 
        p.id === context.optimisticProduct.id ? actualProduct : p
      )
    }));
  }
});
```

### **2. Debounced Search** 🔍
Efficient client-side search with 300ms debouncing:

```typescript
// Custom debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage in component
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearchTerm = useDebounce(searchTerm, 300);

// Filter products by title or brand
const filteredProducts = useMemo(() => {
  return products.filter(product => 
    product.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );
}, [products, debouncedSearchTerm]);
```

### **3. Skeleton Loading** 💀
Professional loading states with shimmer animations:

```typescript
export function ProductTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-8 w-16" />
      </div>
      
      {/* Table rows skeleton */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center p-4 space-x-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
          {/* ... more skeleton elements */}
        </div>
      ))}
    </div>
  );
}
```

### **4. Form Validation** ✅
Comprehensive validation with Zod and React Hook Form:

```typescript
// Zod schema
export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.number().min(0, "Price must be positive"),
  description: z.string().optional(),
  brand: z.string().optional(),
  thumbnail: z.string().url("Invalid URL").optional()
});

// Form integration
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(productSchema)
});
```

---

## 🎨 UI/UX Features

### **Responsive Design**
- ✅ **Mobile-First** - Optimized for all screen sizes
- ✅ **Flexible Layouts** - Adapts to different viewports
- ✅ **Touch-Friendly** - Large touch targets on mobile

### **Enhanced Interactions**
- ✅ **Hover Effects** - Smooth transitions on interactive elements
- ✅ **Loading States** - Visual feedback during operations
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Keyboard Navigation** - Full keyboard accessibility

### **Visual Indicators**
- ✅ **Sort Icons** - Clear visual feedback for sorting
- ✅ **Filter Icons** - Obvious filter interaction points
- ✅ **Cursor Pointers** - Proper cursor states
- ✅ **Status Badges** - Visual status indicators

---

## 🔧 API Integration

### **Endpoints Used**
```
GET    /products              # Fetch products list
GET    /products/{id}         # Fetch single product
POST   /products/add          # Create new product
PUT    /products/{id}         # Update existing product
DELETE /products/{id}         # Delete product
```

### **TanStack Query Configuration**
```typescript
// Products query with pagination
const { data: productsResponse, isLoading } = useQuery({
  queryKey: ['products', pagination.pageIndex, pagination.pageSize],
  queryFn: async () => {
    const skip = pagination.pageIndex * pagination.pageSize;
    const limit = pagination.pageSize;
    return await getProducts(limit, skip);
  },
  placeholderData: (previousData) => previousData
});
```

---

## 📱 Pages & Routes

### **Main Routes**
- `/` - Home page with navigation
- `/products` - Products listing with table
- `/products/[id]` - Individual product detail page

### **Dynamic Titles**
- ✅ **Products Page**: "All Products – MyShop"
- ✅ **Product Detail**: "{Product Name} – MyShop"
- ✅ **Loading State**: "Loading Product – MyShop"

---

## 🧪 Testing & Development

### **Development Server**
```bash
npm run dev
# Server runs on http://localhost:3001
```

### **Key Testing Areas**
1. **Search Functionality** - Test debounced search with various terms
2. **CRUD Operations** - Test all create, read, update, delete operations
3. **Pagination** - Navigate through different pages
4. **Sorting** - Test all sortable columns
5. **Responsive Design** - Test on different screen sizes
6. **Loading States** - Observe skeleton loading animations

---

## 📊 Performance Optimizations

### **Client-Side Optimizations**
- ✅ **Debounced Search** - Reduces excessive API calls
- ✅ **Optimistic Updates** - Instant UI feedback
- ✅ **Memoized Computations** - Efficient re-renders
- ✅ **Lazy Loading** - Code splitting for better performance

### **Server State Management**
- ✅ **TanStack Query Caching** - Intelligent data caching
- ✅ **Background Refetching** - Fresh data without blocking UI
- ✅ **Optimistic Updates** - Immediate cache updates
- ✅ **Error Recovery** - Automatic rollback on failures

---

## 🎯 User Experience Highlights

### **Instant Feedback**
- Operations appear to complete immediately
- Real-time search results as you type
- Smooth animations and transitions

### **Professional Design**
- Consistent design system with shadcn/ui
- Proper loading states and error handling
- Intuitive navigation and interactions

### **Accessibility**
- Keyboard navigation support
- Screen reader friendly
- High contrast and readable text

---

## 🚀 Future Enhancements

### **Potential Improvements**
- [ ] **Advanced Filtering** - Category, price range filters
- [ ] **Bulk Operations** - Select multiple products for actions
- [ ] **Export Features** - Export to CSV/PDF
- [ ] **Real-time Updates** - WebSocket integration
- [ ] **Offline Support** - PWA capabilities
- [ ] **Image Upload** - Product image management
- [ ] **Advanced Search** - Full-text search with highlighting

---

## 👨‍💻 Developer Notes

### **Architecture Decisions**
- **TanStack Query** - Chosen for powerful server state management
- **Zustand** - Lightweight client state for pagination
- **shadcn/ui** - Consistent, accessible component library
- **Zod** - Type-safe schema validation

### **Code Quality Standards**
- TypeScript strict mode enabled
- ESLint and Prettier configured
- Component composition over inheritance
- Custom hooks for reusable logic

### **Performance Considerations**
- Debounced search to prevent excessive API calls
- Optimistic updates for instant user feedback
- Memoized expensive computations
- Proper loading states and error boundaries

---

## 📞 Support & Contribution

### **Getting Help**
- Check the console for detailed error messages
- Review the API documentation at [DummyJSON](https://dummyjson.com/docs)
- Ensure all dependencies are properly installed

### **Contributing**
- Follow the existing code style and patterns
- Add TypeScript types for all new code
- Test thoroughly across different screen sizes
- Document any new features or changes

---

## 📋 Summary

This enhanced product management system demonstrates modern React development practices with:

✅ **Advanced State Management** - TanStack Query + Zustand  
✅ **Optimistic UI Updates** - Instant feedback for all operations  
✅ **Professional Design** - shadcn/ui components with custom styling  
✅ **Performance Optimizations** - Debounced search, skeleton loading  
✅ **Type Safety** - Full TypeScript integration with Zod validation  
✅ **Responsive Design** - Mobile-first approach with Tailwind CSS  
✅ **Developer Experience** - Clean architecture and maintainable code  

The application provides a production-ready foundation for product management with room for future enhancements and scalability.

