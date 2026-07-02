import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

export interface StoreProduct {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  media_type: "image" | "video";
  media_url: string;
  available: boolean;
  best_seller: boolean;
  featured: boolean;
  promotion: boolean;
  calories?: number;
  ingredients: string;
}

const INITIAL_PRODUCTS: StoreProduct[] = [
  // Coffee
  { id: "1", category_id: "coffee", name: "Pistachio Latte", description: "Latte crémeux à la pistache d'origine d'Italie.", price: 650, media_type: "video", media_url: "/Video.mp4", available: true, best_seller: true, featured: true, promotion: false, calories: 180, ingredients: "Espresso, lait, sirop de pistache, mousse" },
  { id: "2", category_id: "coffee", name: "Espresso Intenso", description: "Espresso pur d'origine unique aux notes de chocolat noir.", price: 250, media_type: "image", media_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop", available: true, best_seller: true, featured: false, promotion: false, calories: 5, ingredients: "Grains de café, eau purifiée" },
  { id: "3", category_id: "coffee", name: "Cappuccino Italiano", description: "Cappuccino italien classique avec mousse de lait veloutée.", price: 350, media_type: "image", media_url: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop", available: true, best_seller: true, featured: false, promotion: false, calories: 120, ingredients: "Espresso, lait chaud, mousse" },
  
  // Cold Drinks
  { id: "4", category_id: "cold-drinks", name: "Mojito Classic", description: "Citron vert frais, menthe, soda et sucre de canne.", price: 550, media_type: "video", media_url: "/Video.mp4", available: true, best_seller: true, featured: true, promotion: false, calories: 120, ingredients: "Citron vert, menthe, soda, sucre de canne" },
  { id: "5", category_id: "cold-drinks", name: "Iced Caramel Macchiato", description: "Espresso glacé au sirop de caramel et lait frais.", price: 500, media_type: "image", media_url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop", available: true, best_seller: true, featured: true, promotion: true, calories: 220, ingredients: "Espresso, lait, caramel, glaçons" },

  // Burgers
  { id: "6", category_id: "burgers", name: "Signature Burger", description: "Pain artisanal, steak haché pur bœuf, fromage fondu et sauce spéciale.", price: 1150, media_type: "video", media_url: "/Video.mp4", available: true, best_seller: true, featured: true, promotion: false, calories: 650, ingredients: "Pain artisanal, steak bœuf, cheddar, salade, sauce maison" },
  { id: "7", category_id: "burgers", name: "Crispy Chicken Burger", description: "Filet de poulet croustillant avec salade et mayonnaise.", price: 850, media_type: "image", media_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop", available: true, best_seller: true, featured: false, promotion: true, calories: 550, ingredients: "Poulet croustillant, salade, tomate, sauce" },

  // Desserts
  { id: "8", category_id: "desserts", name: "Crêpe Nutella Banane", description: "Crêpe maison garnie de Nutella, bananes et éclats d'amandes.", price: 650, media_type: "video", media_url: "/Video.mp4", available: true, best_seller: true, featured: true, promotion: false, calories: 420, ingredients: "Pâte à crêpe, Nutella, banane, amandes" },
  { id: "9", category_id: "desserts", name: "Tiramisu Maison", description: "Biscuits imbibés de café et crème mascarpone onctueuse.", price: 600, media_type: "image", media_url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=600&auto=format&fit=crop", available: true, best_seller: true, featured: false, promotion: false, calories: 380, ingredients: "Mascarpone, café, biscuits, cacao" },

  // Pizza
  { id: "10", category_id: "pizza", name: "Pizza Margherita", description: "Sauce tomate fraîche, mozzarella fondu et basilic frais.", price: 900, media_type: "image", media_url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=600&auto=format&fit=crop", available: true, best_seller: true, featured: false, promotion: false, calories: 750, ingredients: "Pâte à pizza, sauce tomate, mozzarella, basilic" },

  // Salads
  { id: "11", category_id: "salads", name: "Salade César Poulet", description: "Romaine croquante, poulet grillé, parmesan et croutons.", price: 750, media_type: "image", media_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop", available: true, best_seller: true, featured: false, promotion: false, calories: 320, ingredients: "Poulet grillé, salade romaine, parmesan, sauce césar" },

  // Snacks
  { id: "12", category_id: "snacks", name: "Frites Maison & Sauces", description: "Frites dorées croustillantes servies avec nos sauces maison.", price: 350, media_type: "image", media_url: "https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=600&auto=format&fit=crop", available: true, best_seller: true, featured: false, promotion: false, calories: 380, ingredients: "Pommes de terre, sel, épices maison" },
];

interface ProductState {
  products: StoreProduct[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<StoreProduct, "id">) => Promise<void>;
  updateProduct: (id: string, updated: Partial<StoreProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
}

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!(url && !url.includes("your-project") && url.trim().length > 0);
};

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      isLoading: false,
      error: null,

      fetchProducts: async () => {
        if (!isSupabaseConfigured()) return;
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false });

          if (error) throw error;

          const mapped: StoreProduct[] = (data || []).map((p: any) => ({
            id: p.id,
            category_id: p.category_id || "coffee",
            name: typeof p.name === "object" ? (p.name?.fr || p.name?.en || Object.values(p.name)[0] || "") : p.name || "",
            description: typeof p.description === "object" ? (p.description?.fr || p.description?.en || "") : p.description || "",
            price: Number(p.price),
            media_type: p.media_type,
            media_url: p.media_url || "",
            available: p.available,
            best_seller: p.best_seller,
            featured: p.featured,
            promotion: p.promotion,
            calories: p.calories || undefined,
            ingredients: typeof p.ingredients === "object" ? (p.ingredients?.fr || p.ingredients?.en || "") : p.ingredients || "",
          }));

          set({ products: mapped, isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      addProduct: async (product) => {
        const tempId = Date.now().toString();
        const formattedUrl = product.media_url
          ? (product.media_url.startsWith("http") || product.media_url.startsWith("blob:") || product.media_url.startsWith("/") ? product.media_url : `/${product.media_url}`)
          : "";

        const newProduct: StoreProduct = {
          ...product,
          id: tempId,
          media_url: formattedUrl,
        };

        // 1. Optimistic / local state update
        set((state) => ({ products: [newProduct, ...state.products] }));

        // 2. Supabase DB update
        if (isSupabaseConfigured()) {
          try {
            const dbProduct = {
              category_id: product.category_id,
              name: { fr: product.name, en: product.name, ar: product.name },
              description: { fr: product.description, en: product.description, ar: product.description },
              ingredients: { fr: product.ingredients, en: product.ingredients, ar: product.ingredients },
              price: product.price,
              media_type: product.media_type,
              media_url: formattedUrl,
              available: product.available,
              best_seller: product.best_seller,
              featured: product.featured,
              promotion: product.promotion,
              calories: product.calories || null,
            };

            const { data, error } = await supabase.from("products").insert(dbProduct).select().single();
            if (error) throw error;
            if (data) {
              set((state) => ({
                products: state.products.map(p => p.id === tempId ? { ...p, id: data.id } : p)
              }));
            }
          } catch (err) {
            console.error("Failed to add product in Supabase:", err);
          }
        }
      },

      updateProduct: async (id, updated) => {
        // 1. Local update
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id === id) {
              const formattedUrl = updated.media_url
                ? (updated.media_url.startsWith("http") || updated.media_url.startsWith("blob:") || updated.media_url.startsWith("/") ? updated.media_url : `/${updated.media_url}`)
                : p.media_url;
              return { ...p, ...updated, media_url: formattedUrl };
            }
            return p;
          }),
        }));

        // 2. Supabase update
        if (isSupabaseConfigured()) {
          try {
            const updates: any = {};
            if (updated.category_id !== undefined) updates.category_id = updated.category_id;
            if (updated.name !== undefined) updates.name = { fr: updated.name, en: updated.name, ar: updated.name };
            if (updated.description !== undefined) updates.description = { fr: updated.description, en: updated.description, ar: updated.description };
            if (updated.ingredients !== undefined) updates.ingredients = { fr: updated.ingredients, en: updated.ingredients, ar: updated.ingredients };
            if (updated.price !== undefined) updates.price = updated.price;
            if (updated.media_type !== undefined) updates.media_type = updated.media_type;
            if (updated.media_url !== undefined) {
              updates.media_url = updated.media_url.startsWith("http") || updated.media_url.startsWith("blob:") || updated.media_url.startsWith("/") 
                ? updated.media_url 
                : `/${updated.media_url}`;
            }
            if (updated.available !== undefined) updates.available = updated.available;
            if (updated.best_seller !== undefined) updates.best_seller = updated.best_seller;
            if (updated.featured !== undefined) updates.featured = updated.featured;
            if (updated.promotion !== undefined) updates.promotion = updated.promotion;
            if (updated.calories !== undefined) updates.calories = updated.calories || null;

            const { error } = await supabase.from("products").update(updates).eq("id", id);
            if (error) throw error;
          } catch (err) {
            console.error("Failed to update product in Supabase:", err);
          }
        }
      },

      deleteProduct: async (id) => {
        // 1. Local update
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));

        // 2. Supabase update
        if (isSupabaseConfigured()) {
          try {
            const { error } = await supabase.from("products").delete().eq("id", id);
            if (error) throw error;
          } catch (err) {
            console.error("Failed to delete product in Supabase:", err);
          }
        }
      },

      toggleAvailability: async (id) => {
        const product = get().products.find((p) => p.id === id);
        if (!product) return;

        const newAvailability = !product.available;

        // 1. Local update
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, available: newAvailability } : p
          ),
        }));

        // 2. Supabase update
        if (isSupabaseConfigured()) {
          try {
            const { error } = await supabase
              .from("products")
              .update({ available: newAvailability })
              .eq("id", id);
            if (error) throw error;
          } catch (err) {
            console.error("Failed to toggle availability in Supabase:", err);
          }
        }
      },
    }),
    {
      name: "afnene-products-storage",
      partialize: (state) => ({ products: state.products }), // Only persist product array
    }
  )
);
