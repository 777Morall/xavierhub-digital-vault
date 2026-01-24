import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  Mail, 
  ShoppingBag,
  QrCode,
  Shield,
  Zap,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProduct, createPayment, generateUUID, Product, formatPrice } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const Checkout = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      loadProduct(parseInt(productId));
    }
  }, [productId]);

  const loadProduct = async (id: number) => {
    try {
      setLoading(true);
      const data = await getProduct(id);
      if (!data) {
        setError("Produto não encontrado");
      } else {
        setProduct(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar produto");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product || !email) return;
    
    const transactionId = generateUUID();
    
    setSubmitting(true);
    setError(null);
    
    createPayment(product.id, email, transactionId)
      .then((paymentData) => {
        const tx = paymentData?.transaction_id || transactionId;
        navigate(`/pagar/${tx}`);
      })
      .catch(() => {
        navigate(`/pagar/${transactionId}`);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20 px-4">
          <div className="card-glass rounded-2xl p-8 text-center max-w-md w-full animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-xl font-display font-bold mb-2">Produto não encontrado</h1>
            <p className="text-muted-foreground mb-6">O produto que você procura não existe ou foi removido.</p>
            <Button onClick={() => navigate("/")} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Catálogo
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <button 
            onClick={() => navigate(`/produto/${product.id}`)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 mt-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Voltar ao produto</span>
          </button>

          <div className="grid lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {/* Order Summary - Left Column */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="card-glass rounded-2xl p-6 sticky top-24">
                <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  Resumo do Pedido
                </h2>
                
                <div className="space-y-4">
                  {/* Product Card */}
                  <div className="flex gap-4 p-4 bg-secondary/50 rounded-xl">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                      <Zap className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{product.type}</p>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">{formatPrice(product.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Desconto PIX</span>
                      <span className="text-primary">-R$ 0,00</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="font-display font-bold text-lg">Total</span>
                    <span className="font-display font-bold text-2xl text-primary">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                    <Shield className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-xs text-muted-foreground">Compra Segura</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                    <Zap className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-xs text-muted-foreground">Entrega Imediata</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form - Right Column */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="card-glass rounded-2xl p-6 md:p-8">
                {/* Header */}
                <div className="mb-8">
                  <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
                    Finalizar Compra
                  </h1>
                  <p className="text-muted-foreground">
                    Preencha seus dados para gerar o PIX
                  </p>
                </div>

                <form onSubmit={handleCreatePayment} className="space-y-6">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-4 w-4 text-primary" />
                      E-mail para receber o produto
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      required
                      disabled={submitting}
                      className="h-12 bg-secondary/50 border-border focus:border-primary transition-colors"
                    />
                    <p className="text-xs text-muted-foreground">
                      Você receberá o acesso ao produto neste e-mail após a confirmação
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Método de Pagamento</Label>
                    <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <QrCode className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">PIX</p>
                        <p className="text-sm text-muted-foreground">Aprovação instantânea</p>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-background" />
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                      <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}
                  
                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-14 text-base font-semibold glow-effect"
                    disabled={submitting || !email}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Gerando PIX...
                      </>
                    ) : (
                      <>
                        <QrCode className="h-5 w-5 mr-2" />
                        Gerar QR Code PIX
                      </>
                    )}
                  </Button>

                  {/* Timer Info */}
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>O código PIX expira em 15 minutos</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
