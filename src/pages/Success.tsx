import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  Check, 
  Download, 
  Copy, 
  ArrowLeft, 
  Package,
  Loader2, 
  AlertCircle,
  PartyPopper,
  Mail,
  ExternalLink,
  Shield,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { checkPayment, getDownloadUrl, PaymentStatus, formatPrice } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const purchaseCode = searchParams.get("purchase_code");
  
  const [purchase, setPurchase] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (purchaseCode) {
      setPurchase({
        transaction_id: "",
        purchase_code: purchaseCode,
        license_key: "",
        payment_status: "paid",
        status: "active",
        qr_code: null,
        qr_code_base64: null,
        product: { id: 0, name: "Produto Digital", type: "software" },
        price_paid: 0,
        payment_method: "pix",
        download_count: 0,
        max_downloads: 5,
        can_download: true,
        access_expires_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setLoading(false);
    } else {
      setError("Código de compra não encontrado");
      setLoading(false);
    }
  }, [purchaseCode]);

  const handleDownload = () => {
    if (purchaseCode) {
      window.open(getDownloadUrl(purchaseCode), '_blank');
      toast({
        title: "Download Iniciado!",
        description: "Seu arquivo será baixado em instantes.",
      });
    }
  };

  const handleCopyCode = async () => {
    if (purchaseCode) {
      await navigator.clipboard.writeText(purchaseCode);
      setCopiedCode(true);
      toast({
        title: "Código Copiado!",
        description: "Guarde este código para acessar seu produto.",
      });
      setTimeout(() => setCopiedCode(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[70vh] pt-20">
          <div className="card-glass rounded-2xl p-8 text-center animate-scale-in">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !purchase) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[70vh] pt-20 px-4">
          <div className="card-glass rounded-2xl p-8 text-center max-w-md w-full animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="font-display text-xl font-bold mb-2">Compra não encontrada</h1>
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
      
      <main className="pt-14 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
            {/* Success Header */}
            <div className="card-glass rounded-2xl p-8 text-center">
              {/* Animated Success Icon */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-28 h-28 bg-primary/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                </div>
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto glow-effect">
                  <Check className="h-12 w-12 text-primary-foreground" />
                </div>
              </div>

              {/* Celebration */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <PartyPopper className="h-4 w-4" />
                <span>Pagamento Aprovado</span>
              </div>

              <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
                Compra Realizada!
              </h1>
              <p className="text-muted-foreground">
                Obrigado por comprar na XavierHub
              </p>
            </div>

            {/* Purchase Code Card */}
            <div className="card-glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Código da Compra</p>
                  <p className="font-display font-bold text-foreground">Guarde com você!</p>
                </div>
              </div>

              <div className="relative">
                <div className="p-4 pr-24 bg-secondary/50 rounded-xl font-mono text-sm text-foreground break-all">
                  {purchaseCode}
                </div>
                <Button 
                  onClick={handleCopyCode}
                  variant="outline"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {copiedCode ? (
                    <>
                      <Check className="h-4 w-4 mr-1 text-primary" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
                <Shield className="h-3 w-3" />
                Use este código para acessar seu produto a qualquer momento
              </p>
            </div>

            {/* Email Notification Card */}
            <div className="card-glass rounded-2xl p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">
                Confirmação por E-mail
              </h3>
              <p className="text-muted-foreground text-sm">
                Você receberá um e-mail com os detalhes da sua compra e instruções de acesso ao produto.
              </p>
            </div>

            {/* Action Button */}
            <Button 
              onClick={() => navigate("/meus-produtos")}
              size="lg"
              className="w-full h-14 text-base font-semibold glow-effect"
            >
              <Package className="h-5 w-5 mr-2" />
              Acessar Meus Produtos
            </Button>

            {/* Secondary Action */}
            <Button 
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full h-12"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Continuar Comprando
            </Button>

            {/* Help */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Problemas com o download?{" "}
                <a href="#contato" className="text-primary hover:underline font-medium">
                  Entre em contato
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SuccessPage;
