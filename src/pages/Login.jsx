import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loading, error, setError, user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/menu');
    }

    // Check for token expired query param
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('expired') === 'true') {
      setFormError('Your session has expired. Please log in again.');
    }

    // Clear errors when component mounts
    return () => setError(null);
  }, [isAuthenticated, navigate, location.search, setError]);

  const handleChange = (e) => {
    // Clear errors when user types
    if (formError) setFormError('');
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    // Simple form validation
    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      await login(formData.email, formData.password);
      // Get the return URL from location state or default to menu
      const from = location.state?.from?.pathname || '/menu';
      navigate(from);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-form-container">
          <h1>Login to Your Account</h1>
          
          {formError && <div className="error-message">{formError}</div>}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={isSubmitting}
                autoFocus
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? 'Logging In...' : 'Login'}
            </button>
          </form>
          
          <div className="auth-links">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
            <p>
              <small>Demo credentials: demo@example.com / password123</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 