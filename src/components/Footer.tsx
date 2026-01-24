import { Send, MessageCircle, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    produtos: ["Scripts", "Telas", "Bots", "Ferramentas", "Packs", "Sistemas"],
    suporte: ["FAQ", "Contato", "Termos de Uso", "Política de Privacidade"],
  };

  const socialLinks = [
    { icon: Send, href: "#", label: "Telegram" },
    { icon: MessageCircle, href: "#", label: "WhatsApp" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer id="contato" className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="XavierHub" className="h-10 w-auto" />
              <span className="font-display font-bold text-xl text-gradient">
                XAVIERHUB
              </span>
            </a>
            <p className="text-muted-foreground text-sm mb-4">
              Sua loja de produtos digitais, scripts e ferramentas tecnológicas
              de alta qualidade.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Produtos
            </h4>
            <ul className="space-y-2">
              {links.produtos.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Suporte
            </h4>
            <ul className="space-y-2">
              {links.suporte.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Contato
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Suporte via Telegram 24/7</p>
              <p>Pagamentos via PIX</p>
              <p>Entrega instantânea</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} XavierHub. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
