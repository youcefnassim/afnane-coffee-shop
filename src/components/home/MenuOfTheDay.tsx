"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { AnimationWrapper } from "@/components/shared/AnimationWrapper";
import { useDailyMenuStore } from "@/store/useDailyMenuStore";
import { formatPrice, cn } from "@/lib/utils";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/lib/translations";

export function MenuOfTheDay() {
  const { menu } = useDailyMenuStore();
  const { language } = useLanguageStore();
  const t = translations[language] || translations.fr;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section id="menu-du-jour" className="py-16 bg-background scroll-mt-20">
      <div className="container-premium max-w-6xl mx-auto px-4">
        <AnimationWrapper type="fade" direction="up">
          <div className="relative bg-[#F0EDE1] rounded-[32px] p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden shadow-sm border border-black/5">
            
            {/* Background Watermark Logo */}
            <div className="absolute right-[-5%] bottom-[-10%] opacity-[0.03] pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-[400px] h-[400px] text-primary" fill="currentColor">
                 <path d="M50 10c-20 0-30 15-30 30 0 10 5 15 10 20h40c5-5 10-10 10-20 0-15-10-30-30-30zm0 10c10 0 18 10 18 20H32c0-10 8-20 18-20zM30 65h40v8H30zM35 78h30v6H35z" />
                 <circle cx="50" cy="45" r="8" fill="currentColor" />
              </svg>
            </div>

            {/* Left Content */}
            <div className={cn(
              "w-full md:w-1/2 flex flex-col items-center z-10 order-2 md:order-1",
              language === "ar" ? "md:items-end text-center md:text-right" : "md:items-start text-center md:text-left"
            )}>
              
              <div className="mb-6 flex flex-col items-center md:items-start">
                <h3 
                  className="text-2xl md:text-3xl font-bold text-primary tracking-widest uppercase mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t.dailyMenu.badge}
                </h3>
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary" fill="currentColor">
                    <path d="M17.6,4.2C16,2.7,13.7,2.1,11.5,2.6c-2.3,0.5-4.2,2.1-5.3,4.2C5.1,9.2,4.8,12,5.7,14.5c-1.3,1.3-2.6,2.7-3.9,4 c-0.6,0.6-0.6,1.5,0,2.1c0.6,0.6,1.5,0.6,2.1,0c1.3-1.3,2.7-2.6,4-3.9c2.4,0.9,5.2,0.6,7.7-0.5c2.1-1,3.7-2.9,4.2-5.3 C20.3,8.7,19.6,6.3,17.6,4.2z M17,10.6c-0.4,1.8-1.6,3.2-3.2,3.9c-1.7,0.8-3.7,0.7-5.3-0.2c-0.3-0.2-0.7-0.1-0.9,0.2 C7.5,14.6,7.6,15,7.9,15.2c1.9,1.1,4.4,1.3,6.5,0.3c2-0.9,3.5-2.7,4-4.9c0.5-2.2,0-4.6-1.5-6.3c-1.5-1.7-3.8-2.3-6-1.8 c-0.4,0.1-0.6,0.5-0.5,0.9c0.1,0.4,0.5,0.6,0.9,0.5c1.8-0.4,3.6,0,4.8,1.3C17.3,6.7,17.6,8.6,17,10.6z"/>
                </svg>
              </div>

              <h4 
                className="text-4xl lg:text-5xl font-bold text-dark mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {menu.dishName}
              </h4>
              
              <p className="text-dark/70 text-lg mb-6 max-w-md">
                {menu.description}
              </p>
              
              <div className="text-3xl lg:text-4xl font-bold text-dark mb-8">
                {formatPrice(menu.price)}
              </div>

              <Link 
                href="/menu"
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary-light transition-colors"
              >
                {t.dailyMenu.viewMenu}
                <CalendarDays className="w-5 h-5 ml-2" />
              </Link>
            </div>

            {/* Right Image */}
            <div className="w-full md:w-1/2 flex justify-center z-10 relative order-1 md:order-2">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8, y: 20 }}
                 whileInView={{ opacity: 1, scale: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, type: "spring" }}
                 className="w-full max-w-[280px] aspect-square md:max-w-[350px] lg:max-w-[400px] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white"
               >
                 <img 
                   src={menu.imageUrl} 
                   alt={menu.dishName} 
                   className="w-full h-full object-cover"
                 />
               </motion.div>
            </div>

          </div>
        </AnimationWrapper>
      </div>
    </section>
  );
}
