import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>Pizza<span>Host</span></h2>
            <p>Fresh, Hot, and Delivered with Love!</p>
            <p className="footer-description">
              At PizzaHost, we're committed to serving the most delicious pizzas 
              made with fresh ingredients and time-honored recipes.
            </p>
          </div>
          
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/profile">My Account</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p><i className="fas fa-map-marker-alt" aria-hidden="true"></i> 123 Pizza Street, Pizza City</p>
            <p><i className="fas fa-phone" aria-hidden="true"></i> +1 234-567-8900</p>
            <p><i className="fas fa-envelope" aria-hidden="true"></i> info@pizzahost.com</p>
            <p className="opening-hours">
              <i className="fas fa-clock" aria-hidden="true"></i> 
              <span>
                <strong>Opening Hours:</strong><br />
                Mon-Sun: 10:00 AM - 11:00 PM
              </span>
            </p>
          </div>
          
          <div className="footer-social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow us on Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Subscribe to our YouTube channel"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
            
            <div className="newsletter">
              <h3>Newsletter</h3>
              <p>Subscribe for special offers</p>
              <form className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  aria-label="Email for newsletter"
                  required 
                />
                <button type="submit" aria-label="Subscribe to newsletter">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {year} PizzaHost. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 