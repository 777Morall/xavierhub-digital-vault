import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ExternalLink, 
  ShoppingCart, 
  Loader2, 
  AlertCircle, 
  Package, 
  Download, 
  Clock, 
  Shield,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  Zap
} from "lucide-react";
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
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

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

  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Carregando produto...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="card-glass rounded-2xl p-8 text-center max-w-md w-full animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-xl font-display font-bold mb-2">Produto não encontrado</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Catálogo
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const imageUrl = product.image_url || product.image || getDefaultImage(product.type);
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const description = product.description || "";
  const isLongDescription = description.length > 120;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Voltar</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary border border-border/50 shadow-xl">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = getDefaultImage(product.type);
                  }}
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>
              
              {/* Glow Effect */}
              <div className="absolute -inset-6 bg-primary/15 rounded-3xl blur-3xl -z-10" />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="gap-1.5">
                  <Package className="h-3 w-3" />
                  {getProductTypeLabel(product.type)}
                </Badge>
                <Badge className="bg-accent/20 text-accent-foreground border-accent/30 gap-1">
                  <Sparkles className="h-3 w-3" />
                  Destaque
                </Badge>
              </div>

              {/* Title */}
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Price Section */}
              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(price * 2)}
                  </span>
                  <span className="text-3xl md:text-4xl font-bold text-gradient">
                    {formatPrice(price)}
                  </span>
                </div>
                <Badge className="bg-primary text-primary-foreground">
                  50% OFF
                </Badge>
              </div>

              {/* Description - Expandable */}
              {description && (
                <div className="mb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {descriptionExpanded ? description : truncateDescription(description)}
                  </p>
                  {isLongDescription && (
                    <button
                      onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                      className="flex items-center gap-1 text-primary text-sm font-medium mt-2 hover:underline"
                    >
                      {descriptionExpanded ? (
                        <>
                          Ver menos
                          <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Ver mais
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Quick Features */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Download Imediato</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Acesso Vitalício</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Suporte Incluído</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Atualizações Grátis</span>
                </div>
              </div>

              {/* CTA Button - Premium Style */}
              <Button 
                size="xl"
                className="w-full h-16 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] group"
                onClick={() => navigate(`/checkout/${product.id}`)}
              >
                <ShoppingCart className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                Comprar Agora
                <Zap className="h-4 w-4 ml-2 text-primary-foreground/70" />
              </Button>
              
              {product.demo_url && (
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full mt-3"
                  onClick={() => window.open(product.demo_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Demonstração
                </Button>
              )}

              {/* Delivery Info */}
              <p className="text-xs text-muted-foreground mt-4 text-center">
                ⚡ Entrega: <span className="text-foreground">{product.delivery_info || 'Download imediato após pagamento'}</span>
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            <div className="card-glass rounded-xl p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <p className="font-semibold text-foreground text-sm">Download Imediato</p>
              <p className="text-xs text-muted-foreground mt-1">Após confirmar pagamento</p>
            </div>
            <div className="card-glass rounded-xl p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <p className="font-semibold text-foreground text-sm">Produto Digital</p>
              <p className="text-xs text-muted-foreground mt-1">{getProductTypeLabel(product.type)}</p>
            </div>
            <div className="card-glass rounded-xl p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <p className="font-semibold text-foreground text-sm">Acesso Vitalício</p>
              <p className="text-xs text-muted-foreground mt-1">Sem mensalidade</p>
            </div>
            <div className="card-glass rounded-xl p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <p className="font-semibold text-foreground text-sm">Suporte Incluído</p>
              <p className="text-xs text-muted-foreground mt-1">Tire suas dúvidas</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;