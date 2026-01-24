import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Check, Download, Copy, ArrowLeft, Package, Key, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      // Buscar informações da compra via transaction_id ou usar o purchase_code
      setPurchase({
        transaction_id: "",
        purchase_code: purchaseCode,
        payment_status: "paid",
        status: "active",
        product: { id: 0, name: "Produto Digital", type: "software" },
        price_paid: 0,
        created_at: new Date().toISOString(),
        can_download: true
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
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !purchase) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h1 className="text-xl font-semibold mb-2">Compra não encontrada</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
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
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse-glow">
                  <Check className="h-12 w-12 text-green-500" />
                </div>
                <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                <span className="text-foreground">Pagamento </span>
                <span className="text-gradient">Confirmado!</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Sua compra foi realizada com sucesso. Obrigado por escolher a XavierHub!
              </p>
            </div>

            {/* Purchase Info Card */}
            <div className="bg-card rounded-xl border border-border p-6 mb-6 space-y-6">
              {/* Purchase Code */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  Código da Compra
                </label>
                <div className="flex gap-2">
                  <Input
                    value={purchaseCode || ""}
                    readOnly
                    className="bg-secondary border-border font-mono"
                  />
                  <Button 
                    variant="outline"
                    onClick={handleCopyCode}
                    className="shrink-0"
                  >
                    {copiedCode ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Guarde este código para acessar seu produto a qualquer momento
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-foreground font-medium">Pagamento Aprovado</span>
                </div>
                <span className="text-sm text-green-500 font-semibold">PIX</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="glow" 
                size="lg" 
                className="flex-1"
                onClick={handleDownload}
              >
                <Download className="h-5 w-5 mr-2" />
                Baixar Produto
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/meus-produtos")}
              >
                <Key className="h-5 w-5 mr-2" />
                Meus Produtos
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Problemas com o download?{" "}
                <a href="#contato" className="text-primary hover:underline">
                  Entre em contato conosco
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
