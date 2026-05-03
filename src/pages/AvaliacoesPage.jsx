import React, { useState } from 'react';
import { ClipboardList, ChevronDown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Header from '../components/Header';

const OPCOES = {
  participacao: [
    { value: 'ativa', label: '⚡ Ativa', color: 'chip-sage' },
    { value: 'moderada', label: '🌤 Moderada', color: 'chip-amber' },
    { value: 'baixa', label: '🌧 Baixa', color: 'chip-coral' },
  ],
  comportamento: [
    { value: 'timido', label: '🐢 Tímido(a)', color: 'chip-primary' },
    { value: 'interativo', label: '🌟 Interativo(a)', color: 'chip-sage' },
    { value: 'colaborativo', label: '🤝 Colaborativo(a)', color: 'chip-amber' },
  ],
  desenvolvimento: [
    { value: 'avancado', label: '🚀 Avançado', color: 'chip-sage' },
    { value: 'em_processo', label: '📈 Em Processo', color: 'chip-amber' },
    { value: 'necessita_apoio', label: '🤲 Necessita Apoio', color: 'chip-coral' },
  ],
  linguagemOral: [
    { value: 'fluente', label: '💬 Fluente', color: 'chip-sage' },
    { value: 'em_processo', label: '📝 Em Processo', color: 'chip-amber' },
    { value: 'inicial', label: '🌱 Inicial', color: 'chip-coral' },
  ],
  interesseLeitura: [
    { value: 'alto', label: '📚 Alto', color: 'chip-sage' },
    { value: 'medio', label: '📖 Médio', color: 'chip-amber' },
    { value: 'baixo', label: '📄 Baixo', color: 'chip-coral' },
  ],
  matematicaContagem: [
    { value: 'avancado', label: '🔢 Avançado', color: 'chip-sage' },
    { value: 'em_processo', label: '📊 Em Processo', color: 'chip-amber' },
    { value: 'inicial', label: '🌱 Inicial', color: 'chip-coral' },
  ],
  motorAmplo: [
    { value: 'excelente', label: '⭐ Excelente', color: 'chip-sage' },
    { value: 'bom', label: '👍 Bom', color: 'chip-primary' },
    { value: 'em_processo', label: '📈 Em Processo', color: 'chip-amber' },
  ],
};

function ChipGroup({ label, field, value, onChange }) {
  const opcoes = OPCOES[field] || [];
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex flex-wrap gap-2">
        {opcoes.map(op => (
          <button
            key={op.value}
            type="button"
            onClick={() => onChange(field, op.value)}
            className={`chip ${op.color} ${value === op.value ? 'selected' : ''}`}
          >
            {op.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AvaliacoesPage() {
  const { store, addAvaliacao } = useApp();
  const [alunoId, setAlunoId] = useState('');
  const [planoId, setPlanoId] = useState('');
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    participacao: 'ativa',
    comportamento: 'interativo',
    desenvolvimento: 'em_processo',
    linguagemOral: 'em_processo',
    interesseLeitura: 'medio',
    matematicaContagem: 'em_processo',
    motorAmplo: 'bom',
    observacoes: '',
  });

  const aluno = store.alunos.find(a => a.id === Number(alunoId));
  const existing = alunoId && planoId
    ? store.avaliacoes.find(a => a.alunoId === Number(alunoId) && a.planoId === Number(planoId))
    : null;

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!alunoId || !planoId) return;
    addAvaliacao({ ...form, alunoId: Number(alunoId), planoId: Number(planoId) });
    setSaved(true);
  };

  // Load existing evaluation when aluno+plano selected
  React.useEffect(() => {
    if (existing) {
      setForm({
        participacao: existing.participacao || 'ativa',
        comportamento: existing.comportamento || 'interativo',
        desenvolvimento: existing.desenvolvimento || 'em_processo',
        linguagemOral: existing.linguagemOral || 'em_processo',
        interesseLeitura: existing.interesseLeitura || 'medio',
        matematicaContagem: existing.matematicaContagem || 'em_processo',
        motorAmplo: existing.motorAmplo || 'bom',
        observacoes: existing.observacoes || '',
      });
    }
  }, [alunoId, planoId]);

  return (
    <div className="flex-1 overflow-auto">
      <Header
        title="Avaliações"
        subtitle="Avalie o desenvolvimento individual de cada aluno"
      />

      <div className="p-8 animate-fade-in">
        <div className="max-w-3xl mx-auto">
          {/* Seleção de Aluno e Plano */}
          <div className="card mb-6">
            <h2 className="section-title">Selecione o Aluno e o Plano</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Aluno(a)</label>
                <div className="relative">
                  <select
                    className="select-field"
                    value={alunoId}
                    onChange={e => { setAlunoId(e.target.value); setSaved(false); }}
                  >
                    <option value="">Selecione o(a) aluno(a)...</option>
                    {store.alunos.map(a => (
                      <option key={a.id} value={a.id}>{a.nome} — {a.turma}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="label">Plano de Aula</label>
                <div className="relative">
                  <select
                    className="select-field"
                    value={planoId}
                    onChange={e => { setPlanoId(e.target.value); setSaved(false); }}
                  >
                    <option value="">Selecione o plano...</option>
                    {store.planosAula.map(p => (
                      <option key={p.id} value={p.id}>{p.tema}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {aluno && (
              <div className="mt-4 p-3 bg-primary-50 rounded-xl flex items-center gap-3">
                <div className={`w-10 h-10 ${aluno.avatarColor || 'bg-primary-100 text-primary-700'} rounded-xl flex items-center justify-center font-bold text-sm`}>
                  {aluno.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <p className="font-semibold text-primary-800 text-sm">{aluno.nome}</p>
                  <p className="text-xs text-primary-600">{aluno.turma} · {aluno.idade} anos · {aluno.periodo}</p>
                </div>
                {existing && <span className="ml-auto badge badge-sage text-xs">Avaliação existente</span>}
              </div>
            )}
          </div>

          {/* Formulário de Avaliação */}
          {alunoId && planoId && (
            <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
              <div className="card space-y-6">
                <h2 className="section-title">Perfil Comportamental e Social</h2>

                <ChipGroup label="Participação nas atividades" field="participacao" value={form.participacao} onChange={handleChange} />
                <ChipGroup label="Comportamento social" field="comportamento" value={form.comportamento} onChange={handleChange} />
                <ChipGroup label="Nível de desenvolvimento geral" field="desenvolvimento" value={form.desenvolvimento} onChange={handleChange} />
              </div>

              <div className="card space-y-6">
                <h2 className="section-title">Desenvolvimento de Habilidades</h2>

                <ChipGroup label="Linguagem oral" field="linguagemOral" value={form.linguagemOral} onChange={handleChange} />
                <ChipGroup label="Interesse por leitura" field="interesseLeitura" value={form.interesseLeitura} onChange={handleChange} />
                <ChipGroup label="Raciocínio lógico-matemático" field="matematicaContagem" value={form.matematicaContagem} onChange={handleChange} />
                <ChipGroup label="Desenvolvimento motor" field="motorAmplo" value={form.motorAmplo} onChange={handleChange} />
              </div>

              <div className="card">
                <label className="label">Observações Livres</label>
                <textarea
                  className="textarea-field"
                  rows={4}
                  placeholder="Adicione observações complementares sobre o desenvolvimento desta criança, comportamentos específicos, necessidades identificadas, avanços notáveis..."
                  value={form.observacoes}
                  onChange={e => handleChange('observacoes', e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1 justify-center py-3">
                  {existing ? 'Atualizar Avaliação' : 'Salvar Avaliação'}
                </button>
              </div>

              {saved && (
                <div className="bg-sage-50 border border-sage-200 text-sage-700 text-sm px-4 py-3 rounded-xl text-center font-medium animate-fade-in">
                  ✓ Avaliação salva! Agora você pode gerar o relatório.
                </div>
              )}
            </form>
          )}

          {!alunoId || !planoId ? (
            <div className="card flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <ClipboardList size={28} className="text-slate-400" />
              </div>
              <p className="font-semibold text-slate-700">Selecione um aluno e um plano</p>
              <p className="text-slate-500 text-sm mt-1">para iniciar a avaliação.</p>
            </div>
          ) : null}

          {/* Avaliações Recentes */}
          {store.avaliacoes.length > 0 && (
            <div className="card mt-6">
              <h2 className="section-title">Avaliações Registradas</h2>
              <div className="space-y-3">
                {store.avaliacoes.map(av => {
                  const al = store.alunos.find(a => a.id === av.alunoId);
                  const pl = store.planosAula.find(p => p.id === av.planoId);
                  if (!al || !pl) return null;
                  return (
                    <div key={av.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
                      <div className={`w-10 h-10 ${al.avatarColor || 'bg-primary-100 text-primary-700'} rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                        {al.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{al.nome}</p>
                        <p className="text-xs text-slate-500 truncate">{pl.tema}</p>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        <span className="badge badge-primary text-xs">{av.desenvolvimento?.replace('_', ' ')}</span>
                        <span className="badge bg-slate-200 text-slate-600 text-xs">{av.data}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
