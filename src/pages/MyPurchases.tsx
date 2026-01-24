import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Loader2, AlertCircle, Download, Package, Key, Clock, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getUserPurchases, getDownloadUrl, Purchase, formatPrice } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const MyPurchases = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getUserPurchases(email);
      setPurchases(data.purchases);
      setSearched(true);
      
      if (data.purchases.length === 0) {
        toast({
          title: "Nenhuma compra encontrada",
          description: "Não encontramos compras associadas a este e-mail.",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar compras");
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Erro ao buscar compras",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (purchaseCode: string) => {
    window.open(getDownloadUrl(purchaseCode), '_blank');
    toast({
      title: "Download Iniciado!",
      description: "Seu arquivo será baixado em instantes.",
    });
  };

  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'paid' && status === 'active') {
      return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Ativo</Badge>;
    } else if (paymentStatus === 'pending') {
      return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Pendente</Badge>;
    } else {
      return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Inativo</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                <span className="text-foreground">Meus </span>
                <span className="text-gradient">Produtos</span>
              </h1>
              <p className="text-muted-foreground">
                Acesse suas compras e faça download dos seus produtos
              </p>
            </div>

            {/* Search Form */}
            <div className="bg-card rounded-xl border border-border p-6 mb-8">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-primary" />
                    E-mail da Compra
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Digite o e-mail usado na compra"
                      required
                      className="bg-secondary border-border"
                    />
                    <Button type="submit" variant="glow" disabled={loading}>
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Buscar"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            {/* Error State */}
            {error && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-muted-foreground">{error}</p>
              </div>
            )}

            {/* Purchases List */}
            {searched && !error && (
              <div className="space-y-4">
                {purchases.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Nenhuma compra encontrada
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Não encontramos compras associadas a este e-mail.
                    </p>
                    <Button variant="outline" onClick={() => navigate("/")}>
                      Ver Produtos
                    </Button>
                  </div>
                ) : (
                  purchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Product Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground">
                              {purchase.product.name}
                            </h3>
                            {getStatusBadge(purchase.status, purchase.payment_status)}
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(purchase.created_at).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              {purchase.download_count}/{purchase.max_downloads} downloads
                            </div>
                            <div className="flex items-center gap-1">
                              <Key className="h-4 w-4" />
                              <span className="font-mono text-xs">{purchase.purchase_code}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-gradient">
                            {formatPrice(purchase.price_paid)}
                          </span>
                          
                          {purchase.can_download ? (
                            <Button 
                              variant="glow"
                              onClick={() => handleDownload(purchase.purchase_code)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Baixar
                            </Button>
                          ) : (
                            <Button variant="outline" disabled>
                              <X className="h-4 w-4 mr-2" />
                              Limite Atingido
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* License Key */}
                      {purchase.license_key && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <Label className="text-xs text-muted-foreground">Chave de Licença</Label>
                          <p className="font-mono text-sm text-foreground bg-secondary px-3 py-2 rounded mt-1">
                            {purchase.license_key}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
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
