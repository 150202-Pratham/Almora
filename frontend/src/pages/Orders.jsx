import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../api/orderService';
import Loader from '../components/Loader';

const Orders = ({ showToast }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getUserOrders();
      console.log('Orders data received:', data);
      if (Array.isArray(data) && data.length > 0) {
        console.log('First order items:', data[0].items);
        console.log('First order item structure:', data[0].items?.[0]);
      }
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      showToast && showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await orderService.cancelOrder(orderId);
      showToast && showToast('Order cancelled successfully', 'success');
      fetchOrders();
    } catch (error) {
        console.log(error)
      showToast && showToast('Failed to cancel order', 'error');
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                    <p className="text-sm text-gray-600">
                      Placed on: {new Date(order.createdAt || order.orderDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-xl font-bold">
                      ₹{(order.totalPrice || order.totalAmount || 0)?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items?.map((item, index) => {
                    // Debug logging to find actual image structure
                    console.log(`Item ${index}:`, item);
                    
                    // Try multiple possible image paths
                    const imageUrl = 
                      item.product?.imageUrls?.[0] ||
                      item.product?.image ||
                      item.imageUrl ||
                      item.product?.image_url ||
                      item.picture ||
                      item.product?.picture ||
                      'https://via.placeholder.com/80x80';
                    
                    const productName = item.product?.name || item.productName || 'Product';
                    const productId = item.product?.id || item.productId;
                    
                    return (
                      <div key={index} className="flex gap-4">
                        <img
                          src={imageUrl}
                          alt={productName}
                          className="w-20 h-20 object-cover rounded"
                          onError={(e) => {
                            console.log('Image failed to load:', imageUrl);
                            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                          }}
                        />
                        <div className="flex-1">
                          <Link
                            to={`/products/${productId}`}
                            className="font-semibold hover:text-primary transition-colors"
                          >
                            {productName}
                          </Link>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × ₹{item.price?.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ₹{(item.subtotal)?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
                  <Link
                    to={`/orders/${order.id}`}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </Link>
                  
                  {order.status?.toLowerCase() === 'delivered' && (
                    <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Download Invoice
                    </button>
                  )}
                  
                  {['PLACED', 'SHIPPED'].includes(order.status) && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                  
                  {order.status === 'DELIVERED' && (
                    <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-yellow-600 transition-colors">
                      Write Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;