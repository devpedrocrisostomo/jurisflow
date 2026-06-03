import { useState, useEffect } from 'react';
import { TrendingUp, Plus, Search, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:4000';
const getToken = () => localStorage.getItem('token');

const funil = ['LEAD', 'CONTATO_REALIZADO', 'REUNIAO_MARCADA', 'PROPOSTA_ENVIADA', 'FECHADO', 'PERDIDO'];
const funilLabels: Record<string, string> = {
  LEAD: 'Lead', CONTATO_REALIZADO: 'Contato', REUNIAO_MARCADA: 'Reunião',
  PROPOSTA_ENVIADA: 'Proposta', FECHADO: 'Fechado', PERDIDO: 'Perdido',
};
const funilColors: Record<string, string> = {
  LEAD: 'bg-gray-700/60 text-gray-300', CONTATO_REALIZADO: 'bg-blue-900/40 text-blue-300',
  REUNIAO_MARCADA: 'bg-purple-900/40 text-purple-300', PROPOSTA_ENVIADA: 'bg-amber-900/40 text-amber-300',
  FECHADO: 'bg-green-900/40 text-green-300', PERDIDO: 'bg-red-900/40 text-red-300',
};

export default function CRM() {
  const [leads, setLeads] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const emptyForm = { name: '', contact: '', status: 'LEAD', notes: '' };
  const [form, setForm] = useState(emptyForm);

  const fetchAll = async () => {
    try {
      const res = await axios.get(`${API}/leads`, { headers: { Authorization: `Bearer ${getToken()}` } });
      setLeads(res.data);
    } catch { }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API}/leads/${editingId}`, form, { headers: { Authorization: `Bearer ${getToken()}` } });
      } else {
        await axios.post(`${API}/leads`, form, { headers: { Authorization: `Bearer ${getToken()}` } });
      }
      setShowModal(false); setForm(emptyForm); setEditingId(null); fetchAll();
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const filtered = leads.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1"><TrendingUp className="w-4 h-4" /><span>CRM</span></div>
          <h1 className="text-white text-3xl font-bold">CRM / Leads</h1>
          <p className="text-gray-400 mt-1">{leads.length} lead(s) no funil</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />Novo Lead
        </button>
      </div>

      {/* Kanban simplificado */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {funil.map(s => {
          const colLeads = leads.filter(l => l.status === s);
          return (
            <div key={s} className="bg-gray-900 border border-gray-800 rounded-xl p-3">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${funilColors[s]}`}>{funilLabels[s]}</span>
                <span className="text-gray-500 text-xs font-medium">{colLeads.length}</span>
              </div>
              <div className="space-y-2">
                {colLeads.map(l => (
                  <div key={l.id} className="bg-gray-800 rounded-lg p-2.5 cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={() => { setForm({ name: l.name, contact: l.contact, status: l.status, notes: l.notes || '' }); setEditingId(l.id); setShowModal(true); }}>
                    <p className="text-white text-xs font-medium">{l.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{l.contact}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lista */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Buscar leads..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Nome</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Contato</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Etapa</th>
              <th className="text-right text-gray-400 text-xs font-medium uppercase px-6 py-3">Ação</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center text-gray-500 py-12">Nenhum lead encontrado.</td></tr>
            ) : filtered.map(l => (
              <tr key={l.id} className="border-b border-gray-800/50 hover:bg-gray-800/40">
                <td className="px-6 py-4 text-white font-medium text-sm">{l.name}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">{l.contact}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${funilColors[l.status]}`}>{funilLabels[l.status]}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => { setForm({ name: l.name, contact: l.contact, status: l.status, notes: l.notes || '' }); setEditingId(l.id); setShowModal(true); }}
                    className="flex items-center gap-1 ml-auto text-blue-400 hover:text-blue-300 text-xs transition-colors">
                    Editar <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-white text-xl font-bold">{editingId ? 'Editar Lead' : 'Novo Lead'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { label: 'Nome *', key: 'name', placeholder: 'Nome do potencial cliente' },
                { label: 'Contato *', key: 'contact', placeholder: 'E-mail ou telefone' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-gray-300 text-sm mb-1">{label}</label>
                  <input type="text" value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} required={label.includes('*')}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-gray-300 text-sm mb-1">Etapa do Funil</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm">
                  {funil.map(s => <option key={s} value={s}>{funilLabels[s]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Observações</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-sm">Cancelar</button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50">
                  {loading ? 'Salvando...' : editingId ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
