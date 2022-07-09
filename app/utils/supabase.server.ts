import type { Session } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			SUPABASE_URL: string;
			SUPABASE_KEY: string;
		}
	}
}

if (!process.env.SUPABASE_URL) throw new Error("SUPABASE_URL is required");
if (!process.env.SUPABASE_KEY) throw new Error("SUPABASE_KEY is required");

export const supabaseClient = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY
	// supabaseOptions
);

export { Session };
