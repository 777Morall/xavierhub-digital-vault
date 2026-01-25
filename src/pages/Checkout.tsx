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
  Clock,
  Lock,
  CreditCard,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProduct, createPayment, generateUUID, Product, formatPrice } from "@/lib/api";

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
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Carregando...</p>
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
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
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <button 
            onClick={() => navigate(`/produto/${product.id}`)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-4 group"
          >
            <div className="w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <ArrowLeft className="h-4 w-4 group-hover:text-primary transition-colors" />
            </div>
            <span>Voltar ao produto</span>
          </button>

          <div className="grid lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {/* Order Summary - Left Column */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="relative lg:sticky lg:top-20">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/40 via-primary/20 to-transparent rounded-2xl opacity-80" />
                <div className="relative bg-card/95 backdrop-blur-sm rounded-2xl p-6 border border-primary/10">
                  <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center ring-1 ring-primary/30">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                    </div>
                    Resumo do Pedido
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Product Card */}
                    <div className="relative">
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 to-transparent rounded-xl" />
                      <div className="relative flex gap-4 p-4 bg-secondary/80 rounded-xl">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shrink-0 ring-1 ring-primary/20">
                          <Zap className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">{product.name}</h3>
                          <p className="text-xs text-muted-foreground capitalize mt-1">{product.type}</p>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-2 pt-4 border-t border-border/30">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">{formatPrice(product.price)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Taxa</span>
                        <span className="text-primary font-medium">Grátis</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-4 border-t border-border/30">
                      <span className="font-display font-bold">Total</span>
                      <span className="font-display font-bold text-2xl text-gradient">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-6 p-4 rounded-xl bg-secondary/50 ring-1 ring-border/30 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-foreground/80">
                      <div className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                      </div>
                      <span>Compra 100% segura</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground/80">
                      <div className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center">
                        <Zap className="h-3 w-3 text-primary" />
                      </div>
                      <span>Entrega imediata após pagamento</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground/80">
                      <div className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center">
                        <Mail className="h-3 w-3 text-primary" />
                      </div>
                      <span>Suporte por e-mail e WhatsApp</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form - Right Column */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/30 via-transparent to-primary/20 rounded-2xl" />
                <div className="relative bg-card/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-primary/10">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h1 className="font-display text-xl md:text-2xl font-bold">
                          Finalizar Compra
                        </h1>
                        <p className="text-sm text-muted-foreground">
                          Preencha seu e-mail para receber o produto
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleCreatePayment} className="space-y-5">
                    {/* Email Input */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                        <Mail className="h-4 w-4 text-primary" />
                        E-mail
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="seuemail@exemplo.com"
                          required
                          disabled={submitting}
                          className="h-12 bg-secondary/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-xl pl-4"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Lock className="h-3 w-3" />
                        O produto será enviado para este e-mail
                      </p>
                    </div>

                    {/* Payment Method - PIX Only */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Método de Pagamento</Label>
                      <div className="relative">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/50 to-primary/30 rounded-xl" />
                        <div className="relative p-4 rounded-xl bg-card border border-primary/30 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
                            <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M15.79 6.25l-5.54 5.54c-.23.23-.23.61 0 .85l1.77 1.77c.23.23.61.23.85 0l5.54-5.54c.23-.23.23-.61 0-.85l-1.77-1.77a.6.6 0 00-.85 0zM9.88 12.16l-1.77-1.77a.6.6 0 00-.85 0l-5.54 5.54c-.23.23-.23.61 0 .85l1.77 1.77c.23.23.61.23.85 0l5.54-5.54c.23-.23.23-.61 0-.85z"/>
                              <path d="M22.28 15.93l-5.54-5.54a.6.6 0 00-.85 0l-1.77 1.77c-.23.23-.23.61 0 .85l5.54 5.54c.23.23.61.23.85 0l1.77-1.77c.23-.24.23-.62 0-.85zM8.11 6.25l-5.54 5.54c-.23.23-.23.61 0 .85l1.77 1.77c.23.23.61.23.85 0l5.54-5.54c.23-.23.23-.61 0-.85L8.96 6.25a.6.6 0 00-.85 0z"/>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">PIX</p>
                            <p className="text-xs text-muted-foreground">Aprovação instantânea • Sem taxas</p>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center ring-2 ring-primary/30">
                            <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 ring-1 ring-destructive/20">
                        <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}
                    
                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full h-14 text-base font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/35 hover:scale-[1.01] group"
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
                          <Zap className="h-4 w-4 ml-2 text-primary-foreground/70" />
                        </>
                      )}
                    </Button>

                    {/* Timer Info */}
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>O código PIX expira em 15 minutos</span>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <Shield className="h-4 w-4 text-primary/70" />
                      <span className="text-xs text-muted-foreground">Pagamento seguro e criptografado</span>
                    </div>
                  </form>
                </div>
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