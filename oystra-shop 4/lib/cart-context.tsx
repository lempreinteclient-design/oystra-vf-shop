"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { Size } from "./products";

export interface CartLine {
  productSlug: string;
  productName: string;
  variantId: string;
  variantName: string;
  size: Size;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeLine: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function lineKey(l: { productSlug: string; variantId: string; size: Size }) {
  return `${l.productSlug}__${l.variantId}__${l.size}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addLine = useCallback(
    (line: Omit<CartLine, "quantity">, quantity = 1) => {
      setLines((prev) => {
        const key = lineKey(line);
        const existing = prev.find((l) => lineKey(l) === key);
        if (existing) {
          return prev.map((l) =>
            lineKey(l) === key ? { ...l, quantity: l.quantity + quantity } : l
          );
        }
        return [...prev, { ...line, quantity }];
      });
      setIsOpen(true);
    },
    []
  );

  const removeLine = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => lineKey(l) !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setLines((prev) =>
      prev
        .map((l) => (lineKey(l) === key ? { ...l, quantity } : l))
        .filter((l) => l.quantity > 0)
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines]
  );
  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity * l.price, 0),
    [lines]
  );

  const value: CartContextValue = {
    lines,
    addLine,
    removeLine,
    updateQuantity,
    clear,
    isOpen,
    openCart,
    closeCart,
    itemCount,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { lineKey };
