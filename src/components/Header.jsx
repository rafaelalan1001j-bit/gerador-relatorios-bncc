import React from 'react';
import { Bell, Search, Plus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function Header({ title, subtitle, actions }) {
  const { notification } = useApp();

  return (
    <>
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 animate-slide-up px-5 py-3 rounded-2xl shadow-medium text-white font-medium flex items-center gap-2 ${
          notification.type === 'error' ? 'bg-coral-500' :
          notification.type === 'info' ? 'bg-slate-700' :
          'bg-sage-500'
        }`}>
          <span>{notification.message}</span>
        </div>
      )}

      <header className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          {actions}
          <button className="p-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral-400 rounded-full"></span>
          </button>
        </div>
      </header>
    </>
  );
}
