import React from 'react';
import { AppView } from '../types';
import { ShoppingBag, Image as ImageIcon, Wand2, Layers } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: AppView.MOCKUP, label: 'Logo Mockups', icon: ShoppingBag, description: 'Place logo on products' },
    { id: AppView.EDITOR, label: 'Smart Editor', icon: Wand2, description: 'Edit images with text' },
    { id: AppView.GENERATOR, label: 'Image Gen', icon: ImageIcon, description: 'Create images from scratch' },
  ];

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-full shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-gray-700">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">MerchMocker</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-indigo-400'}`} />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs ${isActive ? 'text-indigo-200' : 'text-gray-500'}`}>{item.description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="bg-gray-900/50 rounded-lg p-3 text-xs text-gray-500">
          Powered by <span className="text-indigo-400 font-semibold">Gemini 2.5</span> & <span className="text-indigo-400 font-semibold">Imagen 4</span>
        </div>
      </div>
    </div>
  );
};
