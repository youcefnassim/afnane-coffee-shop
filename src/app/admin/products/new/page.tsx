"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Video, Image as ImageIcon, Upload } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useProductStore } from "@/store/useProductStore";
import { supabase } from "@/lib/supabase";

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct } = useProductStore();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("coffee");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [mediaUrl, setMediaUrl] = useState("");
  const [bestSeller, setBestSeller] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
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
          if (mapped.length > 0) {
            setCategory(mapped[0].id);
          }
        }
      });
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const isVideo = file.type.startsWith("video");
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      setMediaType(isVideo ? "video" : "image");
      toast.success(`${isVideo ? "Vidéo" : "Photo"} préparée !`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      toast.error("Veuillez remplir au moins le nom et le prix.");
      return;
    }

    setIsSubmitting(true);
    let finalMediaUrl = mediaUrl;

    try {
      if (selectedFile) {
        toast.loading("Upload du média...", { id: "product-save" });
        const { uploadMedia } = await import("@/lib/storage");
        const uploadedUrl = await uploadMedia(selectedFile, "products");
        if (uploadedUrl) {
          finalMediaUrl = uploadedUrl;
          setMediaUrl(uploadedUrl);
        } else {
          throw new Error("Failed to upload media");
        }
      }

      await addProduct({
        name,
        category_id: category,
        price: Number(price),
        description,
        ingredients: ingredients || "Grains de café, eau",
        media_type: mediaType,
        media_url: finalMediaUrl || (mediaType === "video" ? "/Video.mp4" : "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop"),
        available: true,
        best_seller: bestSeller,
        featured: featured,
        promotion: false,
      });

      toast.success("Nouveau produit créé et publié avec succès !", { id: "product-save" });
      router.push("/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Erreur lors de la sauvegarde", { id: "product-save" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux produits
      </Link>

      <div>
        <h1
          className="text-2xl font-bold text-dark dark:text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Ajouter un produit
        </h1>
        <p className="text-muted dark:text-muted-dark text-sm mt-1">
          Créez un nouveau produit pour le menu avec photo ou vidéo présentative.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card dark:bg-card-dark p-6 md:p-8 rounded-3xl shadow-sm border border-border/40 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-muted mb-2">Nom du produit *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Iced Caramel Macchiato"
              className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-2">Catégorie *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary capitalize"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-2">Prix (DA) *</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 500"
              className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-2">Type de média principal</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMediaType("image")}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-colors ${
                  mediaType === "image"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 text-muted"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Photo
              </button>
              <button
                type="button"
                onClick={() => setMediaType("video")}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-colors ${
                  mediaType === "video"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 text-muted"
                }`}
              >
                <Video className="w-4 h-4" />
                Vidéo Présentative
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-muted mb-2">Fichier Média (Vidéo ou Photo)</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="/Video.mp4 ou https://..."
                className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
              />
              <input
                type="file"
                id="new-media-upload"
                accept="video/*,image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => document.getElementById("new-media-upload")?.click()}
                className="px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white text-xs font-semibold flex items-center justify-center sm:justify-start gap-1.5 transition-all shrink-0"
              >
                <Upload className="w-4 h-4" />
                <span>Téléverser</span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted mb-2">Ingrédients (séparés par des virgules)</label>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Ex: Espresso, Lait chaud, Caramel"
            className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted mb-2">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description détaillée..."
            className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-dark dark:text-white">
            <input
              type="checkbox"
              checked={bestSeller}
              onChange={(e) => setBestSeller(e.target.checked)}
              className="w-4 h-4 accent-primary rounded"
            />
            Best Seller ⭐
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-dark dark:text-white">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 accent-primary rounded"
            />
            Mis en avant 🔥
          </label>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-border/40">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 rounded-xl border border-border text-muted text-sm font-medium hover:bg-primary/5 transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2"
          >
            {isSubmitting ? "Enregistrement..." : "Créer et Publier"}
          </button>
        </div>
      </form>
    </div>
  );
}
