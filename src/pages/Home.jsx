import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/homepage/HeroBanner';
import FeaturedPizzas from '../components/homepage/FeaturedPizzas';
import Testimonials from '../components/homepage/Testimonials';

const Home = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set document title
    document.title = 'Pizza Delight - Fresh, Hot, and Delicious Pizzas';
  }, []);

  return (
    <div className="home-page">
      <HeroBanner />
      
      <section className="welcome-section">
        <div className="container">
          <h2>Welcome to <span className="highlight">Pizza Delight</span></h2>
          <p>
            At Pizza Delight, we believe in the magic of a perfect pizza. From our kitchen to your table, 
            we strive to create the most delicious and authentic pizzas using only the freshest ingredients.
          </p>
          
          <div className="features-grid">
            <div className="feature">
              <i className="fas fa-pizza-slice"></i>
              <h3>Quality Ingredients</h3>
              <p>We use only the freshest ingredients, sourced from trusted local suppliers.</p>
            </div>
            
            <div className="feature">
              <i className="fas fa-truck"></i>
              <h3>Fast Delivery</h3>
              <p>Your pizza delivered to your doorstep, hot and fresh in 30 minutes or less.</p>
            </div>
            
            <div className="feature">
              <i className="fas fa-leaf"></i>
              <h3>Healthier Options</h3>
              <p>A wide range of options for the health-conscious pizza lovers.</p>
            </div>
          </div>
        </div>
      </section>
      
      <FeaturedPizzas />
      
      <Testimonials />
      
      <section className="cta-section">
        <div className="container">
          <h2>Ready to order your pizza?</h2>
          <p>Get your favorite pizza delivered right to your doorstep!</p>
          <Link to="/menu" className="btn btn-secondary">Order Now</Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 