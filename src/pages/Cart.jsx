import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (isAuthenticated()) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: '/checkout' } });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="container">
          <div className="cart-header">
            <h1>Your Cart</h1>
          </div>
          
          <div className="empty-cart-message">
            <i className="fas fa-shopping-cart"></i>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any pizzas to your cart yet.</p>
            <Link to="/menu" className="btn btn-primary">
              Browse Our Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Your Cart</h1>
          <button className="clear-cart" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={`${item.pizza._id}-${item.size}`} className="cart-item">
                <div className="item-image">
                  <img src={item.pizza.image} alt={item.pizza.name} />
                </div>
                
                <div className="item-details">
                  <h3>{item.pizza.name}</h3>
                  <p>Size: {item.size.charAt(0).toUpperCase() + item.size.slice(1)}</p>
                  <p className="item-price-mobile">₹{item.price.toFixed(2)} each</p>
                </div>
                
                <div className="item-quantity">
                  <button 
                    onClick={() => updateQuantity(item.pizza._id, item.size, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.pizza._id, item.size, item.quantity + 1)}
                    disabled={item.quantity >= 10}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                
                <div className="item-total">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  className="remove-item" 
                  onClick={() => removeFromCart(item.pizza._id, item.size)}
                  aria-label="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="price-details">
              <div className="price-row">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="price-row">
                <span>Delivery Fee</span>
                <span>₹50.00</span>
              </div>
              
              <div className="price-row total">
                <span>Total</span>
                <span>₹{(totalPrice + 50).toFixed(2)}</span>
              </div>
            </div>
            
            <button className="btn btn-primary btn-block" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            
            <div className="continue-shopping">
              <Link to="/menu">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 