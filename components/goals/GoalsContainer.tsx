'use client';

import React, { useState, useEffect } from 'react';
import { useGoals } from '@/hooks/useGoals';
import { GOAL_CONFIGS } from '@/lib/constants';
import { GoalConfig, MonthData } from '@/lib/types';
import { ArrowLeft, TrendingUp, History, PlusCircle } from 'lucide-react';

type GoalsCategory = 'sales' | 'marketing';

interface GoalsContainerProps {
  onBack: () => void;
}

interface FieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'url';
  required?: boolean;
  placeholder?: string;
}

const FIELD_MAP: Record<string, FieldDefinition[]> = {
  link: [{ name: 'url', label: 'URL', type: 'url', required: true, placeholder: 'https://...' }],
  meeting: [
    { name: 'purpose', label: 'Purpose', type: 'text', required: true },
    { name: 'outcome', label: 'Outcome / Notes', type: 'textarea' }
  ],
  business: [
    { name: 'outcome', label: 'Outcome', type: 'textarea', required: true },
    { name: 'crmId', label: 'CRM ID', type: 'text' }
  ],
  volume: [{ name: 'value', label: 'Total Outbound Volume', type: 'number', required: true }],
  sale: [
    { name: 'amount', label: 'Amount ($)', type: 'number', required: true },
    { name: 'person', label: 'Sales Person', type: 'text' },
    { name: 'days', label: 'Duration (Days)', type: 'number' },
    { name: 'months', label: 'Duration (Months)', type: 'number' }
  ],
  partner: [
    { name: 'name', label: 'Partner Name', type: 'text', required: true },
    { name: 'number', label: 'Phone / Number', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'description', label: 'Notes', type: 'textarea' }
  ],
  congrats: []
};

const formatLabel = (value: string) => {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatGoalValue = (value: number, config: GoalConfig) => {
  if (config.isCurrency) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }
  return value;
};

const getGoalCount = (config: GoalConfig, targetMonth: MonthData, category: GoalsCategory) => {
  const raw = targetMonth[category][config.id];
  if (Array.isArray(raw)) {
    if (config.type === 'sale' || config.id === 'totalSales') {
      return raw.reduce((total, entry) => {
        const typedEntry = entry as Record<string, unknown>;
        return total + (Number(typedEntry.amount ?? typedEntry.value ?? 0) || 0);
      }, 0);
    }
    return raw.length;
  }
  return Number(raw || 0);
};

const GoalsContainer: React.FC<GoalsContainerProps> = ({ onBack }) => {
  const { data, reportIncrease } = useGoals();
  const [activeTab, setActiveTab] = useState<GoalsCategory>('sales');
  const [showHistory, setShowHistory] = useState(false);
  const [modalGoal, setModalGoal] = useState<{ config: GoalConfig; category: GoalsCategory } | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(timer);
  }, [feedback]);

  if (!data.currentMonth) return <div className="p-20 text-center">Loading...</div>;

  const openReportModal = (config: GoalConfig, category: GoalsCategory) => {
    setModalGoal({ config, category });
    setFormData({});
  };

  const closeModal = () => {
    setModalGoal(null);
    setFormData({});
    setIsSubmitting(false);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const buildEntryPayload = () => {
    if (!modalGoal) return {};
    const fields = FIELD_MAP[modalGoal.config.type] || [];
    const payload: Record<string, unknown> = {};
    fields.forEach((field) => {
      const rawValue = formData[field.name] ?? '';
      payload[field.name] = field.type === 'number' ? Number(rawValue) || 0 : rawValue.trim();
    });

    if (modalGoal.config.type === 'congrats') {
      payload.amount = 1;
    }

    payload.date = new Date().toLocaleString();
    return payload;
  };

  const handleModalSubmit = async () => {
    if (!modalGoal) return;
    const fields = FIELD_MAP[modalGoal.config.type] || [];

    const missing = fields.find(
      (field) => field.required && !formData[field.name] && formData[field.name] !== '0'
    );
    if (missing) {
      setFeedback({ type: 'error', message: `Please fill out ${missing.label}.` });
      return;
    }

    const payload = buildEntryPayload();
    setIsSubmitting(true);
    try {
      await reportIncrease(modalGoal.config.id, modalGoal.category, payload);
      setFeedback({ type: 'success', message: `${modalGoal.config.name} updated.` });
      closeModal();
    } catch {
      setFeedback({ type: 'error', message: 'Unable to save the entry right now.' });
      setIsSubmitting(false);
    }
  };

  const historySummary = (month: MonthData) => {
    const totalSalesConfig = GOAL_CONFIGS.sales.find((goal) => goal.id === 'totalSales');
    const meetingsConfig = GOAL_CONFIGS.sales.find((goal) => goal.id === 'meetings');
    const videosConfig = GOAL_CONFIGS.marketing.find((goal) => goal.id === 'videos');
    const totalSalesValue = totalSalesConfig ? getGoalCount(totalSalesConfig, month, 'sales') : 0;
    const meetingsValue = meetingsConfig ? getGoalCount(meetingsConfig, month, 'sales') : 0;
    const videosValue = videosConfig ? getGoalCount(videosConfig, month, 'marketing') : 0;
    return `Total Sales: ${
      totalSalesConfig ? formatGoalValue(totalSalesValue, totalSalesConfig) : '$0'
    } | Meetings: ${meetingsValue} | Videos: ${videosValue}`;
  };

  const historyEntries = (month: MonthData, category: GoalsCategory) => (
    <div className="mt-4 space-y-4">
      <h4 className="text-xs uppercase tracking-widest text-gray-500">{category} breakdown</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {GOAL_CONFIGS[category].map((config) => {
          const raw = month[category][config.id];
          const value = getGoalCount(config, month, category);
          const entries = Array.isArray(raw) ? (raw as Record<string, unknown>[]) : [];
          return (
            <div key={`${month.month}-${config.id}`} className="bg-white border rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-gray-400 uppercase">{config.name}</p>
                <span className="text-xs text-gray-500">
                  {formatGoalValue(value, config)} / {formatGoalValue(config.target, config)}
                </span>
              </div>
              {entries.length > 0 ? (
                <div className="space-y-2">
                  {entries.slice(0, 3).map((entry, idx) => (
                    <div
                      key={`${config.id}-entry-${idx}`}
                      className="text-[11px] text-gray-700 bg-gray-50 border border-dashed border-gray-200 rounded-lg p-2"
                    >
                      {entry.date && (
                        <p className="text-[10px] text-gray-400 mb-1">{entry.date}</p>
                      )}
                      {Object.entries(entry as Record<string, unknown>)
                        .filter(([key]) => key !== 'date')
                        .map(([key, val]) => (
                          <div key={`${key}-${idx}`} className="flex justify-between">
                            <span className="font-semibold">{formatLabel(key)}:</span>
                            <span>{String(val)}</span>
                          </div>
                        ))}
                    </div>
                  ))}
                  {entries.length > 3 && (
                    <p className="text-[10px] text-gray-400">+ {entries.length - 3} more entries</p>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-gray-400">No entries logged.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl mb-6 mt-4">
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </button>
      </div>

      {feedback && (
        <div className="container mx-auto max-w-6xl mb-6">
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
              feedback.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-100'
                : 'bg-red-50 text-red-700 border border-red-100'
            }`}
          >
            {feedback.message}
          </div>
        </div>
      )}

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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  !showHistory ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <TrendingUp size={16} />
                Current Goals
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  showHistory ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-600'
                }`}
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
                className={`px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'sales'
                    ? 'border-b-4 border-blue-600 text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Sales View
              </button>
              <button
                onClick={() => setActiveTab('marketing')}
                className={`px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'marketing'
                    ? 'border-b-4 border-blue-600 text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Marketing View
              </button>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GOAL_CONFIGS[activeTab].map((config) => {
                const count = getGoalCount(config, data.currentMonth!, activeTab);
                const progress =
                  config.target > 0 ? Math.min(100, (count / config.target) * 100) : 0;
                return (
                  <div
                    key={config.id}
                    className="bg-gray-50 border rounded-2xl p-6 relative group hover:border-blue-500 transition-all shadow-sm hover:shadow-lg"
                  >
                    <button
                      onClick={() => openReportModal(config, activeTab)}
                      className="absolute top-4 right-4 text-gray-300 hover:text-blue-600 transition-colors"
                      title="Report Increase"
                    >
                      <PlusCircle size={24} />
                    </button>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                      {config.name}
                    </h4>
                    <div className="text-2xl font-black text-gray-900 mb-4">
                      {formatGoalValue(count, config)}
                      <span className="text-sm text-gray-400 font-bold ml-2">
                        / {formatGoalValue(config.target, config)}
                      </span>
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
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-700">Historical Performance</h3>
            {data.history.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">No historical data available yet.</p>
              </div>
            ) : (
              data.history.map((month) => (
                <div
                  key={month.month}
                  className="p-4 border rounded-xl bg-gray-50 shadow-sm space-y-2"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                    <div>
                      <p className="font-bold text-gray-900">{month.month}</p>
                      <p className="text-xs text-gray-500">{historySummary(month)}</p>
                    </div>
                    <button
                      onClick={() =>
                        setExpandedMonth((prev) => (prev === month.month ? null : month.month))
                      }
                      className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      {expandedMonth === month.month ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                  {expandedMonth === month.month && (
                    <>
                      {historyEntries(month, 'sales')}
                      {historyEntries(month, 'marketing')}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {modalGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl text-left relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{modalGoal.config.name}</h3>
            <p className="text-sm text-gray-500 mb-6">
              Reporting for the {modalGoal.category} goal.
            </p>

            {FIELD_MAP[modalGoal.config.type]?.length ? (
              <div className="space-y-4">
                {FIELD_MAP[modalGoal.config.type].map((field) =>
                  field.type === 'textarea' ? (
                    <div key={field.name}>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">{field.label}</label>
                      <textarea
                        value={formData[field.name] ?? ''}
                        onChange={(event) => handleFieldChange(field.name, event.target.value)}
                        placeholder={field.placeholder}
                        className="w-full border border-gray-200 rounded-xl p-3 text-sm"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <div key={field.name}>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">{field.label}</label>
                      <input
                        type={field.type === 'number' ? 'number' : 'text'}
                        value={formData[field.name] ?? ''}
                        onChange={(event) => handleFieldChange(field.name, event.target.value)}
                        placeholder={field.placeholder}
                        className="w-full border border-gray-200 rounded-xl p-3 text-sm"
                      />
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">
                This entry increments progress automatically. No additional info required.
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60"
              >
                {isSubmitting ? 'Saving...' : 'Submit Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsContainer;

