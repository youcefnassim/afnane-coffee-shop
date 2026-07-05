"use client";

import { motion } from "framer-motion";
import {
  Package,
  FolderOpen,
  Tag,
  Users,
  TrendingUp,
  Eye,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const STATS = [
  {
    label: "Total Products",
    value: "18",
    change: "+3 this week",
    icon: Package,
    color: "bg-primary/10 text-primary dark:text-secondary",
    href: "/admin/products",
  },
  {
    label: "Categories",
    value: "9",
    change: "All active",
    icon: FolderOpen,
    color: "bg-secondary/10 text-secondary",
    href: "/admin/categories",
  },
  {
    label: "Active Promotions",
    value: "4",
    change: "2 ending soon",
    icon: Tag,
    color: "bg-accent/10 text-accent",
    href: "/admin/promotions",
  },
  {
    label: "Today's Visitors",
    value: "127",
    change: "+12% vs yesterday",
    icon: Users,
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
    href: "/admin",
  },
];

const RECENT_PRODUCTS = [
  { name: "Signature Espresso", category: "Coffee", price: "250 DA", status: "Available" },
  { name: "Classic Burger", category: "Burgers", price: "850 DA", status: "Available" },
  { name: "Iced Caramel Latte", category: "Cold Drinks", price: "500 DA", status: "Available" },
  { name: "Tiramisu", category: "Desserts", price: "600 DA", status: "Available" },
  { name: "Chicken Nuggets", category: "Snacks", price: "450 DA", status: "Unavailable" },
];

import { useEffect, useState } from "react";
import { useProductStore } from "@/store/useProductStore";

const QUICK_ACTIONS = [
  { label: "Add Product", href: "/admin/products/new", icon: Package },
  { label: "New Promotion", href: "/admin/promotions", icon: Tag },
  { label: "Upload Gallery", href: "/admin/gallery", icon: Eye },
];

function getTodayVisitors() {
  if (typeof window === "undefined") {
    return { value: "127", change: "+12% vs hier", isPositive: true };
  }
  const now = new Date();
  const daySeed = now.getDate() + now.getMonth() * 31 + now.getFullYear();
  
  // Base daily visitors (deterministic but changes every day, e.g., 140 to 300)
  const baseVisitors = 140 + (daySeed % 160);
  
  // Progress during the day (from morning 7:00 to 23:00)
  const currentHour = now.getHours();
  let progress = 0.08;
  
  if (currentHour >= 7 && currentHour <= 23) {
    progress = 0.08 + 0.92 * ((currentHour - 7) / 16);
  } else if (currentHour > 23) {
    progress = 1.0;
  }
  
  // Add minutes for minor realtime progression
  const minutesProgress = now.getMinutes() / 60 / 16;
  const currentVisitors = Math.min(
    Math.round(baseVisitors * (progress + minutesProgress)),
    baseVisitors
  );
  
  const trendPercent = 5 + (daySeed % 21);
  const isPositive = (daySeed % 2) === 0;
  const trendText = `${isPositive ? "+" : "-"}${trendPercent}% vs hier`;
  
  return {
    value: currentVisitors.toString(),
    change: trendText,
    isPositive
  };
}

export default function AdminDashboardPage() {
  const { products, fetchProducts } = useProductStore();
  const [categoriesCount, setCategoriesCount] = useState(9);
  const [promotionsCount, setPromotionsCount] = useState(4);
  const [visitors, setVisitors] = useState({ value: "127", change: "+12% vs hier", isPositive: true });

  useEffect(() => {
    fetchProducts();
    setVisitors(getTodayVisitors());

    if (typeof window !== "undefined") {
      const savedCats = localStorage.getItem("afnene_categories");
      if (savedCats) {
        try {
          const parsed = JSON.parse(savedCats);
          setCategoriesCount(parsed.length);
        } catch (e) {
          console.error(e);
        }
      }

      const savedPromos = localStorage.getItem("afnene_promotions");
      if (savedPromos) {
        try {
          const parsed = JSON.parse(savedPromos);
          setPromotionsCount(parsed.length);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [fetchProducts]);

  const statsData = [
    {
      label: "Total Products",
      value: products.length.toString(),
      change: `${products.filter((p) => p.available).length} disponibles`,
      icon: Package,
      color: "bg-primary/10 text-primary dark:text-secondary",
      href: "/admin/products",
    },
    {
      label: "Categories",
      value: categoriesCount.toString(),
      change: "Toutes actives",
      icon: FolderOpen,
      color: "bg-secondary/10 text-secondary",
      href: "/admin/categories",
    },
    {
      label: "Active Promotions",
      value: promotionsCount.toString(),
      change: "Offres en cours",
      icon: Tag,
      color: "bg-accent/10 text-accent",
      href: "/admin/promotions",
    },
    {
      label: "Today's Visitors",
      value: visitors.value,
      change: visitors.change,
      icon: Users,
      color: visitors.isPositive
        ? "bg-green-500/10 text-green-600 dark:text-green-400"
        : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      href: "/admin",
    },
  ];

  const recentProducts = products.slice(0, 5);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1
            className="text-2xl lg:text-3xl font-bold text-dark dark:text-white mb-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Dashboard
          </h1>
          <p className="text-muted dark:text-muted-dark text-sm">
            Welcome back! Here&apos;s what&apos;s happening with your coffee shop.
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
          >
            <Link
              href={stat.href}
              className="block glass-card rounded-[var(--radius-lg)] p-5 group hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted dark:text-muted-dark opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p
                className="text-2xl font-bold text-dark dark:text-white mb-0.5"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {stat.value}
              </p>
              <p className="text-sm text-muted dark:text-muted-dark">{stat.label}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400">{stat.change}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="lg:col-span-2 glass-card rounded-[var(--radius-lg)] p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-dark dark:text-white"
                style={{ fontFamily: "var(--font-heading)" }}>
              Recent Products
            </h2>
            <Link
              href="/admin/products"
              className="text-xs text-primary dark:text-secondary font-semibold hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border dark:border-border-dark">
                  <th className="text-left py-2.5 font-semibold text-muted dark:text-muted-dark text-xs uppercase tracking-wider">
                    Product
                  </th>
                  <th className="hidden md:table-cell text-left py-2.5 font-semibold text-muted dark:text-muted-dark text-xs uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left py-2.5 font-semibold text-muted dark:text-muted-dark text-xs uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left py-2.5 font-semibold text-muted dark:text-muted-dark text-xs uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border/50 dark:border-border-dark/50 last:border-0"
                  >
                    <td className="py-3 font-medium text-dark dark:text-white">
                      {product.name}
                    </td>
                    <td className="hidden md:table-cell py-3 text-muted dark:text-muted-dark capitalize">
                      {product.category_id.replace("-", " ")}
                    </td>
                    <td className="py-3 font-semibold text-primary dark:text-secondary">
                      {product.price} DA
                    </td>
                    <td className="py-3">
                      <span
                        className={
                          product.available
                            ? "badge-available"
                            : "badge-unavailable"
                        }
                      >
                        {product.available ? "Disponible" : "Indisponible"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="glass-card rounded-[var(--radius-lg)] p-6"
        >
          <h2 className="font-bold text-dark dark:text-white mb-5"
              style={{ fontFamily: "var(--font-heading)" }}>
            Quick Actions
          </h2>
          <div className="space-y-3">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 dark:hover:bg-white/5 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <action.icon className="w-4 h-4 text-primary group-hover:text-white" />
                </div>
                <span className="text-sm font-medium text-dark dark:text-white">
                  {action.label}
                </span>
                <Plus className="w-4 h-4 text-muted dark:text-muted-dark ml-auto" />
              </Link>
            ))}
          </div>

          {/* Visit Site */}
          <div className="mt-6 pt-5 border-t border-border/50 dark:border-border-dark/50">
            <Link
              href="/"
              target="_blank"
              className="btn-gold w-full text-sm py-2.5"
            >
              <Eye className="w-4 h-4" />
              View Live Site
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
