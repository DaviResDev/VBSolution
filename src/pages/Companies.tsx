import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useCompanies } from '@/hooks/useCompanies';
import CompaniesTable from '@/components/companies/CompaniesTable';
import ImprovedCompanyForm from '@/components/companies/ImprovedCompanyForm';
import { 
  Building2, 
  Plus, 
  Search,
  Users
} from 'lucide-react';

const Companies = () => {
  const navigate = useNavigate();
  const { companies, loading, error, createCompany, updateCompany, deleteCompany } = useCompanies();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredCompanies = (companies ?? []).filter(company => {
    const fantasy = (company.fantasy_name || company.fantasyName || '').toLowerCase();
    const corporate = (company.company_name || company.corporateName || '').toLowerCase();
    const email = (company.email || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return fantasy.includes(term) || corporate.includes(term) || email.includes(term);
  });

  const handleCreateCompany = async (formData: any) => {
    try {
      await createCompany(formData);
      setIsCreateDialogOpen(false);
      toast({
        title: "Sucesso",
        description: "Empresa cadastrada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar empresa. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCompany = async (id: string, updates: any) => {
    try {
      await updateCompany(id, updates);
      toast({
        title: "Sucesso",
        description: "Empresa atualizada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar empresa. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCompany = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a empresa "${name}"?`)) {
      try {
        await deleteCompany(id);
        toast({
          title: "Sucesso",
          description: "Empresa excluída com sucesso!",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir empresa. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando empresas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Erro ao carregar empresas: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* Header compacto estilo Pipedrive */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold" style={{ color: '#021529' }}>
                Empresas
              </h1>
              <p className="text-sm text-gray-500 mt-1">{companies.length} empresas cadastradas</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate('/suppliers')}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50 h-8 px-3"
              >
                <Users className="h-4 w-4 mr-1" />
                Fornecedores
              </Button>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm"
                    style={{ backgroundColor: '#021529' }}
                    className="hover:opacity-90 text-white h-8 px-3"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Nova Empresa
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Cadastrar Nova Empresa</DialogTitle>
                  </DialogHeader>
                  <ImprovedCompanyForm onSubmit={handleCreateCompany} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Stats Cards compactos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Empresas</p>
                <p className="text-xl font-semibold text-gray-900">{companies.length}</p>
              </div>
              <Building2 className="h-6 w-6 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Empresas Ativas</p>
                <p className="text-xl font-semibold text-gray-900">{companies.length}</p>
              </div>
              <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Setores</p>
                <p className="text-xl font-semibold text-gray-900">
                  {new Set(companies.filter(c => c.sector).map(c => c.sector)).size}
                </p>
              </div>
              <Badge className="bg-gray-100 text-gray-700 border-gray-200 text-xs">
                Diversos
              </Badge>
            </div>
          </div>
        </div>

        {/* Search integrado */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar empresas por nome, email ou setor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-gray-300 focus:border-gray-500 h-9"
              />
            </div>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">
              {filteredCompanies.length} {filteredCompanies.length === 1 ? 'empresa' : 'empresas'}
            </Badge>
          </div>
        </div>

        {/* Companies Table */}
        {filteredCompanies.length > 0 ? (
          <CompaniesTable 
            companies={filteredCompanies} 
            onDeleteCompany={handleDeleteCompany}
            onUpdateCompany={handleUpdateCompany}
          />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="text-center py-16">
              <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'Nenhuma empresa encontrada' : 'Nenhuma empresa cadastrada'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? 'Tente ajustar os termos de busca ou limpar os filtros' 
                  : 'Comece cadastrando sua primeira empresa para começar a gerenciar seus relacionamentos comerciais'
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Primeira Empresa
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
