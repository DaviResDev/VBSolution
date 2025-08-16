import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Package, 
  Search, 
  Plus, 
  ChevronDown, 
  Filter, 
  Download, 
  Upload,
  Settings,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Box,
  ShoppingCart,
  BarChart3,
  MoreHorizontal
} from 'lucide-react';
import { InventoryAdjustmentModal } from '@/components/InventoryAdjustmentModal';
import { InventoryViewModal } from '@/components/InventoryViewModal';
import { InventoryEditModal } from '@/components/InventoryEditModal';
import CreateInventoryItemModal from '@/components/inventory/CreateInventoryItemModal';
import { FileUploadModal } from '@/components/FileUploadModal';
import { CustomFieldsModal } from '@/components/CustomFieldsModal';
import { toast } from 'sonner';
import { AdvancedFilters } from '@/components/ui/advanced-filters';
import { ButtonGroup } from '@/components/ui/button-group';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCustomFieldsModal, setShowCustomFieldsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [customFields, setCustomFields] = useState<{name: string; type: string}[]>([]);
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: '1',
      name: 'Notebook Dell Inspiron 15',
      sku: 'NB-DELL-001',
      category: 'Eletrônicos',
      quantity: 15,
      minStock: 5,
      price: 2499.99,
      supplier: 'Dell Brasil',
      total: 37499.85,
      location: 'Estoque A-001',
      status: 'Em estoque',
      image_url: null
    },
    {
      id: '2',
      name: 'Mouse Logitech MX Master 3',
      sku: 'MS-LOG-002',
      category: 'Periféricos',
      quantity: 3,
      minStock: 10,
      price: 299.99,
      supplier: 'Logitech',
      total: 899.97,
      location: 'Estoque B-025',
      status: 'Estoque baixo',
      image_url: null
    },
    {
      id: '3',
      name: 'Cadeira Ergonômica Premium',
      sku: 'CD-ERG-003',
      category: 'Móveis',
      quantity: 0,
      minStock: 2,
      price: 899.99,
      supplier: 'Móveis Corporativos',
      total: 0,
      location: 'Estoque C-010',
      status: 'Sem estoque',
      image_url: null
    }
  ]);
  const navigate = useNavigate();

  const getStatusBadge = (status: string, quantity: number, minStock: number) => {
    if (quantity === 0) {
      return <Badge className="bg-gray-100 text-gray-800 border-gray-300 text-xs">Sem estoque</Badge>;
    } else if (quantity <= minStock) {
      return <Badge className="bg-gray-100 text-gray-800 border-gray-300 text-xs">Estoque baixo</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800 border-gray-300 text-xs">Em estoque</Badge>;
    }
  };

  const handleView = (item: any) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDelete = (item: any) => {
    if (window.confirm(`Tem certeza que deseja excluir o item "${item.name}"?`)) {
      setInventoryItems(prev => prev.filter(i => i.id !== item.id));
      toast.success(`Item "${item.name}" excluído com sucesso!`);
    }
  };

  const handleSaveEdit = (updatedItem: any) => {
    setInventoryItems(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const handleCreateItem = (newItemData: any) => {
    const newItem = {
      id: (inventoryItems.length + 1).toString(),
      name: newItemData.name,
      sku: `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      category: newItemData.category || 'Outros',
      quantity: newItemData.stock || 0,
      minStock: newItemData.minStock || 0,
      price: newItemData.price || 0,
      supplier: newItemData.supplier || '',
      total: (newItemData.stock || 0) * (newItemData.price || 0),
      location: 'Estoque Geral',
      status: 'Em estoque',
      image_url: newItemData.image_url || null
    };

    setInventoryItems(prev => [...prev, newItem]);
    toast.success(`Item "${newItem.name}" criado com sucesso!`);
  };

  const handleAddCustomField = (field: {name: string; type: string}) => {
    setCustomFields(prev => [...prev, field]);
    toast.success(`Campo personalizado "${field.name}" adicionado com sucesso!`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* Header compacto estilo Pipedrive */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              
              <div>
                <h1 className="text-xl font-semibold" style={{ color: '#021529' }}>Inventário</h1>
                <p className="text-sm text-gray-500">{inventoryItems.length} itens cadastrados</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setShowAdjustmentModal(true)}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 px-3"
              >
                Ajustar Estoque
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUploadModal(true)}
                className="text-gray-700 border-gray-300 h-8 px-3"
              >
                <Upload className="h-4 w-4 mr-1" />
                Importar
              </Button>
              
              <Button 
                size="sm"
                onClick={() => setShowCreateModal(true)}
                style={{ backgroundColor: '#021529' }}
                className="hover:opacity-90 text-white h-8 px-3"
              >
                <Plus className="h-4 w-4 mr-1" />
                Novo Item
              </Button>
            </div>
          </div>
        </div>

        {/* Search integrado */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Filtro e pesquisa"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300 h-9"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-700 border-gray-300 h-9 px-3"
                >
                  Mais <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg z-50">
                <DropdownMenuItem onClick={() => navigate('/sales-orders')}>
                  Pedidos de Vendas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/transfers')}>
                  Transferências
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/writeoffs')}>
                  Baixas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-700 border-gray-300 h-9 px-3"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg z-50">
                <DropdownMenuItem onClick={() => setShowCustomFieldsModal(true)}>
                  Configurar campos personalizados
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="p-6">
        {filteredItems.length === 0 && searchTerm === '' ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-medium text-gray-900 mb-4">
                Crie seu primeiro item de inventário
              </h2>
              <p className="text-gray-600 mb-8">
                Comece adicionando produtos ao seu inventário para acompanhar o estoque e as vendas.
              </p>
              
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Item
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Box className="h-4 w-4" />
                    Total de Itens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{inventoryItems.length}</div>
                  <p className="text-xs text-gray-500">produtos cadastrados</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Estoque Baixo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {inventoryItems.filter(item => item.quantity <= item.minStock && item.quantity > 0).length}
                  </div>
                  <p className="text-xs text-gray-500">Requer atenção</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Valor Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(inventoryItems.reduce((sum, item) => sum + item.total, 0))}
                  </div>
                  <p className="text-xs text-gray-500">valor do estoque</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Itens em Falta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {inventoryItems.filter(item => item.quantity === 0).length}
                  </div>
                  <p className="text-xs text-gray-500">Necessita reposição</p>
                </CardContent>
              </Card>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-700 border-gray-300'}
                  >
                    Lista
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-700 border-gray-300'}
                  >
                    Grade
                  </Button>
                </div>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-center mb-3">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium text-gray-900 text-sm mb-1">{item.name}</h3>
                        <p className="text-xs text-gray-500 font-mono">{item.sku}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Categoria:</span>
                          <Badge variant="outline" className="text-xs bg-gray-100 text-gray-800 border-gray-300">
                            {item.category}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Quantidade:</span>
                          <span className="text-sm font-medium text-gray-900">{item.quantity}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Status:</span>
                          {getStatusBadge(item.status, item.quantity, item.minStock)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Preço:</span>
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(item.price)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Total:</span>
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(item.total)}</span>
                        </div>
                        <div className="flex justify-center gap-2 mt-4 pt-2 border-t border-gray-200">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleView(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-8">
                        <input type="checkbox" className="rounded" />
                      </TableHead>
                      <TableHead className="font-medium text-gray-900">Imagem</TableHead>
                      <TableHead className="font-medium text-gray-900">Nome</TableHead>
                      <TableHead className="font-medium text-gray-900">SKU</TableHead>
                      <TableHead className="font-medium text-gray-900">Categoria</TableHead>
                      <TableHead className="font-medium text-gray-900">Quantidade</TableHead>
                      <TableHead className="font-medium text-gray-900">Status</TableHead>
                      <TableHead className="font-medium text-gray-900">Preço</TableHead>
                      <TableHead className="font-medium text-gray-900">Fornecedor</TableHead>
                      <TableHead className="font-medium text-gray-900">Total</TableHead>
                      {customFields.map((field) => (
                        <TableHead key={field.name} className="font-medium text-gray-900">
                          {field.name}
                        </TableHead>
                      ))}
                      <TableHead className="font-medium text-gray-900">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell>
                          <input type="checkbox" className="rounded" />
                        </TableCell>
                        <TableCell>
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900">{item.name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-sm text-gray-600">{item.sku}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs bg-gray-100 text-gray-800 border-gray-300">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-900">{item.quantity}</div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(item.status, item.quantity, item.minStock)}
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-600">{formatCurrency(item.price)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-600">{item.supplier}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-600">{formatCurrency(item.total)}</div>
                        </TableCell>
                        {customFields.map((field) => (
                          <TableCell key={field.name}>
                            <div className="text-gray-600">-</div>
                          </TableCell>
                        ))}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleView(item)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(item)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </>
        )}
      </div>

      <InventoryAdjustmentModal
        isOpen={showAdjustmentModal}
        onClose={() => setShowAdjustmentModal(false)}
      />

      <CreateInventoryItemModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateItem}
      />
      
      <InventoryViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        item={selectedItem}
      />

      <InventoryEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        item={selectedItem}
        onSave={handleSaveEdit}
      />
      
      <FileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />

      <CustomFieldsModal
        isOpen={showCustomFieldsModal}
        onClose={() => setShowCustomFieldsModal(false)}
        onAddField={handleAddCustomField}
      />
    </div>
  );
};

export default Inventory;
