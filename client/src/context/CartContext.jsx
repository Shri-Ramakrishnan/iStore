import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem("istore_cart");
    return stored ? JSON.parse(stored) : [];
  });

  const sync = (next) => {
    setItems(next);
    localStorage.setItem("istore_cart", JSON.stringify(next));
  };

  const addToCart = (product, qty = 1) => {
    const existing = items.find((i) => i.product._id === product._id);
    if (existing) {
      const next = items.map((i) =>
        i.product._id === product._id ? { ...i, qty: i.qty + qty } : i
      );
      sync(next);
    } else {
      sync([...items, { product, qty }]);
    }
  };

  const removeFromCart = (id) => {
    sync(items.filter((i) => i.product._id !== id));
  };

  const updateQty = (id, qty) => {
    const next = items.map((i) =>
      i.product._id === id ? { ...i, qty: Math.max(1, qty) } : i
    );
    sync(next);
  };

  const clearCart = () => sync([]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  const value = useMemo(
    () => ({ items, addToCart, removeFromCart, updateQty, clearCart, subtotal }),
    [items, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
