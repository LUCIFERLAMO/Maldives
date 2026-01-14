import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qttzfwiugjpplonuwtkk.supabase.co'
const supabaseKey = 'sb_publishable_1znnsoBAoDQiBtC7_XvDOw_o3w7o9Q0'

export const supabase = createClient(supabaseUrl, supabaseKey)
