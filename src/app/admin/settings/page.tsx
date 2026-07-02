"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Store, Phone, Clock, MapPin, Globe, Palette } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    shopName: "AFNENE",
    tagline: "Coffee • Drink • Snack",
    phone: "+213 554 78 50 79",
    email: "hello@afnene.com",
    address: "Afnen SNACK & COFFEE, Oran, Algérie",
    whatsapp: "+213 554 78 50 79",
    instagram: "@afnene.snackcoffee",
    facebook: "afnene.coffee",
    openingHours: "Tous les jours: 07h00 - 22h00",
    mapEmbed: "https://maps.google.com/maps?q=35.7203394,-0.5774749&z=17&output=embed",
    primaryColor: "#004B36",
    secondaryColor: "#D6B370",
    currency: "DZD",
    language: "en",
  });

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Settings saved successfully!");
      setIsSaving(false);
    }, 1000);
  };

  const sections = [
    {
      title: "General",
      icon: Store,
      fields: [
        { key: "shopName", label: "Shop Name", type: "text" },
        { key: "tagline", label: "Tagline", type: "text" },
        { key: "currency", label: "Currency", type: "text" },
      ],
    },
    {
      title: "Contact",
      icon: Phone,
      fields: [
        { key: "phone", label: "Phone", type: "tel" },
        { key: "email", label: "Email", type: "email" },
        { key: "whatsapp", label: "WhatsApp", type: "tel" },
      ],
    },
    {
      title: "Social Media",
      icon: Globe,
      fields: [
        { key: "instagram", label: "Instagram", type: "text" },
        { key: "facebook", label: "Facebook", type: "text" },
      ],
    },
    {
      title: "Location",
      icon: MapPin,
      fields: [
        { key: "address", label: "Address", type: "text" },
        { key: "mapEmbed", label: "Google Maps Embed URL", type: "url" },
      ],
    },
    {
      title: "Hours",
      icon: Clock,
      fields: [
        { key: "openingHours", label: "Opening Hours", type: "text" },
      ],
    },
    {
      title: "Theme",
      icon: Palette,
      fields: [
        { key: "primaryColor", label: "Primary Color", type: "color" },
        { key: "secondaryColor", label: "Secondary Color", type: "color" },
      ],
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
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
            Settings
          </h1>
          <p className="text-muted dark:text-muted-dark text-sm mt-1">
            Configure your coffee shop details
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
              Saving...
            </div>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
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
                <div key={field.key} className={field.key === "mapEmbed" || field.key === "address" ? "sm:col-span-2" : ""}>
                  <label className="block text-sm font-medium text-dark/80 dark:text-white/80 mb-1.5">
                    {field.label}
                  </label>
                  {field.type === "color" ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings[field.key as keyof typeof settings]}
                        onChange={(e) => updateSetting(field.key, e.target.value)}
                        className="w-10 h-10 rounded-lg border border-border dark:border-border-dark cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings[field.key as keyof typeof settings]}
                        onChange={(e) => updateSetting(field.key, e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-card dark:bg-card-dark border border-border dark:border-border-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                      />
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={settings[field.key as keyof typeof settings]}
                      onChange={(e) => updateSetting(field.key, e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card dark:bg-card-dark border border-border dark:border-border-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
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
