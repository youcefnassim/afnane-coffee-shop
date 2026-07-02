import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/database";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AppliedPromo {
  code: string;
  discountPercentage: number;
}

const PROMO_CODES: Record<string, number> = {
  WELCOME10: 10,
  AFNENE15: 15,
  WEEKEND20: 20,
};

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  appliedPromo: AppliedPromo | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  getTotalCount: () => number;
  getSubtotalPrice: () => number;
  getDiscountAmount: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedPromo: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );
          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems, isOpen: true };
          }
          return { items: [...state.items, { product, quantity }], isOpen: true };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [], appliedPromo: null }),

      applyPromoCode: (code) => {
        const cleanCode = code.trim().toUpperCase();
        if (!cleanCode) return { success: false, message: "Veuillez entrer un code." };
        
        if (PROMO_CODES[cleanCode]) {
          const discountPercentage = PROMO_CODES[cleanCode];
          set({ appliedPromo: { code: cleanCode, discountPercentage } });
          return { success: true, message: `Code ${cleanCode} appliqué (-${discountPercentage}%)` };
        }

        return { success: false, message: "Code promo invalide." };
      },

      removePromoCode: () => set({ appliedPromo: null }),

      getTotalCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.promotion && item.product.promotion_price
            ? item.product.promotion_price
            : item.product.price;
          return total + price * item.quantity;
        }, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotalPrice();
        const promo = get().appliedPromo;
        if (!promo) return 0;
        return Math.round((subtotal * promo.discountPercentage) / 100);
      },

      getTotalPrice: () => {
        const subtotal = get().getSubtotalPrice();
        const discount = get().getDiscountAmount();
        return Math.max(0, subtotal - discount);
      },
    }),
    {
      name: "afnene-cart-storage",
      partialize: (state) => ({ items: state.items, appliedPromo: state.appliedPromo }),
    }
  )
);
