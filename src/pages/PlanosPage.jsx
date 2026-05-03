import React, { useState } from 'react';
import { Plus, BookOpen, X, ChevronDown, Calendar, Clock } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Header from '../components/Header';

const CAMPOS_EXPERIENCIA = [
  'O eu, o outro e o nós',
  'Corpo, gestos e movimentos',
  'Traços, sons, cores e formas',
  'Escuta, fala, pensamento e imaginação',
  'Espaços, tempos, quantidades, relações e transformações',
];

const CAMPO_COLORS = {
  'O eu, o outro e o nós': 'chip-primary',
  'Corpo, gestos e movimentos': 'chip-coral',
  'Traços, sons, cores e formas': 'chip-amber',
  'Escuta, fala, pensamento e imaginação': 'chip-sage',
  'Espaços, tempos, quantidades, relações e transformações': '',
};

const CAMPO_BADGE_COLORS = {
  'O eu, o outro e o nós': 'badge-primary',
  'Corpo, gestos e movimentos': 'badge-coral',
  'Traços, sons, cores e formas': 'badge-amber',
  'Escuta, fala, pensamento e imaginação': 'badge-sage',
  'Espaços, tempos, quantidades, relações e transformações': 'bg-purple-100 text-purple-700',
};

function PlanoModal({ onSave, onClose, habilidades }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    tema: '',
    objetivos: '',
    camposExperiencia: [],
    habilidades: [],
    atividades: '',
    duracao: '1 semana',
  });

  const toggleCampo = (campo) => {
    setForm(prev => ({
      ...prev,
      camposExperiencia: prev.camposExperiencia.includes(campo)
        ? prev.camposExperiencia.filter(c => c !== campo)
        : [...prev.camposExperiencia, campo],
    }));
  };

  const toggleHabilidade = (id) => {
    setForm(prev => ({
      ...prev,
      habilidades: prev.habilidades.includes(id)
        ? prev.habilidades.filter(h => h !== id)
        : [...prev.habilidades, id],
    }));
  };

  const handleSubmit = () => {
    if (!form.tema.trim()) return;
    onSave(form);
  };

  // Group habilidades by selected campos
  const habilidadesFiltradas = form.camposExperiencia.length > 0
    ? habilidades.filter(h => form.camposExperiencia.includes(h.campo))
    : habilidades;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-medium w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Novo Plano de Aula</h2>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className={`h-1.5 w-12 rounded-full transition-colors ${s <= step ? 'bg-primary-500' : 'bg-slate-200'}`}
                />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Etapa 1 — Informações Gerais</p>
              <div>
                <label className="label">Tema / Sequência Didática *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: O mundo das histórias e narrativas"
                  value={form.tema}
                  onChange={e => setForm({ ...form, tema: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Objetivos de Aprendizagem</label>
                <textarea
                  className="textarea-field"
                  rows={3}
                  placeholder="Descreva os objetivos da sequência didática..."
                  value={form.objetivos}
                  onChange={e => setForm({ ...form, objetivos: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Atividades Realizadas</label>
                <textarea
                  className="textarea-field"
                  rows={3}
                  placeholder="Descreva as atividades desenvolvidas..."
                  value={form.atividades}
                  onChange={e => setForm({ ...form, atividades: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Duração</label>
                <div className="relative">
                  <select className="select-field" value={form.duracao} onChange={e => setForm({ ...form, duracao: e.target.value })}>
                    {['1 semana', '2 semanas', '3 semanas', '1 mês', '2 meses'].map(d => <option key={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Etapa 2 — Campos de Experiência BNCC</p>
              <p className="text-sm text-slate-600">Selecione os campos de experiência trabalhados nesta sequência:</p>
              <div className="space-y-2">
                {CAMPOS_EXPERIENCIA.map(campo => (
                  <button
                    key={campo}
                    type="button"
                    onClick={() => toggleCampo(campo)}
                    className={`chip w-full text-left ${form.camposExperiencia.includes(campo) ? 'selected' : ''}`}
                  >
                    {campo}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Etapa 3 — Habilidades BNCC</p>
              <p className="text-sm text-slate-600">
                Selecione as habilidades trabalhadas:
                {form.camposExperiencia.length === 0 && (
                  <span className="text-amber-600 ml-1">(Todas as habilidades — volte à etapa 2 para filtrar)</span>
                )}
              </p>
              <div className="space-y-3">
                {habilidadesFiltradas.map(h => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => toggleHabilidade(h.id)}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 ${
                      form.habilidades.includes(h.id)
                        ? 'border-primary-400 bg-primary-50'
                        : 'border-slate-200 hover:border-primary-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`badge badge-primary mt-0.5 flex-shrink-0 ${form.habilidades.includes(h.id) ? '' : 'bg-slate-100 text-slate-500'}`}>
                        {h.id}
                      </span>
                      <span className="text-sm text-slate-700">{h.descricao}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 flex gap-3">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} className="btn-secondary flex-1 justify-center">
              ← Voltar
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && !form.tema.trim()}
              className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo →
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn-primary flex-1 justify-center">
              Salvar Plano
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlanosPage() {
  const { store, habilidadesBNCC, addPlano } = useApp();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex-1 overflow-auto">
      <Header
        title="Planos de Aula"
        subtitle={`${store.planosAula.length} plano(s) cadastrado(s)`}
        actions={
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={16} />
            Novo Plano
          </button>
        }
      />

      <div className="p-8 animate-fade-in">
        {store.planosAula.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <BookOpen size={28} className="text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700">Nenhum plano cadastrado</p>
            <p className="text-slate-500 text-sm mt-1">Crie seu primeiro plano de aula.</p>
            <button onClick={() => setShowModal(true)} className="btn-primary mt-5">
              <Plus size={16} />
              Criar Plano
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {store.planosAula.map(plano => (
              <div key={plano.id} className="card-hover">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-coral-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <BookOpen size={20} className="text-coral-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 leading-tight">{plano.tema}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar size={11} /> {plano.data}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {plano.duracao}</span>
                    </div>
                  </div>
                </div>

                {plano.objetivos && (
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{plano.objetivos}</p>
                )}

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {plano.camposExperiencia?.map(campo => (
                    <span key={campo} className={`badge text-xs ${CAMPO_BADGE_COLORS[campo] || 'badge-primary'}`}>
                      {campo.split(',')[0].substring(0, 20)}...
                    </span>
                  ))}
                </div>

                {plano.habilidades?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {plano.habilidades.map(h => (
                      <span key={h} className="badge bg-slate-100 text-slate-600 text-xs">{h}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <PlanoModal
          habilidades={habilidadesBNCC}
          onSave={(form) => { addPlano(form); setShowModal(false); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
