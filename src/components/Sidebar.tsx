import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Cpu, 
  TrendingUp, 
  Database, 
  Tag, 
  Layers
} from 'lucide-react';
import { NavTab } from '../types/news';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

// Navigation items configuration
interface NavItemConfig {
  id: NavTab;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'Predict News', label: 'Predict News', icon: FileText },
  { id: 'NLP Pipeline', label: 'NLP Pipeline', icon: Cpu },
  { id: 'Model Performance', label: 'Model Performance', icon: TrendingUp },
  { id: 'Dataset Statistics', label: 'Dataset Statistics', icon: Database },
  { id: 'Categories', label: 'Categories', icon: Tag },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  return (
    <aside className="w-64 bg-[#0B132B] text-slate-200 flex flex-col shrink-0 min-h-screen border-r border-slate-800/80">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/30">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-tight text-base leading-tight">News Classifier</h1>
          <p className="text-xs text-slate-400 font-medium">AI-Powered News Analysis</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* System Status Footer Card */}
      <div className="p-4 border-t border-slate-800/60">
        <div className="bg-[#121E3E] border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-emerald-400 leading-tight">System Ready</p>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">All services are running</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
