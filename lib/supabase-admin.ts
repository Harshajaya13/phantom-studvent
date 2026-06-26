import { createClient } from '@supabase/supabase-js';

// Server-only Supabase client using the Service Role Key.
// This bypasses ALL Row Level Security (RLS) policies.
// NEVER import this file from a client component.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-key-for-build';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
