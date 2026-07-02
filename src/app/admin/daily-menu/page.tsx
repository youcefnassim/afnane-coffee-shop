"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Save, Upload, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { useDailyMenuStore } from "@/store/useDailyMenuStore";
import { MediaRenderer } from "@/components/shared/MediaRenderer";

export default function AdminDailyMenuPage() {
  const { menu, updateDailyMenu } = useDailyMenuStore();
  const [mounted, setMounted] = useState(false);

  // Form states
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (menu) {
      setDishName(menu.dishName);
      setDescription(menu.description);
      setPrice(menu.price.toString());
      setImageUrl(menu.imageUrl);
    }
  }, [menu]);

  if (!mounted) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      toast.success("Photo préparée pour l'envoi !");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim() || !price) {
      toast.error("Veuillez remplir au moins le nom et le prix.");
      return;
    }

    setIsUploading(true);
    let finalImageUrl = imageUrl;

    try {
      if (selectedFile) {
        toast.loading("Upload de l'image...", { id: "menu-save" });
        const { uploadMedia } = await import("@/lib/storage");
        const uploadedUrl = await uploadMedia(selectedFile, "daily-menu");
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
          setImageUrl(uploadedUrl);
        } else {
          throw new Error("Failed to upload image");
        }
      }

      await updateDailyMenu({
        dishName,
        description,
        price: Number(price),
        imageUrl: finalImageUrl || "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=800&auto=format&fit=crop",
        date: new Date().toISOString().split("T")[0],
      });

      toast.success("Menu du jour mis à jour avec succès ! 🌟", { id: "menu-save" });
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Error saving menu:", error);
      toast.error(error.message || "Erreur lors de la sauvegarde", { id: "menu-save" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1
            className="text-2xl font-bold text-dark dark:text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Gestion du Menu du Jour 🌟
          </h1>
          <p className="text-muted dark:text-muted-dark text-sm mt-1">
            Configurez le plat vedette affiché sur la bannière principale de la page d&apos;accueil.
          </p>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Column */}
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSave}
          className="glass-card rounded-[24px] p-6 md:p-8 space-y-5"
        >
          <h2 className="text-lg font-bold text-dark dark:text-white pb-3 border-b border-border/40 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            Détails du Plat du Jour
          </h2>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Nom du plat vedette *</label>
            <input
              type="text"
              required
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              placeholder="Ex: Escalope panée"
              className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Description & Accompagnements</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Frites maison, salade croquante, sauce au choix"
              className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Prix Spécial (DA) *</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="1200"
              className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Photo du Plat</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... ou téléverser"
                className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
              />
              <input
                type="file"
                id="daily-menu-upload"
                accept="video/*,image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => document.getElementById("daily-menu-upload")?.click()}
                className="px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
              >
                <Upload className="w-4 h-4" />
                <span>Téléverser</span>
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="btn-primary text-sm px-6 py-3 flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              Publier le Menu du Jour
            </button>
          </div>
        </motion.form>

        {/* Preview Column */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            Aperçu en direct sur le site
          </h2>

          <div className="relative bg-[#F0EDE1] rounded-[28px] p-6 flex flex-col items-center text-center shadow-md border border-black/5 overflow-hidden">
            <div className="w-44 h-44 rounded-full overflow-hidden shadow-xl border-4 border-white mb-4">
              <MediaRenderer
                mediaType={
                  selectedFile
                    ? (selectedFile.type.startsWith("video") ? "video" : "image")
                    : (imageUrl.endsWith(".mp4") || imageUrl.endsWith(".webm") || imageUrl.includes("video") || imageUrl.includes("mp4") ? "video" : "image")
                }
                mediaUrl={imageUrl || "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=800&auto=format&fit=crop"}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
              Menu du jour
            </span>
            <h3 className="text-2xl font-bold text-dark mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              {dishName || "Nom du plat"}
            </h3>
            <p className="text-xs text-dark/70 max-w-xs mb-4">
              {description || "Description de l'accompagnement..."}
            </p>
            <div className="text-2xl font-bold text-dark">
              {price ? formatPrice(Number(price)) : "0 DA"}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
