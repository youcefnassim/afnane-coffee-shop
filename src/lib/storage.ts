import { supabase } from "./supabase";

export async function uploadMedia(file: File, folder: string = "general"): Promise<string | null> {
  if (!file) return null;

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("afnene-media")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      if (error.message.includes("Bucket not found") || error.message.includes("relation \"storage.buckets\" does not exist")) {
        throw new Error("Le bucket 'afnene-media' n'existe pas dans Supabase. Veuillez le créer dans le Dashboard Storage et le rendre public.");
      }
      if (error.message.includes("new row violates row-level security policy")) {
         throw new Error("Erreur de permission (RLS). Vérifiez que vous êtes connecté et que les Storage Policies autorisent l'upload.");
      }
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("afnene-media")
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error: any) {
    console.error("Error uploading media:", error);
    throw new Error(error.message || "Erreur d'upload vers Supabase Storage");
  }
}

export async function deleteMedia(url: string): Promise<boolean> {
  if (!url || !url.includes("afnene-media")) return false;

  try {
    // Extract path from URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/afnene-media/");
    if (pathParts.length < 2) return false;
    
    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from("afnene-media")
      .remove([filePath]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting media:", error);
    return false;
  }
}
