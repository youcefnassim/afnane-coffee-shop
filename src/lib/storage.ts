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

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from("afnene-media")
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading media:", error);
    return null;
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
