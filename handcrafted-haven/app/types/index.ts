// Product type with all the properties needed for the updated components
export interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number  // Optional for sale items
  artisan: string
  description?: string
  imageUrl?: string
  featured?: boolean      // For featured products
  premium?: boolean       // For premium products
  rating?: number         // Optional star rating (1-5)
  reviews?: number        // Optional number of reviews
  inStock?: boolean       // Optional stock status
  tags?: string[]         // Optional product tags
  createdAt?: Date        // Optional creation date
  updatedAt?: Date        // Optional update date
}

// Category type with all the properties needed for the updated components
export interface Category {
  id?: string
  name: string
  slug?: string
  icon?: string           // Emoji or icon identifier
  count?: number          // Number of items in category (legacy)
  productCount?: number   // Number of items in category (from API)
  description?: string    // Optional category description
  featured?: boolean      // Optional featured status
  imageUrl?: string       // Optional category image
}

// Artisan type for future use
export interface Artisan {
  id: string
  name: string
  bio?: string
  location?: string
  specialties: string[]
  profileImage?: string
  joinedDate?: Date
  verified?: boolean
  rating?: number
  totalSales?: number
}

// Order type for future use
export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  updatedAt: Date
  shippingAddress: Address
  paymentMethod: string
}

export interface OrderItem {
  productId: string
  product: Product
  quantity: number
  price: number
}

export interface Address {
  street: string
  city: string
  state: string
  country: string
  zipCode: string
}

// User type for future use
export interface User {
  id: string
  email: string
  name: string
  profileImage?: string
  preferences?: UserPreferences
  createdAt: Date
  isArtisan?: boolean
}

export interface UserPreferences {
  favoriteCategories: string[]
  priceRange: {
    min: number
    max: number
  }
  notifications: {
    email: boolean
    push: boolean
  }
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Search and Filter types
export interface SearchFilters {
  query?: string
  category?: string
  priceRange?: {
    min: number
    max: number
  }
  rating?: number
  artisan?: string
  featured?: boolean
  inStock?: boolean
  sortBy?: 'price' | 'rating' | 'newest' | 'popular'
  sortOrder?: 'asc' | 'desc'
}

// Cart types
export interface CartItem {
  productId: string
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

// Review type for product reviews
export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: Date
  helpful: number
  verified: boolean
}