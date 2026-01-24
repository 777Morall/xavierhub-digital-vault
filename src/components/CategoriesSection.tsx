import { Code, Layout, Bot, Package, Terminal, Cpu } from "lucide-react";

const categories = [
  {
    icon: Code,
    name: "Scripts",
    count: 45,
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Layout,
    name: "Telas",
    count: 32,
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Bot,
    name: "Bots",
    count: 28,
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Package,
    name: "Packs",
    count: 15,
    color: "from-orange-500 to-yellow-500",
  },
  {
    icon: Terminal,
    name: "Ferramentas",
    count: 38,
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Cpu,
    name: "Sistemas",
    count: 22,
    color: "from-violet-500 to-purple-500",
  },
];

const CategoriesSection = () => {
  return (
    <section id="categorias" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            <span className="text-foreground">Nossas </span>
            <span className="text-gradient">Categorias</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Encontre exatamente o que você precisa em nossas categorias
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className="group cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 text-center card-glow">
                {/* Icon with Gradient Background */}
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <category.icon className="h-7 w-7 text-white" />
                </div>

                <h3 className="font-semibold text-foreground mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.count} produtos
                </p>

                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-glow" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
