import React from 'react';
import { 
  LayoutGrid, 
  Cookie, 
  CupSoda, 
  IceCream, 
  Truck, 
  GraduationCap 
} from 'lucide-react';
import { CATEGORIES } from '../types/categoryData';

const ICON_MAP = {
  LayoutGrid,
  Cookie,
  CupSoda,
  IceCream,
  Truck,
  GraduationCap
};

export default function CategoryTabs({ activeCategory, onSelectCategory, itemCounts }) {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-2 px-1">
        {CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || LayoutGrid;
          const isActive = activeCategory === cat.id;
          const count = itemCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-150 flex-shrink-0 shadow-sm ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-emerald-200/50 shadow-md transform -translate-y-0.5'
                  : 'bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100/90 border border-emerald-200/70'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
              <span>{cat.label}</span>
              <span
                className={`ml-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-200/80 text-emerald-800'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
