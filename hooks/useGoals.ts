import { useState, useEffect, useCallback } from 'react';
import { GOAL_CONFIGS } from '@/lib/constants';
import { MonthData, GoalEntry, GoalConfig } from '../lib/types';

type GoalsCategory = 'sales' | 'marketing';

const isNumericSlot = (type: string) => type === 'volume' || type === 'congrats';

const buildMonthTemplate = (monthName: string, timestamp = Date.now()): MonthData => {
  const template: MonthData = {
    month: monthName,
    timestamp,
    sales: {},
    marketing: {}
  };

  const ensureGoals = (category: GoalsCategory, configs: GoalConfig[]) => {
    configs.forEach((config) => {
      template[category][config.id] = isNumericSlot(config.type) ? 0 : [];
    });
  };

  ensureGoals('sales', GOAL_CONFIGS.sales);
  ensureGoals('marketing', GOAL_CONFIGS.marketing);

  return template;
};

const ensureGoalSlot = (
  month: MonthData,
  category: GoalsCategory,
  goalId: string,
  type: string
) => {
  if (month[category][goalId] !== undefined) {
    return month[category][goalId];
  }

  month[category][goalId] = isNumericSlot(type) ? 0 : [];
  return month[category][goalId];
};

const applyEntryToMonth = (
  month: MonthData,
  goal: { id: string; category: GoalsCategory; type: string },
  entry: GoalEntry
) => {
  const slot = ensureGoalSlot(month, goal.category, goal.id, goal.type);
  const entryData = entry.entryData || {};

  switch (goal.type) {
    case 'volume': {
      const numberValue = Number(entryData.value ?? entryData.volume ?? entryData.amount ?? 0) || 0;
      month[goal.category][goal.id] = numberValue;
      break;
    }
    case 'congrats': {
      const currentValue = typeof slot === 'number' ? slot : 0;
      const amount = Number(entryData.amount ?? 1) || 1;
      month[goal.category][goal.id] = currentValue + amount;
      break;
    }
    default: {
      const target = Array.isArray(slot) ? slot : [];
      target.push(entryData);
      month[goal.category][goal.id] = target;
      break;
    }
  }
  const entryTimestamp = entry.createdAt ? new Date(entry.createdAt).getTime() : Date.now();
  month.timestamp = Math.max(month.timestamp || 0, entryTimestamp);
};

const buildMonthMap = (goals: Array<{ id: string; category: GoalsCategory; type: string; entries: GoalEntry[] }>) => {
  const months: Record<string, MonthData> = {};

  goals.forEach((goal) => {
    goal.entries?.forEach((entry) => {
      const monthKey = entry.month || 'Unknown';
      if (!months[monthKey]) {
        const timestamp = entry.createdAt ? new Date(entry.createdAt).getTime() : Date.now();
        months[monthKey] = buildMonthTemplate(monthKey, timestamp);
      }

      applyEntryToMonth(months[monthKey], goal, entry);
    });
  });

  return months;
};

export const useGoals = () => {
  const [data, setData] = useState<{ currentMonth: MonthData | null; history: MonthData[] }>({
    currentMonth: null,
    history: []
  });

  const createMonthData = useCallback((monthName: string) => buildMonthTemplate(monthName), []);

  const loadData = useCallback(async () => {
    try {
      const response = await fetch('/api/goals');
      const goals = await response.json();

      const monthMap = buildMonthMap(goals || []);
      const now = new Date();
      const currentMonthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
      const currentMonth = monthMap[currentMonthName] ?? createMonthData(currentMonthName);

      const history = Object.values(monthMap)
        .filter((month) => month.month !== currentMonthName)
        .sort((a, b) => b.timestamp - a.timestamp);

      setData({
        currentMonth,
        history
      });
    } catch (error) {
      console.error('Failed to load goals:', error);
    }
  }, [createMonthData]);

  const reportIncrease = useCallback(
    async (goalId: string, category: GoalsCategory, entryData: Record<string, unknown>) => {
      if (!data.currentMonth) return;

      try {
        const response = await fetch('/api/goals/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goalId,
            month: data.currentMonth.month,
            entryData
          })
        });

        if (response.ok) {
          await loadData();
        }
      } catch (error) {
        console.error('Failed to report increase:', error);
        throw error;
      }
    },
    [data.currentMonth, loadData]
  );

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void loadData();
  }, [loadData]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return {
    data,
    reportIncrease,
    refresh: loadData
  };
};
