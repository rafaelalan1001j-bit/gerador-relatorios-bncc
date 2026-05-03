import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Users, X, ChevronDown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Header from '../components/Header';

const AVATAR_COLORS = [
  'bg-primary-200 text-primary-700',
  'bg-coral-200 text-coral-700',
  'bg-sage-200 text-sage-700',
  'bg-amber-200 text-amber-700',
  'bg-purple-200 text-purple-700',
];

const IDADES = [3, 4, 5];
const PERIODOS = ['Manhã', 'Tarde', 'Integral'];

function AlunoModal({ aluno, turmas, onSave, onClose }) {
  const [form, setForm] = useState({
    nome: aluno?.nome || '',
    idade: aluno?.idade || 4,
    turma: aluno?.turma || turmas[0] || '',
    periodo: aluno?.periodo || 'Manhã',
    avatarColor: aluno?.avatarColor || AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nome.trim()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-medium w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {aluno ? 'Editar Aluno(a)' : 'Cadastrar Novo(a) Aluno(a)'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Avatar Preview */}
          <div className="flex justify-center mb-2">
            <div className={`w-16 h-16 ${form.avatarColor} rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm`}>
              {form.nome ? form.nome.split(' ').map(n => n[0]).slice(0, 2).join('') : '?'}
            </div>
          </div>

          <div>
            <label className="label">Nome completo *</label>
            <input
              type="text"
              className="input-field"
              placeholder="Ex: Maria Eduarda Santos"
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Idade</label>
              <div className="relative">
                <select
                  className="select-field"
                  value={form.idade}
                  onChange={e => setForm({ ...form, idade: Number(e.target.value) })}
                >
                  {IDADES.map(i => (
                    <option key={i} value={i}>{i} anos</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="label">Período</label>
              <div className="relative">
                <select
                  className="select-field"
                  value={form.periodo}
                  onChange={e => setForm({ ...form, periodo: e.target.value })}
                >
                  {PERIODOS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="label">Turma</label>
            <div className="relative">
              <select
                className="select-field"
                value={form.turma}
                onChange={e => setForm({ ...form, turma: e.target.value })}
              >
                {turmas.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancelar
            </button>
            <button type="submit" className="btn-primary flex-1 justify-center">
              {aluno ? 'Salvar Alterações' : 'Cadastrar Aluno(a)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AlunosPage() {
  const { store, turmas, addAluno, updateAluno, deleteAluno } = useApp();
  const [search, setSearch] = useState('');
  const [filterTurma, setFilterTurma] = useState('');
  const [modal, setModal] = useState(null); // null | 'new' | aluno object

  const filtered = store.alunos.filter(a => {
    const matchName = a.nome.toLowerCase().includes(search.toLowerCase());
    const matchTurma = !filterTurma || a.turma === filterTurma;
    return matchName && matchTurma;
  });

  const handleSave = (form) => {
    if (modal?.id) {
      updateAluno(modal.id, form);
    } else {
      addAluno(form);
    }
    setModal(null);
  };

  const handleDelete = (aluno) => {
    if (confirm(`Remover ${aluno.nome}?`)) deleteAluno(aluno.id);
  };

  return (
    <div className="flex-1 overflow-auto">
      <Header
        title="Alunos"
        subtitle={`${store.alunos.length} aluno(s) cadastrado(s)`}
        actions={
          <button onClick={() => setModal('new')} className="btn-primary">
            <Plus size={16} />
            Novo Aluno
          </button>
        }
      />

      <div className="p-8 animate-fade-in">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Buscar aluno(a)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="relative sm:w-48">
            <select
              className="select-field"
              value={filterTurma}
              onChange={e => setFilterTurma(e.target.value)}
            >
              <option value="">Todas as turmas</option>
              {turmas.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <Users size={28} className="text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700">Nenhum aluno encontrado</p>
            <p className="text-slate-500 text-sm mt-1">
              {search ? 'Tente buscar com outro nome.' : 'Clique em "Novo Aluno" para começar.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(aluno => {
              const initials = aluno.nome.split(' ').map(n => n[0]).slice(0, 2).join('');
              const hasAvaliacao = store.avaliacoes.some(a => a.alunoId === aluno.id);
              return (
                <div key={aluno.id} className="card-hover group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 ${aluno.avatarColor || 'bg-primary-100 text-primary-700'} rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm`}>
                      {initials}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setModal(aluno)}
                        className="p-2 rounded-lg hover:bg-primary-50 text-slate-400 hover:text-primary-600 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(aluno)}
                        className="p-2 rounded-lg hover:bg-coral-50 text-slate-400 hover:text-coral-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="font-semibold text-slate-800 leading-tight">{aluno.nome}</p>
                  <p className="text-sm text-slate-500 mt-1">{aluno.turma}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="badge badge-primary">{aluno.idade} anos</span>
                    <span className="badge bg-slate-100 text-slate-600">{aluno.periodo}</span>
                    {hasAvaliacao && <span className="badge badge-sage">Avaliado</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modal && (
        <AlunoModal
          aluno={modal === 'new' ? null : modal}
          turmas={turmas}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
