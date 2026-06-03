import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Processos from './pages/Processos';
import Prazos from './pages/Prazos';
import Audiencias from './pages/Audiencias';
import Financeiro from './pages/Financeiro';
import CRM from './pages/CRM';
import { Documentos, Relatorios, Equipe, Configuracoes } from './pages/Outros';

import React from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
};

const AuthLayout = () => (
  <ProtectedRoute>
    <Layout />
  </ProtectedRoute>
);

function App() {
  return (
    <BrowserRouter basename="/jurisflow">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/processos" element={<Processos />} />
          <Route path="/prazos" element={<Prazos />} />
          <Route path="/audiencias" element={<Audiencias />} />
          <Route path="/documentos" element={<Documentos />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
