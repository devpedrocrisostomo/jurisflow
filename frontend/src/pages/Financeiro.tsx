import { useState, useEffect } from 'react';
import { DollarSign, Plus, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:4000';
const getToken = () => localStorage.getItem('token');

const categorias = {
  RECEITA: ['Honorários', 'Consultoria', 'Contrato Mensal', 'Acordo', 'Outros'],
  DESPESA: ['Custas Judiciais', 'Taxas', 'Deslocamento', 'Operacional', 'Escritório', 'Outros'],
};

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Financeiro() {
  const [entries, setEntries] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const emptyForm = { type: 'RECEITA', category: '', amount: '', dueDate: '', status: 'PENDENTE', notes: '' };
  const [form, setForm] = useState(emptyForm);

  const fetchAll = async () => {
    try {
      const res = await axios.get(`${API}/finance`, { headers: { Authorization: `Bearer ${getToken()}` } });
      setEntries(res.data);
    } catch { }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/finance`, { ...form, amount: parseFloat(form.amount), dueDate: new Date(form.dueDate).toISOString() },
        { headers: { Authorization: `Bearer ${getToken()}` } });
      setShowModal(false); setForm(emptyForm); fetchAll();
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const receitas = entries.filter(e => e.type === 'RECEITA').reduce((a, e) => a + e.amount, 0);
  const despesas = entries.filter(e => e.type === 'DESPESA').reduce((a, e) => a + e.amount, 0);
  const saldo = receitas - despesas;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1"><DollarSign className="w-4 h-4" /><span>Financeiro</span></div>
          <h1 className="text-white text-3xl font-bold">Financeiro</h1>
          <p className="text-gray-400 mt-1">Controle de receitas e despesas</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />Novo Lançamento
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-900/20 border border-green-800/50 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-green-400 text-sm">Receitas</p>
            <p className="text-white text-2xl font-bold">{fmt(receitas)}</p>
          </div>
        </div>
        <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-red-400 text-sm">Despesas</p>
            <p className="text-white text-2xl font-bold">{fmt(despesas)}</p>
          </div>
        </div>
        <div className={`border rounded-xl p-5 flex items-center gap-4 ${saldo >= 0 ? 'bg-blue-900/20 border-blue-800/50' : 'bg-red-900/20 border-red-800/50'}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${saldo >= 0 ? 'bg-blue-600' : 'bg-red-600'}`}>
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Saldo</p>
            <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-300' : 'text-red-300'}`}>{fmt(saldo)}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Tipo</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Categoria</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Vencimento</th>
              <th className="text-left text-gray-400 text-xs font-medium uppercase px-6 py-3">Status</th>
              <th className="text-right text-gray-400 text-xs font-medium uppercase px-6 py-3">Valor</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-gray-500 py-12">Nenhum lançamento encontrado.</td></tr>
            ) : entries.map((e) => (
              <tr key={e.id} className="border-b border-gray-800/50 hover:bg-gray-800/40">
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${e.type === 'RECEITA' ? 'bg-green-900/40 text-green-300' : 'bg-red-900/40 text-red-300'}`}>{e.type}</span>
                </td>
                <td className="px-6 py-4 text-gray-200 text-sm">{e.category}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">{new Date(e.dueDate).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${e.status === 'PAGO' ? 'bg-green-900/40 text-green-300' : 'bg-amber-900/40 text-amber-300'}`}>{e.status}</span>
                </td>
                <td className={`px-6 py-4 text-right font-bold ${e.type === 'RECEITA' ? 'text-green-400' : 'text-red-400'}`}>
                  {e.type === 'RECEITA' ? '+' : '-'}{fmt(e.amount)}
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
              <h2 className="text-white text-xl font-bold">Novo Lançamento</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex gap-4">
                {['RECEITA', 'DESPESA'].map(t => (
                  <label key={t} className="flex-1 flex items-center gap-2 cursor-pointer">
                    <input type="radio" value={t} checked={form.type === t} onChange={() => setForm({ ...form, type: t, category: '' })} />
                    <span className={`text-sm font-medium ${t === 'RECEITA' ? 'text-green-400' : 'text-red-400'}`}>{t}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Categoria *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm">
                  <option value="">Selecione...</option>
                  {(categorias[form.type as keyof typeof categorias]).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Valor (R$) *</label>
                <input type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required placeholder="0,00"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Vencimento *</label>
                <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm">
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="PAGO">PAGO</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Observações</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-sm">Cancelar</button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50">
                  {loading ? 'Salvando...' : 'Lançar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
