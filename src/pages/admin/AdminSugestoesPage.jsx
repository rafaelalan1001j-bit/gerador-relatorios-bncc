import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare, Trash2, CheckCircle, Clock, Search,
  Filter, ChevronLeft, ChevronRight, RefreshCw, Eye, AlertCircle, X
} from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import { useAdmin } from '../../contexts/AdminContext';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function StatusBadge({ status }) {
  if (status === 'pendente') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
        <Clock size={11} /> Pendente
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
      <CheckCircle size={11} /> Lida
    </span>
  );
}

function ModalSugestao({ sugestao, onClose, onMarkRead, onDelete }) {
  if (!sugestao) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-indigo-600" />
            <h3 className="font-bold text-slate-800">Detalhes da Sugestão #{sugestao.id}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nome</p>
              <p className="font-medium text-slate-800">{sugestao.nome || 'Anônimo'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">E-mail</p>
              <p className="font-medium text-slate-800">{sugestao.email || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</p>
              <StatusBadge status={sugestao.status} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Data</p>
              <p className="font-medium text-slate-700 text-sm">{formatDate(sugestao.data_criacao)}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mensagem</p>
            <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {sugestao.mensagem}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => { onDelete(sugestao.id); onClose(); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={15} /> Excluir
          </button>
          {sugestao.status === 'pendente' ? (
            <button
              onClick={() => { onMarkRead(sugestao.id, 'lida'); onClose(); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              <CheckCircle size={15} /> Marcar como Lida
            </button>
          ) : (
            <button
              onClick={() => { onMarkRead(sugestao.id, 'pendente'); onClose(); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              <Clock size={15} /> Marcar como Pendente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminSugestoesPage() {
  const { api } = useAdmin();
  const [sugestoes, setSugestoes] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [selectedSugestao, setSelectedSugestao] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchSugestoes = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (filterStatus) params.append('status', filterStatus);
      const res = await api.get(`/admin/sugestoes?${params}`);
      setSugestoes(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar sugestões.');
    } finally {
      setLoading(false);
    }
  }, [api, filterStatus]);

  useEffect(() => { fetchSugestoes(1); }, [fetchSugestoes]);

  const handleMarkStatus = async (id, status) => {
    try {
      await api.put(`/admin/sugestoes/${id}`, { status });
      setSugestoes(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      showToast(`Sugestão marcada como "${status}".`);
    } catch (err) {
      showToast('Erro ao atualizar status.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/sugestoes/${id}`);
      setSugestoes(prev => prev.filter(s => s.id !== id));
      showToast('Sugestão excluída com sucesso.');
      setConfirmDelete(null);
    } catch (err) {
      showToast('Erro ao excluir sugestão.');
    }
  };

  const filtered = search
    ? sugestoes.filter(s =>
        (s.nome || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.email || '').toLowerCase().includes(search.toLowerCase()) ||
        s.mensagem.toLowerCase().includes(search.toLowerCase())
      )
    : sugestoes;

  return (
    <div className="flex-1 overflow-auto">
      <AdminHeader onRefresh={() => fetchSugestoes(pagination.page)} loading={loading} />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 bg-slate-800 text-white text-sm font-medium rounded-2xl shadow-xl flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Modal */}
      <ModalSugestao
        sugestao={selectedSugestao}
        onClose={() => setSelectedSugestao(null)}
        onMarkRead={handleMarkStatus}
        onDelete={(id) => setConfirmDelete(id)}
      />

      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <h3 className="font-bold text-slate-800">Excluir Sugestão?</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6">Esta ação é permanente e não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                Cancelar
              </button>
              <button onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors">
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-8 max-w-7xl mx-auto">
        {/* Header + Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Sugestões</h2>
            <p className="text-slate-500 text-sm mt-1">{pagination.total} sugestão(ões) no total</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Busca */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar sugestão..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all w-48"
              />
            </div>

            {/* Filtro status */}
            <div className="relative">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="pl-8 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-indigo-400 appearance-none cursor-pointer"
              >
                <option value="">Todas</option>
                <option value="pendente">Pendentes</option>
                <option value="lida">Lidas</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl">
            {error}
          </div>
        )}

        {/* Tabela */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nome / E-mail</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Mensagem</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading && filtered.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-slate-100 rounded-lg animate-pulse" style={{ width: j === 2 ? '80%' : '60%' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <MessageSquare size={40} className="text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-400 font-medium">Nenhuma sugestão encontrada</p>
                      {search && <p className="text-slate-300 text-sm mt-1">Tente limpar o filtro de busca</p>}
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-400 font-mono">#{s.id}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-700">{s.nome || 'Anônimo'}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{s.email || '—'}</p>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm text-slate-600 truncate">{s.mensagem}</p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-500">{formatDate(s.data_criacao)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedSugestao(s)}
                            className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                            title="Visualizar"
                          >
                            <Eye size={16} />
                          </button>
                          {s.status === 'pendente' ? (
                            <button
                              onClick={() => handleMarkStatus(s.id, 'lida')}
                              className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                              title="Marcar como Lida"
                            >
                              <CheckCircle size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMarkStatus(s.id, 'pendente')}
                              className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                              title="Marcar como Pendente"
                            >
                              <Clock size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => setConfirmDelete(s.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50">
              <p className="text-xs text-slate-400">
                Página {pagination.page} de {pagination.totalPages} • {pagination.total} registros
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchSugestoes(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-medium text-slate-600 px-2">{pagination.page}</span>
                <button
                  onClick={() => fetchSugestoes(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
