import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, ClipboardList, FileText,
  LogOut, GraduationCap, Settings, ChevronRight
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/alunos', icon: Users, label: 'Alunos' },
  { to: '/planos', icon: BookOpen, label: 'Planos de Aula' },
  { to: '/avaliacoes', icon: ClipboardList, label: 'Avaliações' },
  { to: '/relatorios', icon: FileText, label: 'Relatórios' },
];

export default function Sidebar() {
  const { user, escola, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'P';

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 shadow-sm">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-sm">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm leading-tight">BNCC Reports</p>
            <p className="text-xs text-slate-500 leading-tight">Educação Infantil</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-primary-50 rounded-xl">
          <p className="text-xs font-semibold text-primary-700 truncate">{escola?.nome}</p>
          <p className="text-xs text-primary-500">{escola?.cidade}/{escola?.uf}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3">Menu Principal</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} group`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}

        <div className="pt-4 border-t border-slate-100 mt-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3">Sistema</p>
          <NavLink
            to="/admin"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Settings size={18} />
            <span>Administração</span>
          </NavLink>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="avatar bg-primary-100 text-primary-700 flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.nome}</p>
            <p className="text-xs text-slate-500 truncate">{user?.turma}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-coral-500 hover:bg-coral-50 transition-colors"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
