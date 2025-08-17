
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, Search, MoreVertical, Settings, BarChart3 } from 'lucide-react';
import { CreateDealModal } from '@/components/CreateDealModal';
import { CreatePipelineModal } from '@/components/CreatePipelineModal';
import PipelineSelector from '@/components/leads/PipelineSelector';
import MinimalistLeadCard from '@/components/leads/MinimalistLeadCard';
import LeadExpandedModal from '@/components/leads/LeadExpandedModal';
import StandardLeadsFilters from '@/components/leads/StandardLeadsFilters';
import { useLeads } from '@/hooks/useLeads';
import { useFunnelStages } from '@/hooks/useFunnelStages';
import { useProducts } from '@/hooks/useProducts';

const LeadsSales = () => {
  const navigate = useNavigate();
  const [showCreateDeal, setShowCreateDeal] = useState(false);
  const [showCreatePipeline, setShowCreatePipeline] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState('default');
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  
  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');

  const { leads, loading: leadsLoading } = useLeads();
  const { stages, loading: stagesLoading } = useFunnelStages();
  const { products, loading: productsLoading } = useProducts();

  // Mock pipelines data - replace with actual data from your backend
  const pipelines = [
    { id: 'default', name: 'Pipeline Principal', description: 'Pipeline padrão de vendas' },
    { id: 'enterprise', name: 'Empresas', description: 'Pipeline para grandes empresas' },
    { id: 'retail', name: 'Varejo', description: 'Pipeline para varejo' }
  ];

  const funnelStages = [
    {
      id: 'leads',
      title: 'Leads',
      count: 24,
      value: 'R$ 120.000',
      color: 'bg-gray-600',
      deals: [
        { id: '1', title: 'Empresa ABC', value: 'R$ 15.000', contact: 'João Silva', company: 'ABC Corp', date: '2024-01-15' },
        { id: '2', title: 'Tech Solutions', value: 'R$ 25.000', contact: 'Maria Santos', company: 'Tech Inc', date: '2024-01-16' },
        { id: '3', title: 'Inovação Digital', value: 'R$ 8.500', contact: 'Pedro Lima', company: 'Digital Co', date: '2024-01-17' }
      ]
    },
    {
      id: 'qualified',
      title: 'Qualificados',
      count: 18,
      value: 'R$ 85.000',
      color: 'bg-gray-600',
      deals: [
        { id: '4', title: 'Startup XYZ', value: 'R$ 12.000', contact: 'Ana Costa', company: 'XYZ Ltd', date: '2024-01-18' },
        { id: '5', title: 'Consultoria Prime', value: 'R$ 18.000', contact: 'Carlos Oliveira', company: 'Prime Co', date: '2024-01-19' }
      ]
    },
    {
      id: 'proposal',
      title: 'Proposta',
      count: 12,
      value: 'R$ 65.000',
      color: 'bg-gray-600',
      deals: [
        { id: '6', title: 'Global Corp', value: 'R$ 30.000', contact: 'Lucia Ferreira', company: 'Global Inc', date: '2024-01-20' },
        { id: '7', title: 'Future Tech', value: 'R$ 22.000', contact: 'Roberto Alves', company: 'Future Co', date: '2024-01-21' }
      ]
    },
    {
      id: 'negotiation',
      title: 'Negociação',
      count: 8,
      value: 'R$ 45.000',
      color: 'bg-gray-600',
      deals: [
        { id: '8', title: 'MegaCorp Ltd', value: 'R$ 35.000', contact: 'Fernanda Rocha', company: 'Mega Corp', date: '2024-01-22' }
      ]
    },
    {
      id: 'closed',
      title: 'Fechado',
      count: 15,
      value: 'R$ 125.000',
      color: 'bg-gray-600',
      deals: [
        { id: '9', title: 'Success Co.', value: 'R$ 28.000', contact: 'Ricardo Mendes', company: 'Success Inc', date: '2024-01-23' },
        { id: '10', title: 'Winner Inc', value: 'R$ 45.000', contact: 'Julia Torres', company: 'Winner Co', date: '2024-01-24' }
      ]
    }
  ];

  // Filtrar leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchQuery || 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.company?.fantasy_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    const matchesStage = stageFilter === 'all' || lead.stage_id === stageFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesStage;
  });

  const handleLeadClick = (leadId: string) => {
    setExpandedLead(leadId);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setStageFilter('all');
  };

  const selectedLeadData = expandedLead ? leads.find(lead => lead.id === expandedLead) : null;

  if (leadsLoading || stagesLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Pipeline de Vendas
            </h1>
            <p className="text-gray-600 mt-1">Gerencie seus leads e oportunidades de vendas</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="border-gray-300 hover:bg-gray-50"
              onClick={() => navigate('/reports-dashboard')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-300 hover:bg-gray-50"
              onClick={() => setShowCreatePipeline(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Pipelines
            </Button>
            <Button 
              className="bg-gray-900 hover:bg-gray-800 text-white"
              onClick={() => setShowCreateDeal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Lead
            </Button>
          </div>
        </div>

        {/* Pipeline Selector */}
        <PipelineSelector
          pipelines={pipelines}
          selectedPipeline={selectedPipeline}
          onPipelineChange={setSelectedPipeline}
          onCreatePipeline={() => setShowCreatePipeline(true)}
          onManagePipelines={() => setShowCreatePipeline(true)}
        />

        {/* Filtros Padrão */}
        <StandardLeadsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          stageFilter={stageFilter}
          onStageChange={setStageFilter}
          onClearFilters={handleClearFilters}
          stages={stages}
        />



        {/* Pipeline Kanban */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Pipeline: {pipelines.find(p => p.id === selectedPipeline)?.name}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="flex gap-6 overflow-x-auto pb-4">
              {funnelStages.map((stage) => (
                <div key={stage.id} className="flex-shrink-0 w-80">
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    {/* Stage Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${stage.color}`}></div>
                        <h3 className="font-semibold text-gray-900">{stage.title}</h3>
                        <Badge variant="outline" className="bg-white text-gray-700 border border-gray-200">
                          {stage.count}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>

                    {/* Stage Value */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-sm text-gray-600">Valor Total</p>
                      <p className="font-bold text-lg text-gray-900">{stage.value}</p>
                    </div>

                    {/* Minimalist Lead Cards */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {stage.deals.map((deal) => {
                        // Mock lead data for minimalist card
                        const mockLead = {
                          id: deal.id,
                          name: deal.title,
                          value: parseFloat(deal.value.replace('R$ ', '').replace('.', '')),
                          currency: 'BRL',
                          conversion_rate: Math.floor(Math.random() * 100),
                          priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
                          status: 'open',
                          created_at: deal.date,
                          company: {
                            fantasy_name: deal.company,
                            phone: '(11) 99999-9999',
                            email: 'contato@empresa.com'
                          },
                          responsible: {
                            name: deal.contact
                          },
                          expected_close_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                          source: ['Website', 'LinkedIn', 'Indicação'][Math.floor(Math.random() * 3)]
                        } as any;

                        return (
                          <MinimalistLeadCard
                            key={deal.id}
                            lead={mockLead}
                            onCardClick={handleLeadClick}
                          />
                        );
                      })}
                      
                      <Button
                        variant="ghost"
                        className="w-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 py-8 rounded-lg"
                        onClick={() => setShowCreateDeal(true)}
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Adicionar Lead
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CreateDealModal 
        open={showCreateDeal} 
        onClose={() => setShowCreateDeal(false)} 
      />
      
      <CreatePipelineModal 
        open={showCreatePipeline} 
        onClose={() => setShowCreatePipeline(false)}
        onPipelineCreated={(pipeline) => {
          setSelectedPipeline(pipeline.name);
          setShowCreatePipeline(false);
        }}
      />

      <LeadExpandedModal
        lead={selectedLeadData}
        isOpen={!!expandedLead}
        onClose={() => setExpandedLead(null)}
        onEdit={() => {}}
      />
    </div>
  );
};

export default LeadsSales;
