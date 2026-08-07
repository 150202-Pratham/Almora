import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../api/productService';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const ProductListing = ({ showToast }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    console.log('ProductListing mounted');
    fetchCategories();
  }, []);

  useEffect(() => {
    console.log('Effect triggered - selectedCategory:', selectedCategory, 'searchQuery:', searchQuery);
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let data = [];
      
      if (searchQuery) {
        console.log('Searching products with query:', searchQuery);
        data = await productService.searchProducts(searchQuery);
      } else if (selectedCategory) {
        console.log('Fetching products for category:', selectedCategory);
        data = await productService.getProductsByCategory(selectedCategory);
      } else {
        // When "All Products" is selected, fetch from both MEN and WOMEN categories
        console.log('Fetching all products from all categories');
        const menProducts = await productService.getProductsByCategory('MEN');
        const womenProducts = await productService.getProductsByCategory('WOMEN');
        data = [...(menProducts || []), ...(womenProducts || [])];
      }
      
      console.log('Fetched products count:', Array.isArray(data) ? data.length : 0);
      console.log('Fetched products:', data);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      showToast && showToast('Failed to load products', 'error');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    if (category) {
      const formattedCategory = category.toUpperCase();
      console.log('Setting category:', formattedCategory);
      setSearchParams({ category: formattedCategory });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar - Filters */}
        <aside className="md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    !selectedCategory
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  All Products
                </button>
                {categories.map((category) => {
                  const isSelected = selectedCategory.toUpperCase() === category.toUpperCase();
                  return (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`block w-full text-left px-3 py-2 rounded ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700">Price Range</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Under ₹1,000</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">₹1,000 - ₹5,000</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">₹5,000 - ₹10,000</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Above ₹10,000</span>
                </label>
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="font-semibold mb-3 text-gray-700">Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">
                          {i < rating ? '★' : '☆'}
                        </span>
                      ))}
                      <span className="ml-1">& Up</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : selectedCategory
                ? selectedCategory
                : 'All Products'}
            </h1>
            <p className="text-gray-600">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
          </div>

          {/* Sort Options */}
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => {
                const value = e.target.value;
                let sortedProducts = [...products];
                
                switch(value) {
                  case 'availability':
                    sortedProducts.sort((a, b) => (b.stock || 0) - (a.stock || 0));
                    break;
                  case 'price-low':
                    sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
                    break;
                  case 'price-high':
                    sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
                    break;
                  default:
                    // Keep original order
                    break;
                }
                
                setProducts(sortedProducts);
              }}
            >
              <option value="relevance">Relevance</option>
              <option value="availability">Availability</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <Loader />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} showToast={showToast} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">No products found</p>
              <button
                onClick={() => {
                  setSearchParams({});
                  fetchProducts();
                }}
                className="btn-primary"
              >
                View All Products
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListing;