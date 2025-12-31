"use client"
import { useState, useEffect } from 'react';
import { Users, Briefcase, Package, Wallet, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [data, setData] = useState({ customers: 0, employees: 0, products: 0, balance: 0 });

  useEffect(() => {
    fetch('http://localhost:8000/api/home')
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  // Card Component for clean code
  const StatCard = ({ title, value, icon: Icon, color, link }: any) => (
    <Link href={link} className="block group">
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition relative overflow-hidden">
        <div className={`absolute right-4 top-4 p-3 rounded-full bg-${color}-500/10 text-${color}-500 group-hover:scale-110 transition`}>
          <Icon size={24} />
        </div>
        <p className="text-gray-400 font-medium mb-2">{title}</p>
        <h2 className="text-4xl font-bold text-white mb-4">
          {title === 'Total Revenue' ? `$${value.toLocaleString()}` : value}
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-blue-400 transition">
          View Details <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );

  return (
    <div className="text-white">
      {/* Welcome Section */}
      <div className="mb-10 p-8 rounded-3xl bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/20">
        <h1 className="text-4xl font-bold mb-2">Welcome back, Boss! 👋</h1>
        <p className="text-gray-300">Here is what's happening in your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={data.balance} icon={Wallet} color="green" link="/finance" />
        <StatCard title="Active Clients" value={data.customers} icon={Users} color="blue" link="/crm" />
        <StatCard title="Team Members" value={data.employees} icon={Briefcase} color="purple" link="/hr" />
        <StatCard title="In Stock" value={data.products} icon={Package} color="yellow" link="/inventory" />
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link href="/crm" className="px-6 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition">
            + Add Customer
          </Link>
          <Link href="/finance" className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl font-bold hover:bg-gray-700 transition">
            Record Transaction
          </Link>
        </div>
      </div>
    </div>
  );
}