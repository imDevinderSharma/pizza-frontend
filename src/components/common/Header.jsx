import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <h1>Pizza<span>Host</span></h1>
            </Link>
          </div>
          
          <div className="mobile-controls">
            <Link to="/cart" className="mobile-cart-icon">
              <span className="cart-icon-text">Cart</span>
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </Link>
            
            <button 
              className="mobile-menu-button" 
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          
          <nav className={`navigation ${mobileMenuOpen ? 'open' : ''}`}>
            <ul>
              <li>
                <Link to="/" onClick={closeMobileMenu}>Home</Link>
              </li>
              <li>
                <Link to="/menu" onClick={closeMobileMenu}>Menu</Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link to="/profile" onClick={closeMobileMenu}>My Profile</Link>
                  </li>
                  <li>
                    <Link to="/orders" onClick={closeMobileMenu}>My Orders</Link>
                  </li>
                  <li>
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" onClick={closeMobileMenu}>Login</Link>
                  </li>
                  <li>
                    <Link to="/register" onClick={closeMobileMenu}>Register</Link>
                  </li>
                </>
              )}
              <li className="desktop-cart-item">
                <Link to="/cart" className="cart-icon" onClick={closeMobileMenu}>
                  Cart
                  {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 