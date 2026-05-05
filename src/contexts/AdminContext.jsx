import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AdminContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Instância axios configurada
export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor — injeta token JWT em todas as requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('bncc_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor — logout automático em 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('bncc_admin_token');
      sessionStorage.removeItem('bncc_admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);

  // Restaurar sessão ao montar
  useEffect(() => {
    const token = sessionStorage.getItem('bncc_admin_token');
    const user = sessionStorage.getItem('bncc_admin_user');
    if (token && user) {
      setAdminUser(JSON.parse(user));
    }
    setAdminLoading(false);
  }, []);

  const adminLogin = useCallback(async (email, senha) => {
    const response = await api.post('/login', { email, senha });
    const { token, admin } = response.data;
    sessionStorage.setItem('bncc_admin_token', token);
    sessionStorage.setItem('bncc_admin_user', JSON.stringify(admin));
    setAdminUser(admin);
    return response.data;
  }, []);

  const adminLogout = useCallback(() => {
    sessionStorage.removeItem('bncc_admin_token');
    sessionStorage.removeItem('bncc_admin_user');
    setAdminUser(null);
  }, []);

  const isAdminAuthenticated = Boolean(adminUser);

  return (
    <AdminContext.Provider value={{
      adminUser,
      adminLoading,
      adminLogin,
      adminLogout,
      isAdminAuthenticated,
      api,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
