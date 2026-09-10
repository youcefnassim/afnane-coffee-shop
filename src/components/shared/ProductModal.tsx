"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus, X, Play } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { StoreProduct } from "@/store/useProductStore";
import { Product } from "@/types/database";

interface ProductModalProps {
  product: StoreProduct | Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (e: React.MouseEvent, product: StoreProduct | Product) => void;
  categories: { id: string; name: string }[];
  wishlist?: string[];
  onToggleWishlist?: (id: string) => void;
  onPlayVideo?: (name: string, url: string) => void;
}

export function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  categories,
  wishlist = [],
  onToggleWishlist,
  onPlayVideo,
}: ProductModalProps) {
  if (!product) return null;

  const categoryName =
    categories.find((c) => c.id === product.category_id)?.name ||
    product.category_id;

  const hasVideo =
    product.media_type === "video" ||
    product.media_url?.endsWith(".mp4") ||
    product.media_url?.startsWith("blob:");

  const isWished = wishlist.includes(product.id);

  // Normalize product name and desc depending on if they are object or string
  const getName = (nameObj: any) => {
    if (!nameObj) return "";
    if (typeof nameObj === "string") return nameObj;
    return nameObj.fr || nameObj.en || nameObj.ar || Object.values(nameObj)[0] || "";
  };

  const name = getName(product.name);
  const description = getName(product.description);
  const ingredients = getName(product.ingredients);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-card dark:bg-card-dark rounded-[24px] overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Top Image/Video area */}
            <div
              className="relative aspect-[4/3] w-full bg-black/5 dark:bg-black/20 shrink-0 cursor-pointer overflow-hidden group flex items-center justify-center"
              onClick={() => {
                if (hasVideo && onPlayVideo && product.media_url) {
                  onPlayVideo(name, product.media_url);
                }
              }}
            >
              {product.media_type === "video" && product.media_url ? (
                <video
                  src={product.media_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <img
                  src={
                    product.media_url ||
                    "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop"
                  }
                  alt={name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                />
              )}

              {/* Heart Wishlist Button */}
              {onToggleWishlist && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product.id);
                  }}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors shadow-sm"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isWished ? "text-red-500 fill-red-500" : "text-white"
                    }`}
                  />
                </button>
              )}

              {hasVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white ml-1" fill="white" />
                  </div>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-2 block">
                {categoryName}
              </span>

              <h2
                className="text-2xl font-bold text-dark dark:text-white mb-3 leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {name}
              </h2>

              <p className="text-muted dark:text-muted-dark text-sm leading-relaxed mb-6">
                {description}
              </p>

              {ingredients && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {ingredients.split(",").map((ing) => {
                    const cleanIng = ing.trim();
                    if (!cleanIng) return null;
                    return (
                      <span
                        key={cleanIng}
                        className="text-xs px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-muted dark:text-muted-dark flex items-center gap-1.5"
                      >
                        <Play className="w-2.5 h-2.5 text-primary" fill="currentColor" />
                        {cleanIng}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-black/5 dark:bg-white/5 flex items-center justify-between border-t border-border/40 shrink-0">
              <div className="text-xl font-bold text-dark dark:text-white">
                {formatPrice(product.price)}
              </div>
              <button
                onClick={(e) => {
                  onAddToCart(e, product);
                  onClose();
                }}
                disabled={!product.available}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-light transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                <span>{product.available ? "Ajouter" : "Épuisé"}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
