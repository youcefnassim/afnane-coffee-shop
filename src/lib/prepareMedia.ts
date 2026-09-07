/**
 * Normalize phone / camera files (HEIC, empty MIME, huge PNGs) into an
 * upload-ready File (JPEG for images, original for video).
 */

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|bmp|heic|heif)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|m4v|avi)$/i;

function getExtension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

export function isLikelyImage(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  if (!file.type || file.type === "application/octet-stream") {
    return IMAGE_EXT.test(file.name);
  }
  return false;
}

export function isLikelyVideo(file: File): boolean {
  if (file.type.startsWith("video/")) return true;
  if (!file.type || file.type === "application/octet-stream") {
    return VIDEO_EXT.test(file.name);
  }
  return false;
}

async function heicToJpegBlob(file: File): Promise<Blob> {
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.82,
  });
  const blob = Array.isArray(result) ? result[0] : result;
  return blob as Blob;
}

function blobToJpegFile(blob: Blob, baseName: string): File {
  const safeName = baseName.replace(/\.[^.]+$/, "") || "photo";
  return new File([blob], `${safeName}.jpg`, { type: "image/jpeg" });
}

/** Compress / convert any supported image to a JPEG File via canvas. */
function canvasCompressToJpeg(fileOrBlob: Blob, baseName: string, maxSize = 1600, quality = 0.82): Promise<File> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(fileOrBlob);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        if (width >= height) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas indisponible"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Compression image échouée"));
            return;
          }
          resolve(blobToJpegFile(blob, baseName));
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Format d'image non supporté. Essayez JPG ou PNG."));
    };
    img.src = objectUrl;
  });
}

/**
 * Returns a File ready for Supabase Storage:
 * - Images → JPEG (HEIC converted first)
 * - Videos → original file with a sensible MIME if missing
 */
export async function prepareMediaForUpload(file: File): Promise<File> {
  if (isLikelyVideo(file)) {
    if (file.type) return file;
    const ext = getExtension(file.name);
    const mime =
      ext === "webm" ? "video/webm" :
      ext === "mov" ? "video/quicktime" :
      "video/mp4";
    return new File([file], file.name.replace(/\.[^.]+$/, "") + ".mp4", { type: mime });
  }

  if (!isLikelyImage(file)) {
    throw new Error("Veuillez choisir une image (JPG, PNG, WebP, HEIC) ou une vidéo.");
  }

  const ext = getExtension(file.name);
  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    ext === "heic" ||
    ext === "heif";

  try {
    if (isHeic) {
      const jpegBlob = await heicToJpegBlob(file);
      return canvasCompressToJpeg(jpegBlob, file.name);
    }
    return await canvasCompressToJpeg(file, file.name);
  } catch (err) {
    if (isHeic) {
      throw new Error("Impossible de convertir cette photo HEIC. Exportez-la en JPG depuis votre téléphone.");
    }
    throw err instanceof Error ? err : new Error("Format d'image non supporté. Essayez JPG ou PNG.");
  }
}

/** Preview helper: object URL for a prepared or raw file. Caller must revoke. */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}
