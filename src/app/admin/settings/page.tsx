"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Store, Phone, Clock, MapPin, Globe, Palette } from "lucide-react";
import { toast } from "sonner";
import { useSettingsStore, ShopSettings } from "@/store/useSettingsStore";

export default function AdminSettingsPage() {
  const { settings: storeSettings, fetchSettings, updateSettings } = useSettingsStore();
  const [isSaving, setIsSaving] = useState(false);
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

  const handleSave = async () => {
    if (!localSettings) return;
    setIsSaving(true);
    try {
      await updateSettings(localSettings);
      toast.success("Paramètres enregistrés avec succès !");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
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
      </div>
    </div>
  );
}
