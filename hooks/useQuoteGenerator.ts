import { useState, useCallback, useEffect } from 'react';
import { QuoteState, QuoteProduct, QuoteDiscount } from '@/lib/types';

const INITIAL_STATE: QuoteState = {
  logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAABQCAYAAACg76tWAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6QAAQAAAABAAAAOgAAAAAAAAYQAwACAAAAFAAAABKADAAcAAAAQAAAAPQAAAAABJRU5ErkJggg==',
  quoteNumber: '00000',
  client: {
    name: 'Customer Name',
    number: '(000) 000-0000',
    email: 'customer@example.com',
    address: 'Address at Example Street, 00000',
    signatureName: '',
    signatureTitle: ''
  },
  greenMainland: { name: 'James Rivers', title: 'Sales Representative' },
  products: [],
  pricing: {
    installation: 'Yes',
    installationPrice: 0,
    installationIncluded: '',
    installationIsTaxable: true,
    texasSalesTax: 'No',
    taxZipCode: '',
    taxRate: 8.25,
  },
  discounts: [],
  automatedDiscounts: {
    contractor: false,
    bulk: false,
    partner: false,
  },
  additionalTerms: [],
  totals: {
    productTotal: 0,
    subtotal: 0,
    tax: 0,
    grandTotal: 0,
  }
};

export const useQuoteGenerator = (initialQuote?: QuoteState) => {
  const [state, setState] = useState<QuoteState>(initialQuote || INITIAL_STATE);

  const calculateTotals = useCallback(() => {
    setState(prev => {
      let productTotal = 0;
      prev.products.forEach(p => {
        productTotal += (Number(p.quantity) || 0) * (Number(p.price) || 0);
      });

      let currentTotal = productTotal;
      const totals: any = { productTotal };

      // 1. Automated Tiered Discounts
      if (prev.automatedDiscounts.contractor) {
        let rate = 0;
        if (productTotal >= 50000) rate = 10;
        else if (productTotal >= 25000) rate = 5;
        
        if (rate > 0) {
          const amount = productTotal * (rate / 100);
          totals.contractorDiscountCalculated = { name: `Contractor Discount (${rate}%)`, amount };
          currentTotal -= amount;
        } else {
          totals.contractorDiscountCalculated = null;
        }
      }

      if (prev.automatedDiscounts.bulk) {
        let rate = 0;
        if (productTotal >= 200000) rate = 25;
        else if (productTotal >= 150000) rate = 20;
        else if (productTotal >= 100000) rate = 15;
        else if (productTotal >= 50000) rate = 10;
        else if (productTotal >= 25000) rate = 5;

        if (rate > 0) {
          const amount = productTotal * (rate / 100);
          totals.bulkDiscountCalculated = { name: `Bulk Discount (${rate}%)`, amount };
          currentTotal -= amount;
        } else {
          totals.bulkDiscountCalculated = null;
        }
      }

      if (prev.automatedDiscounts.partner) {
        let rate = 0;
        if (productTotal >= 250000) rate = 35;
        else if (productTotal >= 200000) rate = 30;
        else if (productTotal >= 150000) rate = 25;
        else if (productTotal >= 100000) rate = 20;
        else if (productTotal >= 50000) rate = 15;
        else if (productTotal >= 25000) rate = 10;

        if (rate > 0) {
          const amount = productTotal * (rate / 100);
          totals.partnerDiscountCalculated = { name: `Partner Discount (${rate}%)`, amount };
          currentTotal -= amount;
        } else {
          totals.partnerDiscountCalculated = null;
        }
      }

      // 2. Custom Discounts
      const updatedDiscounts = prev.discounts.map(d => {
        const calculatedAmount = (d.valueType === 'percentage') ? productTotal * (d.amount / 100) : d.amount;
        currentTotal -= calculatedAmount;
        return { ...d, calculatedAmount };
      });

      const installationCost = prev.pricing.installation === 'Yes' ? (Number(prev.pricing.installationPrice) || 0) : 0;
      currentTotal += installationCost;
      totals.subtotal = currentTotal;

      let taxableSubtotal = 0;
      prev.products.forEach(p => {
        if (p.isTaxable !== false) {
          const basePrice = (Number(p.quantity) || 0) * (Number(p.price) || 0);
          const totalDiscounts = (productTotal - (currentTotal - installationCost));
          const discountRatio = productTotal > 0 ? (1 - (totalDiscounts / productTotal)) : 1;
          taxableSubtotal += basePrice * discountRatio;
        }
      });
      
      if (prev.pricing.installation === 'Yes' && prev.pricing.installationIsTaxable !== false) {
        taxableSubtotal += installationCost;
      }

      const tax = (prev.pricing.texasSalesTax === 'Yes') ? taxableSubtotal * (prev.pricing.taxRate / 100) : 0;
      totals.tax = tax;
      totals.grandTotal = currentTotal + tax;

      return { ...prev, totals, discounts: updatedDiscounts };
    });
  }, []);

  const addProduct = useCallback(() => {
    const newProduct: QuoteProduct = {
      series: '', description: '', quantity: 1, price: 0,
      visualExample: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlZWVlZWUiLz4KICA8dGV4dCB4PSIzMDAiIHk9IjIwMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjBweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJjZW50cmFsIiBmaWxsPSIjY2NjY2NjIj5WaXN1YWwgRXhhbXBsZTwvdGV4dD4KPC9zdmc+',
      additionalImages: ['', '', '', '', '', '', '', '', ''],
      frameW: '', frameH: '', frameD: '',
      layoutMode: 'standard',
      isTaxable: true,
    };
    setState(prev => ({ ...prev, products: [...prev.products, newProduct] }));
  }, []);

  const removeProduct = (index: number) => {
    setState(prev => {
      const products = [...prev.products];
      products.splice(index, 1);
      return { ...prev, products };
    });
  };

  const updateProduct = (index: number, field: keyof QuoteProduct, value: any) => {
    setState(prev => {
      const products = [...prev.products];
      products[index] = { ...products[index], [field]: value };
      return { ...prev, products };
    });
  };

  const addDiscount = (name: string, valueType: 'percentage' | 'flat', amount: number) => {
    const newDiscount: QuoteDiscount = {
      id: Date.now(),
      name,
      valueType,
      amount,
      calculatedAmount: 0
    };
    setState(prev => ({ ...prev, discounts: [...prev.discounts, newDiscount] }));
  };

  const removeDiscount = (id: number) => {
    setState(prev => ({ ...prev, discounts: prev.discounts.filter(d => d.id !== id) }));
  };

  const updatePricing = (field: keyof QuoteState['pricing'], value: any) => {
    setState(prev => ({ ...prev, pricing: { ...prev.pricing, [field]: value } }));
  };

  const updateClient = (field: keyof QuoteState['client'], value: any) => {
    setState(prev => ({ ...prev, client: { ...prev.client, [field]: value } }));
  };

  const updateGM = (field: keyof QuoteState['greenMainland'], value: any) => {
    setState(prev => ({ ...prev, greenMainland: { ...prev.greenMainland, [field]: value } }));
  };

  const updateField = (field: keyof QuoteState, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const addTerm = (title: string, content: string) => {
    setState(prev => ({
      ...prev,
      additionalTerms: [...prev.additionalTerms, { id: Date.now(), title, content }]
    }));
  };

  const removeTerm = (id: number) => {
    setState(prev => ({
      ...prev,
      additionalTerms: prev.additionalTerms.filter(t => t.id !== id)
    }));
  };

  useEffect(() => {
    calculateTotals();
  }, [state.products, state.pricing, state.discounts, state.automatedDiscounts, calculateTotals]);

  return {
    state,
    setState,
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
    calculateTotals
  };
};

