import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

export interface ShopSettings {
  shop_name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  opening_hours: string;
  map_embed: string;
  primary_color: string;
  secondary_color: string;
  currency: string;
}

const DEFAULT_SETTINGS: ShopSettings = {
  shop_name: "AFNENE",
  tagline: "Coffee • Drink • Snack",
  phone: "+213 554 78 50 79",
  email: "hello@afnene.com",
  address: "Afnen SNACK & COFFEE, Oran, Algérie",
  whatsapp: "213554785079",
  instagram: "@afnene.snackcoffee",
  facebook: "afnene.coffee",
  opening_hours: "Tous les jours: 07h00 - 22h00",
  map_embed: "https://maps.google.com/maps?q=35.7203394,-0.5774749&z=17&output=embed",
  primary_color: "#004B36",
  secondary_color: "#D6B370",
  currency: "DA",
};

interface SettingsState {
  settings: ShopSettings;
  isLoading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<ShopSettings>) => Promise<void>;
}

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!(url && !url.includes("your-project") && url.trim().length > 0);
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      isLoading: false,
      error: null,

      fetchSettings: async () => {
        if (!isSupabaseConfigured()) return;
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase
            .from("settings")
            .select("*")
            .eq("id", 1)
            .single();

          if (error) {
            // If the row doesn't exist, we fallback
            if (error.code === "PGRST116") {
              // Try to insert default settings row
              const { data: inserted, error: insertError } = await supabase
                .from("settings")
                .insert({ id: 1, ...DEFAULT_SETTINGS })
                .select()
                .single();
              if (insertError) throw insertError;
              if (inserted) {
                set({ settings: mapDbToStore(inserted), isLoading: false });
              }
            } else {
              throw error;
            }
          } else if (data) {
            set({ settings: mapDbToStore(data), isLoading: false });
          }
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      updateSettings: async (updates) => {
        // Optimistic / Local update
        const newSettings = { ...get().settings, ...updates };
        set({ settings: newSettings });

        if (isSupabaseConfigured()) {
          try {
            const dbUpdates = mapStoreToDb(updates);
            const { error } = await supabase
              .from("settings")
              .update(dbUpdates)
              .eq("id", 1);
            if (error) throw error;
          } catch (err: any) {
            console.error("Failed to update settings in Supabase:", err);
            // Revert on error
            get().fetchSettings();
            throw err;
          }
        }
      },
    }),
    {
      name: "afnene-settings-storage",
    }
  )
);

function mapDbToStore(db: any): ShopSettings {
  return {
    shop_name: db.shop_name || DEFAULT_SETTINGS.shop_name,
    tagline: db.tagline || DEFAULT_SETTINGS.tagline,
    phone: db.phone || DEFAULT_SETTINGS.phone,
    email: db.email || DEFAULT_SETTINGS.email,
    address: db.address || DEFAULT_SETTINGS.address,
    whatsapp: db.whatsapp || DEFAULT_SETTINGS.whatsapp,
    instagram: db.instagram || DEFAULT_SETTINGS.instagram,
    facebook: db.facebook || DEFAULT_SETTINGS.facebook,
    opening_hours: db.opening_hours || DEFAULT_SETTINGS.opening_hours,
    map_embed: db.map_embed || DEFAULT_SETTINGS.map_embed,
    primary_color: db.primary_color || DEFAULT_SETTINGS.primary_color,
    secondary_color: db.secondary_color || DEFAULT_SETTINGS.secondary_color,
    currency: db.currency || DEFAULT_SETTINGS.currency,
  };
}

function mapStoreToDb(store: Partial<ShopSettings>): any {
  const db: any = {};
  if (store.shop_name !== undefined) db.shop_name = store.shop_name;
  if (store.tagline !== undefined) db.tagline = store.tagline;
  if (store.phone !== undefined) db.phone = store.phone;
  if (store.email !== undefined) db.email = store.email;
  if (store.address !== undefined) db.address = store.address;
  if (store.whatsapp !== undefined) db.whatsapp = store.whatsapp;
  if (store.instagram !== undefined) db.instagram = store.instagram;
  if (store.facebook !== undefined) db.facebook = store.facebook;
  if (store.opening_hours !== undefined) db.opening_hours = store.opening_hours;
  if (store.map_embed !== undefined) db.map_embed = store.map_embed;
  if (store.primary_color !== undefined) db.primary_color = store.primary_color;
  if (store.secondary_color !== undefined) db.secondary_color = store.secondary_color;
  if (store.currency !== undefined) db.currency = store.currency;
  return db;
}
