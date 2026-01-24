import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import CategoriesSection from "@/components/CategoriesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TestimonialsMarquee />
        <FeaturedProducts />
        <CategoriesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
