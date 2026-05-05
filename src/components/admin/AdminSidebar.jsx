import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Activity, LogOut,
  Shield, ChevronRight, Settings
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/sugestoes', icon: MessageSquare, label: 'Sugestões' },
  { to: '/admin/logs', icon: Activity, label: 'Logs do Sistema' },
];

export default function AdminSidebar() {
  const { adminUser, adminLogout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 flex flex-col h-screen sticky top-0 shadow-xl"
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">Painel Admin</p>
            <p className="text-xs leading-tight" style={{ color: 'rgba(255,255,255,0.45)' }}>BNCC Reports</p>
          </div>
        </div>
        <div className="px-3 py-2 rounded-xl" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
          <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>Logado como</p>
          <p className="text-sm font-semibold text-white truncate">{adminUser?.email}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-3"
          style={{ color: 'rgba(255,255,255,0.3)' }}>Menu Principal</p>

        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'text-white shadow-lg'
                  : 'hover:bg-white/5'
              }`
            }
            style={({ isActive }) => isActive
              ? { background: 'linear-gradient(135deg, rgba(99,102,241,0.8), rgba(139,92,246,0.8))', color: 'white' }
              : { color: 'rgba(255,255,255,0.55)' }
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}

        {/* Divider */}
        <div className="pt-4 border-t mt-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-3"
            style={{ color: 'rgba(255,255,255,0.3)' }}>Sistema</p>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive ? 'text-white' : ''
              }`
            }
            style={({ isActive }) => isActive
              ? { background: 'rgba(255,255,255,0.08)', color: 'white' }
              : { color: 'rgba(255,255,255,0.45)' }
            }
          >
            <Settings size={18} />
            <span>Configurações</span>
          </NavLink>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-red-500/10"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          <LogOut size={18} />
          <span>Sair do Painel</span>
        </button>
      </div>
    </aside>
  );
}
