"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coffee, CupSoda, Croissant, Ham, Sandwich, Pizza, CakeSlice, Salad, Popcorn, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { StaggerContainer, StaggerItem, AnimationWrapper } from "@/components/shared/AnimationWrapper";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const ICON_MAP: Record<string, any> = {
  "☕": Coffee,
  "🧊": CupSoda,
  "🥐": Croissant,
  "🍔": Ham,
  "🥪": Sandwich,
  "🍕": Pizza,
  "🍰": CakeSlice,
  "🥗": Salad,
  "🍿": Popcorn,
};

interface DbCategory {
  id: string;
  name: any;
  icon: string;
}

export function CategoriesGrid() {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      const fallbackCats = [
        { id: "coffee", name: { fr: "Café" }, icon: "☕" },
        { id: "cold-drinks", name: { fr: "Boissons froides" }, icon: "🧊" },
        { id: "breakfast", name: { fr: "Petit déjeuner" }, icon: "🥐" },
        { id: "burgers", name: { fr: "Burgers" }, icon: "🍔" },
        { id: "sandwiches", name: { fr: "Sandwichs" }, icon: "🥪" },
        { id: "pizza", name: { fr: "Pizza" }, icon: "🍕" },
        { id: "desserts", name: { fr: "Desserts" }, icon: "🍰" },
        { id: "salads", name: { fr: "Salades" }, icon: "🥗" },
        { id: "snacks-sales", name: { fr: "Snacks" }, icon: "🍿" },
      ];

      try {
        if (!isSupabaseConfigured()) {
          setCategories(fallbackCats);
          return;
        }

        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("sort_order", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setCategories(data);
        } else {
          setCategories(fallbackCats);
        }
      } catch (err) {
        console.error("CategoriesGrid load failed, falling back to defaults:", err);
        setCategories(fallbackCats);
      } finally {
        setIsLoading(false);
      }
    }
    loadCategories();
  }, []);

  const getIcon = (iconStr: string) => {
    return ICON_MAP[iconStr] || UtensilsCrossed;
  };

  const getName = (nameObj: any) => {
    if (!nameObj) return "";
    if (typeof nameObj === "string") return nameObj;
    return nameObj.fr || nameObj.en || nameObj.ar || Object.values(nameObj)[0] || "";
  };

  return (
    <section className="py-24 bg-background">
      <div className="container-premium max-w-6xl mx-auto">
        
        {/* Section Header */}
        <AnimationWrapper type="fade" direction="up">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl md:text-5xl font-bold text-primary mb-4 uppercase tracking-widest"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Nos Catégories
            </h2>
            <div className="flex items-center justify-center gap-2">
               {/* Small decorative leaf icon */}
               <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="currentColor">
                  <path d="M17.6,4.2C16,2.7,13.7,2.1,11.5,2.6c-2.3,0.5-4.2,2.1-5.3,4.2C5.1,9.2,4.8,12,5.7,14.5c-1.3,1.3-2.6,2.7-3.9,4 c-0.6,0.6-0.6,1.5,0,2.1c0.6,0.6,1.5,0.6,2.1,0c1.3-1.3,2.7-2.6,4-3.9c2.4,0.9,5.2,0.6,7.7-0.5c2.1-1,3.7-2.9,4.2-5.3 C20.3,8.7,19.6,6.3,17.6,4.2z M17,10.6c-0.4,1.8-1.6,3.2-3.2,3.9c-1.7,0.8-3.7,0.7-5.3-0.2c-0.3-0.2-0.7-0.1-0.9,0.2 C7.5,14.6,7.6,15,7.9,15.2c1.9,1.1,4.4,1.3,6.5,0.3c2-0.9,3.5-2.7,4-4.9c0.5-2.2,0-4.6-1.5-6.3c-1.5-1.7-3.8-2.3-6-1.8 c-0.4,0.1-0.6,0.5-0.5,0.9c0.1,0.4,0.5,0.6,0.9,0.5c1.8-0.4,3.6,0,4.8,1.3C17.3,6.7,17.6,8.6,17,10.6z"/>
               </svg>
            </div>
          </div>
        </AnimationWrapper>

        {/* Grid */}
        <StaggerContainer 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-6" 
          staggerDelay={0.05}
        >
          {categories.map((category) => {
            const IconComponent = getIcon(category.icon);
            return (
              <StaggerItem key={category.id}>
                <Link href={`/menu#${category.id}`} className="flex flex-col items-center group">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-primary/20 bg-white shadow-sm flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-md group-hover:border-primary group-hover:scale-105">
                     <IconComponent className="w-10 h-10 md:w-12 md:h-12 text-primary transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-dark font-semibold text-sm md:text-base text-center group-hover:text-primary transition-colors">
                    {getName(category.name)}
                  </h3>
                </Link>
              </StaggerItem>
            );
          })}
          
          <StaggerItem key="menu-du-jour">
            <Link href="/#menu-du-jour" className="flex flex-col items-center group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-primary/20 bg-white shadow-sm flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-md group-hover:border-primary group-hover:scale-105">
                 <UtensilsCrossed className="w-10 h-10 md:w-12 md:h-12 text-primary transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
              </div>
              <h3 className="text-dark font-semibold text-sm md:text-base text-center group-hover:text-primary transition-colors">
                Menu du jour
              </h3>
            </Link>
          </StaggerItem>
        </StaggerContainer>

      </div>
    </section>
  );
}
