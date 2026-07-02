"use client";

import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/lib/translations";

export function HeroSection() {
  const { language } = useLanguageStore();
  const t = translations[language] || translations.fr;

  return (
    <section id="hero" className="relative w-full h-[100dvh] min-h-[560px] md:min-h-[800px] overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Video.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay to match mockup ambiance */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full pt-20 pb-48 md:pb-24">
        <div className="container-premium text-center">
          
          {/* Main Large Logo Placeholder (Tree & Cup) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="mb-4 md:mb-6 flex justify-center"
          >
            <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-32 md:h-32 text-white drop-shadow-2xl" fill="currentColor">
               <path d="M50 10c-20 0-30 15-30 30 0 10 5 15 10 20h40c5-5 10-10 10-20 0-15-10-30-30-30zm0 10c10 0 18 10 18 20H32c0-10 8-20 18-20zM30 65h40v8H30zM35 78h30v6H35z" />
               <circle cx="50" cy="45" r="8" fill="white" />
             </svg>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-wider mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            AFNENE
          </motion.h1>

          {/* Subtitle 1 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-secondary text-base md:text-2xl tracking-[0.2em] md:tracking-[0.3em] uppercase font-medium mb-3 md:mb-4"
          >
            COFFEE • DRINK • SNACK
          </motion.p>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-white/90 text-lg md:text-2xl italic mb-6 md:mb-10"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t.hero.tagline}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <Link href="/menu" className="btn-secondary text-dark font-bold text-base px-8 py-3.5 rounded-xl hover:bg-white transition-colors">
              {t.hero.cta}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom Info Bar (Dark Green Overlay) */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 bg-primary/95 backdrop-blur-md border-t border-white/10 z-20 py-3.5 md:py-6"
      >
         <div className="container-premium max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-4 text-white text-sm">
               
               <div className="flex items-center gap-4 flex-1 justify-center md:justify-start">
                  <Clock className="w-6 h-6 text-secondary" />
                  <div className="text-left">
                     <p className="font-semibold">{t.hero.everyDay}</p>
                     <p className="text-white/70">{t.hero.hours}</p>
                  </div>
               </div>

               <div className="hidden md:block w-px h-10 bg-white/10" />

               <div className="flex items-center gap-4 flex-1 justify-center">
                  <MapPin className="w-6 h-6 text-secondary" />
                  <div className="text-left">
                     <p className="font-semibold uppercase tracking-wider">Afnene Snack & Coffee</p>
                     <p className="text-white/70">{t.hero.location}</p>
                  </div>
               </div>

               <div className="hidden md:block w-px h-10 bg-white/10" />

                <a
                  href="https://www.instagram.com/afnene.snackcoffee?igsh=ajN5YmcyMXU0YXNh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 flex-1 justify-center md:justify-end hover:text-secondary transition-colors group/insta cursor-pointer"
                >
                   <svg className="w-6 h-6 text-secondary group-hover/insta:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                   <div className="text-left">
                      <p className="font-semibold text-white">{t.hero.followUs}</p>
                      <p className="text-white/70 text-xs">@afnene.snackcoffee</p>
                   </div>
                </a>

            </div>
         </div>
      </motion.div>
    </section>
  );
}
