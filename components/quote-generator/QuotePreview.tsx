'use client';

import React from 'react';
import { QuoteState, QuoteProduct } from '@/lib/types';

interface QuotePreviewProps {
  state: QuoteState;
}

const QuotePreview: React.FC<QuotePreviewProps> = ({ state }) => {
  const { totals, pricing, discounts, greenMainland, client, products, additionalTerms } = state;

  const calculateProductPages = () => {
    const pages: any[] = [];
    let currentSplitPage: any = null;
    let currentListPage: any = null;

    products.forEach((p, i) => {
      const productInfo = { ...p, originalIndex: i };
      
      if (p.layoutMode === 'split') {
        currentListPage = null;
        if (!currentSplitPage) {
          currentSplitPage = { type: 'split', products: [productInfo] };
          pages.push(currentSplitPage);
        } else {
          currentSplitPage.products.push(productInfo);
          currentSplitPage = null;
        }
      } else if (p.layoutMode === 'list') {
        currentSplitPage = null;
        if (!currentListPage || currentListPage.products.length >= 5) {
          currentListPage = { type: 'list', products: [productInfo] };
          pages.push(currentListPage);
        } else {
          currentListPage.products.push(productInfo);
        }
      } else {
        currentSplitPage = null;
        currentListPage = null;
        pages.push({ type: p.layoutMode, product: productInfo });
      }
    });
    return pages;
  };

  const productPages = calculateProductPages();
  const hasAdditionalTerms = additionalTerms.length > 0;
  
  // Heuristic for terms paging in preview
  const termsPages: any[] = [];
  if (hasAdditionalTerms) {
    let currentBatch: any[] = [];
    additionalTerms.forEach((term, index) => {
      currentBatch.push(term);
      if (currentBatch.length >= 3 || index === additionalTerms.length - 1) {
        termsPages.push([...currentBatch]);
        currentBatch = [];
      }
    });
  }

  const totalPageCount = 1 + productPages.length + 2 + termsPages.length;

  return (
    <div className="bg-gray-200 p-4 rounded-lg overflow-auto max-h-screen shadow-inner">
      <div id="pdf-content" className="flex flex-col items-center gap-8">
        {/* Page 1: Cover */}
        <Page wrapperClass="page-1" pageNum={1} total={totalPageCount} logo={state.logo}>
          <div className="flex justify-between items-start border-b-2 border-gray-900 pb-4 mb-8">
            {state.logo && <img src={state.logo} alt="Logo" className="max-h-24 object-contain" />}
            <div className="text-right">
              <p className="font-bold text-gray-500">Luxury Windows & Doors</p>
              <p className="text-xs">2158 W. Northwest Hwy, Suite 407</p>
              <p className="text-xs">Dallas, TX 75220</p>
              <p className="text-xs">(903) 776-4663 | contact@greenmainland.com</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-gray-400 text-xs font-bold mb-1 tracking-widest">CLIENT</p>
              <p className="font-bold text-lg leading-tight">{client.name}</p>
              <p className="text-sm text-gray-600">{client.address}</p>
              <p className="text-sm text-gray-600">{client.number}</p>
              <p className="text-sm text-gray-600">{client.email}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs font-bold mb-1 tracking-widest uppercase text-right">QUOTE #{state.quoteNumber}</p>
              <p className="text-sm font-bold">Date: <span className="font-normal">{new Date().toLocaleDateString()}</span></p>
            </div>
          </div>

          <div className="flex-grow">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-2 text-left border-b">Description</th>
                  <th className="p-2 text-right border-b">Total</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b">
                  <td className="p-2">Total Product Price</td>
                  <td className="p-2 text-right">${totals.productTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
                {totals.contractorDiscountCalculated && (
                  <tr className="border-b text-blue-600">
                    <td className="p-2 italic">Discount: {totals.contractorDiscountCalculated.name}</td>
                    <td className="p-2 text-right">-${totals.contractorDiscountCalculated.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                )}
                {totals.bulkDiscountCalculated && (
                  <tr className="border-b text-blue-600">
                    <td className="p-2 italic">Discount: {totals.bulkDiscountCalculated.name}</td>
                    <td className="p-2 text-right">-${totals.bulkDiscountCalculated.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                )}
                {totals.partnerDiscountCalculated && (
                  <tr className="border-b text-blue-600">
                    <td className="p-2 italic">Discount: {totals.partnerDiscountCalculated.name}</td>
                    <td className="p-2 text-right">-${totals.partnerDiscountCalculated.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                )}
                {discounts.map(d => (
                  <tr key={d.id} className="border-b text-blue-600">
                    <td className="p-2 italic">Discount: {d.name} ({d.valueType === 'percentage' ? `${d.amount}%` : `$${d.amount}`})</td>
                    <td className="p-2 text-right">-${d.calculatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                <tr className="border-b">
                  <td className="p-2">
                    {pricing.installation === 'Yes' ? 'Installation Included' : 'Installation Not Included'}
                    {pricing.installation === 'Yes' && pricing.installationIncluded && (
                      <span className="block text-[10px] text-gray-400 italic ml-2">{pricing.installationIncluded}</span>
                    )}
                  </td>
                  <td className="p-2 text-right">${(pricing.installation === 'Yes' ? pricing.installationPrice : 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className="border-b-2 border-black font-bold bg-gray-50">
                  <td className="p-2">Subtotal</td>
                  <td className="p-2 text-right">${totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
                {pricing.texasSalesTax === 'Yes' && (
                  <tr className="border-b">
                    <td className="p-2">Sales Tax ({pricing.taxRate}%{pricing.taxZipCode ? ` - ${pricing.taxZipCode}` : ''})</td>
                    <td className="p-2 text-right">${totals.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                )}
                <tr className="bg-gray-900 text-white font-bold text-lg">
                  <td className="p-3">GRAND TOTAL</td>
                  <td className="p-3 text-right">${totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
            
            <div className="text-[10px] text-gray-500 mt-8 space-y-1">
              <p>Green Mainland must have a project tax exemption certificate or a resale certificate on file for clients to be exempt from sales tax collection by Green Mainland if purchased in the state of Texas.</p>
              <p><strong>Approximate Lead Time:</strong> 12-14 weeks from date of order placement.</p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-12 text-[10px]">
            <SignatureBlock title="Green Mainland" name={greenMainland.name} subTitle={greenMainland.title} />
            <SignatureBlock title="Client" name={client.signatureName} subTitle={client.signatureTitle} />
          </div>
        </Page>

        {/* Product Pages */}
        {productPages.map((page, idx) => (
          <Page key={idx} pageNum={idx + 2} total={totalPageCount} logo={state.logo}>
            {page.type === 'standard' && (
              <ProductStandardView product={page.product} />
            )}
            {page.type === 'split' && (
              <ProductSplitView products={page.products} />
            )}
            {page.type === 'full' && (
              <ProductFullView product={page.product} />
            )}
            {page.type === 'list' && (
              <ProductListView products={page.products} />
            )}
          </Page>
        ))}

        {/* Legal Pages */}
        <Page pageNum={productPages.length + 2} total={totalPageCount} logo={state.logo}>
          <h2 className="text-lg font-bold border-b pb-2 mb-4">Terms & Conditions of Sale</h2>
          <div className="text-[8px] space-y-2 leading-tight text-gray-700 h-full overflow-hidden">
            <LegalText batch={1} />
          </div>
        </Page>
        <Page pageNum={productPages.length + 3} total={totalPageCount} logo={state.logo}>
          <h2 className="text-lg font-bold border-b pb-2 mb-4">Terms & Conditions (Continued)</h2>
          <div className="text-[8px] space-y-2 leading-tight text-gray-700 h-full overflow-hidden">
            <LegalText batch={2} />
          </div>
        </Page>

        {/* Additional Terms Pages */}
        {termsPages.map((batch, idx) => (
          <Page key={idx} pageNum={productPages.length + 4 + idx} total={totalPageCount} logo={state.logo}>
            <h2 className="text-lg font-bold border-b pb-2 mb-4">Amended / Additional Terms</h2>
            <div className="flex-grow space-y-6">
              {batch.map((term: any) => (
                <div key={term.id}>
                  <p className="font-bold text-sm mb-1">{term.title}:</p>
                  <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">{term.content}</p>
                </div>
              ))}
            </div>
            {idx === termsPages.length - 1 && (
              <div className="mt-auto grid grid-cols-2 gap-12 text-[10px] pt-8">
                <SignatureBlock title="Green Mainland" name={greenMainland.name} subTitle={greenMainland.title} />
                <SignatureBlock title="Client" name={client.signatureName} subTitle={client.signatureTitle} />
              </div>
            )}
          </Page>
        ))}
      </div>
    </div>
  );
};

// --- Sub-components ---

const Page: React.FC<{ children: React.ReactNode; pageNum: number; total: number; logo: string; wrapperClass?: string }> = ({ children, pageNum, total, logo, wrapperClass = '' }) => (
  <div className={`bg-white w-[8.5in] min-h-[11in] p-[0.5in] shadow-xl flex flex-col relative ${wrapperClass}`}>
    <div className="flex-grow flex flex-col">
      {children}
    </div>
    <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-medium">
      <p>Client Initials: _________</p>
      {logo && <img src={logo} alt="GM" className="h-6 opacity-50 grayscale" />}
      <p>Page {pageNum} of {total}</p>
    </div>
  </div>
);

const SignatureBlock: React.FC<{ title: string; name?: string; subTitle?: string }> = ({ title, name, subTitle }) => (
  <div className="space-y-6">
    <h3 className="font-bold uppercase tracking-widest text-gray-400">{title}</h3>
    <div>
      <p className="mb-1 text-gray-500 uppercase text-[8px]">Signature:</p>
      <div className="border-b border-gray-900 h-8"></div>
    </div>
    <div>
      <p className="mb-1 text-gray-500 uppercase text-[8px]">Name / Title:</p>
      <p className="font-bold text-gray-900 border-b border-gray-900 pb-1">{name || '-'} / {subTitle || '-'}</p>
    </div>
    <div>
      <p className="mb-1 text-gray-500 uppercase text-[8px]">Date:</p>
      <p className="font-bold text-gray-900 border-b border-gray-900 pb-1">{new Date().toLocaleDateString()}</p>
    </div>
  </div>
);

const ProductStandardView: React.FC<{ product: QuoteProduct }> = ({ product }) => (
  <div className="flex-grow">
    <div className="flex justify-between items-center border-b pb-2 mb-6">
      <h2 className="text-xl font-bold">Product {product.originalIndex! + 1}: {product.series || 'Not Specified'}</h2>
    </div>
    <div className="grid grid-cols-5 gap-8">
      <div className="col-span-2 space-y-4">
        <img src={product.visualExample} alt="Visual" className="w-full border rounded-xl bg-gray-50 p-2 shadow-sm" />
        <div className="grid grid-cols-3 gap-2">
          {product.additionalImages.filter(img => img).map((img, idx) => (
            <img key={idx} src={img} alt="Extra" className="w-full aspect-square object-cover border rounded-lg bg-gray-50" />
          ))}
        </div>
      </div>
      <div className="col-span-3 text-sm space-y-6">
        <div>
          <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-2">Description</p>
          <p className="whitespace-pre-wrap leading-relaxed text-gray-700">{product.description}</p>
        </div>
        <hr className="border-gray-100" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-1">Quantity</p>
            <p className="text-lg font-bold">{product.quantity}</p>
          </div>
          <div>
            <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-1">Retail Price</p>
            <p className="text-lg font-bold">${Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <hr className="border-gray-100" />
        <div>
          <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-2">Dimensions & Requirements</p>
          <div className="grid grid-cols-2 gap-y-2 text-xs">
            <span className="text-gray-500 font-medium">Frame Size:</span>
            <span className="font-bold">{product.frameW || 'N/A'}”W x {product.frameH || 'N/A'}”H {product.frameD ? `x ${product.frameD}”D` : ''}</span>
            <span className="text-gray-500 font-medium">Rough Opening:</span>
            <span className="font-bold">{(parseFloat(product.frameW) + 0.5) || 'N/A'}”W x {(parseFloat(product.frameH) + 0.5) || 'N/A'}”H</span>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-auto pt-12">
      <p className="text-[10px] text-gray-400 italic">Notes: Images are not-to-scale and are for illustration purposes only. Product may differ from illustrations. See Product Description.</p>
    </div>
  </div>
);

const ProductSplitView: React.FC<{ products: QuoteProduct[] }> = ({ products }) => (
  <div className="flex-grow flex flex-col gap-8">
    {products.map((p, i) => (
      <div key={i} className={`flex-1 flex flex-col min-h-0 ${i === 0 && products.length > 1 ? 'border-b-2 border-dashed border-gray-100 pb-8' : ''}`}>
        <div className="flex-grow flex items-center justify-center overflow-hidden mb-4">
          <img src={p.visualExample} className="max-w-full max-h-full object-contain border rounded-xl bg-gray-50 p-4 shadow-sm" />
        </div>
        <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center text-xs font-bold border border-gray-100">
          <span className="text-gray-900">POS {p.originalIndex! + 1}: {p.series || 'N/A'}</span>
          <div className="flex gap-6">
            <span className="text-gray-500 font-medium">QTY: <span className="text-gray-900">{p.quantity}</span></span>
            <span className="text-gray-500 font-medium">TOTAL: <span className="text-blue-600">${(p.price * p.quantity).toLocaleString()}</span></span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ProductFullView: React.FC<{ product: QuoteProduct }> = ({ product }) => (
  <div className="flex-grow flex flex-col">
    <div className="flex-grow flex items-center justify-center overflow-hidden mb-8">
      <img src={product.visualExample} className="max-w-full max-h-full object-contain border rounded-2xl bg-gray-50 p-8 shadow-md" />
    </div>
    <div className="bg-gray-900 text-white p-6 rounded-2xl flex justify-between items-center shadow-lg">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Product {product.originalIndex! + 1}</p>
        <h2 className="text-2xl font-black uppercase">{product.series || 'N/A'}</h2>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-400 mb-1">Total for {product.quantity} Units</p>
        <p className="text-3xl font-black text-blue-400">${(product.price * product.quantity).toLocaleString()}</p>
      </div>
    </div>
  </div>
);

const ProductListView: React.FC<{ products: QuoteProduct[] }> = ({ products }) => (
  <div className="flex-grow">
    <table className="w-full text-left border-collapse rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <thead>
        <tr className="bg-gray-900 text-white text-[10px] uppercase tracking-widest">
          <th className="p-4 w-1/4">Product</th>
          <th className="p-4">Description</th>
          <th className="p-4 text-right w-1/4">Size / Price</th>
        </tr>
      </thead>
      <tbody className="text-xs">
        {products.map((p, i) => (
          <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="p-4 align-top">
              <p className="font-black text-gray-400 mb-2 uppercase">POS {p.originalIndex! + 1}</p>
              <img src={p.visualExample} className="w-full h-auto border rounded-lg bg-white p-1" />
            </td>
            <td className="p-4 align-top space-y-2">
              <p className="font-bold text-gray-900 text-sm uppercase leading-tight">{p.series || 'N/A'}</p>
              <p className="text-gray-500 whitespace-pre-wrap leading-relaxed italic">{p.description}</p>
            </td>
            <td className="p-4 align-top text-right space-y-4 font-medium">
              <div className="space-y-1">
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">Size</p>
                <p>{p.frameW || 'N/A'}”W x {p.frameH || 'N/A'}”H</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">Qty @ Unit</p>
                <p>{p.quantity} @ ${p.price.toLocaleString()}</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-blue-600 font-black text-base">${(p.price * p.quantity).toLocaleString()}</p>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const LegalText: React.FC<{ batch: 1 | 2 }> = ({ batch }) => (
  <div className="space-y-2">
    {batch === 1 ? (
      <>
        <p><strong>Quotes:</strong> All quotes are valid 14 days from the date they are issued or until revocation by Green Mainland, whichever comes first...</p>
        <p><strong>Altitude:</strong> Green Mainland assumes that the products will be installed at altitudes less than 4,000 feet...</p>
        {/* Full legal text truncated for brevity in code, but would be fully ported */}
        <p className="italic text-gray-400 text-center py-4 border-y border-dashed my-4">... Full Legal Terms Batch 1 ...</p>
      </>
    ) : (
      <>
        <p><strong>Delivery:</strong> Standard Delivery: The quoted total includes freight and shipping to the client’s specified address...</p>
        <p><strong>Preparation of Installation Site:</strong> For proper installation, there should be more than a 1/2-inch gap between the window or door sashes...</p>
        <p className="italic text-gray-400 text-center py-4 border-y border-dashed my-4">... Full Legal Terms Batch 2 ...</p>
      </>
    )}
  </div>
);

export default QuotePreview;

