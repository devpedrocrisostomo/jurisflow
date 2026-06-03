import { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit2, Trash2, Phone, Mail, Building2, User } from 'lucide-react';
import axios from '../services/api';

const API = 'http://localhost:4000';
const getToken = () => localStorage.getItem('token');

const emptyForm = { type: 'PF', name: '', document: '', email: '', phone: '', address: '', notes: '' };

export default function Clientes() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchClients = async () => {
    try {
      const res = await axios.get(`${API}/clients`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setClients(res.data);
    } catch { setClients([]); }
  };

  useEffect(() => { fetchClients(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API}/clients/${editingId}`, form, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      } else {
        await axios.post(`${API}/clients`, form, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchClients();
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleEdit = (c: any) => {
    setForm({ type: c.type, name: c.name, document: c.document, email: c.email || '', phone: c.phone || '', address: c.address || '', notes: c.notes || '' });
    setEditingId(c.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este cliente?')) return;
    await axios.delete(`${API}/clients/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
    fetchClients();
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.document?.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Users className="w-4 h-4" /><span>Clientes</span>
          </div>
          <h1 className="text-white text-3xl font-bold">Clientes</h1>
          <p className="text-gray-400 mt-1">{clients.length} cliente(s) cadastrado(s)</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setEditingId(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />Novo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome, CPF/CNPJ ou e-mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Nome</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Tipo</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">CPF/CNPJ</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Contato</th>
              <th className="text-right text-gray-400 text-xs font-medium uppercase px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-12">
                  Nenhum cliente encontrado. Cadastre o primeiro!
                </td>
              </tr>
            ) : filtered.map((c) => (
              <tr key={c.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                      {c.type === 'PJ' ? <Building2 className="w-4 h-4 text-blue-400" /> : <User className="w-4 h-4 text-blue-400" />}
                    </div>
                    <span className="text-white font-medium">{c.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.type === 'PJ' ? 'bg-purple-900/40 text-purple-300' : 'bg-blue-900/40 text-blue-300'}`}>
                    {c.type === 'PJ' ? 'Jurídica' : 'Física'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300 text-sm font-mono">{c.document || '—'}</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {c.email && <div className="flex items-center gap-1 text-gray-400 text-xs"><Mail className="w-3 h-3" />{c.email}</div>}
                    {c.phone && <div className="flex items-center gap-1 text-gray-400 text-xs"><Phone className="w-3 h-3" />{c.phone}</div>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(c)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-white text-xl font-bold">{editingId ? 'Editar Cliente' : 'Novo Cliente'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex gap-4">
                <label className="flex-1 flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="PF" checked={form.type === 'PF'} onChange={() => setForm({ ...form, type: 'PF' })} className="text-blue-600" />
                  <span className="text-gray-300 text-sm">Pessoa Física</span>
                </label>
                <label className="flex-1 flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="PJ" checked={form.type === 'PJ'} onChange={() => setForm({ ...form, type: 'PJ' })} className="text-blue-600" />
                  <span className="text-gray-300 text-sm">Pessoa Jurídica</span>
                </label>
              </div>
              {[
                { label: 'Nome *', key: 'name', placeholder: 'Nome completo ou razão social', required: true },
                { label: form.type === 'PF' ? 'CPF *' : 'CNPJ *', key: 'document', placeholder: form.type === 'PF' ? '000.000.000-00' : '00.000.000/0000-00', required: true },
                { label: 'E-mail', key: 'email', placeholder: 'email@exemplo.com' },
                { label: 'Telefone', key: 'phone', placeholder: '(00) 00000-0000' },
                { label: 'Endereço', key: 'address', placeholder: 'Rua, número, cidade' },
              ].map(({ label, key, placeholder, required }) => (
                <div key={key}>
                  <label className="block text-gray-300 text-sm mb-1">{label}</label>
                  <input
                    type="text"
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    required={required}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              ))}
              <div>
                <label className="block text-gray-300 text-sm mb-1">Observações</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                  Cancelar
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50">
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
