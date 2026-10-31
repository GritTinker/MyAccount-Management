
import React from 'react';
import { ViewMode } from '../types';

interface SidebarProps {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { mode: ViewMode.Dashboard, label: 'Dashboard', icon: 'dashboard' },
    { mode: ViewMode.CashFlow, label: 'Cash Flow', icon: 'payments' },
    { mode: ViewMode.Transactions, label: 'Income & Expenses', icon: 'compare_arrows' },
    { mode: ViewMode.Calculations, label: 'Valuation & Break-even', icon: 'monitoring' },
    { mode: ViewMode.Materials, label: 'Raw Materials', icon: 'inventory_2' },
  ];

  return (
    <aside className="w-full md:w-[280px] flex-shrink-0 border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-background-dark p-4 flex flex-col justify-between min-h-screen sticky top-0">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="bg-primary size-10 rounded-full flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-primary-content font-bold">account_balance</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-tight">FinanceOS</h1>
            <p className="text-secondary-green text-xs font-medium">Accounting System</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.mode}
              onClick={() => setActiveView(item.mode)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                activeView === item.mode
                  ? 'bg-primary text-primary-content font-bold shadow-md shadow-primary/20'
                  : 'text-secondary-green hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span className={`material-symbols-outlined ${activeView === item.mode ? 'filled' : ''}`}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl h-12 px-4 bg-primary text-primary-content hover:bg-primary/90 transition-all shadow-lg shadow-primary/30">
        <span className="material-symbols-outlined text-[20px]">add</span>
        <span className="text-sm font-bold tracking-wide">New Entry</span>
      </button>
    </aside>
  );
};

export default Sidebar;
