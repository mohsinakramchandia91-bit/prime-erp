"use client"
import { useState, useEffect } from 'react';
import { Package, Plus, AlertCircle, CheckCircle, X } from 'lucide-react';

interface Product {
  id: number; name: string; category: string; price: string; stock: number; status: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Electronics', price: '', stock: 0, status: 'In Stock' });

  const fetchProducts = () => {
    fetch('http://localhost:8000/api/products').then(res => res.json()).then(data => setProducts(data));
  };
  useEffect(() => { fetchProducts() }, []);

  const handleSave = async () => {
    await fetch('http://localhost:8000/api/products', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData),
    });
    setIsModalOpen(false); fetchProducts();
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-purple-400">Inventory Control</h1>
          <p className="text-gray-500">Track your stock levels real-time.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-purple-600 px-5 py-2 rounded-xl font-bold flex gap-2 hover:bg-purple-700">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock Level</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-800/50">
                <td className="p-4 font-bold flex items-center gap-3">
                  <Package className="text-gray-500" size={18} /> {p.name}
                </td>
                <td className="p-4 text-gray-400">{p.category}</td>
                <td className="p-4 font-mono text-green-400">{p.price}</td>
                <td className="p-4 font-bold">{p.stock} units</td>
                <td className="p-4">
                  <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${p.stock < 10 ? 'border-red-500 text-red-400 bg-red-500/10' : 'border-green-500 text-green-400 bg-green-500/10'}`}>
                    {p.stock < 10 ? <AlertCircle size={12}/> : <CheckCircle size={12}/>} {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl w-96 border border-gray-700">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Add Inventory</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400"/></button>
            </div>
            <div className="space-y-4">
              <input placeholder="Product Name" className="w-full bg-black/50 border border-gray-700 p-3 rounded text-white" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input placeholder="Price ($)" className="w-full bg-black/50 border border-gray-700 p-3 rounded text-white" onChange={(e) => setFormData({...formData, price: e.target.value})} />
              <input type="number" placeholder="Stock Qty" className="w-full bg-black/50 border border-gray-700 p-3 rounded text-white" onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})} />
              <select className="w-full bg-black/50 border border-gray-700 p-3 rounded text-white" onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option>Electronics</option><option>Furniture</option><option>Clothing</option>
              </select>
              <button onClick={handleSave} className="w-full bg-purple-600 py-3 rounded font-bold">Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}