"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Grid, Plus, X } from "lucide-react";
import Link from "next/link";
import { AnimationWrapper, StaggerContainer, StaggerItem } from "@/components/shared/AnimationWrapper";
import { useCartStore } from "@/store/useCartStore";
import { useProductStore, StoreProduct } from "@/store/useProductStore";
import { Product } from "@/types/database";

export function FeaturedProducts() {
  const { addItem } = useCartStore();
  const { products } = useProductStore();
  const [mounted, setMounted] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{ name: string; url: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Filter featured products or take top 4
  const featuredList = products.filter((p) => p.featured).slice(0, 4);
  const displayList = featuredList.length > 0 ? featuredList : products.slice(0, 4);

  const handleAddToCart = (e: React.MouseEvent, item: StoreProduct) => {
    e.stopPropagation();
    const product: Product = {
      id: item.id,
      category_id: item.category_id,
      name: { fr: item.name, en: item.name, ar: item.name },
      description: { fr: item.description, en: item.description, ar: item.description },
      ingredients: { fr: item.ingredients, en: item.ingredients, ar: item.ingredients },
      price: item.price,
      media_type: item.media_type,
      media_url: item.media_url,
      thumbnail: item.media_url,
      available: item.available,
      featured: item.featured,
      best_seller: item.best_seller,
      promotion: item.promotion,
      promotion_price: null,
      calories: item.calories || null,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addItem(product);
  };

  return (
    <section className="py-24 bg-background">
      <div className="container-premium max-w-7xl mx-auto">
        
        {/* Section Header */}
        <AnimationWrapper type="fade" direction="up">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl md:text-5xl font-bold text-primary mb-4 uppercase tracking-widest"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Nos Spécialités
            </h2>
            <div className="flex items-center justify-center gap-2">
               <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="currentColor">
                  <path d="M17.6,4.2C16,2.7,13.7,2.1,11.5,2.6c-2.3,0.5-4.2,2.1-5.3,4.2C5.1,9.2,4.8,12,5.7,14.5c-1.3,1.3-2.6,2.7-3.9,4 c-0.6,0.6-0.6,1.5,0,2.1c0.6,0.6,1.5,0.6,2.1,0c1.3-1.3,2.7-2.6,4-3.9c2.4,0.9,5.2,0.6,7.7-0.5c2.1-1,3.7-2.9,4.2-5.3 C20.3,8.7,19.6,6.3,17.6,4.2z M17,10.6c-0.4,1.8-1.6,3.2-3.2,3.9c-1.7,0.8-3.7,0.7-5.3-0.2c-0.3-0.2-0.7-0.1-0.9,0.2 C7.5,14.6,7.6,15,7.9,15.2c1.9,1.1,4.4,1.3,6.5,0.3c2-0.9,3.5-2.7,4-4.9c0.5-2.2,0-4.6-1.5-6.3c-1.5-1.7-3.8-2.3-6-1.8 c-0.4,0.1-0.6,0.5-0.5,0.9c0.1,0.4,0.5,0.6,0.9,0.5c1.8-0.4,3.6,0,4.8,1.3C17.3,6.7,17.6,8.6,17,10.6z"/>
               </svg>
            </div>
          </div>
        </AnimationWrapper>

        {/* 4 Cards Grid */}
        <StaggerContainer 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" 
          staggerDelay={0.1}
        >
          {displayList.map((item) => {
            const hasVideo = item.media_type === "video" || item.media_url?.endsWith(".mp4") || item.media_url?.startsWith("blob:");
            const bgImage = item.media_type === "image" && item.media_url ? item.media_url : "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop";

            return (
              <StaggerItem key={item.id}>
                <motion.div 
                  whileHover={{ y: -8 }}
                  onClick={() => hasVideo && setActiveVideo({ name: item.name, url: item.media_url || "/Video.mp4" })}
                  className="group relative aspect-square rounded-[24px] overflow-hidden cursor-pointer shadow-lg bg-black"
                >
                  {/* Background Image / Video preview */}
                  {item.media_type === "video" && item.media_url ? (
                    <video src={item.media_url} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${bgImage})` }}
                    />
                  )}
                  
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Badge */}
                  {item.best_seller && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-4 py-1.5 text-xs font-bold rounded-md tracking-wider uppercase bg-secondary text-dark">
                        Best Seller
                      </span>
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  {hasVideo && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-xl hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-white ml-1" fill="white" />
                       </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                    <h3 
                      className="text-white font-bold text-lg md:text-xl mb-0.5 drop-shadow-md"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-white/80 text-xs line-clamp-1 mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-secondary font-bold text-base md:text-lg">
                        {item.price} DA
                      </p>
                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        className="px-3 py-2 rounded-xl bg-white/20 hover:bg-secondary hover:text-dark text-white backdrop-blur-md transition-all duration-300 flex items-center gap-1 text-xs font-semibold"
                        title="Ajouter au panier"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* View All Button */}
        <div className="mt-16 flex justify-center">
          <Link 
            href="/menu"
            className="flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-light transition-colors"
          >
            Voir tout le menu
            <Grid className="w-4 h-4 ml-2" />
          </Link>
        </div>

      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setActiveVideo(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-3xl bg-black rounded-3xl overflow-hidden shadow-2xl z-10 border border-white/10"
            >
              <div className="flex items-center justify-between p-4 bg-primary text-white">
                <h3 className="font-bold text-lg">{activeVideo.name} — Vidéo Présentative</h3>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="relative aspect-video w-full bg-black">
                <video
                  src={activeVideo.url}
                  autoPlay
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
