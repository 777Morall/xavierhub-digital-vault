import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Save, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStoredUser, updateProfile, logout, isAuthenticated } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { User as UserType } from "@/lib/auth";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    current_password: "",
    password: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        username: storedUser.username,
        email: storedUser.email,
        current_password: "",
        password: "",
      });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepara dados para envio (apenas campos alterados)
      const updateData: any = {};
      
      if (formData.username !== user?.username) {
        updateData.username = formData.username;
      }
      
      if (formData.email !== user?.email) {
        updateData.email = formData.email;
      }
      
      if (formData.password) {
        if (!formData.current_password) {
          toast({
            title: "Senha atual necessária",
            description: "Para alterar a senha, informe sua senha atual.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        updateData.current_password = formData.current_password;
        updateData.password = formData.password;
      }

      if (Object.keys(updateData).length === 0) {
        toast({
          title: "Nenhuma alteração",
          description: "Nenhum dado foi modificado.",
        });
        setLoading(false);
        return;
      }

      const updatedUser = await updateProfile(updateData);
      setUser(updatedUser);
      setFormData({
        ...formData,
        current_password: "",
        password: "",
      });
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar o perfil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta.",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-gradient mb-2">
                Meu Perfil
              </h1>
              <p className="text-muted-foreground">
                Gerencie suas informações de conta
              </p>
            </div>

            {/* Info Card */}
            <div className="glass-card p-6 rounded-2xl border border-border mb-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {user.username}
                  </h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Membro desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="glass-card p-8 rounded-2xl border border-border">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Username
                  </label>
                  <Input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    minLength={3}
                    maxLength={50}
                    pattern="^[a-zA-Z0-9_]+$"
                    className="bg-secondary/50 border-border"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-secondary/50 border-border"
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Alterar Senha
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Deixe em branco se não quiser alterar a senha
                  </p>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Senha Atual
                      </label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={formData.current_password}
                        onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                        className="bg-secondary/50 border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Nova Senha
                      </label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        minLength={6}
                        className="bg-secondary/50 border-border"
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="submit"
                    variant="glow"
                    size="lg"
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleLogout}
                    className="text-destructive hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair da Conta
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
