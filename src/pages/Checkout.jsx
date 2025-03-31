import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'cod',
    instructions: '',
    useProfileAddress: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
      }));
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  // Handle toggling between profile address and custom address
  useEffect(() => {
    if (formData.useProfileAddress && user?.address) {
      setFormData(prevData => ({
        ...prevData,
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
      }));
    }
  }, [formData.useProfileAddress, user]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Form validation
    if (!formData.street || !formData.city || !formData.state || !formData.zipCode) {
      setError('Please fill in all address fields');
      return;
    }
    
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    try {
      setLoading(true);
      
      // Log cart items for debugging
      console.log('Cart items:', JSON.stringify(cartItems, null, 2));
      console.log('User token:', user.token ? 'Token exists' : 'No token found');
      
      // Prepare order data
      const orderItems = cartItems.map(item => {
        console.log('Processing item:', JSON.stringify(item, null, 2));
        
        // Ensure pizza ID is correctly formatted
        let pizzaId = item.pizza;
        if (typeof item.pizza === 'object') {
          pizzaId = item.pizza._id;
          console.log('Pizza is an object, extracted ID:', pizzaId);
        } else {
          console.log('Pizza is already an ID:', pizzaId);
        }
        
        // Validate pizza ID
        if (!pizzaId) {
          console.error('Invalid pizza ID:', pizzaId);
          throw new Error('Invalid pizza data in cart');
        }
        
        return {
          pizza: pizzaId,
          quantity: item.quantity,
          size: item.size,
          price: item.price
        };
      });
      
      console.log('Prepared order items:', JSON.stringify(orderItems, null, 2));
      
      const orderData = {
        items: orderItems,
        totalPrice: totalPrice + 50, // Adding delivery fee
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        contactPhone: formData.phone,
        paymentMethod: formData.paymentMethod,
        instructions: formData.instructions
      };
      
      console.log('Submitting order data:', JSON.stringify(orderData, null, 2));
      console.log('API URL:', 'https://pizza-backend-xi.vercel.app/api/orders');
      console.log('Auth header:', `Bearer ${user.token.substring(0, 10)}...`);
      
      // Make API call to create order with more robust error handling
      try {
        const response = await fetch('https://pizza-backend-xi.vercel.app/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(orderData),
          // Add timeout and credentials for better cross-origin handling
          credentials: 'same-origin',
          mode: 'cors'
        });
        
        // Check response details for debugging
        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);
        
        const responseText = await response.text();
        console.log('Response body:', responseText);
        
        // Check for successful response
        if (!response.ok) {
          let errorData;
          try {
            errorData = JSON.parse(responseText);
            console.error('Error response parsed:', errorData);
          } catch (err) {
            console.error('Error parsing response:', err);
            errorData = { message: 'Unknown error occurred: ' + responseText.substring(0, 100) };
          }
          throw new Error(errorData.message || `Server error: ${response.status} ${response.statusText}`);
        }
        
        try {
          const createdOrder = JSON.parse(responseText);
          console.log('Order created successfully:', createdOrder);
          
          // Save order to localStorage as a fallback
          const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
          storedOrders.push(createdOrder);
          localStorage.setItem('orders', JSON.stringify(storedOrders));
          
          // Clear cart and redirect to success page
          clearCart();
          navigate('/order-success', { state: { orderId: createdOrder._id } });
        } catch (parseError) {
          console.error('Error parsing success response:', parseError);
          throw new Error('Successfully created order but received invalid response format');
        }
      } catch (fetchError) {
        console.error('Order fetch error:', fetchError);
        throw new Error(fetchError.message || 'Failed to communicate with the server');
      }
      
    } catch (error) {
      console.error('Order submission error:', error);
      setError(error.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };
  
  // Calculate subtotal, delivery fee, and total
  const subtotal = totalPrice;
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;
  
  // Move navigation to useEffect instead of during render
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate]);
  
  // Check if user has address in profile
  const hasProfileAddress = user?.address && user.address.street && user.address.city && user.address.state && user.address.zipCode;
  
  // Return early if navigating due to empty cart
  if (cartItems.length === 0) {
    return null;
  }
  
  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="checkout-content">
          <div className="checkout-form-container">
            <h2>Delivery Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Contact Details</h3>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number*</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h3>Delivery Address</h3>
                
                {hasProfileAddress && (
                  <div className="form-group checkbox-group">
                    <input
                      type="checkbox"
                      id="useProfileAddress"
                      name="useProfileAddress"
                      checked={formData.useProfileAddress}
                      onChange={handleChange}
                    />
                    <label htmlFor="useProfileAddress">Use my profile address</label>
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="street">Street Address*</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Enter your street address"
                    required
                    disabled={formData.useProfileAddress && hasProfileAddress}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City*</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                      required
                      disabled={formData.useProfileAddress && hasProfileAddress}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="state">State*</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter your state"
                      required
                      disabled={formData.useProfileAddress && hasProfileAddress}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="zipCode">Zip Code*</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="Enter your zip code"
                      required
                      disabled={formData.useProfileAddress && hasProfileAddress}
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>Delivery Instructions (Optional)</h3>
                <div className="form-group">
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    placeholder="Add any specific delivery instructions..."
                    rows="3"
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  <div className="payment-option">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                    />
                    <label htmlFor="cod">Cash on Delivery</label>
                  </div>
                  
                  <div className="payment-option">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                    />
                    <label htmlFor="card">Credit/Debit Card</label>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
          
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {cartItems.map((item, index) => (
                <div key={index} className="summary-item">
                  <div className="item-info">
                    <h3>{item.pizza.name}</h3>
                    <p>Size: {item.size.charAt(0).toUpperCase() + item.size.slice(1)} | Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="price-details">
              <div className="price-row">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Delivery Fee:</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="price-row total">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 