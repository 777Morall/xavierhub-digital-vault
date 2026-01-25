import { useState, useEffect } from "react";
import { Loader2, AlertCircle, Crown } from "lucide-react";
import ProductCard from "./ProductCard";
import { getProducts, Product } from "@/lib/api";
import { Button } from "@/components/ui/button";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts({ limit: 20 });
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="produtos" className="py-4">
      <div className="container mx-auto px-4">
        {/* Section Title with Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
              PRODUTOS EM DESTAQUE
            </h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={loadProducts}>
              Tentar Novamente
            </Button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              Nenhum produto disponível no momento
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
