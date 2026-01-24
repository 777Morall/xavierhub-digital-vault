import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, Copy, Check, QrCode, Mail, CreditCard, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProduct, createPayment, checkPayment, Product, PaymentData, formatPrice } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type CheckoutState = 'form' | 'generating' | 'pending' | 'paid' | 'error';

const Checkout = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<CheckoutState>('form');
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [checkCount, setCheckCount] = useState(0);

  // Carregar produto
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

  // Criar pagamento
  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product || !email) return;
    
    try {
      setState('generating');
      setError(null);
      
      console.log('Creating payment for product:', product.id, 'email:', email);
      
      const paymentData = await createPayment(product.id, email);
      
      console.log('=== PAYMENT RESPONSE ===');
      console.log('Full response:', JSON.stringify(paymentData, null, 2));
      console.log('QR Code exists:', !!paymentData.qr_code);
      console.log('QR Code Base64 exists:', !!paymentData.qr_code_base64);
      
      if (!paymentData.qr_code || !paymentData.qr_code_base64) {
        throw new Error('API não retornou QR Code. Verifique a resposta da API.');
      }
      
      setPayment(paymentData);
      setState('pending');
      
      // Inicia polling
      startPolling(paymentData.transaction_id);
      
      toast({
        title: "PIX Gerado!",
        description: "Escaneie o QR Code ou copie o código para pagar.",
      });
    } catch (err) {
      console.error('=== PAYMENT ERROR ===', err);
      setState('error');
      const errorMessage = err instanceof Error ? err.message : "Erro ao gerar PIX";
      setError(errorMessage);
      toast({
        title: "Erro ao gerar PIX",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Polling para verificar pagamento
  const startPolling = useCallback((transactionId: string) => {
    let attempts = 0;
    const maxAttempts = 180; // 15 minutos (5s * 180)
    
    const interval = setInterval(async () => {
      attempts++;
      setCheckCount(attempts);
      
      try {
        const status = await checkPayment(transactionId);
        
        if (status.payment_status === 'paid') {
          setState('paid');
          clearInterval(interval);
          
          toast({
            title: "Pagamento Confirmado! 🎉",
            description: "Redirecionando para download...",
          });
          
          // Redireciona após 2 segundos
          setTimeout(() => {
            navigate(`/sucesso?purchase_code=${status.purchase_code}`);
          }, 2000);
        } else if (status.payment_status === 'expired' || status.payment_status === 'cancelled') {
          setState('error');
          setError(`Pagamento ${status.payment_status === 'expired' ? 'expirado' : 'cancelado'}. Gere um novo PIX.`);
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Erro ao verificar pagamento:', err);
      }
      
      // Para após 15 minutos
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setState('error');
        setError("Tempo limite excedido. Gere um novo PIX.");
      }
    }, 5000);
    
    // Cleanup
    return () => clearInterval(interval);
  }, [navigate]);

  // Copiar código PIX
  const handleCopyCode = async () => {
    if (payment?.qr_code) {
      await navigator.clipboard.writeText(payment.qr_code);
      setCopied(true);
      toast({
        title: "Código Copiado!",
        description: "Cole no app do seu banco para pagar.",
      });
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Tentar novamente
  const handleRetry = () => {
    setState('form');
    setPayment(null);
    setError(null);
    setCheckCount(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h1 className="text-xl font-semibold mb-2">Produto não encontrado</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Catálogo
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate(`/produto/${product.id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Produto
          </Button>

          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold mb-2">
                <span className="text-foreground">Finalizar </span>
                <span className="text-gradient">Compra</span>
              </h1>
              <p className="text-muted-foreground">Pagamento via PIX - Aprovação Instantânea</p>
            </div>

            {/* Order Summary */}
            <div className="bg-card rounded-xl border border-border p-6 mb-6">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Resumo do Pedido
              </h2>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.type}</p>
                </div>
                <p className="text-2xl font-bold text-gradient">{formatPrice(product.price)}</p>
              </div>
            </div>

            {/* Checkout Form / Payment Display */}
            <div className="bg-card rounded-xl border border-border p-6">
              {/* Form State */}
              {state === 'form' && (
                <form onSubmit={handleCreatePayment} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Seu E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="bg-secondary border-border"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Você receberá o acesso ao produto neste e-mail
                    </p>
                  </div>
                  
                  <Button type="submit" variant="glow" size="lg" className="w-full">
                    <QrCode className="h-5 w-5 mr-2" />
                    Gerar PIX
                  </Button>
                </form>
              )}

              {/* Generating State */}
              {state === 'generating' && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-foreground font-medium">Gerando código PIX...</p>
                </div>
              )}

              {/* Pending State - Show QR Code */}
              {state === 'pending' && payment && (
                <div className="space-y-6">
                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-xl">
                      <img 
                        src={payment.qr_code_base64} 
                        alt="QR Code PIX" 
                        className="w-64 h-64"
                      />
                    </div>
                  </div>

                  {/* PIX Code */}
                  <div>
                    <Label className="mb-2 block">Código PIX (Copia e Cola)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={payment.qr_code}
                        readOnly
                        className="bg-secondary border-border font-mono text-xs"
                      />
                      <Button 
                        variant="outline"
                        onClick={handleCopyCode}
                        className="shrink-0"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <div className="text-center">
                      <p className="text-foreground font-medium">Aguardando Pagamento...</p>
                      <p className="text-xs text-muted-foreground">
                        Verificação #{checkCount} • Atualiza automaticamente
                      </p>
                    </div>
                  </div>

                  <p className="text-center text-sm text-muted-foreground">
                    Escaneie o QR Code com o app do seu banco ou copie o código acima
                  </p>
                </div>
              )}

              {/* Paid State */}
              {state === 'paid' && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <Check className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Pagamento Confirmado!</h3>
                  <p className="text-muted-foreground mb-4">Redirecionando para download...</p>
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              {/* Error State */}
              {state === 'error' && (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Erro no Pagamento</h3>
                  <p className="text-muted-foreground text-center mb-6">{error}</p>
                  <Button variant="outline" onClick={handleRetry}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tentar Novamente
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
