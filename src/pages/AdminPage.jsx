import React from 'react';
import { Settings, School, Users, Database, Info } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Header from '../components/Header';

export default function AdminPage() {
  const { escola, store, user } = useApp();

  const stats = [
    { label: 'Total de Alunos', value: store.alunos.length, icon: Users, color: 'text-primary-600 bg-primary-100' },
    { label: 'Planos de Aula', value: store.planosAula.length, icon: Database, color: 'text-coral-600 bg-coral-100' },
    { label: 'Avaliações', value: store.avaliacoes.length, icon: Database, color: 'text-sage-600 bg-sage-100' },
    { label: 'Relatórios', value: store.relatorios.length, icon: Database, color: 'text-amber-600 bg-amber-100' },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <Header title="Administração" subtitle="Configurações do sistema" />

      <div className="p-8 max-w-3xl animate-fade-in space-y-6">
        {/* School info */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <School size={20} className="text-primary-600" />
            </div>
            <h2 className="section-title mb-0">Dados da Escola</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Nome', value: escola?.nome },
              { label: 'Cidade/UF', value: `${escola?.cidade}/${escola?.uf}` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                <p className="font-semibold text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Professor info */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-sage-100 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-sage-600" />
            </div>
            <h2 className="section-title mb-0">Dados do Professor</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Nome', value: user?.nome },
              { label: 'E-mail', value: user?.email },
              { label: 'Turma', value: user?.turma },
              { label: 'Período', value: user?.periodo },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                <p className="font-semibold text-slate-800">{value || '—'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Database size={20} className="text-amber-600" />
            </div>
            <h2 className="section-title mb-0">Estatísticas do Sistema</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="text-center p-4 bg-slate-50 rounded-2xl">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <Icon size={18} />
                </div>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="card bg-primary-50 border-primary-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Info size={20} className="text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold text-primary-800 mb-1">Sobre o Sistema</h3>
              <p className="text-sm text-primary-700 leading-relaxed">
                O <strong>BNCC Reports</strong> é uma plataforma profissional para geração automática de relatórios
                pedagógicos da educação infantil, alinhados à Base Nacional Comum Curricular (BNCC).
                Versão 1.0 — 2026.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
