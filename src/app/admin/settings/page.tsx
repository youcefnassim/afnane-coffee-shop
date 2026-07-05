"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Store, Phone, Clock, MapPin, Globe, Palette, Database, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useSettingsStore, ShopSettings } from "@/store/useSettingsStore";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { MAMAKA_CATEGORIES, MAMAKA_PRODUCTS } from "@/lib/afnene_data";

export default function AdminSettingsPage() {
  const { settings: storeSettings, fetchSettings, updateSettings } = useSettingsStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [localSettings, setLocalSettings] = useState<ShopSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (storeSettings) {
      setLocalSettings(storeSettings);
    }
  }, [storeSettings]);

  const updateSetting = (key: keyof ShopSettings, value: string) => {
    if (!localSettings) return;
    setLocalSettings((prev) => prev ? { ...prev, [key]: value } : null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSettings) return;
    setIsSaving(true);
    try {
      await updateSettings(localSettings);
      toast.success("Paramètres enregistrés avec succès !");
    } catch (err: any) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImportMamaka = async () => {
    const confirm = window.confirm(
      "ATTENTION : Cette action va supprimer TOUS vos produits et catégories actuels pour importer le menu de Mamaka. Cette action est irréversible. Voulez-vous continuer ?"
    );
    if (!confirm) return;

    setIsImporting(true);
    toast.loading("Importation du menu Mamaka...", { id: "import-mamaka" });

    if (!isSupabaseConfigured()) {
      try {
        // 1. Map categories locally
        const mappedCats = MAMAKA_CATEGORIES.map((c) => ({
          id: c.id,
          name: c.name.fr,
          icon: c.icon,
          itemCount: MAMAKA_PRODUCTS.filter(p => p.category_id === c.id).length,
          status: "Active"
        }));
        localStorage.setItem("afnene_categories", JSON.stringify(mappedCats));

        // 2. Map products locally
        const mappedProds = MAMAKA_PRODUCTS.map((p, idx) => ({
          id: String(idx + 1),
          category_id: p.category_id,
          name: p.name.fr,
          description: p.description.fr,
          price: p.price,
          media_type: p.media_type,
          media_url: p.media_url,
          available: p.available,
          best_seller: p.best_seller,
          featured: p.featured,
          promotion: p.promotion,
          ingredients: p.ingredients.fr,
          sort_order: idx + 1
        }));
        localStorage.setItem("afnene-products-storage", JSON.stringify({
          state: { products: mappedProds, isLoading: false, error: null },
          version: 0
        }));

        toast.success("Menu Mamaka importé localement avec succès ! 🎉", { id: "import-mamaka" });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err: any) {
        console.error("Local import error:", err);
        toast.error("Erreur lors de l'importation locale", { id: "import-mamaka" });
      } finally {
        setIsImporting(false);
      }
      return;
    }

    try {
      // 1. Delete existing products
      const { error: delProductsError } = await supabase
        .from("products")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (delProductsError) throw delProductsError;

      // 2. Delete existing categories
      const { error: delCatsError } = await supabase
        .from("categories")
        .delete()
        .neq("id", "none");

      if (delCatsError) throw delCatsError;

      // 3. Insert Mamaka categories
      const { error: insCatsError } = await supabase
        .from("categories")
        .insert(MAMAKA_CATEGORIES);

      if (insCatsError) throw insCatsError;

      // 4. Insert Mamaka products
      const { error: insProductsError } = await supabase
        .from("products")
        .insert(MAMAKA_PRODUCTS);

      if (insProductsError) throw insProductsError;

      toast.success("Menu Mamaka importé avec succès ! 🎉", { id: "import-mamaka" });

      // Clear localStorage cache to force refresh
      if (typeof window !== "undefined") {
        localStorage.removeItem("afnene-products-storage");
        localStorage.removeItem("afnene_categories");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err: any) {
      console.error("Error importing Mamaka menu:", err);
      toast.error(err.message || "Erreur lors de l'importation", { id: "import-mamaka" });
    } finally {
      setIsImporting(false);
    }
  };

  if (!localSettings) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-muted">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm">Chargement des paramètres...</p>
      </div>
    );
  }

  const sections = [
    {
      title: "Général",
      icon: Store,
      fields: [
        { key: "shop_name" as keyof ShopSettings, label: "Nom du commerce", type: "text" },
        { key: "tagline" as keyof ShopSettings, label: "Slogan (Tagline)", type: "text" },
        { key: "currency" as keyof ShopSettings, label: "Devise", type: "text" },
      ],
    },
    {
      title: "Contact",
      icon: Phone,
      fields: [
        { key: "phone" as keyof ShopSettings, label: "Téléphone de contact", type: "tel" },
        { key: "email" as keyof ShopSettings, label: "Email de contact", type: "email" },
        { key: "whatsapp" as keyof ShopSettings, label: "Numéro WhatsApp (Format: 213xxxxxxxx)", type: "tel" },
      ],
    },
    {
      title: "Réseaux Sociaux",
      icon: Globe,
      fields: [
        { key: "instagram" as keyof ShopSettings, label: "Instagram (@compte)", type: "text" },
        { key: "facebook" as keyof ShopSettings, label: "Facebook (page)", type: "text" },
      ],
    },
    {
      title: "Localisation",
      icon: MapPin,
      fields: [
        { key: "address" as keyof ShopSettings, label: "Adresse physique", type: "text" },
        { key: "map_embed" as keyof ShopSettings, label: "Google Maps URL (Embed/Intégration)", type: "url" },
      ],
    },
    {
      title: "Horaires",
      icon: Clock,
      fields: [
        { key: "opening_hours" as keyof ShopSettings, label: "Horaires d'ouverture", type: "text" },
      ],
    },
    {
      title: "Thème",
      icon: Palette,
      fields: [
        { key: "primary_color" as keyof ShopSettings, label: "Couleur principale (Hex)", type: "color" },
        { key: "secondary_color" as keyof ShopSettings, label: "Couleur secondaire (Hex)", type: "color" },
      ],
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1
            className="text-2xl font-bold text-dark dark:text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Paramètres
          </h1>
          <p className="text-muted dark:text-muted-dark text-sm mt-1">
            Configurez les détails et coordonnées de votre commerce
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary text-sm px-5 py-2.5 disabled:opacity-60"
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enregistrement...
            </div>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Enregistrer
            </>
          )}
        </button>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {sections.map((section, sIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sIndex * 0.08 }}
            className="glass-card rounded-[var(--radius-lg)] p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <section.icon className="w-4 h-4 text-primary dark:text-secondary" />
              </div>
              <h2 className="font-bold text-dark dark:text-white">
                {section.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field.key} className={field.key === "map_embed" || field.key === "address" ? "sm:col-span-2" : ""}>
                  <label className="block text-sm font-medium text-dark/80 dark:text-white/80 mb-1.5 font-sans">
                    {field.label}
                  </label>
                  {field.type === "color" ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={localSettings[field.key]}
                        onChange={(e) => updateSetting(field.key, e.target.value)}
                        className="w-10 h-10 rounded-lg border border-border dark:border-border-dark cursor-pointer"
                      />
                      <input
                        type="text"
                        value={localSettings[field.key]}
                        onChange={(e) => updateSetting(field.key, e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-card dark:bg-card-dark border border-border dark:border-border-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                      />
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={localSettings[field.key] || ""}
                      onChange={(e) => updateSetting(field.key, e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card dark:bg-card-dark border border-border dark:border-border-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-sans"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Zone de Danger / Importation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sections.length * 0.08 }}
          className="glass-card border-red-500/20 dark:border-red-500/30 rounded-[var(--radius-lg)] p-6 bg-red-500/5 dark:bg-red-950/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <h2 className="font-bold text-red-600 dark:text-red-400">
              Zone de danger & Importation
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted dark:text-muted-dark">
              Cette option vous permet d'initialiser ou de remplacer l'ensemble de votre menu par le classement de catégories et de produits de <strong>Mamaka</strong>.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleImportMamaka}
                disabled={isImporting}
                className="flex items-center gap-2 text-sm px-5 py-2.5 bg-red-500 hover:bg-red-600 active:scale-95 text-white rounded-xl disabled:opacity-60 transition-all font-semibold shadow-lg shadow-red-500/10"
              >
                {isImporting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Importation...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    Importer le menu Mamaka
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
