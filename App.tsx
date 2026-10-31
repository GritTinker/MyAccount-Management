
import React, { useState, useEffect } from 'react';
import { ViewMode } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CashFlowView from './components/CashFlowView';
import TransactionView from './components/TransactionView';
import ValuationView from './components/ValuationView';
import MaterialsView from './components/MaterialsView';
import Header from './components/Header';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>(ViewMode.Dashboard);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderView = () => {
    switch (activeView) {
      case ViewMode.Dashboard:
        return <Dashboard />;
      case ViewMode.CashFlow:
        return <CashFlowView />;
      case ViewMode.Transactions:
        return <TransactionView />;
      case ViewMode.Calculations:
        return <ValuationView />;
      case ViewMode.Materials:
        return <MaterialsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background-light dark:bg-background-dark">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="max-w-[1280px] w-full mx-auto p-4 md:p-8 flex flex-col gap-6">
          <Header 
            isDarkMode={isDarkMode} 
            toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
          />
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
