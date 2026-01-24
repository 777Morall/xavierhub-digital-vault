import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import logo from "@/assets/logo.png";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (formData.username.length < 3) {
      toast({
        title: "Username inválido",
        description: "O username deve ter no mínimo 3 caracteres.",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter no mínimo 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      toast({
        title: "Conta criada!",
        description: "Bem-vindo à XavierHub.",
      });
      navigate("/meus-produtos");
    } catch (error: any) {
      toast({
        title: "Erro no registro",
        description: error.message || "Não foi possível criar a conta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Logo e título */}
            <div className="text-center mb-8">
              <img src={logo} alt="XavierHub" className="h-16 w-auto mx-auto mb-4" />
              <h1 className="font-display text-3xl font-bold text-gradient mb-2">
                Criar Conta
              </h1>
              <p className="text-muted-foreground">
                Registre-se para acessar seus produtos
              </p>
            </div>

            {/* Card do formulário */}
            <div className="glass-card p-8 rounded-2xl border border-border">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Username
                  </label>
                  <Input
                    type="text"
                    placeholder="seuusername"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    minLength={3}
                    maxLength={50}
                    pattern="^[a-zA-Z0-9_]+$"
                    className="bg-secondary/50 border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    Apenas letras, números e underscore
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-secondary/50 border-border"
                  />
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Senha
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                      className="bg-secondary/50 border-border pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mínimo de 6 caracteres
                  </p>
                </div>

                {/* Botão de registro */}
                <Button
                  type="submit"
                  variant="glow"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Criar Conta
                    </>
                  )}
                </Button>
              </form>

              {/* Link para login */}
              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-muted-foreground">
                  Já tem uma conta?{" "}
                  <Link 
                    to="/login" 
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Entrar
                  </Link>
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

export default Register;
