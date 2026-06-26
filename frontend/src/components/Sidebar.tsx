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
  { to: '/audiencias', icon: Calendar, label: 'Audiencias' },
  { to: '/documentos', icon: FileText, label: 'Documentos' },
  { to: '/financeiro', icon: DollarSign, label: 'Financeiro' },
  { to: '/crm', icon: TrendingUp, label: 'CRM / Leads' },
  { to: '/relatorios', icon: BarChart2, label: 'Relatorios' },
  { to: '/equipe', icon: UserCheck, label: 'Equipe' },
  { to: '/configuracoes', icon: Settings, label: 'Configuracoes' },
];

const mobileNavItems = [
  navItems[0],
  navItems[1],
  navItems[2],
  navItems[3],
  navItems[6],
];

export function MobileNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-800 bg-gray-950/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {mobileNavItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            className={({ isActive }) =>
              `flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="max-w-full truncate leading-none">{label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-gray-800 bg-gray-900 lg:flex">
      <div className="flex items-center gap-3 border-b border-gray-800 px-6 py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600">
          <Scale className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none text-white">JurisFlow</h1>
          <p className="mt-0.5 text-xs text-gray-400">Sistema Juridico</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-3 border-t border-gray-800 px-3 py-4">
        <div className="flex items-center gap-3 px-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500">
            <span className="text-xs font-bold text-white">
              {user.name?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user.name || 'Usuario'}</p>
            <p className="truncate text-xs text-gray-400">{user.role || 'ADMIN'}</p>
          </div>
          <Bell className="h-4 w-4 cursor-pointer text-gray-400 transition-colors hover:text-white" />
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-all duration-150 hover:bg-red-900/30 hover:text-red-400"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  );
}