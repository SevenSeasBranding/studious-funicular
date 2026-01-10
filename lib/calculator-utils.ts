import { Product, ProductType, PricingFormula, GlobalSettings, Discount, Estimate } from './types';

export const convertToFeet = (value: number, unit: string): number => {
  if (isNaN(value) || value <= 0) return 0;
  if (unit === 'inches') return value / 12;
  if (unit === 'cm') return value / 30.48;
  if (unit === 'mm') return value / 304.8;
  return value;
};

export const convertFromFeet = (value: number, toUnit: string): number => {
  if (!value || value <= 0) return 0;
  if (toUnit === 'inches') return value * 12;
  if (toUnit === 'cm') return value * 30.48;
  if (toUnit === 'mm') return value * 304.8;
  return value;
};

export const calculatePanels = (width: number, pricingKey: string, formulas: Record<string, PricingFormula>): number => {
  const divisor = formulas[pricingKey]?.panelDivisor || 0;
  if (divisor > 0) {
    return Math.max(1, Math.ceil(width / divisor));
  }
  return 0;
};

export const roundPrice = (value: number, option: string): number => {
  if (option === 'dollar') return Math.round(value);
  if (option === 'hundred') return Math.round(value / 100) * 100;
  return parseFloat(value.toFixed(2));
};

export const calculateProductPrice = (
  product: Product,
  settings: GlobalSettings
): { price: number; breakdown: Record<string, number>; errors: string[] } => {
  const errors: string[] = [];
  const breakdown: Record<string, number> = {};

  if (product.customPrice > 0) {
    return { price: product.customPrice * product.quantity, breakdown: {}, errors: [] };
  }

  const h = product.height;
  const w = product.width;

  if (h <= 0 || w <= 0) {
    if (product.originalHeight && product.originalWidth) errors.push("Height and Width must be positive numbers.");
    return { price: 0, breakdown: {}, errors };
  }

  const productTypeDetails = settings.productTypes.find(pt => pt.name === product.productType);
  if (!productTypeDetails) {
    errors.push("Invalid product type selected.");
    return { price: 0, breakdown: {}, errors };
  }

  const params = settings.pricingFormulas[productTypeDetails.pricingKey];
  if (!params) {
    errors.push(`Pricing formula not found for ${product.productType}.`);
    return { price: 0, breakdown: {}, errors };
  }

  const materialOverride = params.materialMaxSizes && params.materialMaxSizes[product.materialType];
  const effectiveMaxWidth = materialOverride?.maxWidth !== undefined ? materialOverride.maxWidth : params.maxWidth;
  const effectiveMaxHeight = materialOverride?.maxHeight !== undefined ? materialOverride.maxHeight : params.maxHeight;

  if (w > effectiveMaxWidth && effectiveMaxWidth !== Infinity) errors.push(`Exceeds max width of ${effectiveMaxWidth}ft for ${product.materialType}.`);
  if (h > effectiveMaxHeight && effectiveMaxHeight !== Infinity) errors.push(`Exceeds max height of ${effectiveMaxHeight}ft for ${product.materialType}.`);

  if (errors.length > 0) {
    return { price: 0, breakdown: {}, errors };
  }

  const SQM = (h * w) / 10.7;
  const OTC = (SQM * params.rate1) + (SQM * params.rate2) + (SQM * params.rate3);
  
  let baseFO = OTC * params.multiplier1 * params.multiplier2;

  if (productTypeDetails.pricingKey === 'bifoldDoor' || productTypeDetails.pricingKey === 'bifoldWindow') {
    if (w > 16) baseFO *= 1.10;
    if (h > 10) { baseFO *= 1.10; baseFO += (SQM * 190); }
  } else if (productTypeDetails.pricingKey === 'slidingDoor' || productTypeDetails.pricingKey === 'slidingWindow') {
    if (w > 20) baseFO *= 1.10;
    if (h > 10) baseFO *= 1.10;
  }

  if (product.glassType === 'Triple pane') {
    const triplePaneCost = baseFO * 0.10;
    breakdown.triplePane = triplePaneCost;
    baseFO += triplePaneCost;
  }

  if (product.smartLock === 'Yes') {
    breakdown.smartLock = params.smartLockCost || settings.additionalCosts.smartLockBaseCost || 0;
  }
  if (product.retractableScreen === 'Yes') {
    breakdown.retractableScreen = (h * w) * (settings.additionalCosts.retractableScreenBaseRate * 1.1 || 12 * 1.1);
  }
  
  const isPanelProductForTexture = ['bifoldDoor', 'bifoldWindow', 'slidingDoor', 'slidingWindow'].includes(productTypeDetails.pricingKey);
  if (isPanelProductForTexture && product.glassTexture !== 'None' && product.numberOfPanels > 0) {
    breakdown.glassTexture = product.numberOfPanels * (settings.additionalCosts.glassTextureAddonCost || 150);
  }
  
  const isSlidingProductForLift = ['slidingDoor', 'slidingWindow'].includes(productTypeDetails.pricingKey);
  if (isSlidingProductForLift && product.liftAndSlide && product.numberOfPanels > 1) {
    breakdown.liftAndSlide = 700 * (product.numberOfPanels - 1);
  }

  let subTotalForSurcharge = baseFO +
    (breakdown.smartLock || 0) +
    (breakdown.retractableScreen || 0) +
    (breakdown.glassTexture || 0) +
    (breakdown.liftAndSlide || 0);

  const basePrice = params.basePriceAmount || 10000;
  const decreaseInterval = params.decreaseInterval || 2000;
  const decreaseMultiplier = params.decreaseMultiplier || 125;
  const increaseInterval = params.increaseInterval || 10000;
  const increaseMultiplier = params.increaseMultiplier || 110;
  
  if (basePrice > 0) {
    if (subTotalForSurcharge < basePrice && decreaseInterval > 0 && decreaseMultiplier !== 100) {
      const difference = basePrice - subTotalForSurcharge;
      const numDecreaseIntervals = Math.floor(difference / decreaseInterval);
      if (numDecreaseIntervals > 0) {
        const finalMultiplier = Math.pow(decreaseMultiplier / 100, numDecreaseIntervals);
        breakdown.customMultiplier = subTotalForSurcharge * (finalMultiplier - 1);
        subTotalForSurcharge *= finalMultiplier;
      }
    } else if (subTotalForSurcharge > basePrice && increaseInterval > 0 && increaseMultiplier !== 100) {
      const difference = subTotalForSurcharge - basePrice;
      const numIncreaseIntervals = Math.floor(difference / increaseInterval);
      if (numIncreaseIntervals > 0) {
        const finalMultiplier = Math.pow(increaseMultiplier / 100, numIncreaseIntervals);
        breakdown.customMultiplier = subTotalForSurcharge * (finalMultiplier - 1);
        subTotalForSurcharge *= finalMultiplier;
      }
    }
  }

  const isCustomColor = product.color === 'Custom';
  const hasGlassTint = product.glassTint !== 'None';

  if (isCustomColor && hasGlassTint) {
    const combinedSurcharge = subTotalForSurcharge * 0.17;
    breakdown.color = subTotalForSurcharge * 0.10;
    breakdown.glassTint = subTotalForSurcharge * 0.10;
    subTotalForSurcharge += combinedSurcharge; 
  } else if (isCustomColor) {
    const colorSurcharge = subTotalForSurcharge * 0.10;
    breakdown.color = colorSurcharge;
    subTotalForSurcharge += colorSurcharge;
  } else if (hasGlassTint) {
    const tintSurcharge = subTotalForSurcharge * 0.10;
    breakdown.glassTint = tintSurcharge;
    subTotalForSurcharge += tintSurcharge;
  }
  
  const materialDetails = settings.materials.find(m => m.name === product.materialType);
  if (materialDetails && materialDetails.multiplier) {
    subTotalForSurcharge *= materialDetails.multiplier;
  }
  
  return { price: subTotalForSurcharge * product.quantity, breakdown, errors: [] };
};

