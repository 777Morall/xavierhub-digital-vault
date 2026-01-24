import { Zap, ShoppingCart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Product, formatPrice, getProductTypeLabel } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  discount?: number;
}

const ProductCard = ({ product, discount }: ProductCardProps) => {
  const navigate = useNavigate();
  
  const price = parseFloat(product.price);
  const originalPrice = discount ? price / (1 - discount / 100) : undefined;

  // Imagem padrão baseada no tipo
  const getDefaultImage = (type: string) => {
    const images: Record<string, string> = {
      software: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=400&fit=crop",
      ebook: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=400&fit=crop",
      curso: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=400&fit=crop",
      assinatura: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=400&fit=crop",
      outro: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=400&fit=crop"
    };
    return images[type] || images.outro;
  };

  const imageUrl = product.file_path || getDefaultImage(product.type);

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 card-glow">
      {/* Image Container */}
      <div 
        className="relative aspect-[4/3] overflow-hidden bg-secondary cursor-pointer"
        onClick={() => navigate(`/produto/${product.slug || product.id}`)}
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = getDefaultImage(product.type);
          }}
        />
        
        {/* Discount Badge */}
        {discount && (
          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground font-bold">
            <Zap className="h-3 w-3 mr-1" />
            {discount}% OFF
          </Badge>
        )}

        {/* Category Badge */}
        <Badge variant="secondary" className="absolute top-3 left-3">
          {getProductTypeLabel(product.type)}
        </Badge>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 
          className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer"
          onClick={() => navigate(`/produto/${product.slug || product.id}`)}
        >
          {product.name}
        </h3>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description?.substring(0, 100)}...
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gradient">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="glow" 
            className="flex-1 group/btn"
            onClick={() => navigate(`/checkout/${product.id}`)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Comprar
          </Button>
          
          {product.demo_url && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => window.open(product.demo_url, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-xl shadow-glow" />
      </div>
    </div>
  );
};

export default ProductCard;
