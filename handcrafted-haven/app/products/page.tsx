'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, Grid3X3, List, SlidersHorizontal } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Product, Category } from '../types'

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState([0, 500])
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await fetch('/api/products')
        const productsData = await productsResponse.json()
        
        if (productsData.success) {
          setAllProducts(productsData.data)
        }

        // Fetch categories
        const categoriesResponse = await fetch('/api/categories')
        const categoriesData = await categoriesResponse.json()
        
        if (categoriesData.success) {
          setCategories(categoriesData.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProducts = useMemo(() => {
    const filtered = allProducts.filter(product => {
      const categoryName = typeof product.category === 'string' ? product.category : (product.category as any)?.name || 'Unknown'
      const artisanName = typeof product.artisan === 'string' ? product.artisan : (product.artisan as any)?.name || 'Unknown'
      
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           artisanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || categoryName === selectedCategory
      
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      
      return matchesSearch && matchesCategory && matchesPrice
    })

    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price)
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price)
      case 'rating':
        return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      default:
        return filtered.sort((a, b) => a.name.localeCompare(b.name))
    }
  }, [allProducts, searchTerm, selectedCategory, sortBy, priceRange])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
        <Header />
        <div className="flex items-center justify-center flex-1 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="mt-4 text-secondary">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      <Header />
      
      <main>
        <div className="bg-secondary border-b border-tertiary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Product Catalog</h1>
            <p className="text-secondary">Discover unique handcrafted products made with love</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="card">
                <h3 className="font-semibold text-primary mb-4">Filters</h3>
                
                <div className="mb-6">
                  <label htmlFor="search-input" className="block text-sm font-medium text-secondary mb-2">
                    Search products
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4" />
                    <input
                      id="search-input"
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-tertiary border border-tertiary rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-primary"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="category-select" className="block text-sm font-medium text-secondary mb-2">
                    Category
                  </label>
                  <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-tertiary border border-tertiary rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-primary"
                  >
                    <option value="all">All categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.icon} {category.name} ({category.productCount || 0})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="price-range" className="block text-sm font-medium text-secondary mb-2">
                    Price range
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-20 px-2 py-1 bg-tertiary border border-tertiary rounded text-primary text-sm"
                      placeholder="0"
                    />
                    <span className="text-secondary">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-20 px-2 py-1 bg-tertiary border border-tertiary rounded text-primary text-sm"
                      placeholder="500"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                    setPriceRange([0, 500])
                  }}
                  className="w-full px-4 py-2 bg-secondary hover:bg-hover-bg text-primary rounded-lg transition-colors"
                >
                  Clear filters
                </button>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-secondary">{filteredProducts.length} products found</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 bg-tertiary border border-tertiary rounded text-primary text-sm"
                  >
                    <option value="name">Name A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Best Rating</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-accent text-white' : 'bg-tertiary text-secondary'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-accent text-white' : 'bg-tertiary text-secondary'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden p-2 bg-tertiary text-secondary rounded"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-secondary text-lg">No products found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
