"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit, Tag, Percent, X } from "lucide-react";
import { toast } from "sonner";

interface AdminPromotion {
  id: string;
  title: string;
  discount: number;
  product_name: string;
  status: "Active" | "Expired";
  end_date: string;
}

const INITIAL_PROMOTIONS: AdminPromotion[] = [
  {
    id: "1",
    title: "Offre Spéciale Été",
    discount: 30,
    product_name: "Toutes les Boissons Froides",
    status: "Active",
    end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  },
  {
    id: "2",
    title: "Combo Burger & Boisson",
    discount: 25,
    product_name: "Signature Burger",
    status: "Active",
    end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  },
  {
    id: "3",
    title: "Café Matinal -20%",
    discount: 20,
    product_name: "Tous les Cafés",
    status: "Active",
    end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  },
];

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<AdminPromotion[]>(INITIAL_PROMOTIONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<AdminPromotion | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [productName, setProductName] = useState("");
  const [discount, setDiscount] = useState(15);
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<"Active" | "Expired">("Active");

  const openAddModal = () => {
    setEditingPromo(null);
    setTitle("");
    setProductName("Tous les plats");
    setDiscount(15);
    setEndDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setStatus("Active");
    setModalOpen(true);
  };

  const openEditModal = (promo: AdminPromotion) => {
    setEditingPromo(promo);
    setTitle(promo.title);
    setProductName(promo.product_name);
    setDiscount(promo.discount);
    setEndDate(promo.end_date);
    setStatus(promo.status);
    setModalOpen(true);
  };

  const handleDelete = (id: string, promoTitle: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    toast.info(`Promotion "${promoTitle}" supprimée`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingPromo) {
      setPromotions((prev) =>
        prev.map((p) =>
          p.id === editingPromo.id
            ? { ...p, title, product_name: productName, discount, end_date: endDate, status }
            : p
        )
      );
      toast.success(`Promotion "${title}" mise à jour !`);
    } else {
      const newPromo: AdminPromotion = {
        id: Date.now().toString(),
        title,
        product_name: productName,
        discount,
        end_date: endDate,
        status,
      };
      setPromotions((prev) => [newPromo, ...prev]);
      toast.success(`Nouvelle promotion "${title}" créée !`);
    }

    setModalOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
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
            Promotions & Offres Spéciales
          </h1>
          <p className="text-muted dark:text-muted-dark text-sm mt-1">
            Gérez vos réductions et campagnes marketing ({promotions.length} au total)
          </p>
        </div>
        <button onClick={openAddModal} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Créer une promotion
        </button>
      </motion.div>

      {/* Promotions Table */}
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
                  Titre de l&apos;offre
                </th>
                <th className="text-left py-3 px-5 font-semibold text-muted dark:text-muted-dark text-xs uppercase tracking-wider">
                  Cible / Produit
                </th>
                <th className="text-left py-3 px-5 font-semibold text-muted dark:text-muted-dark text-xs uppercase tracking-wider">
                  Réduction
                </th>
                <th className="text-left py-3 px-5 font-semibold text-muted dark:text-muted-dark text-xs uppercase tracking-wider">
                  Date d&apos;expiration
                </th>
                <th className="text-left py-3 px-5 font-semibold text-muted dark:text-muted-dark text-xs uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-right py-3 px-5 font-semibold text-muted dark:text-muted-dark text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo, index) => (
                <motion.tr
                  key={promo.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-border/50 dark:border-border-dark/50 last:border-0 hover:bg-primary/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-secondary/10 to-accent/5 flex items-center justify-center shrink-0">
                        <Tag className="w-4 h-4 text-secondary" />
                      </div>
                      <span className="font-medium text-dark dark:text-white">
                        {promo.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-muted dark:text-muted-dark">
                    {promo.product_name}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-0.5 font-bold text-danger">
                      -{promo.discount}% <Percent className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-muted dark:text-muted-dark">
                    {promo.end_date}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={promo.status === "Active" ? "badge-available" : "badge-unavailable"}>
                      {promo.status === "Active" ? "Active" : "Expirée"}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(promo)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-amber-500/10 transition-colors text-amber-500"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(promo.id, promo.title)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-danger/10 transition-colors text-muted hover:text-danger"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add / Edit Promo Modal */}
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
                  {editingPromo ? "Modifier la promotion" : "Nouvelle promotion"}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-muted hover:text-dark">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">Titre de la promotion</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Offre Spéciale Été"
                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">Cible / Produit concerné</label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ex: Tous les Cafés ou Signature Burger"
                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1">Réduction (%)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={100}
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1">Expiration</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-1">Statut</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "Active" | "Expired")}
                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="Active">Active</option>
                    <option value="Expired">Expirée</option>
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
                    {editingPromo ? "Enregistrer" : "Créer"}
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
