import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin, isAdminAuthenticated } = useAdmin();
  const navigate = useNavigate();

  // Já autenticado → redirecionar
  if (isAdminAuthenticated) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !senha) {
      setError('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await adminLogin(email, senha);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro ao fazer login. Tente novamente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
      </div>

      {/* Left — Brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-16 relative">
        <div className="max-w-md text-center">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Shield size={44} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Área Restrita</h1>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Acesso exclusivo para o administrador do sistema BNCC Reports.
          </p>

          <div className="mt-12 space-y-4">
            {[
              '🔒 Autenticação segura com JWT',
              '📊 Dashboard de estatísticas em tempo real',
              '💬 Gerenciamento completo de sugestões',
              '📋 Logs de atividades do sistema',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 px-5 py-3 rounded-2xl text-left"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Shield size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Área Restrita</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>BNCC Reports — Admin</p>
          </div>

          {/* Card */}
          <div className="rounded-3xl p-8 shadow-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={18} style={{ color: '#818cf8' }} />
                <span className="text-sm font-semibold" style={{ color: '#818cf8' }}>Acesso Administrativo</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Entrar no Painel</h2>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Use suas credenciais de administrador
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" id="admin-login-form">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  E-mail do administrador
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bnccreports.com"
                  autoComplete="username"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'white',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.2)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="admin-senha"
                    type={showPass ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-12 rounded-xl text-sm font-medium outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'white',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.2)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Erro */}
              {error && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Botão */}
              <button
                id="admin-login-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: loading
                    ? 'rgba(99,102,241,0.5)'
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: loading ? 'none' : '0 4px 24px rgba(99,102,241,0.35)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Acessar Painel
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Acesso exclusivo ao administrador do sistema
            </p>
          </div>

          <p className="mt-6 text-center text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            BNCC Reports © 2026 — Painel Administrativo
          </p>
        </div>
      </div>
    </div>
  );
}
