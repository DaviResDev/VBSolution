import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Mail, Lock, User, Building } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  // Estados para login
  const [loginEmail, setLoginEmail] = useState('daviresende3322@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');

  // Estados para cadastro
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerCompany, setRegisterCompany] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn(loginEmail, loginPassword);

    if (result.error) {
      setError(result.error.message);
    } else {
      navigate('/');
    }

    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signUp(registerEmail, registerPassword, {
      name: registerName,
      company: registerCompany,
    });

    if (result.error) {
      setError(result.error.message);
    } else {
      setActiveTab('login');
      setError('');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradiente de fundo roxo vibrante */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-purple-700 to-purple-600"></div>
      
      {/* Card central com tudo dentro */}
      <div className="w-full max-w-md z-20 relative">
        <Card className="shadow-2xl border-0 bg-purple-800/60 backdrop-blur-md">
          <CardHeader className="space-y-4 pb-6 text-center">
            {/* Header dentro do card */}
            <div className="space-y-2">
              <h1 className="text-5xl font-bold text-white">VB</h1>
              <h2 className="text-2xl font-semibold text-white/90 backdrop-blur-sm">VB Solution</h2>
              <h3 className="text-lg font-medium text-white/80 backdrop-blur-sm">Acesso ao Sistema</h3>
              <p className="text-sm text-white/70">Entre com suas credenciais ou crie uma nova conta</p>
            </div>
          </CardHeader>
          
          <CardContent className="pb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-purple-700/30 p-1 rounded-lg mb-6">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:shadow-sm data-[state=active]:text-white rounded-md transition-all duration-200 text-white/80 text-sm font-medium"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:shadow-sm data-[state=active]:text-white rounded-md transition-all duration-200 text-white/80 text-sm font-medium"
                >
                  Cadastrar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-0">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
                      <Input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 bg-purple-700/40 border-purple-500/50 text-white placeholder:text-white/60 rounded-lg h-12 focus:border-purple-400 focus:ring-purple-400"
                        placeholder="Seu email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white font-medium">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 pr-10 bg-purple-700/40 border-purple-500/50 text-white placeholder:text-white/60 rounded-lg h-12 focus:border-purple-400 focus:ring-purple-400"
                        placeholder="Sua senha"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-white/80 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <Alert className="bg-red-500/20 border-red-500/50 text-red-200">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-0">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-white font-medium">Nome</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
                      <Input
                        id="register-name"
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="pl-10 bg-purple-700/40 border-purple-500/50 text-white placeholder:text-white/60 rounded-lg h-12 focus:border-purple-400 focus:ring-purple-400"
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-white font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
                      <Input
                        id="register-email"
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="pl-10 bg-purple-700/40 border-purple-500/50 text-white placeholder:text-white/60 rounded-lg h-12 focus:border-purple-400 focus:ring-purple-400"
                        placeholder="Seu email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-company" className="text-white font-medium">Empresa</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
                      <Input
                        id="register-company"
                        type="text"
                        value={registerCompany}
                        onChange={(e) => setRegisterCompany(e.target.value)}
                        className="pl-10 bg-purple-700/40 border-purple-500/50 text-white placeholder:text-white/60 rounded-lg h-12 focus:border-purple-400 focus:ring-purple-400"
                        placeholder="Nome da empresa"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-white font-medium">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="pl-10 pr-10 bg-purple-700/40 border-purple-500/50 text-white placeholder:text-white/60 rounded-lg h-12 focus:border-purple-400 focus:ring-purple-400"
                        placeholder="Crie uma senha forte"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-white/80 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <Alert className="bg-red-500/20 border-red-500/50 text-red-200">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      'Cadastrar'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 