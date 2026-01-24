import { Sparkles } from "lucide-react";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Script Bot Automação PRO",
    price: 150,
    originalPrice: 300,
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=400&fit=crop",
    discount: 50,
    category: "Scripts",
  },
  {
    id: 2,
    name: "Tela Phishing Premium",
    price: 200,
    originalPrice: 400,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=400&fit=crop",
    discount: 50,
    category: "Telas",
  },
  {
    id: 3,
    name: "Ferramenta Extrator V2",
    price: 180,
    originalPrice: 360,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=400&fit=crop",
    discount: 50,
    category: "Ferramentas",
  },
  {
    id: 4,
    name: "Pack Scripts Completo",
    price: 350,
    originalPrice: 700,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=400&fit=crop",
    discount: 50,
    category: "Packs",
  },
  {
    id: 5,
    name: "Bot WhatsApp Avançado",
    price: 250,
    originalPrice: 500,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=400&fit=crop",
    discount: 50,
    category: "Bots",
  },
  {
    id: 6,
    name: "Sistema CRM Completo",
    price: 400,
    originalPrice: 800,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=400&fit=crop",
    discount: 50,
    category: "Sistemas",
  },
];

const FeaturedProducts = () => {
  return (
    <section id="produtos" className="py-20 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">
              Produtos em Destaque
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            <span className="text-foreground">Produtos em </span>
            <span className="text-gradient">Destaque</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Confira nossos produtos mais vendidos e aproveite as ofertas exclusivas
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
