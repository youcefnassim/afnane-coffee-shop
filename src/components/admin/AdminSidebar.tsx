"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  CalendarDays,
  Tag,
  ImageIcon,
  Settings,
  LogOut,
  ChevronLeft,
  Coffee,
  QrCode,
  Menu,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const SIDEBAR_ITEMS = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Commandes" },
  { href: "/admin/products", icon: Package, label: "Produits" },
  { href: "/admin/categories", icon: FolderOpen, label: "Catégories" },
  { href: "/admin/daily-menu", icon: CalendarDays, label: "Menu du Jour" },
  { href: "/admin/promotions", icon: Tag, label: "Promotions" },
  { href: "/admin/gallery", icon: ImageIcon, label: "Galerie" },
  { href: "/admin/qr-codes", icon: QrCode, label: "QR Codes" },
  { href: "/admin/settings", icon: Settings, label: "Paramètres" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    toast.info("Vous avez été déconnecté.");
    router.push("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 flex items-center justify-between border-b border-border dark:border-border-dark">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-border dark:border-border-dark flex items-center justify-center shrink-0 bg-black">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-sm text-dark dark:text-white tracking-wider"
                  style={{ fontFamily: "var(--font-heading)" }}>
                AFNENE
              </h2>
              <p className="text-[10px] text-muted dark:text-muted-dark">Espace Admin</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center hover:bg-primary/5 dark:hover:bg-white/5 transition-colors text-muted"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              collapsed && "justify-center px-2",
              isActive(item.href)
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-muted dark:text-muted-dark hover:bg-primary/5 dark:hover:bg-white/5 hover:text-dark dark:hover:text-white"
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-4.5 h-4.5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border dark:border-border-dark space-y-1">
        <Link
          href="/"
          target="_blank"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-muted dark:text-muted-dark hover:bg-primary/5 transition-colors",
            collapsed && "justify-center"
          )}
          title="Voir le site public"
        >
          <ExternalLink className="w-4 h-4" />
          {!collapsed && <span>Voir le site</span>}
        </Link>

        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-danger hover:bg-danger/10 transition-colors",
            collapsed && "justify-center"
          )}
          title="Se déconnecter"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen sticky top-0 bg-card dark:bg-card-dark border-r border-border dark:border-border-dark transition-all duration-300",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-card dark:bg-card-dark border-b border-border dark:border-border-dark flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg hover:bg-primary/5 text-dark dark:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm text-dark dark:text-white tracking-wider">AFNENE ADMIN</span>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-[120]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-[280px] h-full bg-card dark:bg-card-dark z-10"
            >
              <SidebarContent />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
