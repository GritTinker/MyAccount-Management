
import React from 'react';
import { RawMaterial } from '../types';

const MATERIALS: RawMaterial[] = [
  { id: '1', name: 'High-Grade Steel', quantity: 450, unit: 'kg', costPerUnit: 12.5, expiryDate: '2025-12-31', status: 'good' },
  { id: '2', name: 'Copper Wiring', quantity: 20, unit: 'rolls', costPerUnit: 85, expiryDate: '2024-05-15', status: 'low-stock' },
  { id: '3', name: 'Industrial Adhesive', quantity: 5, unit: 'liters', costPerUnit: 45, expiryDate: '2023-11-01', status: 'expiring' },
  { id: '4', name: 'Polymer Sheets', quantity: 15, unit: 'sheets', costPerUnit: 22, expiryDate: '2023-10-10', status: 'damaged' },
];

const MaterialsView: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Raw Materials Inventory</h3>
          <p className="text-secondary-green text-sm">Monitor stock levels, waste, and expiry dates</p>
        </div>
        <button className="h-10 px-4 bg-primary text-primary-content font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-all">+ Add Item</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StockStat label="In Stock Items" value="12" sub="4 types" />
        <StockStat label="Low Stock Alert" value="2" sub="Immediate attention" warning />
        <StockStat label="Total Asset Value" value="$12,450" sub="Inventory value" />
        <StockStat label="Waste Value (MTD)" value="$420" sub="Expired/Damaged" danger />
      </div>

      <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/5 text-xs text-secondary-green border-b border-border-light dark:border-border-dark">
              <th className="px-6 py-4 font-bold uppercase">Material Name</th>
              <th className="px-6 py-4 font-bold uppercase">Quantity</th>
              <th className="px-6 py-4 font-bold uppercase text-right">Value</th>
              <th className="px-6 py-4 font-bold uppercase">Expiry</th>
              <th className="px-6 py-4 font-bold uppercase text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {MATERIALS.map(m => (
              <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-bold">{m.name}</td>
                <td className="px-6 py-4 font-medium text-secondary-green">{m.quantity} {m.unit}</td>
                <td className="px-6 py-4 font-bold text-right text-primary-content dark:text-white">${(m.quantity * m.costPerUnit).toLocaleString()}</td>
                <td className="px-6 py-4 text-secondary-green">{m.expiryDate}</td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={m.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StockStat: React.FC<{label: string, value: string, sub: string, warning?: boolean, danger?: boolean}> = ({label, value, sub, warning, danger}) => (
  <div className={`p-5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark ${warning ? 'border-orange-300 dark:border-orange-900' : danger ? 'border-red-300 dark:border-red-900' : ''}`}>
    <p className="text-xs font-bold text-secondary-green uppercase mb-1">{label}</p>
    <p className={`text-2xl font-black ${warning ? 'text-orange-500' : danger ? 'text-red-500' : ''}`}>{value}</p>
    <p className="text-[10px] text-secondary-green font-medium mt-1">{sub}</p>
  </div>
);

const StatusBadge: React.FC<{status: string}> = ({status}) => {
  const styles: Record<string, string> = {
    'good': 'bg-primary/10 text-primary',
    'low-stock': 'bg-orange-100 text-orange-600',
    'expiring': 'bg-yellow-100 text-yellow-600',
    'expired': 'bg-red-100 text-red-600',
    'damaged': 'bg-red-50 text-red-800'
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status] || 'bg-gray-100'}`}>
      {status.replace('-', ' ')}
    </span>
  );
};

export default MaterialsView;
