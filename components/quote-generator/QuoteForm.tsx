'use client';

import React, { useState } from 'react';
import { QuoteState, QuoteProduct, QuoteDiscount } from '@/lib/types';
import ProductItem from './ProductItem';
import { Plus, Save, FileDown, Upload, Trash2 } from 'lucide-react';

interface QuoteFormProps {
  state: QuoteState;
  onUpdateField: (field: keyof QuoteState, value: any) => void;
  onUpdateClient: (field: keyof QuoteState['client'], value: any) => void;
  onUpdateGM: (field: keyof QuoteState['greenMainland'], value: any) => void;
  onUpdatePricing: (field: keyof QuoteState['pricing'], value: any) => void;
  onAddProduct: () => void;
  onRemoveProduct: (index: number) => void;
  onUpdateProduct: (index: number, field: keyof QuoteProduct, value: any) => void;
  onAddDiscount: (name: string, valueType: 'percentage' | 'flat', amount: number) => void;
  onRemoveDiscount: (id: number) => void;
  onUpdateAutomatedDiscount: (type: 'contractor' | 'bulk' | 'partner', value: boolean) => void;
  onAddTerm: (title: string, content: string) => void;
  onRemoveTerm: (id: number) => void;
  onSave: () => void;
  onGeneratePDF: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  state,
  onUpdateField,
  onUpdateClient,
  onUpdateGM,
  onUpdatePricing,
  onAddProduct,
  onRemoveProduct,
  onUpdateProduct,
  onAddDiscount,
  onRemoveDiscount,
  onUpdateAutomatedDiscount,
  onAddTerm,
  onRemoveTerm,
  onSave,
  onGeneratePDF
}) => {
  const [newDiscount, setNewDiscount] = useState({ name: '', valueType: 'percentage' as 'percentage' | 'flat', amount: 0 });
  const [newTerm, setNewTerm] = useState({ title: '', content: '' });
  const [showTerms, setShowTerms] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => onUpdateField('logo', event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Company & Quote Details */}
      <div className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold border-b pb-2 mb-4">Company & Quote Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Company Logo</label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200 flex-grow justify-center">
                <Upload size={16} />
                Upload Logo
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </label>
              {state.logo && (
                <img src={state.logo} alt="Logo Preview" className="h-10 w-10 object-contain rounded border" />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Quote Number</label>
            <input 
              type="text" 
              value={state.quoteNumber}
              onChange={(e) => onUpdateField('quoteNumber', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., 00000"
            />
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold border-b pb-2 mb-4">Client Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Client Name</label>
            <input 
              type="text" 
              value={state.client.name}
              onChange={(e) => onUpdateClient('name', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Client Number</label>
            <input 
              type="text" 
              value={state.client.number}
              onChange={(e) => onUpdateClient('number', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Client Email</label>
            <input 
              type="email" 
              value={state.client.email}
              onChange={(e) => onUpdateClient('email', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Client Address</label>
            <input 
              type="text" 
              value={state.client.address}
              onChange={(e) => onUpdateClient('address', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="space-y-4">
        {state.products.map((product, index) => (
          <ProductItem 
            key={index}
            product={product}
            index={index}
            onUpdate={onUpdateProduct}
            onRemove={onRemoveProduct}
          />
        ))}
        <button 
          onClick={onAddProduct}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Pricing & Tax */}
      <div className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold border-b pb-2 mb-4">Pricing & Tax</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Installation</label>
            <select 
              value={state.pricing.installation}
              onChange={(e) => onUpdatePricing('installation', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Installation Price</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={state.pricing.installationPrice}
                onChange={(e) => onUpdatePricing('installationPrice', parseFloat(e.target.value) || 0)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="flex items-center gap-1 min-w-max">
                <input 
                  type="checkbox" 
                  checked={!state.pricing.installationIsTaxable}
                  onChange={(e) => onUpdatePricing('installationIsTaxable', !e.target.checked)}
                  id="install-tax-toggle"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="install-tax-toggle" className="text-xs text-gray-500 font-medium">No Tax</label>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">What is included in installation</label>
            <input 
              type="text" 
              value={state.pricing.installationIncluded}
              onChange={(e) => onUpdatePricing('installationIncluded', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Delivery, Setup, and Cleanup"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Texas Sales Tax</label>
            <select 
              value={state.pricing.texasSalesTax}
              onChange={(e) => onUpdatePricing('texasSalesTax', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          {state.pricing.texasSalesTax === 'Yes' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Zip Code</label>
                <input 
                  type="text" 
                  value={state.pricing.taxZipCode}
                  onChange={(e) => onUpdatePricing('taxZipCode', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., 75220"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tax Rate (%)</label>
                <input 
                  type="number" 
                  value={state.pricing.taxRate}
                  onChange={(e) => onUpdatePricing('taxRate', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  step="0.001"
                />
              </div>
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold border-b pb-2 mt-6 mb-4">Automated Discounts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <label className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
            <input 
              type="checkbox" 
              checked={state.automatedDiscounts.contractor}
              onChange={(e) => onUpdateAutomatedDiscount('contractor', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">Contractor Discount</span>
          </label>
          <label className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
            <input 
              type="checkbox" 
              checked={state.automatedDiscounts.bulk}
              onChange={(e) => onUpdateAutomatedDiscount('bulk', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">Bulk Discount</span>
          </label>
          <label className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
            <input 
              type="checkbox" 
              checked={state.automatedDiscounts.partner}
              onChange={(e) => onUpdateAutomatedDiscount('partner', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">Partner Discount</span>
          </label>
        </div>

        <h3 className="text-lg font-bold border-b pb-2 mt-6 mb-4">Custom Discounts</h3>
        <div className="space-y-2 mb-4">
          {state.discounts.map(discount => (
            <div key={discount.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 shadow-sm">
              <span className="text-sm font-medium text-gray-700">
                {discount.name} - {discount.valueType === 'percentage' ? `${discount.amount}%` : `$${discount.amount.toFixed(2)}`}
              </span>
              <button 
                onClick={() => onRemoveDiscount(discount.id)}
                className="p-1 text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Discount Name</label>
            <input 
              type="text" 
              value={newDiscount.name}
              onChange={(e) => setNewDiscount(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Seasonal Promo"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Value Type</label>
            <select 
              value={newDiscount.valueType}
              onChange={(e) => setNewDiscount(prev => ({ ...prev, valueType: e.target.value as 'percentage' | 'flat' }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="percentage">%</option>
              <option value="flat">$</option>
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex-grow">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Amount</label>
              <input 
                type="number" 
                value={newDiscount.amount}
                onChange={(e) => setNewDiscount(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button 
              onClick={() => {
                if (newDiscount.name && newDiscount.amount > 0) {
                  onAddDiscount(newDiscount.name, newDiscount.valueType, newDiscount.amount);
                  setNewDiscount({ name: '', valueType: 'percentage', amount: 0 });
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Signature Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">GM Signature Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                value={state.greenMainland.name}
                onChange={(e) => onUpdateGM('name', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                value={state.greenMainland.title}
                onChange={(e) => onUpdateGM('title', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
        <div className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Client Signature Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                value={state.client.signatureName}
                onChange={(e) => onUpdateClient('signatureName', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                value={state.client.signatureTitle}
                onChange={(e) => onUpdateClient('signatureTitle', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Amended / Additional Terms */}
      <div className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-bold">Amended / Additional Terms</h2>
          <button 
            onClick={() => setShowTerms(!showTerms)}
            className="text-blue-600 font-bold text-sm hover:underline"
          >
            {showTerms ? '- Hide terms' : '+ Add terms'}
          </button>
        </div>
        {showTerms && (
          <div className="space-y-4">
            <div className="space-y-3">
              {state.additionalTerms.map(term => (
                <div key={term.id} className="bg-gray-50 border p-4 rounded-lg relative group">
                  <div className="font-bold text-sm mb-1">{term.title}</div>
                  <div className="text-xs text-gray-600 whitespace-pre-wrap">{term.content}</div>
                  <button 
                    onClick={() => onRemoveTerm(term.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 p-4 rounded-xl space-y-3 border border-blue-100 shadow-inner">
              <div>
                <label className="block text-sm text-gray-700 font-bold mb-1">Term Title</label>
                <input 
                  type="text" 
                  value={newTerm.title}
                  onChange={(e) => setNewTerm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Extended Warranty"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-bold mb-1">Term Content</label>
                <textarea 
                  value={newTerm.content}
                  onChange={(e) => setNewTerm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-2 border rounded-md shadow-sm h-24 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter terms here..."
                />
              </div>
              <button 
                onClick={() => {
                  if (newTerm.title && newTerm.content) {
                    onAddTerm(newTerm.title, newTerm.content);
                    setNewTerm({ title: '', content: '' });
                  }
                }}
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
              >
                Add Term Block
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button 
          onClick={onSave}
          className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-4 px-6 rounded-xl hover:bg-green-600 transition-all text-lg shadow-lg hover:shadow-xl active:transform active:scale-95"
        >
          <Save size={24} />
          Save Quote
        </button>
        <button 
          onClick={onGeneratePDF}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-all text-lg shadow-lg hover:shadow-xl active:transform active:scale-95"
        >
          <FileDown size={24} />
          Generate PDF
        </button>
      </div>
    </div>
  );
};

export default QuoteForm;

