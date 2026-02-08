export type GlobalConfig = {
  serverURL: string;
  supabaseURL: string;
  supabaseAnonKey: string;
};

export const globalCONFIG: GlobalConfig = {
  serverURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  supabaseURL: import.meta.env.VITE_SUPABASE_URL || "",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
};
