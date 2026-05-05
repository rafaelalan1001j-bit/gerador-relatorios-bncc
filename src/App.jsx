import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import Sidebar from './components/Sidebar';
import AdminLayout from './components/admin/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AlunosPage from './pages/AlunosPage';
import PlanosPage from './pages/PlanosPage';
import AvaliacoesPage from './pages/AvaliacoesPage';
import RelatoriosPage from './pages/RelatoriosPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminSugestoesPage from './pages/admin/AdminSugestoesPage';
import AdminLogsPage from './pages/admin/AdminLogsPage';

function ProtectedLayout() {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useApp();
  return (
    <Routes>
      {/* ── Rotas de Professor ─────────────────────────── */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/alunos" element={<AlunosPage />} />
        <Route path="/planos" element={<PlanosPage />} />
        <Route path="/avaliacoes" element={<AvaliacoesPage />} />
        <Route path="/relatorios" element={<RelatoriosPage />} />
        <Route path="/admin-sistema" element={<AdminPage />} />
      </Route>

      {/* ── Rotas Administrativas (totalmente isoladas) ── */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/sugestoes" element={<AdminSugestoesPage />} />
        <Route path="/admin/logs" element={<AdminLogsPage />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* ── Fallback ────────────────────────────────────── */}
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </AdminProvider>
  );
}
