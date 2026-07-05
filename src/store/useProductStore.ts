import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import { MAMAKA_PRODUCTS } from "@/lib/afnene_data";

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
  sort_order?: number;
}

const INITIAL_PRODUCTS: StoreProduct[] = MAMAKA_PRODUCTS.map((p, idx) => ({
  id: String(idx + 1),
  category_id: p.category_id,
  name: p.name.fr,
  description: p.description.fr,
  price: p.price,
  media_type: p.media_type as "image" | "video",
  media_url: p.media_url,
  available: p.available,
  best_seller: p.best_seller,
  featured: p.featured,
  promotion: p.promotion,
  ingredients: p.ingredients.fr,
  sort_order: idx + 1,
}));

interface ProductState {
  products: StoreProduct[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<StoreProduct, "id">) => Promise<void>;
  updateProduct: (id: string, updated: Partial<StoreProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
  resetToDefaultMenu: () => Promise<void>;
  updateProductOrder: (id: string, direction: "up" | "down") => Promise<void>;
  moveProductToPosition: (id: string, targetIndex: number) => Promise<void>;
}

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!(url && !url.includes("your-project") && !url.includes("placeholder-project") && url.trim().length > 0);
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
            sort_order: Number(p.sort_order) || 0,
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

      updateProductOrder: async (id, direction) => {
        const currentProducts = [...get().products];
        const index = currentProducts.findIndex((p) => p.id === id);
        if (index === -1) return;

        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= currentProducts.length) return;

        const p1 = currentProducts[index];
        const p2 = currentProducts[targetIndex];

        const order1 = p1.sort_order ?? index;
        const order2 = p2.sort_order ?? targetIndex;

        // Perform local swap
        p1.sort_order = order2;
        p2.sort_order = order1;

        currentProducts[index] = p2;
        currentProducts[targetIndex] = p1;

        const sorted = [...currentProducts].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        set({ products: sorted });

        if (isSupabaseConfigured()) {
          try {
            await Promise.all([
              supabase.from("products").update({ sort_order: order2 }).eq("id", p1.id),
              supabase.from("products").update({ sort_order: order1 }).eq("id", p2.id),
            ]);
          } catch (err) {
            console.error("Failed to update product order in Supabase:", err);
          }
        }
      },

      moveProductToPosition: async (id, targetIndex) => {
        const currentProducts = [...get().products];
        const index = currentProducts.findIndex((p) => p.id === id);
        if (index === -1) return;

        // Remove the product from its current place
        const [movedProduct] = currentProducts.splice(index, 1);
        // Insert at target index
        currentProducts.splice(targetIndex, 0, movedProduct);

        // Re-assign absolute sequential positions
        const updated = currentProducts.map((p, idx) => ({
          ...p,
          sort_order: idx + 1,
        }));

        set({ products: updated });

        if (isSupabaseConfigured()) {
          try {
            // Bulk update sort orders in database
            await Promise.all(
              updated.map((p) =>
                supabase.from("products").update({ sort_order: p.sort_order }).eq("id", p.id)
              )
            );
          } catch (err) {
            console.error("Failed to save new order sequence in Supabase:", err);
          }
        }
      },

      resetToDefaultMenu: async () => {
        if (!isSupabaseConfigured()) {
          set({ products: INITIAL_PRODUCTS });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          // 0. Ensure all required categories exist in Supabase to satisfy foreign key constraints
          const defaultCategories = [
            { id: "coffee", name: { fr: "Café & Chauds", en: "Coffee & Hot Drinks", ar: "قهوة ومشروبات ساخنة" }, icon: "☕", sort_order: 1 },
            { id: "cold-drinks", name: { fr: "Boissons Froides", en: "Cold Drinks", ar: "مشروبات باردة" }, icon: "🧊", sort_order: 2 },
            { id: "breakfast", name: { fr: "Petit Déjeuner", en: "Breakfast", ar: "فطور الصباح" }, icon: "🥐", sort_order: 3 },
            { id: "sandwiches", name: { fr: "Sandwichs", en: "Sandwiches", ar: "سندويشات" }, icon: "🥪", sort_order: 4 },
            { id: "burgers", name: { fr: "Burgers", en: "Burgers", ar: "برجر" }, icon: "🍔", sort_order: 5 },
            { id: "pizza", name: { fr: "Pizza", en: "Pizza", ar: "بيتزا" }, icon: "🍕", sort_order: 6 },
            { id: "desserts", name: { fr: "Desserts & Sucrés", en: "Desserts & Sweets", ar: "حلويات" }, icon: "🍰", sort_order: 7 },
            { id: "salads", name: { fr: "Salades", en: "Salades", ar: "سلطات" }, icon: "🥗", sort_order: 8 },
            { id: "snacks", name: { fr: "Snacks & Salés", en: "Snacks & Salty", ar: "مقبلات ومملحات" }, icon: "🍿", sort_order: 9 },
          ];

          const { error: catError } = await supabase
            .from("categories")
            .upsert(defaultCategories);

          if (catError) throw catError;

          // 1. Delete all products from Supabase
          const { error: deleteError } = await supabase
            .from("products")
            .delete()
            .neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all items safely since none has this id

          if (deleteError) throw deleteError;

          // 2. Insert all INITIAL_PRODUCTS into Supabase
          const dbProducts = INITIAL_PRODUCTS.map((p, idx) => ({
            category_id: p.category_id,
            name: { fr: p.name, en: p.name, ar: p.name },
            description: { fr: p.description, en: p.description, ar: p.description },
            ingredients: { fr: p.ingredients, en: p.ingredients, ar: p.ingredients },
            price: p.price,
            media_type: p.media_type,
            media_url: p.media_url,
            available: p.available,
            best_seller: p.best_seller,
            featured: p.featured,
            promotion: p.promotion,
            calories: null,
            sort_order: idx + 1,
          }));

          const { data, error: insertError } = await supabase
            .from("products")
            .insert(dbProducts)
            .select();

          if (insertError) throw insertError;

          // 3. Reload products
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
            ingredients: typeof p.ingredients === "object" ? (p.ingredients?.fr || p.ingredients?.en || "") : p.ingredients || "",
            sort_order: Number(p.sort_order) || 0,
          }));

          set({ products: mapped, isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },
    }),
    {
      name: "afnene-products-storage",
      partialize: (state) => ({ products: state.products }), // Only persist product array
    }
  )
);
