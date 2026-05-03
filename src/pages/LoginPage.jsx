import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, BookOpen, Star } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function LoginPage() {
  const [email, setEmail] = useState('ana.paula@mundoencantado.edu.br');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    const ok = login(email, password);
    setLoading(false);
    if (ok) navigate('/dashboard');
    else setError('Credenciais inválidas.');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-lg">BNCC Reports</p>
              <p className="text-white/70 text-sm">Educação Infantil</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Relatórios pedagógicos<br />gerados com um clique
            </h2>
            <p className="text-white/80 mt-4 text-lg leading-relaxed">
              Plataforma completa para professores da educação infantil criarem relatórios descritivos baseados na BNCC.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: BookOpen, text: 'Alinhado com os campos de experiência da BNCC' },
              { icon: Star, text: 'Geração automática de texto pedagógico' },
              { icon: GraduationCap, text: 'Exportação em PDF com um clique' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <p className="text-white/90 text-sm font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/50 text-sm">© 2026 BNCC Reports — Todos os direitos reservados</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-lg">BNCC Reports</p>
              <p className="text-slate-500 text-sm">Educação Infantil</p>
            </div>
          </div>

          <div className="card">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-800">Bem-vindo(a) de volta!</h1>
              <p className="text-slate-500 mt-1">Faça login para acessar sua conta.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">E-mail da escola</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="professor@escola.edu.br"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Senha</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="input-field pr-12"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-coral-50 border border-coral-200 text-coral-700 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Entrando...
                  </span>
                ) : 'Entrar'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs font-semibold text-amber-700 mb-1">🔑 Credenciais de demonstração</p>
              <p className="text-xs text-amber-600">E-mail: <span className="font-mono">ana.paula@mundoencantado.edu.br</span></p>
              <p className="text-xs text-amber-600">Senha: <span className="font-mono">qualquer senha</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
