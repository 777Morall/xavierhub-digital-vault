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
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <button 
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-4 group"
          >
            <div className="w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <ArrowLeft className="h-4 w-4 group-hover:text-primary transition-colors" />
            </div>
            <span>Voltar</span>
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
                  <span>Suporte via WhatsApp</span>
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
                ⚡ Entrega: Via Email e no Minhas Compras
              </p>
            </div>
          </div>

          {/* Support & Guarantee Section */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {/* WhatsApp Support Card */}
            <div className="relative group">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-green-500/50 to-green-400/30 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-card rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0 ring-2 ring-green-500/30">
                    <svg className="h-7 w-7 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg text-foreground mb-1">Suporte via WhatsApp</h3>
                    <p className="text-sm text-muted-foreground mb-3">Tire suas dúvidas diretamente com nossa equipe</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-green-500/30 text-green-500 hover:bg-green-500/10 hover:border-green-500/50"
                      onClick={() => window.open('https://wa.me/5511953059801?text=Olá! Tenho dúvidas sobre o produto: ' + encodeURIComponent(product.name), '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Falar com Suporte
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantee Card */}
            <div className="relative group">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/50 to-primary/30 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-card rounded-2xl p-6 border border-primary/20 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/30">
                    <Shield className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg text-foreground mb-1">Compra Segura</h3>
                    <p className="text-sm text-muted-foreground mb-2">Pagamento via PIX com aprovação instantânea</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-lg ring-1 ring-primary/20">
                        <svg className="h-4 w-4 text-primary" viewBox="0 0 512 512" fill="currentColor">
                          <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 googletag372.4 googletag404.8 googletag414.1 googletag414.1C googletag422.4 googletag421.9 googletag428.7 googletag426.5 googletag433.8 googletag428.3L googletag512 googletag350.1V googletag432C googletag512 googletag476.2 googletag476.2 googletag512 googletag432 googletag512H googletag350.1L googletag428.3 googletag433.8C googletag426.5 googletag428.7 googletag421.9 googletag422.4 googletag414.1 googletag414.1C googletag404.8 googletag404.8 googletag383.7 googletag404.8 googletag369.5 googletag369.5L googletag292.5 googletag292.5C googletag287.1 googletag287.1 googletag287.1 googletag277.1 googletag292.5 googletag271.8L googletag369.5 googletag194.9C googletag383.7 googletag180.7 googletag404.8 googletag180.7 googletag414.1 googletag180.7C googletag421.9 googletag181.8 googletag428.7 googletag186.1 googletag433.8 googletag193.3L googletag512 googletag271.5V googletag80C googletag512 googletag35.82 googletag476.2 0 googletag432 0H googletag350.1L googletag428.3 googletag78.23C googletag426.5 googletag83.31 googletag421.9 googletag89.57 googletag414.1 googletag97.94C googletag404.8 googletag107.2 googletag383.7 googletag107.2 googletag369.5 googletag142.5L googletag292.5 googletag219.5C googletag287.1 googletag224.9 googletag287.1 googletag234.9 googletag292.5 googletag240.2L googletag369.5 googletag317.1C googletag383.7 googletag352.4 googletag404.8 googletag352.4 googletag414.1 googletag352.4C googletag421.9 googletag360.8 googletag428.7 googletag367.1 googletag433.8 googletag374.3L googletag512 googletag296.1V googletag215.9L googletag433.8 googletag137.7C googletag428.7 googletag144.9 googletag421.9 googletag151.2 googletag414.1 googletag159.5C googletag404.8 googletag159.5 googletag383.7 googletag159.5 googletag369.5 googletag194.9L googletag292.5 googletag271.8C googletag287.1 googletag277.1 googletag277.1 googletag287.1 googletag271.8 googletag292.5L googletag194.9 googletag369.5C googletag180.7 googletag383.7 googletag180.7 googletag404.8 googletag180.7 googletag414.1C googletag181.8 googletag421.9 googletag186.1 googletag428.7 googletag193.3 googletag433.8L googletag271.5 googletag512H googletag80C googletag35.82 googletag512 0 googletag476.2 0 googletag432V googletag350.1L googletag78.23 googletag428.3C googletag83.31 googletag426.5 googletag89.57 googletag421.9 googletag97.94 googletag414.1C googletag107.2 googletag404.8 googletag107.2 googletag383.7 googletag142.5 googletag369.5L googletag219.5 googletag292.5C googletag224.9 googletag287.1 googletag234.9 googletag287.1 googletag240.2 googletag292.5L googletag317.1 googletag369.5C googletag352.4 googletag383.7 googletag352.4 googletag404.8 googletag352.4 googletag414.1C googletag360.8 googletag421.9 googletag367.1 googletag428.7 googletag374.3 googletag433.8L googletag296.1 googletag512H googletag215.9L googletag137.7 googletag433.8C googletag144.9 googletag428.7 googletag151.2 googletag421.9 googletag159.5 googletag414.1C googletag159.5 googletag404.8 googletag159.5 googletag383.7 googletag194.9 googletag369.5L googletag271.8 googletag292.5C googletag277.1 googletag287.1 googletag287.1 googletag277.1 googletag292.5 googletag271.8L googletag369.5 googletag194.9C googletag383.7 googletag180.7 googletag404.8 googletag180.7 googletag414.1 googletag180.7C googletag421.9 googletag181.8 googletag428.7 googletag186.1 googletag433.8 googletag193.3L googletag512 googletag271.5V googletag80C googletag512 googletag35.82 googletag476.2 0 googletag432 0H googletag271.5L googletag193.3 googletag78.23C googletag186.1 googletag83.31 googletag181.8 googletag89.57 googletag180.7 googletag97.94C googletag180.7 googletag107.2 googletag180.7 googletag128.3 googletag142.5 googletag142.5L googletag219.5 googletag219.5C googletag224.9 googletag224.9 googletag234.9 googletag224.9 googletag240.2 googletag219.5L googletag317.1 googletag142.5C googletag352.4 googletag107.2 googletag352.4 googletag107.2 googletag352.4 googletag97.94C googletag360.8 googletag89.57 googletag367.1 googletag83.31 googletag374.3 googletag78.23L googletag296.1 0H googletag80C googletag35.82 0 0 googletag35.82 0 googletag80V googletag161.9L googletag78.23 googletag83.69C googletag83.31 googletag85.46 googletag89.57 googletag90.06 googletag97.94 googletag97.94C googletag107.2 googletag107.2 googletag128.3 googletag107.2 googletag142.5 googletag142.5L googletag219.5 googletag219.5C googletag224.9 googletag224.9 googletag224.9 googletag234.9 googletag219.5 googletag240.2L googletag142.5 googletag317.1C googletag107.2 googletag352.4 googletag107.2 googletag352.4 googletag97.94 googletag352.4C googletag89.57 googletag360.8 googletag83.31 googletag367.1 googletag78.23 googletag374.3L0 googletag296.1V googletag432C0 googletag476.2 googletag35.82 googletag512 googletag80 googletag512H googletag161.9L googletag83.69 googletag433.8C googletag85.46 googletag428.7 googletag90.06 googletag422.4 googletag97.94 googletag414.1C googletag107.2 googletag404.8 googletag128.3 googletag404.8 googletag142.5 googletag369.5L googletag219.5 googletag292.5C googletag224.9 googletag287.1 googletag234.9 googletag287.1 googletag240.2 googletag292.5L googletag317.1 googletag369.5C googletag352.4 googletag383.7 googletag352.4 googletag404.8 googletag352.4 googletag414.1C googletag360.8 googletag422.4 googletag367.1 googletag428.7 googletag374.3 googletag433.8L googletag452.5 googletag512H googletag432C googletag476.2 googletag512 googletag512 googletag476.2 googletag512 googletag432V googletag350.1L googletag433.8 googletag428.3C googletag428.7 googletag426.5 googletag422.4 googletag421.9 googletag414.1 googletag414.1C googletag404.8 googletag404.8 googletag383.7 googletag404.8 googletag369.5 googletag369.5L googletag292.5 googletag292.5C googletag287.1 googletag287.1 googletag287.1 googletag277.1 googletag292.5 googletag271.8L googletag369.5 googletag194.9C googletag383.7 googletag180.7 googletag404.8 googletag180.7 googletag414.1 googletag180.7C googletag422.4 googletag181.8 googletag428.7 googletag186.1 googletag433.8 googletag193.3L googletag512 googletag271.5V googletag80C googletag512 googletag35.82 googletag476.2 0 googletag432 0H googletag271.5"/>
                        </svg>
                        <span className="text-xs font-semibold text-primary">PIX</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Único método aceito</span>
                    </div>
                  </div>
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

export default ProductDetail;
