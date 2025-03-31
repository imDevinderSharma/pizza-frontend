import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user._id) {
        setLoading(false);
        setError('You must be logged in to view your orders');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // First try to get orders from localStorage
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const userOrders = storedOrders.filter(order => 
          order.user === user._id || 
          (order.userId && order.userId === user._id)
        );
        
        // Sort orders by date (newest first)
        userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        if (userOrders.length > 0) {
          setOrders(userOrders);
        } else {
          // If no orders in localStorage, try API
          try {
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`
              }
            };
            
            const response = await axios.get('https://pizza-backend-coral.vercel.app/api/orders/myorders', config);
            
            if (response.data && response.data.length > 0) {
              // Save orders to localStorage for future use
              localStorage.setItem('orders', JSON.stringify(response.data));
              setOrders(response.data);
            } else {
              // No orders found
              setOrders([]);
            }
          } catch (apiError) {
            console.log('API fetch failed:', apiError);
            // If API fails too, we just use whatever we found in localStorage
            setOrders(userOrders);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);
  
  // Format date to a readable string
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status class for styling
  const getStatusClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'status-delivered';
      case 'on the way':
        return 'status-on-the-way';
      case 'preparing':
        return 'status-preparing';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <h1>My Orders</h1>
          <div className="loading-spinner">Loading your orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="container">
          <h1>My Orders</h1>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <Link to="/menu" className="btn btn-primary">
              Browse Our Menu
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-id">
                    <span>Order #:</span> {order._id.substring(0, 8)}...
                  </div>
                  <div className="order-date">
                    <span>Placed on:</span> {formatDate(order.createdAt)}
                  </div>
                  <div className={`order-status ${getStatusClass(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>
                
                <div className="order-items">
                  <h3>Items</h3>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.quantity} x {item.pizza?.name || item.name} ({item.size.charAt(0).toUpperCase() + item.size.slice(1)}) - ₹{item.price}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="order-summary">
                  <div className="delivery-address">
                    <h3>Delivery Address</h3>
                    {order.deliveryAddress ? (
                      <p>
                        {order.deliveryAddress.street || ''}, {order.deliveryAddress.city || ''}, {order.deliveryAddress.state || ''} {order.deliveryAddress.zipCode || ''}
                      </p>
                    ) : (
                      <p>No delivery address available</p>
                    )}
                  </div>
                  
                  <div className="payment-info">
                    <div className="payment-method">
                      <span>Payment Method:</span> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
                    </div>
                    <div className="payment-status">
                      <span>Payment Status:</span> {order.paymentMethod === 'cod' ? 'Pending' : 'Paid'}
                    </div>
                    <div className="order-total">
                      <span>Total:</span> ₹{(order.totalPrice || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="order-actions">
                  <Link to={`/order/${order._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="back-to-profile">
          <Link to="/profile">
            Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Orders; 