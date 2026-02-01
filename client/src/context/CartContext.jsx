import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from local storage on startup
  useEffect(() => {
    const savedCart = localStorage.getItem('occazionals_cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  // Save to local storage whenever cart changes
  useEffect(() => {
    localStorage.setItem('occazionals_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, orderType, size) => {
    const newItem = {
      ...product,
      orderType, // 'rent' or 'sale'
      selectedSize: size,
      cartId: `${product._id}-${orderType}-${size}` // Unique ID for cart items
    };

    setCartItems((prev) => {
      const exists = prev.find(item => item.cartId === newItem.cartId);
      if (exists) return prev; // Avoid duplicates or increment quantity logic
      return [...prev, newItem];
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems((prev) => prev.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((acc, item) => 
    acc + (item.orderType === 'rent' ? item.rentalPrice : item.salePrice), 0
  );

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);