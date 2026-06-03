import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Briefcase, Calendar, Clock,
  FileText, DollarSign, TrendingUp, BarChart2, Settings,
  LogOut, Scale, UserCheck, Bell
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clientes', icon: Users, label: 'Clientes' },
  { to: '/processos', icon: Briefcase, label: 'Processos' },
  { to: '/prazos', icon: Clock, label: 'Prazos' },
  { to: '/audiencias', icon: Calendar, label: 'Audiências' },
  { to: '/documentos', icon: FileText, label: 'Documentos' },
  { to: '/financeiro', icon: DollarSign, label: 'Financeiro' },
  { to: '/crm', icon: TrendingUp, label: 'CRM / Leads' },
  { to: '/relatorios', icon: BarChart2, label: 'Relatórios' },
  { to: '/equipe', icon: UserCheck, label: 'Equipe' },
  { to: '/configuracoes', icon: Settings, label: 'Configurações' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <Scale className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-none">JurisFlow</h1>
          <p className="text-gray-400 text-xs mt-0.5">Sistema Jurídico</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-3">
        <div className="flex items-center gap-3 px-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">
              {user.name?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user.name || 'Usuário'}</p>
            <p className="text-gray-400 text-xs truncate">{user.role || 'ADMIN'}</p>
          </div>
          <Bell className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors" />
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  );
}
