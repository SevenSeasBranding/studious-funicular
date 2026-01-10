import { useState, useCallback, useEffect } from 'react';
import { Product, Discount, Estimate, GlobalSettings } from '../lib/types';
import { convertToFeet, calculatePanels, calculateProductPrice, roundPrice } from '../lib/calculator-utils';

export const useCalculator = (initialSettings: GlobalSettings) => {
  const [estimate, setEstimate] = useState<Estimate>({
    customerName: '',
    agentName: '',
    address: '',
    projectDescription: '',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    products: [],
    discounts: [],
    installationCost: 0,
    smallOrderShipping: 0,
    subtotalProducts: 0,
    totalPrice: 0,
    taxExempt: false,
    taxRateLow: 0,
    taxRateHigh: 0,
  });

  const calculateFullEstimate = useCallback(() => {
    setEstimate(prev => {
      let subtotalProducts = 0;
      const updatedProducts = prev.products.map(p => {
        const { price, breakdown, errors } = calculateProductPrice(p, initialSettings);
        const rounded = roundPrice(price, initialSettings.roundingOption);
        subtotalProducts += rounded;
        return { ...p, calculatedPrice: rounded, addonCostsBreakdown: breakdown, errors };
      });

      let currentTotal = subtotalProducts;
      const updatedDiscounts = prev.discounts.map(d => {
        const base = d.appliesTo === 'principle' ? subtotalProducts : currentTotal;
        let amount = d.amount;
        
        if (d.isAutoCalculated) {
          if (d.discountType === 'Contractor') {
            amount = subtotalProducts >= 50000 ? 10 : (subtotalProducts >= 25000 ? 5 : 0);
          } else if (d.discountType === 'Bulk') {
            if (subtotalProducts >= 200000) amount = 25;
            else if (subtotalProducts >= 150000) amount = 20;
            else if (subtotalProducts >= 100000) amount = 15;
            else if (subtotalProducts >= 50000) amount = 10;
            else if (subtotalProducts >= 25000) amount = 5;
            else amount = 0;
          } else if (d.discountType === 'Partner') {
            if (subtotalProducts >= 250000) amount = 35;
            else if (subtotalProducts >= 200000) amount = 30;
            else if (subtotalProducts >= 150000) amount = 25;
            else if (subtotalProducts >= 100000) amount = 20;
            else if (subtotalProducts >= 50000) amount = 15;
            else if (subtotalProducts >= 25000) amount = 10;
            else amount = 0;
          }
        }

        const calculated = roundPrice(
          d.valueType === 'percentage' ? base * (amount / 100) : amount,
          initialSettings.roundingOption
        );
        currentTotal -= calculated;
        return { ...d, amount, calculatedAmount: calculated };
      });

      const shipping = subtotalProducts >= 10000 ? 0 : (subtotalProducts <= 4000 ? 2500 : roundPrice(2500 * (1 - (subtotalProducts - 4000) / 6000), initialSettings.roundingOption));
      
      const taxBase = currentTotal;
      const taxEstimateLow = roundPrice(taxBase * (prev.taxRateLow / 100), initialSettings.roundingOption);
      const taxEstimateHigh = roundPrice(taxBase * (prev.taxRateHigh / 100), initialSettings.roundingOption);

      const isHighValue = subtotalProducts >= 20000;
      const installEstimateLow = (prev.installationCost > 0 || isHighValue) ? 0 : Math.max(800, roundPrice(taxBase * 0.20, initialSettings.roundingOption));
      const installEstimateHigh = (prev.installationCost > 0 || isHighValue) ? 0 : Math.max(800, roundPrice(taxBase * 0.25, initialSettings.roundingOption));

      const totalPrice = roundPrice(currentTotal + prev.installationCost + shipping, initialSettings.roundingOption);

      return {
        ...prev,
        products: updatedProducts,
        discounts: updatedDiscounts,
        subtotalProducts,
        smallOrderShipping: shipping,
        taxEstimateLow,
        taxEstimateHigh,
        installEstimateLow,
        installEstimateHigh,
        totalPrice
      };
    });
  }, [initialSettings]);

  const updateField = (field: keyof Estimate, value: any) => {
    setEstimate(prev => ({ ...prev, [field]: value }));
  };

  const addProduct = useCallback(() => {
    const defaultMaterial = initialSettings.materials[0]?.name || '';
    const availableTypes = initialSettings.productTypes.filter(pt => pt.availableMaterials?.includes(defaultMaterial) ?? true);
    const newProduct: Product = {
      id: Date.now(),
      materialType: defaultMaterial,
      productType: availableTypes[0]?.name || '',
      customPrice: 0,
      customDescription: '',
      originalWidth: '',
      widthUnit: 'feet',
      originalHeight: '',
      heightUnit: 'feet',
      width: 0,
      height: 0,
      color: initialSettings.options.colors[0] || '',
      colorDetail: '',
      smartLock: 'No',
      retractableScreen: 'No',
      glassType: initialSettings.options.glassTypes[0]?.name || '',
      glassTexture: 'None',
      glassTint: 'None',
      quantity: 1,
      liftAndSlide: false,
      numberOfPanels: 0,
      customPanels: false,
    };
    setEstimate(prev => ({ ...prev, products: [...prev.products, newProduct] }));
  }, [initialSettings]);

  const removeProduct = (id: number) => {
    setEstimate(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
  };

  const updateProduct = (id: number, field: keyof Product, value: any) => {
    setEstimate(prev => {
      const updatedProducts = prev.products.map(p => {
        if (p.id === id) {
          const updated = { ...p, [field]: value };
          if (['originalWidth', 'widthUnit', 'originalHeight', 'heightUnit'].includes(field as string)) {
            updated.width = convertToFeet(parseFloat(updated.originalWidth), updated.widthUnit);
            updated.height = convertToFeet(parseFloat(updated.originalHeight), updated.heightUnit);
            if (!updated.customPanels) {
              const pt = initialSettings.productTypes.find(t => t.name === updated.productType);
              if (pt) updated.numberOfPanels = calculatePanels(updated.width, pt.pricingKey, initialSettings.pricingFormulas);
            }
          }
          return updated;
        }
        return p;
      });
      return { ...prev, products: updatedProducts };
    });
  };

  useEffect(() => {
    calculateFullEstimate();
  }, [estimate.products.length, estimate.discounts.length, estimate.installationCost, estimate.taxRateLow, estimate.taxRateHigh, calculateFullEstimate]);

  return {
    estimate,
    updateField,
    addProduct,
    removeProduct,
    updateProduct,
    calculateFullEstimate
  };
};

