import React, { useState, useMemo } from 'react';
import { Transaction, CashFlowPeriod, CurrencyType, LanguageType } from '../types';
import { formatCurrency, exportTransactionsToCSV } from '../utils/financeData';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface CashFlowViewProps {
  transactions: Transaction[];
  onOpenNewEntry: (type?: 'income' | 'expense') => void;
  currency: CurrencyType;
  lang: LanguageType;
}

const CashFlowView: React.FC<CashFlowViewProps> = ({
  transactions,
  onOpenNewEntry,
  currency,
  lang
}) => {
  const [period, setPeriod] = useState<CashFlowPeriod>('weekly');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-10');
  const [showForecast, setShowForecast] = useState<boolean>(true);

  const isTh = lang === 'th';

  // Compute Weekly Data for the selected month
  const weeklyData = useMemo(() => {
    // 5 standard weeks
    const weeks: { [key: string]: { name: string; weekLabel: string; inflow: number; outflow: number; net: number; balance: number } } = {
      'W1': { name: 'สัปดาห์ที่ 1', weekLabel: 'W1 (1-7)', inflow: 0, outflow: 0, net: 0, balance: 0 },
      'W2': { name: 'สัปดาห์ที่ 2', weekLabel: 'W2 (8-14)', inflow: 0, outflow: 0, net: 0, balance: 0 },
      'W3': { name: 'สัปดาห์ที่ 3', weekLabel: 'W3 (15-21)', inflow: 0, outflow: 0, net: 0, balance: 0 },
      'W4': { name: 'สัปดาห์ที่ 4', weekLabel: 'W4 (22-28)', inflow: 0, outflow: 0, net: 0, balance: 0 },
      'W5': { name: 'สัปดาห์ที่ 5', weekLabel: 'W5 (29-31)', inflow: 0, outflow: 0, net: 0, balance: 0 },
    };

    let startingBalance = 250000; // base starting cash for the period

    transactions.forEach(t => {
      if (t.date.startsWith(selectedMonth)) {
        const day = parseInt(t.date.split('-')[2], 10);
        let weekKey = 'W1';
        if (day <= 7) weekKey = 'W1';
        else if (day <= 14) weekKey = 'W2';
        else if (day <= 21) weekKey = 'W3';
        else if (day <= 28) weekKey = 'W4';
        else weekKey = 'W5';

        if (t.type === 'income') {
          weeks[weekKey].inflow += t.amount;
        } else {
          weeks[weekKey].outflow += t.amount;
        }
      }
    });

    let running = startingBalance;
    return Object.keys(weeks).map(key => {
      const w = weeks[key];
      w.net = w.inflow - w.outflow;
      running += w.net;
      w.balance = running;
      return {
        key,
        name: isTh ? w.name : `Week ${key.substring(1)}`,
        label: w.weekLabel,
        inflow: w.inflow,
        outflow: w.outflow,
        net: w.net,
        balance: w.balance
      };
    });
  }, [transactions, selectedMonth, isTh]);

  // Compute Monthly Data (last 6 months)
  const monthlyData = useMemo(() => {
    const monthNames = [
      { key: '2026-05', th: 'พ.ค.', en: 'May' },
      { key: '2026-06', th: 'มิ.ย.', en: 'Jun' },
      { key: '2026-07', th: 'ก.ค.', en: 'Jul' },
      { key: '2026-08', th: 'ส.ค.', en: 'Aug' },
      { key: '2026-09', th: 'ก.ย.', en: 'Sep' },
      { key: '2026-10', th: 'ต.ค.', en: 'Oct' },
    ];

    let runningBalance = 180000;

    return monthNames.map(m => {
      let inflow = 0;
      let outflow = 0;

      transactions.forEach(t => {
        if (t.date.startsWith(m.key)) {
          if (t.type === 'income') inflow += t.amount;
          else outflow += t.amount;
        }
      });

      // If month has no transactions in demo set, provide sensible historical anchor
      if (inflow === 0 && outflow === 0 && m.key !== '2026-10') {
        if (m.key === '2026-05') { inflow = 320000; outflow = 210000; }
        if (m.key === '2026-06') { inflow = 340000; outflow = 240000; }
        if (m.key === '2026-07') { inflow = 390000; outflow = 260000; }
        if (m.key === '2026-08') { inflow = 410000; outflow = 290000; }
        if (m.key === '2026-09') { inflow = 460000; outflow = 310000; }
      }

      const net = inflow - outflow;
      runningBalance += net;

      return {
        key: m.key,
        name: isTh ? m.th : m.en,
        inflow,
        outflow,
        net,
        balance: runningBalance
      };
    });
  }, [transactions, isTh]);

  // Compute Daily Data (days of selected month that have entries)
  const dailyData = useMemo(() => {
    const dayMap: { [day: string]: { inflow: number; outflow: number } } = {};
    for (let i = 1; i <= 31; i++) {
      const d = i < 10 ? `0${i}` : `${i}`;
      dayMap[d] = { inflow: 0, outflow: 0 };
    }

    transactions.forEach(t => {
      if (t.date.startsWith(selectedMonth)) {
        const day = t.date.split('-')[2];
        if (dayMap[day]) {
          if (t.type === 'income') dayMap[day].inflow += t.amount;
          else dayMap[day].outflow += t.amount;
        }
      }
    });

    let running = 250000;
    return Object.keys(dayMap).map(day => {
      const item = dayMap[day];
      const net = item.inflow - item.outflow;
      running += net;
      return {
        day: `${day} ต.ค.`,
        name: `${day}`,
        inflow: item.inflow,
        outflow: item.outflow,
        net,
        balance: running
      };
    });
  }, [transactions, selectedMonth]);

  // Overall totals for current view
  const currentChartData = period === 'weekly' ? weeklyData : period === 'monthly' ? monthlyData : dailyData;

  const totalInflow = useMemo(() => {
    return currentChartData.reduce((acc, cur) => acc + cur.inflow, 0);
  }, [currentChartData]);

  const totalOutflow = useMemo(() => {
    return currentChartData.reduce((acc, cur) => acc + cur.outflow, 0);
  }, [currentChartData]);

  const netCashFlow = totalInflow - totalOutflow;
  const currentEndingCash = currentChartData.length > 0 ? currentChartData[currentChartData.length - 1].balance : 0;

  // Monthly burn rate & runway estimate
  const avgMonthlyOutflow = totalOutflow > 0 ? totalOutflow : 120000;
  const runwayMonths = (currentEndingCash / avgMonthlyOutflow).toFixed(1);

  return (
    <div className="flex flex-col gap-6">
      {/* Header controls & Period Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isTh ? 'งบกระแสเงินสด (Cash Flow Statement)' : 'Cash Flow Statement & Analytics'}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-primary">
              {isTh ? 'ติดตามสภาพคล่องแบบเรียลไทม์' : 'Real-time Liquidity'}
            </span>
          </div>
          <p className="text-secondary-green dark:text-emerald-400/80 text-sm mt-0.5">
            {isTh 
              ? 'ตรวจสอบการไหลเวียนของเงินสดเข้า-ออก รายสัปดาห์ รายเดือน และรายวันอย่างละเอียด'
              : 'Detailed tracking of business cash inflow, outflow, net position, and cash runway.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period Selector */}
          <div className="flex p-1 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm">
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                period === 'weekly'
                  ? 'bg-primary text-primary-content shadow-sm'
                  : 'text-secondary-green dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isTh ? 'รายสัปดาห์ (Weekly)' : 'Weekly'}
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                period === 'monthly'
                  ? 'bg-primary text-primary-content shadow-sm'
                  : 'text-secondary-green dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isTh ? 'รายเดือน (Monthly)' : 'Monthly'}
            </button>
            <button
              onClick={() => setPeriod('daily')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                period === 'daily'
                  ? 'bg-primary text-primary-content shadow-sm'
                  : 'text-secondary-green dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isTh ? 'รายวัน (Daily)' : 'Daily'}
            </button>
          </div>

          {/* Month selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-10 px-3 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:ring-primary focus:border-primary shadow-sm"
          >
            <option value="2026-10">{isTh ? 'ตุลาคม 2026 (ต.ค.)' : 'October 2026'}</option>
            <option value="2026-09">{isTh ? 'กันยายน 2026 (ก.ย.)' : 'September 2026'}</option>
            <option value="2026-08">{isTh ? 'สิงหาคม 2026 (ส.ค.)' : 'August 2026'}</option>
          </select>

          {/* Export & Add */}
          <button
            onClick={() => exportTransactionsToCSV(transactions)}
            className="h-10 px-3 flex items-center gap-1.5 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl text-xs font-bold text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm"
            title="Download CSV"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span className="hidden sm:inline">{isTh ? 'ส่งออก CSV' : 'Export CSV'}</span>
          </button>

          <button
            onClick={() => onOpenNewEntry('income')}
            className="h-10 px-4 flex items-center gap-1.5 bg-primary text-primary-content hover:bg-primary-hover rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition-all"
          >
            <span className="material-symbols-outlined text-base font-bold">add</span>
            <span>{isTh ? 'บันทึกกระแสเงินสด' : 'New Inflow/Outflow'}</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-green dark:text-gray-400">
              {isTh ? 'กระแสเงินสดรับรวม (Total Inflow)' : 'Total Inflow'}
            </span>
            <div className="size-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-base">south_east</span>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black font-mono tracking-tight text-emerald-600 dark:text-primary tabular-nums">
              {formatCurrency(totalInflow, currency)}
            </p>
            <p className="text-xs text-secondary-green dark:text-emerald-400/80 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              <span>{isTh ? 'รายรับจริงตามรอบเวลา' : 'Recorded revenue stream'}</span>
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-green dark:text-gray-400">
              {isTh ? 'กระแสเงินสดจ่ายรวม (Total Outflow)' : 'Total Outflow'}
            </span>
            <div className="size-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">north_east</span>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black font-mono tracking-tight text-rose-600 dark:text-rose-400 tabular-nums">
              {formatCurrency(totalOutflow, currency)}
            </p>
            <p className="text-xs text-secondary-green dark:text-gray-400 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">receipt_long</span>
              <span>{isTh ? 'รวมค่าวัตถุดิบ เงินเดือน และค่าใช้จ่าย' : 'COGS, salaries, fixed costs'}</span>
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-green dark:text-gray-400">
              {isTh ? 'กระแสเงินสดสุทธิ (Net Cash Flow)' : 'Net Cash Position'}
            </span>
            <div className={`size-8 rounded-lg flex items-center justify-center ${netCashFlow >= 0 ? 'bg-primary/20 text-emerald-700 dark:text-primary' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
              <span className="material-symbols-outlined text-base">
                {netCashFlow >= 0 ? 'account_balance_wallet' : 'warning'}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <p className={`text-2xl font-black font-mono tracking-tight tabular-nums ${netCashFlow >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
              {netCashFlow >= 0 ? '+' : ''}{formatCurrency(netCashFlow, currency)}
            </p>
            <p className="text-xs text-secondary-green dark:text-gray-400 mt-1">
              {netCashFlow >= 0 ? (isTh ? 'กระแสเงินสดเป็นบวก มีสภาพคล่องดี' : 'Positive operational surplus') : (isTh ? 'เงินสดติดลบ ควรเร่งเรียกเก็บเงิน' : 'Deficit position')}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-green dark:text-gray-400">
              {isTh ? 'ระยะเวลารองรับสภาพคล่อง (Runway)' : 'Estimated Cash Runway'}
            </span>
            <div className="size-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">hourglass_top</span>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black font-mono tracking-tight text-blue-600 dark:text-blue-400 tabular-nums">
              {runwayMonths} {isTh ? 'เดือน' : 'Months'}
            </p>
            <p className="text-xs text-secondary-green dark:text-gray-400 mt-1">
              {isTh ? `เงินคงเหลือ ${formatCurrency(currentEndingCash, currency)}` : `Ending liquidity: ${formatCurrency(currentEndingCash, currency)}`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                {period === 'weekly' 
                  ? (isTh ? 'กราฟกระแสเงินสดรับ-จ่าย รายสัปดาห์ (Weekly Inflow / Outflow & Net)' : 'Weekly Cash Flow Trajectory') 
                  : period === 'monthly'
                  ? (isTh ? 'แนวโน้มกระแสเงินสดรายเดือน (Monthly Liquidity Trends)' : 'Monthly Cash Flow Trends')
                  : (isTh ? 'กระแสเงินสดรายวัน (Daily Cash Movements)' : 'Daily Cash Flow')}
              </h4>
              <p className="text-xs text-secondary-green dark:text-gray-400">
                {isTh ? 'เปรียบเทียบเงินสดรับ (สีเขียว), เงินสดจ่าย (สีแดง) และยอดเงินคงเหลือสะสม (เส้นสีน้ำเงิน)' : 'Inflow (green bar), Outflow (red bar), and Running Balance (blue line)'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-primary">
                <span className="size-2 rounded-full bg-emerald-500"></span> {isTh ? 'เงินสดรับ' : 'Inflow'}
              </span>
              <span className="inline-flex items-center gap-1.5 text-rose-500">
                <span className="size-2 rounded-full bg-rose-500"></span> {isTh ? 'เงินสดจ่าย' : 'Outflow'}
              </span>
              <span className="inline-flex items-center gap-1.5 text-blue-500">
                <span className="size-2 rounded-full bg-blue-500"></span> {isTh ? 'ยอดคงเหลือ' : 'Balance'}
              </span>
            </div>
          </div>

          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={currentChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="cfInflowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#13ec37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#13ec37" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                <XAxis 
                  dataKey="name" 
                  stroke="#888" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#888" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => currency === 'THB' ? `${(val / 1000).toFixed(0)}k` : `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any, name: string) => {
                    const formatted = formatCurrency(Number(val), currency);
                    if (name === 'inflow') return [formatted, isTh ? 'เงินสดรับ (Inflow)' : 'Inflow'];
                    if (name === 'outflow') return [formatted, isTh ? 'เงินสดจ่าย (Outflow)' : 'Outflow'];
                    if (name === 'balance') return [formatted, isTh ? 'เงินสดคงเหลือสะสม' : 'Running Balance'];
                    return [formatted, name];
                  }}
                  contentStyle={{
                    backgroundColor: '#182c1b',
                    borderColor: '#2a422e',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="inflow" fill="#13ec37" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="outflow" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={24} />
                <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right breakdown side-panel */}
        <div className="flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              {isTh ? 'สัดส่วนกระแสเงินสดตามหมวดหมู่' : 'Category Breakdown'}
            </h4>
            <div className="space-y-3">
              <CategoryBar label={isTh ? 'ขายสินค้า/บริการ' : 'Sales & Services'} amount={377000} total={totalInflow || 377000} color="bg-emerald-500" currency={currency} />
              <CategoryBar label={isTh ? 'เงินเดือน/ค่าจ้าง' : 'Payroll'} amount={120000} total={totalOutflow || 240000} color="bg-rose-500" currency={currency} />
              <CategoryBar label={isTh ? 'วัตถุดิบ & สินค้า' : 'Raw Materials'} amount={76500} total={totalOutflow || 240000} color="bg-orange-500" currency={currency} />
              <CategoryBar label={isTh ? 'ค่าเช่า & สำนักงาน' : 'Rent & Office'} amount={35000} total={totalOutflow || 240000} color="bg-amber-500" currency={currency} />
              <CategoryBar label={isTh ? 'ซอฟต์แวร์ & คลาวด์' : 'Cloud & Software'} amount={21700} total={totalOutflow || 240000} color="bg-purple-500" currency={currency} />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-primary font-bold text-sm">
              <span className="material-symbols-outlined text-xl">insights</span>
              <span>{isTh ? 'คำแนะนำด้านสภาพคล่อง' : 'Cash Flow Advisory'}</span>
            </div>
            <p className="text-xs text-secondary-green dark:text-emerald-400 leading-relaxed">
              {isTh 
                ? 'สัปดาห์ที่ 4 มีกำหนดจ่ายรอบเงินเดือน ฿120,000 ทำให้กระแสเงินสดสุทธิติดลบชั่วคราว แนะนำให้ติดตามใบแจ้งหนี้คงค้าง ฿78,000 เพื่อรักษาสภาพคล่องส่วนเกินไว้'
                : 'Week 4 payroll of $120,000 creates a temporary cash outflow dip. Collect pending invoices ($78,000) to maintain buffer.'}
            </p>
          </div>
        </div>
      </div>

      {/* Cash Flow Statement Detailed Breakdown Table */}
      <div className="rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border-light dark:border-border-dark flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-white/5">
          <div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              {isTh ? `ตารางแจกแจงกระแสเงินสด ${period === 'weekly' ? 'รายสัปดาห์' : period === 'monthly' ? 'รายเดือน' : 'รายวัน'}` : 'Cash Flow Breakdown Ledger'}
            </h4>
            <p className="text-xs text-secondary-green dark:text-gray-400">
              {isTh ? 'รายละเอียดตัวเลขเงินสดรับ-จ่ายและยอดคงเหลือในแต่ละช่วงเวลา' : 'Tabular breakdown of period inflows, outflows, and resulting balances.'}
            </p>
          </div>
          <button
            onClick={() => onOpenNewEntry()}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-primary text-primary-content hover:bg-primary-hover transition-colors"
          >
            + {isTh ? 'เพิ่มรายการ' : 'Add Entry'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark text-xs uppercase tracking-wider text-secondary-green dark:text-gray-400">
                <th className="px-6 py-3.5 font-bold">{isTh ? 'ช่วงเวลา / รอบสัปดาห์' : 'Period / Week'}</th>
                <th className="px-6 py-3.5 font-bold text-right">{isTh ? 'กระแสเงินสดรับ (Inflow)' : 'Inflow'}</th>
                <th className="px-6 py-3.5 font-bold text-right">{isTh ? 'กระแสเงินสดจ่าย (Outflow)' : 'Outflow'}</th>
                <th className="px-6 py-3.5 font-bold text-right">{isTh ? 'กระแสเงินสดสุทธิ (Net)' : 'Net Change'}</th>
                <th className="px-6 py-3.5 font-bold text-right">{isTh ? 'เงินสดคงเหลือสะสม' : 'Ending Balance'}</th>
                <th className="px-6 py-3.5 font-bold text-center">{isTh ? 'สถานะสภาพคล่อง' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:border-border-dark font-mono">
              {currentChartData.map((row: any, idx: number) => {
                const isPositive = row.net >= 0;
                return (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-sans font-semibold text-slate-900 dark:text-white">
                      {row.name} {row.label ? <span className="text-xs font-normal text-secondary-green">({row.label})</span> : ''}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-emerald-600 dark:text-primary tabular-nums">
                      +{formatCurrency(row.inflow, currency)}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                      -{formatCurrency(row.outflow, currency)}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold tabular-nums ${isPositive ? 'text-emerald-600 dark:text-primary' : 'text-rose-600 dark:text-rose-400'}`}>
                      {isPositive ? '+' : ''}{formatCurrency(row.net, currency)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatCurrency(row.balance, currency)}
                    </td>
                    <td className="px-6 py-4 text-center font-sans">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-primary' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'}`}>
                        {isPositive ? (isTh ? 'ปกติ (Healthy)' : 'Surplus') : (isTh ? 'ติดลบ (Deficit)' : 'Deficit')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CategoryBar: React.FC<{
  label: string;
  amount: number;
  total: number;
  color: string;
  currency: CurrencyType;
}> = ({ label, amount, total, color, currency }) => {
  const pct = Math.min(100, Math.max(5, Math.round((amount / (total || 1)) * 100)));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-semibold text-slate-700 dark:text-gray-300">{label}</span>
        <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(amount, currency)}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-black/30 overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
};

export default CashFlowView;
