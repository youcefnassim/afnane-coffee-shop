// ============================================
// AFNENE Coffee Shop — Database Types
// ============================================

export type MediaType = "image" | "video";
export type GalleryCategory = "shop" | "food" | "customers";
export type ReviewSource = "website" | "google";

export interface Category {
  id: string;
  name: Record<string, string>;
  image: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: Record<string, string>;
  description: Record<string, string> | null;
  ingredients: Record<string, string> | null;
  price: number;
  media_type: MediaType;
  media_url: string | null;
  thumbnail: string | null;
  available: boolean;
  featured: boolean;
  best_seller: boolean;
  promotion: boolean;
  promotion_price: number | null;
  calories: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category;
}

export interface DailyMenu {
  id: string;
  title: Record<string, string>;
  description: Record<string, string> | null;
  media_type: MediaType;
  media_url: string | null;
  price: number;
  active: boolean;
  date: string;
  created_at: string;
}

export interface Promotion {
  id: string;
  product_id: string | null;
  title: Record<string, string>;
  description: Record<string, string> | null;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  active: boolean;
  media_url: string | null;
  media_type: MediaType;
  created_at: string;
  // Joined
  product?: Product;
}

export interface GalleryItem {
  id: string;
  media_type: MediaType;
  media_url: string;
  caption: Record<string, string> | null;
  category: GalleryCategory | null;
  sort_order: number;
  created_at: string;
}

export interface Review {
  id: string;
  customer_name: string;
  avatar_url: string | null;
  rating: number;
  comment: Record<string, string> | null;
  source: ReviewSource;
  active: boolean;
  created_at: string;
}

export interface Settings {
  id: string;
  restaurant_name: string;
  phone: string | null;
  address: Record<string, string> | null;
  instagram: string | null;
  facebook: string | null;
  whatsapp: string | null;
  google_maps: string | null;
  opening_hours: OpeningHours | null;
  logo: string | null;
  hero_video: string | null;
  theme: ThemeConfig | null;
  created_at: string;
  updated_at: string;
}

export interface OpeningHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface ThemeConfig {
  primary: string;
  secondary: string;
  background: string;
}

export interface Visitor {
  id: string;
  page: string | null;
  user_agent: string | null;
  table_number: number | null;
  visited_at: string;
}

export interface WishlistItem {
  id: string;
  session_id: string;
  product_id: string;
  created_at: string;
}

export type OrderStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled";
export type OrderType = "click_and_collect" | "dine_in";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: Product;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  order_type: OrderType;
  table_number?: number | null;
  pickup_time?: string | null;
  notes?: string | null;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

// ============================================
// Admin Types
// ============================================

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "super_admin";
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  activePromotions: number;
  todayVisitors: number;
}

// ============================================
// Form Types
// ============================================

export interface ProductFormData {
  name_en: string;
  name_fr: string;
  name_ar: string;
  description_en: string;
  description_fr: string;
  description_ar: string;
  ingredients_en: string;
  ingredients_fr: string;
  ingredients_ar: string;
  category_id: string;
  price: number;
  media_type: MediaType;
  available: boolean;
  featured: boolean;
  best_seller: boolean;
  promotion: boolean;
  promotion_price: number | null;
  calories: number | null;
}

export interface CategoryFormData {
  name_en: string;
  name_fr: string;
  name_ar: string;
  active: boolean;
}
