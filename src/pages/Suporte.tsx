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
      <main className="pt-28 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Hero Section */}
          <div className="text-center mb-10 md:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 mb-4 md:mb-6">
              <Headset className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
              Central de Suporte
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-2">
              Estamos aqui para ajudar! Nossa equipe está pronta para responder suas dúvidas 
              e resolver qualquer problema rapidamente.
            </p>
          </div>

          {/* WhatsApp CTA Card */}
          <Card className="mb-8 md:mb-12 overflow-hidden border-0 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent">
            <CardContent className="p-5 md:p-8 lg:p-12">
              <div className="flex flex-col items-center text-center md:flex-row md:text-left gap-5 md:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-green-500/20 flex items-center justify-center">
                    <MessageCircle className="h-8 w-8 md:h-12 md:w-12 text-green-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2 md:mb-3">
                    Fale Conosco pelo WhatsApp
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base mb-4 md:mb-6 max-w-lg mx-auto md:mx-0">
                    Atendimento rápido e personalizado. Nossa equipe está disponível para 
                    tirar dúvidas e fornecer suporte completo.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold px-6 md:px-8 h-12 md:h-14 text-base md:text-lg shadow-lg shadow-green-500/25 transition-all hover:shadow-green-500/40 hover:scale-105"
                      onClick={() => window.open(whatsappLink, '_blank')}
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Iniciar Conversa
                    </Button>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium text-sm md:text-base">(11) 95305-9801</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            <Card className="group hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-4 md:p-6 flex sm:flex-col items-center sm:text-center gap-4 sm:gap-0">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 sm:mx-auto sm:mb-4 group-hover:bg-primary/20 transition-colors">
                  <Clock className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1 text-base md:text-lg">Horário de Atendimento</h3>
                  <p className="text-muted-foreground text-sm">
                    Segunda a Sexta • <span className="font-semibold text-foreground">9h às 18h</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-4 md:p-6 flex sm:flex-col items-center sm:text-center gap-4 sm:gap-0">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 sm:mx-auto sm:mb-4 group-hover:bg-primary/20 transition-colors">
                  <Timer className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1 text-base md:text-lg">Tempo de Resposta</h3>
                  <p className="text-muted-foreground text-sm">
                    Resposta em até <span className="font-semibold text-foreground">2 horas</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-4 md:p-6 flex sm:flex-col items-center sm:text-center gap-4 sm:gap-0">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 sm:mx-auto sm:mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1 text-base md:text-lg">Compra Segura</h3>
                  <p className="text-muted-foreground text-sm">
                    Pagamentos <span className="font-semibold text-foreground">100% Protegidos</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card className="border-0 bg-card/50">
            <CardContent className="p-5 md:p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
                  Informações Importantes
                </h2>
              </div>
              
              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
                {/* Left Column */}
                <div className="space-y-4 md:space-y-6">
                  <div className="flex gap-3 md:gap-4 p-3 md:p-0 rounded-xl bg-secondary/30 md:bg-transparent">
                    <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground mb-1 text-sm md:text-base">Sobre os Produtos</h3>
                      <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                        Produtos digitais entregues automaticamente após confirmação do pagamento.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 md:gap-4 p-3 md:p-0 rounded-xl bg-secondary/30 md:bg-transparent">
                    <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground mb-1 text-sm md:text-base">Formas de Pagamento</h3>
                      <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                        Aceitamos PIX com confirmação instantânea.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4 md:space-y-6">
                  <div className="flex gap-3 md:gap-4 p-3 md:p-0 rounded-xl bg-secondary/30 md:bg-transparent">
                    <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Lock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground mb-1 text-sm md:text-base">Garantia e Suporte</h3>
                      <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                        Suporte técnico via WhatsApp para todos os produtos.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 md:gap-4 p-3 md:p-0 rounded-xl bg-secondary/30 md:bg-transparent">
                    <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground mb-1 text-sm md:text-base">Entrega Garantida</h3>
                      <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                        Resposta em até 2h no horário comercial.
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
