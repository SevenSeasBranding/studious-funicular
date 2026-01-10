'use client';

import React, { useState, useEffect } from 'react';
import { useQuoteGenerator } from '@/hooks/useQuoteGenerator';
import QuoteForm from './QuoteForm';
import QuotePreview from './QuotePreview';
import { QuoteState } from '@/lib/types';
import { ArrowLeft, Layout, FileText, History } from 'lucide-react';
import { generateQuotePDF } from '@/lib/quote-pdf';

interface QuoteGeneratorContainerProps {
  onBack: () => void;
}

const QuoteGeneratorContainer: React.FC<QuoteGeneratorContainerProps> = ({ onBack }) => {
  const { 
    state, 
    updateField, 
    updateClient, 
    updateGM, 
    updatePricing, 
    addProduct, 
    removeProduct, 
    updateProduct,
    addDiscount,
    removeDiscount,
    addTerm,
    removeTerm,
    setState
  } = useQuoteGenerator();

  const [activeTab, setActiveTab] = useState<'generator' | 'past'>('generator');
  const [pastQuotes, setPastQuotes] = useState<QuoteState[]>([]);

  const fetchPastQuotes = async () => {
    try {
      const response = await fetch('/api/quotes');
      const data = await response.json();
      if (!data.error) setPastQuotes(data);
    } catch (error) {
      console.error('Failed to fetch past quotes:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'past') fetchPastQuotes();
  }, [activeTab]);

  const handleSave = async () => {
    if (!state.client.name) {
      alert('Please enter a client name.');
      return;
    }
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });
      if (response.ok) {
        alert('Quote saved successfully!');
        setActiveTab('past');
      }
    } catch (error) {
      alert('Failed to save quote.');
    }
  };

  const handleGeneratePDF = async () => {
    try {
      await generateQuotePDF(state);
    } catch (error) {
      alert('Failed to generate PDF.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto p-4 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Quote Generator</h1>
          <p className="text-gray-500 mt-2 font-medium">Create and manage professional window & door quotes.</p>
          
          <div className="flex justify-center mt-8">
            <div className="inline-flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
              <button 
                onClick={() => setActiveTab('generator')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'generator' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Layout size={18} />
                Generator
              </button>
              <button 
                onClick={() => setActiveTab('past')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'past' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <History size={18} />
                Past Quotes
              </button>
            </div>
          </div>
        </header>

        <div className="mb-6">
          <button 
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </button>
        </div>

        {activeTab === 'generator' ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
              <QuoteForm 
                state={state}
                onUpdateField={updateField}
                onUpdateClient={updateClient}
                onUpdateGM={updateGM}
                onUpdatePricing={updatePricing}
                onAddProduct={addProduct}
                onRemoveProduct={removeProduct}
                onUpdateProduct={updateProduct}
                onAddDiscount={addDiscount}
                onRemoveDiscount={removeDiscount}
                onUpdateAutomatedDiscount={(type, value) => {
                  updateField('automatedDiscounts', { ...state.automatedDiscounts, [type]: value });
                }}
                onAddTerm={addTerm}
                onRemoveTerm={removeTerm}
                onSave={handleSave}
                onGeneratePDF={handleGeneratePDF}
              />
            </div>
            <div className="sticky top-8">
              <QuotePreview state={state} />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {pastQuotes.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-bold">No quotes found.</p>
              </div>
            ) : (
              pastQuotes.map((quote: any) => (
                <div key={quote.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">{quote.clientName}</h3>
                    <p className="text-sm text-gray-500 font-medium italic">Quote #{quote.quoteNumber} • {new Date(quote.createdAt).toLocaleDateString()}</p>
                    <p className="text-blue-600 font-black mt-2 text-xl">${Number(quote.totals.grandTotal).toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setState({
                        ...quote,
                        client: {
                          name: quote.clientName,
                          number: quote.clientNumber || '',
                          email: quote.clientEmail || '',
                          address: quote.clientAddress || '',
                          signatureName: quote.clientSignatureName || '',
                          signatureTitle: quote.clientSignatureTitle || ''
                        },
                        greenMainland: {
                          name: quote.gmName,
                          title: quote.gmTitle
                        }
                      });
                      setActiveTab('generator');
                    }}
                    className="px-6 py-2 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-sm"
                  >
                    Edit Quote
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

export default QuoteGeneratorContainer;

