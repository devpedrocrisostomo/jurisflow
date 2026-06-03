import axios from 'axios';

const BACKEND_URL = 'http://localhost:4000';

// Detect if we should use the local backend or localstorage fallback
let isBackendOnline = false;

// Quick check on startup
export const checkBackendHealth = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/health`, { timeout: 1000 });
    isBackendOnline = res.status === 200;
  } catch {
    isBackendOnline = false;
  }
  return isBackendOnline;
};

// Initial run
checkBackendHealth();

// Seed initial localStorage mock database if empty
const initMockDB = () => {
  if (!localStorage.getItem('jf_clients')) {
    localStorage.setItem('jf_clients', JSON.stringify([
      { id: '1', type: 'PF', name: 'Carlos Eduardo Santos', document: '123.456.789-00', email: 'carlos.eduardo@gmail.com', phone: '(11) 98765-4321', address: 'Av. Paulista, 1000 - São Paulo/SP', notes: 'Cliente preferencial, contato por e-mail.' },
      { id: '2', type: 'PJ', name: 'Indústria Metálica Alpha Ltda', document: '12.345.678/0001-99', email: 'juridico@metalalpha.com.br', phone: '(11) 3344-5566', address: 'Rua das Indústrias, 450 - SBC/SP', notes: 'Contrato mensal de assessoria.' }
    ]));
  }
  if (!localStorage.getItem('jf_cases')) {
    localStorage.setItem('jf_cases', JSON.stringify([
      { id: '1', caseNumber: '1002456-88.2025.8.26.0100', court: 'TJSP - Tribunal de Justiça', jurisdiction: '4ª Vara Cível Foro Central', caseClass: 'Procedimento Comum Cível', legalArea: 'Cível', status: 'ATIVO', opposingParty: 'Banco Nacional S/A', notes: 'A revisional de contrato.', clientId: '1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', caseNumber: '0010452-12.2025.5.02.0002', court: 'TRT-2 - Tribunal do Trabalho', jurisdiction: '2ª Vara de SBC', caseClass: 'Reclamação Trabalhista', legalArea: 'Trabalhista', status: 'ATIVO', opposingParty: 'João da Silva Santos', notes: 'Contestação apresentada.', clientId: '2', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ]));
  }
  if (!localStorage.getItem('jf_tasks')) {
    localStorage.setItem('jf_tasks', JSON.stringify([
      { id: '1', title: 'Apresentar Réplica à Contestação', description: 'Elaborar réplica refutando taxas abusivas.', dueDate: new Date(Date.now() + 7*24*60*60*1000).toISOString(), priority: 'ALTA', status: 'PENDENTE', caseId: '1', updatedAt: new Date().toISOString() },
      { id: '2', title: 'Juntar Guia de Custas Iniciais', description: 'Comprovar pagamento.', dueDate: new Date(Date.now() - 24*60*60*1000).toISOString(), priority: 'BAIXA', status: 'ATRASADO', caseId: '2', updatedAt: new Date().toISOString() }
    ]));
  }
  if (!localStorage.getItem('jf_hearings')) {
    localStorage.setItem('jf_hearings', JSON.stringify([
      { id: '1', date: new Date(Date.now() + 5*24*60*60*1000).toISOString(), type: 'Instrução e Julgamento', court: 'Sala 03 - 2ª Vara do Trabalho', notes: 'Levar testemunhas.', caseId: '2' },
      { id: '2', date: new Date(Date.now() + 15*24*60*60*1000).toISOString(), type: 'Conciliação', court: 'CEJUSC Foro Central', notes: 'Virtual via Teams.', caseId: '1' }
    ]));
  }
  if (!localStorage.getItem('jf_finance')) {
    localStorage.setItem('jf_finance', JSON.stringify([
      { id: '1', type: 'RECEITA', category: 'Honorários', amount: 4500.00, dueDate: new Date(Date.now() - 2*24*60*60*1000).toISOString(), status: 'PAGO', notes: 'Honorários Carlos Eduardo.' },
      { id: '2', type: 'RECEITA', category: 'Contrato Mensal', amount: 8000.00, dueDate: new Date(Date.now() + 10*24*60*60*1000).toISOString(), status: 'PENDENTE', notes: 'Mensalidade Indústria Alpha.' },
      { id: '3', type: 'DESPESA', category: 'Custas Judiciais', amount: 320.50, dueDate: new Date(Date.now() - 24*60*60*1000).toISOString(), status: 'PAGO', notes: 'Taxa judiciária.' }
    ]));
  }
  if (!localStorage.getItem('jf_leads')) {
    localStorage.setItem('jf_leads', JSON.stringify([
      { id: '1', name: 'Roberto de Almeida Prado', contact: '(11) 99122-3344', status: 'LEAD', notes: 'Inventário familiar.' },
      { id: '2', name: 'Clínica Médica Bem-Estar Ltda', contact: 'Dra. Sandra (11) 3214-5555', status: 'REUNIAO_MARCADA', notes: 'Proposta de governança.' }
    ]));
  }
  if (!localStorage.getItem('jf_users')) {
    localStorage.setItem('jf_users', JSON.stringify([
      { id: 'admin-id', name: 'Dr. Roberto Silva (Admin)', email: 'admin@jurisflow.com', role: 'ADMIN', createdAt: new Date().toISOString() }
    ]));
  }
};

initMockDB();

// Mock implementations
const mockGet = (url: string) => {
  const cleanUrl = url.replace(BACKEND_URL, '');
  
  if (cleanUrl.startsWith('/clients')) {
    return { data: JSON.parse(localStorage.getItem('jf_clients') || '[]') };
  }
  if (cleanUrl.startsWith('/cases')) {
    const cases = JSON.parse(localStorage.getItem('jf_cases') || '[]');
    const clients = JSON.parse(localStorage.getItem('jf_clients') || '[]');
    // Map client relation
    const populated = cases.map((c: any) => ({
      ...c,
      client: clients.find((cl: any) => cl.id === c.clientId)
    }));
    return { data: populated };
  }
  if (cleanUrl.startsWith('/tasks')) {
    return { data: JSON.parse(localStorage.getItem('jf_tasks') || '[]') };
  }
  if (cleanUrl.startsWith('/hearings')) {
    return { data: JSON.parse(localStorage.getItem('jf_hearings') || '[]') };
  }
  if (cleanUrl.startsWith('/finance')) {
    return { data: JSON.parse(localStorage.getItem('jf_finance') || '[]') };
  }
  if (cleanUrl.startsWith('/leads')) {
    return { data: JSON.parse(localStorage.getItem('jf_leads') || '[]') };
  }
  if (cleanUrl.startsWith('/users')) {
    return { data: JSON.parse(localStorage.getItem('jf_users') || '[]') };
  }
  if (cleanUrl.startsWith('/dashboard/stats')) {
    const clients = JSON.parse(localStorage.getItem('jf_clients') || '[]');
    const cases = JSON.parse(localStorage.getItem('jf_cases') || '[]');
    const tasks = JSON.parse(localStorage.getItem('jf_tasks') || '[]');
    const hearings = JSON.parse(localStorage.getItem('jf_hearings') || '[]');
    const finance = JSON.parse(localStorage.getItem('jf_finance') || '[]');
    const leads = JSON.parse(localStorage.getItem('jf_leads') || '[]');

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const activeCases = cases.filter((c: any) => c.status === 'ATIVO').length;
    const weeklyHearings = hearings.filter((h: any) => {
      const d = new Date(h.date);
      return d >= startOfWeek && d <= endOfWeek;
    }).length;
    const pendingTasks = tasks.filter((t: any) => ['PENDENTE', 'EM_ANDAMENTO', 'ATRASADO'].includes(t.status)).length;
    const totalClients = clients.length;
    const pendingHonoraries = finance
      .filter((f: any) => f.type === 'RECEITA' && f.status === 'PENDENTE')
      .reduce((acc: number, item: any) => acc + item.amount, 0);
    const funnelLeads = leads.filter((l: any) => ['LEAD', 'CONTATO_REALIZADO', 'REUNIAO_MARCADA', 'PROPOSTA_ENVIADA'].includes(l.status)).length;

    const activities = [
      ...clients.slice(-2).map((c: any) => ({ type: 'CLIENT', text: `Cliente "${c.name}" foi cadastrado`, time: c.createdAt || new Date().toISOString() })),
      ...cases.slice(-2).map((c: any) => ({ type: 'CASE', text: `Processo nº ${c.caseNumber} atualizado`, time: c.updatedAt || new Date().toISOString() })),
      ...tasks.slice(-2).map((t: any) => ({ type: 'TASK', text: `Prazo "${t.title}" atualizado`, time: t.updatedAt || new Date().toISOString() }))
    ].slice(0, 4);

    return {
      data: {
        activeCases,
        weeklyHearings,
        pendingTasks,
        totalClients,
        pendingHonoraries,
        funnelLeads,
        activities
      }
    };
  }
  return { data: null };
};

const mockPost = (url: string, body: any) => {
  const cleanUrl = url.replace(BACKEND_URL, '');
  const id = Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();

  if (cleanUrl.startsWith('/auth/login')) {
    if (body.email === 'admin@jurisflow.com' && body.password === 'admin') {
      return {
        data: {
          token: 'mock-jwt-token',
          user: { id: 'admin-id', name: 'Dr. Roberto Silva (Admin)', email: 'admin@jurisflow.com', role: 'ADMIN' }
        }
      };
    }
    throw new Error('Credenciais inválidas');
  }

  const map: Record<string, string> = {
    '/clients': 'jf_clients',
    '/cases': 'jf_cases',
    '/tasks': 'jf_tasks',
    '/hearings': 'jf_hearings',
    '/finance': 'jf_finance',
    '/leads': 'jf_leads',
    '/users': 'jf_users'
  };

  const key = map[cleanUrl];
  if (key) {
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const newItem = { id, ...body, createdAt: now, updatedAt: now };
    list.push(newItem);
    localStorage.setItem(key, JSON.stringify(list));
    return { data: newItem };
  }
  return { data: null };
};

const mockPut = (url: string, body: any) => {
  const cleanUrl = url.replace(BACKEND_URL, '');
  const parts = cleanUrl.split('/');
  const route = '/' + parts[1];
  const id = parts[2];

  const map: Record<string, string> = {
    '/clients': 'jf_clients',
    '/cases': 'jf_cases',
    '/tasks': 'jf_tasks',
    '/hearings': 'jf_hearings',
    '/finance': 'jf_finance',
    '/leads': 'jf_leads',
    '/users': 'jf_users'
  };

  const key = map[route];
  if (key && id) {
    let list = JSON.parse(localStorage.getItem(key) || '[]');
    list = list.map((item: any) => item.id === id ? { ...item, ...body, updatedAt: new Date().toISOString() } : item);
    localStorage.setItem(key, JSON.stringify(list));
    return { data: list.find((item: any) => item.id === id) };
  }
  return { data: null };
};

const mockDelete = (url: string) => {
  const cleanUrl = url.replace(BACKEND_URL, '');
  const parts = cleanUrl.split('/');
  const route = '/' + parts[1];
  const id = parts[2];

  const map: Record<string, string> = {
    '/clients': 'jf_clients',
    '/cases': 'jf_cases',
    '/tasks': 'jf_tasks',
    '/hearings': 'jf_hearings',
    '/finance': 'jf_finance',
    '/leads': 'jf_leads',
    '/users': 'jf_users'
  };

  const key = map[route];
  if (key && id) {
    let list = JSON.parse(localStorage.getItem(key) || '[]');
    list = list.filter((item: any) => item.id !== id);
    localStorage.setItem(key, JSON.stringify(list));
    return { status: 204 };
  }
  return { status: 400 };
};

// Main API Client wrapper
export const api = {
  get: async (url: string, config?: any) => {
    await checkBackendHealth();
    if (isBackendOnline) {
      return axios.get(url, config);
    }
    return mockGet(url);
  },
  post: async (url: string, data?: any, config?: any) => {
    await checkBackendHealth();
    if (isBackendOnline) {
      return axios.post(url, data, config);
    }
    return mockPost(url, data);
  },
  put: async (url: string, data?: any, config?: any) => {
    await checkBackendHealth();
    if (isBackendOnline) {
      return axios.put(url, data, config);
    }
    return mockPut(url, data);
  },
  delete: async (url: string, config?: any) => {
    await checkBackendHealth();
    if (isBackendOnline) {
      return axios.delete(url, config);
    }
    return mockDelete(url);
  }
};
export default api;
