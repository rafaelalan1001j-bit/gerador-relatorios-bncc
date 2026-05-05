import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../contexts/AdminContext';

export default function SugestaoForm() {
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.mensagem.trim() || form.mensagem.trim().length < 5) {
      setErrorMsg('A mensagem deve ter pelo menos 5 caracteres.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      await api.post('/sugestoes', {
        nome: form.nome.trim() || undefined,
        email: form.email.trim() || undefined,
        mensagem: form.mensagem.trim(),
      });
      setStatus('success');
      setForm({ nome: '', email: '', mensagem: '' });
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.details?.[0]?.message || 'Erro ao enviar sugestão. Tente novamente.';
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Sugestão Enviada!</h3>
        <p className="text-slate-500 text-sm mb-5">Obrigado pelo seu feedback. Vamos analisar em breve.</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm font-semibold text-primary-600 hover:underline"
        >
          Enviar outra sugestão
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" id="sugestao-form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Nome <span className="text-slate-300 font-normal normal-case">(opcional)</span>
          </label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Seu nome"
            maxLength={255}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            E-mail <span className="text-slate-300 font-normal normal-case">(opcional)</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          Mensagem <span className="text-red-400">*</span>
        </label>
        <textarea
          name="mensagem"
          value={form.mensagem}
          onChange={handleChange}
          placeholder="Conte sua sugestão, crítica ou feedback sobre o sistema..."
          rows={4}
          maxLength={2000}
          className="input-field resize-none"
          required
        />
        <p className="text-xs text-slate-400 text-right mt-1">{form.mensagem.length}/2000</p>
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 px-4 py-3 bg-coral-50 border border-coral-200 text-coral-700 text-sm rounded-xl">
          <AlertCircle size={15} className="flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        id="sugestao-submit-btn"
        disabled={status === 'loading'}
        className="btn-primary flex items-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send size={16} />
            Enviar Sugestão
          </>
        )}
      </button>
    </form>
  );
}
