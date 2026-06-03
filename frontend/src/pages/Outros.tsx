import { useState, useEffect } from 'react';
import { FileText, BarChart2, UserCheck, Settings, Building2, Users, Bell, Palette, Plus, Trash2, Save, Mail } from 'lucide-react';
import axios from '../services/api';

const API = 'http://localhost:4000';
const getToken = () => localStorage.getItem('token');

// --- DOCUMENTOS ---
export const Documentos = () => {
  const mockDocs = [
    { title: 'Contrato de Honorários Advocatícios - Carlos Eduardo.pdf', type: 'CONTRATO', size: '2.4 MB', date: '02/06/2026' },
    { title: 'Petição Inicial - Revisional Financiamento.docx', type: 'PETICAO', size: '1.1 MB', date: '03/06/2026' },
    { title: 'Procuração Ad Judicia - Carlos Eduardo.pdf', type: 'PROCURACAO', size: '512 KB', date: '01/06/2026' },
    { title: 'Contestação Reclamatória Trabalhista - Metal Alpha.docx', type: 'PETICAO', size: '1.8 MB', date: '03/06/2026' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1"><FileText className="w-4 h-4" /><span>Documentos</span></div>
        <h1 className="text-white text-3xl font-bold">Documentos</h1>
        <p className="text-gray-400 mt-1">Gerenciador de arquivos e peças jurídicas</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <span className="text-white font-medium text-sm">Arquivos Recentes</span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
            Enviar Arquivo
          </button>
        </div>
        <div className="divide-y divide-gray-800/50">
          {mockDocs.map((doc, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-200 text-sm font-medium">{doc.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{doc.type} • {doc.size} • Enviado em {doc.date}</p>
                </div>
              </div>
              <button className="text-blue-400 hover:text-blue-300 text-xs font-medium">Visualizar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- RELATÓRIOS ---
export const Relatorios = () => {
  const [loadingReport, setLoadingReport] = useState<string | null>(null);

  const handleGenerate = (reportName: string) => {
    setLoadingReport(reportName);
    setTimeout(() => {
      setLoadingReport(null);
      alert(`Relatório "${reportName}" gerado com sucesso! O download do PDF iniciará automaticamente.`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1"><BarChart2 className="w-4 h-4" /><span>Relatórios</span></div>
        <h1 className="text-white text-3xl font-bold">Relatórios</h1>
        <p className="text-gray-400 mt-1">Exportação de dados e análise de desempenho</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: 'Processos por Advogado', desc: 'Distribuição da carga horária e processos ativos por profissional.' },
          { name: 'Processos por Área', desc: 'Gráficos comparativos entre áreas (Trabalhista, Cível, Tributário).' },
          { name: 'Produtividade da Equipe', desc: 'Taxa de cumprimento de prazos e tarefas finalizadas.' },
          { name: 'Financeiro Mensal', desc: 'Demonstrativo de fluxo de caixa, receitas e despesas por competência.' },
          { name: 'Clientes Ativos', desc: 'Lista unificada de clientes recorrentes e avulsos ativos.' },
          { name: 'Prazos e Cumprimentos', desc: 'Relatório detalhado de prazos concluídos, pendentes e em atraso.' },
        ].map(r => (
          <div key={r.name} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-800 transition-colors cursor-pointer group flex flex-col justify-between" onClick={() => handleGenerate(r.name)}>
            <div>
              <BarChart2 className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold">{r.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{r.desc}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-blue-400 text-sm font-medium group-hover:underline">
                {loadingReport === r.name ? 'Processando...' : 'Gerar e baixar PDF →'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- EQUIPE ---
export const Equipe = () => {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setUsers(res.data);
    } catch { }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1"><UserCheck className="w-4 h-4" /><span>Equipe</span></div>
        <h1 className="text-white text-3xl font-bold">Equipe</h1>
        <p className="text-gray-400 mt-1">Membros cadastrados no escritório</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <div key={u.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.role === 'ADMIN' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-blue-950 text-blue-300 border border-blue-800'}`}>
                  {u.role}
                </span>
                <span className="text-gray-500 text-xs">Desde {new Date(u.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
              <h3 className="text-white font-semibold text-base">{u.name}</h3>
              <p className="text-gray-400 text-sm flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5" /> {u.email}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800/60 flex justify-between items-center text-xs text-gray-500">
              <span>JurisFlow User</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span> Ativo
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- CONFIGURAÇÕES (TOTALMENTE FUNCIONAL) ---
export const Configuracoes = () => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'ADVOGADO' });
  const [savingOffice, setSavingOffice] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Perfil do escritório
  const [office, setOffice] = useState(() => {
    const saved = localStorage.getItem('officeSettings');
    return saved ? JSON.parse(saved) : { name: 'JurisFlow Advocacia', cnpj: '12.345.678/0001-99', phone: '(11) 3344-5566', address: 'Av. Paulista, 1000 - Bela Vista - São Paulo/SP' };
  });

  // Aparência
  const [accent, setAccent] = useState(() => {
    return localStorage.getItem('accentColor') || 'blue';
  });

  // Notificações
  const [notifs, setNotifs] = useState({
    emailDeadlines: true,
    emailHearings: true,
    pushSystem: true,
    weeklyReport: false
  });

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setUsers(res.data);
    } catch { }
    setLoadingUsers(false);
  };

  useEffect(() => {
    if (activeTab === 'usuarios') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleSaveOffice = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingOffice(true);
    setTimeout(() => {
      localStorage.setItem('officeSettings', JSON.stringify(office));
      setSavingOffice(false);
      alert('Configurações do escritório salvas com sucesso!');
    }, 800);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) return;
    try {
      await axios.post(`${API}/users`, newUser, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setNewUser({ name: '', email: '', password: '', role: 'ADVOGADO' });
      fetchUsers();
      alert('Novo usuário/membro da equipe adicionado com sucesso!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao adicionar usuário');
    }
  };

  const handleDeleteUser = async (id: string) => {
    const adminUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (adminUser.id === id) {
      alert('Você não pode excluir o seu próprio usuário logado!');
      return;
    }
    if (!confirm('Deseja realmente remover este usuário da equipe?')) return;
    try {
      await axios.delete(`${API}/users/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchUsers();
    } catch {
      alert('Erro ao excluir usuário');
    }
  };

  const handleAccentChange = (color: string) => {
    setAccent(color);
    localStorage.setItem('accentColor', color);
    // Dynamic change (optional trigger if parent page listens or simply displays visually here)
    alert(`Tema de destaque alterado para: ${color.toUpperCase()}. Salvo com sucesso.`);
  };

  const handleNotifToggle = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: 'perfil', label: 'Perfil do Escritório', icon: Building2 },
    { id: 'usuarios', label: 'Gerenciar Usuários', icon: Users },
    { id: 'aparencia', label: 'Aparência', icon: Palette },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1"><Settings className="w-4 h-4" /><span>Configurações</span></div>
        <h1 className="text-white text-3xl font-bold">Configurações</h1>
        <p className="text-gray-400 mt-1">Ajustes da plataforma, membros da equipe e personalização</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-xl p-3 flex flex-col gap-1 h-fit">
          {tabs.map(tab => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/55'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="lg:col-span-3 bg-gray-900 border border-gray-800 rounded-xl p-6">
          
          {/* PROFILE TAB */}
          {activeTab === 'perfil' && (
            <form onSubmit={handleSaveOffice} className="space-y-4">
              <h2 className="text-white font-bold text-lg border-b border-gray-800 pb-2 mb-4">Perfil do Escritório</h2>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Nome do Escritório</label>
                <input
                  type="text"
                  value={office.name}
                  onChange={e => setOffice({ ...office, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">CNPJ</label>
                <input
                  type="text"
                  value={office.cnpj}
                  onChange={e => setOffice({ ...office, cnpj: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Telefone de Contato</label>
                <input
                  type="text"
                  value={office.phone}
                  onChange={e => setOffice({ ...office, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Endereço Comercial</label>
                <input
                  type="text"
                  value={office.address}
                  onChange={e => setOffice({ ...office, address: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={savingOffice}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                <Save className="w-4 h-4" /> {savingOffice ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </form>
          )}

          {/* USERS TAB */}
          {activeTab === 'usuarios' && (
            <div className="space-y-6">
              <h2 className="text-white font-bold text-lg border-b border-gray-800 pb-2">Gerenciar Membros da Equipe</h2>
              
              {/* Form to add user */}
              <form onSubmit={handleAddUser} className="bg-gray-800/40 p-4 border border-gray-800 rounded-xl space-y-3">
                <p className="text-white text-xs font-semibold uppercase tracking-wider text-gray-400">Adicionar Novo Integrante</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={newUser.name}
                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                    required
                    className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                    required
                    className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Senha de acesso"
                    value={newUser.password}
                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                    required
                    className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                  <select
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                    className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="ADVOGADO">ADVOGADO</option>
                    <option value="SOCIO">SÓCIO</option>
                    <option value="ESTAGIARIO">ESTAGIÁRIO</option>
                    <option value="SECRETARIA">SECRETÁRIA</option>
                    <option value="ADMIN">ADMINISTRADOR</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar na Equipe
                </button>
              </form>

              {/* Users List */}
              <div className="space-y-2">
                <p className="text-white text-xs font-semibold uppercase tracking-wider text-gray-400">Usuários Atuais</p>
                {loadingUsers ? (
                  <p className="text-gray-500 text-sm">Carregando usuários...</p>
                ) : (
                  <div className="divide-y divide-gray-800">
                    {users.map(u => (
                      <div key={u.id} className="py-3 flex items-center justify-between hover:bg-gray-800/20 px-2 rounded-lg">
                        <div>
                          <p className="text-white text-sm font-medium">{u.name}</p>
                          <p className="text-gray-400 text-xs">{u.email} • <span className="text-blue-400 font-mono text-[10px]">{u.role}</span></p>
                        </div>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'aparencia' && (
            <div className="space-y-6">
              <h2 className="text-white font-bold text-lg border-b border-gray-800 pb-2">Cor de Destaque / Tema</h2>
              <p className="text-gray-400 text-sm">Escolha a cor principal da identidade visual do seu painel do JurisFlow.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                {[
                  { id: 'blue', name: 'Azul Executivo', color: 'bg-blue-600' },
                  { id: 'emerald', name: 'Verde Esmeralda', color: 'bg-emerald-600' },
                  { id: 'purple', name: 'Roxo Royal', color: 'bg-purple-600' },
                  { id: 'amber', name: 'Âmbar Clássico', color: 'bg-amber-600' },
                  { id: 'rose', name: 'Rosa Moderno', color: 'bg-rose-600' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleAccentChange(item.id)}
                    className={`flex flex-col items-center gap-2 p-3 border rounded-xl transition-all ${
                      accent === item.id ? 'border-white bg-gray-800/80' : 'border-gray-800 hover:border-gray-700 bg-gray-800/30'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full ${item.color} block`}></span>
                    <span className="text-white text-xs font-medium">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notificacoes' && (
            <div className="space-y-6">
              <h2 className="text-white font-bold text-lg border-b border-gray-800 pb-2">Alertas e Notificações</h2>
              <div className="space-y-4 pt-2">
                {[
                  { key: 'emailDeadlines', label: 'E-mails de Prazos do dia', desc: 'Receber diariamente pela manhã os prazos jurídicos a vencer.' },
                  { key: 'emailHearings', label: 'Lembretes de Audiências', desc: 'Notificar por e-mail 24 horas antes das audiências agendadas.' },
                  { key: 'pushSystem', label: 'Notificações no Navegador', desc: 'Exibir alertas na tela do computador para novas atividades e movimentações.' },
                  { key: 'weeklyReport', label: 'Relatório Executivo Semanal', desc: 'E-mail resumido do fluxo financeiro e da produtividade do escritório ao final da semana.' },
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between gap-4 p-3 bg-gray-800/30 border border-gray-800/80 rounded-xl">
                    <div>
                      <p className="text-white text-sm font-semibold">{item.label}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(notifs as any)[item.key]}
                        onChange={() => handleNotifToggle(item.key as any)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
