import { createClient } from '@supabase/supabase-js';

// IMPORTANTE: Assicurati che questi siano l'URL e la chiave anonima del tuo progetto Supabase.
// Puoi trovarli nelle impostazioni del tuo progetto Supabase -> API.
const supabaseUrl = 'https://kqoojgrelqwjepvvzbhp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtxb29qZ3JlbHF3amVwdnZ6YmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0Mjg4MzYsImV4cCI6MjA3NTAwNDgzNn0.PtJmb2lFawUbx_iKrLxMEhkMQGW0V4_wXsnnr-ysZ6g';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("URL di Supabase o Chiave Anonima non configurati in services/supabaseClient.ts");
  alert("Configurazione di Supabase mancante. Controlla il file services/supabaseClient.ts.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);