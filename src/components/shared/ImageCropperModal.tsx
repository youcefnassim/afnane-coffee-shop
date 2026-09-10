"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ZoomIn, ZoomOut } from "lucide-react";
import getCroppedImg from "@/lib/cropImage";

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropCompleteAction: (croppedFile: File) => void;
  aspectRatio?: number;
}

export function ImageCropperModal({
  isOpen,
  imageSrc,
  onClose,
  onCropCompleteAction,
  aspectRatio = 1, // Default to square
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsProcessing(true);
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      if (croppedBlob) {
        // Convert Blob to File
        const file = new File([croppedBlob], `cropped-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        onCropCompleteAction(file);
      }
    } catch (e) {
      console.error("Error cropping image:", e);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-xl bg-card dark:bg-card-dark rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-4 border-b border-border/40 flex items-center justify-between">
            <h3 className="font-bold text-lg text-dark dark:text-white">
              Recadrer la photo
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cropper Area */}
          <div className="relative w-full h-[400px] bg-black/10">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>

          {/* Controls */}
          <div className="p-4 flex flex-col gap-4 bg-background dark:bg-background-dark">
            <div className="flex items-center gap-3 px-4">
              <ZoomOut className="w-4 h-4 text-muted" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => {
                  setZoom(Number(e.target.value));
                }}
                className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <ZoomIn className="w-4 h-4 text-muted" />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-bold text-muted hover:bg-black/5 transition-colors"
                disabled={isProcessing}
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-light transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Valider</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
