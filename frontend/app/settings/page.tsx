"use client"
import { useState, useEffect } from 'react';
import { Save, Trash2, Shield, Bell, User, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  
  // Toggles ki State (By default ON hain)
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [message, setMessage] = useState("");

  // System Reset Function
  const handleReset = async () => {
    if (confirm("WARNING: Are you sure? Sab data delete ho jayega!")) {
      setLoading(true);
      try {
        await fetch('http://localhost:8000/api/settings/reset', { method: 'DELETE' });
        alert("System Cleaned Successfully! 🧹");
        window.location.href = "/";
      } catch (error) {
        alert("Backend shayad band hai!");
      }
      setLoading(false);
    }
  };

  // Settings Save Karne ka Function
  const handleSaveSettings = () => {
    // Asal mein yahan hum backend par bhej sakte hain, filhal localStorage mein save karenge
    localStorage.setItem('prime_theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('prime_notifs', emailNotifs ? 'true' : 'false');
    
    setMessage("Preferences Saved Successfully! ✅");
    setTimeout(() => setMessage(""), 3000); // 3 second baad message gayab
  };

  return (
    <div className="text-white max-w-4xl mx-auto fade-in">
      <h1 className="text-3xl font-bold mb-8 text-gray-200">System Settings</h1>

      {/* --- COMPANY PROFILE --- */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
          <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><User size={24}/></div>
          <h2 className="text-xl font-bold">Company Profile</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-gray-400 text-sm">Company Name</label>
            <input type="text" defaultValue="Prime Luxury ERP" className="w-full bg-black/50 border border-gray-700 p-3 rounded-xl text-white outline-none focus:border-blue-500 transition" />
          </div>
          <div className="space-y-2">
            <label className="text-gray-400 text-sm">Admin Email</label>
            <input type="email" defaultValue="admin@prime-erp.com" className="w-full bg-black/50 border border-gray-700 p-3 rounded-xl text-white outline-none focus:border-blue-500 transition" />
          </div>
        </div>
      </div>

      {/* --- PREFERENCES (AB CHALEGA) --- */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
          <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg"><Bell size={24}/></div>
          <h2 className="text-xl font-bold">Preferences</h2>
        </div>
        
        <div className="space-y-4">
          {/* Dark Mode Toggle */}
          <div 
            className="flex justify-between items-center p-4 hover:bg-gray-800 rounded-xl transition cursor-pointer"
            onClick={() => setDarkMode(!darkMode)}
          >
            <span>Enable Dark Mode (Theme)</span>
            <div className={`w-14 h-7 rounded-full flex items-center px-1 transition-all duration-300 ${darkMode ? 'bg-green-500/20' : 'bg-gray-700'}`}>
              <div className={`w-5 h-5 rounded-full shadow-md transform transition-all duration-300 ${darkMode ? 'bg-green-500 translate-x-7' : 'bg-gray-400 translate-x-0'}`}></div>
            </div>
          </div>

          {/* Email Toggle */}
          <div 
            className="flex justify-between items-center p-4 hover:bg-gray-800 rounded-xl transition cursor-pointer"
            onClick={() => setEmailNotifs(!emailNotifs)}
          >
            <span>Email Notifications</span>
            <div className={`w-14 h-7 rounded-full flex items-center px-1 transition-all duration-300 ${emailNotifs ? 'bg-blue-500/20' : 'bg-gray-700'}`}>
              <div className={`w-5 h-5 rounded-full shadow-md transform transition-all duration-300 ${emailNotifs ? 'bg-blue-500 translate-x-7' : 'bg-gray-400 translate-x-0'}`}></div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex items-center gap-4">
          <button 
            onClick={handleSaveSettings}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition"
          >
            <Save size={18} /> Save Preferences
          </button>
          {message && <span className="text-green-400 flex items-center gap-2 text-sm animate-pulse"><CheckCircle size={16}/> {message}</span>}
        </div>
      </div>

      {/* --- DANGER ZONE --- */}
      <div className="bg-red-900/10 border border-red-500/30 rounded-2xl p-8 opacity-80 hover:opacity-100 transition">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/20 text-red-500 rounded-lg"><Shield size={24}/></div>
          <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>
        </div>
        <p className="text-gray-400 mb-6">Resetting the system will delete all customers, employees, inventory, and finance data permanently.</p>
        
        <button 
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
        >
          {loading ? "Cleaning..." : <><Trash2 size={18} /> Reset Entire System</>}
        </button>
      </div>
    </div>
  );
}