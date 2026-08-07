import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import LOGO from "../assets/logo.png"
// Navigation items
const navItems = [
  { name: 'Collections', path: '/products' },
  { name: 'About Us', path: '/about-us' },
  { name: 'Contact Us', path: '/contact-us' }
];

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  // Remove unused state
  const [searchSuggestions] = useState([
    'Traditional Wear', 'Modern Fashion', 'Accessories',
    'New Arrivals', 'Best Sellers', 'Sale Items'
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav 
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 text-gray-900 backdrop-blur-md border-b border-gray-200/20' 
          : 'bg-gray-900/95 text-white'
      }`}
    >
      {/* Announcement Bar */}
      <div className={`bg-gradient-to-r from-primary/90 via-yellow-500/90 to-primary/90 text-white
                    transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0' : 'h-10'}`}>
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-center h-full text-sm font-medium">
            <span className="animate-marquee whitespace-nowrap">
              🎉 Free Shipping on Orders Above ₹999 | Shop Now for Exclusive Deals! 🛍️
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <Link to="/" className="relative z-10">
            <span className={`text-2xl lg:text-3xl font-bold tracking-tight transition-colors duration-300 ${
              isScrolled ? 'text-primary' : 'text-white'
            }`}>
               <img src={LOGO} alt=""  height={300} width={200}/>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-x-12">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative py-2 text-base font-medium tracking-wide group ${
                  isScrolled 
                    ? `text-gray-700 hover:text-primary ${location.pathname === item.path ? 'text-primary' : ''}` 
                    : `text-white hover:text-primary/90 ${location.pathname === item.path ? 'text-primary/90' : ''}`
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 origin-left ${
                  location.pathname === item.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className={`w-full py-2 pl-4 pr-10 rounded-full outline-none transition-all duration-300
                          ${isScrolled 
                            ? 'bg-gray-100 focus:bg-white focus:shadow-md text-gray-900' 
                            : 'bg-white/10 focus:bg-white/20 text-white placeholder:text-gray-300'
                          }`}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className={`w-5 h-5 transition-colors ${
                  isScrolled ? 'text-gray-400' : 'text-gray-300'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Search Suggestions */}
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 py-2 px-4">
                  {searchSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        handleSearch({ preventDefault: () => {} });
                      }}
                      className="block w-full text-left py-2 text-gray-700 hover:text-primary transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            {/* Auth Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              {isAuthenticated ? (
                <div className="relative group">
                  <button className={`flex items-center space-x-2 ${
                    isScrolled ? 'text-gray-700 hover:text-primary' : 'text-gray-100 hover:text-white'
                  }`}>
                    <span>Hello, {user?.name || 'User'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl border border-gray-100
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                                transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50">
                      Your Orders
                    </Link>
                    <Link to="/profile-settings" className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50">
                      Profile Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className={`relative group ${
                      isScrolled ? 'text-gray-700 hover:text-primary' : 'text-gray-100 hover:text-white'
                    }`}
                  >
                    Sign In
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 
                                   group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Link>
                  <Link
                    to="/register"
                    className={`px-6 py-2 rounded-full ${
                      isScrolled
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    } transition-colors`}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Cart */}
            <Link 
              to="/cart" 
              className={`relative group ${
                isScrolled ? 'text-gray-700 hover:text-primary' : 'text-gray-100 hover:text-white'
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-gray-100/10 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold
                               rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center
                               transform transition-all duration-300 group-hover:scale-110">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden relative z-50 p-2 -mr-2 group"
              aria-label="Toggle menu"
            >
              <div className="relative flex overflow-hidden items-center justify-center w-6 h-6">
                <div className={`flex flex-col justify-between w-full h-full transform duration-300 ${
                  showMobileMenu ? 'rotate-90' : 'rotate-0'
                }`}>
                  <span className={`bg-current transform transition-transform duration-300 h-[2px] w-full origin-left ${
                    showMobileMenu ? 'rotate-[42deg] translate-x-px' : 'rotate-0'
                  }`}></span>
                  <span className={`bg-current h-[2px] w-full transform transition-transform duration-300 ${
                    showMobileMenu ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
                  }`}></span>
                  <span className={`bg-current transform transition-transform duration-300 h-[2px] w-full origin-left ${
                    showMobileMenu ? '-rotate-[42deg] translate-x-px' : 'rotate-0'
                  }`}></span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          showMobileMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          <div className={`absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white transform transition-transform duration-500 ${
            showMobileMenu ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="overflow-y-auto h-full py-6">
              {/* Mobile Search */}
              <div className="px-6 mb-6">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-900 focus:outline-none"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>
              </div>

              {/* Mobile Categories */}
              <div className="px-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block py-3 text-gray-800 hover:text-primary transition-colors border-b border-gray-100 last:border-none ${
                      location.pathname === item.path ? 'text-primary font-medium' : ''
                    }`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth */}
              <div className="border-t border-gray-200 mt-6 pt-6 px-6">
                {isAuthenticated ? (
                  <>
                    <div className="text-gray-500 mb-4">Hello, {user?.name || 'User'}</div>
                    <Link to="/orders" className="block py-2 text-gray-800 hover:text-primary">
                      Your Orders
                    </Link>
                    <Link to="/profile-settings" className="block py-2 text-gray-800 hover:text-primary">
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2 text-gray-800 hover:text-primary"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <Link
                      to="/login"
                      className="block w-full py-2 text-center text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full py-2 text-center text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="flex md:hidden mt-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-4 py-2 rounded-l-md text-gray-900 outline-none"
          />
          <button
            type="submit"
            className="bg-primary hover:bg-yellow-600 px-4 py-2 rounded-r-md"
          >
            🔍
          </button>
        </form>
      </div>

      {/* Categories Bar */}
      {/* <div className="bg-gray-700 py-2 hidden md:block">
        <div className="container mx-auto px-4 flex gap-6 text-sm">
          <Link to="/products" className="hover:text-primary">All Products</Link>
          <Link to="/products?category=electronics" className="hover:text-primary">Electronics</Link>
          <Link to="/products?category=fashion" className="hover:text-primary">Fashion</Link>
          <Link to="/products?category=home" className="hover:text-primary">Home & Kitchen</Link>
          <Link to="/products?category=books" className="hover:text-primary">Books</Link>
        </div>
      </div> */}

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-gray-800 py-4">
          <div className="container mx-auto px-4 flex flex-col gap-3">
            <Link to="/products" className="hover:text-primary" onClick={() => setShowMobileMenu(false)}>
              All Products
            </Link>
            <Link to="/products?category=electronics" className="hover:text-primary" onClick={() => setShowMobileMenu(false)}>
              Electronics
            </Link>
            <Link to="/products?category=fashion" className="hover:text-primary" onClick={() => setShowMobileMenu(false)}>
              Fashion
            </Link>
            <Link to="/products?category=home" className="hover:text-primary" onClick={() => setShowMobileMenu(false)}>
              Home & Kitchen
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;