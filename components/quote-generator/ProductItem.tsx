'use client';

import React from 'react';
import { QuoteProduct } from '@/lib/types';
import { Trash2, Upload } from 'lucide-react';

interface ProductItemProps {
  product: QuoteProduct;
  index: number;
  onUpdate: (index: number, field: keyof QuoteProduct, value: any) => void;
  onRemove: (index: number) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, index, onUpdate, onRemove }) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, imageIndex?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (imageIndex !== undefined) {
          const updatedImages = [...product.additionalImages];
          updatedImages[imageIndex] = event.target?.result as string;
          onUpdate(index, 'additionalImages', updatedImages);
        } else {
          onUpdate(index, 'visualExample', event.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 rounded-lg bg-white border border-gray-200 relative shadow-sm">
      <h3 className="text-lg font-bold border-b pb-2 mb-4">Product {index + 1}</h3>
      <button 
        onClick={() => onRemove(index)}
        className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
      >
        <Trash2 size={20} />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Product Series</label>
          <input 
            type="text" 
            value={product.series}
            onChange={(e) => onUpdate(index, 'series', e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Layout Mode</label>
          <select 
            value={product.layoutMode}
            onChange={(e) => onUpdate(index, 'layoutMode', e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="standard">Standard (Text + Image)</option>
            <option value="split">Split (Half Page Image)</option>
            <option value="full">Vertical (Full Page Image)</option>
            <option value="list">List Mode (Full Page)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Visual Example</label>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200 flex-grow justify-center">
              <Upload size={16} />
              Upload Image
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e)} />
            </label>
            {product.visualExample && (
              <img src={product.visualExample} alt="Thumbnail" className="h-10 w-10 object-cover rounded border" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity</label>
            <input 
              type="number" 
              value={product.quantity}
              onChange={(e) => onUpdate(index, 'quantity', parseInt(e.target.value) || 0)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Retail Price</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={product.price}
                onChange={(e) => onUpdate(index, 'price', parseFloat(e.target.value) || 0)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="flex items-center gap-1 min-w-max">
                <input 
                  type="checkbox" 
                  checked={!product.isTaxable}
                  onChange={(e) => onUpdate(index, 'isTaxable', !e.target.checked)}
                  id={`tax-toggle-${index}`}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`tax-toggle-${index}`} className="text-xs text-gray-500 font-medium">No Tax</label>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Product Description</label>
          <textarea 
            value={product.description}
            onChange={(e) => onUpdate(index, 'description', e.target.value)}
            rows={3}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Width (in)</label>
            <input 
              type="number" 
              value={product.frameW}
              onChange={(e) => onUpdate(index, 'frameW', e.target.value)}
              className="w-full p-2 border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Height (in)</label>
            <input 
              type="number" 
              value={product.frameH}
              onChange={(e) => onUpdate(index, 'frameH', e.target.value)}
              className="w-full p-2 border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Depth (in)</label>
            <input 
              type="number" 
              value={product.frameD}
              onChange={(e) => onUpdate(index, 'frameD', e.target.value)}
              className="w-full p-2 border rounded text-sm"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Images (Optional)</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {product.additionalImages.slice(0, 5).map((img, imgIdx) => (
              <div key={imgIdx} className="relative aspect-square border rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden hover:bg-gray-100 transition-colors">
                <label className="cursor-pointer w-full h-full flex items-center justify-center">
                  {img ? (
                    <img src={img} alt="Additional" className="w-full h-full object-cover" />
                  ) : (
                    <PlusCircle size={20} className="text-gray-400" />
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, imgIdx)} />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PlusCircle = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

export default ProductItem;

