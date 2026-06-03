import { useState, useEffect } from 'react';
import { LayoutDashboard, Briefcase, Clock, Calendar, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Users, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:4000';
const getToken = () => localStorage.getItem('token');

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-4 hover:border-gray-700 transition-colors">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [data, setData] = useState<any>({
    activeCases: 0,
    weeklyHearings: 0,
    pendingTasks: 0,
    totalClients: 0,
    pendingHonoraries: 0,
    funnelLeads: 0,
    activities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        setData(res.data);
      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { icon: Briefcase, label: 'Processos Ativos', value: loading ? '...' : data.activeCases.toString(), color: 'bg-blue-600' },
    { icon: Calendar, label: 'Audiências na Semana', value: loading ? '...' : data.weeklyHearings.toString(), color: 'bg-purple-600' },
    { icon: Clock, label: 'Prazos Pendentes', value: loading ? '...' : data.pendingTasks.toString(), color: 'bg-red-600' },
    { icon: Users, label: 'Clientes Cadastrados', value: loading ? '...' : data.totalClients.toString(), color: 'bg-green-600' },
    {
      icon: DollarSign,
      label: 'Honorários Pendentes',
      value: loading ? '...' : data.pendingHonoraries.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      color: 'bg-amber-600'
    },
    { icon: TrendingUp, label: 'Leads no Funil', value: loading ? '...' : data.funnelLeads.toString(), color: 'bg-indigo-600' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'CLIENT': return Users;
      case 'CASE': return Briefcase;
      case 'TASK': return Clock;
      default: return CheckCircle;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'CLIENT': return 'text-green-400';
      case 'CASE': return 'text-blue-400';
      case 'TASK': return 'text-amber-400';
      default: return 'text-purple-400';
    }
  };

  const formatTime = (timeStr: string) => {
    const d = new Date(timeStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 6000);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `Há ${diffMins} min`;
    if (diffHours < 24) return `Há ${diffHours} hora(s)`;
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </div>
        <h1 className="text-white text-3xl font-bold">Olá, {user.name?.split(' ')[0] || 'Advogado'} 👋</h1>
        <p className="text-gray-400 mt-1">Aqui está o resumo do seu escritório hoje.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">Atividades Recentes</h2>
          <div className="space-y-4">
            {data.activities.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma atividade recente.</p>
            ) : data.activities.map((a: any, i: number) => {
              const Icon = getActivityIcon(a.type);
              const color = getActivityColor(a.type);
              return (
                <div key={i} className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-200 text-sm">{a.text}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{formatTime(a.time)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">Ações Rápidas</h2>
          <div className="space-y-2">
            {[
              { label: 'Cadastrar novo cliente', to: '/clientes' },
              { label: 'Adicionar processo', to: '/processos' },
              { label: 'Criar prazo', to: '/prazos' },
              { label: 'Agendar audiência', to: '/audiencias' },
              { label: 'Lançar financeiro', to: '/financeiro' },
            ].map((a, i) => (
              <a
                key={i}
                href={a.to}
                className="flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{a.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
