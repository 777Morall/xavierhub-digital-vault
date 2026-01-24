import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, Copy, Check, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  // Carregar dados do pagamento
  const loadPayment = useCallback(async () => {
    if (!transactionId) {
      setState('error');
      setError('ID da transação não encontrado');
      return;
    }

    try {
      console.log('=== LOADING PAYMENT ===');
      console.log('Transaction ID:', transactionId);
      
      const data = await checkPayment(transactionId);
      
      console.log('Payment data received:', JSON.stringify(data, null, 2));
      console.log('QR Code exists:', !!data.qr_code);
      console.log('QR Code Base64 exists:', !!data.qr_code_base64);
      
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
      }
    } catch (err) {
      console.error('Error loading payment:', err);
      setState('error');
      setError(err instanceof Error ? err.message : 'Erro ao carregar pagamento');
    }
  }, [transactionId, navigate]);

  // Carregar dados iniciais
  useEffect(() => {
    loadPayment();
  }, [loadPayment]);

  // Polling para verificar status
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

    // Cleanup e timeout de 15 minutos
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

  // Loading
  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Carregando pagamento...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Error
  if (state === 'error' || !payment) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h1 className="text-xl font-semibold mb-2">Erro ao carregar pagamento</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
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
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold mb-2">
                <span className="text-foreground">Pagamento </span>
                <span className="text-gradient">PIX</span>
              </h1>
              <p className="text-muted-foreground">
                {state === 'pending' && 'Escaneie o QR Code ou copie o código para pagar'}
                {state === 'paid' && 'Pagamento confirmado!'}
                {state === 'expired' && 'Pagamento expirado'}
              </p>
            </div>

            {/* Product Info */}
            <div className="bg-card rounded-xl border border-border p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">{payment.product.name}</p>
                  <p className="text-sm text-muted-foreground">{payment.product.type}</p>
                </div>
                <p className="text-2xl font-bold text-gradient">{formatPrice(payment.price_paid)}</p>
              </div>
            </div>

            {/* Payment Area */}
            <div className="bg-card rounded-xl border border-border p-6">
              {/* Pending - Show QR Code */}
              {state === 'pending' && payment.qr_code && payment.qr_code_base64 && (
                <div className="space-y-6">
                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                      <img 
                        src={payment.qr_code_base64} 
                        alt="QR Code PIX" 
                        className="w-64 h-64"
                      />
                    </div>
                  </div>

                  {/* Expiration Timer */}
                  {payment.qr_code_expires_at && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Expira em: {new Date(payment.qr_code_expires_at).toLocaleTimeString('pt-BR')}</span>
                    </div>
                  )}

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

              {/* Pending but no QR Code data */}
              {state === 'pending' && (!payment.qr_code || !payment.qr_code_base64) && (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">QR Code não disponível</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Não foi possível carregar o QR Code. Tente novamente.
                  </p>
                  <Button variant="outline" onClick={loadPayment}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Recarregar
                  </Button>
                </div>
              )}

              {/* Paid */}
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

              {/* Expired */}
              {state === 'expired' && (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Pagamento Expirado</h3>
                  <p className="text-muted-foreground text-center mb-6">{error}</p>
                  <Button variant="outline" onClick={() => navigate("/")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar ao Catálogo
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

export default Payment;
