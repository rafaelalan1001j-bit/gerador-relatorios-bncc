import React, { createContext, useContext, useState, useEffect } from 'react';
import { initStore, saveData, mockData } from '../data/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [escola] = useState(mockData.escola);
  const [store, setStore] = useState(initStore());
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const login = (email, password) => {
    // Mock authentication
    if (email && password) {
      const prof = {
        ...mockData.professor,
        email,
      };
      setUser(prof);
      localStorage.setItem('bncc_user', JSON.stringify(prof));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bncc_user');
  };

  // Load saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('bncc_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Persist store changes
  useEffect(() => {
    saveData('alunos', store.alunos);
  }, [store.alunos]);

  useEffect(() => {
    saveData('planosAula', store.planosAula);
  }, [store.planosAula]);

  useEffect(() => {
    saveData('avaliacoes', store.avaliacoes);
  }, [store.avaliacoes]);

  useEffect(() => {
    saveData('relatorios', store.relatorios);
  }, [store.relatorios]);

  // CRUD helpers
  const addAluno = (aluno) => {
    const newAluno = { ...aluno, id: Date.now() };
    setStore(prev => ({ ...prev, alunos: [...prev.alunos, newAluno] }));
    showNotification(`Aluno(a) ${aluno.nome} cadastrado(a) com sucesso!`);
    return newAluno;
  };

  const updateAluno = (id, data) => {
    setStore(prev => ({
      ...prev,
      alunos: prev.alunos.map(a => a.id === id ? { ...a, ...data } : a),
    }));
    showNotification('Dados do(a) aluno(a) atualizados!');
  };

  const deleteAluno = (id) => {
    setStore(prev => ({
      ...prev,
      alunos: prev.alunos.filter(a => a.id !== id),
    }));
    showNotification('Aluno(a) removido(a).', 'info');
  };

  const addPlano = (plano) => {
    const newPlano = { ...plano, id: Date.now(), data: new Date().toISOString().split('T')[0] };
    setStore(prev => ({ ...prev, planosAula: [...prev.planosAula, newPlano] }));
    showNotification('Plano de aula cadastrado com sucesso!');
    return newPlano;
  };

  const addAvaliacao = (avaliacao) => {
    const newAv = { ...avaliacao, id: Date.now(), data: new Date().toISOString().split('T')[0] };
    // Replace if same aluno+plano
    setStore(prev => ({
      ...prev,
      avaliacoes: [
        ...prev.avaliacoes.filter(a => !(a.alunoId === avaliacao.alunoId && a.planoId === avaliacao.planoId)),
        newAv,
      ],
    }));
    showNotification('Avaliação salva com sucesso!');
    return newAv;
  };

  const saveRelatorio = (relatorio) => {
    const newRel = { ...relatorio, id: relatorio.id || Date.now(), atualizadoEm: new Date().toISOString() };
    setStore(prev => ({
      ...prev,
      relatorios: [
        ...prev.relatorios.filter(r => r.id !== newRel.id),
        newRel,
      ],
    }));
    showNotification('Relatório salvo com sucesso!');
    return newRel;
  };

  const getAlunoById = (id) => store.alunos.find(a => a.id === id);
  const getPlanoById = (id) => store.planosAula.find(p => p.id === id);
  const getAvaliacaoByAlunoPlano = (alunoId, planoId) =>
    store.avaliacoes.find(a => a.alunoId === alunoId && a.planoId === planoId);
  const getRelatoriosByAluno = (alunoId) => store.relatorios.filter(r => r.alunoId === alunoId);

  return (
    <AppContext.Provider value={{
      user, escola, store, loading, notification,
      login, logout, showNotification,
      addAluno, updateAluno, deleteAluno,
      addPlano, addAvaliacao, saveRelatorio,
      getAlunoById, getPlanoById, getAvaliacaoByAlunoPlano, getRelatoriosByAluno,
      habilidadesBNCC: mockData.habilidadesBNCC,
      turmas: mockData.turmas,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
