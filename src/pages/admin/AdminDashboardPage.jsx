import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare, CheckCircle, Clock, Activity,
  TrendingUp, ArrowUpRight, RefreshCw
} from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import { useAdmin } from '../../contexts/AdminContext';

function StatCard({ label, value, icon: Icon, color, bgColor, trend }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon size={22} className={color} />
        </div>
        {trend !== undefined && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            <ArrowUpRight size={12} />
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-slate-800 mb-1">{value ?? '—'}</p>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const logIcons = {
  LOGIN_ADMIN: '🔐',
  SUGESTAO_RECEBIDA: '💬',
  SUGESTAO_ATUALIZADA: '✏️',
  SUGESTAO_EXCLUIDA: '🗑️',
  SETUP_BANCO: '🔧',
};

export default function AdminDashboardPage() {
  const { api } = useAdmin();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/dashboard');
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar dados do dashboard.');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const stats = data ? [
    {
      label: 'Total de Sugestões',
      value: data.stats.totalSugestoes,
      icon: MessageSquare,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      label: 'Sugestões Pendentes',
      value: data.stats.sugestoesPendentes,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Sugestões Lidas',
      value: data.stats.sugestoesLidas,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Atividades no Log',
      value: data.logsRecentes?.length,
      icon: Activity,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
    },
  ] : [];

  return (
    <div className="flex-1 overflow-auto">
      <AdminHeader onRefresh={fetchDashboard} loading={loading} />

      <div className="p-8 max-w-7xl mx-auto">
        {/* Título */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
          <p className="text-slate-500 text-sm mt-1">Dados atualizados em tempo real do banco de dados</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl flex items-center gap-2">
            <span>❌</span> {error}
            <button onClick={fetchDashboard} className="ml-auto flex items-center gap-1 font-medium hover:underline">
              <RefreshCw size={14} /> Tentar novamente
            </button>
          </div>
        )}

        {loading && !data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse">
                <div className="w-12 h-12 bg-slate-100 rounded-xl mb-4" />
                <div className="h-8 bg-slate-100 rounded-lg mb-2 w-16" />
                <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sugestões Recentes */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-sm">Sugestões Recentes</h3>
              </div>
              <a href="/admin/sugestoes" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                Ver todas <ArrowUpRight size={12} />
              </a>
            </div>
            <div className="divide-y divide-slate-50">
              {data?.sugestoesRecentes?.length === 0 && (
                <div className="px-6 py-8 text-center">
                  <MessageSquare size={32} className="text-slate-200 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Nenhuma sugestão ainda</p>
                </div>
              )}
              {data?.sugestoesRecentes?.map((s) => (
                <div key={s.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">
                        {s.nome || 'Anônimo'}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{s.resumo}...</p>
                    </div>
                    <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      s.status === 'pendente'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {s.status === 'pendente' ? '⏳ Pendente' : '✅ Lida'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2">{formatDate(s.data_criacao)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Logs Recentes */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-50">
              <Activity size={18} className="text-violet-600" />
              <h3 className="font-bold text-slate-800 text-sm">Atividade Recente</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {data?.logsRecentes?.length === 0 && (
                <div className="px-6 py-8 text-center">
                  <Activity size={32} className="text-slate-200 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Nenhuma atividade registrada</p>
                </div>
              )}
              {data?.logsRecentes?.map((log, i) => (
                <div key={i} className="px-6 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">
                    {logIcons[log.acao] || '📝'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">
                      {log.acao.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{log.detalhes}</p>
                  </div>
                  <p className="text-xs text-slate-300 flex-shrink-0 text-right">
                    {formatDate(log.data_hora)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
