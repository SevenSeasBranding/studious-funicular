'use client';

import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import CalculatorContainer from '@/components/calculator/CalculatorContainer';
import GoalsContainer from '@/components/goals/GoalsContainer';
import { GlobalSettings } from '@/lib/types';
import { INITIAL_MATERIALS, INITIAL_PRODUCT_TYPES } from '@/lib/constants';

// Initial fallback settings
const INITIAL_SETTINGS: GlobalSettings = {
  companyName: 'Green Mainland Luxury Windows and Doors',
  documentTitle: 'Cost Estimate',
  disclaimerText: 'This estimate does not include installation and is not an official quote.',
  roundingOption: 'none',
  invertText: false,
  bgImageBase64: null,
  bgImageOpacity: 0.1,
  enableConversion: false,
  conversionTargetUnit: 'mm',
  agents: ['James Rivers', 'Dmitriy Klyuchits', 'Alexander Hanza', 'Veronica Hanza'],
  materials: INITIAL_MATERIALS,
  productTypes: INITIAL_PRODUCT_TYPES,
  options: {
    colors: ['Solid', 'Custom'],
    glassTypes: [
      { name: 'Dual pane', description: 'tempered glass, double glazed, and Argon gas filling' },
      { name: 'Triple pane', description: 'tempered glass, double glazed, and Argon gas filling' }
    ],
    glassTextures: ['Custom'],
    glassTints: ['Bronze', 'Gray', 'Green', 'Blue', 'Mirror', 'Super Gray', 'Frosted'],
    yesNo: { yes: 'Yes', no: 'No' }
  },
  pricingFormulas: {
    bifoldDoor: {
      formulaText: "SQM = (H*W)/10.7; OTC = (SQM*240)+(SQM*37)+(SQM*190); FO = OTC*2*1.3; If W>16, FO*=1.1; If H>10, FO*=1.1, FO+=(SQM*190); SmartLock: $1100; Hurricane: OTC*1.4*2*1.3",
      maxWidth: 30, maxHeight: 11.8, panelDivisor: 3,
      rate1: 240, rate2: 37, rate3: 190, multiplier1: 2, multiplier2: 1.3, smartLockCost: 1100,
      basePriceAmount: 10000, decreaseInterval: 2000, decreaseMultiplier: 125, increaseInterval: 10000, increaseMultiplier: 110,
      materialMaxSizes: {}
    },
  },
  additionalCosts: {
    smartLockBaseCost: 1100,
    retractableScreenBaseRate: 12,
    glassTextureAddonCost: 150
  },
  displayAddonCosts: {
    triplePane: true,
    color: true,
    glassTint: true,
    smartLock: true,
    retractableScreen: true,
    glassTexture: true
  }
};

export default function Home() {
  const [view, setView] = useState<'dashboard' | 'calculator' | 'goals'>('dashboard');
  const [settings, setSettings] = useState<GlobalSettings>(INITIAL_SETTINGS);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        if (data && !data.error) {
          // Merge with initial settings to ensure all fields exist
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    }
    fetchSettings();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      {view === 'dashboard' && (
        <Dashboard onLaunch={(program) => setView(program)} />
      )}
      
      {view === 'calculator' && (
        <CalculatorContainer 
          settings={settings} 
          onBack={() => setView('dashboard')} 
        />
      )}
      
      {view === 'goals' && (
        <GoalsContainer onBack={() => setView('dashboard')} />
      )}
    </main>
  );
}
