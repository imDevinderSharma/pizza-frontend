import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        
        try {
          // First try to fetch from API
          const response = await axios.get(`http://localhost:3001/api/orders/${id}`, config);
          setOrder(response.data);
          setLoading(false);
        } catch (apiError) {
          console.log('API fetch failed, trying localStorage:', apiError);
          
          // If API call fails, try to get from localStorage
          const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
          const foundOrder = storedOrders.find(order => order._id === id);
          
          if (foundOrder) {
            setOrder(foundOrder);
            setLoading(false);
          } else {
            throw new Error('Order not found in localStorage either');
          }
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError(error.message || 'Failed to fetch order details');
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id, user]);
  
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
  
  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Try API first, then fall back to localStorage
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        await axios.put(`http://localhost:3001/api/orders/${id}/cancel`, {}, config);
        
        // Refresh order data from API
        const response = await axios.get(`http://localhost:3001/api/orders/${id}`, config);
        setOrder(response.data);
      } catch (apiError) {
        console.log('API cancel failed, updating localStorage:', apiError);
        
        // If API call fails, update localStorage
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const orderIndex = storedOrders.findIndex(order => order._id === id);
        
        if (orderIndex !== -1) {
          storedOrders[orderIndex].status = 'cancelled';
          localStorage.setItem('orders', JSON.stringify(storedOrders));
          setOrder(storedOrders[orderIndex]);
        } else {
          throw new Error('Order not found in localStorage');
        }
      }
      
      setLoading(false);
      window.alert('Order cancelled successfully');
    } catch (error) {
      setError(error.message || 'Failed to cancel order');
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="order-details-page">
        <div className="container">
          <h1>Order Details</h1>
          <div className="loading-spinner">Loading order details...</div>
        </div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="order-details-page">
        <div className="container">
          <h1>Order Details</h1>
          <div className="error-message">{error || 'Order not found'}</div>
          <Link to="/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <div className="container">
        <h1>Order Details</h1>
        
        <div className="order-info">
          <div className="order-header">
            <div className="order-id">
              <span>Order #:</span> {order._id}
            </div>
            <div className="order-date">
              <span>Placed on:</span> {formatDate(order.createdAt)}
            </div>
            <div className={`order-status ${getStatusClass(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>
          
          <div className="order-items-section">
            <h2>Items Ordered</h2>
            <div className="order-items">
              {order.items.map((item, index) => {
                // Handle both localStorage and API response structures
                const pizzaName = item.pizza?.name || item.name;
                const pizzaImage = item.pizza?.image || '';
                
                return (
                  <div key={index} className="order-item">
                    {pizzaImage && (
                      <div className="item-image">
                        <img src={pizzaImage} alt={pizzaName} />
                      </div>
                    )}
                    
                    <div className="item-details">
                      <h3>{pizzaName}</h3>
                      <p className="item-size">Size: {item.size.charAt(0).toUpperCase() + item.size.slice(1)}</p>
                      <p className="item-quantity">Quantity: {item.quantity}</p>
                      <p className="item-price">Price: ₹{item.price} each</p>
                      <p className="item-total">Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="order-details-section">
            <div className="delivery-info">
              <h2>Delivery Information</h2>
              <p className="delivery-address">
                <strong>Address:</strong> {
                  order.deliveryAddress 
                    ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.zipCode}`
                    : `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`
                }
              </p>
              <p className="contact-phone">
                <strong>Contact:</strong> {order.contactPhone || order.phone || 'N/A'}
              </p>
              
              {order.instructions && (
                <p className="delivery-instructions">
                  <strong>Instructions:</strong> {order.instructions}
                </p>
              )}
            </div>
            
            <div className="payment-details">
              <h2>Payment Details</h2>
              <p className="payment-method">
                <strong>Method:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
              </p>
              <p className="payment-status">
                <strong>Status:</strong> {
                  order.paymentStatus 
                    ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)
                    : order.paymentMethod === 'cod' ? 'Pending' : 'Paid'
                }
              </p>
              
              <div className="order-summary">
                <div className="summary-item">
                  <span>Subtotal:</span>
                  <span>₹{((order.totalPrice || order.totalAmount) - 50).toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span>Delivery Fee:</span>
                  <span>₹50.00</span>
                </div>
                <div className="summary-total">
                  <span>Total:</span>
                  <span>₹{(order.totalPrice || order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-actions">
            {order.status === 'pending' && (
              <button onClick={handleCancelOrder} className="btn btn-secondary">
                Cancel Order
              </button>
            )}
            
            <Link to="/orders" className="btn btn-primary">
              Back to Orders
            </Link>
            
            {order.status === 'delivered' && (
              <button 
                onClick={() => {
                  const pizzaId = order.items[0].pizza?._id || order.items[0].pizzaId;
                  navigate(`/pizza/${pizzaId}`);
                }} 
                className="btn btn-primary"
              >
                Reorder
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 