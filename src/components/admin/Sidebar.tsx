import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  LogOut,
  Camera
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'bookings', label: 'Bookings', icon: BookOpen },
    { id: 'chats', label: 'Support Chats', icon: MessageSquare },
  ];

  return (
    <div className="w-64 bg-charcoal-800 border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <Camera className="w-8 h-8 text-gold-500" />
        <span className="font-sans font-bold text-lg text-white tracking-wider">ADMIN</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium tracking-wide border ${
                isActive 
                  ? 'bg-gold-500 text-charcoal-900 border-gold-400 shadow-lg shadow-gold-500/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
              }`}
            >
              <Icon className="w-5 h-5 transition-transform" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm font-medium border border-transparent"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
