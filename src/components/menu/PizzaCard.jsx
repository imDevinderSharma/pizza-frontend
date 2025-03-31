import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

const PizzaCard = ({ pizza }) => {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Calculate price based on selected size
  const price = pizza.prices[selectedSize];

  const handleAddToCart = () => {
    const cartItem = {
      pizza,
      quantity,
      size: selectedSize,
      price,
    };
    
    addToCart(cartItem);
    
    // Show success indicator
    setAddedToCart(true);
    
    // Reset success indicator after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };
  
  const handleViewDetails = () => {
    navigate(`/pizza/${pizza._id}`);
  };

  return (
    <div className="pizza-card">
      <div 
        className="pizza-image" 
        onClick={handleViewDetails}
        role="button"
        tabIndex="0"
        aria-label={`View details for ${pizza.name}`}
      >
        <img src={pizza.image} alt={pizza.name} />
        {pizza.isPopular && <span className="popular-tag">Popular</span>}
      </div>
      
      <div className="pizza-content">
        <h3 className="pizza-name">
          <Link to={`/pizza/${pizza._id}`}>{pizza.name}</Link>
        </h3>
        
        <p className="pizza-description">{pizza.description}</p>
        
        <div className="pizza-ingredients">
          <small>
            <strong>Ingredients:</strong> {pizza.ingredients.join(', ')}
          </small>
        </div>
        
        <div className="pizza-options">
          <div className="size-options">
            <label>Size:</label>
            <div className="size-buttons">
              <button
                type="button"
                className={selectedSize === 'small' ? 'active' : ''}
                onClick={() => setSelectedSize('small')}
                aria-pressed={selectedSize === 'small'}
              >
                Small
              </button>
              <button
                type="button"
                className={selectedSize === 'medium' ? 'active' : ''}
                onClick={() => setSelectedSize('medium')}
                aria-pressed={selectedSize === 'medium'}
              >
                Medium
              </button>
              <button
                type="button"
                className={selectedSize === 'large' ? 'active' : ''}
                onClick={() => setSelectedSize('large')}
                aria-pressed={selectedSize === 'large'}
              >
                Large
              </button>
            </div>
          </div>
          
          <div className="quantity-selector">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button 
                type="button"
                onClick={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span aria-live="polite">{quantity}</span>
              <button 
                type="button"
                onClick={() => setQuantity(prev => Math.min(prev + 1, 10))}
                disabled={quantity >= 10}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </div>
        
        <div className="pizza-footer">
          <div className="pizza-price">₹{price.toFixed(2)}</div>
          <button 
            className={`add-to-cart ${addedToCart ? 'added' : ''}`} 
            onClick={handleAddToCart}
            disabled={addedToCart}
          >
            {addedToCart ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard; 