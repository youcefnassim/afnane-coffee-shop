"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import type { MediaType } from "@/types/database";

interface MediaRendererProps {
  mediaType: MediaType;
  mediaUrl: string | null;
  thumbnail?: string | null;
  alt?: string;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  objectFit?: "cover" | "contain";
  showPlayButton?: boolean;
}

export function MediaRenderer({
  mediaType,
  mediaUrl,
  thumbnail,
  alt = "",
  className = "",
  aspectRatio = "aspect-[4/3]",
  priority = false,
  fill = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  objectFit = "cover",
  showPlayButton = false,
}: MediaRendererProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [useNativeImg, setUseNativeImg] = useState(false);

  // Reset error and load state whenever the mediaUrl prop changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
    setUseNativeImg(false);
  }, [mediaUrl]);

  const effectiveUrl = hasError || !mediaUrl ? "/logo.jpg" : mediaUrl;
  const isBlobOrDataUrl = effectiveUrl.startsWith("blob:") || effectiveUrl.startsWith("data:");

  if (mediaType === "video" && !hasError && mediaUrl) {
    return (
      <div className={`${aspectRatio} relative overflow-hidden ${className}`}>
        <video
          ref={videoRef}
          src={mediaUrl}
          poster={thumbnail || undefined}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-${objectFit} transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoadedData={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
        {!isLoaded && (
          <div className="absolute inset-0 skeleton-shimmer" />
        )}
        {showPlayButton && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Image - Use native <img> for blob/data/local URLs or when Next Image fails
  if (isBlobOrDataUrl || useNativeImg || effectiveUrl === "/logo.jpg") {
    return (
      <div className={`${fill ? "w-full h-full" : aspectRatio} relative overflow-hidden ${className}`}>
        <img
          src={effectiveUrl}
          alt={alt}
          className={`w-full h-full object-${objectFit}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            if (!hasError) setHasError(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className={`${fill ? "" : aspectRatio} relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 skeleton-shimmer z-10" />
      )}
      <Image
        src={effectiveUrl}
        alt={alt}
        fill={fill || true}
        sizes={sizes}
        priority={priority}
        unoptimized
        className={`object-${objectFit} transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setUseNativeImg(true);
        }}
      />
    </div>
  );
}
