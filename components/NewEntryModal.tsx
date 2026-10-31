import React, { useState } from 'react';
import { Transaction, TransactionType, TransactionStatus, CurrencyType, LanguageType } from '../types';
import { CATEGORIES } from '../utils/financeData';

interface NewEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  initialType?: TransactionType;
  currency: CurrencyType;
  lang: LanguageType;
}

const NewEntryModal: React.FC<NewEntryModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
  initialType = 'income',
  currency,
  lang
}) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('ขายสินค้า/บริการ');
  const [status, setStatus] = useState<TransactionStatus>('cleared');
  const [paymentMethod, setPaymentMethod] = useState<string>('โอนผ่านธนาคาร (Bank Transfer)');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!description.trim() || isNaN(numAmount) || numAmount <= 0) {
      alert(lang === 'th' ? 'กรุณากรอกรายละเอียดและจำนวนเงินที่ถูกต้อง' : 'Please provide valid description and amount');
      return;
    }

    onAddTransaction({
      date,
      description: description.trim(),
      category,
      amount: numAmount,
      type,
      status,
      paymentMethod,
      notes: notes.trim() || undefined
    });

    // Reset and close
    setDescription('');
    setAmount('');
    setNotes('');
    onClose();
  };

  const isTh = lang === 'th';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light dark:border-border-dark bg-slate-50/70 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className={`size-10 rounded-xl flex items-center justify-center ${type === 'income' ? 'bg-primary/20 text-emerald-600 dark:text-primary' : 'bg-red-500/20 text-red-600 dark:text-red-400'}`}>
              <span className="material-symbols-outlined font-bold text-2xl">
                {type === 'income' ? 'arrow_downward' : 'arrow_upward'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isTh ? (type === 'income' ? 'บันทึกกระแสเงินสดรับ (Income)' : 'บันทึกกระแสเงินสดจ่าย (Expense)') : (type === 'income' ? 'Record Cash Inflow' : 'Record Cash Outflow')}
              </h3>
              <p className="text-xs text-secondary-green dark:text-emerald-400/80">
                {isTh ? 'เพิ่มรายการเข้าสู่ระบบบัญชีและคำนวณ Cash Flow ทันที' : 'Add to general ledger & sync cash flow immediately'}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Switcher */}
          <div>
            <label className="block text-xs font-bold text-secondary-green dark:text-gray-300 uppercase tracking-wider mb-2">
              {isTh ? 'ประเภทรายการ' : 'Transaction Type'}
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-black/30 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setType('income');
                  setCategory('ขายสินค้า/บริการ');
                }}
                className={`py-2 px-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  type === 'income'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                <span>{isTh ? 'รายรับ (Inflow)' : 'Cash Inflow'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('expense');
                  setCategory('วัตถุดิบ/ต้นทุนขาย');
                }}
                className={`py-2 px-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  type === 'expense'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">remove_circle</span>
                <span>{isTh ? 'รายจ่าย (Outflow)' : 'Cash Outflow'}</span>
              </button>
            </div>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-secondary-green dark:text-gray-300 uppercase tracking-wider mb-1">
                {isTh ? `จำนวนเงิน (${currency === 'THB' ? 'บาท ฿' : 'USD $'})` : `Amount (${currency})`} *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">
                  {currency === 'THB' ? '฿' : '$'}
                </span>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-mono text-base font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-secondary-green dark:text-gray-300 uppercase tracking-wider mb-1">
                {isTh ? 'วันที่บันทึก' : 'Transaction Date'} *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-secondary-green dark:text-gray-300 uppercase tracking-wider mb-1">
              {isTh ? 'คำอธิบายรายการ / ชื่อลูกค้า / ผู้รับเงิน' : 'Description / Payee'} *
            </label>
            <input
              type="text"
              required
              placeholder={isTh ? 'เช่น รับชำระค่าโปรเจกต์งวด 1, ค่าวัตถุดิบล็อต 4' : 'e.g. Client Payment #102, Bulk Material Order'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-secondary-green dark:text-gray-300 uppercase tracking-wider mb-1">
                {isTh ? 'หมวดหมู่บัญชี' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                {CATEGORIES.filter(c => c.type === type).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {isTh ? cat.nameTh : cat.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-secondary-green dark:text-gray-300 uppercase tracking-wider mb-1">
                {isTh ? 'สถานะการรับ/จ่าย' : 'Status'}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                className="w-full px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="cleared">{isTh ? 'เคลียร์แล้ว / เงินเข้า-ออกแล้ว' : 'Cleared / Completed'}</option>
                <option value="pending">{isTh ? 'รอดำเนินการ / ยังไม่ถึงกำหนด' : 'Pending / Scheduled'}</option>
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-secondary-green dark:text-gray-300 uppercase tracking-wider mb-1">
              {isTh ? 'ช่องทางการชำระ' : 'Payment Method'}
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="โอนผ่านธนาคาร (Bank Transfer)">{isTh ? 'โอนผ่านธนาคาร (Bank Transfer)' : 'Bank Transfer'}</option>
              <option value="เงินสด (Cash)">{isTh ? 'เงินสด (Cash)' : 'Cash'}</option>
              <option value="บัตรเครดิต (Credit Card)">{isTh ? 'บัตรเครดิต (Credit Card)' : 'Credit Card'}</option>
              <option value="เช็คสั่งจ่าย (Cheque)">{isTh ? 'เช็คสั่งจ่าย (Cheque)' : 'Cheque'}</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-light dark:border-border-dark">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              {isTh ? 'ยกเลิก' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-content hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">check</span>
              <span>{isTh ? 'บันทึกรายการ' : 'Save Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEntryModal;
