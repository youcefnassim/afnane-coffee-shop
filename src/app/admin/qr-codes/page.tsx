"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { QrCode, Download, Copy, Printer, Table, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";

export default function AdminQRCodesPage() {
  const [origin, setOrigin] = useState("https://afnane-coffee-shop-9wam.vercel.app");
  const [qrType, setQrType] = useState<"general" | "table">("general");
  const [tableNumber, setTableNumber] = useState("1");
  const flyerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const getTargetUrl = () => {
    if (qrType === "general") {
      return `${origin}/menu`;
    }
    return `${origin}/menu?table=${tableNumber}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getTargetUrl());
    toast.success("Lien copié dans le presse-papiers 📋");
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadQR = () => {
    const canvasElement = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
    if (!canvasElement) {
      toast.error("Erreur: QR Code introuvable");
      return;
    }

    try {
      const png = canvasElement.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = png;
      downloadLink.download = `QR_AFNENE_${qrType === "general" ? "General" : `Table_${tableNumber}`}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success("Téléchargement du QR Code démarré ! 📥");
    } catch (err) {
      console.error("Error downloading QR:", err);
      toast.error("Impossible de télécharger le QR Code sur ce navigateur. Veuillez faire une capture d'écran.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
      {/* Printable Flyer Container (Hidden on screen, visible on print) */}
      <div className="hidden print:block fixed inset-0 bg-white text-black font-sans p-0 z-[9999] h-screen w-screen">
        <div className="w-[148mm] h-[210mm] mx-auto border-4 border-double border-[#004B36] p-8 flex flex-col items-center justify-between text-center bg-white shadow-none mt-10 rounded-3xl">
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D6B370] mx-auto bg-black flex items-center justify-center">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-widest text-[#004B36] uppercase" style={{ fontFamily: "var(--font-heading)" }}>
              AFNENE
            </h2>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Snack & Coffee</p>
          </div>

          <div className="space-y-6">
            <div className="bg-[#004B36]/5 p-6 rounded-3xl border-2 border-dashed border-[#004B36]/30 inline-block">
              <QRCodeSVG
                value={getTargetUrl()}
                size={220}
                level="H"
                includeMargin={false}
                fgColor="#004B36"
              />
            </div>
            {qrType === "table" ? (
              <div className="bg-[#D6B370] text-[#004B36] font-extrabold text-2xl px-6 py-2 rounded-full inline-block tracking-wider uppercase">
                TABLE {tableNumber.padStart(2, "0")}
              </div>
            ) : (
              <div className="bg-[#004B36] text-[#D6B370] font-extrabold text-base px-6 py-2 rounded-full inline-block tracking-wider uppercase">
                MENU EN LIGNE
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-lg font-bold text-[#004B36]">Scannez pour commander</p>
            <p className="text-xs text-gray-400 max-w-[280px] mx-auto">
              Ouvrez l'appareil photo de votre smartphone pour accéder instantanément au menu et commander.
            </p>
          </div>
        </div>
      </div>

      {/* Screen Layout */}
      <div className="print:hidden">
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
            Générez et imprimez des QR Codes pour vos tables afin de permettre aux clients de commander en ligne.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main QR Code Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-[var(--radius-lg)] p-6 sm:p-8 text-center flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <QrCode className="w-7 h-7 text-primary" />
              </div>
              
              <h2 className="text-xl font-bold text-dark dark:text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Générateur de QR Code
              </h2>
              <p className="text-xs text-muted dark:text-muted-dark mb-6 max-w-xs mx-auto">
                Choisissez le type de QR Code à générer pour vos supports.
              </p>

              {/* Selector Tabs */}
              <div className="flex bg-background dark:bg-white/5 p-1 rounded-xl mb-6 max-w-sm mx-auto">
                <button
                  onClick={() => setQrType("general")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                    qrType === "general"
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted hover:text-dark dark:hover:text-white"
                  }`}
                >
                  Menu Général
                </button>
                <button
                  onClick={() => setQrType("table")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                    qrType === "table"
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted hover:text-dark dark:hover:text-white"
                  }`}
                >
                  Table Spécifique
                </button>
              </div>

              {qrType === "table" && (
                <div className="mb-6 max-w-xs mx-auto">
                  <label className="block text-[11px] font-semibold text-muted mb-1.5 text-left uppercase tracking-wider">
                    Numéro de table
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border dark:border-border-dark bg-background dark:bg-white/5 text-dark dark:text-white text-sm focus:outline-none focus:border-primary font-mono text-center font-bold"
                    />
                  </div>
                </div>
              )}

              {/* QR Code Container */}
              <div className="w-56 h-56 mx-auto bg-white p-4 rounded-3xl shadow-sm mb-6 border border-border/60 flex items-center justify-center relative">
                <QRCodeCanvas
                  id="qr-code-canvas"
                  value={getTargetUrl()}
                  size={180}
                  level="H"
                  includeMargin={false}
                  fgColor="#004B36"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button onClick={downloadQR} className="btn-primary flex items-center justify-center gap-2 px-6 py-2.5">
                <Download className="w-4 h-4" />
                <span>Télécharger PNG</span>
              </button>
              <button onClick={handlePrint} className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-border dark:border-border-dark text-dark dark:text-white hover:bg-primary/5 transition-colors font-semibold text-xs">
                <Printer className="w-4 h-4" />
                <span>Imprimer Flyer</span>
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
              <h3 className="font-bold text-dark dark:text-white mb-4 text-sm flex items-center gap-1.5 font-sans">
                <Table className="w-4 h-4 text-primary" /> Lien de redirection
              </h3>
              <p className="text-xs text-muted dark:text-muted-dark mb-4 leading-relaxed font-sans">
                Voici le lien direct associé à ce QR Code. Vous pouvez le partager sur les réseaux sociaux.
              </p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={getTargetUrl()} 
                  className="flex-1 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-xl px-4 py-2.5 text-xs text-muted focus:outline-none font-mono truncate"
                />
                <button onClick={handleCopy} className="btn-gold px-4 shrink-0">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="glass-card rounded-[var(--radius-lg)] p-6 bg-gradient-to-br from-primary/5 to-secondary/5 space-y-4">
              <h3 className="font-bold text-dark dark:text-white text-sm font-sans">Comment l'utiliser ?</h3>
              <ul className="space-y-3.5 text-xs text-muted dark:text-muted-dark mt-4 leading-relaxed font-sans">
                <li className="flex gap-3">
                  <span className="w-5.5 h-5.5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-[10px]">1</span>
                  <p>Choisissez <strong>Table Spécifique</strong> et tapez le numéro (ex: 3).</p>
                </li>
                <li className="flex gap-3">
                  <span className="w-5.5 h-5.5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-[10px]">2</span>
                  <p>Cliquez sur <strong>Imprimer Flyer</strong> ou téléchargez l'image PNG.</p>
                </li>
                <li className="flex gap-3">
                  <span className="w-5.5 h-5.5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-[10px]">3</span>
                  <p>Placez le QR Code sur la table correspondante.</p>
                </li>
                <li className="flex gap-3">
                  <span className="w-5.5 h-5.5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-[10px]">4</span>
                  <p>Lorsqu'un client le scanne, son panier pré-remplit automatiquement son numéro de table et son choix sur place !</p>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
