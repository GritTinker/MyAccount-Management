
import React from 'react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [currentTime] = React.useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  return (
    <header className="flex flex-wrap justify-between items-end gap-4 pb-4 border-b border-border-light dark:border-border-dark">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-primary-content dark:text-white">
          Good morning, Alex
        </h2>
        <div className="flex items-center gap-2 text-secondary-green dark:text-primary/70">
          <span className="material-symbols-outlined text-sm">sync</span>
          <p className="text-sm font-medium">Last Synced: Today, {currentTime}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-bold shadow-sm">
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          <span>Refresh Data</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
