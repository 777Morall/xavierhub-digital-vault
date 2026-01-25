import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MessageCircle, Clock, Shield, HelpCircle, Package, CreditCard, Lock, Timer, Phone, Headset, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Suporte = () => {
  const whatsappNumber = "5511953059801";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Headset className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Central de Suporte
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Estamos aqui para ajudar! Nossa equipe está pronta para responder suas dúvidas 
              e resolver qualquer problema rapidamente.
            </p>
          </div>

          {/* WhatsApp CTA Card */}
          <Card className="mb-12 overflow-hidden border-0 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-green-500/20 flex items-center justify-center">
                    <MessageCircle className="h-12 w-12 text-green-500" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                    Fale Conosco pelo WhatsApp
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-lg">
                    Atendimento rápido e personalizado. Nossa equipe está disponível para 
                    tirar dúvidas, ajudar com problemas técnicos e fornecer suporte completo.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Button 
                      size="lg" 
                      className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 h-14 text-lg shadow-lg shadow-green-500/25 transition-all hover:shadow-green-500/40 hover:scale-105"
                      onClick={() => window.open(whatsappLink, '_blank')}
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Iniciar Conversa
                    </Button>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">(11) 95305-9801</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="group hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2 text-lg">Horário de Atendimento</h3>
                <p className="text-muted-foreground">
                  Segunda a Sexta<br />
                  <span className="font-semibold text-foreground">9h às 18h</span>
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Timer className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2 text-lg">Tempo de Resposta</h3>
                <p className="text-muted-foreground">
                  Resposta em até<br />
                  <span className="font-semibold text-foreground">2 horas</span>
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2 text-lg">Compra Segura</h3>
                <p className="text-muted-foreground">
                  Pagamentos<br />
                  <span className="font-semibold text-foreground">100% Protegidos</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card className="border-0 bg-card/50">
            <CardContent className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Informações Importantes
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Sobre os Produtos</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Todos os nossos produtos digitais são entregues automaticamente após a confirmação 
                        do pagamento. Você receberá o acesso diretamente no seu email ou na área "Meus Produtos".
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Formas de Pagamento</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Aceitamos PIX, Pagamentos via PIX são confirmados instantaneamente.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Garantia e Suporte</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Oferecemos suporte técnico para todos os produtos. Em caso de problemas 
                        com seu produto, entre em contato via WhatsApp para resolvermos rapidamente.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Entrega Garantida</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Nosso tempo médio de resposta é de até 2 horas durante o horário comercial. 
                        Mensagens enviadas fora do horário serão respondidas no próximo dia útil.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Suporte;
