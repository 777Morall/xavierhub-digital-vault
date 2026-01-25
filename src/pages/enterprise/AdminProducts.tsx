import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Edit, Trash2, Package } from 'lucide-react';
import { AdminLayout } from '@/components/enterprise/AdminLayout';
import { DataTable, Column } from '@/components/enterprise/DataTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getProducts,
  deleteProduct,
  ProductData,
  formatCurrency,
  getStatusColor,
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

function ProductsContent() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const result = await getProducts({ page, limit: 20, search: search || undefined });
      if (result.success) {
        setProducts(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

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
      }
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao deletar', variant: 'destructive' });
    }
    setDeleteId(null);
  };

  const columns: Column<ProductData>[] = [
    {
      key: 'name',
      header: 'Produto',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Package className="h-6 w-6 text-primary" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate max-w-[200px]">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.type}</p>
          </div>
        </div>
      ),
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
      render: (item) => <span className="font-medium">{item.total_vendas}</span>,
    },
    {
      key: 'receita_total',
      header: 'Receita',
      render: (item) => formatCurrency(item.receita_total),
    },
    {
      key: 'delivery_type',
      header: 'Entrega',
      render: (item) => (
        <Badge variant="outline" className="bg-secondary/50">
          {item.delivery_type}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <Badge variant="outline" className={getStatusColor(item.status)}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/enterprise/owner/products/${item.id}`);
            }}
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
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(item.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: 'w-32',
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

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-secondary/50"
        />
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
      />

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita.
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
