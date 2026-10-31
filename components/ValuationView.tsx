
import React, { useState } from 'react';

const ValuationView: React.FC = () => {
  // Break-even inputs
  const [fixedCosts, setFixedCosts] = useState(5000);
  const [unitPrice, setUnitPrice] = useState(100);
  const [variableCost, setVariableCost] = useState(40);
  
  // Valuation inputs
  const [annualProfit, setAnnualProfit] = useState(120000);
  const [growthRate, setGrowthRate] = useState(15);
  const [multiple, setMultiple] = useState(4.5);

  const breakEvenUnits = Math.ceil(fixedCosts / (unitPrice - variableCost));
  const valuation = annualProfit * multiple;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Break-even section */}
        <div className="rounded-xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary text-3xl">calculate</span>
            <h3 className="text-xl font-bold">Break-even Analysis</h3>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-secondary-green uppercase">Total Monthly Fixed Costs ($)</label>
              <input type="number" value={fixedCosts} onChange={(e) => setFixedCosts(Number(e.target.value))} 
                className="bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-lg p-2 focus:ring-primary focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-secondary-green uppercase">Price Per Unit ($)</label>
                <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} 
                  className="bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-lg p-2 focus:ring-primary focus:border-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-secondary-green uppercase">Variable Cost Per Unit ($)</label>
                <input type="number" value={variableCost} onChange={(e) => setVariableCost(Number(e.target.value))} 
                  className="bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-lg p-2 focus:ring-primary focus:border-primary" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-primary/10 border border-primary/20 rounded-xl flex flex-col items-center justify-center text-center">
            <p className="text-sm font-bold text-secondary-green uppercase mb-1">Units to Break-even</p>
            <p className="text-5xl font-black text-primary-content dark:text-primary">{breakEvenUnits}</p>
            <p className="text-xs text-secondary-green mt-2">Required sales volume to cover all costs</p>
          </div>
        </div>

        {/* Valuation Section */}
        <div className="rounded-xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary text-3xl">trending_up</span>
            <h3 className="text-xl font-bold">Business Valuation</h3>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-secondary-green uppercase">Normalized Annual Profit ($)</label>
              <input type="number" value={annualProfit} onChange={(e) => setAnnualProfit(Number(e.target.value))} 
                className="bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-lg p-2 focus:ring-primary focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-secondary-green uppercase">Profit Multiple (SDE/EBITDA)</label>
                <input type="number" step="0.1" value={multiple} onChange={(e) => setMultiple(Number(e.target.value))} 
                  className="bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-lg p-2 focus:ring-primary focus:border-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-secondary-green uppercase">Expected Growth %</label>
                <input type="number" value={growthRate} onChange={(e) => setGrowthRate(Number(e.target.value))} 
                  className="bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-lg p-2 focus:ring-primary focus:border-primary" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-primary/10 border border-primary/20 rounded-xl flex flex-col items-center justify-center text-center">
            <p className="text-sm font-bold text-secondary-green uppercase mb-1">Estimated Business Value</p>
            <p className="text-5xl font-black text-primary-content dark:text-primary">${valuation.toLocaleString()}</p>
            <p className="text-xs text-secondary-green mt-2">Based on current profit multiples</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuationView;
