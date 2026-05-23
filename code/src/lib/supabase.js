import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xelhnxinjreoudvhmnyr.supabase.co';
const supabaseAnonKey = 'sb_publishable_waTrLNSzSUOjDp7Ul-Jitg_WnM442Ll';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
