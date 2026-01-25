import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Edit, Trash2, Package, Power, Filter, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';
import { AdminLayout } from '@/components/enterprise/AdminLayout';
import { DataTable, Column } from '@/components/enterprise/DataTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getProducts,
  deleteProduct,
  toggleProductStatus,
  getProductStats,
  ProductData,
  formatCurrency,
  getStatusColor,
  parseNumber,
} from '@/lib/enterprise-api';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { StatsCard } from '@/components/enterprise/StatsCard';

function ProductsContent() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [stats, setStats] = useState<{ total: number; ativos: number; inativos: number; vendas: number; receita: number } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const result = await getProducts({
        page,
        limit: 20,
        search: search || undefined,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        sort: sortBy,
        order: sortOrder,
      });
      if (result.success && result.data) {
        setProducts(result.data.products || []);
        setPagination({
          total: result.data.pagination.total,
          pages: result.data.pagination.pages,
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({ title: 'Erro', description: 'Falha ao carregar produtos', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await getProductStats();
      if (result.success && result.data) {
        setStats({
          total: result.data.produtos.total,
          ativos: result.data.produtos.ativos,
          inativos: result.data.produtos.inativos,
          vendas: result.data.vendas.total,
          receita: result.data.vendas.receita,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, statusFilter, typeFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const result = await deleteProduct(deleteId);
      if (result.success) {
        toast({ title: 'Sucesso', description: 'Produto deletado' });
        fetchProducts();
        fetchStats();
      } else if (result.error) {
        toast({
          title: 'Erro',
          description: result.error.sales_count
            ? `Não é possível deletar produto com ${result.error.sales_count} vendas. Inative-o.`
            : result.error.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao deletar', variant: 'destructive' });
    }
    setDeleteId(null);
  };

  const handleToggleStatus = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await toggleProductStatus(id);
      if (result.success && result.status) {
        toast({
          title: 'Sucesso',
          description: `Produto ${result.status === 'active' ? 'ativado' : 'inativado'}`,
        });
        fetchProducts();
        fetchStats();
      } else if (result.error) {
        toast({ title: 'Erro', description: result.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao alterar status', variant: 'destructive' });
    }
  };

  const getProductImageUrl = (item: ProductData): string | null => {
    if (item.file_path) {
      // If it's a relative path, prepend the base URL
      if (item.file_path.startsWith('http')) return item.file_path;
      return `https://api.xavierhub.com/${item.file_path}`;
    }
    return null;
  };

  const getProductRevenue = (item: ProductData): number => {
    return parseNumber(item.receita_total);
  };

  const getProductSales = (item: ProductData): number => {
    return parseNumber(item.total_vendas);
  };

  const columns: Column<ProductData>[] = [
    {
      key: 'name',
      header: 'Produto',
      render: (item) => {
        const imageUrl = getProductImageUrl(item);
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <Package className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate max-w-[200px]">{item.name}</p>
              <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'price',
      header: 'Preço',
      render: (item) => (
        <span className="font-medium text-green-400">{formatCurrency(item.price)}</span>
      ),
    },
    {
      key: 'total_vendas',
      header: 'Vendas',
      render: (item) => (
        <div className="flex items-center gap-1">
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{getProductSales(item)}</span>
        </div>
      ),
    },
    {
      key: 'receita_total',
      header: 'Receita',
      render: (item) => (
        <span className="text-green-400">{formatCurrency(getProductRevenue(item))}</span>
      ),
    },
    {
      key: 'delivery_type',
      header: 'Entrega',
      render: (item) => (
        <Badge variant="outline" className="bg-secondary/50 capitalize">
          {item.delivery_type?.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <Badge variant="outline" className={getStatusColor(item.status)}>
          {item.status === 'active' ? 'Ativo' : item.status === 'inactive' ? 'Inativo' : item.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (item) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/enterprise/owner/products/${item.id}`);
            }}
            title="Ver detalhes"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/enterprise/owner/products/${item.id}/edit`);
            }}
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => handleToggleStatus(item.id, e)}
            title={item.status === 'active' ? 'Inativar' : 'Ativar'}
            className={item.status === 'active' ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10' : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'}
          >
            <Power className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(item.id);
            }}
            title="Deletar"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: 'w-40',
    },
  ];

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Produtos</h1>
          <p className="text-muted-foreground">Gerenciar catálogo de produtos</p>
        </div>
        <Button
          onClick={() => navigate('/enterprise/owner/products/new')}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total de Produtos"
            value={stats.total}
            icon={<Package className="h-6 w-6" />}
          />
          <StatsCard
            title="Produtos Ativos"
            value={stats.ativos}
            icon={<TrendingUp className="h-6 w-6" />}
          />
          <StatsCard
            title="Total de Vendas"
            value={stats.vendas}
            icon={<ShoppingCart className="h-6 w-6" />}
          />
          <StatsCard
            title="Receita Total"
            value={formatCurrency(stats.receita)}
            icon={<DollarSign className="h-6 w-6" />}
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary/50"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] bg-secondary/50">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] bg-secondary/50">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="ebook">E-book</SelectItem>
              <SelectItem value="curso">Curso</SelectItem>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="assinatura">Assinatura</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] bg-secondary/50">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Data criação</SelectItem>
              <SelectItem value="updated_at">Última atualização</SelectItem>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="price">Preço</SelectItem>
              <SelectItem value="sales">Vendas</SelectItem>
              <SelectItem value="revenue">Receita</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
            className="bg-secondary/50"
            title={sortOrder === 'ASC' ? 'Crescente' : 'Decrescente'}
          >
            {sortOrder === 'ASC' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={products}
        columns={columns}
        isLoading={isLoading}
        pagination={{
          page,
          pages: pagination.pages,
          total: pagination.total,
          onPageChange: setPage,
        }}
        onRowClick={(product) => navigate(`/enterprise/owner/products/${product.id}`)}
        emptyMessage="Nenhum produto encontrado"
      />

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita.
              Produtos com vendas associadas não podem ser deletados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AdminProducts() {
  return (
    <AdminLayout>
      <ProductsContent />
    </AdminLayout>
  );
}
