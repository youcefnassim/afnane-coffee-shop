"use client";

import { useEffect } from "react";
import { Leaf, Heart, Home, Clock } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { translations } from "@/lib/translations";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguageStore();
  const { settings, fetchSettings } = useSettingsStore();
  const t = translations[language] || translations.fr;

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <footer className="relative bg-primary text-white overflow-hidden">
      {/* Features Bar */}
      <div className="py-12 border-b border-white/10">
        <div className="container-premium max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <Leaf className="w-8 h-8 text-secondary" strokeWidth={1.5} />
              <div>
                <p className="font-bold text-sm">{t.footer.freshTitle}</p>
                <p className="text-white/60 text-xs">{t.footer.freshDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <Heart className="w-8 h-8 text-secondary" strokeWidth={1.5} />
              <div>
                <p className="font-bold text-sm">{t.footer.passionTitle}</p>
                <p className="text-white/60 text-xs">{t.footer.passionDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <Home className="w-8 h-8 text-secondary" strokeWidth={1.5} />
              <div>
                <p className="font-bold text-sm">{t.footer.ambianceTitle}</p>
                <p className="text-white/60 text-xs">{t.footer.ambianceDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <Clock className="w-8 h-8 text-secondary" strokeWidth={1.5} />
              <div>
                <p className="font-bold text-sm">{t.footer.serviceTitle}</p>
                <p className="text-white/60 text-xs">{t.footer.serviceDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container-premium py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © {currentYear} {settings?.shop_name || "AFNENE"}. {t.footer.rights}
          </p>
          <p className="text-white/30 text-xs">
            {t.footer.crafted}
          </p>
        </div>
      </div>
    </footer>
  );
}
