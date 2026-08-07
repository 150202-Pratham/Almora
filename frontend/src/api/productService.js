import axiosInstance from './axios';

const productService = {
  // Get products by category (MEN or WOMEN) - now uses /api/products?category={category}
  getProductsByCategory: async function(category) {
    try {
      const normalizedCategory = category.toUpperCase();
      console.log('Fetching products for category:', normalizedCategory);
      
      if (!['MEN', 'WOMEN'].includes(normalizedCategory)) {
        console.error('Invalid category:', normalizedCategory);
        return [];
      }
      
      // Use /api/products with category query param per new API spec
      const response = await axiosInstance.get('/products', {
        params: { category: normalizedCategory }
      });
      
      console.log('Raw response data:', response.data);
      
      let data = response.data;
      
      // If data is still a string after axios processing, try manual parsing
      if (typeof data === 'string') {
        console.warn('Response is still a string, attempting manual parse');
        try {
          data = JSON.parse(data);
        } catch (parseError) {
          console.error('Could not parse string response:', parseError);
          return [];
        }
      }
      
      // Extract only the essential product fields (ProductDTO doesn't include reviews)
      if (Array.isArray(data)) {
        const cleanedProducts = data.map(product => ({
          id: product.id,
          name: product.name,
          category: product.category,
          subCategory: product.subCategory,
          brand: product.brand,
          sizes: product.sizes,
          color: product.color,
          price: product.price,
          stock: product.stock,
          description: product.description,
          imageUrls: product.imageUrls,
          active: product.active,
          averageRating: product.averageRating,
          reviewCount: product.reviewCount,
        }));
        
        console.log('Products received and cleaned:', cleanedProducts);
        return cleanedProducts;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  // Get featured products (combines both categories and filters)
  getFeaturedProducts: async function() {
    try {
      console.log('Fetching featured products...');
      const menProducts = await this.getProductsByCategory('MEN');
      console.log('MEN products:', menProducts.length);
      
      const womenProducts = await this.getProductsByCategory('WOMEN');
      console.log('WOMEN products:', womenProducts.length);
      
      const allProducts = [...(menProducts || []), ...(womenProducts || [])];
      console.log('Total featured products:', allProducts.length);
      
      // Map products to include carousel-friendly fields
      const featuredProducts = allProducts.slice(0, 12).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || 'Premium artisan product',
        imageUrls: product.imageUrls || [],
        category: product.category || 'Featured',
        rating: product.averageRating || 0,
        reviewCount: product.reviewCount || 0,
        stock: product.stock || 0,
        price: product.price || 0,
        discount: product.discount || null,
      }));
      
      console.log('Mapped featured products:', featuredProducts);
      return featuredProducts;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },

  // Get all products by category (optional, defaults to no filter)
  getAllProducts: async (category = null) => {
    try {
      let response;
      
      if (category) {
        const normalizedCategory = category.toUpperCase();
        
        if (!['MEN', 'WOMEN'].includes(normalizedCategory)) {
          console.error('Invalid category:', normalizedCategory);
          return [];
        }
        
        // API requires category as query param: /api/products?category=MEN
        response = await axiosInstance.get('/products', {
          params: { category: normalizedCategory }
        });
      } else {
        // When no category specified, we can't call /api/products without category param
        // This should be handled by calling getProductsByCategory for each category
        console.warn('getAllProducts called without category - this endpoint requires a category');
        return [];
      }
      
      let data = response.data;
      
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      // Extract only essential product fields (ProductDTO doesn't include reviews)
      if (Array.isArray(data)) {
        return data.map(product => ({
          id: product.id,
          name: product.name,
          category: product.category,
          subCategory: product.subCategory,
          brand: product.brand,
          sizes: product.sizes,
          color: product.color,
          price: product.price,
          stock: product.stock,
          description: product.description,
          imageUrls: product.imageUrls,
          active: product.active,
          averageRating: product.averageRating,
          reviewCount: product.reviewCount,
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product details' };
    }
  },

  // Search products by keyword
  searchProducts: async (keyword) => {
    try {
      const response = await axiosInstance.get('/products/search', {
        params: { keyword }
      });
      
      let data = response.data;
      
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      // Extract only essential product fields (ProductDTO format)
      if (Array.isArray(data)) {
        return data.map(product => ({
          id: product.id,
          name: product.name,
          category: product.category,
          subCategory: product.subCategory,
          brand: product.brand,
          sizes: product.sizes,
          color: product.color,
          price: product.price,
          stock: product.stock,
          description: product.description,
          imageUrls: product.imageUrls,
          active: product.active,
          averageRating: product.averageRating,
          reviewCount: product.reviewCount,
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },

  // Get products by category and subcategory
  getProductsByCategoryAndSubCategory: async (category, subCategory) => {
    try {
      const normalizedCategory = category.toUpperCase();
      
      if (!['MEN', 'WOMEN'].includes(normalizedCategory)) {
        throw new Error('Invalid category');
      }
      
      // Use /api/products/category/{category}/subcategory/{subCategory}
      const response = await axiosInstance.get(
        `/products/category/${normalizedCategory}/subcategory/${subCategory}`
      );
      
      let data = response.data;
      
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      if (Array.isArray(data)) {
        return data.map(product => ({
          id: product.id,
          name: product.name,
          category: product.category,
          subCategory: product.subCategory,
          brand: product.brand,
          sizes: product.sizes,
          color: product.color,
          price: product.price,
          stock: product.stock,
          description: product.description,
          imageUrls: product.imageUrls,
          active: product.active,
          averageRating: product.averageRating,
          reviewCount: product.reviewCount,
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching products by category and subcategory:', error);
      return [];
    }
  },

  // Get all categories (returns static list based on backend enum)
  getCategories: async () => {
    // Backend only supports MEN and WOMEN categories
    return ['MEN', 'WOMEN'];
  },

  // Add new product (admin function)
  addProduct: async (productData) => {
    try {
      const response = await axiosInstance.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add product' };
    }
  },

  // Delete product (admin function)
  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete product' };
    }
  },
};

export default productService;