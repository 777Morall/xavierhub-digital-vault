import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MessageCircle, Clock, Shield, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Suporte = () => {
  const whatsappNumber = "5511953059801";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Suporte XavierHub
            </h1>
            <p className="text-muted-foreground text-lg">
              Estamos aqui para ajudar! Entre em contato conosco para tirar suas dúvidas.
            </p>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              Suporte via WhatsApp
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Nossa equipe está disponível para responder suas dúvidas, ajudar com problemas 
              técnicos e fornecer suporte sobre produtos.
            </p>
            <Button 
              size="lg" 
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-8"
              onClick={() => window.open(whatsappLink, '_blank')}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Falar no WhatsApp
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              📱 (11) 95305-9801
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-foreground mb-2">Horário de Atendimento</h3>
              <p className="text-sm text-muted-foreground">
                Segunda a Sexta<br />
                9h às 18h
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-foreground mb-2">Compra Segura</h3>
              <p className="text-sm text-muted-foreground">
                Pagamentos processados<br />
                com segurança
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <HelpCircle className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-foreground mb-2">Dúvidas Frequentes</h3>
              <p className="text-sm text-muted-foreground">
                Respondemos sobre<br />
                produtos e entregas
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">
              Informações Importantes
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-foreground mb-2">📦 Sobre os Produtos</h3>
                <p className="text-muted-foreground text-sm">
                  Todos os nossos produtos digitais são entregues automaticamente após a confirmação 
                  do pagamento. Você receberá o acesso diretamente no seu email ou na área "Meus Produtos".
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">💳 Formas de Pagamento</h3>
                <p className="text-muted-foreground text-sm">
                  Aceitamos PIX, cartão de crédito e outros métodos via Mercado Pago. 
                  Pagamentos via PIX são confirmados instantaneamente.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">🔒 Garantia e Suporte</h3>
                <p className="text-muted-foreground text-sm">
                  Oferecemos suporte técnico para todos os produtos. Em caso de problemas 
                  com seu produto, entre em contato via WhatsApp para resolvermos rapidamente.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-2">⏰ Tempo de Resposta</h3>
                <p className="text-muted-foreground text-sm">
                  Nosso tempo médio de resposta é de até 2 horas durante o horário comercial. 
                  Mensagens enviadas fora do horário serão respondidas no próximo dia útil.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Suporte;
