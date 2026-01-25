import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Filter } from 'lucide-react';
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
  getTransactions,
  CompraData,
  formatCurrency,
  formatDate,
  getStatusColor,
} from '@/lib/enterprise-api';

function TransactionsContent() {
  const [transactions, setTransactions] = useState<CompraData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const result = await getTransactions({
        page,
        limit: 20,
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      if (result.success) {
        setTransactions(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchTransactions();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const columns: Column<CompraData>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (item) => (
        <span className="font-mono text-sm text-muted-foreground">#{item.id}</span>
      ),
    },
    {
      key: 'purchase_code',
      header: 'Código',
      render: (item) => (
        <span className="font-mono text-xs bg-secondary/50 px-2 py-1 rounded">
          {item.purchase_code}
        </span>
      ),
    },
    {
      key: 'product_name',
      header: 'Produto',
      render: (item) => (
        <span className="font-medium text-foreground truncate max-w-[150px] block">
          {item.product_name}
        </span>
      ),
    },
    {
      key: 'username',
      header: 'Usuário',
      render: (item) => (
        <div>
          <p className="font-medium text-foreground">{item.username}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[150px]">{item.email}</p>
        </div>
      ),
    },
    {
      key: 'price_paid',
      header: 'Valor',
      render: (item) => (
        <span className="font-medium text-green-400">{formatCurrency(item.price_paid)}</span>
      ),
    },
    {
      key: 'payment_status',
      header: 'Status',
      render: (item) => (
        <Badge variant="outline" className={getStatusColor(item.payment_status)}>
          {item.payment_status}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Data',
      render: (item) => (
        <span className="text-sm text-muted-foreground">{formatDate(item.created_at)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (item) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/enterprise/owner/transactions/${item.id}`);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
      className: 'w-16',
    },
  ];

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transações</h1>
        <p className="text-muted-foreground">Histórico completo de transações</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar transação..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-secondary/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="paid">Pago</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="expired">Expirado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={transactions}
        columns={columns}
        isLoading={isLoading}
        pagination={{
          page,
          pages: pagination.pages,
          total: pagination.total,
          onPageChange: setPage,
        }}
        onRowClick={(tx) => navigate(`/enterprise/owner/transactions/${tx.id}`)}
      />
    </div>
  );
}

export default function AdminTransactions() {
  return (
    <AdminLayout>
      <TransactionsContent />
    </AdminLayout>
  );
}
