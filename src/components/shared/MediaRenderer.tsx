"use client";

import Image from "next/image";
import { useRef, useState } from "react";
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

  if (!mediaUrl || hasError) {
    return (
      <div
        className={`${aspectRatio} bg-gradient-to-br from-[var(--color-border)] to-[var(--color-background)] flex items-center justify-center ${className}`}
      >
        <div className="text-center text-[var(--color-muted)]">
          <svg
            className="w-10 h-10 mx-auto mb-2 opacity-40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs">No media</span>
        </div>
      </div>
    );
  }

  if (mediaType === "video") {
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

  // Image
  return (
    <div className={`${fill ? "" : aspectRatio} relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 skeleton-shimmer z-10" />
      )}
      <Image
        src={mediaUrl}
        alt={alt}
        fill={fill || true}
        sizes={sizes}
        priority={priority}
        className={`object-${objectFit} transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
