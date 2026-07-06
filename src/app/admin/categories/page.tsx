"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FolderOpen,
  X,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { toast } from "sonner";
import { useProductStore } from "@/store/useProductStore";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AdminCategory {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
  status: "Active" | "Inactive";
}

const DEFAULT_CATEGORIES: AdminCategory[] = [
  { id: "coffee", name: "Boissons chaudes", icon: "☕", itemCount: 0, status: "Active" },
  { id: "cold-drinks", name: "Boissons fresh", icon: "🧊", itemCount: 0, status: "Active" },
  { id: "mocktails", name: "Mocktail", icon: "🍹", itemCount: 0, status: "Active" },
  { id: "smoothies", name: "Smoothies", icon: "🥑", itemCount: 0, status: "Active" },
  { id: "milkshakes", name: "Milkshakes", icon: "🥤", itemCount: 0, status: "Active" },
  { id: "desserts", name: "Gâteaux (viennoiserie)", icon: "🍰", itemCount: 0, status: "Active" },
  { id: "snacks-sales", name: "Salés", icon: "🍕", itemCount: 0, status: "Active" },
]

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("☕");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  useEffect(() => {
    loadCategoriesData();
  }, []);

  const loadCategoriesData = async () => {
    setIsLoading(true);
    if (!isSupabaseConfigured()) {
      try {
        const local = localStorage.getItem("afnene_categories");
        let catsList = DEFAULT_CATEGORIES;
        if (local) {
          try {
            catsList = JSON.parse(local);
          } catch (err) {}
        }

        // Count products offline using Zustand store products
        const localProds = useProductStore.getState().products || [];
        const counts: Record<string, number> = {};
        localProds.forEach((p: any) => {
          if (p.category_id) {
            counts[p.category_id] = (counts[p.category_id] || 0) + 1;
          }
        });

        const mapped = catsList.map((c: any) => ({
          ...c,
          itemCount: counts[c.id] || 0
        }));

        setCategories(mapped);
      } catch (e) {
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const { data: cats, error: catError } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (catError) throw catError;

      const { data: prods, error: prodError } = await supabase
        .from("products")
        .select("category_id");

      if (prodError) throw prodError;

      const counts: Record<string, number> = {};
      (prods || []).forEach((p: any) => {
        if (p.category_id) {
          counts[p.category_id] = (counts[p.category_id] || 0) + 1;
        }
      });

      if (cats) {
        const mapped: AdminCategory[] = cats.map((c: any) => ({
          id: c.id,
          name: typeof c.name === "object" ? (c.name?.fr || c.name?.en || "") : c.name || "",
          icon: c.icon || "☕",
          itemCount: counts[c.id] || 0,
          status: "Active",
        }));
        setCategories(mapped);
      }
    } catch (err: any) {
      console.error("Failed to load categories:", err);
      toast.error(`Erreur de chargement : ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategoryOrder = async (id: string, direction: "up" | "down") => {
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) return;

    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === categories.length - 1) return;

    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    
    const newCategories = [...categories];
    const temp = newCategories[idx];
    newCategories[idx] = newCategories[targetIdx];
    newCategories[targetIdx] = temp;

    setCategories(newCategories);

    if (!isSupabaseConfigured()) {
      localStorage.setItem("afnene_categories", JSON.stringify(newCategories));
      toast.success("Ordre des catégories mis à jour !");
      return;
    }

    const promises = newCategories.map((c, i) =>
      supabase
        .from("categories")
        .update({ sort_order: i + 1 })
        .eq("id", c.id)
    );

    try {
      await Promise.all(promises);
      toast.success("Ordre des catégories mis à jour !");
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur de sauvegarde de l'ordre");
      loadCategoriesData();
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setName("");
    setIcon("☕");
    setStatus("Active");
    setModalOpen(true);
  };

  const openEditModal = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setIcon(cat.icon);
    setStatus(cat.status);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, catName: string) => {
    if (confirm(`Voulez-vous vraiment supprimer la catégorie "${catName}" ?`)) {
      if (!isSupabaseConfigured()) {
        const newCats = categories.filter((c) => c.id !== id);
        setCategories(newCats);
        localStorage.setItem("afnene_categories", JSON.stringify(newCats));
        toast.success(`Catégorie "${catName}" supprimée avec succès`);
        return;
      }

      const toastId = toast.loading("Suppression...");
      try {
        const { data, error } = await supabase
          .from("categories")
          .delete()
          .eq("id", id)
          .select();

        if (error) throw error;

        if (!data || data.length === 0) {
          throw new Error("Action non autorisée ou catégorie introuvable. Veuillez vérifier que vous êtes bien authentifié et que la catégorie ne contient pas de produits.");
        }

        setCategories((prev) => prev.filter((c) => c.id !== id));
        toast.success(`Catégorie "${catName}" supprimée avec succès`, { id: toastId });
      } catch (err: any) {
        toast.error(`Erreur : ${err.message || err}`, { id: toastId });
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const toastId = toast.loading("Enregistrement...");

    if (!isSupabaseConfigured()) {
      if (editingCategory) {
        const newCats = categories.map((c) =>
          c.id === editingCategory.id ? { ...c, name, icon } : c
        );
        setCategories(newCats);
        localStorage.setItem("afnene_categories", JSON.stringify(newCats));
        toast.success(`Catégorie "${name}" mise à jour !`, { id: toastId });
      } else {
        const newId = name.toLowerCase().trim()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-");
        
        const newCats = [
          ...categories,
          {
            id: newId,
            name,
            icon,
            itemCount: 0,
            status: "Active" as const,
          },
        ];
        setCategories(newCats);
        localStorage.setItem("afnene_categories", JSON.stringify(newCats));
        toast.success(`Catégorie "${name}" créée avec succès !`, { id: toastId });
      }
      setModalOpen(false);
      return;
    }

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update({
            name: { fr: name, en: name, ar: name },
            icon,
          })
          .eq("id", editingCategory.id);

        if (error) throw error;

        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id ? { ...c, name, icon } : c
          )
        );
        toast.success(`Catégorie "${name}" mise à jour !`, { id: toastId });
      } else {
        const newId = name.toLowerCase().trim()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-");
        
        const newCatDb = {
          id: newId,
          name: { fr: name, en: name, ar: name },
          icon,
          sort_order: categories.length + 1,
        };

        const { error } = await supabase
          .from("categories")
          .insert(newCatDb);

        if (error) throw error;

        setCategories((prev) => [
          ...prev,
          {
            id: newId,
            name,
            icon,
            itemCount: 0,
            status: "Active",
          },
        ]);
        toast.success(`Catégorie "${name}" créée avec succès !`, { id: toastId });
      }
      setModalOpen(false);
    } catch (err: any) {
      toast.error(`Erreur : ${err.message || err}`, { id: toastId });
    }
  };

  const filtered = categories.filter((c) =>
    c && c.name && c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1
            className="text-2xl font-bold text-dark dark:text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Catégories du Menu
          </h1>
          <p className="text-muted dark:text-muted-dark text-sm mt-1">
            Gérez vos catégories et leurs icônes ({categories.length} au total)
          </p>
        </div>
        <button onClick={openAddModal} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter une catégorie
        </button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 max-w-md"
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Rechercher une catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card dark:bg-card-dark border border-border dark:border-border-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </motion.div>

      {/* Categories Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {filtered.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.04 }}
            className="glass-card rounded-[var(--radius-lg)] p-5 group hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300 relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shadow-inner">
                  {category.icon}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => updateCategoryOrder(category.id, "up")}
                    disabled={index === 0}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary/10 disabled:opacity-20 transition-colors text-muted hover:text-primary"
                    title="Déplacer vers le haut / gauche"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => updateCategoryOrder(category.id, "down")}
                    disabled={index === filtered.length - 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary/10 disabled:opacity-20 transition-colors text-muted hover:text-primary"
                    title="Déplacer vers le bas / droite"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openEditModal(category)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-amber-500/10 transition-colors text-amber-500"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-danger/10 transition-colors text-muted hover:text-danger"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-dark dark:text-white mb-1">
                {category.name}
              </h3>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
              <p className="text-xs text-muted dark:text-muted-dark font-medium">
                {category.itemCount} produits
              </p>
              <span className={category.status === "Active" ? "badge-available" : "badge-unavailable"}>
                {category.status === "Active" ? "Actif" : "Inactif"}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-12 glass-card rounded-[var(--radius-lg)]">
          <FolderOpen className="w-12 h-12 text-muted/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark dark:text-white mb-2">
            Aucune catégorie trouvée
          </h3>
          <p className="text-muted dark:text-muted-dark text-sm">
            Essayez d&apos;ajuster votre terme de recherche.
          </p>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-card dark:bg-card-dark p-4 sm:p-6 rounded-3xl shadow-2xl border border-border/40 z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <h3 className="text-lg font-bold text-dark dark:text-white" style={{ fontFamily: "var(--font-heading)" }}>
                  {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-muted hover:text-dark">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">Nom de la catégorie</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Boissons Chaudes"
                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">Ic├┤ne / Émoji</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      required
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      placeholder="☕"
                      className="w-20 text-center px-4 py-2.5 text-xl rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white focus:outline-none focus:border-primary"
                    />
                    <div className="flex gap-1.5 flex-wrap">
                      {["☕", "🧊", "🥐", "🥪", "🍔", "🍕", "🍰", "🥗", "🍿"].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setIcon(emoji)}
                          className="w-9 h-9 rounded-lg border border-border/60 hover:bg-primary/10 text-lg flex items-center justify-center transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">Statut</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="Active">Actif (Visible dans le menu)</option>
                    <option value="Inactive">Inactif (Masqué)</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted hover:bg-primary/5"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-light transition-colors"
                  >
                    {editingCategory ? "Enregistrer" : "Créer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
