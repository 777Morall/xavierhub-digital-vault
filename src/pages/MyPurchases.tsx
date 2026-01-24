import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Package, 
  Download, 
  AlertCircle, 
  Loader2,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ShoppingBag,
  Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getUserPurchases, formatPrice, Purchase, PurchaseUser } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const MyPurchases = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [user, setUser] = useState<PurchaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const data = await getUserPurchases(email);
      setPurchases(data.purchases || []);
      setUser(data.user || null);
      if (!data.purchases || data.purchases.length === 0) {
        toast({
          title: "Nenhuma compra encontrada",
          description: "Não encontramos compras associadas a este e-mail.",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar compras");
      toast({
        title: "Erro",
        description: "Não foi possível buscar suas compras.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (downloadUrl: string) => {
    window.open(downloadUrl, '_blank');
    toast({
      title: "Download Iniciado!",
      description: "Seu arquivo será baixado em instantes.",
    });
  };

  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'paid' && status === 'active') {
      return (
        <Badge className="bg-primary/20 text-primary border-primary/30 gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Ativo
        </Badge>
      );
    }
    if (paymentStatus === 'pending') {
      return (
        <Badge variant="outline" className="text-warning border-warning/30 gap-1">
          <Clock className="h-3 w-3" />
          Pendente
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" />
        Inativo
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 mt-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
                Meus Produtos
              </h1>
              <p className="text-muted-foreground">
                Digite seu e-mail para ver suas compras
              </p>
            </div>

            {/* Search Form */}
            <div className="card-glass rounded-2xl p-6 mb-6">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu e-mail"
                    className="h-12 pl-12 bg-secondary/50 border-border"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="h-12 px-6"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Error State */}
            {error && (
              <div className="card-glass rounded-2xl p-6 mb-6 flex items-center gap-4 border-destructive/30">
                <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Erro ao buscar</h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            )}

            {/* Results */}
            {searched && !loading && (
              <>
                {purchases.length === 0 ? (
                  <div className="card-glass rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">Nenhuma compra encontrada</h3>
                    <p className="text-muted-foreground mb-6">
                      Não encontramos compras associadas a este e-mail.
                    </p>
                    <Button onClick={() => navigate("/")} className="glow-effect">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Ver Produtos
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {purchases.length} {purchases.length === 1 ? 'compra encontrada' : 'compras encontradas'}
                    </p>
                    
                    {purchases.map((purchase) => (
                      <div 
                        key={purchase.purchase_code}
                        className="card-glass rounded-2xl p-6 card-hover"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            {purchase.product.image ? (
                              <img 
                                src={purchase.product.image} 
                                alt={purchase.product.name}
                                className="w-12 h-12 rounded-xl object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                                <Package className="h-6 w-6 text-primary" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <h3 className="font-semibold text-foreground truncate">
                                {purchase.product.name}
                              </h3>
                              <p className="text-sm text-muted-foreground capitalize">
                                {purchase.product.type}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(purchase.status, purchase.payment_status)}
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(purchase.created_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-display font-bold text-primary">
                              {formatPrice(purchase.price_paid)}
                            </span>
                          </div>
                        </div>

                        {/* Purchase Code */}
                        <div className="p-3 bg-secondary/50 rounded-lg mb-4">
                          <p className="text-xs text-muted-foreground mb-1">Código da compra</p>
                          <p className="font-mono text-sm text-foreground truncate">
                            {purchase.purchase_code}
                          </p>
                        </div>

                        {/* Download Info */}
                        {purchase.can_download && purchase.payment_status === 'paid' && purchase.download && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">
                                Downloads: {purchase.download_count}/{purchase.max_downloads}
                              </p>
                              <Button 
                                onClick={() => handleDownload(purchase.download!.url)}
                                size="sm"
                                className="glow-effect"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Baixar
                              </Button>
                            </div>
                            <div className="p-3 bg-secondary/50 rounded-lg">
                              <p className="text-xs text-muted-foreground mb-1">URL do arquivo</p>
                              <p className="font-mono text-xs text-foreground break-all">
                                {purchase.download.url}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* License Key */}
                        {purchase.license_key && (
                          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                              <Key className="h-3 w-3" />
                              Chave de Licença
                            </p>
                            <p className="font-mono text-sm text-primary">
                              {purchase.license_key}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Initial State */}
            {!searched && !loading && (
              <div className="card-glass rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">Busque suas compras</h3>
                <p className="text-muted-foreground">
                  Digite o e-mail usado na compra para ver seus produtos
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyPurchases;
