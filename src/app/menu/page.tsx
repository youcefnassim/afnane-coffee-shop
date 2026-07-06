"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Star,
  Sparkles,
  Tag,
  Heart,
  Flame,
  Play,
  Plus,
  Filter,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimationWrapper } from "@/components/shared/AnimationWrapper";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useProductStore, StoreProduct } from "@/store/useProductStore";
import { Product } from "@/types/database";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const FALLBACK_CATEGORIES = [
  { id: "all", name: "Tous", icon: "🍽️" },
  { id: "coffee", name: "Boissons chaudes", icon: "☕" },
  { id: "cold-drinks", name: "Boissons fresh", icon: "🧊" },
  { id: "mocktails", name: "Mocktail", icon: "🍹" },
  { id: "smoothies", name: "Smoothies", icon: "🥑" },
  { id: "milkshakes", name: "Milkshakes", icon: "🥤" },
  { id: "desserts", name: "Gâteaux (viennoiserie)", icon: "🍰" },
  { id: "snacks-sales", name: "Salés", icon: "🍕" },
]

type FilterType = "available" | "promotions" | "best_sellers";

export default function MenuPage() {
  const [categories, setCategories] = useState<{ id: string; name: string; icon: string }[]>(FALLBACK_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ingredientVideoModal, setIngredientVideoModal] = useState<{ name: string; videoUrl: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  const { addItem } = useCartStore();
  const { products } = useProductStore();

  useEffect(() => {
    setMounted(true);
    async function loadCategories() {
      if (!isSupabaseConfigured()) {
        setCategories(FALLBACK_CATEGORIES);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("categories")
          .select("id, name, icon")
          .order("sort_order", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map((c: any) => ({
            id: c.id,
            name: typeof c.name === "object" ? (c.name?.fr || c.name?.en || c.id) : c.name || c.id,
            icon: c.icon || "🍿",
          }));
          setCategories([{ id: "all", name: "Tous", icon: "🍽️" }, ...mapped]);
        }
      } catch (err) {
        console.error("Error loading categories dynamically, using fallbacks:", err);
        setCategories(FALLBACK_CATEGORIES);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = decodeURIComponent(window.location.hash.replace("#", ""));
      if (hash && categories.some((c) => c.id === hash)) {
        setActiveCategory(hash);
      }
    }
  }, [categories]);

  const toggleFilter = (filter: FilterType) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const resetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setActiveFilters([]);
  };

  const filteredProducts = useMemo(() => {
    let list = products;

    if (activeCategory !== "all") {
      list = list.filter((p) => p.category_id === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.ingredients.toLowerCase().includes(query)
      );
    }

    if (activeFilters.includes("available")) list = list.filter((p) => p.available);
    if (activeFilters.includes("promotions")) list = list.filter((p) => p.promotion);
    if (activeFilters.includes("best_sellers")) list = list.filter((p) => p.best_seller);

    return list;
  }, [products, activeCategory, searchQuery, activeFilters]);

  if (!mounted) return null;

  const handleAddToCart = (e: React.MouseEvent, p: StoreProduct) => {
    e.stopPropagation();
    const product: Product = {
      id: p.id,
      category_id: p.category_id,
      name: { fr: p.name, en: p.name, ar: p.name },
      description: { fr: p.description, en: p.description, ar: p.description },
      ingredients: { fr: p.ingredients, en: p.ingredients, ar: p.ingredients },
      price: p.price,
      media_type: p.media_type,
      media_url: p.media_url,
      thumbnail: p.media_url,
      available: p.available,
      featured: p.featured,
      best_seller: p.best_seller,
      promotion: p.promotion,
      promotion_price: null,
      calories: p.calories || null,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addItem(product);
  };

  const openMediaModal = (e: React.MouseEvent, name: string, mediaUrl: string) => {
    e.stopPropagation();
    setIngredientVideoModal({
      name,
      videoUrl: mediaUrl || "/Video.mp4",
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 bg-background dark:bg-background-dark">
        <div className="container-premium max-w-7xl mx-auto px-4">
          
          {/* Header */}
          <AnimationWrapper type="fade" direction="up">
            <div className="text-center mb-12">
              <span className="text-secondary text-xs font-semibold uppercase tracking-[0.25em] mb-2 block">
                Notre Carte Spéciale
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                Le Menu AFNENE
              </h1>
              <p className="text-muted dark:text-muted-dark text-sm max-w-lg mx-auto mt-3">
                Découvrez nos créations et visionnez la vidéo présentative de chaque recette !
              </p>
            </div>
          </AnimationWrapper>

          {/* Search & Filter Bar */}
          <AnimationWrapper type="fade" direction="up" delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Rechercher un plat, une boisson, un ingrédient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 rounded-2xl bg-card dark:bg-card-dark border border-border dark:border-border-dark text-sm focus:outline-none focus:border-primary shadow-sm"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {[
                  { key: "available" as FilterType, icon: Sparkles, label: "Disponible" },
                  { key: "promotions" as FilterType, icon: Tag, label: "Promos" },
                  { key: "best_sellers" as FilterType, icon: Star, label: "Best Sellers" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => toggleFilter(f.key)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all ${
                      activeFilters.includes(f.key)
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-card dark:bg-card-dark border-border dark:border-border-dark text-muted hover:border-primary/40"
                    }`}
                  >
                    <f.icon className="w-3.5 h-3.5" />
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </AnimationWrapper>

          {/* Categories Horizontal Tabs */}
          <AnimationWrapper type="fade" direction="up" delay={0.15}>
            <div className="flex gap-2 overflow-x-auto pb-4 mb-10 hide-scrollbar">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                    activeCategory === c.id
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-card dark:bg-card-dark text-muted border border-border/60 hover:bg-primary/5"
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </AnimationWrapper>

          {/* Products Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-card dark:bg-card-dark rounded-3xl border border-border/40 p-8 max-w-md mx-auto my-8">
              <Filter className="w-12 h-12 text-primary/40 mx-auto mb-3" />
              <h3 className="font-bold text-lg text-dark dark:text-white mb-1">
                Aucun produit ne correspond à cette recherche
              </h3>
              <p className="text-xs text-muted mb-6">
                Essayez de réinitialiser vos filtres ou de changer de catégorie.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-colors shadow-md"
              >
                Afficher tous les produits
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const hasVideo = product.media_type === "video" || product.media_url?.endsWith(".mp4") || product.media_url?.startsWith("blob:");

                return (
                  <div
                    key={product.id}
                    className="group relative bg-card dark:bg-card-dark rounded-3xl overflow-hidden shadow-sm border border-border/60 dark:border-border-dark/60 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
                  >
                    <div>
                      {/* Media Header Preview */}
                      <div 
                        onClick={(e) => hasVideo && openMediaModal(e, product.name, product.media_url)}
                        className="relative aspect-[4/3] bg-black overflow-hidden cursor-pointer"
                      >
                        {product.media_type === "video" && product.media_url ? (
                          <video src={product.media_url} autoPlay muted loop playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <img
                            src={product.media_url || "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop"}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}

                        {/* Video Play Overlay Button */}
                        {hasVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                            </div>
                          </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                          {product.best_seller && (
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-secondary text-dark uppercase shadow">
                              Best Seller
                            </span>
                          )}
                        </div>

                        {/* Wishlist */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white z-10 hover:scale-110 transition-transform"
                        >
                          <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? "text-red-500 fill-red-500" : ""}`} />
                        </button>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 pb-3">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary capitalize font-semibold">
                            {categories.find((c) => c.id === product.category_id)?.name || product.category_id}
                          </span>
                          {product.calories && (
                            <span className="text-[11px] text-muted flex items-center gap-0.5">
                              <Flame className="w-3 h-3 text-amber-500" /> {product.calories} cal
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-lg text-dark dark:text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                          {product.name}
                        </h3>
                        <p className="text-xs text-muted dark:text-muted-dark line-clamp-2 leading-relaxed mb-3">
                          {product.description}
                        </p>

                        {/* Ingredients list */}
                        {product.ingredients && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {product.ingredients.split(", ").map((ing) => (
                              <span
                                key={ing}
                                onClick={(e) => openMediaModal(e, ing, product.media_url)}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-primary/5 dark:bg-white/5 text-muted hover:text-primary hover:bg-primary/10 cursor-pointer transition-colors flex items-center gap-1"
                              >
                                <Play className="w-2 h-2 text-primary" fill="currentColor" />
                                {ing}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Price & Add to Cart */}
                    <div className="p-5 pt-3 border-t border-border/40 flex items-center justify-between bg-black/5 dark:bg-white/5">
                      <span className="text-lg font-bold text-primary dark:text-secondary">
                        {formatPrice(product.price)}
                      </span>

                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={!product.available}
                        className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-colors flex items-center gap-1.5 disabled:opacity-40"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{product.available ? "Ajouter" : "Épuisé"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Media Video Modal Player */}
      <AnimatePresence>
        {ingredientVideoModal && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIngredientVideoModal(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-black rounded-3xl overflow-hidden shadow-2xl z-10 border border-white/10"
            >
              <div className="flex items-center justify-between p-4 bg-primary text-white">
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-secondary" fill="currentColor" />
                  <h3 className="font-bold text-base md:text-lg">
                    Vidéo Présentative : <span className="text-secondary">{ingredientVideoModal.name}</span>
                  </h3>
                </div>
                <button
                  onClick={() => setIngredientVideoModal(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="relative aspect-video w-full bg-black">
                <video
                  src={ingredientVideoModal.videoUrl}
                  autoPlay
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
