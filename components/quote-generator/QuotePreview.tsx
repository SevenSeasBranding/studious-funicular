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
        <p><strong>Quotes:</strong> All quotes are valid 14 days from the date they are issued or until revocation by Green Mainland, whichever comes first. Prices may be subject to change without advance notice. We encourage you, the client, to email in your orders as verbal quotes will not be honored.</p>
        <p><strong>Altitude:</strong> Green Mainland assumes that the products will be installed at altitudes less than 4,000 feet for standard windows and doors (corners of frame or glass have 90 deg angles), and 2,500 feet for windows and doors with elements that have corners with other angles. Notify Green Mainland if installing the products at a higher altitude so breather or capillary tubes, or membranes can be installed in the glass. Argon is not available if breather or capillary tubes are installed.</p>
        <p><strong>Images Displayed in Quotes:</strong> All windows and doors displayed in quotes are for illustration purposes only. Physical product appearance may vary due to order specifics and manufacturing process. See Product Description.</p>
        <p><strong>Specifications:</strong> Although every effort is made to ensure the accuracy of these quotes, Green Mainland accepts no liability for errors or omissions which may be found to have occurred. The client must review, verify, and confirm the accuracy of the quote (i.e. net frame and required rough opening dimensions, windows/doors series, windows/doors operation style, windows type, hinge side, frame type, color, grids pattern, etc). The RO shows required dimensions assuming the framing is level. The client shall specify in writing whether they require a low threshold (not water resistant or waterproof) or a standard threshold (water resistant). Any changes to quotes must be submitted in writing. No verbal changes are accepted. The client must initial, sign, and date the quote and e-mail it back to their sales representative before the order is released to production. No changes to the order will be allowed or accepted after 24 hours from the signed quote date.</p>
        <p><strong>Suitability of Usage:</strong> Green Mainland is not responsible for the suitability of any product for any purpose or its compliance with any regulations. Customers are responsible for verifying all applicable building code requirements prior to ordering and are solely responsible for compliance with those building code requirements.</p>
        <p><strong>Payment Terms:</strong> Quotes totaling $25,000 in products or less, not including installation, will require 100% up-front payment or financing.</p>
        <p>For quotes totaling more than $25,000 clients can choose to pay a 70% deposit up-front and 30% when dropped off at the specified location, so long as the minimum amount paid does not fall below $25,000. 100% of the quote must be paid before the items are released and to activate the warranty. Should any legal action need to occur to collect any unpaid balances, the client will be responsible for covering all legal fees.</p>
        <p><strong>Credit Cards:</strong> Most major cards are accepted. A photo ID must be provided with a matching credit card. The name on the card must match the ID of the purchaser exactly.</p>
        <p><strong>Check Payments:</strong> We do not accept postdated or third-party checks. All checks need to be made out to Green Mainland and delivered or mailed to 2158 W. Northwest Hwy, Suite 407, Dallas, TX 75220. For all returned checks, a charge to the client of a $35.00 returned-check fee (i.e. NSF) will apply. Should any legal actions need to occur to collect any unpaid balances, the client will be responsible for covering all legal fees. Checks can be held for 7 days or until verified by the bank before being processed and submitted to manufacturing. Any delays caused by an issue with the check will not be included in the estimated lead time.</p>
      </>
    ) : (
      <>
        <p><strong>Delivery:</strong> Standard Delivery: The quoted total includes freight and shipping to the client’s specified address via Green Mainland’s standard shipping methods, which are curbside delivery only. The client is responsible for unloading the product from the delivery truck and must plan to have sufficient manpower or equipment present for unloading. The weight and dimensions of the package will be communicated to the client in advance. If the location is not easily accessible by common carrier, shipment will be made to the nearest freight terminal. Alternative shipping methods requested by the client may result in additional charges. Upon delivery, the protective tape should be removed from any product surfaces and the product should be stored in a safe and shaded/covered area until installation, as soon as possible, to avoid damage to the product and forfeiture of the warranty.</p>
        <p><strong>Preparation of Installation Site:</strong> For proper installation, there should be more than a 1/2-inch gap between the window or door sashes and stucco, brick, siding, or drywall to ensure the proper operation of the window. All windows and doors require at least a 1/4" gap between the rough opening and the product frame. Please contact the sales representative should there be any questions regarding this order.</p>
        <p>The site must have a laser leveled floor with no dips, bumps, cracking, shifting, slanting. The site must have a re-enforced concrete base, with a re-enforced metal, concrete, or hardwood frame including the top.</p>
        <p><strong>Green Mainland Provided Installers:</strong> Installation must be paid in-full by the client before the installation begins. Any charge associated with installation including (Install, demolition, trimming, waste removal) are subject to change based on unexpected or unagreed upon labor, equipment, and material cost. Any additional work or charges due to poor preparation of the install site, structural integrity issues, code compliance, permitting, hazardous conditions, timeline delays, or access to the property will be noted on-cite and will be billed at the client’s expense before work is completed.</p>
        <p>The client can be billed for installation, demolition, waste removal, and trimming. By default, installation will be the only item included in the price. Demolition, waste removal, and trimming must by specified by the Client and the Green Mainland Representative that signed the quote or their direct manager, before the project begins. Any non-specified charge will be billed at the client’s expense.</p>
        <p>Additional fees may be charged for delivery if the site is deemed hard to reach, inaccessible, if there is insufficient manpower, or if additional equipment is required. All expenses will be paid by the client before work is completed.</p>
        <p>The client maintains the right to request a cost breakdown of all additional charges, but is still required to pay the final agreed upon price before the work is completed.</p>
        <p><strong>Force Majeure:</strong> Green Mainland shall NOT be held liable or responsible to the client nor be deemed to have defaulted under or breached this Agreement for failure or delay in fulfilling or performing any obligation under this Agreement when such failure or delay is caused by or results from causes beyond the reasonable control of the affected party, including but not limited to the pandemic, fire, floods, embargoes, war, acts of war, insurrections, riots, strikes, lockouts or other labor disturbances, or acts of God; provided, however, that the party so affected shall use reasonable commercial efforts to avoid or remove such causes of nonperformance, and shall continue performance hereunder with reasonable dispatch whenever such causes are removed. Green Mainland shall provide the client with prompt written notice of any delay or failure to perform that occurs because of force majeure.</p>
        <p><strong>Inspection:</strong> The client is responsible for inspection of the products for visual defects at the time of pickup or delivery. The client must inform Green Mainland in writing within 48 hours after delivery or pickup of any latent or other defects. If a client fails to notify Green Mainland of any problems within such a time frame, the products will be fully accepted by the client, thus waiving all claims against Green Mainland.</p>
        <p><strong>Returns & Refunds:</strong> 24 hours after the order is confirmed and the quote is signed by the client, it is released to production and there can be no changes, modifications, returns, or refunds accepted or allowed under any circumstances. Due to the custom nature of the products, there will be no exceptions to this clause.</p>
        <p><strong>Disposal of Unclaimed Merchandise:</strong> Due to storage constraints, merchandise will be held by Green Mainland for 30 days only from the date the client is notified that the merchandise is ready for delivery. The daily storage fee will be $15 per window and $30 per door. If the merchandise has not been picked up 30 days after the client was notified that the merchandise is ready for pick up or delivery, the merchandise will be disposed of and no claims for refunds of deposits/payments or replacement of merchandise will be accepted, and no claims can be made against Green Mainland.</p>
        <p><strong>Limitation of Damages and Liability:</strong> If any product is determined to be defective, Green Mainland shall repair or replace the defective product. Green Mainland shall be allowed a minimum of 20 working days to repair or replace the defective product. At no time shall Green Mainland be held responsible for any consequential damages including labor cost, especially if the product has already been installed. Green Mainland will ONLY provide replacement products subject to its current product warranty policy. IN NO EVENT SHALL GREEN MAINLAND BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE), OR STRICT LIABILITY, WITH THE EXCEPTION OF DAMAGES FOR DEATH OR BODILY INJURY CAUSED BY COMPANY’S SOLE NEGLIGENCE OR WILLFUL MISCONDUCT. DAMAGES SHALL NEVER EXCEED THE AMOUNTS PAID BY THE CLIENT TO THE COMPANY FOR SUCH PRODUCTS OR SERVICES.</p>
        <p><strong>Indemnification of Claims:</strong> If the manufactured product by Green Mainland is satisfactory to the client according to these terms and conditions, should any claims be filed by anyone or any entity regarding the manufactured products, the client hereby agrees to indemnify Green Mainland against any and all claims.</p>
        <p><strong>Warranty Policy:</strong> Please refer to the warranty policy for the specific product you purchased, by visiting our website www.greenmainland.com or by contacting your sales representative. IMPORTANT: the warranty is voided if the parameters of the custom merchandise fall outside of the manufacturer’s specifications covered by the warranty.</p>
        <p><strong>Warranty Voiding and Activation:</strong> - Full 100% payment of all products and services are required before any warranty item is submitted, manufactured, or delivered, without exception. - If the client uses their own installers, not supplied by Green Mainland, then they must report any warranty items within 48 hours of the product arriving and before installation begins. These claims must be supported with pictures and videos before the item can be replaced or repaired. The warranty will then be rendered void after 48 hours, and any damages caused by the installers must be paid for by the installation team that caused the damage before the item is replaced or repaired. Including product and labor. - Green Mainland Sponsored Contractors: Green Mainland Will Handle any warranty issues discovered during the installation process. The client will then have 48 hours to inspect the contractor’s work for issues. If there is nearby construction continuing on after the installation of the doors, then the warranty will be immediately voided and any damages caused by the neighboring construction crews will have to be covered by the one that caused the damage. - A warranty is also voided if the rough opening was misrepresented, or if the foundation and framing do not meet the requirements mentioned in “Preparation of Installation Site.” - A warranty is only valid within the inspection timeframes specified above, or if no other construction has been conducted in or near the installation site. All other claims are voided and subject to review by Green Mainland.</p>
        <p><strong>Disclaimer:</strong> EXCEPT AS SPECIFICALLY PROVIDED IN THIS AGREEMENT, NEITHER PARTY MAKES, AND EACH PARTY EXPRESSLY DISCLAIMS, ANY REPRESENTATIONS OR WARRANTIES IN CONNECTION WITH THIS AGREEMENT, WHETHER EXPRESS, IMPLIED, STATUTORY OR OTHERWISE, INCLUDING, WITHOUT LIMITATION, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT OF THIRD PARTY RIGHTS, TITLE, ANY WARRANTIES ARISING OUT OF A COURSE OF PERFORMANCE, DEALING OR TRADE USAGE, AND THEIR EQUIVALENTS UNDER THE LAWS OF ANY JURISDICTION.</p>
        <p><strong>Choice of Law:</strong> This Agreement is governed by the Laws of the State of Texas.</p>
        <p><strong>Binding Agreement:</strong> The Client acknowledges that they have the legal capacity to execute this Agreement and understand that this Agreement is binding on both parties. Failure to proceed with the purchase after executing this Agreement shall carry a penalty of 20% of the quoted amount.</p>
      </>
    )}
  </div>
);

export default QuotePreview;

