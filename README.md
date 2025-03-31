# Pizza Booking App

A modern, full-stack web application for ordering pizza online with real-time notifications, user authentication, and order tracking.

## Features

- **User Authentication**: Register, login, and profile management
- **Menu Management**: Browse pizzas with filtering options
- **Shopping Cart**: Add, remove, and update items
- **Checkout Process**: Secure payment processing
- **Order History**: Track past and current orders
- **Real-time Notifications**:
  - Email notifications for new orders
  - Browser push notifications
  - Web dashboard for order management

## Technology Stack

### Frontend
- React.js (with Vite)
- React Router for navigation
- Context API for state management
- Axios for API requests
- CSS for styling

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for email notifications
- Web-Push for browser notifications

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Gmail account (for email notifications)

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables by updating the `.env` file:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_gmail_email
   EMAIL_PASSWORD=your_gmail_app_password
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

4. Open your browser and visit: `http://localhost:5173`

## Notification System

### Email Notifications
When a customer places an order, the system sends an email with order details to the configured email address.

To set up email notifications:
1. Enable 2-Step Verification on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Update `EMAIL_PASSWORD` in the `.env` file

### Push Notifications
The app supports browser push notifications for instant order alerts:
1. Visit `http://localhost:3001/notifications`
2. Click "Enable Push Notifications"
3. Receive instant alerts when new orders are placed

### Web Dashboard
All order notifications are accessible through a web interface:
- URL: `http://localhost:3001/notifications`
- Displays customer details, delivery address, ordered items, and payment information
- Refreshes in real-time to show new orders

## Directory Structure

```
/pizza-booking
  /backend
    /src
      /controllers  - Business logic
      /models       - Database schemas
      /routes       - API routes
      /middleware   - Custom middleware
      app.js        - Main application file
    /notifications  - Notification system
    /email_queue    - Email processing
  
  /frontend
    /src
      /components   - UI components
      /pages        - Page components
      /context      - State management
      /routes       - Application routes
      /assets       - Images and styles
      /data         - Static data
      /utils        - Utility functions
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get user profile (protected)

### Menu
- `GET /api/pizzas` - Get all pizzas
- `GET /api/pizzas/:id` - Get a specific pizza

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get a specific order