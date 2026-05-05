import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, RefreshCw } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

const breadcrumbs = {
  '/admin/dashboard': 'Dashboard',
  '/admin/sugestoes': 'Gerenciar Sugestões',
  '/admin/logs': 'Logs do Sistema',
  '/admin/settings': 'Configurações',
};

export default function AdminHeader({ onRefresh, loading }) {
  const location = useLocation();
  const { adminUser } = useAdmin();
  const title = breadcrumbs[location.pathname] || 'Admin';

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
      <div>
        <h1 className="font-bold text-slate-800 text-lg">{title}</h1>
        <p className="text-xs text-slate-400 leading-none mt-0.5">
          Painel Administrativo • BNCC Reports
        </p>
      </div>

      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
            title="Atualizar dados"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        )}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-100">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            {adminUser?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-700">{adminUser?.email}</p>
            <p className="text-xs text-slate-400">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
}
