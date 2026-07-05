import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  supabaseUrl.includes("your-project") ||
  supabaseUrl.includes("placeholder-project")
) {
  console.warn(
    "Supabase is not fully configured. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel/local environment variables."
  );
}

export const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!(url && !url.includes("your-project") && !url.includes("placeholder-project") && url.trim().length > 0);
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
