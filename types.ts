export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'cleared' | 'pending';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  paymentMethod?: string;
  notes?: string;
}

export interface RawMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  minThreshold: number;
  expiryDate: string;
  status: 'good' | 'expiring' | 'expired' | 'damaged' | 'low-stock';
  category?: string;
}

export interface BusinessMetrics {
  cashBalance: number;
  netProfitYTD: number;
  totalExpenses: number;
  currentValuation: number;
  inflowTotal: number;
  outflowTotal: number;
}

export enum ViewMode {
  Dashboard = 'dashboard',
  CashFlow = 'cashflow',
  Transactions = 'transactions',
  Calculations = 'calculations',
  Materials = 'materials'
}

export type CashFlowPeriod = 'weekly' | 'monthly' | 'daily';

export type CurrencyType = 'THB' | 'USD';
export type LanguageType = 'th' | 'en';
