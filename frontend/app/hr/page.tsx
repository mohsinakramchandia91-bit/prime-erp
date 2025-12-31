"use client"
import { useState, useEffect } from 'react';
import { UserPlus, Briefcase, DollarSign, X } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  salary: string;
  status: string;
}

export default function HRPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', role: '', department: 'IT', salary: '', status: 'Active'
  });

  // Data Mangwana
  const fetchEmployees = () => {
    fetch('http://localhost:8000/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.log(err));
  };

  useEffect(() => { fetchEmployees() }, []);

  // Save Karna
  const handleSave = async () => {
    await fetch('http://localhost:8000/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setIsModalOpen(false);
    fetchEmployees();
  };

  return (
    <div className="text-white fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">HR Management</h1>
          <p className="text-gray-500">Manage your team and payroll.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 px-5 py-2 rounded-xl font-bold flex gap-2 hover:bg-blue-700 transition">
          <UserPlus size={18} /> Add Employee
        </button>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-blue-500/50 transition shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold text-blue-400 border border-gray-700">
                {emp.name.charAt(0)}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {emp.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">{emp.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{emp.role}</p>
            
            <div className="flex justify-between text-sm border-t border-gray-800 pt-4">
              <div className="flex items-center gap-2 text-gray-400"><Briefcase size={14}/> {emp.department}</div>
              <div className="flex items-center gap-1 text-green-400 font-mono"><DollarSign size={14}/> {emp.salary}</div>
            </div>
          </div>
        ))}
      </div>

      {/* --- ADD EMPLOYEE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl w-96 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">New Employee</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400 hover:text-white"/></button>
            </div>
            
            <div className="space-y-4">
              <input placeholder="Name" className="w-full bg-black/50 border border-gray-700 p-3 rounded-lg text-white outline-none focus:border-blue-500" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input placeholder="Role (e.g. Designer)" className="w-full bg-black/50 border border-gray-700 p-3 rounded-lg text-white outline-none focus:border-blue-500" onChange={(e) => setFormData({...formData, role: e.target.value})} />
              <input placeholder="Salary ($5,000)" className="w-full bg-black/50 border border-gray-700 p-3 rounded-lg text-white outline-none focus:border-blue-500" onChange={(e) => setFormData({...formData, salary: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-2">
                <select className="bg-black/50 border border-gray-700 p-3 rounded-lg text-white outline-none" onChange={(e) => setFormData({...formData, department: e.target.value})}>
                  <option value="IT">IT Dept</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                </select>
                <select className="bg-black/50 border border-gray-700 p-3 rounded-lg text-white outline-none" onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold mt-2 text-white">Save Employee</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}