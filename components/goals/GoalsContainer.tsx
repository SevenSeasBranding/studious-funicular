'use client';

import React, { useState } from 'react';
import { useGoals } from '@/hooks/useGoals';
import { GOAL_CONFIGS } from '@/lib/constants';
import { ArrowLeft, TrendingUp, History, ClipboardList, PlusCircle } from 'lucide-react';

interface GoalsContainerProps {
  onBack: () => void;
}

const GoalsContainer: React.FC<GoalsContainerProps> = ({ onBack }) => {
  const { data, reportIncrease } = useGoals();
  const [activeTab, setActiveTab] = useState<'sales' | 'marketing'>('sales');
  const [showHistory, setShowHistory] = useState(false);

  if (!data.currentMonth) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="pb-20">
      <div className="container mx-auto max-w-6xl mb-6 mt-4">
        <button 
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </button>
      </div>

      <div className="container mx-auto max-w-6xl bg-white shadow-xl rounded-lg p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Goals & Performance</h1>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h2 className="text-xl font-semibold text-blue-600">{data.currentMonth.month}</h2>
              <p className="text-sm text-gray-500 font-medium">Monthly progress tracking</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowHistory(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${!showHistory ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}
              >
                <TrendingUp size={16} />
                Current Goals
              </button>
              <button 
                onClick={() => setShowHistory(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${showHistory ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}
              >
                <History size={16} />
                View History
              </button>
            </div>
          </div>
        </header>

        {!showHistory ? (
          <>
            <nav className="flex justify-center border-b border-gray-200 mb-8">
              <button 
                onClick={() => setActiveTab('sales')}
                className={`px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'sales' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Sales View
              </button>
              <button 
                onClick={() => setActiveTab('marketing')}
                className={`px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'marketing' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Marketing View
              </button>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GOAL_CONFIGS[activeTab].map(config => {
                const currentData = data.currentMonth![activeTab][config.id];
                let count = 0;
                if (Array.isArray(currentData)) {
                  count = config.id === 'totalSales' 
                    ? currentData.reduce((sum: number, s: any) => sum + s.amount, 0)
                    : currentData.length;
                } else {
                  count = currentData;
                }

                const progress = Math.min(100, (count / config.target) * 100);
                
                return (
                  <div key={config.id} className="bg-gray-50 border rounded-2xl p-6 relative group hover:border-blue-500 transition-all shadow-sm hover:shadow-lg">
                    <button 
                      className="absolute top-4 right-4 text-gray-300 hover:text-blue-600 transition-colors"
                      title="Report Increase"
                    >
                      <PlusCircle size={24} />
                    </button>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{config.name}</h4>
                    <div className="text-2xl font-black text-gray-900 mb-4">
                      {config.isCurrency ? `$${count.toLocaleString()}` : count}
                      <span className="text-sm text-gray-400 font-bold ml-2">/ {config.isCurrency ? `$${config.target.toLocaleString()}` : config.target}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-700">Historical Performance</h3>
            {data.history.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">No historical data available yet.</p>
              </div>
            ) : (
              data.history.map(month => (
                <div key={month.month} className="p-4 border rounded-xl bg-gray-50 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-900">{month.month}</p>
                    <p className="text-xs text-gray-500">Summary info...</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    Details
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsContainer;

