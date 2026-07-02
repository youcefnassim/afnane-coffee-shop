"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FolderOpen,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface AdminCategory {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
  status: "Active" | "Inactive";
}

const INITIAL_CATEGORIES: AdminCategory[] = [
  { id: "1", name: "Café (Coffee)", icon: "☕", itemCount: 12, status: "Active" },
  { id: "2", name: "Boissons froides", icon: "🧊", itemCount: 8, status: "Active" },
  { id: "3", name: "Petit déjeuner", icon: "🥐", itemCount: 5, status: "Active" },
  { id: "4", name: "Sandwichs", icon: "🥪", itemCount: 6, status: "Active" },
  { id: "5", name: "Burgers", icon: "🍔", itemCount: 4, status: "Active" },
  { id: "6", name: "Pizza", icon: "🍕", itemCount: 7, status: "Active" },
  { id: "7", name: "Desserts", icon: "🍰", itemCount: 9, status: "Active" },
  { id: "8", name: "Salades", icon: "🥗", itemCount: 3, status: "Active" },
  { id: "9", name: "Snacks", icon: "🍿", itemCount: 5, status: "Active" },
];

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<AdminCategory[]>(INITIAL_CATEGORIES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("☕");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

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

  const handleDelete = (id: string, catName: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.info(`Catégorie "${catName}" supprimée avec succès`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id ? { ...c, name, icon, status } : c
        )
      );
      toast.success(`Catégorie "${name}" mise à jour !`);
    } else {
      const newCat: AdminCategory = {
        id: Date.now().toString(),
        name,
        icon,
        itemCount: 0,
        status,
      };
      setCategories((prev) => [newCat, ...prev]);
      toast.success(`Catégorie "${name}" créée avec succès !`);
    }

    setModalOpen(false);
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
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
              className="relative w-full max-w-md bg-card dark:bg-card-dark p-6 rounded-3xl shadow-2xl border border-border/40 z-10 space-y-4"
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
                  <label className="block text-xs font-semibold text-muted mb-1">Icône / Émoji</label>
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
