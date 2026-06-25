import { createClient } from '@supabase/supabase-js';

// Configuration de Supabase avec détection des variables d'environnement
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

/**
 * Client Supabase initialisé.
 * Si les clés ne sont pas configurées, les requêtes échoueront proprement
 * en indiquant au développeur ou à l'utilisateur de configurer les variables d'environnement.
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

/**
 * Vérifie si la configuration de Supabase est complète.
 */
export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey && supabaseUrl !== 'https://placeholder-project.supabase.co';
};

/**
 * EXEMPLE DE SYNCHRONISATION POUR L'ERP (À adapter selon les besoins de vos modules)
 * 
 * Cette structure montre comment synchroniser vos données locales "localStorage"
 * avec des tables relationnelles réelles dans Supabase PostgreSQL.
 */
export const SupabaseSyncService = {
  /**
   * 1. Synchroniser les clients SaaS (Tenants)
   */
  async fetchSaaSTenants() {
    if (!isSupabaseConfigured()) throw new Error("Supabase n'est pas configuré.");
    
    const { data, error } = await supabase
      .from('saas_tenants')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  async saveSaaSTenant(tenant: any) {
    if (!isSupabaseConfigured()) throw new Error("Supabase n'est pas configuré.");

    const { data, error } = await supabase
      .from('saas_tenants')
      .upsert({
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        plan_id: tenant.planId,
        status: tenant.status,
        expires_at: tenant.expiresAt,
        logo_url: tenant.logoUrl,
        primary_color: tenant.primaryColor,
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) throw error;
    return data[0];
  },

  /**
   * 2. Synchroniser les bases de données spécifiques d'un Tenant
   * L'ERP simule une base SQL locale (ka_databases). Voici comment persister les tables de production.
   */
  async saveTenantData(tenantId: string, table: string, records: any[]) {
    if (!isSupabaseConfigured()) throw new Error("Supabase n'est pas configuré.");

    // Pour un modèle multi-tenant sain, on s'assure d'inclure le 'tenant_id'
    const recordsWithTenant = records.map(record => ({
      ...record,
      tenant_id: tenantId,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from(table)
      .upsert(recordsWithTenant, { onConflict: 'id' });

    if (error) throw error;
    return true;
  },

  async fetchTenantData(tenantId: string, table: string) {
    if (!isSupabaseConfigured()) throw new Error("Supabase n'est pas configuré.");

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('tenant_id', tenantId);

    if (error) throw error;
    return data;
  },

  /**
   * 3. Logs d'audit SaaS
   */
  async logSaaSActivity(log: { action: string; details: string; ip?: string; email?: string; tenant_id?: string }) {
    if (!isSupabaseConfigured()) return; // Échoue silencieusement pour ne pas bloquer l'interface

    await supabase
      .from('saas_audit_logs')
      .insert({
        action: log.action,
        details: log.details,
        ip_address: log.ip || '127.0.0.1',
        user_email: log.email || 'system',
        tenant_id: log.tenant_id
      });
  }
};
