import { 
  Tv, 
  Package, 
  Crown, 
  Gamepad2, 
  MonitorSmartphone, 
  Key, 
  Briefcase,
  LucideIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Category {
  icon: LucideIcon;
  name: string;
  slug: string;
  gradient: string;
}

const categories: Category[] = [
  {
    icon: Tv,
    name: "STREAMINGS",
    slug: "streaming",
    gradient: "from-[#a030ad] to-[#7c2082]",
  },
  {
    icon: Package,
    name: "COMBOS",
    slug: "combo",
    gradient: "from-[#a030ad] to-[#7c2082]",
  },
  {
    icon: Crown,
    name: "ASSINATURAS",
    slug: "assinatura",
    gradient: "from-[#a030ad] to-[#7c2082]",
  },
  {
    icon: Gamepad2,
    name: "JOGOS",
    slug: "jogos",
    gradient: "from-[#a030ad] to-[#7c2082]",
  },
  {
    icon: MonitorSmartphone,
    name: "PAINEIS",
    slug: "painel",
    gradient: "from-[#a030ad] to-[#7c2082]",
  },
  {
    icon: Key,
    name: "MÉTODOS",
    slug: "metodos",
    gradient: "from-[#a030ad] to-[#7c2082]",
  },
  {
    icon: Briefcase,
    name: "TRABALHO",
    slug: "trabalho",
    gradient: "from-[#a030ad] to-[#7c2082]",
  },
];

const CategoriesSection = () => {
  const navigate = useNavigate();

  return (
    <section id="categorias" className="py-8">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6">
          Categorias populares
        </h2>

        {/* Categories Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-7">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => {
                // Scroll to products and filter by category
                const element = document.getElementById('produtos');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex-shrink-0 w-20 md:w-auto"
            >
              <div className={`
                relative aspect-square rounded-xl overflow-hidden
                bg-gradient-to-br ${category.gradient}
                p-2 flex flex-col items-center justify-center
                transition-all duration-300
                group-hover:scale-105 group-hover:shadow-lg
                border border-primary/20
              `}>
                {/* Icon */}
                <category.icon className="h-4 w-4 text-white mb-1 drop-shadow-lg" />
                
                {/* Name */}
                <span className="font-display text-[10px] md:text-xs font-bold text-white text-center leading-tight drop-shadow">
                  {category.name}
                </span>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
