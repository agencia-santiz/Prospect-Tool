import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Hexagon, Mail, Lock, Loader2, CheckCircle2, User, ShieldAlert } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const { login, register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      if (isRegistering) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel concluir a autenticacao.');
    }
  };

  return (
    <div className="min-h-screen flex bg-nexus-bg font-sans">
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
            Transforme dados em <br />
            <span className="text-nexus-gold">receita previsivel.</span>
          </h2>
          <p className="text-nexus-sand text-lg max-w-md opacity-90">
            Junte-se a empresas B2B que usam o Bloom Leads para enriquecer leads e fechar negocios.
            <br />
            <br />
            <span className="text-white font-bold bg-white/10 px-2 py-1 rounded">Sessao real com backend persistido</span>
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-nexus-gold w-5 h-5" />
            <span className="text-sm font-medium">Sessao validada no backend</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-nexus-gold w-5 h-5" />
            <span className="text-sm font-medium">Cadastro e login por email e senha</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-nexus-gold w-5 h-5" />
            <span className="text-sm font-medium">Persistencia real de conta e token</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-nexus-surface">
        <div className="w-full max-w-md space-y-8 animate-fadeIn">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-nexus-dark mb-2">
              {isRegistering ? 'Crie sua conta' : 'Bem-vindo de volta'}
            </h2>
            <p className="text-nexus-warmGray">
              {isRegistering ? 'Seu acesso agora passa pelo backend de auth.' : 'Acesse seu dashboard de prospeccao.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-xs font-bold text-nexus-dark mb-1">Nome completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-nexus-warmGray" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-nexus-sand rounded text-sm focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal outline-none"
                    placeholder="Alice Bloom"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-nexus-dark mb-1">Email corporativo</label>
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
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-nexus-sand rounded text-sm focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-nexus-royal text-white font-bold py-3 px-4 rounded shadow-md hover:bg-nexus-crimsonLight transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isRegistering ? 'Criar conta' : 'Entrar na plataforma'}
            </button>
          </form>

          <div className="text-center text-sm text-nexus-warmGray">
            {isRegistering ? 'Ja tem uma conta?' : 'Ainda nao tem conta?'}
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setErrorMessage('');
              }}
              className="ml-1 text-nexus-royal font-bold hover:underline"
            >
              {isRegistering ? 'Fazer login' : 'Cadastre-se'}
            </button>
          </div>
        </div>

        <div className="mt-12 text-xs text-nexus-warmGray text-center">
          &copy; 2025 Bloom Leads. Todos os direitos reservados.
          <br />
          Politica de Privacidade • Termos de Uso
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
