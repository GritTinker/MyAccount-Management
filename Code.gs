
/**
 * FinanceOS Accounting System - Backend
 * พัฒนาสำหรับใช้งานบน Google Apps Script Web App
 */

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('FinanceOS Accounting System')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ฟังก์ชันสำหรับดึงข้อมูลสรุปจาก Sheet
function getDashboardData() {
  // ในการใช้งานจริง จะต้องดึงข้อมูลจาก SpreadsheetApp.getActiveSpreadsheet()
  // นี่คือ Mock Data สำหรับแสดงผลโครงสร้าง
  return {
    cashBalance: 42500,
    netProfitYTD: 12400,
    totalExpenses: 8200,
    valuation: 150000,
    chartData: [
      { name: 'Jan', income: 4000, expense: 2400 },
      { name: 'Feb', income: 3000, expense: 1398 },
      { name: 'Mar', income: 2000, expense: 9800 },
      { name: 'Apr', income: 2780, expense: 3908 },
      { name: 'May', income: 1890, expense: 4800 },
      { name: 'Jun', income: 2390, expense: 3800 },
    ]
  };
}

// ฟังก์ชันดึงรายการวัตถุดิบ
function getMaterialsData() {
  return [
    { id: '1', name: 'High-Grade Steel', quantity: 450, unit: 'kg', costPerUnit: 12.5, expiryDate: '2025-12-31', status: 'good' },
    { id: '2', name: 'Copper Wiring', quantity: 20, unit: 'rolls', costPerUnit: 85, expiryDate: '2024-05-15', status: 'low-stock' },
    { id: '3', name: 'Industrial Adhesive', quantity: 5, unit: 'liters', costPerUnit: 45, expiryDate: '2023-11-01', status: 'expiring' },
    { id: '4', name: 'Polymer Sheets', quantity: 15, unit: 'sheets', costPerUnit: 22, expiryDate: '2023-10-10', status: 'damaged' },
  ];
}

// ฟังก์ชันสำหรับบันทึกรายการใหม่ (ตัวอย่าง)
function addTransaction(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Transactions') || ss.insertSheet('Transactions');
    
    // ตั้งค่า Header ถ้ายังไม่มี
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['ID', 'Date', 'Description', 'Category', 'Amount', 'Type', 'Status']);
    }
    
    sheet.appendRow([
      Utilities.getUuid(),
      new Date(),
      data.description,
      data.category,
      data.amount,
      data.type,
      'cleared'
    ]);
    
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}
