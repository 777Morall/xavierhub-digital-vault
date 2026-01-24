import { ShoppingCart, Eye } from "lucide-react";
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
  
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const originalPrice = discount ? price / (1 - discount / 100) : undefined;

  const getDefaultImage = (type: string) => {
    const images: Record<string, string> = {
      software: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
      ebook: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
      curso: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      assinatura: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop",
      outro: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop"
    };
    return images[type] || images.outro;
  };

  const imageUrl = product.image_url || product.image || getDefaultImage(product.type);

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300">
      {/* Image */}
      <div 
        className="relative aspect-video overflow-hidden bg-secondary cursor-pointer"
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
        
        {/* Badge */}
        <Badge 
          className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs font-medium"
        >
          {getProductTypeLabel(product.type)}
        </Badge>

        {/* Quick View on Hover */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button 
            size="sm" 
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/produto/${product.slug || product.id}`);
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 
          className="font-semibold text-foreground mb-1 line-clamp-1 cursor-pointer hover:text-primary transition-colors"
          onClick={() => navigate(`/produto/${product.slug || product.id}`)}
        >
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem]">
          {product.description?.substring(0, 80) || "Produto digital de alta qualidade"}
        </p>

        {/* Price & Action */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-xs text-muted-foreground">À vista no PIX</span>
          </div>

          <Button 
            size="sm"
            onClick={() => navigate(`/checkout/${product.id}`)}
            className="shrink-0"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Comprar</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
