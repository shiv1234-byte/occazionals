import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 1. Load cart safely
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('Occasionals_cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));
    } catch (err) {
      console.error("Cart loading error:", err);
    }
  }, []);

  // 2. Persistent storage
  useEffect(() => {
    localStorage.setItem('Occasionals_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, orderType, size, quantity = 1) => {
    const cartId = `${product._id}-${orderType}-${size}`;

    setCartItems((prev) => {
      const exists = prev.find(item => item.cartId === cartId);
      
      if (exists) {
        // Agar item pehle se hai, toh quantity badhao (Useful for Store logic)
        return prev.map(item => 
          item.cartId === cartId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      
      // Naya item add karo
      return [...prev, { 
        ...product, 
        orderType, 
        selectedSize: size, 
        quantity, 
        cartId 
      }];
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems((prev) => prev.filter(item => item.cartId !== cartId));
  };

  // Quantity update logic (For Cart Page buttons)
  const updateQuantity = (cartId, delta) => {
    setCartItems((prev) => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  // Final Total Calculation (Quantity factored in)
  const cartTotal = cartItems.reduce((acc, item) => {
    const price = item.orderType === 'rent' ? item.rentalPrice : item.salePrice;
    return acc + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartTotal,
      cartCount: cartItems.reduce((acc, item) => acc + item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};