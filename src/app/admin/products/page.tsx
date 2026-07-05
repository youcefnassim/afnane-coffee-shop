"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Eye,
  EyeOff,
  X,
  Upload,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { useProductStore, StoreProduct } from "@/store/useProductStore";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { MAMAKA_CATEGORIES } from "@/lib/afnene_data";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const { products, toggleAvailability, deleteProduct, updateProduct } = useProductStore();
  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");

  // Drag and drop states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [rowDraggableId, setRowDraggableId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!isSupabaseConfigured()) {
      try {
        const local = localStorage.getItem("afnene_categories");
        if (local) {
          const parsed = JSON.parse(local);
          setCategories(parsed.map((c: any) => ({ id: c.id, name: typeof c.name === "object" ? (c.name?.fr || c.name?.en || c.id) : c.name || c.id })));
        } else {
          setCategories(MAMAKA_CATEGORIES.map((c) => ({ id: c.id, name: c.name.fr })));
        }
      } catch (e) {
        setCategories(MAMAKA_CATEGORIES.map((c) => ({ id: c.id, name: c.name.fr })));
      }
      return;
    }

    supabase
      .from("categories")
      .select("id, name")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) {
          const mapped = data.map((c: any) => ({
            id: c.id,
            name: typeof c.name === "object" ? (c.name?.fr || c.name?.en || c.id) : c.name || c.id,
          }));
          setCategories(mapped);
        }
      });
  }, []);

  const filtered = products.filter(
    (p) =>
      (selectedCategoryId === "all" || p.category_id === selectedCategoryId) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category_id.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setRowDraggableId(null);
      return;
    }

    const reordered = [...filtered];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, draggedItem);

    // Update locally in Zustand store
    const updatedProducts = products.map((p) => {
      const newIdx = reordered.findIndex((item) => item.id === p.id);
      if (newIdx !== -1) {
        return { ...p, sort_order: newIdx + 1 };
      }
      return p;
    });

    useProductStore.setState({
      products: updatedProducts.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    });

    // Update in Supabase database
    const promises = reordered.map((item, idx) =>
      supabase.from("products").update({ sort_order: idx + 1 }).eq("id", item.id)
    );

    try {
      await Promise.all(promises);
      toast.success("Ordre mis à jour !");
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur de sauvegarde de l'ordre");
    }

    setDraggedIndex(null);
    setRowDraggableId(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setRowDraggableId(null);
  };

  if (!mounted) return null;

  const handleDelete = (id: string, name: string) => {
    deleteProduct(id);
    toast.info(`Produit "${name}" supprimé avec succès`);
  };

  const handleToggle = (id: string, name: string, currentStatus: boolean) => {
    toggleAvailability(id);
    toast.success(
      !currentStatus
        ? `"${name}" est maintenant disponible`
        : `"${name}" est marqué comme indisponible`
    );
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, editingProduct);
    toast.success(`Produit "${editingProduct.name}" mis à jour avec succès !`);
    setEditingProduct(null);
  };



  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
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
            Produits du Menu
          </h1>
          <p className="text-muted dark:text-muted-dark text-sm mt-1">
            Gérez vos plats et boissons ({products.length} au total)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={async () => {
              if (confirm("Voulez-vous écraser le menu de la base de données et importer la nouvelle carte de 92 produits d'AFNENE ? Cette action est irréversible.")) {
                const toastId = toast.loading("Importation du menu en cours...");
                try {
                  await useProductStore.getState().resetToDefaultMenu();
                  toast.success("Nouveau menu importé avec succès !", { id: toastId });
                } catch (error: any) {
                  toast.error(`Erreur d'importation : ${error.message || error}`, { id: toastId });
                }
              }
            }}
            className="border border-[#D6B370]/50 text-[#D6B370] hover:bg-[#D6B370]/10 text-sm px-4 py-2.5 rounded-xl transition-all duration-300 font-medium"
          >
            Importer le menu AFNENE (92 items)
          </button>
          <Link href="/admin/products/new" className="btn-primary text-sm px-5 py-2.5 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un produit
          </Link>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Rechercher un produit ou une catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card dark:bg-card-dark border border-border dark:border-border-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </motion.div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        <button
          onClick={() => setSelectedCategoryId("all")}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 border ${selectedCategoryId === "all"
              ? "bg-[#D6B370] text-white border-[#D6B370]"
              : "bg-card dark:bg-card-dark text-muted dark:text-muted-dark border-border dark:border-border-dark hover:border-[#D6B370]/50"
            }`}
        >
          Tous les produits ({products.length})
        </button>
        {categories.map((cat) => {
          const count = products.filter((p) => p.category_id === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 border flex items-center gap-2 ${selectedCategoryId === cat.id
                  ? "bg-[#D6B370] text-white border-[#D6B370]"
                  : "bg-card dark:bg-card-dark text-muted dark:text-muted-dark border-border dark:border-border-dark hover:border-[#D6B370]/50"
                }`}
            >
              {cat.name}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedCategoryId === cat.id ? "bg-white/20 text-white" : "bg-primary/10 text-primary dark:text-[#D6B370] dark:bg-white/5"
                }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-[var(--radius-lg)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary/[0.02] dark:bg-white/[0.02] border-b border-border dark:border-border-dark">
                <th className="text-left py-3 px-5 font-semibold text-muted dark:text-muted-dark text-xs uppercase tracking-wider">
                  Produit
                </th>
                <th className="hidden md:table-cell text-left py-3 px-5 font-semibold text-muted dark:text-muted-dark text-xs uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="text-left py-3 px-5 font-semibold text-muted dark:text-muted-dark text-xs uppercase tracking-wider">
                  Prix
                </th>
                <th className="text-left py-3 px-5 font-semibold text-muted dark:text-muted-dark text-xs uppercase tracking-wider">
                  Statut
                </th>
                <th className="hidden lg:table-cell text-left py-3 px-5 font-semibold text-muted dark:text-muted-dark text-xs uppercase tracking-wider">
                  Badges
                </th>
                <th className="text-right py-3 px-5 font-semibold text-muted dark:text-muted-dark text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, index) => (
                <tr
                  key={product.id}
                  draggable={rowDraggableId === product.id}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("bg-primary/5");
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove("bg-primary/5");
                  }}
                  onDrop={(e) => {
                    e.currentTarget.classList.remove("bg-primary/5");
                    handleDrop(e, index);
                  }}
                  onDragEnd={handleDragEnd}
                  className={`border-b border-border/50 dark:border-border-dark/50 last:border-0 hover:bg-primary/[0.02] dark:hover:bg-white/[0.02] transition-all select-none ${draggedIndex === index ? "opacity-30" : ""
                    }`}
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/5 flex items-center justify-center shrink-0 text-sm overflow-hidden relative">
                        {product.media_url ? (
                          product.media_type === "video" ? (
                            <span className="text-xs">🎬</span>
                          ) : (
                            <img src={product.media_url} alt={product.name} className="w-full h-full object-cover" />
                          )
                        ) : (
                          "☕"
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-dark dark:text-white leading-tight">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-muted truncate max-w-[180px]">
                          {product.media_url || "Aucun média"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell py-3.5 px-5 text-muted dark:text-muted-dark capitalize font-medium">
                    {categories.find((c) => c.id === product.category_id)?.name || product.category_id}
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-primary dark:text-secondary">
                    {formatPrice(product.price)}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={product.available ? "badge-available" : "badge-unavailable"}>
                      {product.available ? "Disponible" : "Épuisé"}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell py-3.5 px-5">
                    <div className="flex gap-1.5 flex-wrap">
                      {product.best_seller && (
                        <span className="badge-bestseller flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5" /> Best
                        </span>
                      )}
                      {product.featured && (
                        <span className="badge-new">Featured</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* ☰ Drag Handle - maintenir et glisser */}
                      <button
                        onMouseDown={() => setRowDraggableId(product.id)}
                        onMouseUp={() => setRowDraggableId(null)}
                        draggable="false"
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-primary/10 dark:hover:bg-white/10 transition-colors text-muted hover:text-primary cursor-grab active:cursor-grabbing"
                        title="Maintenir et glisser pour déplacer"
                      >
                        <GripVertical className="w-4 h-4 pointer-events-none" />
                      </button>

                      {/* Up/Down arrows */}
                      <button
                        onClick={() => useProductStore.getState().updateProductOrder(product.id, "up")}
                        disabled={index === 0}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-primary/10 disabled:opacity-20 transition-colors text-muted hover:text-primary"
                        title="Monter"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => useProductStore.getState().updateProductOrder(product.id, "down")}
                        disabled={index === filtered.length - 1}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-primary/10 disabled:opacity-20 transition-colors text-muted hover:text-primary"
                        title="Descendre"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggle(product.id, product.name, product.available)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary/10 transition-colors"
                        title={product.available ? "Marquer comme indisponible" : "Marquer comme disponible"}
                      >
                        {product.available ? (
                          <Eye className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted" />
                        )}
                      </button>

                      <button
                        onClick={() => setEditingProduct(product)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary/10 transition-colors text-amber-500 hover:text-amber-600"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-danger/10 transition-colors text-muted hover:text-danger"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setEditingProduct(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-card dark:bg-card-dark p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl border border-border/40 z-10 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <h3 className="text-lg font-bold text-dark dark:text-white" style={{ fontFamily: "var(--font-heading)" }}>
                  Modifier le produit
                </h3>
                <button onClick={() => setEditingProduct(null)} className="text-muted hover:text-dark">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">Nom du produit</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1">Catégorie</label>
                    <select
                      value={editingProduct.category_id || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm capitalize"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1">Prix (DA)</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">Média du produit (Vidéo / Photo)</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={editingProduct.media_url || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, media_url: e.target.value })}
                      placeholder="/Video.mp4 ou https://..."
                      className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm"
                    />
                    <input
                      type="file"
                      id="edit-media-upload"
                      accept="video/*,image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const isVideo = file.type.startsWith("video");
                          const url = URL.createObjectURL(file);
                          setEditingProduct({
                            ...editingProduct,
                            media_url: url,
                            media_type: isVideo ? "video" : "image",
                          });
                          toast.success(`${isVideo ? "Vidéo" : "Photo"} chargée !`);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById("edit-media-upload")?.click()}
                      className="px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white text-xs font-semibold flex items-center justify-center sm:justify-start gap-1.5 transition-all shrink-0"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Téléverser</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-dark dark:text-white">
                    <input
                      type="checkbox"
                      checked={editingProduct.best_seller}
                      onChange={(e) => setEditingProduct({ ...editingProduct, best_seller: e.target.checked })}
                      className="w-4 h-4 accent-primary rounded"
                    />
                    Best Seller ⭐
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-dark dark:text-white">
                    <input
                      type="checkbox"
                      checked={editingProduct.featured}
                      onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                      className="w-4 h-4 accent-primary rounded"
                    />
                    Mis en avant 🔥
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted hover:bg-primary/5"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-light transition-colors"
                  >
                    Enregistrer
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
