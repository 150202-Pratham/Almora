import { Link } from 'react-router-dom';
import LOGO from "../assets/logo.png"
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary"> 
              <img src={LOGO} alt="" height={200} width={200}/>
            </h3>
            <p className="text-gray-400 text-sm">
              Your trusted online marketplace for quality products at great prices. Shop with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-primary">All Products</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-primary">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-primary">My Orders</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">Contact Us</li>
              <li className="text-gray-400">Shipping Info</li>
              <li className="text-gray-400">Returns</li>
              <li className="text-gray-400">FAQs</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 support@almora.com</li>
              <li>📞 +91 8295756906</li>
              <li>📍 Yamunanagar, Haryana, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Almora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;