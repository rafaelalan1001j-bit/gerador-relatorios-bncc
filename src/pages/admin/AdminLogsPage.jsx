import React, { useState, useEffect, useCallback } from 'react';
import { Activity, RefreshCw, Search } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import { useAdmin } from '../../contexts/AdminContext';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

const logConfig = {
  LOGIN_ADMIN: { icon: '🔐', color: 'bg-indigo-50 text-indigo-700 border-indigo-100', label: 'Login Admin' },
  SUGESTAO_RECEBIDA: { icon: '💬', color: 'bg-blue-50 text-blue-700 border-blue-100', label: 'Sugestão Recebida' },
  SUGESTAO_ATUALIZADA: { icon: '✏️', color: 'bg-amber-50 text-amber-700 border-amber-100', label: 'Sugestão Atualizada' },
  SUGESTAO_EXCLUIDA: { icon: '🗑️', color: 'bg-red-50 text-red-700 border-red-100', label: 'Sugestão Excluída' },
  SETUP_BANCO: { icon: '🔧', color: 'bg-slate-50 text-slate-600 border-slate-200', label: 'Setup Banco' },
};

export default function AdminLogsPage() {
  const { api } = useAdmin();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Buscar pelo dashboard que já retorna os logs
      const res = await api.get('/admin/dashboard');
      setLogs(res.data.logsRecentes || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar logs.');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const filtered = search
    ? logs.filter(l =>
        l.acao.toLowerCase().includes(search.toLowerCase()) ||
        (l.detalhes || '').toLowerCase().includes(search.toLowerCase())
      )
    : logs;

  return (
    <div className="flex-1 overflow-auto">
      <AdminHeader onRefresh={fetchLogs} loading={loading} />

      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Logs do Sistema</h2>
            <p className="text-slate-500 text-sm mt-1">Registro das últimas atividades</p>
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar logs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all w-52"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl flex items-center gap-2">
            <span>❌</span> {error}
            <button onClick={fetchLogs} className="ml-auto flex items-center gap-1 font-medium hover:underline">
              <RefreshCw size={14} /> Tentar novamente
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="divide-y divide-slate-50">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
                    <div className="h-3 bg-slate-100 rounded-lg w-2/3" />
                  </div>
                  <div className="h-3 bg-slate-100 rounded-lg w-28" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Activity size={44} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">Nenhum log encontrado</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map((log, i) => {
                const cfg = logConfig[log.acao] || { icon: '📝', color: 'bg-slate-50 text-slate-600 border-slate-200', label: log.acao };
                return (
                  <div key={i} className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50/60 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${cfg.color}`}>
                      <span className="text-base">{cfg.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 truncate">{log.detalhes || '—'}</p>
                      {log.ip && (
                        <p className="text-xs text-slate-300 mt-0.5 font-mono">IP: {log.ip}</p>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 flex-shrink-0 whitespace-nowrap">
                      {formatDate(log.data_hora)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-50 bg-slate-50/50">
              <p className="text-xs text-slate-400 text-center">
                Exibindo os {filtered.length} eventos mais recentes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
