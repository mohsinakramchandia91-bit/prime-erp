"use client"
import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, X, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Transaction {
  id: number; title: string; amount: number; type: string; category: string;
}

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: 0, type: 'Income', category: 'Sales' });

  const fetchFinance = () => {
    fetch('http://localhost:8000/api/finance').then(res => res.json()).then(data => setTransactions(data));
  };
  useEffect(() => { fetchFinance() }, []);

  const handleSave = async () => {
    await fetch('http://localhost:8000/api/finance', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData),
    });
    setIsModalOpen(false); fetchFinance();
  };

  // Hisaab Kitab (Calculations)
  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400">Finance & Accounts</h1>
          <p className="text-gray-500">Track your cash flow.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-yellow-500 text-black px-5 py-2 rounded-xl font-bold flex gap-2 hover:bg-yellow-400">
          <Plus size={18} /> New Transaction
        </button>
      </div>

      {/* --- MONEY CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl">
          <p className="text-gray-400 mb-2">Total Balance</p>
          <h2 className={`text-4xl font-bold ${balance >= 0 ? 'text-white' : 'text-red-500'}`}>${balance.toLocaleString()}</h2>
        </div>
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl relative overflow-hidden">
          <div className="absolute right-4 top-4 text-green-500/20"><TrendingUp size={40}/></div>
          <p className="text-gray-400 mb-2">Total Income</p>
          <h2 className="text-3xl font-bold text-green-400">+${totalIncome.toLocaleString()}</h2>
        </div>
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl relative overflow-hidden">
          <div className="absolute right-4 top-4 text-red-500/20"><TrendingDown size={40}/></div>
          <p className="text-gray-400 mb-2">Total Expenses</p>
          <h2 className="text-3xl font-bold text-red-400">-${totalExpense.toLocaleString()}</h2>
        </div>
      </div>

      {/* --- TRANSACTION LIST --- */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 text-gray-400 font-bold">Recent Transactions</div>
        <div className="divide-y divide-gray-800">
          {transactions.map((t) => (
            <div key={t.id} className="p-4 flex justify-between items-center hover:bg-gray-800/50 transition">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${t.type === 'Income' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {t.type === 'Income' ? <ArrowDownRight size={20}/> : <ArrowUpRight size={20}/>}
                </div>
                <div>
                  <h3 className="font-bold">{t.title}</h3>
                  <p className="text-sm text-gray-500">{t.category}</p>
                </div>
              </div>
              <div className={`font-mono font-bold ${t.type === 'Income' ? 'text-green-400' : 'text-red-400'}`}>
                {t.type === 'Income' ? '+' : '-'}${t.amount.toLocaleString()}
              </div>
            </div>
          ))}
          {transactions.length === 0 && <div className="p-8 text-center text-gray-500">No transactions yet. Add one!</div>}
        </div>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl w-96 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
            <div className="space-y-4">
              <input placeholder="Title (e.g. Sold Laptop)" className="w-full bg-black/50 border border-gray-700 p-3 rounded text-white" onChange={(e) => setFormData({...formData, title: e.target.value})} />
              <input type="number" placeholder="Amount" className="w-full bg-black/50 border border-gray-700 p-3 rounded text-white" onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})} />
              
              <div className="grid grid-cols-2 gap-2">
                <select className="bg-black/50 border border-gray-700 p-3 rounded text-white" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="Income">Income (+)</option>
                  <option value="Expense">Expense (-)</option>
                </select>
                <select className="bg-black/50 border border-gray-700 p-3 rounded text-white" onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option>Sales</option><option>Salary</option><option>Rent</option><option>Purchase</option>
                </select>
              </div>

              <button onClick={handleSave} className="w-full bg-yellow-500 text-black py-3 rounded font-bold">Save Transaction</button>
              <button onClick={() => setIsModalOpen(false)} className="w-full text-gray-500 py-2">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}