import { useNavigate } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full">
      {/* Hero Banner - Full Width Image */}
      <div className="container mx-auto px-4 py-6">
        <div 
          className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => {
            const element = document.getElementById('produtos');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <img
            src={heroBanner}
            alt="Banner Principal"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="px-6 md:px-12 max-w-xl">
              <h1 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2 md:mb-4 drop-shadow-lg">
                A ESCOLHA CERTA
                <br />
                <span className="text-primary">PARA VOCÊ</span>
              </h1>
              <p className="text-sm md:text-base text-white/80 drop-shadow hidden md:block">
                Obtenha os melhores serviços pagando barato
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
