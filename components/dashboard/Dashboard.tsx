'use client';

import React from 'react';
import { LayoutDashboard, Calculator, Quote, BrainCircuit, ClipboardList } from 'lucide-react';

interface DashboardProps {
  onLaunch: (program: 'calculator' | 'goals') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLaunch }) => {
  return (
    <div className="container mx-auto max-w-6xl py-10">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Green Mainland <span className="text-blue-600">Enterprise</span>
        </h1>
        <p className="text-lg text-gray-600">Select a specialized program to begin your workflow</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 px-4">
        {/* Company Goals Card */}
        <div 
          onClick={() => onLaunch('goals')}
          className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-green-500 flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
            <LayoutDashboard size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Company Goals</h3>
          <p className="text-gray-500 leading-relaxed">Track sales and marketing performance, log achievements, and view historical progress.</p>
          <div className="mt-6 flex items-center text-green-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            View Goals <span className="ml-1">→</span>
          </div>
        </div>

        {/* Calculator Card */}
        <div 
          onClick={() => onLaunch('calculator')}
          className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-500 flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <Calculator size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Cost Estimate Calculator</h3>
          <p className="text-gray-500 leading-relaxed">Luxury windows and doors pricing, complex discount management, and professional PDF generation.</p>
          <div className="mt-6 flex items-center text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            Launch Program <span className="ml-1">→</span>
          </div>
        </div>

        {/* Planned Cards */}
        <div className="group bg-gray-50 p-8 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center text-center relative overflow-hidden grayscale opacity-60">
          <div className="absolute top-4 right-4 bg-gray-200 text-gray-600 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-widest">Planned</div>
          <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mb-6">
            <Quote size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-400 mb-3">Quote Generator</h3>
          <p className="text-gray-400 italic">Advanced project quoting system with integrated customer CRM and timeline management.</p>
        </div>

        <div className="group bg-gray-50 p-8 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center text-center relative overflow-hidden grayscale opacity-60">
          <div className="absolute top-4 right-4 bg-gray-200 text-gray-600 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-widest">Planned</div>
          <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mb-6">
            <BrainCircuit size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-400 mb-3">AI Trainer</h3>
          <p className="text-gray-400 italic">Machine learning optimization tools for predictive sales modeling and automated material sourcing.</p>
        </div>

        {/* External Link Card */}
        <a 
          href="https://gm-order-tracking-sevenseasbranding-sevenseasbrandings-projects.vercel.app" 
          target="_blank" 
          className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-purple-500 flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
            <ClipboardList size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Order Management</h3>
          <p className="text-gray-500 leading-relaxed">Track order status, delivery timelines, and logistics updates in real-time.</p>
          <div className="mt-6 flex items-center text-purple-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            Open Dashboard <span className="ml-1">↗</span>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Dashboard;

