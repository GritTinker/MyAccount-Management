
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2023-10-24', description: 'Web Dev Service', category: 'Sales', amount: 2450, type: 'income', status: 'cleared' },
  { id: '2', date: '2023-10-23', description: 'AWS Hosting', category: 'Software', amount: 49.99, type: 'expense', status: 'cleared' },
  { id: '3', date: '2023-10-22', description: 'Co-working Space', category: 'Rent', amount: 350, type: 'expense', status: 'pending' },
  { id: '4', date: '2023-10-20', description: 'Logo Design', category: 'Marketing', amount: 1200, type: 'income', status: 'cleared' },
];

const TransactionView: React.FC = () => {
  const [filter, setFilter] = useState<TransactionType | 'all'>('all');
  const [transactions] = useState(INITIAL_TRANSACTIONS);

  const filtered = transactions.filter(t => filter === 'all' || t.type === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">Transaction History</h3>
          <p className="text-secondary-green text-sm">Review and manage all financial movements</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg">
            <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${filter === 'all' ? 'bg-primary text-primary-content' : 'text-secondary-green'}`}>All</button>
            <button onClick={() => setFilter('income')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${filter === 'income' ? 'bg-primary text-primary-content' : 'text-secondary-green'}`}>Income</button>
            <button onClick={() => setFilter('expense')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${filter === 'expense' ? 'bg-primary text-primary-content' : 'text-secondary-green'}`}>Expenses</button>
          </div>
          <button className="h-10 px-4 bg-primary text-primary-content font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-all">+ Add Entry</button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/5 text-xs text-secondary-green border-b border-border-light dark:border-border-dark">
              <th className="px-6 py-4 font-bold uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Amount</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium">{t.date}</td>
                <td className="px-6 py-4 font-medium">{t.description}</td>
                <td className="px-6 py-4 text-secondary-green">{t.category}</td>
                <td className={`px-6 py-4 font-bold text-right ${t.type === 'income' ? 'text-primary' : 'text-red-500'}`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    t.status === 'cleared' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionView;
