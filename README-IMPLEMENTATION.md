# The Blackege E-commerce Platform - Frontend Implementation

## 🚀 Overview

This is a complete, production-ready e-commerce frontend for The Blackege streetwear platform, built with Next.js 14, TypeScript, and Tailwind CSS. The application integrates seamlessly with the backend API documented in `UI-INTEGRATION.md`.

## ✨ Features Implemented

### 🔐 Authentication & Authorization
- **User Registration & Login** - Complete signup/signin flow
- **JWT Token Management** - Automatic token refresh and storage
- **Role-based Access Control** - Customer/Admin role differentiation
- **Protected Routes** - Secure pages with authentication checks
- **User Profile Management** - Account settings and profile updates

### 🛒 E-commerce Core Features
- **Product Catalog** - Browse products with pagination, search, and filtering
- **Product Details** - Detailed product pages with image galleries
- **Shopping Cart** - Add, update, remove items with persistent storage
- **Wishlist** - Save favorite products for later
- **Checkout Process** - Complete order flow with address management
- **Order Management** - View order history and track status

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first approach with responsive layouts
- **Dark/Light Theme** - System preference detection and manual toggle
- **Loading States** - Comprehensive loading indicators and skeleton screens
- **Error Handling** - Graceful error boundaries and user feedback
- **Toast Notifications** - Real-time feedback for user actions

### 👨‍💼 Admin Dashboard
- **Product Management** - Create, edit, delete products
- **Order Management** - View and update order statuses
- **User Management** - Admin user controls
- **Analytics Dashboard** - Sales and inventory insights

### 🔧 Technical Features
- **API Integration** - Complete REST API integration with error handling
- **State Management** - Context-based state management for auth, cart, wishlist
- **Caching** - Smart API response caching for performance
- **Search & Filtering** - Advanced product search and filtering capabilities
- **Pagination** - Efficient data loading with pagination

## 📁 Project Structure

```
├── app/                          # Next.js 14 App Router
│   ├── account/                  # User account pages
│   ├── admin/                    # Admin dashboard
│   ├── cart/                     # Shopping cart
│   ├── checkout/                 # Checkout flow
│   ├── login/                    # Authentication
│   ├── register/                 # User registration
│   ├── product/[id]/             # Product detail pages
│   ├── shop/                     # Product catalog
│   ├── wishlist/                 # User wishlist
│   └── layout.tsx                # Root layout with providers
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components (shadcn/ui)
│   ├── enhanced-product-detail.tsx
│   ├── enhanced-shop-content.tsx
│   ├── error-boundary.tsx
│   ├── loading-spinner.tsx
│   ├── protected-route.tsx
│   └── header.tsx                # Enhanced navigation
├── contexts/                     # React contexts
│   └── auth-context.tsx          # Authentication context
├── hooks/                        # Custom React hooks
│   ├── use-cart.ts               # Cart management
│   ├── use-wishlist.ts           # Wishlist management
│   └── use-toast.ts              # Toast notifications
├── lib/                          # Utilities and API
│   ├── api/                      # API functions
│   │   ├── auth.ts               # Authentication API
│   │   ├── products.ts           # Product API
│   │   ├── cart.ts               # Cart API
│   │   ├── orders.ts             # Order API
│   │   ├── wishlist.ts           # Wishlist API
│   │   └── admin.ts              # Admin API
│   ├── api-client.ts             # Core API client
│   └── utils.ts                  # Utility functions
└── types/                        # TypeScript type definitions
```

## 🛠️ Key Components

### API Client (`lib/api-client.ts`)
- Centralized API client with automatic token management
- Request/response interceptors for authentication
- Error handling and retry logic
- Caching layer for performance optimization

### Authentication System
- **Context**: `contexts/auth-context.tsx` - Global auth state management
- **API**: `lib/api/auth.ts` - Login, register, logout functions
- **Components**: Login/Register pages with form validation

### Shopping Cart
- **Hook**: `hooks/use-cart.ts` - Cart state management
- **API**: `lib/api/cart.ts` - Backend cart synchronization
- **Components**: Cart page with quantity management

### Product Catalog
- **Enhanced Shop**: `components/enhanced-shop-content.tsx`
- **Product Detail**: `components/enhanced-product-detail.tsx`
- **Features**: Search, filtering, pagination, sorting

### Admin Dashboard
- **Dashboard**: `app/admin/page.tsx` - Complete admin interface
- **Features**: Product CRUD, order management, analytics

## 🔌 API Integration

The frontend is fully integrated with the backend API as documented in `UI-INTEGRATION.md`:

- **Authentication**: JWT-based with automatic refresh
- **Products**: CRUD operations, search, filtering
- **Cart**: Real-time cart synchronization
- **Orders**: Complete order lifecycle management
- **Wishlist**: User favorite products
- **Admin**: Management interfaces for all entities

## 🎯 Usage Examples

### Authentication
```typescript
const { login, register, logout, user, isAuthenticated } = useAuth();

// Login user
await login({ username: 'user@example.com', password: 'password' });

// Register new user
await register({
  username: 'newuser',
  email: 'user@example.com',
  password: 'password',
  firstName: 'John',
  lastName: 'Doe'
});
```

### Cart Management
```typescript
const { cart, addToCart, updateItem, removeItem, getTotalItems } = useCart();

// Add product to cart
await addToCart('product-id', 2);

// Update quantity
await updateItem('cart-item-id', 3);

// Remove item
await removeItem('cart-item-id');
```

### Product Operations
```typescript
// Get products with pagination
const products = await getProducts(0, 12, 'name', 'asc');

// Search products
const searchResults = await searchProducts('hoodie', 0, 12);

// Filter products
const filtered = await filterProducts({
  categories: ['Hoodies'],
  minPrice: 50,
  maxPrice: 200,
  inStock: true
});
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Environment Setup**
   - Ensure the backend API is running on `http://localhost:8080`
   - Update API URLs in `lib/api-client.ts` if needed

3. **Run Development Server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Admin Dashboard: `http://localhost:3000/admin` (requires admin login)

## 🔐 Authentication Flow

1. **User Registration**: Create account with email verification
2. **Login**: JWT token issued and stored securely
3. **Auto-refresh**: Tokens automatically refreshed before expiration
4. **Protected Routes**: Automatic redirection for unauthenticated users
5. **Role-based Access**: Admin features restricted to admin users

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first** design approach
- **Breakpoint system**: sm, md, lg, xl
- **Touch-friendly** interfaces
- **Optimized navigation** for mobile devices

## 🎨 Theming

- **Light/Dark modes** with system preference detection
- **Consistent design system** using Tailwind CSS
- **Custom color palette** matching brand identity
- **Accessible** color contrasts and typography

## 🔧 Performance Optimizations

- **API Response Caching** - Intelligent caching with TTL
- **Image Optimization** - Next.js Image component with lazy loading
- **Code Splitting** - Automatic route-based code splitting
- **Loading States** - Skeleton screens and spinners
- **Debounced Search** - Reduced API calls during typing

## 🛡️ Security Features

- **JWT Token Security** - Secure token storage and transmission
- **Protected Routes** - Authentication and authorization checks
- **Input Validation** - Client-side form validation
- **Error Boundaries** - Graceful error handling
- **HTTPS Ready** - Secure communication protocols

## 📊 State Management

- **Authentication State** - Global user and auth status
- **Cart State** - Persistent shopping cart across sessions
- **Wishlist State** - User's saved products
- **Loading States** - UI feedback for async operations
- **Error States** - Comprehensive error handling

## 🧪 Error Handling

- **API Error Handling** - Comprehensive error catching and user feedback
- **Network Error Recovery** - Retry mechanisms for failed requests
- **Form Validation** - Real-time form validation with error messages
- **Error Boundaries** - React error boundaries for crash prevention
- **Toast Notifications** - User-friendly error and success messages

## 📈 Future Enhancements

- **Real-time Features** - WebSocket integration for live updates
- **PWA Support** - Progressive Web App capabilities
- **Advanced Analytics** - Enhanced dashboard analytics
- **Multi-language Support** - Internationalization (i18n)
- **Payment Integration** - Stripe/PayPal payment processing

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Ensure TypeScript types are properly defined
3. Add error handling for all API calls
4. Include loading states for async operations
5. Test responsive design across devices
6. Update documentation for new features

## 📝 Notes

- All API endpoints are documented in `UI-INTEGRATION.md`
- The application is designed to work with the backend API as specified
- Error handling is comprehensive with user-friendly feedback
- The codebase follows Next.js 14 best practices with App Router
- TypeScript is used throughout for type safety

---

**The Blackege E-commerce Platform** - A complete, modern e-commerce solution built with cutting-edge technologies and best practices.
