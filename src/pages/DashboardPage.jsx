import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, ClipboardList, FileText, TrendingUp, Award, Clock, Plus, MessageSquare } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Header from '../components/Header';
import SugestaoForm from '../components/SugestaoForm';

const colorVariants = [
  { bg: 'bg-primary-500', light: 'bg-primary-50', text: 'text-primary-700', icon: 'text-white' },
  { bg: 'bg-coral-500', light: 'bg-coral-50', text: 'text-coral-700', icon: 'text-white' },
  { bg: 'bg-sage-500', light: 'bg-sage-50', text: 'text-sage-700', icon: 'text-white' },
  { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-700', icon: 'text-white' },
];

const CAMPOS_BNCC = [
  { label: 'O eu, o outro e o nós', color: 'bg-primary-100 text-primary-700', short: 'EO' },
  { label: 'Corpo, gestos e movimentos', color: 'bg-coral-100 text-coral-700', short: 'CG' },
  { label: 'Traços, sons, cores e formas', color: 'bg-amber-100 text-amber-700', short: 'TS' },
  { label: 'Escuta, fala, pensamento e imaginação', color: 'bg-sage-100 text-sage-700', short: 'EF' },
  { label: 'Espaços, tempos, quantidades...', color: 'bg-purple-100 text-purple-700', short: 'ET' },
];

export default function DashboardPage() {
  const { store, user, escola } = useApp();
  const navigate = useNavigate();

  const stats = [
    {
      label: 'Alunos Cadastrados',
      value: store.alunos.length,
      icon: Users,
      color: colorVariants[0],
      action: () => navigate('/alunos'),
    },
    {
      label: 'Planos de Aula',
      value: store.planosAula.length,
      icon: BookOpen,
      color: colorVariants[1],
      action: () => navigate('/planos'),
    },
    {
      label: 'Avaliações Feitas',
      value: store.avaliacoes.length,
      icon: ClipboardList,
      color: colorVariants[2],
      action: () => navigate('/avaliacoes'),
    },
    {
      label: 'Relatórios Gerados',
      value: store.relatorios.length,
      icon: FileText,
      color: colorVariants[3],
      action: () => navigate('/relatorios'),
    },
  ];

  const alunosSemAvaliacao = store.alunos.filter(
    a => !store.avaliacoes.some(av => av.alunoId === a.id)
  );

  const recentRelatorios = [...store.relatorios]
    .sort((a, b) => new Date(b.atualizadoEm) - new Date(a.atualizadoEm))
    .slice(0, 3);

  return (
    <div className="flex-1 overflow-auto">
      <Header
        title={`Olá, ${user?.nome?.split(' ')[0]}! 👋`}
        subtitle={`${escola?.nome} — ${new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}`}
        actions={
          <button onClick={() => navigate('/relatorios')} className="btn-primary">
            <Plus size={16} />
            Novo Relatório
          </button>
        }
      />

      <div className="p-8 space-y-8 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map(({ label, value, icon: Icon, color, action }) => (
            <button
              key={label}
              onClick={action}
              className="card text-left hover:shadow-medium hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${color.bg} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={22} className={color.icon} />
                </div>
                <TrendingUp size={16} className="text-slate-300" />
              </div>
              <p className="text-3xl font-bold text-slate-800">{value}</p>
              <p className="text-sm text-slate-500 mt-1">{label}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="xl:col-span-1">
            <div className="card h-full">
              <h2 className="section-title">Ações Rápidas</h2>
              <div className="space-y-3">
                {[
                  { label: 'Cadastrar Novo Aluno', icon: Users, color: 'text-primary-600 bg-primary-50', to: '/alunos' },
                  { label: 'Criar Plano de Aula', icon: BookOpen, color: 'text-coral-600 bg-coral-50', to: '/planos' },
                  { label: 'Avaliar Aluno', icon: ClipboardList, color: 'text-sage-600 bg-sage-50', to: '/avaliacoes' },
                  { label: 'Gerar Relatório', icon: FileText, color: 'text-amber-600 bg-amber-50', to: '/relatorios' },
                ].map(({ label, icon: Icon, color, to }) => (
                  <button
                    key={label}
                    onClick={() => navigate(to)}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon size={18} />
                    </div>
                    <span className="font-medium text-slate-700 text-sm">{label}</span>
                    <span className="ml-auto text-slate-300 group-hover:text-slate-500 transition-colors">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Alunos sem avaliação */}
          <div className="xl:col-span-2">
            <div className="card h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title mb-0">Alunos Pendentes de Avaliação</h2>
                {alunosSemAvaliacao.length > 0 && (
                  <span className="badge badge-coral">{alunosSemAvaliacao.length} pendente(s)</span>
                )}
              </div>

              {alunosSemAvaliacao.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mb-3">
                    <Award size={28} className="text-sage-600" />
                  </div>
                  <p className="font-semibold text-slate-700">Todos os alunos avaliados!</p>
                  <p className="text-slate-500 text-sm mt-1">Ótimo trabalho. 🎉</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {alunosSemAvaliacao.slice(0, 5).map(aluno => (
                    <div
                      key={aluno.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className={`avatar ${aluno.avatarColor || 'bg-primary-100 text-primary-700'}`}>
                        {aluno.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 text-sm">{aluno.nome}</p>
                        <p className="text-xs text-slate-500">{aluno.turma} · {aluno.idade} anos</p>
                      </div>
                      <button
                        onClick={() => navigate('/avaliacoes')}
                        className="text-xs btn-primary py-1.5 px-3"
                      >
                        Avaliar
                      </button>
                    </div>
                  ))}
                  {alunosSemAvaliacao.length > 5 && (
                    <p className="text-sm text-slate-500 text-center pt-2">
                      +{alunosSemAvaliacao.length - 5} outros
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Campos de Experiência BNCC */}
        <div className="card">
          <h2 className="section-title">Campos de Experiência da BNCC</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {CAMPOS_BNCC.map(campo => (
              <div key={campo.label} className={`${campo.color} rounded-2xl p-4 text-center`}>
                <div className="text-2xl font-bold mb-1">{campo.short}</div>
                <p className="text-xs font-medium leading-tight">{campo.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        {recentRelatorios.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title mb-0">Relatórios Recentes</h2>
              <button onClick={() => navigate('/relatorios')} className="text-sm text-primary-600 font-semibold hover:text-primary-700">
                Ver todos →
              </button>
            </div>
            <div className="space-y-3">
              {recentRelatorios.map(rel => (
                <div key={rel.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-sm">{rel.titulo || 'Relatório'}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(rel.atualizadoEm).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/relatorios')}
                    className="badge badge-primary cursor-pointer hover:bg-primary-200 transition-colors"
                  >
                    Ver
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulário de Sugestões */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <MessageSquare size={20} className="text-primary-600" />
            </div>
            <div>
              <h2 className="section-title mb-0">Envie uma Sugestão</h2>
              <p className="text-sm text-slate-500 mt-0.5">Compartilhe ideias ou feedback sobre o sistema</p>
            </div>
          </div>
          <SugestaoForm />
        </div>
      </div>
    </div>
  );
}
