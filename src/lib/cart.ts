"use client";

import { useState, useEffect } from "react";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  sellerId: string;
  sellerName: string;
  quantity: number;
  imageUrl?: string | null;
  selected?: boolean;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("libris_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsLoaded(true);
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("libris_cart", JSON.stringify(newCart));
    // Dispatch custom event to notify other components (like Navbar)
    window.dispatchEvent(new Event("cart-updated"));
  };

  const addToCart = (item: Omit<CartItem, "quantity" | "selected">) => {
    const existingIndex = cart.findIndex((i) => i.id === item.id);
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      newCart[existingIndex].selected = true;
      if (item.imageUrl) {
        newCart[existingIndex].imageUrl = item.imageUrl;
      }
      saveCart(newCart);
    } else {
      saveCart([...cart, { ...item, quantity: 1, selected: true }]);
    }
  };

  const removeFromCart = (id: string) => {
    saveCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    saveCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const toggleSelection = (id: string) => {
    saveCart(cart.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)));
  };

  const toggleAll = (selected: boolean) => {
    saveCart(cart.map((item) => ({ ...item, selected })));
  };

  const toggleSeller = (sellerId: string, selected: boolean) => {
    saveCart(cart.map((item) => (item.sellerId === sellerId ? { ...item, selected } : item)));
  };

  const clearCart = () => {
    saveCart([]);
  };

  const removeSelected = () => {
    saveCart(cart.filter((item) => item.selected === false));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedTotal = cart.reduce((sum, item) => item.selected !== false ? sum + item.price * item.quantity : sum, 0);

  return { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    toggleSelection, 
    toggleAll, 
    toggleSeller, 
    clearCart, 
    removeSelected,
    total, 
    selectedTotal, 
    isLoaded 
  };
}
