import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <section className="hero-banner" aria-label="Welcome banner">
      <div className="hero-background">
        <div className="overlay"></div>
      </div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Fresh, Hot, and Delivered <span className="highlight">with Love</span>!
            </h1>
            <p>
              Indulge in the ultimate pizza experience with our handcrafted, 
              authentic recipes using only the freshest ingredients.
            </p>
            <div className="hero-buttons">
              <Link to="/menu" className="btn btn-primary">
                Order Now
              </Link>
              <Link to="/menu" className="btn btn-secondary">
                Explore Menu
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80" alt="Delicious pizza" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner; 