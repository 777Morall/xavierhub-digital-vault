import heroBanner from "@/assets/hero-banner.png";

const HeroSection = () => {
  return (
    <section className="relative w-full">
      {/* Hero Banner - Full Width Image */}
      <div className="container mx-auto px-4 py-4">
        <div className="relative w-full rounded-2xl overflow-hidden">
          <img
            src={heroBanner}
            alt="XavierHub - Scripts, Projetos e Desenvolvimento"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
