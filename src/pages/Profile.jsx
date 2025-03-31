import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, isAuthenticated } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [activeTab, setActiveTab] = useState('profile');
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      fetchUserProfile();
    }
  }, [isAuthenticated, navigate]);
  
  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true);
      
      if (!user || !user.token) {
        throw new Error('Authentication token missing');
      }
      
      // Make API call to get profile data if needed
      // Otherwise just use the user data from context
      setFormData({
        ...formData,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || ''
        }
      });
      
      setProfileLoading(false);
    } catch (error) {
      console.error('Profile fetch error:', error);
      setError('Failed to load profile data');
      setProfileLoading(false);
    }
  };
  
  const validateField = (parent, name, value) => {
    let error = '';
    
    if (parent === 'password') {
      switch (name) {
        case 'currentPassword':
          if (!value && (formData.newPassword || formData.confirmPassword)) {
            error = 'Current password is required';
          }
          break;
        case 'newPassword':
          if (value && value.length < 6) {
            error = 'Password must be at least 6 characters';
          }
          break;
        case 'confirmPassword':
          if (value !== formData.newPassword) {
            error = 'Passwords do not match';
          }
          break;
        default:
          break;
      }
    }
    
    return error;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear messages when user types
    if (message) setMessage(null);
    if (error) setError(null);
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      // Validate password fields
      if (['currentPassword', 'newPassword', 'confirmPassword'].includes(name)) {
        const error = validateField('password', name, value);
        setFieldErrors({
          ...fieldErrors,
          [name]: error
        });
      }
      
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      
      console.log('Submitting profile data:', {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });
      
      // Update user profile via API
      const updatedUser = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });
      
      console.log('Profile update response:', updatedUser);
      
      setMessage('Profile updated successfully');
      setLoading(false);
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.message || 'Failed to update profile');
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Password validation
    const errors = {};
    let hasErrors = false;
    
    if (!formData.currentPassword && (formData.newPassword || formData.confirmPassword)) {
      errors.currentPassword = 'Current password is required';
      hasErrors = true;
    }
    
    if (formData.newPassword && formData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
      hasErrors = true;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      hasErrors = true;
    }
    
    if (hasErrors) {
      setFieldErrors(errors);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      
      // Update user password via API
      await updateProfile({
        currentPassword: formData.currentPassword,
        password: formData.newPassword
      });
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setMessage('Password updated successfully');
      setLoading(false);
    } catch (error) {
      console.error('Password update error:', error);
      setError(error.message || 'Failed to update password');
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
  };
  
  if (profileLoading) {
    return (
      <div className="profile-page">
        <div className="container">
          <h1>My Profile</h1>
          <div className="loading">Loading profile data...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="profile-page">
      <div className="container">
        <h1>My Profile</h1>
        
        <div className="profile-tabs">
          <button 
            className={activeTab === 'profile' ? 'active' : ''} 
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button 
            className={activeTab === 'password' ? 'active' : ''} 
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''} 
            onClick={() => navigate('/orders')}
          >
            My Orders
          </button>
        </div>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
              />
              <small>Email cannot be changed</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            
            <h3>Delivery Address</h3>
            
            <div className="form-group">
              <label htmlFor="street">Street Address</label>
              <input
                type="text"
                id="street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="zipCode">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
        
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                disabled={loading}
              />
              {fieldErrors.currentPassword && (
                <div className="field-error">{fieldErrors.currentPassword}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                disabled={loading}
              />
              <small>Password must be at least 6 characters long</small>
              {fieldErrors.newPassword && (
                <div className="field-error">{fieldErrors.newPassword}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
              {fieldErrors.confirmPassword && (
                <div className="field-error">{fieldErrors.confirmPassword}</div>
              )}
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
        
        <div className="logout-container">
          <button onClick={handleLogout} className="btn btn-outline">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 