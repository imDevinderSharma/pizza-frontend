import { Link } from 'react-router-dom';
import pizzaData from '../../data/pizzas';
import PizzaCard from '../menu/PizzaCard';

const FeaturedPizzas = () => {
  // Filter popular pizzas
  const popularPizzas = pizzaData.filter(pizza => pizza.isPopular);
  
  return (
    <section className="featured-pizzas">
      <div className="container">
        <h2>Our Most Popular Pizzas</h2>
        <p>Try our customer favorites - crafted with love and the finest ingredients</p>
        
        <div className="pizzas-grid">
          {popularPizzas.map(pizza => (
            <PizzaCard key={pizza._id} pizza={pizza} />
          ))}
        </div>
        
        <Link to="/menu" className="btn btn-secondary view-all">
          View All Pizzas
        </Link>
      </div>
    </section>
  );
};

export default FeaturedPizzas; 