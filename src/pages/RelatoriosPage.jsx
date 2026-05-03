import React, { useState, useRef } from 'react';
import { FileText, Plus, Download, Printer, Edit3, Save, ChevronDown, Sparkles, CheckCircle, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Header from '../components/Header';
import { gerarRelatorio } from '../utils/reportGenerator';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function GerarModal({ onGerar, onClose }) {
  const { store } = useApp();
  const [alunoId, setAlunoId] = useState('');
  const [planoId, setPlanoId] = useState('');

  const aluno = store.alunos.find(a => a.id === Number(alunoId));
  const avaliacao = alunoId && planoId
    ? store.avaliacoes.find(a => a.alunoId === Number(alunoId) && a.planoId === Number(planoId))
    : null;
  const plano = store.planosAula.find(p => p.id === Number(planoId));

  const canGenerate = aluno && avaliacao && plano;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-medium w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Gerar Novo Relatório</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="label">Aluno(a)</label>
            <div className="relative">
              <select className="select-field" value={alunoId} onChange={e => setAlunoId(e.target.value)}>
                <option value="">Selecione o(a) aluno(a)...</option>
                {store.alunos.map(a => (
                  <option key={a.id} value={a.id}>{a.nome}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="label">Plano de Aula</label>
            <div className="relative">
              <select className="select-field" value={planoId} onChange={e => setPlanoId(e.target.value)}>
                <option value="">Selecione o plano...</option>
                {store.planosAula.map(p => (
                  <option key={p.id} value={p.id}>{p.tema}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {alunoId && planoId && !avaliacao && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl">
              ⚠️ Este aluno ainda não possui avaliação para este plano. Faça a avaliação primeiro.
            </div>
          )}

          {canGenerate && (
            <div className="bg-sage-50 border border-sage-200 text-sage-700 text-sm px-4 py-3 rounded-xl">
              ✓ Dados prontos! Clique em "Gerar Relatório" para criar o documento.
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancelar</button>
            <button
              onClick={() => canGenerate && onGerar(aluno, avaliacao, plano)}
              disabled={!canGenerate}
              className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles size={16} />
              Gerar Relatório
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RelatorioViewer({ relatorio, alunoNome, onSave, onClose }) {
  const [editandoIdx, setEditandoIdx] = useState(null);
  const [secoes, setSecoes] = useState(relatorio.secoes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const reportRef = useRef(null);

  const updateSecao = (idx, conteudo) => {
    setSecoes(prev => prev.map((s, i) => i === idx ? { ...s, conteudo } : s));
    setSaved(false);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      onSave({ ...relatorio, secoes, titulo: relatorio.titulo });
      setSaving(false);
      setSaved(true);
    }, 600);
  };

  const handlePrint = () => window.print();

  const handlePDF = async () => {
    const el = reportRef.current;
    if (!el) return;
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = pdfHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      pdf.save(`Relatorio_${alunoNome.replace(/ /g, '_')}.pdf`);
    } catch (e) {
      alert('Erro ao gerar PDF. Tente usar a opção Imprimir.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-medium w-full max-w-4xl my-4 animate-scale-in flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 no-print">
          <div>
            <h2 className="font-bold text-slate-800">{relatorio.titulo}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{relatorio.subtitulo}</p>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="badge badge-sage animate-fade-in">
                <CheckCircle size={12} /> Salvo
              </span>
            )}
            <button onClick={handlePDF} className="btn-secondary py-2 px-3 text-sm">
              <Download size={15} />
              PDF
            </button>
            <button onClick={handlePrint} className="btn-secondary py-2 px-3 text-sm">
              <Printer size={15} />
              Imprimir
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-3 text-sm">
              <Save size={15} />
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100">
              <X size={20} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
          <div ref={reportRef} className="max-w-2xl mx-auto report-page">
            {/* Report Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-primary-100">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                <FileText size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 font-serif">{relatorio.titulo}</h1>
              <p className="text-slate-600 mt-2 text-sm">{relatorio.subtitulo}</p>
              <p className="text-xs text-slate-400 mt-1">
                Professora: {relatorio.professor} · Gerado em {new Date(relatorio.geradoEm).toLocaleDateString('pt-BR')}
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {secoes.map((secao, idx) => (
                <div key={idx} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base font-bold text-primary-700">{secao.titulo}</h2>
                    <button
                      onClick={() => setEditandoIdx(editandoIdx === idx ? null : idx)}
                      className="no-print opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-primary-50 text-slate-400 hover:text-primary-600"
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>

                  {editandoIdx === idx ? (
                    <textarea
                      className="textarea-field text-sm leading-relaxed"
                      rows={6}
                      value={secao.conteudo}
                      onChange={e => updateSecao(idx, e.target.value)}
                      onBlur={() => setEditandoIdx(null)}
                      autoFocus
                    />
                  ) : (
                    <div className="text-sm text-slate-700 leading-relaxed font-serif whitespace-pre-line">
                      {secao.conteudo}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-10 pt-6 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500">{relatorio.assinatura}</p>
              <div className="mt-6 flex justify-around text-sm">
                <div className="text-center">
                  <div className="w-40 border-b border-slate-400 mb-1 mx-auto"></div>
                  <p className="text-xs text-slate-500">Professora Responsável</p>
                </div>
                <div className="text-center">
                  <div className="w-40 border-b border-slate-400 mb-1 mx-auto"></div>
                  <p className="text-xs text-slate-500">Coordenação Pedagógica</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RelatoriosPage() {
  const { store, escola, saveRelatorio } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [activeRelatorio, setActiveRelatorio] = useState(null);

  const handleGerar = (aluno, avaliacao, plano) => {
    const rel = gerarRelatorio(aluno, avaliacao, plano, escola);
    const saved = saveRelatorio({
      ...rel,
      alunoId: aluno.id,
      planoId: plano.id,
    });
    setShowModal(false);
    setActiveRelatorio(saved);
  };

  const handleSave = (relatorio) => {
    saveRelatorio(relatorio);
    setActiveRelatorio(relatorio);
  };

  return (
    <div className="flex-1 overflow-auto">
      <Header
        title="Relatórios"
        subtitle={`${store.relatorios.length} relatório(s) gerado(s)`}
        actions={
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Sparkles size={16} />
            Gerar Relatório
          </button>
        }
      />

      <div className="p-8 animate-fade-in">
        {store.relatorios.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mb-5 shadow-soft">
              <FileText size={36} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-700">Nenhum relatório ainda</h2>
            <p className="text-slate-500 text-sm mt-2 max-w-xs">
              Gere seu primeiro relatório pedagógico automático baseado nas avaliações dos alunos.
            </p>
            <button onClick={() => setShowModal(true)} className="btn-primary mt-6">
              <Sparkles size={16} />
              Gerar Primeiro Relatório
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {store.relatorios.map(rel => {
              const aluno = store.alunos.find(a => a.id === rel.alunoId);
              return (
                <div
                  key={rel.id}
                  className="card-hover"
                  onClick={() => setActiveRelatorio(rel)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <FileText size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">
                        {rel.titulo || 'Relatório Individual'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{rel.subtitulo}</p>
                    </div>
                  </div>

                  {aluno && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                      <div className={`w-7 h-7 ${aluno.avatarColor || 'bg-primary-100 text-primary-700'} rounded-lg flex items-center justify-center font-bold text-xs`}>
                        {aluno.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{aluno.nome}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-slate-400">
                      {new Date(rel.atualizadoEm || rel.geradoEm).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="badge badge-primary text-xs">Abrir</span>
                  </div>
                </div>
              );
            })}

            {/* Add new card */}
            <button
              onClick={() => setShowModal(true)}
              className="card border-2 border-dashed border-slate-200 hover:border-primary-400 hover:bg-primary-50 transition-all duration-200 flex flex-col items-center justify-center py-12 text-center group"
            >
              <div className="w-12 h-12 bg-slate-100 group-hover:bg-primary-100 rounded-2xl flex items-center justify-center mb-3 transition-colors">
                <Plus size={20} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
              </div>
              <p className="font-semibold text-slate-500 group-hover:text-primary-700 transition-colors text-sm">
                Novo Relatório
              </p>
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <GerarModal
          onGerar={handleGerar}
          onClose={() => setShowModal(false)}
        />
      )}

      {activeRelatorio && (
        <RelatorioViewer
          relatorio={activeRelatorio}
          alunoNome={store.alunos.find(a => a.id === activeRelatorio.alunoId)?.nome || 'Aluno'}
          onSave={handleSave}
          onClose={() => setActiveRelatorio(null)}
        />
      )}
    </div>
  );
}
