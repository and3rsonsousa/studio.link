import type { Session } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

// declare global {
// 	namespace NodeJS {
// 		interface ProcessEnv {
// 			SUPABASE_URL: string;
// 			SUPABASE_KEY: string;
// 		}
// 	}
// }

// if (!process.env.SUPABASE_URL) throw new Error("SUPABASE_URL is required");
// if (!process.env.SUPABASE_KEY) throw new Error("SUPABASE_KEY is required");

// export const supabaseClient = createClient(
// 	process.env.SUPABASE_URL,
// 	process.env.SUPABASE_KEY
// 	// supabaseOptions
// );

export const supabaseClient = createClient(
	"https://pivlgmzzjgsysyvmsgjy.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpdmxnbXp6amdzeXN5dm1zZ2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTMyNTM3NDUsImV4cCI6MTk2ODgyOTc0NX0.sSMLicGE_LCmu1YidlnHFqwNnNj4K2CCfJUiTHc3muA"
);

export { Session };
