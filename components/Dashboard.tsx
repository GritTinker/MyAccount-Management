import React from 'react';
import { Transaction, CurrencyType, LanguageType, ViewMode } from '../types';
import { formatCurrency, exportTransactionsToCSV } from '../utils/financeData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  onOpenNewEntry: (type?: 'income' | 'expense') => void;
  onNavigate: (view: ViewMode) => void;
  currency: CurrencyType;
  lang: LanguageType;
}

const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  onOpenNewEntry,
  onNavigate,
  currency,
  lang
}) => {
  const isTh = lang === 'th';

  // Compute stats from transactions
  const totalInflow = transactions
    .filter(t => t.type === 'income' && t.status === 'cleared')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense' && t.status === 'cleared')
    .reduce((sum, t) => sum + t.amount, 0);

  const startingCapital = 250000;
  const cashBalance = startingCapital + totalInflow - totalExpense;
  const netProfit = totalInflow - totalExpense;
  const valuation = Math.max(100000, netProfit * 4.5 + cashBalance);

  // Weekly data for chart
  const weeklyChartData = [
    { name: isTh ? 'สัปดาห์ 1' : 'W1', income: 90000, expense: 8900 },
    { name: isTh ? 'สัปดาห์ 2' : 'W2', income: 52000, expense: 15400 },
    { name: isTh ? 'สัปดาห์ 3' : 'W3', income: 182000, expense: 28000 },
    { name: isTh ? 'สัปดาห์ 4' : 'W4', income: 65000, expense: 155000 },
    { name: isTh ? 'สัปดาห์ 5' : 'W5', income: 145000, expense: 61300 },
  ];

  // Recent 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={isTh ? 'เงินสดคงเหลือ (Cash Balance)' : 'Cash Balance'}
          value={formatCurrency(cashBalance, currency)}
          change="+8.4%"
          sub={isTh ? 'สภาพคล่องพร้อมใช้' : 'Available liquidity'}
          icon="account_balance_wallet"
          positive={cashBalance >= 0}
        />
        <StatCard
          title={isTh ? 'กำไรสุทธิสะสม (Net Profit)' : 'Net Profit (YTD)'}
          value={formatCurrency(netProfit, currency)}
          change="+14.2%"
          sub={isTh ? 'รายรับหักรายจ่ายจริง' : 'Revenue minus expenses'}
          icon="monetization_on"
          positive={netProfit >= 0}
        />
        <StatCard
          title={isTh ? 'ค่าใช้จ่ายรวม (Total Expenses)' : 'Total Expenses'}
          value={formatCurrency(totalExpense, currency)}
          change="-3.5%"
          sub={isTh ? 'ต้นทุนและค่าดำเนินงาน' : 'COGS & OPEX'}
          icon="receipt_long"
          positive={false}
        />
        <StatCard
          title={isTh ? 'มูลค่าประเมินกิจการ (Valuation)' : 'Estimated Valuation'}
          value={formatCurrency(valuation, currency)}
          change="+6.0%"
          sub={isTh ? 'คำนวณจาก EBITDA x 4.5' : 'Based on earnings multiple'}
          icon="domain"
          positive={true}
        />
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Trajectory */}
        <div className="rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isTh ? 'กระแสเงินสดรับ รายสัปดาห์ (Cash Inflow Trend)' : 'Weekly Cash Flow Trajectory'}
              </h3>
              <p className="text-xs font-medium text-secondary-green dark:text-gray-400">
                {isTh ? 'แนวโน้มการไหลเข้าของเงินสดในเดือนปัจจุบัน' : 'Inflow performance across recent weeks'}
              </p>
            </div>
            <button 
              onClick={() => onNavigate(ViewMode.CashFlow)}
              className="text-xs font-bold text-emerald-700 dark:text-primary hover:underline flex items-center gap-1"
            >
              <span>{isTh ? 'ดูงบเต็ม' : 'Full Statement'}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyChartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#13ec37" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#13ec37" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                <XAxis dataKey="name" stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#888" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => currency === 'THB' ? `${(val/1000).toFixed(0)}k` : `$${(val/1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(val: any) => [formatCurrency(Number(val), currency), isTh ? 'รายรับ' : 'Income']}
                  contentStyle={{
                    backgroundColor: '#182c1b',
                    borderColor: '#2a422e',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="income" stroke="#13ec37" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income vs Expenses */}
        <div className="rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isTh ? 'เปรียบเทียบ รายรับ vs รายจ่าย (Income vs. Expense)' : 'Income vs. Expenses'}
              </h3>
              <p className="text-xs font-medium text-secondary-green dark:text-gray-400">
                {isTh ? 'สัดส่วนรายรับและรายจ่ายรายสัปดาห์' : 'Weekly operational comparison'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-primary">
                <span className="size-2 rounded-full bg-emerald-500"></span> {isTh ? 'รายรับ' : 'Income'}
              </span>
              <span className="inline-flex items-center gap-1 text-rose-500">
                <span className="size-2 rounded-full bg-rose-500"></span> {isTh ? 'รายจ่าย' : 'Expense'}
              </span>
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                <XAxis dataKey="name" stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#888" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => currency === 'THB' ? `${(val/1000).toFixed(0)}k` : `$${(val/1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(val: any, name: string) => [formatCurrency(Number(val), currency), name === 'income' ? (isTh ? 'รายรับ' : 'Income') : (isTh ? 'รายจ่าย' : 'Expense')]}
                  contentStyle={{
                    backgroundColor: '#182c1b',
                    borderColor: '#2a422e',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="income" fill="#13ec37" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Action Strip & Recent Ledger */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick action buttons & Stock Notice */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark p-5 flex flex-col gap-3 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-700 dark:text-amber-400">
                <span className="material-symbols-outlined text-xl">warning</span>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {isTh ? 'แจ้งเตือนวัตถุดิบใกล้หมด' : 'Low Stock Alert'}
                </p>
                <p className="text-secondary-green dark:text-gray-400 text-xs mt-0.5 leading-relaxed">
                  {isTh 
                    ? 'ลวดทองแดง (18 ม้วน) และ กาวอุตสาหกรรม (12 ลิตร) ต่ำกว่าเกณฑ์ขั้นต่ำ'
                    : 'Copper wiring & industrial adhesive are below safety threshold.'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate(ViewMode.Materials)}
              className="w-full flex items-center justify-center gap-2 rounded-xl h-9 px-4 bg-primary text-primary-content hover:bg-primary-hover transition-colors text-xs font-bold"
            >
              <span className="material-symbols-outlined text-base">inventory</span>
              <span>{isTh ? 'ตรวจสอบและสั่งซื้อวัตถุดิบ' : 'Manage Inventory'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <QuickActionButton
              icon="remove_circle_outline"
              label={isTh ? 'บันทึกรายจ่าย' : 'Log Expense'}
              onClick={() => onOpenNewEntry('expense')}
            />
            <QuickActionButton
              icon="add_circle_outline"
              label={isTh ? 'บันทึกรายรับ' : 'Add Income'}
              onClick={() => onOpenNewEntry('income')}
            />
            <QuickActionButton
              icon="calculate"
              label={isTh ? 'คำนวณจุดคุ้มทุน' : 'Break-even'}
              onClick={() => onNavigate(ViewMode.Calculations)}
            />
            <QuickActionButton
              icon="download"
              label={isTh ? 'ส่งออก CSV' : 'Export CSV'}
              onClick={() => exportTransactionsToCSV(transactions)}
            />
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="xl:col-span-2 rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isTh ? 'รายการธุรกรรมล่าสุด (Recent Transactions)' : 'Recent Transactions'}
              </h3>
              <p className="text-xs text-secondary-green dark:text-gray-400">
                {isTh ? 'บันทึกรายรับและรายจ่ายล่าสุดในระบบ' : 'Latest inflows and outflows'}
              </p>
            </div>
            <button
              onClick={() => onNavigate(ViewMode.Transactions)}
              className="text-xs font-bold text-emerald-700 dark:text-primary hover:underline flex items-center gap-1"
            >
              <span>{isTh ? 'ดูทั้งหมด' : 'View All'}</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="text-secondary-green dark:text-gray-400 border-b border-border-light dark:border-border-dark uppercase tracking-wider font-bold">
                  <th className="px-5 py-3">{isTh ? 'วันที่' : 'Date'}</th>
                  <th className="px-5 py-3">{isTh ? 'รายละเอียด' : 'Description'}</th>
                  <th className="px-5 py-3">{isTh ? 'หมวดหมู่' : 'Category'}</th>
                  <th className="px-5 py-3 text-right">{isTh ? 'จำนวนเงิน' : 'Amount'}</th>
                  <th className="px-5 py-3 text-center">{isTh ? 'สถานะ' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:border-border-dark">
                {recentTransactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-slate-600 dark:text-gray-300 whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                        {tx.description}
                      </td>
                      <td className="px-5 py-3.5 text-secondary-green dark:text-gray-400">
                        {tx.category}
                      </td>
                      <td className={`px-5 py-3.5 font-mono font-bold text-right tabular-nums ${isIncome ? 'text-emerald-600 dark:text-primary' : 'text-rose-600 dark:text-rose-400'}`}>
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${tx.status === 'cleared' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-primary' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>
                          {tx.status === 'cleared' ? (isTh ? 'เงินเข้าแล้ว' : 'Cleared') : (isTh ? 'รอดำเนินการ' : 'Pending')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string;
  change: string;
  sub: string;
  icon: string;
  positive: boolean;
}> = ({ title, value, change, sub, icon, positive }) => (
  <div className="flex flex-col gap-2 rounded-2xl p-5 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-secondary-green dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</p>
      <div className="size-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-secondary-green dark:text-primary">
        <span className="material-symbols-outlined text-lg">{icon}</span>
      </div>
    </div>
    <p className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white tabular-nums mt-1">{value}</p>
    <div className="flex items-center justify-between mt-1">
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${
        positive ? 'text-emerald-700 dark:text-primary bg-emerald-50 dark:bg-primary/10' : 'text-rose-600 bg-rose-50 dark:bg-rose-900/20'
      }`}>
        <span className="material-symbols-outlined text-xs">{positive ? 'trending_up' : 'trending_down'}</span>
        <span>{change}</span>
      </div>
      <span className="text-[11px] text-secondary-green dark:text-gray-400 truncate">{sub}</span>
    </div>
  </div>
);

const QuickActionButton: React.FC<{
  icon: string;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark hover:border-primary hover:shadow-sm transition-all group text-slate-800 dark:text-slate-100"
  >
    <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-primary/20 group-hover:text-emerald-700 dark:group-hover:text-primary transition-colors text-slate-700 dark:text-slate-200">
      <span className="material-symbols-outlined text-xl">{icon}</span>
    </div>
    <span className="text-xs font-bold text-center leading-tight">{label}</span>
  </button>
);

export default Dashboard;
