import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import ProfileSettings from './pages/ProfileSettings';
import EmailConfirmation from './pages/EmailConfirmation';
import NewArrivals from './pages/NewArrivals';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home showToast={showToast} />} />
                <Route path="/products" element={<ProductListing showToast={showToast} />} />
                <Route path="/products/:id" element={<ProductDetails showToast={showToast} />} />
                <Route path="/cart" element={<Cart showToast={showToast} />} />
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout showToast={showToast} />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login showToast={showToast} />} />
                <Route path="/register" element={<Register showToast={showToast} />} />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders showToast={showToast} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <Orders showToast={showToast} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile-settings"
                  element={
                    <ProtectedRoute>
                      <ProfileSettings />
                    </ProtectedRoute>
                  }
                />
                <Route path="/email-confirmation" element={<EmailConfirmation showToast={showToast} />} />
              </Routes>
            </main>

            <Footer />
          </div>

          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={hideToast}
            />
          )}
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
