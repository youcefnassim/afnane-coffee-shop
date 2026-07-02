"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState, useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { OfflineIndicator } from "@/components/shared/OfflineIndicator";
import { BackToTop } from "@/components/shared/BackToTop";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useProductStore } from "@/store/useProductStore";
import { useDailyMenuStore } from "@/store/useDailyMenuStore";
import { useAuthStore } from "@/store/useAuthStore";

function DatabaseInitializer() {
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const fetchDailyMenu = useDailyMenuStore((state) => state.fetchDailyMenu);
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    fetchProducts();
    fetchDailyMenu();
    checkSession();
  }, [fetchProducts, fetchDailyMenu, checkSession]);

  return null;
}

function LanguageInitializer() {
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = language;
      if (language === "ar") {
        document.body.classList.add("font-arabic");
      } else {
        document.body.classList.remove("font-arabic");
      }
    }
  }, [language]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 2,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange={false}
      >
        <DatabaseInitializer />
        <LanguageInitializer />
        <OfflineIndicator />
        {children}
        <CartDrawer />
        <BackToTop />
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              borderRadius: "var(--radius-lg)",
              fontFamily: "var(--font-body)",
            },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
