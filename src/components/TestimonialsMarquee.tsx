import { Quote } from "lucide-react";

const testimonials = [
  {
    text: "Site impecável! Os scripts funcionam perfeitamente.",
    author: "João M.",
  },
  {
    text: "Atendimento rápido e produtos incríveis!",
    author: "Carla S.",
  },
  {
    text: "Recomendo demais! Melhor loja de ferramentas.",
    author: "Eduardo P.",
  },
  {
    text: "Pix aprovado rápido, sistema perfeito!",
    author: "Beatriz L.",
  },
  {
    text: "Comprei 3 scripts e todos funcionam perfeito!",
    author: "Lucas R.",
  },
  {
    text: "Suporte excelente, responderam em minutos.",
    author: "Amanda F.",
  },
];

const TestimonialsMarquee = () => {
  return (
    <section className="py-12 overflow-hidden bg-secondary/30 border-y border-border">
      <div className="relative">
        <div className="flex animate-marquee">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-4 px-6 py-4 bg-card rounded-xl border border-border min-w-[300px]"
            >
              <Quote className="h-5 w-5 text-primary mb-2" />
              <p className="text-foreground mb-2">"{testimonial.text}"</p>
              <p className="text-primary font-semibold">— {testimonial.author}</p>
            </div>
          ))}
        </div>

        {/* Fade Edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default TestimonialsMarquee;
