import { useState, useEffect, useCallback } from 'react';
import { MonthData, GoalEntry } from '../lib/types';

export const useGoals = () => {
  const [data, setData] = useState<{ currentMonth: MonthData | null; history: MonthData[] }>({
    currentMonth: null,
    history: []
  });

  const createNewMonthData = useCallback((monthName: string) => {
    return {
      month: monthName,
      timestamp: Date.now(),
      sales: {},
      marketing: {}
    } as MonthData;
  }, []);

  const loadData = useCallback(async () => {
    try {
      const response = await fetch('/api/goals');
      const goals = await response.json();
      
      const now = new Date();
      const currentMonthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      const history: Record<string, MonthData> = {};
      const currentMonth = createNewMonthData(currentMonthName);
      
      // Initialize current month with empty arrays/zeros based on config
      // In a real app, we'd fetch this from the database
      // For now, let's just process the entries we got from the API
      
      goals.forEach((goal: any) => {
        goal.entries.forEach((entry: any) => {
          if (!history[entry.month]) {
            history[entry.month] = createNewMonthData(entry.month);
          }
          const category = goal.category as 'sales' | 'marketing';
          if (!history[entry.month][category][goal.id]) {
            history[entry.month][category][goal.id] = [];
          }
          if (Array.isArray(history[entry.month][category][goal.id])) {
            history[entry.month][category][goal.id].push(entry.entryData);
          } else {
            history[entry.month][category][goal.id] = entry.entryData;
          }
        });
      });

      const historyArray = Object.values(history).sort((a, b) => b.timestamp - a.timestamp);
      const currentMonthFromDB = history[currentMonthName] || currentMonth;
      const historyWithoutCurrent = historyArray.filter(m => m.month !== currentMonthName);

      setData({
        currentMonth: currentMonthFromDB,
        history: historyWithoutCurrent
      });
    } catch (error) {
      console.error('Failed to load goals:', error);
    }
  }, [createNewMonthData]);

  const reportIncrease = async (goalId: string, category: 'sales' | 'marketing', entryData: any) => {
    if (!data.currentMonth) return;
    
    try {
      const response = await fetch('/api/goals/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalId,
          month: data.currentMonth.month,
          entryData
        }),
      });
      
      if (response.ok) {
        await loadData(); // Reload to get updated counts
      }
    } catch (error) {
      console.error('Failed to report increase:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    reportIncrease,
    refresh: loadData
  };
};
