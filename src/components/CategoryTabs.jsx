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
    <div className="w-full mb-4 sm:mb-6">
      <div className="relative">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 px-1 touch-pan-x">
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || LayoutGrid;
            const isActive = activeCategory === cat.id;
            const count = itemCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-150 flex-shrink-0 active:scale-95 shadow-2xs ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-emerald-200/60 shadow-md ring-2 ring-emerald-600/30'
                    : 'bg-emerald-50/90 text-emerald-900 hover:bg-emerald-100 border border-emerald-200/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                <span>{cat.label}</span>
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-emerald-200/90 text-emerald-800'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
