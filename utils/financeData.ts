import { Transaction, RawMaterial } from '../types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    date: '2026-10-30',
    description: 'รับชำระค่าบริการพัฒนาระบบ ERP งวดที่ 2 (Client Payment #1024)',
    category: 'ขายสินค้า/บริการ',
    amount: 145000,
    type: 'income',
    status: 'cleared',
    paymentMethod: 'โอนผ่านธนาคาร (Bank Transfer)'
  },
  {
    id: 'tx-002',
    date: '2026-10-28',
    description: 'จัดซื้อวัตถุดิบเหล็กโครงสร้าง High-Grade Steel (Bulk Order)',
    category: 'วัตถุดิบ/ต้นทุนขาย',
    amount: 48500,
    type: 'expense',
    status: 'cleared',
    paymentMethod: 'โอนผ่านธนาคาร (Bank Transfer)'
  },
  {
    id: 'tx-003',
    date: '2026-10-27',
    description: 'ค่าบริการคลาวด์และเซิร์ฟเวอร์ AWS & Google Cloud (Cloud Infrastructure)',
    category: 'สาธารณูปโภค/ซอฟต์แวร์',
    amount: 12800,
    type: 'expense',
    status: 'cleared',
    paymentMethod: 'บัตรเครดิต (Credit Card)'
  },
  {
    id: 'tx-004',
    date: '2026-10-25',
    description: 'เงินเดือนทีมงานและค่าจ้างประจำเดือน ตุลาคม (Monthly Payroll)',
    category: 'เงินเดือน/ค่าจ้าง',
    amount: 120000,
    type: 'expense',
    status: 'cleared',
    paymentMethod: 'โอนผ่านธนาคาร (Bank Transfer)'
  },
  {
    id: 'tx-005',
    date: '2026-10-23',
    description: 'รายได้จากการให้คำปรึกษาทางธุรกิจและวางระบบบัญชี (Advisory Retainer)',
    category: 'ขายสินค้า/บริการ',
    amount: 65000,
    type: 'income',
    status: 'cleared',
    paymentMethod: 'โอนผ่านธนาคาร (Bank Transfer)'
  },
  {
    id: 'tx-006',
    date: '2026-10-20',
    description: 'ค่าเช่าพื้นที่สำนักงานและ Co-working Space (Office Rent)',
    category: 'ค่าเช่า/สถานที่',
    amount: 35000,
    type: 'expense',
    status: 'cleared',
    paymentMethod: 'โอนผ่านธนาคาร (Bank Transfer)'
  },
  {
    id: 'tx-007',
    date: '2026-10-18',
    description: 'รับชำระค่าสินค้าล็อตพิเศษสำหรับส่งออก (Export Order Batch #88)',
    category: 'ขายสินค้า/บริการ',
    amount: 182000,
    type: 'income',
    status: 'cleared',
    paymentMethod: 'โอนผ่านธนาคาร (Bank Transfer)'
  },
  {
    id: 'tx-008',
    date: '2026-10-15',
    description: 'จัดซื้อสายไฟทองแดง Copper Wiring ล็อตใหม่',
    category: 'วัตถุดิบ/ต้นทุนขาย',
    amount: 28000,
    type: 'expense',
    status: 'cleared',
    paymentMethod: 'โอนผ่านธนาคาร (Bank Transfer)'
  },
  {
    id: 'tx-009',
    date: '2026-10-12',
    description: 'ค่าแคมเปญโฆษณาออนไลน์และการตลาดดิจิทัล (Online Ads Marketing)',
    category: 'การตลาด',
    amount: 15400,
    type: 'expense',
    status: 'cleared',
    paymentMethod: 'บัตรเครดิต (Credit Card)'
  },
  {
    id: 'tx-010',
    date: '2026-10-10',
    description: 'รายรับค่าลิขสิทธิ์ซอฟต์แวร์แบบ Subscription ประจำสัปดาห์',
    category: 'ขายสินค้า/บริการ',
    amount: 52000,
    type: 'income',
    status: 'cleared',
    paymentMethod: 'โอนผ่านธนาคาร (Bank Transfer)'
  },
  {
    id: 'tx-011',
    date: '2026-10-06',
    description: 'ค่าน้ำประปา ค่าไฟฟ้า และอินเทอร์เน็ตความเร็วสูง (Utilities)',
    category: 'สาธารณูปโภค/ซอฟต์แวร์',
    amount: 8900,
    type: 'expense',
    status: 'cleared',
    paymentMethod: 'โอนผ่านธนาคาร (Bank Transfer)'
  },
  {
    id: 'tx-012',
    date: '2026-10-03',
    description: 'รับเงินค่ามัดจำโครงการใหม่ ลูกค้าฝ่ายผลิต (Project Deposit #103)',
    category: 'ขายสินค้า/บริการ',
    amount: 90000,
    type: 'income',
    status: 'cleared',
    paymentMethod: 'โอนผ่านธนาคาร (Bank Transfer)'
  },
  {
    id: 'tx-013',
    date: '2026-10-31',
    description: 'ใบแจ้งหนี้รอเก็บเงิน ลูกค้า บจก.ไทยสมาร์ท (Invoice Pending)',
    category: 'ขายสินค้า/บริการ',
    amount: 78000,
    type: 'income',
    status: 'pending',
    paymentMethod: 'โอนผ่านธนาคาร (Bank Transfer)'
  },
  {
    id: 'tx-014',
    date: '2026-10-31',
    description: 'เตรียมชำระค่าบำรุงรักษาเครื่องจักรโรงงาน (Scheduled Maintenance)',
    category: 'วัตถุดิบ/ต้นทุนขาย',
    amount: 18500,
    type: 'expense',
    status: 'pending',
    paymentMethod: 'โอนผ่านธนาคาร (Bank Transfer)'
  }
];

export const INITIAL_MATERIALS: RawMaterial[] = [
  {
    id: 'mat-001',
    name: 'เหล็กกล้าเกรดพรีเมียม (High-Grade Steel 304)',
    quantity: 650,
    unit: 'kg',
    costPerUnit: 145,
    minThreshold: 300,
    expiryDate: '2027-12-31',
    status: 'good',
    category: 'โลหะ/โครงสร้าง'
  },
  {
    id: 'mat-002',
    name: 'ม้วนลวดทองแดงบริสุทธิ์ (Copper Wiring Rolls)',
    quantity: 18,
    unit: 'ม้วน (rolls)',
    costPerUnit: 2400,
    minThreshold: 30,
    expiryDate: '2026-12-15',
    status: 'low-stock',
    category: 'อุปกรณ์ไฟฟ้า'
  },
  {
    id: 'mat-003',
    name: 'กาวอุตสาหกรรมทนความร้อนสูง (Industrial Adhesive)',
    quantity: 12,
    unit: 'ลิตร (liters)',
    costPerUnit: 850,
    minThreshold: 10,
    expiryDate: '2026-11-10',
    status: 'expiring',
    category: 'เคมีภัณฑ์'
  },
  {
    id: 'mat-004',
    name: 'แผ่นโพลีเมอร์ทนแรงกระแทก (Polymer Sheets 5mm)',
    quantity: 45,
    unit: 'แผ่น (sheets)',
    costPerUnit: 620,
    minThreshold: 20,
    expiryDate: '2027-06-30',
    status: 'good',
    category: 'พลาสติก/วิศวกรรม'
  },
  {
    id: 'mat-005',
    name: 'แผ่นซีลยางสังเคราะห์ชำรุดรอจำหน่าย (Damaged Rubber Seals)',
    quantity: 25,
    unit: 'ชิ้น (pcs)',
    costPerUnit: 150,
    minThreshold: 15,
    expiryDate: '2026-10-01',
    status: 'damaged',
    category: 'ชิ้นส่วนประกอบ'
  }
];

export const CATEGORIES = [
  { id: 'ขายสินค้า/บริการ', nameTh: 'ขายสินค้า / บริการ', nameEn: 'Sales & Services', type: 'income' },
  { id: 'รายได้ดอกเบี้ย/ลงทุน', nameTh: 'รายได้ดอกเบี้ย / การลงทุน', nameEn: 'Investments & Interest', type: 'income' },
  { id: 'วัตถุดิบ/ต้นทุนขาย', nameTh: 'วัตถุดิบ / ต้นทุนขาย (COGS)', nameEn: 'Raw Materials & COGS', type: 'expense' },
  { id: 'เงินเดือน/ค่าจ้าง', nameTh: 'เงินเดือน / ค่าจ้าง (Payroll)', nameEn: 'Salaries & Payroll', type: 'expense' },
  { id: 'ค่าเช่า/สถานที่', nameTh: 'ค่าเช่า / สถานที่ (Rent)', nameEn: 'Rent & Facility', type: 'expense' },
  { id: 'สาธารณูปโภค/ซอฟต์แวร์', nameTh: 'ค่าน้ำ-ไฟ / เซิร์ฟเวอร์ / ซอฟต์แวร์', nameEn: 'Utilities & Software', type: 'expense' },
  { id: 'การตลาด', nameTh: 'การตลาด & โฆษณา', nameEn: 'Marketing & Ads', type: 'expense' },
  { id: 'อื่นๆ', nameTh: 'อื่นๆ (Other)', nameEn: 'Other Expense', type: 'expense' },
];

export const formatCurrency = (val: number, currency: 'THB' | 'USD' = 'THB'): string => {
  if (currency === 'THB') {
    return `฿${val.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  // USD conversion roughly 1 USD = 35 THB
  const inUSD = val / 35;
  return `$${inUSD.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const exportTransactionsToCSV = (transactions: Transaction[]) => {
  const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount (THB)', 'Status', 'Payment Method'];
  const rows = transactions.map(t => [
    t.id,
    t.date,
    `"${t.description.replace(/"/g, '""')}"`,
    `"${t.category}"`,
    t.type,
    t.amount,
    t.status,
    `"${t.paymentMethod || ''}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `cashflow_transactions_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
