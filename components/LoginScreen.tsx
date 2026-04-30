
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Hexagon, Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const { login, loginGoogle, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      await login(email, password);
    }
  };

  return (
    <div className="min-h-screen flex bg-nexus-bg font-sans">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-nexus-sidebar relative overflow-hidden flex-col justify-between p-12 text-white">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
         <div className="absolute inset-0 bg-gradient-to-br from-nexus-sidebar via-nexus-sidebar to-nexus-royal/20"></div>
         
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-nexus-royal rounded flex items-center justify-center shadow-lg">
                  <Hexagon size={24} fill="currentColor" className="text-white" />
               </div>
               <h1 className="font-bold text-2xl tracking-tight">Bloom Leads</h1>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
               Transforme dados em <br/>
               <span className="text-nexus-gold">receita previsível.</span>
            </h2>
            <p className="text-nexus-sand text-lg max-w-md opacity-90">
               Junte-se a milhares de empresas B2B que usam o Bloom Leads para enriquecer leads e fechar negócios.
               <br/><br/>
               <span className="text-white font-bold bg-white/10 px-2 py-1 rounded">100% Gratuito & Ilimitado</span>
            </p>
         </div>

         <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-3">
                 <CheckCircle2 className="text-nexus-gold w-5 h-5" />
                 <span className="text-sm font-medium">Dados validados via Google Maps</span>
             </div>
             <div className="flex items-center gap-3">
                 <CheckCircle2 className="text-nexus-gold w-5 h-5" />
                 <span className="text-sm font-medium">Pipeline de vendas integrado</span>
             </div>
             <div className="flex items-center gap-3">
                 <CheckCircle2 className="text-nexus-gold w-5 h-5" />
                 <span className="text-sm font-medium">Extração de leads ilimitada</span>
             </div>
         </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-nexus-surface">
         <div className="w-full max-w-md space-y-8 animate-fadeIn">
             <div className="text-center lg:text-left">
                 <h2 className="text-3xl font-bold text-nexus-dark mb-2">
                     {isRegistering ? 'Crie sua conta Grátis' : 'Bem-vindo de volta'}
                 </h2>
                 <p className="text-nexus-warmGray">
                     {isRegistering ? 'Acesso ilimitado e gratuito para sempre.' : 'Acesse seu dashboard de prospecção.'}
                 </p>
             </div>

             <div className="space-y-4">
                 <button 
                    onClick={() => loginGoogle()}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-nexus-surface border border-nexus-sand text-nexus-charcoal font-bold py-3 px-4 rounded hover:bg-nexus-sandLight transition-all shadow-subtle"
                 >
                     <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                     {loading ? 'Conectando...' : 'Continuar com Google'}
                 </button>
                 
                 <div className="relative flex items-center py-2">
                     <div className="flex-grow border-t border-nexus-sand"></div>
                     <span className="flex-shrink-0 mx-4 text-nexus-warmGray text-xs uppercase font-bold">Ou via email</span>
                     <div className="flex-grow border-t border-nexus-sand"></div>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                         <label className="block text-xs font-bold text-nexus-dark mb-1">Email Corporativo</label>
                         <div className="relative">
                             <Mail className="absolute left-3 top-3 w-4 h-4 text-nexus-warmGray" />
                             <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-nexus-sand rounded text-sm focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal outline-none"
                                placeholder="seu@empresa.com"
                             />
                         </div>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-nexus-dark mb-1">Senha</label>
                         <div className="relative">
                             <Lock className="absolute left-3 top-3 w-4 h-4 text-nexus-warmGray" />
                             <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-nexus-sand rounded text-sm focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal outline-none"
                                placeholder="••••••••"
                             />
                         </div>
                     </div>

                     <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-nexus-royal text-white font-bold py-3 px-4 rounded shadow-md hover:bg-nexus-crimsonLight transition-all flex items-center justify-center gap-2"
                     >
                         {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                         {isRegistering ? 'Criar Conta Grátis' : 'Entrar na Plataforma'}
                     </button>
                 </form>

                 <div className="text-center text-sm text-nexus-warmGray">
                     {isRegistering ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
                     <button 
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="ml-1 text-nexus-royal font-bold hover:underline"
                     >
                         {isRegistering ? 'Fazer Login' : 'Cadastre-se Grátis'}
                     </button>
                 </div>
             </div>
         </div>
         
         <div className="mt-12 text-xs text-nexus-warmGray text-center">
             &copy; 2025 Bloom Leads. Todos os direitos reservados.
             <br/>Política de Privacidade • Termos de Uso
         </div>
      </div>
    </div>
  );
};

export default LoginScreen;
