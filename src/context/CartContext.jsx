import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Update localStorage, total price, and total items whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Calculate total price and items
    const { price, items } = cartItems.reduce(
      (acc, item) => {
        return {
          price: acc.price + item.price * item.quantity,
          items: acc.items + item.quantity,
        };
      },
      { price: 0, items: 0 }
    );
    
    setTotalPrice(price);
    setTotalItems(items);
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => 
        cartItem.pizza._id === item.pizza._id && 
        cartItem.size === item.size
    );

    if (existingItemIndex !== -1) {
      // Item already exists in cart, update quantity
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += item.quantity;
      setCartItems(updatedCartItems);
    } else {
      // Item doesn't exist in cart, add it
      setCartItems([...cartItems, item]);
    }
  };

  // Remove item from cart
  const removeFromCart = (id, size) => {
    setCartItems(
      cartItems.filter(
        (item) => !(item.pizza._id === id && item.size === size)
      )
    );
  };

  // Update item quantity
  const updateQuantity = (id, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }

    setCartItems(
      cartItems.map((item) => 
        item.pizza._id === id && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Clear the cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 