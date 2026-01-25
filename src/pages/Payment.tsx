import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  Copy, 
  Check, 
  RefreshCw, 
  Clock,
  QrCode,
  ShoppingBag,
  Smartphone,
  Shield,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { checkPayment, formatPrice } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface PaymentData {
  transaction_id: string;
  purchase_code: string;
  license_key: string;
  payment_status: 'pending' | 'paid' | 'cancelled' | 'expired';
  status: string;
  qr_code: string | null;
  qr_code_base64: string | null;
  qr_code_expires_at?: string;
  qr_code_expired?: boolean;
  product: {
    id: number;
    name: string;
    type: string;
    image?: string;
  };
  price_paid: number;
  payment_method: string;
  download_count: number;
  max_downloads: number;
  can_download: boolean;
  access_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

type PaymentState = 'loading' | 'pending' | 'paid' | 'expired' | 'error';

const Payment = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [state, setState] = useState<PaymentState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const loadPayment = useCallback(async () => {
    if (!transactionId) {
      setState('error');
      setError('ID da transação não encontrado');
      return;
    }

    try {
      const data = await checkPayment(transactionId);
      
      setPayment(data as unknown as PaymentData);
      
      if (data.payment_status === 'paid') {
        setState('paid');
        toast({
          title: "Pagamento Confirmado! 🎉",
          description: "Redirecionando para download...",
        });
        setTimeout(() => {
          navigate(`/sucesso?purchase_code=${data.purchase_code}`);
        }, 2000);
      } else if (data.payment_status === 'expired' || data.payment_status === 'cancelled') {
        setState('expired');
        setError('Este pagamento expirou ou foi cancelado.');
      } else {
        setState('pending');
        // Calculate time left
        if (data.qr_code_expires_at) {
          const expiresAt = new Date(data.qr_code_expires_at).getTime();
          const now = Date.now();
          setTimeLeft(Math.max(0, Math.floor((expiresAt - now) / 1000)));
        }
      }
    } catch (err) {
      console.error('Error loading payment:', err);
      setState('error');
      setError(err instanceof Error ? err.message : 'Erro ao carregar pagamento');
    }
  }, [transactionId, navigate]);

  useEffect(() => {
    loadPayment();
  }, [loadPayment]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || state !== 'pending') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, state]);

  // Polling for payment status
  useEffect(() => {
    if (state !== 'pending' || !transactionId) return;

    const interval = setInterval(async () => {
      setCheckCount(prev => prev + 1);
      
      try {
        const data = await checkPayment(transactionId);
        
        if (data.payment_status === 'paid') {
          setState('paid');
          clearInterval(interval);
          
          toast({
            title: "Pagamento Confirmado! 🎉",
            description: "Redirecionando para download...",
          });
          
          setTimeout(() => {
            navigate(`/sucesso?purchase_code=${data.purchase_code}`);
          }, 2000);
        } else if (data.payment_status === 'expired' || data.payment_status === 'cancelled') {
          setState('expired');
          setError('Este pagamento expirou ou foi cancelado.');
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Erro ao verificar pagamento:', err);
      }
    }, 5000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setState('expired');
      setError('Tempo limite excedido. Gere um novo pagamento.');
    }, 15 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [state, transactionId, navigate]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading State
  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[70vh] pt-20">
          <div className="card-glass rounded-2xl p-8 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <p className="text-muted-foreground">Carregando pagamento...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error State
  if (state === 'error' || !payment) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[70vh] pt-20 px-4">
          <div className="card-glass rounded-2xl p-8 text-center max-w-md w-full animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="font-display text-xl font-bold mb-2">Erro ao carregar pagamento</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
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
          <div className="max-w-lg mx-auto">
            {/* Pending Payment */}
            {state === 'pending' && (
              <div className="space-y-6 animate-fade-in">
                {/* Header Card */}
                <div className="relative">
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/50 via-primary/20 to-transparent rounded-2xl" />
                  <div className="relative bg-card/95 backdrop-blur-sm rounded-2xl p-6 text-center border border-primary/10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 ring-1 ring-primary/20">
                      <Clock className="h-4 w-4" />
                      {timeLeft !== null && timeLeft > 0 ? (
                        <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                      ) : (
                        <span>Aguardando pagamento</span>
                      )}
                    </div>
                    <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
                      Pague com PIX
                    </h1>
                    <p className="text-muted-foreground">
                      Escaneie o QR Code ou copie o código
                    </p>
                  </div>
                </div>

                {/* Product Summary */}
                <div className="relative">
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 to-transparent rounded-xl" />
                  <div className="relative bg-card/95 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 border border-primary/10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shrink-0 ring-1 ring-primary/20">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{payment.product.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{payment.product.type}</p>
                    </div>
                    <span className="font-display font-bold text-lg text-gradient">
                      {formatPrice(payment.price_paid)}
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                {payment.qr_code && payment.qr_code_base64 ? (
                  <div className="relative">
                    <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/40 via-transparent to-primary/30 rounded-2xl" />
                    <div className="relative bg-card/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-primary/10">
                      {/* QR Code Image */}
                      <div className="flex justify-center mb-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
                          <div className="relative bg-white p-4 rounded-2xl shadow-2xl ring-4 ring-primary/20">
                            <img 
                              src={payment.qr_code_base64} 
                              alt="QR Code PIX" 
                              className="w-48 h-48 md:w-56 md:h-56"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="flex items-center justify-center gap-3 mb-6 p-3 rounded-xl bg-secondary/50 ring-1 ring-border/30">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <p className="text-sm text-foreground/80">
                          Abra o app do seu banco e escaneie o código
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                        <span className="text-xs text-muted-foreground uppercase font-medium">ou copie o código</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                      </div>

                      {/* Copy Code */}
                      <div className="space-y-3">
                        <div className="relative">
                          <div className="p-4 pr-28 bg-secondary/70 rounded-xl font-mono text-xs text-muted-foreground break-all max-h-20 overflow-y-auto ring-1 ring-border/30">
                            {payment.qr_code}
                          </div>
                          <Button 
                            onClick={handleCopyCode}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 shadow-lg"
                            size="sm"
                          >
                            {copied ? (
                              <>
                                <Check className="h-4 w-4 mr-1.5" />
                                Copiado!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-1.5" />
                                Copiar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Modern Status Indicator */}
                      <div className="mt-6 relative">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/40 to-primary/20 rounded-xl animate-pulse" />
                        <div className="relative p-4 rounded-xl bg-card border border-primary/20 flex items-center gap-4">
                          {/* Animated Status Indicator */}
                          <div className="relative flex items-center justify-center w-12 h-12">
                            <div className="absolute w-12 h-12 rounded-full border-2 border-primary/30 animate-ping" />
                            <div className="absolute w-10 h-10 rounded-full border-2 border-primary/50 animate-pulse" />
                            <div className="relative w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
                              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-foreground">Verificando pagamento...</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                Verificação #{checkCount}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center">
                            <RefreshCw className="h-5 w-5 text-primary animate-spin" />
                            <span className="text-[10px] text-muted-foreground mt-1">Auto</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute -inset-[1px] bg-gradient-to-br from-yellow-500/30 to-transparent rounded-2xl" />
                    <div className="relative bg-card/95 backdrop-blur-sm rounded-2xl p-8 text-center border border-yellow-500/20">
                      <div className="w-16 h-16 rounded-xl bg-yellow-500/20 flex items-center justify-center mx-auto mb-4 ring-2 ring-yellow-500/30">
                        <QrCode className="h-8 w-8 text-yellow-500" />
                      </div>
                      <h3 className="font-display text-xl font-bold mb-2">QR Code não disponível</h3>
                      <p className="text-muted-foreground mb-6">
                        Não foi possível carregar o QR Code. Tente novamente.
                      </p>
                      <Button onClick={loadPayment} variant="outline" className="w-full">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Recarregar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-secondary/30 ring-1 ring-border/30">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground/80">Pagamento 100% seguro via PIX</span>
                </div>
              </div>
            )}

            {/* Paid State */}
            {state === 'paid' && (
              <div className="relative animate-scale-in">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-green-500/50 via-primary/30 to-green-500/40 rounded-2xl" />
                <div className="relative bg-card/95 backdrop-blur-sm rounded-2xl p-8 text-center border border-green-500/20">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-28 h-28 bg-green-500/20 rounded-full animate-ping" />
                    </div>
                    <div className="relative w-20 h-20 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto ring-4 ring-green-500/30">
                      <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                  </div>
                  <h2 className="font-display text-2xl font-bold mb-2 text-green-400">Pagamento Confirmado!</h2>
                  <p className="text-muted-foreground mb-6">Redirecionando para o download...</p>
                  <div className="flex justify-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Expired State */}
            {state === 'expired' && (
              <div className="relative animate-scale-in">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-destructive/40 to-transparent rounded-2xl" />
                <div className="relative bg-card/95 backdrop-blur-sm rounded-2xl p-8 text-center border border-destructive/20">
                  <div className="w-16 h-16 rounded-xl bg-destructive/20 flex items-center justify-center mx-auto mb-4 ring-2 ring-destructive/30">
                    <Clock className="h-8 w-8 text-destructive" />
                  </div>
                  <h2 className="font-display text-xl font-bold mb-2">Pagamento Expirado</h2>
                  <p className="text-muted-foreground mb-6">{error}</p>
                  <Button onClick={() => navigate("/")} className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar ao Catálogo
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payment;
