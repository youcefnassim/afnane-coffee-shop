"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Image as ImageIcon, Video, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { uploadMedia, deleteMedia } from "@/lib/storage";

export default function AdminGalleryPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All Media");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("Coffee Shop");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ["All Media", "Coffee Shop", "Food & Drinks", "Moments"];

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setMedia(data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      toast.error("Erreur lors du chargement de la galerie");
    }
  };

  const filteredMedia = activeCategory === "All Media" 
    ? media 
    : media.filter(item => item.category === activeCategory);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const isVideo = file.type.startsWith("video");
      setIsUploading(true);

      try {
        toast.loading("Upload en cours...", { id: "upload" });
        
        // 1. Upload to Storage
        const url = await uploadMedia(file, "gallery");
        
        if (!url) throw new Error("Failed to upload to storage");

        // 2. Insert into DB
        const newItem = {
          type: isVideo ? "video" : "image",
          category: newCategory,
          url: url,
          caption: file.name,
        };

        const { data, error } = await supabase
          .from("gallery")
          .insert(newItem)
          .select()
          .single();

        if (error) throw error;

        setMedia([data, ...media]);
        setIsModalOpen(false);
        toast.success(`${isVideo ? "Vidéo" : "Photo"} ajoutée à la galerie !`, { id: "upload" });
      } catch (error) {
        console.error("Error adding media:", error);
        toast.error("Erreur lors de l'ajout", { id: "upload" });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce média ?")) return;
    
    const toastId = toast.loading("Suppression...");
    try {
      // 1. Delete from DB first to ensure permission/RLS allows it
      const { data, error } = await supabase
        .from("gallery")
        .delete()
        .eq("id", id)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error("Action non autorisée ou média introuvable. Veuillez vérifier vos accès.");
      }

      // 2. Delete from Storage if it's in our bucket and DB deletion succeeded
      if (url.includes("afnene-media")) {
        await deleteMedia(url);
      }

      setMedia(media.filter(m => m.id !== id));
      toast.success("Média supprimé de la galerie", { id: toastId });
    } catch (error: any) {
      console.error("Error deleting media:", error);
      toast.error(`Erreur lors de la suppression : ${error.message || error}`, { id: toastId });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*,video/*" 
        className="hidden" 
        onChange={handleFileUpload} 
      />

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
            Galerie
          </h1>
          <p className="text-muted dark:text-muted-dark text-sm mt-1">
            Gérez vos photos et vidéos ({media.length} éléments)
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter un Média
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-4 mb-4 hide-scrollbar"
      >
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat 
                ? "bg-primary text-white shadow-md shadow-primary/20" 
                : "bg-card dark:bg-card-dark border border-border dark:border-border-dark text-muted dark:text-muted-dark hover:bg-primary/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {filteredMedia.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group relative aspect-square rounded-[var(--radius-lg)] overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/5 border border-border/40"
          >
            {item.url ? (
              item.type === "video" ? (
                <video src={item.url} autoPlay muted loop playsInline className="w-full h-full object-cover" />
              ) : (
                <img src={item.url} alt="Gallery item" className="w-full h-full object-cover" />
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                {item.type === "video" ? (
                  <Video className="w-8 h-8 text-primary/30" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-primary/30" />
                )}
              </div>
            )}

            <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-semibold z-10">
              {item.category}
            </div>

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 z-20">
              <button 
                onClick={() => handleDelete(item.id, item.url)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-danger/80 text-white flex items-center justify-center transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsModalOpen(false)} 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="relative w-full max-w-md bg-card dark:bg-card-dark p-4 sm:p-6 rounded-3xl shadow-2xl border border-border/40 z-10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-dark dark:text-white">Ajouter un nouveau média</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-dark">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-muted mb-1 font-medium">Catégorie</label>
                  <select 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm"
                  >
                    <option value="Coffee Shop">Coffee Shop</option>
                    <option value="Food & Drinks">Food & Drinks</option>
                    <option value="Moments">Moments</option>
                  </select>
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-primary/30 hover:border-primary rounded-2xl p-8 text-center cursor-pointer hover:bg-primary/5 transition-colors"
                >
                  <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-dark dark:text-white">Cliquez pour choisir une photo ou vidéo</p>
                  <p className="text-xs text-muted mt-1">PNG, JPG, MP4 jusqu'à 20MB</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

