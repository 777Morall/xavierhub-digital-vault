import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Trash2, DollarSign } from 'lucide-react';
import { AdminLayout } from '@/components/enterprise/AdminLayout';
import { DataTable, Column } from '@/components/enterprise/DataTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getUsers,
  deleteUser,
  UserData,
  formatCurrency,
  formatDate,
  getStatusColor,
  extractPaginatedData,
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

function UsersContent() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, total_pages: 1 });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const result = await getUsers({ page, per_page: 20, search: search || undefined });
      if (result.success) {
        setUsers(extractPaginatedData(result));
        setPagination({ total: result.pagination.total, total_pages: result.pagination.total_pages });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const result = await deleteUser(deleteId);
      if (result.success) {
        toast({ title: 'Sucesso', description: 'Usuário deletado' });
        fetchUsers();
      }
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao deletar', variant: 'destructive' });
    }
    setDeleteId(null);
  };

  const columns: Column<UserData>[] = [
    {
      key: 'username',
      header: 'Usuário',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {item.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-foreground">{item.username}</p>
            <p className="text-sm text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'balance',
      header: 'Saldo',
      render: (item) => (
        <div className="flex items-center gap-1 text-green-400">
          <DollarSign className="h-4 w-4" />
          {formatCurrency(item.balance)}
        </div>
      ),
    },
    {
      key: 'total_compras',
      header: 'Compras',
      render: (item) => (
        <span className="font-medium">{item.total_compras}</span>
      ),
    },
    {
      key: 'total_gasto',
      header: 'Total Gasto',
      render: (item) => formatCurrency(item.total_gasto),
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
      key: 'created_at',
      header: 'Cadastro',
      render: (item) => (
        <span className="text-sm text-muted-foreground">{formatDate(item.created_at)}</span>
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
              navigate(`/enterprise/owner/users/${item.id}`);
            }}
          >
            <Eye className="h-4 w-4" />
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
      className: 'w-24',
    },
  ];

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
          <p className="text-muted-foreground">Gerenciar usuários do sistema</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por username ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-secondary/50"
        />
      </div>

      {/* Table */}
      <DataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        pagination={{
          page,
          pages: pagination.total_pages,
          total: pagination.total,
          onPageChange: setPage,
        }}
        onRowClick={(user) => navigate(`/enterprise/owner/users/${user.id}`)}
      />

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.
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

export default function AdminUsers() {
  return (
    <AdminLayout>
      <UsersContent />
    </AdminLayout>
  );
}
