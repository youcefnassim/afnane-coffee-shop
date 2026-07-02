// ============================================
// AFNENE Coffee Shop — Design Constants
// ============================================

export const SITE_CONFIG = {
  name: "AFNENE",
  tagline: "Coffee • Drink • Snack",
  description:
    "Experience authentic coffee, delicious food and a warm atmosphere.",
  url: "https://afnene.com",
  locale: "en",
} as const;

export const COLORS = {
  primary: "#004B36",
  secondary: "#D6B370",
  background: "#F8F7F2",
  dark: "#1B1B1B",
  accent: "#B88A44",
  card: "#FFFFFF",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "home" },
  { href: "/#about", label: "about" },
  { href: "/menu", label: "menu" },
  { href: "/gallery", label: "gallery" },
  { href: "/promotions", label: "promotions" },
  { href: "/contact", label: "contact" },
] as const;

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/afnene.snackcoffee?igsh=ajN5YmcyMXU0YXNh",
  facebook: "https://facebook.com/afnene",
  whatsapp: "https://wa.me/213554785079",
} as const;

export const CATEGORIES = [
  "coffee",
  "cold-drinks",
  "breakfast",
  "sandwiches",
  "burgers",
  "pizza",
  "desserts",
  "salads",
  "snacks",
] as const;

export const LOCALES = ["en", "fr", "ar"] as const;
export const DEFAULT_LOCALE = "en" as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  verySlow: 0.8,
} as const;

export const SUPABASE_STORAGE_BUCKETS = {
  images: "images",
  videos: "videos",
  logos: "logos",
  hero: "hero",
  gallery: "gallery",
} as const;
