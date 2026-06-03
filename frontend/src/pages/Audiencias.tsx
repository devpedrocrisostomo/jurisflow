import { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:4000';
const getToken = () => localStorage.getItem('token');

const tipos = ['Inicial', 'Instrução', 'Julgamento', 'Conciliação', 'Depoimento', 'Sustentação Oral'];

export default function Audiencias() {
  const [hearings, setHearings] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const emptyForm = { date: '', type: '', court: '', notes: '', caseId: '' };
  const [form, setForm] = useState(emptyForm);

  const fetchAll = async () => {
    try {
      const [hRes, cRes] = await Promise.all([
        axios.get(`${API}/hearings`, { headers: { Authorization: `Bearer ${getToken()}` } }),
        axios.get(`${API}/cases`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      ]);
      setHearings(hRes.data);
      setCases(cRes.data);
    } catch { }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, date: new Date(form.date).toISOString() };
      if (editingId) {
        await axios.put(`${API}/hearings/${editingId}`, payload, { headers: { Authorization: `Bearer ${getToken()}` } });
      } else {
        await axios.post(`${API}/hearings`, payload, { headers: { Authorization: `Bearer ${getToken()}` } });
      }
      setShowModal(false); setForm(emptyForm); setEditingId(null); fetchAll();
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  // Group by date
  const grouped = hearings.reduce((acc: any, h: any) => {
    const d = new Date(h.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    if (!acc[d]) acc[d] = [];
    acc[d].push(h);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1"><Calendar className="w-4 h-4" /><span>Audiências</span></div>
          <h1 className="text-white text-3xl font-bold">Audiências</h1>
          <p className="text-gray-400 mt-1">{hearings.length} audiência(s) cadastrada(s)</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />Nova Audiência
        </button>
      </div>

      {/* Timeline por data */}
      {Object.keys(grouped).length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center text-gray-500">
          Nenhuma audiência agendada. Clique em "Nova Audiência" para começar.
        </div>
      ) : Object.entries(grouped).map(([date, items]: [string, any]) => (
        <div key={date}>
          <h3 className="text-gray-400 text-sm font-medium capitalize mb-3 px-1">{date}</h3>
          <div className="space-y-3">
            {items.map((h: any) => (
              <div key={h.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-blue-800 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="text-center min-w-[50px]">
                      <p className="text-blue-400 text-xl font-bold">{new Date(h.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="text-gray-500 text-xs">hrs</p>
                    </div>
                    <div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-purple-900/40 text-purple-300">{h.type}</span>
                      <p className="text-white font-semibold mt-2">{h.court}</p>
                      {h.notes && <p className="text-gray-400 text-sm mt-1">{h.notes}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { setForm({ date: h.date?.slice(0, 16), type: h.type, court: h.court, notes: h.notes || '', caseId: h.caseId || '' }); setEditingId(h.id); setShowModal(true); }}
                      className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={async () => { if (confirm('Excluir?')) { await axios.delete(`${API}/hearings/${h.id}`, { headers: { Authorization: `Bearer ${getToken()}` } }); fetchAll(); } }}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-white text-xl font-bold">{editingId ? 'Editar Audiência' : 'Nova Audiência'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Data e Hora *</label>
                <input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Tipo de Audiência *</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm">
                  <option value="">Selecione...</option>
                  {tipos.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Tribunal / Local *</label>
                <input type="text" value={form.court} onChange={(e) => setForm({ ...form, court: e.target.value })} required placeholder="Ex: TJSP - 1ª Vara Cível"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Processo</label>
                <select value={form.caseId} onChange={(e) => setForm({ ...form, caseId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm">
                  <option value="">Selecione...</option>
                  {cases.map((c) => <option key={c.id} value={c.id}>{c.caseNumber}</option>)}
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
                  {loading ? 'Salvando...' : editingId ? 'Atualizar' : 'Agendar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
