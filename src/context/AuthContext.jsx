import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Make sure API_URL matches the backend server's URL and port
const API_URL = 'https://pizza-backend-xi.vercel.app/api/auth';

// Setup axios interceptors for authentication
const setupAxiosInterceptors = (token) => {
  // Clear existing interceptors
  if (axios.interceptors.request.handlers?.length > 0) {
    axios.interceptors.request.eject(axios.interceptors.request.handlers[0]);
  }
  if (axios.interceptors.response.handlers?.length > 0) {
    axios.interceptors.response.eject(axios.interceptors.response.handlers[0]);
  }
  
  // Request interceptor to add auth token to headers
  axios.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Response interceptor to handle token expiration
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token expired or invalid, log the user out
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
      return Promise.reject(error);
    }
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial load
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Setup axios interceptors with the token
          if (parsedUser.token) {
            setupAxiosInterceptors(parsedUser.token);
          }
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Starting registration process...");
      
      // Configure axios with proper timeout and headers
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000, // 15 seconds timeout
      };
      
      console.log(`Sending registration request to ${API_URL}/register`);
      
      const response = await axios.post(
        `${API_URL}/register`, 
        userData,
        config
      );
      
      console.log("Registration response received:", response.status);
      
      const userToStore = response.data;
      
      // Validate user data before storing
      if (!userToStore || !userToStore._id || !userToStore.token) {
        throw new Error('Invalid response from server');
      }
      
      // Setup interceptors with the new token
      setupAxiosInterceptors(userToStore.token);
      
      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));
      
      setLoading(false);
      return userToStore;
    } catch (error) {
      setLoading(false);
      console.error("Registration error details:", error);
      
      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Server responded with error:", error.response.status, error.response.data);
        const message = error.response.data?.message || 'Registration failed';
        setError(message);
        throw new Error(message);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from server:", error.request);
        const message = 'No response from server. Please try again later.';
        setError(message);
        throw new Error(message);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
        const message = error.message || 'Registration failed';
        setError(message);
        throw new Error(message);
      }
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Starting login process...");
      
      // Configure axios with proper timeout and headers
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000, // 15 seconds timeout
      };
      
      console.log(`Sending login request to ${API_URL}/login with email: ${email}`);
      
      const response = await axios.post(
        `${API_URL}/login`, 
        { email, password },
        config
      );
      
      console.log("Login response received:", response.status);
      
      const userToStore = response.data;
      
      // Validate user data before storing
      if (!userToStore || !userToStore._id || !userToStore.token) {
        throw new Error('Invalid response from server');
      }
      
      // Setup interceptors with the new token
      setupAxiosInterceptors(userToStore.token);
      
      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));
      
      setLoading(false);
      return userToStore;
    } catch (error) {
      setLoading(false);
      console.error("Login error details:", error);
      
      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Server responded with error:", error.response.status, error.response.data);
        const message = error.response.data?.message || 'Login failed';
        setError(message);
        throw new Error(message);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from server:", error.request);
        const message = 'No response from server. Please try again later.';
        setError(message);
        throw new Error(message);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
        const message = error.message || 'Login failed';
        setError(message);
        throw new Error(message);
      }
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting profile update with data:', profileData);
      
      if (!user || !user.token) {
        throw new Error('Not authenticated');
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        timeout: 10000
      };
      
      console.log('Making API request to:', `${API_URL}/profile`, 'with config:', config);
      
      const response = await axios.put(
        `${API_URL}/profile`,
        profileData,
        config
      );
      
      console.log('Profile update API response:', response.data);
      
      const updatedUser = {
        ...user,
        ...response.data
      };
      
      // Update local storage and state
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setLoading(false);
      return updatedUser;
    } catch (error) {
      setLoading(false);
      console.error('Profile update error details:', error);
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        const message = error.response.data?.message || 'Failed to update profile';
        setError(message);
        throw new Error(message);
      } else if (error.request) {
        const message = 'No response from server. Please try again later.';
        setError(message);
        throw new Error(message);
      } else {
        const message = error.message || 'Failed to update profile';
        setError(message);
        throw new Error(message);
      }
    }
  };

  // Logout user
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      // Call the backend logout endpoint (optional)
      await axios.get(`${API_URL}/logout`, {
        timeout: 5000 // 5 seconds timeout
      });
      
      // Always clear local storage and state
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
      
      // Redirect to login page
      window.location.href = '/menu';
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if API call fails, we want to log out on the client side
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
      
      // Redirect to login page
      window.location.href = '/menu';
    }
  }, []);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!user && !!user.token;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 