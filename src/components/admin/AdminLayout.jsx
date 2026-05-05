import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const { isAdminAuthenticated, adminLoading } = useAdmin();

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: '#0f172a' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
