"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Image as ImageIcon } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimationWrapper } from "@/components/shared/AnimationWrapper";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const GALLERY_FILTERS = [
  { id: "all", label: "All" },
  { id: "Coffee Shop", label: "Coffee Shop" },
  { id: "Food & Drinks", label: "Food & Drinks" },
  { id: "Moments", label: "Moments" },
];

// Masonry heights for visual variety
const MASONRY_HEIGHTS = ["h-64", "h-80", "h-72", "h-96", "h-64", "h-80", "h-72", "h-64", "h-96", "h-80", "h-72", "h-64"];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      if (!isSupabaseConfigured()) {
        try {
          const local = localStorage.getItem("afnene_gallery");
          if (local) setGalleryItems(JSON.parse(local));
        } catch (e) {}
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setGalleryItems(data);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filtered = activeFilter === "all"
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeFilter);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filtered.length);
    }
  };
  const goPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-background dark:bg-background-dark">
        <div className="container-premium">
          {/* Header */}
          <AnimationWrapper type="fade" direction="up">
            <div className="text-center mb-12">
              <span className="text-secondary text-sm font-semibold uppercase tracking-[0.25em] mb-3 block">
                Visual Journey
              </span>
              <h1 className="section-heading">Our Gallery</h1>
              <span className="heading-accent" />
              <p className="section-subheading mt-6">
                A glimpse into the AFNENE experience — our space, our food, and the moments we create.
              </p>
            </div>
          </AnimationWrapper>

          {/* Filters */}
          <AnimationWrapper type="fade" direction="up" delay={0.1}>
            <div className="flex justify-center gap-2 mb-12 flex-wrap">
              {GALLERY_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-6 py-2.5 rounded-[var(--radius-lg)] text-sm font-medium transition-all duration-300 ${
                    activeFilter === filter.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-card dark:bg-card-dark text-muted dark:text-muted-dark hover:bg-primary/5 dark:hover:bg-white/5 border border-border dark:border-border-dark"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </AnimationWrapper>

          {/* Gallery Grid — Masonry */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
            >
              {filtered.map((item, index) => (
                 <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className={`break-inside-avoid ${MASONRY_HEIGHTS[index % MASONRY_HEIGHTS.length]} rounded-[var(--radius-lg)] overflow-hidden relative group cursor-pointer bg-gradient-to-br ${item.color || "from-primary/10 to-secondary/10"}`}
                  onClick={() => openLightbox(index)}
                >
                  {/* Real Content */}
                  {item.type === "video" ? (
                    <video
                      src={item.url}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.caption}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Overlay / Play Button for Mobile and Desktop Hover */}
                  <div className="absolute inset-0 bg-black/25 md:bg-dark/0 md:group-hover:bg-dark/40 transition-all duration-500 flex items-center justify-center">
                    <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 text-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-1.5 shadow-lg">
                        {item.type === "video" ? (
                          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <p className="text-white text-xs font-semibold px-2 truncate max-w-[150px]">{item.caption}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-dark/95 backdrop-blur-xl flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 md:left-8 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 md:right-8 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Content */}
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-[85vw] h-[80vh] max-w-4xl rounded-[var(--radius-xl)] overflow-hidden relative flex items-center justify-center bg-black/40"
              onClick={(e) => e.stopPropagation()}
            >
              {filtered[lightboxIndex]?.type === "video" ? (
                <video src={filtered[lightboxIndex]?.url} controls autoPlay loop className="w-full h-full object-contain" />
              ) : (
                <img src={filtered[lightboxIndex]?.url} alt={filtered[lightboxIndex]?.caption} className="w-full h-full object-contain" />
              )}
              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white text-center">
                <p className="text-lg font-bold">{filtered[lightboxIndex]?.caption}</p>
                <p className="text-xs text-white/70 mt-1">
                  {lightboxIndex + 1} / {filtered.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
