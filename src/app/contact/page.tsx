"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Mail,
  ExternalLink,
} from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimationWrapper, StaggerContainer, StaggerItem } from "@/components/shared/AnimationWrapper";

export default function ContactPage() {
  const { settings, fetchSettings } = useSettingsStore();
  const [showMap, setShowMap] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchSettings();
  }, [fetchSettings]);

  if (!mounted) return null;

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long" });

  const cleanWhatsapp = (settings?.whatsapp || "213554785079")
    .replace(/\+/g, "")
    .replace(/\s/g, "");

  const CONTACT_INFO = [
    {
      icon: Phone,
      title: "Téléphone",
      value: settings?.phone || "+213 554 78 50 79",
      href: `tel:${(settings?.phone || "+213554785079").replace(/\s/g, "")}`,
      action: "Appeler",
      color: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-secondary",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: settings?.phone || "+213 554 78 50 79",
      href: `https://wa.me/${cleanWhatsapp}`,
      action: "Discuter",
      color: "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
    },
    {
      icon: InstagramIcon,
      title: "Instagram",
      value: settings?.instagram || "@afnene.snackcoffee",
      href: settings?.instagram
        ? `https://www.instagram.com/${settings.instagram.replace("@", "")}`
        : "https://www.instagram.com/afnene.snackcoffee",
      action: "Suivre",
      color: "bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400",
    },
    {
      icon: Mail,
      title: "Email",
      value: settings?.email || "hello@afnene.com",
      href: `mailto:${settings?.email || "hello@afnene.com"}`,
      action: "Envoyer un email",
      color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-background dark:bg-background-dark">
        <div className="container-premium">
          {/* Header */}
          <AnimationWrapper type="fade" direction="up">
            <div className="text-center mb-16">
              <span className="text-secondary text-sm font-semibold uppercase tracking-[0.25em] mb-3 block">
                Get in Touch
              </span>
              <h1 className="section-heading">Contact Us</h1>
              <span className="heading-accent" />
              <p className="section-subheading mt-6 font-sans">
                We&apos;d love to hear from you. Reach out anytime — whether for reservations, feedback, or just to say hello.
              </p>
            </div>
          </AnimationWrapper>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Column - Contact Info */}
            <div className="space-y-8">
              {/* Contact Cards */}
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4" staggerDelay={0.08}>
                {CONTACT_INFO.map((info) => (
                  <StaggerItem key={info.title}>
                    <motion.a
                      href={info.href}
                      target={info.href.startsWith("http") ? "_blank" : undefined}
                      rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="block glass-card rounded-[var(--radius-lg)] p-5 group cursor-pointer"
                    >
                      <div className={`w-11 h-11 rounded-xl ${info.color} flex items-center justify-center mb-3`}>
                        <info.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-dark dark:text-white text-sm mb-1 font-sans">
                        {info.title}
                      </h3>
                      <p className="text-muted dark:text-muted-dark text-sm mb-3 font-sans truncate">
                        {info.value}
                      </p>
                      <span className="text-xs font-semibold text-primary dark:text-secondary flex items-center gap-1 group-hover:gap-2 transition-all font-sans">
                        {info.action}
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </motion.a>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* Opening Hours */}
              <AnimationWrapper type="fade" direction="up" delay={0.3}>
                <div className="glass-card rounded-[var(--radius-lg)] p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-secondary" />
                    </div>
                    <h3
                      className="text-lg font-bold text-dark dark:text-white"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Opening Hours
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    <div
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm bg-primary/5 dark:bg-primary/10 font-semibold"
                    >
                      <span className="text-primary dark:text-secondary font-sans">
                        {settings?.opening_hours || "Tous les jours: 07h00 - 22h00"}
                        <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-secondary/20 dark:text-secondary uppercase tracking-wider font-sans">
                          Aujourd'hui
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </AnimationWrapper>

              {/* Location */}
              <AnimationWrapper type="fade" direction="up" delay={0.4}>
                <div className="glass-card rounded-[var(--radius-lg)] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary dark:text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-dark dark:text-white text-sm font-sans">
                        Notre Adresse
                      </h3>
                      <p className="text-muted dark:text-muted-dark text-sm font-sans">
                        {settings?.address || "Afnen SNACK & COFFEE, Oran, Algérie"}
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://maps.app.goo.gl/1H1j9aavHXJKMEWe7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm w-full py-2.5 flex items-center justify-center gap-1.5 font-sans"
                  >
                    <MapPin className="w-4 h-4" />
                    Obtenir l'itinéraire
                  </a>
                </div>
              </AnimationWrapper>
            </div>

            {/* Right Column - Map */}
            <AnimationWrapper type="slide" direction="right" delay={0.2}>
              <div className="space-y-6">
                <div className="rounded-[var(--radius-xl)] overflow-hidden h-[400px] lg:h-[500px] border border-border/40 shadow-lg relative bg-black flex items-center justify-center">
                  {showMap ? (
                    <iframe
                      src={settings?.map_embed || "https://maps.google.com/maps?q=35.7203394,-0.5774749&z=17&output=embed"}
                      className="w-full h-full border-none"
                      allowFullScreen
                      loading="lazy"
                      title="Afnen SNACK & COFFEE Map"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 relative group">
                      {/* Logo Cover Background */}
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 blur-[2px] scale-105 group-hover:scale-100 transition-transform duration-700"
                        style={{ backgroundImage: `url('/logo.jpg')` }}
                      />
                      <div className="absolute inset-0 bg-[#0D2A21]/70 backdrop-blur-[1px]" />
                      
                      {/* Central Content */}
                      <div className="relative z-10 space-y-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#D6B370] shadow-2xl mx-auto bg-black">
                          <img
                            src="/logo.jpg"
                            alt="AFNENE Logo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-bold text-lg text-white uppercase tracking-widest" style={{ fontFamily: "var(--font-heading)" }}>
                          {settings?.shop_name || "AFNENE"} SNACK & COFFEE
                        </h4>
                        <button
                          onClick={() => setShowMap(true)}
                          className="px-6 py-3 rounded-xl bg-[#D6B370] hover:bg-[#D6B370]/95 text-dark font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 font-sans"
                        >
                          Afficher la carte interactive
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* WhatsApp CTA */}
                <div className="rounded-[var(--radius-xl)] overflow-hidden bg-gradient-to-r from-green-600 to-green-500 p-8 text-white relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Order via WhatsApp
                    </h3>
                    <p className="text-white/80 text-sm mb-5 leading-relaxed font-sans">
                      Send us your order directly on WhatsApp for quick service and delivery.
                    </p>
                    <a
                      href={`https://wa.me/${cleanWhatsapp}?text=Bonjour%20AFNENE!%20Je%20souhaite%20passer%20une%20commande.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-lg)] bg-white text-green-700 font-bold text-sm hover:bg-white/90 transition-colors font-sans"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Commander maintenant
                    </a>
                  </div>
                </div>
              </div>
            </AnimationWrapper>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
