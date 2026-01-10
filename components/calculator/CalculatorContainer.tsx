'use client';

import React, { useState } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import { GlobalSettings } from '@/lib/types';
import { INITIAL_MATERIALS, INITIAL_PRODUCT_TYPES } from '@/lib/constants';
import { ArrowLeft, Save, FileDown, Plus, Trash2 } from 'lucide-react';

interface CalculatorContainerProps {
  onBack: () => void;
  settings: GlobalSettings;
}

const CalculatorContainer: React.FC<CalculatorContainerProps> = ({ onBack, settings }) => {
  const { estimate, updateField, addProduct, removeProduct, updateProduct, calculateFullEstimate } = useCalculator(settings);
  const [activeTab, setActiveTab] = useState<'calculator' | 'past' | 'settings'>('calculator');

  return (
    <div className="pb-20">
      <div className="container mx-auto max-w-6xl mb-6 mt-4 flex justify-between items-center">
        <button 
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </button>
      </div>

      <div className="container mx-auto max-w-6xl bg-white shadow-xl rounded-lg p-4 md:p-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-4">{settings.companyName}</h1>
          <nav className="flex justify-center border-b border-gray-300 pb-2 mb-6">
            <button 
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 font-bold transition-colors ${activeTab === 'calculator' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Calculator
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 font-bold transition-colors ${activeTab === 'past' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Past Estimates
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 font-bold transition-colors ${activeTab === 'settings' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Settings
            </button>
          </nav>
        </header>

        <main>
          {activeTab === 'calculator' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Inputs */}
              <div>
                <section className="mb-8">
                  <h3 className="text-xl font-bold mb-4 border-b pb-2">Customer Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Customer Name</label>
                      <input 
                        type="text" 
                        value={estimate.customerName}
                        onChange={(e) => updateField('customerName', e.target.value)}
                        className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Agent Name</label>
                      <select 
                        value={estimate.agentName}
                        onChange={(e) => updateField('agentName', e.target.value)}
                        className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                        <option value="">Select Agent</option>
                        {settings.agents.map(agent => <option key={agent} value={agent}>{agent}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                      <input 
                        type="text" 
                        value={estimate.address}
                        onChange={(e) => updateField('address', e.target.value)}
                        className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Project Description</label>
                      <textarea 
                        value={estimate.projectDescription}
                        onChange={(e) => updateField('projectDescription', e.target.value)}
                        rows={3}
                        className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </section>

                <section className="mb-8">
                  <h3 className="text-xl font-bold mb-4 border-b pb-2">Product Information</h3>
                  <div className="space-y-6">
                    {estimate.products.map((product, idx) => (
                      <div key={product.id} className="p-4 border rounded-lg bg-gray-50 relative shadow-sm">
                        <button 
                          onClick={() => removeProduct(product.id)}
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                        <h4 className="font-bold mb-4 text-gray-700">Product {idx + 1}</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Material</label>
                            <select 
                              value={product.materialType}
                              onChange={(e) => updateProduct(product.id, 'materialType', e.target.value)}
                              className="w-full p-2 border rounded bg-white text-sm"
                            >
                              {settings.materials.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                            <select 
                              value={product.productType}
                              onChange={(e) => updateProduct(product.id, 'productType', e.target.value)}
                              className="w-full p-2 border rounded bg-white text-sm"
                            >
                              {settings.productTypes.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                            </select>
                          </div>
                          
                          {/* Dimensions */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Width</label>
                              <div className="flex">
                                <input 
                                  type="number" 
                                  value={product.originalWidth}
                                  onChange={(e) => updateProduct(product.id, 'originalWidth', e.target.value)}
                                  className="w-full p-2 border rounded-l text-sm"
                                />
                                <select 
                                  value={product.widthUnit}
                                  onChange={(e) => updateProduct(product.id, 'widthUnit', e.target.value)}
                                  className="p-2 border-y border-r rounded-r bg-gray-100 text-xs font-bold"
                                >
                                  <option value="feet">ft</option>
                                  <option value="inches">in</option>
                                  <option value="mm">mm</option>
                                  <option value="cm">cm</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Height</label>
                              <div className="flex">
                                <input 
                                  type="number" 
                                  value={product.originalHeight}
                                  onChange={(e) => updateProduct(product.id, 'originalHeight', e.target.value)}
                                  className="w-full p-2 border rounded-l text-sm"
                                />
                                <select 
                                  value={product.heightUnit}
                                  onChange={(e) => updateProduct(product.id, 'heightUnit', e.target.value)}
                                  className="p-2 border-y border-r rounded-r bg-gray-100 text-xs font-bold"
                                >
                                  <option value="feet">ft</option>
                                  <option value="inches">in</option>
                                  <option value="mm">mm</option>
                                  <option value="cm">cm</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity</label>
                            <input 
                              type="number" 
                              value={product.quantity}
                              min={1}
                              onChange={(e) => updateProduct(product.id, 'quantity', parseInt(e.target.value) || 1)}
                              className="w-full p-2 border rounded text-sm"
                            />
                          </div>
                        </div>

                        {product.errors && product.errors.length > 0 && (
                          <div className="mt-2 text-red-500 text-xs italic">
                            {product.errors.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={addProduct}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                  >
                    <Plus size={16} />
                    Add Product
                  </button>
                </section>
              </div>

              {/* Right Column: Preview */}
              <div className="sticky top-4 h-fit">
                <div className="bg-white border-2 border-gray-900 p-6 rounded-lg shadow-lg">
                  <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-2">
                    <h2 className="text-2xl font-bold">{settings.documentTitle}</h2>
                    <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">PREVIEW</span>
                  </div>
                  
                  <div className="space-y-4 mb-8 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-bold">To:</span>
                      <span className="col-span-2 border-b border-dotted border-gray-400">{estimate.customerName || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-bold">Created By:</span>
                      <span className="col-span-2 border-b border-dotted border-gray-400">{estimate.agentName || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-bold">Total Price:</span>
                      <span className="col-span-2 text-xl font-bold text-green-600">${estimate.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all shadow-md">
                      <Save size={18} />
                      Save Estimate
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-all shadow-md">
                      <FileDown size={18} />
                      Generate PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'past' && (
            <div className="text-center py-20 text-gray-500 italic">
              Past estimates view coming soon...
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="text-center py-20 text-gray-500 italic">
              Settings view coming soon...
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CalculatorContainer;

