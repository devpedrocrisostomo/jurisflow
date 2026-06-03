import { useState, useEffect } from 'react';
import { Clock, Plus, Search, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:4000';
const getToken = () => localStorage.getItem('token');

const priorityColors: Record<string, string> = {
  'ALTA': 'bg-red-900/40 text-red-300',
  'MEDIA': 'bg-amber-900/40 text-amber-300',
  'BAIXA': 'bg-green-900/40 text-green-300',
};
const statusColors: Record<string, string> = {
  'PENDENTE': 'bg-amber-900/40 text-amber-300',
  'EM_ANDAMENTO': 'bg-blue-900/40 text-blue-300',
  'CONCLUIDO': 'bg-green-900/40 text-green-300',
  'ATRASADO': 'bg-red-900/40 text-red-300',
};

export default function Prazos() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const emptyForm = { title: '', description: '', dueDate: '', priority: 'MEDIA', status: 'PENDENTE', caseId: '' };
  const [form, setForm] = useState(emptyForm);

  const fetchAll = async () => {
    try {
      const [tRes, cRes] = await Promise.all([
        axios.get(`${API}/tasks`, { headers: { Authorization: `Bearer ${getToken()}` } }),
        axios.get(`${API}/cases`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      ]);
      setTasks(tRes.data);
      setCases(cRes.data);
    } catch { }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, dueDate: new Date(form.dueDate).toISOString() };
      if (editingId) {
        await axios.put(`${API}/tasks/${editingId}`, payload, { headers: { Authorization: `Bearer ${getToken()}` } });
      } else {
        await axios.post(`${API}/tasks`, payload, { headers: { Authorization: `Bearer ${getToken()}` } });
      }
      setShowModal(false); setForm(emptyForm); setEditingId(null); fetchAll();
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const filtered = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1"><Clock className="w-4 h-4" /><span>Prazos</span></div>
          <h1 className="text-white text-3xl font-bold">Prazos</h1>
          <p className="text-gray-400 mt-1">{tasks.filter(t => t.status === 'ATRASADO').length} prazo(s) atrasado(s)</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />Novo Prazo
        </button>
      </div>

      {/* Alerta de prazos atrasados */}
      {tasks.filter(t => t.status === 'ATRASADO').length > 0 && (
        <div className="flex items-center gap-3 bg-red-900/20 border border-red-800 rounded-xl px-5 py-4">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-red-300 text-sm">
            Você tem <strong>{tasks.filter(t => t.status === 'ATRASADO').length}</strong> prazo(s) atrasado(s) que precisam de atenção imediata!
          </p>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Buscar prazos..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filtered.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center text-gray-500">Nenhum prazo encontrado.</div>
        ) : filtered.map((t) => (
          <div key={t.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[t.status]}`}>{t.status.replace('_', ' ')}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${priorityColors[t.priority]}`}>{t.priority}</span>
                </div>
                <h3 className="text-white font-semibold mt-2">{t.title}</h3>
                {t.description && <p className="text-gray-400 text-sm mt-1">{t.description}</p>}
                <p className="text-gray-500 text-xs mt-2">Vencimento: {new Date(t.dueDate).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => { setForm({ title: t.title, description: t.description || '', dueDate: t.dueDate?.slice(0, 10), priority: t.priority, status: t.status, caseId: t.caseId || '' }); setEditingId(t.id); setShowModal(true); }}
                  className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                <button onClick={async () => { if (confirm('Excluir?')) { await axios.delete(`${API}/tasks/${t.id}`, { headers: { Authorization: `Bearer ${getToken()}` } }); fetchAll(); } }}
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-white text-xl font-bold">{editingId ? 'Editar Prazo' : 'Novo Prazo'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Título *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Descrição</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm resize-none" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Data de Vencimento *</label>
                <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Prioridade</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm">
                    {['ALTA', 'MEDIA', 'BAIXA'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm">
                    {['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'ATRASADO'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Processo</label>
                <select value={form.caseId} onChange={(e) => setForm({ ...form, caseId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm">
                  <option value="">Selecione...</option>
                  {cases.map((c) => <option key={c.id} value={c.id}>{c.caseNumber}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-sm">Cancelar</button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50">
                  {loading ? 'Salvando...' : editingId ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
