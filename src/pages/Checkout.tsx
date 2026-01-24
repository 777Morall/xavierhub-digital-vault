import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, Mail, CreditCard, QrCode } from "lucide-react";
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

  // Criar pagamento e redirecionar
  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product || !email) return;
    
    // Gera UUID único para a transação ANTES de qualquer operação async
    const transactionId = generateUUID();
    
    setSubmitting(true);
    setError(null);
    
    console.log('=== CREATING PAYMENT ===');
    console.log('Product ID:', product.id);
    console.log('Email:', email);
    console.log('Transaction ID:', transactionId);
    
    try {
      // Cria o pagamento no backend
      const paymentData = await createPayment(product.id, email, transactionId);
      
      console.log('Payment created successfully:', paymentData);
      console.log('Redirecting to:', `/pagar/${paymentData.transaction_id}`);
      
      toast({
        title: "Pagamento criado!",
        description: "Redirecionando para o QR Code...",
      });
      
      // Redireciona IMEDIATAMENTE para a página de pagamento
      window.location.href = `/pagar/${paymentData.transaction_id}`;
      
    } catch (err) {
      console.error('=== PAYMENT ERROR ===', err);
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar pagamento";
      setError(errorMessage);
      setSubmitting(false);
      toast({
        title: "Erro ao criar pagamento",
        description: errorMessage,
        variant: "destructive",
      });
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

            {/* Checkout Form */}
            <div className="bg-card rounded-xl border border-border p-6">
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
                    disabled={submitting}
                    className="bg-secondary border-border"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Você receberá o acesso ao produto neste e-mail
                  </p>
                </div>

                {error && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                    {error}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  variant="glow" 
                  size="lg" 
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Gerando PIX...
                    </>
                  ) : (
                    <>
                      <QrCode className="h-5 w-5 mr-2" />
                      Gerar PIX
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
