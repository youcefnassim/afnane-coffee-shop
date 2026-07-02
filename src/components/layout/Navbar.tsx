"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, MessageCircle, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/lib/translations";

const NAV_LINKS = [
  { href: "/", key: "home" as const },
  { href: "/menu", key: "menu" as const },
  { href: "/#menu-du-jour", key: "dailyMenu" as const },
  { href: "/about", key: "about" as const },
  { href: "/gallery", key: "gallery" as const },
  { href: "/contact", key: "contact" as const },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { openCart, getTotalCount } = useCartStore();
  const { language, setLanguage } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  const t = mounted ? (translations[language] || translations.fr) : translations.fr;

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCount = mounted ? getTotalCount() : 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
          isScrolled
            ? "py-3 bg-primary/95 backdrop-blur-md shadow-lg"
            : "py-5 bg-gradient-to-b from-black/80 to-transparent"
        )}
      >
        <div className="container-premium">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group" id="nav-logo">
              <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center bg-primary/40 backdrop-blur-sm overflow-hidden relative group-hover:border-white/40 transition-colors">
                 <Image 
                   src="/logo.jpg" 
                   alt="AFNENE Logo" 
                   fill 
                   className="object-cover" 
                 />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-xl font-bold tracking-widest text-white leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  AFNENE
                </span>
                <span className="text-[9px] tracking-[0.2em] uppercase text-secondary">
                  Coffee • Drink • Snack
                </span>
              </div>
            </Link>

             {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="text-sm font-medium text-white/90 hover:text-white transition-colors link-underline"
                >
                  {t.nav[link.key]}
                </Link>
              ))}
            </div>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-3">
              {/* Language Selector Dropdown */}
              <div className="relative hidden lg:block" id="language-selector">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>{language.toUpperCase()}</span>
                  <svg className={cn("w-3.5 h-3.5 text-secondary transition-transform", langOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setLangOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-32 bg-primary border border-white/10 rounded-xl shadow-xl z-40 overflow-hidden py-1"
                      >
                        {(["fr", "en", "ar"] as const).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => {
                              setLanguage(lang);
                              setLangOpen(false);
                            }}
                            className={cn(
                              "w-full px-4 py-2.5 text-xs font-semibold flex items-center justify-between hover:bg-white/10 transition-colors text-start cursor-pointer",
                              language === lang ? "text-secondary" : "text-white/80"
                            )}
                          >
                            <span>{lang === "fr" ? "Français" : lang === "en" ? "English" : "العربية"}</span>
                            {language === lang && <span className="w-1.5 h-1.5 rounded-full bg-secondary" />}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Voir le panier"
              >
                <ShoppingBag className="w-5 h-5 text-secondary" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary text-dark font-bold text-xs flex items-center justify-center shadow-md">
                    {totalCount}
                  </span>
                )}
              </button>

              <a
                href="https://wa.me/213554785079"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#113a29] border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {t.nav.commander}
              </a>

              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-white transition-colors"
              >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-[300px] bg-primary shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <span
                  className="font-bold text-white text-xl tracking-wider"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  AFNENE
                </span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 py-6 px-4 overflow-y-auto space-y-2">
                {/* Mobile Language Switcher */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 mb-4 justify-between">
                  <span className="text-xs text-white/50 font-semibold uppercase tracking-wider">Langue</span>
                  <div className="flex gap-1.5">
                    {(["fr", "en", "ar"] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                          language === lang
                            ? "bg-secondary text-dark shadow-md"
                            : "text-white/60 hover:text-white bg-white/5"
                        )}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.key}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-white/10 transition-colors",
                        language === "ar" ? "text-right" : "text-left"
                      )}
                    >
                      {t.nav[link.key]}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 border-t border-white/10">
                <a
                  href="https://wa.me/213554785079"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white text-base font-medium hover:bg-white/20 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t.nav.commander}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
