import { supabase, isSupabaseConfigured } from "./supabase";
import { prepareMediaForUpload } from "./prepareMedia";

const BUCKET = "afnene-media";

function guessContentType(file: File): string {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "mp4") return "video/mp4";
  if (ext === "webm") return "video/webm";
  return "application/octet-stream";
}

function friendlyUploadError(error: { message?: string } | null | undefined): Error {
  const msg = error?.message || "Erreur d'upload vers Supabase Storage";
  if (msg.includes("Bucket not found") || msg.includes("storage.buckets")) {
    return new Error(
      "Le bucket 'afnene-media' n'existe pas. Créez-le (Public) dans Supabase → Storage, puis appliquez supabase/schema_storage.sql."
    );
  }
  if (msg.includes("row-level security") || msg.includes("RLS") || msg.toLowerCase().includes("policy")) {
    return new Error(
      "Permission Storage refusée (RLS). Exécutez supabase/schema_storage.sql dans le SQL Editor Supabase pour autoriser les uploads."
    );
  }
  if (msg.includes("fetch failed") || msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
    return new Error(
      "Impossible de joindre Supabase Storage. Vérifiez NEXT_PUBLIC_SUPABASE_URL et votre connexion internet."
    );
  }
  if (msg.includes("Payload too large") || msg.includes("maximum allowed size")) {
    return new Error("Fichier trop volumineux. Essayez une photo plus légère (max ~10 Mo).");
  }
  return new Error(msg);
}

/**
 * Prepare (compress / HEIC→JPEG) then upload to the public afnene-media bucket.
 * Returns a public HTTPS URL.
 */
export async function uploadMedia(file: File, folder: string = "general"): Promise<string> {
  if (!file) throw new Error("Aucun fichier sélectionné");

  if (!isSupabaseConfigured()) {
    throw new Error("Supabase n'est pas configuré. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  const prepared = await prepareMediaForUpload(file);
  const contentType = guessContentType(prepared);
  const ext = contentType.startsWith("video/")
    ? prepared.name.split(".").pop() || "mp4"
    : "jpg";
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}.${ext}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(filePath, prepared, {
    cacheControl: "3600",
    upsert: false,
    contentType,
  });

  if (error) {
    console.error("Storage upload error:", error);
    throw friendlyUploadError(error);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

  if (!publicUrl) {
    throw new Error("Upload réussi mais URL publique introuvable.");
  }

  return publicUrl;
}

export async function deleteMedia(url: string): Promise<boolean> {
  if (!url || !url.includes(BUCKET)) return false;

  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split(`/${BUCKET}/`);
    if (pathParts.length < 2) return false;

    const filePath = decodeURIComponent(pathParts[1]);
    const { error } = await supabase.storage.from(BUCKET).remove([filePath]);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting media:", error);
    return false;
  }
}
