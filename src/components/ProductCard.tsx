import { Zap, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: number;
  category: string;
}

const ProductCard = ({
  name,
  price,
  originalPrice,
  image,
  discount,
  category,
}: ProductCardProps) => {
  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 card-glow">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
          {category}
        </Badge>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gradient">
              R$ {price.toFixed(2).replace(".", ",")}
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                R$ {originalPrice.toFixed(2).replace(".", ",")}
              </span>
            )}
          </div>
        </div>

        <Button variant="glow" className="w-full mt-4 group/btn">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Comprar
        </Button>
      </div>

      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-xl shadow-glow" />
      </div>
    </div>
  );
};

export default ProductCard;
