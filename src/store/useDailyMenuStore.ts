import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

export interface DailyMenuData {
  title: string;
  dishName: string;
  description: string;
  price: number;
  imageUrl: string;
  date: string;
}

const DEFAULT_DAILY_MENU: DailyMenuData = {
  title: "Menu du jour",
  dishName: "Escalope panée",
  description: "Frites maison, salade, sauce au choix",
  price: 1200,
  imageUrl: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=800&auto=format&fit=crop",
  date: new Date().toISOString().split("T")[0],
};

interface DailyMenuState {
  menu: DailyMenuData;
  isLoading: boolean;
  error: string | null;
  fetchDailyMenu: () => Promise<void>;
  updateDailyMenu: (updated: Partial<DailyMenuData>) => Promise<void>;
}

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!(url && !url.includes("your-project") && !url.includes("placeholder-project") && url.trim().length > 0);
};

export const useDailyMenuStore = create<DailyMenuState>()(
  persist(
    (set, get) => ({
      menu: DEFAULT_DAILY_MENU,
      isLoading: false,
      error: null,

      fetchDailyMenu: async () => {
        if (!isSupabaseConfigured()) return;
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase
            .from("daily_menu")
            .select("*")
            .eq("id", 1)
            .single();

          if (error && error.code !== "PGRST116") {
            throw error;
          }

          if (data) {
            // Get the current local state to preserve local base64 images
            const currentMenu = get().menu;
            const remoteImageUrl = data.image_url || "";
            // Keep the local image if it's a base64 data URL (not yet synced to cloud)
            const imageToUse = currentMenu.imageUrl.startsWith("data:")
              ? currentMenu.imageUrl
              : (remoteImageUrl || currentMenu.imageUrl);

            set({
              menu: {
                title: data.title || "Menu du jour",
                dishName: data.dish_name || "",
                description: data.description || "",
                price: Number(data.price),
                imageUrl: imageToUse,
                date: data.updated_at ? data.updated_at.split("T")[0] : new Date().toISOString().split("T")[0],
              },
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      updateDailyMenu: async (updated) => {
        set((state) => ({
          menu: { ...state.menu, ...updated },
        }));

        if (isSupabaseConfigured()) {
          try {
            const current = get().menu;
            const newImageUrl = updated.imageUrl !== undefined ? updated.imageUrl : current.imageUrl;
            // Never persist ephemeral blob: URLs; keep previous cloud/local URL instead
            const imageUrlForDb =
              newImageUrl.startsWith("blob:")
                ? (current.imageUrl.startsWith("blob:") ? "" : current.imageUrl)
                : newImageUrl.startsWith("data:")
                  ? ""
                  : newImageUrl;

            const dbPayload = {
              id: 1,
              dish_name: updated.dishName !== undefined ? updated.dishName : current.dishName,
              description: updated.description !== undefined ? updated.description : current.description,
              price: updated.price !== undefined ? updated.price : current.price,
              image_url: imageUrlForDb,
              updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
              .from("daily_menu")
              .upsert(dbPayload, { onConflict: "id" });

            if (error) {
              console.error("Supabase daily menu update error:", error);
              throw new Error(
                error.message?.includes("row-level security")
                  ? "Permission refusée sur daily_menu (RLS). Connectez-vous via Supabase Auth ou assouplissez les policies."
                  : error.message || "Erreur Supabase menu du jour"
              );
            }
          } catch (err: unknown) {
            console.error("Failed to update daily menu in Supabase:", err);
            throw err instanceof Error ? err : new Error("Échec de sauvegarde du menu du jour");
          }
        }
      },
    }),
    {
      name: "afnene-daily-menu-storage",
      partialize: (state) => ({ menu: state.menu }),
    }
  )
);
