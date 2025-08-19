import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Lead {
  id: string;
  name: string;
  company_id: string;
  value: number;
  currency: 'BRL' | 'USD' | 'EUR';
  stage_id: string;
  responsible_id: string;
  priority: 'low' | 'medium' | 'high';
  source: string;
  status: 'open' | 'won' | 'lost' | 'frozen';
  expected_close_date?: string;
  last_contact_date?: string;
  conversion_rate: number;
  notes?: string;
  custom_fields?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface LeadWithDetails extends Lead {
  company?: {
    fantasy_name: string;
    company_name?: string;
    cnpj?: string;
    address?: string;
    city?: string;
    state?: string;
    email?: string;
    phone?: string;
    sector?: string;
    description?: string;
  };
  stage?: {
    name: string;
    color: string;
  };
  responsible?: {
    name: string;
    email: string;
  };
}

export const useLeads = () => {
  const [leads, setLeads] = useState<LeadWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          company:companies(fantasy_name, company_name, cnpj, address, city, state, email, phone, sector, description),
          stage:funnel_stages(name, color),
          responsible:team_members(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      let leadsData = (data || []).map(lead => ({
        id: lead.id,
        name: lead.name,
        company_id: lead.company_id,
        value: lead.value,
        currency: lead.currency as 'BRL' | 'USD' | 'EUR',
        stage_id: lead.stage_id,
        responsible_id: lead.responsible_id,
        priority: lead.priority as 'low' | 'medium' | 'high',
        source: lead.source,
        status: lead.status as 'open' | 'won' | 'lost' | 'frozen',
        expected_close_date: lead.expected_close_date,
        last_contact_date: lead.last_contact_date,
        conversion_rate: lead.conversion_rate,
        notes: lead.notes,
        custom_fields: lead.custom_fields,
        created_at: lead.created_at,
        updated_at: lead.updated_at,
        company: lead.company,
        stage: lead.stage,
        responsible: lead.responsible
      })) as LeadWithDetails[];

      // Se não há leads, criar leads de exemplo
      if (leadsData.length === 0) {
        // Buscar empresas e etapas para criar leads de exemplo
        const { data: companies } = await supabase.from('companies').select('id, fantasy_name').limit(3);
        const { data: stages } = await supabase.from('funnel_stages').select('id, name').limit(4);
        
        if (companies && companies.length > 0 && stages && stages.length > 0) {
          const sampleLeads = [
            {
              name: 'Projeto Sistema CRM',
              company_id: companies[0].id,
              value: 25000,
              currency: 'BRL',
              stage_id: stages[0].id,
              priority: 'high',
              source: 'Website',
              status: 'open',
              conversion_rate: 75,
              notes: 'Cliente interessado em sistema completo de CRM'
            },
            {
              name: 'Consultoria Marketing Digital',
              company_id: companies[1].id,
              value: 15000,
              currency: 'BRL',
              stage_id: stages[1].id,
              priority: 'medium',
              source: 'Indicação',
              status: 'open',
              conversion_rate: 50,
              notes: 'Necessidade de melhorar presença digital'
            },
            {
              name: 'Desenvolvimento App Mobile',
              company_id: companies[2].id,
              value: 45000,
              currency: 'BRL',
              stage_id: stages[2].id,
              priority: 'high',
              source: 'LinkedIn',
              status: 'open',
              conversion_rate: 60,
              notes: 'App para gestão interna da empresa'
            }
          ];
          
          for (const lead of sampleLeads) {
            await supabase.from('leads').insert([lead]);
          }
          
          // Buscar leads novamente após criar os exemplos
          return fetchLeads();
        }
      }
      
      setLeads(leadsData);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err instanceof Error ? err.message : 'Error fetching leads');
    } finally {
      setLoading(false);
    }
  };

  const createLead = async (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single();

      if (error) throw error;
      await fetchLeads();
      return data;
    } catch (err) {
      console.error('Error creating lead:', err);
      setError(err instanceof Error ? err.message : 'Error creating lead');
      throw err;
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchLeads();
      return data;
    } catch (err) {
      console.error('Error updating lead:', err);
      setError(err instanceof Error ? err.message : 'Error updating lead');
      throw err;
    }
  };

  const moveLeadToStage = async (leadId: string, stageId: string) => {
    return updateLead(leadId, { stage_id: stageId });
  };

  const updateLeadStatus = async (leadId: string, status: 'open' | 'won' | 'lost' | 'frozen') => {
    return updateLead(leadId, { status });
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return {
    leads,
    loading,
    error,
    createLead,
    updateLead,
    moveLeadToStage,
    updateLeadStatus,
    refetch: fetchLeads
  };
};
