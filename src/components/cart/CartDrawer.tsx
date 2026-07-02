"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotalPrice,
    getDiscountAmount,
    getTotalPrice,
    getTotalCount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [promoInput, setPromoInput] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getSubtotalPrice();
  const discount = getDiscountAmount();
  const totalPrice = getTotalPrice();
  const totalCount = getTotalCount();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyPromoCode(promoInput);
    if (result.success) {
      toast.success(result.message);
      setPromoInput("");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-screen max-w-md bg-background dark:bg-card-dark shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 bg-primary text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-full">
                    <ShoppingBag className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                      Votre Panier
                    </h2>
                    <p className="text-xs text-white/70">
                      {totalCount} {totalCount > 1 ? "articles" : "article"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-muted dark:text-muted-dark py-12">
                    <div className="w-20 h-20 rounded-full bg-primary/5 dark:bg-white/5 flex items-center justify-center mb-4">
                      <ShoppingBag className="w-10 h-10 text-primary/40 dark:text-white/40" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-semibold text-lg text-dark dark:text-white mb-1">
                      Votre panier est vide
                    </h3>
                    <p className="text-sm max-w-[220px] mb-6">
                      Découvrez notre menu et ajoutez vos gourmandises préférées !
                    </p>
                    <button
                      onClick={closeCart}
                      className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors"
                    >
                      Voir le menu
                    </button>
                  </div>
                ) : (
                  items.map(({ product, quantity }) => {
                    const name = typeof product.name === "object" ? product.name.fr || product.name.en || "" : product.name;
                    const price = product.promotion && product.promotion_price ? product.promotion_price : product.price;
                    const imageUrl = product.media_url || "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300&auto=format&fit=crop";

                    return (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-3 rounded-2xl bg-white dark:bg-card-dark border border-border/60 dark:border-border-dark/60 shadow-sm"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-secondary/10">
                          <Image src={imageUrl} alt={name} fill className="object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-dark dark:text-white text-sm truncate">
                            {name}
                          </h4>
                          <p className="text-secondary font-bold text-sm mt-0.5">
                            {price} DA
                          </p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="w-6 h-6 rounded-md bg-background dark:bg-white/10 flex items-center justify-center text-dark dark:text-white hover:bg-primary/10 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-semibold px-1 min-w-[16px] text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="w-6 h-6 rounded-md bg-background dark:bg-white/10 flex items-center justify-center text-dark dark:text-white hover:bg-primary/10 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(product.id)}
                          className="p-2 text-muted hover:text-danger transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer / Checkout */}
              {items.length > 0 && (
                <div className="p-6 bg-white dark:bg-card-dark border-t border-border/60 dark:border-border-dark/60 space-y-4">
                  {/* Promo Code Input */}
                  <div>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/10 border border-secondary/30 text-xs font-semibold">
                        <span className="flex items-center gap-1.5 text-secondary-dark">
                          <Tag className="w-4 h-4" />
                          Code {appliedPromo.code} (-{appliedPromo.discountPercentage}%)
                        </span>
                        <button
                          onClick={removePromoCode}
                          className="text-muted hover:text-danger transition-colors text-xs"
                        >
                          Retirer
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyPromo} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Code promo (ex: WELCOME10)"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="flex-1 px-3.5 py-2 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-xs text-dark dark:text-white focus:outline-none focus:border-primary uppercase"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary-light transition-colors"
                        >
                          Appliquer
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Pricing Summary */}
                  <div className="space-y-1.5 text-xs">
                    {appliedPromo && (
                      <>
                        <div className="flex items-center justify-between text-muted">
                          <span>Sous-total</span>
                          <span>{subtotal} DA</span>
                        </div>
                        <div className="flex items-center justify-between text-secondary font-semibold">
                          <span>Réduction ({appliedPromo.discountPercentage}%)</span>
                          <span>-{discount} DA</span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center justify-between text-base font-bold text-dark dark:text-white pt-1">
                      <span>Total</span>
                      <span className="text-primary dark:text-secondary text-xl">{totalPrice} DA</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary text-white font-bold hover:bg-primary-light transition-colors shadow-lg shadow-primary/20"
                  >
                    <span>Passer la commande</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
