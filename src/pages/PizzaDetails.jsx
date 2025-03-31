import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import pizzaData from '../data/pizzas';

const PizzaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('medium');
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    setTimeout(() => {
      const foundPizza = pizzaData.find(p => p._id === id);
      
      if (foundPizza) {
        setPizza(foundPizza);
        setLoading(false);
      } else {
        setError('Pizza not found. Please try another selection.');
        setLoading(false);
      }
    }, 300); // Short timeout to simulate loading
  }, [id]);
  
  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };
  
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };
  
  const getPrice = () => {
    if (!pizza) return 0;
    return pizza.prices[selectedSize] || 0;
  };
  
  const handleAddToCart = () => {
    if (pizza) {
      const itemToAdd = {
        pizza: pizza,
        quantity: quantity,
        size: selectedSize,
        price: getPrice()
      };
      
      addToCart(itemToAdd);
      navigate('/cart');
    }
  };
  
  if (loading) {
    return (
      <div className="pizza-details-page">
        <div className="container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }
  
  if (error || !pizza) {
    return (
      <div className="pizza-details-page">
        <div className="container">
          <div className="error-message">{error || 'Pizza not found'}</div>
          <button onClick={() => navigate('/menu')} className="btn btn-primary">
            Back to Menu
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pizza-details-page">
      <div className="container">
        <div className="pizza-details">
          <div className="pizza-image">
            <img src={pizza.image} alt={pizza.name} />
          </div>
          
          <div className="pizza-info">
            <h1>{pizza.name}</h1>
            <p className="category">{pizza.category.charAt(0).toUpperCase() + pizza.category.slice(1)}</p>
            <p className="description">{pizza.description}</p>
            
            <div className="ingredients">
              <h3>Ingredients</h3>
              <ul>
                {pizza.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            
            <div className="size-selection">
              <h3>Choose Your Size</h3>
              <div className="size-options">
                <button 
                  className={selectedSize === 'small' ? 'active' : ''}
                  onClick={() => handleSizeChange('small')}
                >
                  Small
                </button>
                <button 
                  className={selectedSize === 'medium' ? 'active' : ''}
                  onClick={() => handleSizeChange('medium')}
                >
                  Medium
                </button>
                <button 
                  className={selectedSize === 'large' ? 'active' : ''}
                  onClick={() => handleSizeChange('large')}
                >
                  Large
                </button>
              </div>
            </div>
            
            <div className="quantity-selection">
              <h3>Quantity</h3>
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="price-section">
              <h3>Price</h3>
              <p className="price">₹{(getPrice() * quantity).toFixed(2)}</p>
            </div>
            
            <div className="button-container">
              <button className="btn btn-primary add-to-cart" onClick={handleAddToCart}>
                Add to Cart
              </button>
              
              <button className="btn btn-secondary back-button" onClick={() => navigate('/menu')}>
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaDetails; 