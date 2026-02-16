import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext();

const buildCartKey = (productId, selectedColor) => `${productId}::${selectedColor}`;

const normalizeItem = (item) => {
  const productId = item?.product?._id;
  if (!productId) return null;

  const fallbackColor =
    item.selectedColor ||
    item.product.color ||
    item.product.colorOptions?.[0] ||
    "Default";

  return {
    product: item.product,
    qty: Math.max(1, Number(item.qty) || 1),
    selectedColor: fallbackColor,
    cartKey: item.cartKey || buildCartKey(productId, fallbackColor)
  };
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem("istore_cart");
    if (!stored) return [];

    try {
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(normalizeItem).filter(Boolean);
    } catch {
      return [];
    }
  });

  const sync = (next) => {
    setItems(next);
    localStorage.setItem("istore_cart", JSON.stringify(next));
  };

  const addToCart = (product, qty = 1, selectedColor) => {
    if (!product?._id) return;

    const color =
      selectedColor ||
      product.color ||
      product.colorOptions?.[0] ||
      "Default";

    const cartKey = buildCartKey(product._id, color);

    const existing = items.find((item) => item.cartKey === cartKey);

    if (existing) {
      const next = items.map((item) =>
        item.cartKey === cartKey
          ? { ...item, qty: item.qty + Math.max(1, Number(qty) || 1) }
          : item
      );
      sync(next);
      return;
    }

    sync([
      ...items,
      {
        cartKey,
        product,
        qty: Math.max(1, Number(qty) || 1),
        selectedColor: color
      }
    ]);
  };

  const removeFromCart = (cartKey) => {
    sync(items.filter((item) => item.cartKey !== cartKey));
  };

  const updateQty = (cartKey, qty) => {
    const next = items.map((item) =>
      item.cartKey === cartKey ? { ...item, qty: Math.max(1, Number(qty) || 1) } : item
    );
    sync(next);
  };

  const clearCart = () => sync([]);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  const value = useMemo(
    () => ({ items, addToCart, removeFromCart, updateQty, clearCart, subtotal }),
    [items, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

