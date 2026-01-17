import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hwmfzmrjyjmerotajdxg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3bWZ6bXJqeWptZXJvdGFqZHhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1ODgzODYsImV4cCI6MjA4NDE2NDM4Nn0.Le0fS89uGO_lZtkzTd-KVh3jA-OIEuhdwYhTfMmG-aQ'

export const supabase = createClient(supabaseUrl, supabaseKey)
