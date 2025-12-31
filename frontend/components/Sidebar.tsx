"use client"
import Link from 'next/link';
import { LayoutDashboard, Users, Box, Wallet, Settings, LogOut, Briefcase } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'CRM & Sales', icon: Users, path: '/crm' },
    { name: 'HR & Team', icon: Briefcase, path: '/hr' }, // <--- YEH RAHA APKA HR BUTTON
    { name: 'Inventory', icon: Box, path: '/inventory' },
    { name: 'Finance', icon: Wallet, path: '/finance' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white border-r border-gray-800 flex flex-col fixed left-0 top-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Prime ERP
        </h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.path}
            className="flex items-center gap-3 p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all duration-200"
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center gap-3 w-full p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}