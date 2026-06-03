import { useState, useEffect } from 'react';
import { Briefcase, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import axios from '../services/api';

const API = 'http://localhost:4000';
const getToken = () => localStorage.getItem('token');

const statusColors: Record<string, string> = {
  'ATIVO': 'bg-green-900/40 text-green-300',
  'ARQUIVADO': 'bg-gray-700/60 text-gray-300',
  'SUSPENSO': 'bg-amber-900/40 text-amber-300',
  'ENCERRADO': 'bg-red-900/40 text-red-300',
};

const emptyForm = { caseNumber: '', court: '', jurisdiction: '', caseClass: '', legalArea: '', status: 'ATIVO', opposingParty: '', notes: '', clientId: '' };

export default function Processos() {
  const [cases, setCases] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    try {
      const [casesRes, clientsRes] = await Promise.all([
        axios.get(`${API}/cases`, { headers: { Authorization: `Bearer ${getToken()}` } }),
        axios.get(`${API}/clients`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      ]);
      setCases(casesRes.data);
      setClients(clientsRes.data);
    } catch { }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API}/cases/${editingId}`, form, { headers: { Authorization: `Bearer ${getToken()}` } });
      } else {
        await axios.post(`${API}/cases`, form, { headers: { Authorization: `Bearer ${getToken()}` } });
      }
      setShowModal(false); setForm(emptyForm); setEditingId(null); fetchAll();
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const filtered = cases.filter(c =>
    c.caseNumber?.includes(search) ||
    c.court?.toLowerCase().includes(search.toLowerCase()) ||
    c.legalArea?.toLowerCase().includes(search.toLowerCase())
  );

  const areas = ['Cível', 'Criminal', 'Trabalhista', 'Tributário', 'Previdenciário', 'Família', 'Empresarial', 'Ambiental', 'Administrativo', 'Consumidor'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1"><Briefcase className="w-4 h-4" /><span>Processos</span></div>
          <h1 className="text-white text-3xl font-bold">Processos</h1>
          <p className="text-gray-400 mt-1">{cases.length} processo(s) cadastrado(s)</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />Novo Processo
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Buscar por número, tribunal ou área..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Número do Processo</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Tribunal / Vara</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Área</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Status</th>
              <th className="text-right text-gray-400 text-xs font-medium uppercase px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-gray-500 py-12">Nenhum processo encontrado.</td></tr>
            ) : filtered.map((c) => (
              <tr key={c.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-white font-mono text-sm font-medium">{c.caseNumber}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{c.caseClass}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-200 text-sm">{c.court}</p>
                  <p className="text-gray-400 text-xs">{c.jurisdiction}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-900/40 text-blue-300">{c.legalArea}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[c.status] || 'bg-gray-700 text-gray-300'}`}>{c.status}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setForm({ caseNumber: c.caseNumber, court: c.court, jurisdiction: c.jurisdiction, caseClass: c.caseClass, legalArea: c.legalArea, status: c.status, opposingParty: c.opposingParty || '', notes: c.notes || '', clientId: c.clientId || '' }); setEditingId(c.id); setShowModal(true); }}
                      className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={async () => { if (confirm('Excluir?')) { await axios.delete(`${API}/cases/${c.id}`, { headers: { Authorization: `Bearer ${getToken()}` } }); fetchAll(); } }}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 sticky top-0 bg-gray-900">
              <h2 className="text-white text-xl font-bold">{editingId ? 'Editar Processo' : 'Novo Processo'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { label: 'Número do Processo *', key: 'caseNumber', placeholder: '0000000-00.0000.0.00.0000' },
                { label: 'Tribunal *', key: 'court', placeholder: 'Ex: TJSP, TRT, STJ' },
                { label: 'Vara *', key: 'jurisdiction', placeholder: 'Ex: 1ª Vara Cível' },
                { label: 'Classe Processual', key: 'caseClass', placeholder: 'Ex: Ação Ordinária' },
                { label: 'Parte Contrária', key: 'opposingParty', placeholder: 'Nome da parte contrária' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-gray-300 text-sm mb-1">{label}</label>
                  <input type="text" value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} required={label.includes('*')}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-gray-300 text-sm mb-1">Área Jurídica *</label>
                <select value={form.legalArea} onChange={(e) => setForm({ ...form, legalArea: e.target.value })} required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm">
                  <option value="">Selecione...</option>
                  {areas.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm">
                  {['ATIVO', 'SUSPENSO', 'ARQUIVADO', 'ENCERRADO'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Cliente</label>
                <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm">
                  <option value="">Selecione um cliente...</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
