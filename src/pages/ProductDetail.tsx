import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, ShoppingCart, Loader2, AlertCircle, Package, Download, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProduct, Product, formatPrice, getProductTypeLabel } from "@/lib/api";

const ProductDetail = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (idOrSlug) {
      loadProduct(idOrSlug);
    }
  }, [idOrSlug]);

  const loadProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const isNumeric = /^\d+$/.test(id);
      const data = await getProduct(isNumeric ? parseInt(id) : id);
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

  // Imagem padrão baseada no tipo
  const getDefaultImage = (type: string) => {
    const images: Record<string, string> = {
      software: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop",
      ebook: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop",
      curso: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
      assinatura: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      outro: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop"
    };
    return images[type] || images.outro;
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

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h1 className="text-xl font-semibold mb-2">Produto não encontrado</h1>
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

  const imageUrl = product.image_url || product.image || getDefaultImage(product.type);
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Catálogo
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-secondary border border-border">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = getDefaultImage(product.type);
                  }}
                />
              </div>
              
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-primary/10 rounded-xl blur-2xl -z-10" />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category Badge */}
              <Badge variant="secondary" className="w-fit mb-4">
                {getProductTypeLabel(product.type)}
              </Badge>

              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-gradient">
                  {formatPrice(price)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(price * 2)}
                </span>
                <Badge className="bg-accent text-accent-foreground">
                  50% OFF
                </Badge>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-semibold text-foreground mb-2">Descrição</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
                  <Download className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Download Imediato</p>
                    <p className="text-xs text-muted-foreground">Após pagamento</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Produto Digital</p>
                    <p className="text-xs text-muted-foreground">{getProductTypeLabel(product.type)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Acesso Vitalício</p>
                    <p className="text-xs text-muted-foreground">Sem mensalidade</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Suporte Incluído</p>
                    <p className="text-xs text-muted-foreground">Tire suas dúvidas</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="glow" 
                  size="lg" 
                  className="flex-1"
                  onClick={() => navigate(`/checkout/${product.id}`)}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Comprar Agora
                </Button>
                
                {product.demo_url && (
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => window.open(product.demo_url, '_blank')}
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Ver Demonstração
                  </Button>
                )}
              </div>

              {/* Product Info */}
              <p className="text-sm text-muted-foreground mt-6">
                Entrega: <span className="text-foreground font-medium">{product.delivery_info || 'Download imediato'}</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
