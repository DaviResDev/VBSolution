import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Download, Import } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLeads } from '@/hooks/useLeads';
import { useCompanies } from '@/hooks/useCompanies';
import { useFunnelStages } from '@/hooks/useFunnelStages';
import PipelineKanban from '@/components/leads/PipelineKanban';
import LeadsTopIndicators from '@/components/leads/LeadsTopIndicators';
import LeadsFiltersBar from '@/components/leads/LeadsFiltersBar';
import CreateLeadModal from '@/components/leads/CreateLeadModal';
import ImportCompaniesModal from '@/components/leads/ImportCompaniesModal';
import ActivitiesHistoryTab from '@/components/leads/ActivitiesHistoryTab';
import ReportsIndicatorsTab from '@/components/leads/ReportsIndicatorsTab';
import StageManagementModal from '@/components/leads/StageManagementModal';

const PipedriveLeadsPage = () => {
  const { leads, loading: leadsLoading, moveLeadToStage, updateLeadStatus, refetch: refetchLeads } = useLeads();
  const { companies, loading: companiesLoading } = useCompanies();
  const { stages, loading: stagesLoading, createStage } = useFunnelStages();
  
  const [activeTab, setActiveTab] = useState('pipeline');
  const [isCreateLeadModalOpen, setIsCreateLeadModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isStageManagementOpen, setIsStageManagementOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    company: '',
    responsible: '',
    stage: '',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });

  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  // Aplicar filtros
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !filters.search || 
      lead.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      (lead.company?.fantasy_name || '').toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCompany = !filters.company || lead.company_id === filters.company;
    const matchesResponsible = !filters.responsible || lead.responsible_id === filters.responsible;
    const matchesStage = !filters.stage || lead.stage_id === filters.stage;
    const matchesStatus = filters.status === 'all' || lead.status === filters.status;

    return matchesSearch && matchesCompany && matchesResponsible && matchesStage && matchesStatus;
  });

  const handleMoveToStage = async (leadId: string, stageId: string) => {
    try {
      await moveLeadToStage(leadId, stageId);
      toast({
        title: "Lead movido",
        description: "Lead movido para nova etapa com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao mover lead",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (leadId: string, status: 'open' | 'won' | 'lost' | 'frozen') => {
    try {
      await updateLeadStatus(leadId, status);
      toast({
        title: "Status atualizado",
        description: "Status do lead atualizado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive",
      });
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedLeads.length === 0) return;

    try {
      for (const leadId of selectedLeads) {
        if (action === 'won' || action === 'lost' || action === 'frozen') {
          await updateLeadStatus(leadId, action as 'won' | 'lost' | 'frozen');
        }
      }
      
      setSelectedLeads([]);
      toast({
        title: "Ação em lote concluída",
        description: `${selectedLeads.length} leads atualizados com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao executar ação em lote",
        variant: "destructive",
      });
    }
  };

  if (leadsLoading || companiesLoading || stagesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pipeline de Vendas</h1>
              <p className="text-gray-600 mt-1">
                Gerencie suas oportunidades de vendas de forma visual e eficiente
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsStageManagementOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Gerenciar Etapas
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsImportModalOpen(true)}
              >
                <Import className="h-4 w-4 mr-2" />
                Importar Empresas
              </Button>
              
              <Button
                onClick={() => setIsCreateLeadModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Lead
              </Button>
            </div>
          </div>
        </div>

        {/* Indicadores superiores */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <LeadsTopIndicators leads={filteredLeads} />
        </div>

        {/* Filtros */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <LeadsFiltersBar
            filters={filters}
            onFiltersChange={setFilters}
            companies={companies}
            stages={stages}
            selectedCount={selectedLeads.length}
            onBulkAction={handleBulkAction}
            onClearSelection={() => setSelectedLeads([])}
          />
        </div>

        {/* Conteúdo Principal */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="px-6 py-4 bg-white border-b border-gray-200">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              <TabsTrigger value="activities">Atividades</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="pipeline" className="mt-0">
              <PipelineKanban
                leads={filteredLeads}
                stages={stages}
                onMoveToStage={handleMoveToStage}
                onUpdateStatus={handleUpdateStatus}
                selectedLeads={selectedLeads}
                onSelectLead={(leadId, selected) => {
                  if (selected) {
                    setSelectedLeads(prev => [...prev, leadId]);
                  } else {
                    setSelectedLeads(prev => prev.filter(id => id !== leadId));
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="activities" className="mt-0">
              <ActivitiesHistoryTab leads={filteredLeads} />
            </TabsContent>

            <TabsContent value="reports" className="mt-0">
              <ReportsIndicatorsTab leads={filteredLeads} stages={stages} />
            </TabsContent>
          </div>
        </Tabs>

        {/* Modals */}
        <CreateLeadModal
          isOpen={isCreateLeadModalOpen}
          onClose={() => setIsCreateLeadModalOpen(false)}
          companies={companies}
          stages={stages}
          onLeadCreated={refetchLeads}
        />

        <ImportCompaniesModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
        />

        <StageManagementModal
          isOpen={isStageManagementOpen}
          onClose={() => setIsStageManagementOpen(false)}
          stages={stages}
          onStageCreated={createStage}
        />
      </div>
    </div>
  );
};

export default PipedriveLeadsPage;
