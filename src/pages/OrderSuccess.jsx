import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = () => {
      // Get orderId from location state
      const orderId = location.state?.orderId;
      
      if (!orderId) {
        navigate('/menu');
        return;
      }
      
      try {
        // Get orders from localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const foundOrder = orders.find(order => order._id === orderId);
        
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError('Order not found');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Could not load order details');
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="order-success-page">
        <div className="container">
          <div className="loading-spinner">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-success-page">
        <div className="container">
          <div className="error-message">{error}</div>
          <Link to="/menu" className="btn btn-primary">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="success-content">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          
          <h1>Order Successfully Placed!</h1>
          
          <p className="success-message">
            Thank you for your order. Your delicious pizza is being prepared and will be on its way soon!
          </p>
          
          {order && (
            <div className="order-info">
              <h2>Order Details</h2>
              
              <div className="order-detail-item">
                <span>Order ID:</span>
                <span>{order._id}</span>
              </div>
              
              <div className="order-detail-item">
                <span>Order Date:</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              
              <div className="order-detail-item">
                <span>Total Amount:</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="order-detail-item">
                <span>Payment Method:</span>
                <span>
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
                </span>
              </div>
              
              <div className="order-detail-item">
                <span>Status:</span>
                <span className="order-status">{order.status}</span>
              </div>
            </div>
          )}
          
          <div className="delivery-estimate">
            <h3>Estimated Delivery Time</h3>
            <p>Your order will be delivered in approximately 30-45 minutes.</p>
          </div>
          
          <div className="success-actions">
            <Link to="/menu" className="btn btn-primary">
              Order More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess; 