import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

interface AuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!(url && !url.includes("your-project") && !url.includes("placeholder-project") && url.trim().length > 0);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: !isSupabaseConfigured(), // Default to true if not configured yet so dev isn't blocked
      userEmail: isSupabaseConfigured() ? null : "admin@afnene.com",

      login: async (email, pass) => {
        if (!isSupabaseConfigured()) {
          // Dev fallback
          set({ isAuthenticated: true, userEmail: email || "admin@afnene.com" });
          return true;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });

        if (error) {
          throw error;
        }

        if (data?.user) {
          set({ isAuthenticated: true, userEmail: data.user.email });
          return true;
        }
        return false;
      },

      logout: async () => {
        if (isSupabaseConfigured()) {
          await supabase.auth.signOut();
        }
        set({ isAuthenticated: false, userEmail: null });
      },

      checkSession: async () => {
        if (!isSupabaseConfigured()) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          set({ isAuthenticated: true, userEmail: session.user.email });
        } else {
          set({ isAuthenticated: false, userEmail: null });
        }
      }
    }),
    {
      name: "afnene-admin-auth-storage",
    }
  )
);
