"use client"
import { useState, useEffect } from 'react';
import { Search, Plus, X, MoreHorizontal, Save } from 'lucide-react';

// --- Types ---
interface Customer {
  id: number;
  name: string;
  company: string;
  email: string;
  status: string;
  value: string;
}

export default function CRMPage() {
  const [leads, setLeads] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal control
  
  // Naye Customer ka data yahan store hoga
  const [formData, setFormData] = useState({
    name: '', company: '', email: '', status: 'New', value: ''
  });

  // 1. Data Mangwana (GET)
  const fetchCustomers = () => {
    fetch('http://localhost:8000/api/customers')
      .then((res) => res.json())
      .then((data) => {
        setLeads(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error:", err));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 2. Data Save Karna (POST)
  const handleSave = async () => {
    if (!formData.name || !formData.value) return alert("Naam aur Value likhna zaroori hai!");

    // Backend ko data bhejo
    await fetch('http://localhost:8000/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    // List refresh karo aur modal band karo
    fetchCustomers();
    setIsModalOpen(false);
    setFormData({ name: '', company: '', email: '', status: 'New', value: '' }); // Form clear
  };

  // Status Colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'Negotiation': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Won': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Lost': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="text-white relative">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            CRM Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Real-time Database Connection</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black px-5 py-2 rounded-xl font-bold hover:bg-gray-200 transition flex items-center gap-2"
        >
          <Plus size={18} /> Add Customer
        </button>
      </div>

      {/* DATA TABLE */}
      {loading ? (
        <div className="text-center py-20 text-gray-500 animate-pulse">Loading Engine...</div>
      ) : (
        <div className="overflow-hidden border border-gray-800 rounded-2xl bg-black/40 backdrop-blur-md">
          <table className="w-full text-left">
            <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Company</th>
                <th className="p-4">Status</th>
                <th className="p-4">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-900/50 transition">
                  <td className="p-4 font-semibold">{lead.name}</td>
                  <td className="p-4 text-gray-300">{lead.company}</td>
                  <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(lead.status)}`}>{lead.status}</span></td>
                  <td className="p-4 font-mono">{lead.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- ADD CUSTOMER MODAL (POPUP) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl w-96 shadow-2xl shadow-purple-500/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">New Customer</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
            </div>
            
            <div className="space-y-4">
              <input 
                placeholder="Full Name" 
                className="w-full bg-black/50 border border-gray-700 p-3 rounded-lg text-white focus:border-purple-500 outline-none"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input 
                placeholder="Company Name" 
                className="w-full bg-black/50 border border-gray-700 p-3 rounded-lg text-white focus:border-purple-500 outline-none"
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
              <input 
                placeholder="Value (e.g. $5,000)" 
                className="w-full bg-black/50 border border-gray-700 p-3 rounded-lg text-white focus:border-purple-500 outline-none"
                onChange={(e) => setFormData({...formData, value: e.target.value})}
              />
              <select 
                className="w-full bg-black/50 border border-gray-700 p-3 rounded-lg text-white outline-none"
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="New">New Lead</option>
                <option value="Won">Won (Success)</option>
                <option value="Lost">Lost</option>
              </select>

              <button 
                onClick={handleSave}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg mt-4 flex items-center justify-center gap-2"
              >
                <Save size={18} /> Save Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}