import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://ieimdmzgrqlnirumnfxe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaW1kbXpncnFsbmlydW1uZnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NzIyNDMsImV4cCI6MjA3NjU0ODI0M30.OyJQAWniXFEt-hAI_dnEeolZR1czk3ezgDv4Mz1gqWI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
