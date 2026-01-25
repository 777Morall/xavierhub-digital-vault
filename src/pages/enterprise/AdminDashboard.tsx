import { useEffect, useState } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { AdminLayout } from '@/components/enterprise/AdminLayout';
import { StatsCard } from '@/components/enterprise/StatsCard';
import { DataTable, Column } from '@/components/enterprise/DataTable';
import {
  getDashboardStats,
  DashboardResponse,
  UltimaTransacao,
  formatCurrency,
  formatDate,
  getStatusColor,
} from '@/lib/enterprise-api';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function DashboardContent() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getDashboardStats();
        if (result.success) {
          setData(result);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const transactionColumns: Column<UltimaTransacao>[] = [
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
        <span className="font-medium text-foreground">{item.product_name}</span>
      ),
    },
    {
      key: 'username',
      header: 'Usuário',
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
        <span className="text-muted-foreground text-sm">{formatDate(item.created_at)}</span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = data?.stats;
  const graficos = data?.graficos;

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Vendas"
          value={stats?.total_vendas || 0}
          icon={<ShoppingCart className="h-6 w-6" />}
        />
        <StatsCard
          title="Receita Total"
          value={formatCurrency(stats?.receita_total || 0)}
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatsCard
          title="Usuários"
          value={stats?.total_usuarios || 0}
          icon={<Users className="h-6 w-6" />}
        />
        <StatsCard
          title="Produtos"
          value={stats?.total_produtos || 0}
          icon={<Package className="h-6 w-6" />}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Vendas Pendentes"
          value={stats?.vendas_pendentes || 0}
          icon={<Clock className="h-6 w-6" />}
        />
        <StatsCard
          title="Receita do Mês"
          value={formatCurrency(stats?.receita_mes || 0)}
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <StatsCard
          title="Vendas do Mês"
          value={stats?.vendas_mes || 0}
          icon={<ShoppingCart className="h-6 w-6" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Chart */}
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Vendas Diárias</h3>
          {graficos?.vendas_diarias && graficos.vendas_diarias.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={graficos.vendas_diarias}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="data"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="vendas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              Sem dados para exibir
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Produtos Mais Vendidos</h3>
          {graficos?.produtos_mais_vendidos && graficos.produtos_mais_vendidos.length > 0 ? (
            <div className="space-y-4">
              {graficos.produtos_mais_vendidos.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.vendas} vendas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-400">{formatCurrency(product.receita)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Sem dados para exibir
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Últimas Transações</h3>
        <DataTable
          data={data?.ultimas_transacoes || []}
          columns={transactionColumns}
          emptyMessage="Nenhuma transação recente"
        />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <DashboardContent />
    </AdminLayout>
  );
}
