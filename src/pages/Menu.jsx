import { useState, useEffect } from 'react';
import PizzaCard from '../components/menu/PizzaCard';
import pizzaData from '../data/pizzas';

const Menu = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    setTimeout(() => {
      let filteredPizzas = [...pizzaData];
      
      if (selectedCategory !== 'all') {
        filteredPizzas = pizzaData.filter(pizza => pizza.category === selectedCategory);
      }
      
      setPizzas(filteredPizzas);
      setLoading(false);
    }, 500); // Simulate a half-second loading time
  }, [selectedCategory]);

  // Filter pizzas based on search term
  const filteredPizzas = pizzas.filter((pizza) =>
    pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pizza.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pizza.ingredients.some((ingredient) =>
      ingredient.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="menu-page">
      <div className="container">
        <div className="menu-header">
          <h1>Our Pizza Menu</h1>
          <p>Discover our range of delicious pizzas, handcrafted with the freshest ingredients</p>
        </div>

        <div className="menu-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search pizzas, ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>

          <div className="category-filters">
            <button
              className={selectedCategory === 'all' ? 'active' : ''}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            <button
              className={selectedCategory === 'vegetarian' ? 'active' : ''}
              onClick={() => setSelectedCategory('vegetarian')}
            >
              Vegetarian
            </button>
            <button
              className={selectedCategory === 'non-vegetarian' ? 'active' : ''}
              onClick={() => setSelectedCategory('non-vegetarian')}
            >
              Non-Vegetarian
            </button>
            <button
              className={selectedCategory === 'specialty' ? 'active' : ''}
              onClick={() => setSelectedCategory('specialty')}
            >
              Specialty
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : filteredPizzas.length === 0 ? (
          <div className="no-results">
            <p>No pizzas found matching your criteria.</p>
            <button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="pizzas-grid">
            {filteredPizzas.map((pizza) => (
              <PizzaCard key={pizza._id} pizza={pizza} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu; 