import { createClient } from '@supabase/supabase-js';

function requireEnv(value: string | undefined, name: string): string {
	if (!value) {
		throw new Error(`Missing ${name}.`);
	}

	return value;
}

const supabaseUrl = requireEnv(process.env.SUPABASE_URL_API, 'SUPABASE_URL_API');
const supabaseServiceKey = requireEnv(process.env.SUPABASE_SERVICE_ROLE_KEY, 'SUPABASE_SERVICE_ROLE_KEY');

export const supabase = createClient(supabaseUrl, supabaseServiceKey);