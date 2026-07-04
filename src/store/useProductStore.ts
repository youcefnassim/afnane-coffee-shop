import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

export interface StoreProduct {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  media_type: "image" | "video";
  media_url: string;
  available: boolean;
  best_seller: boolean;
  featured: boolean;
  promotion: boolean;
  calories?: number;
  ingredients: string;
}

const INITIAL_PRODUCTS: StoreProduct[] = [
  // ==================== HOT DRINKS ====================
  { id: "1", category_id: "coffee", name: "Espresso", description: "Espresso classique intense, riche en arômes.", price: 150, media_type: "image", media_url: "https://images.unsplash.com/photo-1510701114235-ff5341f9746c?q=80&w=600&auto=format&fit=crop", available: true, best_seller: true, featured: false, promotion: false, ingredients: "Café de spécialité" },
  { id: "2", category_id: "coffee", name: "Espresso Arabica & Robusta", description: "Mélange équilibré de grains Arabica et Robusta.", price: 250, media_type: "image", media_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Grains Arabica & Robusta" },
  { id: "3", category_id: "coffee", name: "Capsule Caps", description: "Café en capsule Caps préparé avec soin.", price: 250, media_type: "image", media_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Capsule Caps" },
  { id: "4", category_id: "coffee", name: "Capsule L'Or", description: "Café de capsule de marque L'Or Espresso.", price: 300, media_type: "image", media_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Capsule L'Or" },
  { id: "5", category_id: "coffee", name: "Capsule Nespresso", description: "Café en capsule premium Nespresso.", price: 350, media_type: "image", media_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Capsule Nespresso" },
  { id: "6", category_id: "coffee", name: "Americano", description: "Double shot d'espresso allongé à l'eau chaude.", price: 300, media_type: "image", media_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Espresso, eau chaude" },
  { id: "7", category_id: "coffee", name: "Cafe Latte", description: "Espresso mélangé à du lait chaud avec une fine couche de mousse.", price: 350, media_type: "image", media_url: "https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Espresso, lait chaud, mousse" },
  { id: "8", category_id: "coffee", name: "Chocolate Milk", description: "Lait crémeux délicieusement chocolaté.", price: 350, media_type: "image", media_url: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Lait, chocolat fondu" },
  { id: "9", category_id: "coffee", name: "Piccolo Latte", description: "Ristretto court garni de lait velouté chaud.", price: 350, media_type: "image", media_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Ristretto, lait chaud" },
  { id: "10", category_id: "coffee", name: "Latte Macchiato", description: "Lait chaud, mousse onctueuse et shot d'espresso superposé.", price: 350, media_type: "image", media_url: "https://images.unsplash.com/photo-1599398054066-846f28917f38?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: true, promotion: false, ingredients: "Lait, espresso" },
  { id: "11", category_id: "coffee", name: "Cortado", description: "Espresso coupé avec une quantité égale de lait chaud.", price: 350, media_type: "image", media_url: "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Espresso, lait chaud" },
  { id: "12", category_id: "coffee", name: "Cinnamon Latte", description: "Latte parfumé à la cannelle pour une touche épicée.", price: 350, media_type: "image", media_url: "https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Espresso, lait, sirop de cannelle" },
  { id: "13", category_id: "coffee", name: "Cafe Bombon", description: "Espresso servi avec du lait concentré sucré.", price: 350, media_type: "image", media_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Espresso, lait concentré sucré" },
  { id: "14", category_id: "coffee", name: "Cappuccino", description: "Un tiers espresso, un tiers lait chaud, un tiers mousse.", price: 400, media_type: "image", media_url: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop", available: true, best_seller: true, featured: true, promotion: false, ingredients: "Espresso, lait chaud, mousse" },
  { id: "15", category_id: "coffee", name: "Cafe Mocha", description: "Espresso, chocolat chaud et lait cuit à la vapeur.", price: 400, media_type: "image", media_url: "https://images.unsplash.com/photo-1607687314557-0130cc00d6aa?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Espresso, chocolat, lait" },
  { id: "16", category_id: "coffee", name: "Flat White", description: "Double ristretto garni de lait micro-mousse onctueux.", price: 400, media_type: "image", media_url: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Double ristretto, lait chaud" },
  { id: "17", category_id: "coffee", name: "Hot Chocolate", description: "Chocolat chaud onctueux fait maison.", price: 500, media_type: "image", media_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Chocolat noir, lait chaud, cacao" },
  { id: "18", category_id: "coffee", name: "Matcha Latte", description: "Thé matcha japonais traditionnel et lait crémeux.", price: 600, media_type: "image", media_url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: true, promotion: false, ingredients: "Matcha de cérémonie, lait chaud" },
  { id: "19", category_id: "coffee", name: "Ube Latte", description: "Boisson originale à base d'ube (igname violet) et de lait.", price: 600, media_type: "image", media_url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Ube, lait chaud" },

  // ==================== COLD DRINKS ====================
  { id: "20", category_id: "cold-drinks", name: "Iced Latte", description: "Espresso et lait frais versés sur de la glace.", price: 400, media_type: "image", media_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Espresso, lait, glaçons" },
  { id: "21", category_id: "cold-drinks", name: "Iced Caramel Macchiato", description: "Espresso glacé au caramel fondant et lait.", price: 450, media_type: "image", media_url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: true, ingredients: "Espresso, caramel, lait, glaçons" },
  { id: "22", category_id: "cold-drinks", name: "Iced Spanish Latte", description: "Café glacé doux et crémeux préparé avec du lait condensé.", price: 450, media_type: "image", media_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop", available: true, best_seller: true, featured: true, promotion: false, ingredients: "Espresso, lait concentré, lait, glaçons" },
  { id: "23", category_id: "cold-drinks", name: "Iced Mocha Latte", description: "Café glacé chocolaté et rafraîchissant.", price: 450, media_type: "image", media_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Espresso, chocolat, lait, glaçons" },
  { id: "24", category_id: "cold-drinks", name: "Affogato", description: "Espresso chaud versé sur une boule de glace vanille.", price: 500, media_type: "image", media_url: "https://images.unsplash.com/photo-1594911774802-8822a707cff3?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Glace vanille, espresso chaud" },
  { id: "25", category_id: "cold-drinks", name: "Dalgona Coffee", description: "Lait frais surmonté d'une mousse de café fouettée.", price: 500, media_type: "image", media_url: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Mousse de café fouettée, lait, glaçons" },
  { id: "26", category_id: "cold-drinks", name: "Iced Matcha Latte", description: "Matcha japonais servi glacé avec du lait.", price: 600, media_type: "image", media_url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Matcha, lait, glaçons" },
  { id: "27", category_id: "cold-drinks", name: "Iced Ube", description: "Lait à l'ube violet glacé et onctueux.", price: 600, media_type: "image", media_url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Ube, lait, glaçons" },
  { id: "28", category_id: "cold-drinks", name: "Iced Matcha", description: "Matcha pur préparé à l'eau et servi sur glace.", price: 650, media_type: "image", media_url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Matcha pur, eau, glaçons" },
  { id: "29", category_id: "cold-drinks", name: "Iced Tea", description: "Thé infusé glacé, fruité et rafraîchissant.", price: 400, media_type: "image", media_url: "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Thé noir infusé, citron, menthe, glaçons" },

  // ==================== CRAFTED COCKTAILS ====================
  { id: "30", category_id: "cold-drinks", name: "Cocktail Solo (Orange, Banane, Fraise)", description: "Jus de fruits frais pressés de saison au choix.", price: 500, media_type: "image", media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Jus de fruits frais pressés" },
  { id: "31", category_id: "cold-drinks", name: "Pina Colada", description: "Cocktail tropical à base d'ananas et coco.", price: 500, media_type: "image", media_url: "https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Jus d'ananas, crème de coco, glaçons" },
  { id: "32", category_id: "cold-drinks", name: "Bora Bora", description: "Cocktail fruité et coloré aux saveurs des îles.", price: 500, media_type: "image", media_url: "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Jus de fruits exotiques, sirop" },
  { id: "33", category_id: "cold-drinks", name: "Virgin Sunrise", description: "Mélange fruité à l'orange et grenadine.", price: 500, media_type: "image", media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Jus d'orange, sirop de grenadine" },
  { id: "34", category_id: "cold-drinks", name: "Pink Lady", description: "Cocktail onctueux et fruité aux notes de grenadine.", price: 550, media_type: "image", media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Jus de pamplemousse, grenadine, crème" },
  { id: "35", category_id: "cold-drinks", name: "There Will Be Blood", description: "Cocktail rouge intense aux baies sauvages.", price: 650, media_type: "image", media_url: "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Jus de grenade, baies, sirop" },
  { id: "36", category_id: "cold-drinks", name: "Detox", description: "Jus vert ultra-frais et revitalisant.", price: 650, media_type: "image", media_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Concombre, pomme verte, menthe, citron" },
  { id: "37", category_id: "cold-drinks", name: "Fruit Cocktail", description: "Mélange de saison de fruits frais mixés.", price: 700, media_type: "image", media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Fruits de saison frais" },
  { id: "38", category_id: "cold-drinks", name: "Healthy", description: "Jus pressé énergisant et vitaminé.", price: 1000, media_type: "image", media_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: true, promotion: false, ingredients: "Gingembre, carotte, orange, citron" },

  // ==================== MOJITOS ====================
  { id: "39", category_id: "cold-drinks", name: "Mojito Classic", description: "Menthe fraîche, citron vert vert pressé et soda.", price: 500, media_type: "image", media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop", available: true, best_seller: true, featured: true, promotion: false, ingredients: "Citron vert, menthe, soda, sucre de canne" },
  { id: "40", category_id: "cold-drinks", name: "Mojito Red", description: "Mojito rafraîchissant aux fruits rouges.", price: 600, media_type: "image", media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Menthe, citron, soda, sirop de fraise/framboise" },
  { id: "41", category_id: "cold-drinks", name: "Mojito Blue Ocean", description: "Mojito bleu électrique au curaçao.", price: 600, media_type: "image", media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Menthe, citron, soda, sirop de curaçao bleu" },
  { id: "42", category_id: "cold-drinks", name: "Mojito Exotic", description: "Mojito exotique aux fruits de la passion.", price: 650, media_type: "image", media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Menthe, citron, soda, fruits de la passion" },

  // ==================== SMOOTHIES ====================
  { id: "43", category_id: "cold-drinks", name: "Smoothie Classic Banana", description: "Banane onctueuse mixée au lait de coco.", price: 600, media_type: "image", media_url: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Banane, lait, miel, glaçons" },
  { id: "44", category_id: "cold-drinks", name: "Smoothie Blue Berry", description: "Mûres et myrtilles sauvages mixées.", price: 600, media_type: "image", media_url: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Myrtilles, yaourt, lait, glaçons" },
  { id: "45", category_id: "cold-drinks", name: "Smoothie Banana Colada", description: "Cocktail gourmand banane, ananas et coco.", price: 650, media_type: "image", media_url: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Banane, jus d'ananas, coco, glaçons" },
  { id: "46", category_id: "cold-drinks", name: "Smoothie Miami Beach Mango", description: "Mangue tropicale mixée ultra-fraîche.", price: 650, media_type: "image", media_url: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Mangue mûre, jus d'orange, glaçons" },

  // ==================== MILKSHAKES ====================
  { id: "47", category_id: "cold-drinks", name: "Milkshake Classic", description: "Milkshake crémeux classique à la vanille.", price: 550, media_type: "image", media_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Glace vanille, lait, crème fouettée" },
  { id: "48", category_id: "cold-drinks", name: "Milkshake Banana", description: "Glace vanille et banane fraîche mixées.", price: 600, media_type: "image", media_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Banane, lait, crème" },
  { id: "49", category_id: "cold-drinks", name: "Milkshake Chocolate", description: "Milkshake riche au cacao et chocolat.", price: 600, media_type: "image", media_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Chocolat fondu, crème, lait" },
  { id: "50", category_id: "cold-drinks", name: "Milkshake Oreo", description: "Le célèbre biscuit Oreo mixé avec de la glace.", price: 600, media_type: "image", media_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Biscuits Oreo, glace vanille, lait" },
  { id: "51", category_id: "cold-drinks", name: "Milkshake Biscuit Caramel", description: "Gourmandise au spéculoos et filet de caramel.", price: 650, media_type: "image", media_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Biscuit spéculoos, caramel, glace vanille" },
  { id: "52", category_id: "cold-drinks", name: "Milkshake Overdose", description: "Une explosion de douceurs sucrées superposées.", price: 650, media_type: "image", media_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Chocolat, caramel, biscuits, topping géant" },
  { id: "53", category_id: "cold-drinks", name: "Milkshake Pistachio", description: "Pistache d'Italie crémeuse et éclats de pistaches.", price: 700, media_type: "image", media_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600&auto=format&fit=crop", available: true, best_seller: true, featured: true, promotion: false, ingredients: "Pistache, lait, glace premium, toppings" },

  // ==================== PASTRIES & DESSERTS ====================
  { id: "54", category_id: "desserts", name: "Croissant Beurre", description: "Croissant au beurre français, croustillant et chaud.", price: 120, media_type: "image", media_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Pâte feuilletée, beurre" },
  { id: "55", category_id: "desserts", name: "Pain au Chocolat", description: "Feuilletage doré fourré de deux barres de chocolat.", price: 120, media_type: "image", media_url: "https://images.unsplash.com/photo-1608198077583-49aa2980be14?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Pâte feuilletée, barres de chocolat" },
  { id: "56", category_id: "desserts", name: "Cookie Pistachio", description: "Cookie moelleux aux éclats de pistache verte.", price: 300, media_type: "image", media_url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Pâte à cookie, pistaches concassées" },
  { id: "57", category_id: "desserts", name: "Cookie Chocolat", description: "Cookie traditionnel aux pépites de chocolat noir.", price: 300, media_type: "image", media_url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Cookie, pépites de chocolat" },
  { id: "58", category_id: "desserts", name: "Cookie Chocolat Pistache", description: "Le duo parfait : chocolat fondant et pistaches croquantes.", price: 300, media_type: "image", media_url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Cookie, chocolat noir, éclats de pistaches" },
  { id: "59", category_id: "desserts", name: "Cookie Lotus", description: "Cookie gourmand fourré au spéculoos Lotus.", price: 300, media_type: "image", media_url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Cookie, crème de spéculoos Lotus" },
  { id: "60", category_id: "desserts", name: "Honey Cake", description: "Gâteau au miel russe traditionnel à couches superposées.", price: 300, media_type: "image", media_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Miel d'abeille, crème fraîche, biscuit" },
  { id: "61", category_id: "desserts", name: "Marble Cake", description: "Cake marbré vanille et chocolat à l'ancienne.", price: 300, media_type: "image", media_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Cake marbré vanille-cacao" },
  { id: "62", category_id: "desserts", name: "Gourmand Cake", description: "Part de cake extra-moelleux garnie de topping.", price: 350, media_type: "image", media_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Cake gourmand maison" },
  { id: "63", category_id: "desserts", name: "Brownie Chocolat", description: "Brownie chocolat noir et noix de pécan.", price: 350, media_type: "image", media_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Chocolat noir, noix de pécan, beurre" },
  { id: "64", category_id: "desserts", name: "Brownie Lotus", description: "Brownie moelleux garni de brisures de Lotus.", price: 350, media_type: "image", media_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Brownie chocolat, spéculoos Lotus" },
  { id: "65", category_id: "desserts", name: "Matilda Cake", description: "Le fameux gâteau géant au chocolat ultra-coulant.", price: 500, media_type: "image", media_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop", available: true, best_seller: true, featured: true, promotion: false, ingredients: "Gâteau géant au chocolat, ganache fondante" },
  { id: "66", category_id: "desserts", name: "San Sebastian Cheesecake", description: "Cheesecake basque brûlé servi avec chocolat chaud fondu.", price: 600, media_type: "image", media_url: "https://images.unsplash.com/photo-1524351199679-46cddf530c04?q=80&w=600&auto=format&fit=crop", available: true, best_seller: true, featured: true, promotion: false, ingredients: "Fromage à la crème, coulis de chocolat au choix" },

  // ==================== TARTS ====================
  { id: "67", category_id: "desserts", name: "Tarte Chocolat Caramel", description: "Pâte sablée croquante, caramel au beurre salé et ganache chocolat.", price: 400, media_type: "image", media_url: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Sablé, caramel salé, ganache" },
  { id: "68", category_id: "desserts", name: "Tarte à la Pêche", description: "Tartelette fruitée garnie de pêches caravélisées.", price: 400, media_type: "image", media_url: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Pâte sablée, crème d'amande, pêches" },
  { id: "69", category_id: "desserts", name: "Tarte Banane + Glace", description: "Tarte gourmande à la banane cuite servie avec sa boule de glace.", price: 450, media_type: "video", media_url: "/Video.mp4", available: true, best_seller: false, featured: true, promotion: false, ingredients: "Banane, pâte sablée, glace vanille" },

  // ==================== CHEESECAKES ====================
  { id: "70", category_id: "desserts", name: "Cheesecake Chocolat", description: "Cheesecake crémeux marbré au chocolat noir.", price: 500, media_type: "image", media_url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Fromage, biscuit, ganache chocolat" },
  { id: "71", category_id: "desserts", name: "Cheesecake Fraise", description: "Cheesecake classique surmonté d'un coulis de fraises fraîches.", price: 500, media_type: "image", media_url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Coulis de fraises fraîches, fromage de spécialité" },
  { id: "72", category_id: "desserts", name: "Cheesecake Citron", description: "Fraîcheur acidulée du citron vert.", price: 500, media_type: "image", media_url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Crémeux citron, base biscuitée croustillante" },
  { id: "73", category_id: "desserts", name: "Cheesecake Pistache", description: "Le croquant de la pistache concassée sur lit crémeux.", price: 500, media_type: "image", media_url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Crème de pistache d'Italie, éclats" },
  { id: "74", category_id: "desserts", name: "Cheesecake Lotus", description: "Gourmandise ultime fourrée et glacée au spéculoos Lotus.", price: 500, media_type: "image", media_url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Biscuit spéculoos Lotus, fromage onctueux" },

  // ==================== TROMPE-L'OEIL ====================
  { id: "75", category_id: "desserts", name: "Trompe-l'oeil Mangue", description: "Dessert en forme de vraie mangue renfermant une mousse onctueuse.", price: 500, media_type: "image", media_url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Mousse mangue-passion, coque en chocolat coloré" },
  { id: "76", category_id: "desserts", name: "Trompe-l'oeil Café", description: "Dessert en trompe-l'œil en forme de grain de café géant.", price: 500, media_type: "image", media_url: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Mousse café intense Arabica, ganache" },

  // ==================== SALTY ====================
  { id: "77", category_id: "snacks", name: "Batbout", description: "Pain batbout farci de viande marinée et crudités.", price: 150, media_type: "image", media_url: "https://images.unsplash.com/photo-1628191139360-408a06479b19?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Pain marocain farci, poulet mariné, salade" },
  { id: "78", category_id: "snacks", name: "Mini Pizza", description: "Mini pizza garnie de sauce tomate, fromage et olive.", price: 150, media_type: "image", media_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Tomate, mozzarella, olives" },
  { id: "79", category_id: "snacks", name: "Pizza Carrée", description: "Pizza carrée traditionnelle garnie.", price: 150, media_type: "image", media_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Pâte à pizza, sauce tomate maison, fromage" },
  { id: "80", category_id: "snacks", name: "Taco", description: "Taco croustillant garni de poulet et de sauces.", price: 150, media_type: "image", media_url: "https://images.unsplash.com/photo-1628191139360-408a06479b19?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Tortilla de blé, viande, frites, sauce fromage" },
  { id: "81", category_id: "snacks", name: "Mini Burger", description: "Bouchée gourmande au bœuf et cheddar fondu.", price: 200, media_type: "image", media_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Mini pain burger, steak, cheddar" },
  { id: "82", category_id: "snacks", name: "Quiche", description: "Quiche salée traditionnelle croustillante.", price: 200, media_type: "image", media_url: "https://images.unsplash.com/photo-1628191139360-408a06479b19?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Crème, œufs, fromage râpé, pâte brisée" },
  { id: "83", category_id: "sandwiches", name: "Sandwich Poulet", description: "Pain ciabatta garni de poulet grillé et de sauces.", price: 350, media_type: "image", media_url: "https://images.unsplash.com/photo-1509722747041-616f39b57569?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Pain spécial, escalope de poulet, sauces au choix" },

  // ==================== OMELETTES ====================
  { id: "84", category_id: "breakfast", name: "Croissant Turkey", description: "Croissant chaud garni d'omelette et tranches de dinde fumée.", price: 400, media_type: "image", media_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Croissant, dinde fumée, omelette, fromage" },
  { id: "85", category_id: "breakfast", name: "Omelette Classique", description: "Omelette traditionnelle baveuse cuite à la poêle.", price: 500, media_type: "image", media_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Oeufs frais, sel, poivre" },
  { id: "86", category_id: "breakfast", name: "Omelette 3 Fromages", description: "Omelette ultra-fondante aux trois fromages sélectionnés.", price: 700, media_type: "image", media_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Oeufs, emmental, cheddar, mozzarella" },
  { id: "87", category_id: "breakfast", name: "Omelette Avocat", description: "Omelette fraîche servie avec tranches d'avocat crémeux.", price: 1200, media_type: "image", media_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Oeufs, tranches d'avocat frais, fines herbes" },

  // ==================== BREAKFASTS ====================
  { id: "88", category_id: "breakfast", name: "Petit Déjeuner du Jour", description: "La surprise du chef pour démarrer la journée du bon pied.", price: 800, media_type: "image", media_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Formule changeante selon l'humeur du chef" },
  { id: "89", category_id: "breakfast", name: "Petit Déjeuner Classique", description: "Formule complète avec boissons et viennoiserie.", price: 1200, media_type: "image", media_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Viennoiserie, café au choix, jus d'orange pressé, toasts" },
  { id: "90", category_id: "breakfast", name: "Petit Déjeuner Avocat", description: "Formule saine et gourmande à base d'avocat.", price: 1800, media_type: "image", media_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Toast avocat, œuf poché, jus d'orange pressé, thé/café" },

  // ==================== BRUNCH ====================
  { id: "91", category_id: "breakfast", name: "Brunch Français", description: "Brunch traditionnel au parfum parisien.", price: 900, media_type: "image", media_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Baguette fraîche, confiture, beurre, croissant, boisson chaude" },
  { id: "92", category_id: "breakfast", name: "Brunch Avocat", description: "Brunch frais et nourrissant.", price: 1200, media_type: "image", media_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop", available: true, best_seller: false, featured: false, promotion: false, ingredients: "Grand pain de campagne grillé, purée d'avocat, saumon/dinde" },
];

interface ProductState {
  products: StoreProduct[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<StoreProduct, "id">) => Promise<void>;
  updateProduct: (id: string, updated: Partial<StoreProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
  resetToDefaultMenu: () => Promise<void>;
}

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!(url && !url.includes("your-project") && url.trim().length > 0);
};

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      isLoading: false,
      error: null,

      fetchProducts: async () => {
        if (!isSupabaseConfigured()) return;
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false });

          if (error) throw error;

          const mapped: StoreProduct[] = (data || []).map((p: any) => ({
            id: p.id,
            category_id: p.category_id || "coffee",
            name: typeof p.name === "object" ? (p.name?.fr || p.name?.en || Object.values(p.name)[0] || "") : p.name || "",
            description: typeof p.description === "object" ? (p.description?.fr || p.description?.en || "") : p.description || "",
            price: Number(p.price),
            media_type: p.media_type,
            media_url: p.media_url || "",
            available: p.available,
            best_seller: p.best_seller,
            featured: p.featured,
            promotion: p.promotion,
            calories: p.calories || undefined,
            ingredients: typeof p.ingredients === "object" ? (p.ingredients?.fr || p.ingredients?.en || "") : p.ingredients || "",
          }));

          set({ products: mapped, isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      addProduct: async (product) => {
        const tempId = Date.now().toString();
        const formattedUrl = product.media_url
          ? (product.media_url.startsWith("http") || product.media_url.startsWith("blob:") || product.media_url.startsWith("/") ? product.media_url : `/${product.media_url}`)
          : "";

        const newProduct: StoreProduct = {
          ...product,
          id: tempId,
          media_url: formattedUrl,
        };

        // 1. Optimistic / local state update
        set((state) => ({ products: [newProduct, ...state.products] }));

        // 2. Supabase DB update
        if (isSupabaseConfigured()) {
          try {
            const dbProduct = {
              category_id: product.category_id,
              name: { fr: product.name, en: product.name, ar: product.name },
              description: { fr: product.description, en: product.description, ar: product.description },
              ingredients: { fr: product.ingredients, en: product.ingredients, ar: product.ingredients },
              price: product.price,
              media_type: product.media_type,
              media_url: formattedUrl,
              available: product.available,
              best_seller: product.best_seller,
              featured: product.featured,
              promotion: product.promotion,
              calories: product.calories || null,
            };

            const { data, error } = await supabase.from("products").insert(dbProduct).select().single();
            if (error) throw error;
            if (data) {
              set((state) => ({
                products: state.products.map(p => p.id === tempId ? { ...p, id: data.id } : p)
              }));
            }
          } catch (err) {
            console.error("Failed to add product in Supabase:", err);
          }
        }
      },

      updateProduct: async (id, updated) => {
        // 1. Local update
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id === id) {
              const formattedUrl = updated.media_url
                ? (updated.media_url.startsWith("http") || updated.media_url.startsWith("blob:") || updated.media_url.startsWith("/") ? updated.media_url : `/${updated.media_url}`)
                : p.media_url;
              return { ...p, ...updated, media_url: formattedUrl };
            }
            return p;
          }),
        }));

        // 2. Supabase update
        if (isSupabaseConfigured()) {
          try {
            const updates: any = {};
            if (updated.category_id !== undefined) updates.category_id = updated.category_id;
            if (updated.name !== undefined) updates.name = { fr: updated.name, en: updated.name, ar: updated.name };
            if (updated.description !== undefined) updates.description = { fr: updated.description, en: updated.description, ar: updated.description };
            if (updated.ingredients !== undefined) updates.ingredients = { fr: updated.ingredients, en: updated.ingredients, ar: updated.ingredients };
            if (updated.price !== undefined) updates.price = updated.price;
            if (updated.media_type !== undefined) updates.media_type = updated.media_type;
            if (updated.media_url !== undefined) {
              updates.media_url = updated.media_url.startsWith("http") || updated.media_url.startsWith("blob:") || updated.media_url.startsWith("/") 
                ? updated.media_url 
                : `/${updated.media_url}`;
            }
            if (updated.available !== undefined) updates.available = updated.available;
            if (updated.best_seller !== undefined) updates.best_seller = updated.best_seller;
            if (updated.featured !== undefined) updates.featured = updated.featured;
            if (updated.promotion !== undefined) updates.promotion = updated.promotion;
            if (updated.calories !== undefined) updates.calories = updated.calories || null;

            const { error } = await supabase.from("products").update(updates).eq("id", id);
            if (error) throw error;
          } catch (err) {
            console.error("Failed to update product in Supabase:", err);
          }
        }
      },

      deleteProduct: async (id) => {
        // 1. Local update
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));

        // 2. Supabase update
        if (isSupabaseConfigured()) {
          try {
            const { error } = await supabase.from("products").delete().eq("id", id);
            if (error) throw error;
          } catch (err) {
            console.error("Failed to delete product in Supabase:", err);
          }
        }
      },

      toggleAvailability: async (id) => {
        const product = get().products.find((p) => p.id === id);
        if (!product) return;

        const newAvailability = !product.available;

        // 1. Local update
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, available: newAvailability } : p
          ),
        }));

        // 2. Supabase update
        if (isSupabaseConfigured()) {
          try {
            const { error } = await supabase
              .from("products")
              .update({ available: newAvailability })
              .eq("id", id);
            if (error) throw error;
          } catch (err) {
            console.error("Failed to toggle availability in Supabase:", err);
          }
        }
      },

      resetToDefaultMenu: async () => {
        if (!isSupabaseConfigured()) {
          set({ products: INITIAL_PRODUCTS });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          // 1. Delete all products from Supabase
          const { error: deleteError } = await supabase
            .from("products")
            .delete()
            .neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all items safely since none has this id

          if (deleteError) throw deleteError;

          // 2. Insert all INITIAL_PRODUCTS into Supabase
          const dbProducts = INITIAL_PRODUCTS.map((p) => ({
            category_id: p.category_id,
            name: { fr: p.name, en: p.name, ar: p.name },
            description: { fr: p.description, en: p.description, ar: p.description },
            ingredients: { fr: p.ingredients, en: p.ingredients, ar: p.ingredients },
            price: p.price,
            media_type: p.media_type,
            media_url: p.media_url,
            available: p.available,
            best_seller: p.best_seller,
            featured: p.featured,
            promotion: p.promotion,
            calories: null,
          }));

          const { data, error: insertError } = await supabase
            .from("products")
            .insert(dbProducts)
            .select();

          if (insertError) throw insertError;

          // 3. Reload products
          const mapped: StoreProduct[] = (data || []).map((p: any) => ({
            id: p.id,
            category_id: p.category_id || "coffee",
            name: typeof p.name === "object" ? (p.name?.fr || p.name?.en || Object.values(p.name)[0] || "") : p.name || "",
            description: typeof p.description === "object" ? (p.description?.fr || p.description?.en || "") : p.description || "",
            price: Number(p.price),
            media_type: p.media_type,
            media_url: p.media_url || "",
            available: p.available,
            best_seller: p.best_seller,
            featured: p.featured,
            promotion: p.promotion,
            ingredients: typeof p.ingredients === "object" ? (p.ingredients?.fr || p.ingredients?.en || "") : p.ingredients || "",
          }));

          set({ products: mapped, isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },
    }),
    {
      name: "afnene-products-storage",
      partialize: (state) => ({ products: state.products }), // Only persist product array
    }
  )
);
