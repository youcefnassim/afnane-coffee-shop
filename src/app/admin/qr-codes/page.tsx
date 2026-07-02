"use client";

import { motion } from "framer-motion";
import { QrCode, Download, Copy, Printer } from "lucide-react";
import { toast } from "sonner";

export default function AdminQRCodesPage() {
  const tableUrl = "https://afnene.com/menu";

  const handleCopy = () => {
    navigator.clipboard.writeText(tableUrl);
    toast.success("Menu link copied to clipboard");
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1
          className="text-2xl font-bold text-dark dark:text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          QR Codes
        </h1>
        <p className="text-muted dark:text-muted-dark text-sm mt-1">
          Generate and download QR codes for your tables to allow digital menu access.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main QR Code Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-[var(--radius-lg)] p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-xl font-bold text-dark dark:text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Main Menu QR
          </h2>
          <p className="text-sm text-muted dark:text-muted-dark mb-8 max-w-xs mx-auto">
            Place this QR code on tables or at the counter for customers to view your menu.
          </p>

          {/* QR Code Placeholder */}
          <div className="w-64 h-64 mx-auto bg-white p-4 rounded-2xl shadow-sm mb-8 border border-border dark:border-border-dark flex items-center justify-center">
             <QrCode className="w-48 h-48 text-dark" />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
             <button className="btn-primary flex items-center gap-2 px-6">
                <Download className="w-4 h-4" />
                Download PNG
             </button>
             <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border dark:border-border-dark text-dark dark:text-white hover:bg-primary/5 transition-colors font-semibold text-sm">
                <Printer className="w-4 h-4" />
                Print Flyer
             </button>
          </div>
        </motion.div>

        {/* Info & Links Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="glass-card rounded-[var(--radius-lg)] p-6">
             <h3 className="font-bold text-dark dark:text-white mb-4">Direct Link</h3>
             <p className="text-sm text-muted dark:text-muted-dark mb-4">
               You can also share this link directly on social media or WhatsApp.
             </p>
             <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={tableUrl} 
                  className="flex-1 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-xl px-4 py-2.5 text-sm text-muted focus:outline-none"
                />
                <button onClick={handleCopy} className="btn-gold px-4 shrink-0">
                  <Copy className="w-4 h-4" />
                </button>
             </div>
          </div>

          <div className="glass-card rounded-[var(--radius-lg)] p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
             <h3 className="font-bold text-dark dark:text-white mb-2">How it works?</h3>
             <ul className="space-y-3 text-sm text-muted dark:text-muted-dark mt-4">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-xs">1</span>
                  <p>Download the QR code image.</p>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-xs">2</span>
                  <p>Print and place it on your restaurant tables or counter.</p>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-xs">3</span>
                  <p>Customers scan the code with their smartphone camera to view the menu instantly.</p>
                </li>
             </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
