"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Clock, User, Phone, CheckCircle2, Utensils, MessageCircle, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { settings, fetchSettings } = useSettingsStore();
  const {
    items,
    getSubtotalPrice,
    getDiscountAmount,
    getTotalPrice,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    clearCart,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [orderType, setOrderType] = useState<"click_and_collect" | "dine_in">("click_and_collect");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("15-20 min");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchSettings();

    // Check table query param or sessionStorage
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get("table");
    if (tableParam) {
      setOrderType("dine_in");
      setTableNumber(tableParam);
      sessionStorage.setItem("afnene_table", tableParam);
    } else {
      const cachedTable = sessionStorage.getItem("afnene_table");
      if (cachedTable) {
        setOrderType("dine_in");
        setTableNumber(cachedTable);
      }
    }
  }, [fetchSettings]);

  if (!mounted) return null;

  const subtotal = getSubtotalPrice();
  const discount = getDiscountAmount();
  const totalPrice = getTotalPrice();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyPromoCode(promoInput);
    if (res.success) {
      toast.success(res.message);
      setPromoInput("");
    } else {
      toast.error(res.message);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Veuillez remplir votre nom et numéro de téléphone");
      return;
    }

    setIsSubmitting(true);

    // Format WhatsApp Order Message
    const orderItemsSummary = items
      .map((i) => {
        const itemName = typeof i.product.name === "object" ? i.product.name.fr || i.product.name.en : i.product.name;
        const p = i.product.promotion && i.product.promotion_price ? i.product.promotion_price : i.product.price;
        return `• ${i.quantity}x ${itemName} (${p * i.quantity} DA)`;
      })
      .join("\n");

    const message = `☕ *NOUVELLE COMMANDE AFNENE COFFEE*\n\n` +
      `👤 *Client :* ${name}\n` +
      `📞 *Tél :* ${phone}\n` +
      `📍 *Type :* ${orderType === "click_and_collect" ? `Click & Collect (${pickupTime})` : `Sur place (Table ${tableNumber || 1})`}\n` +
      (notes ? `📝 *Notes :* ${notes}\n` : "") +
      `\n🛒 *DÉTAILS DE LA COMMANDE :*\n${orderItemsSummary}\n\n` +
      (appliedPromo ? `🏷️ *Code Promo :* ${appliedPromo.code} (-${appliedPromo.discountPercentage}%)\n` : "") +
      `💰 *TOTAL : ${totalPrice} DA*`;

    const encodedMessage = encodeURIComponent(message);
    const cleanWhatsapp = (settings?.whatsapp || "213554785079")
      .replace(/\+/g, "")
      .replace(/\s/g, "");
    const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodedMessage}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
      toast.success("Commande transmise ! Ouverture de WhatsApp...");
      window.open(whatsappUrl, "_blank");
    }, 800);
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white dark:bg-card-dark p-8 rounded-3xl shadow-xl border border-border/40 flex flex-col items-center"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-dark dark:text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Merci pour votre commande !
          </h1>
          <p className="text-muted dark:text-muted-dark text-sm mb-6">
            Votre commande a été enregistrée et transmise via WhatsApp.
          </p>
          <div className="w-full p-4 rounded-2xl bg-background dark:bg-white/5 text-left text-xs space-y-2 mb-6">
            <p className="flex justify-between">
              <span className="text-muted">Type :</span>
              <span className="font-semibold text-dark dark:text-white">
                {orderType === "click_and_collect" ? "Click & Collect" : `Sur place (Table ${tableNumber || "1"})`}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted">Client :</span>
              <span className="font-semibold text-dark dark:text-white">{name} ({phone})</span>
            </p>
          </div>
          <Link
            href="/"
            className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-light transition-colors"
          >
            Retour à l'accueil
          </Link>
        </motion.div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-20 bg-background flex items-center justify-center">
          <div className="text-center p-8">
            <ShoppingBag className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-dark dark:text-white mb-2">Votre panier est vide</h1>
            <p className="text-muted mb-6">Ajoutez des articles avant de passer commande.</p>
            <Link href="/menu" className="btn-primary px-6 py-3 rounded-full text-sm">
              Découvrir le menu
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20 bg-background">
        <div className="container-premium max-w-5xl mx-auto px-4">
          <Link href="/menu" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour au menu
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8" style={{ fontFamily: "var(--font-heading)" }}>
            Validation de votre commande
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form */}
            <div className="lg:col-span-7 space-y-6">
              <form onSubmit={handleSubmitOrder} className="bg-white dark:bg-card-dark p-6 md:p-8 rounded-3xl shadow-sm border border-border/40 space-y-6">
                
                {/* Order Type Selector */}
                <div>
                  <label className="block text-sm font-semibold text-dark dark:text-white mb-3">
                    Type de commande
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderType("click_and_collect")}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                        orderType === "click_and_collect"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border/60 text-muted hover:border-primary/40"
                      }`}
                    >
                      <ShoppingBag className="w-6 h-6" />
                      <span className="text-sm font-bold">Click & Collect</span>
                      <span className="text-[11px] opacity-75">À emporter</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType("dine_in")}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                        orderType === "dine_in"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border/60 text-muted hover:border-primary/40"
                      }`}
                    >
                      <Utensils className="w-6 h-6" />
                      <span className="text-sm font-bold">Sur place</span>
                      <span className="text-[11px] opacity-75">À table</span>
                    </button>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-4 pt-4 border-t border-border/40">
                  <h3 className="text-sm font-semibold text-dark dark:text-white">Vos informations</h3>
                  
                  <div>
                    <label className="block text-xs text-muted mb-1">Nom complet *</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3.5 text-muted" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Mohamed Ali"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-muted mb-1">Numéro de téléphone *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-muted" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: 0550 12 34 56"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {orderType === "click_and_collect" ? (
                    <div>
                      <label className="block text-xs text-muted mb-1">Heure estimée de récupération</label>
                      <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
                      >
                        <option value="Dès que possible (15-20 min)">Dès que possible (15-20 min)</option>
                        <option value="Dans 30 minutes">Dans 30 minutes</option>
                        <option value="Dans 45 minutes">Dans 45 minutes</option>
                        <option value="Dans 1 heure">Dans 1 heure</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs text-muted mb-1">Numéro de table</label>
                      <input
                        type="number"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="Ex: 5"
                        className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-muted mb-1">Notes particulières (optionnel)</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex: Sans sucre, avec extra glaçons..."
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-[#113a29] text-white font-bold text-base hover:bg-primary transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <MessageCircle className="w-5 h-5 text-green-400" />
                  {isSubmitting ? "Validation..." : `Envoyer via WhatsApp (${totalPrice} DA)`}
                </button>
              </form>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-card-dark p-6 rounded-3xl shadow-sm border border-border/40 sticky top-28 space-y-4">
                <h3 className="font-bold text-lg text-dark dark:text-white pb-3 border-b border-border/40">
                  Récapitulatif
                </h3>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {items.map(({ product, quantity }) => {
                    const name = typeof product.name === "object" ? product.name.fr || product.name.en || "" : product.name;
                    const price = product.promotion && product.promotion_price ? product.promotion_price : product.price;
                    const imageUrl = product.media_url || "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300&auto=format&fit=crop";

                    return (
                      <div key={product.id} className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-secondary/10">
                          <Image src={imageUrl} alt={name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-dark dark:text-white truncate">{name}</p>
                          <p className="text-xs text-muted">Qté : {quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-primary dark:text-secondary">{price * quantity} DA</p>
                      </div>
                    );
                  })}
                </div>

                {/* Promo Input in Checkout */}
                <div className="pt-3 border-t border-border/40">
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/10 border border-secondary/30 text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-secondary-dark">
                        <Tag className="w-3.5 h-3.5" />
                        Code {appliedPromo.code} (-{appliedPromo.discountPercentage}%)
                      </span>
                      <button onClick={removePromoCode} className="text-muted hover:text-danger text-xs">
                        Retirer
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Code promo"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-border dark:border-border-dark bg-background text-xs uppercase"
                      />
                      <button type="submit" className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-semibold">
                        Appliquer
                      </button>
                    </form>
                  )}
                </div>

                <div className="pt-2 space-y-2 text-xs">
                  {appliedPromo && (
                    <>
                      <div className="flex justify-between text-muted">
                        <span>Sous-total</span>
                        <span>{subtotal} DA</span>
                      </div>
                      <div className="flex justify-between text-secondary font-semibold">
                        <span>Réduction</span>
                        <span>-{discount} DA</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-lg font-bold text-dark dark:text-white pt-2 border-t border-border/40">
                    <span>Total</span>
                    <span className="text-primary dark:text-secondary">{totalPrice} DA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
