export interface Material {
  name: string;
  description: string;
  multiplier: number;
}

export interface ProductType {
  name: string;
  category: string;
  hasHurricaneOption: boolean;
  pricingKey: string;
  availableMaterials?: string[];
}

export interface Product {
  id: number;
  materialType: string;
  productType: string;
  customPrice: number;
  customDescription: string;
  originalWidth: string;
  widthUnit: 'feet' | 'inches' | 'cm' | 'mm';
  originalHeight: string;
  heightUnit: 'feet' | 'inches' | 'cm' | 'mm';
  width: number; // in feet
  height: number; // in feet
  color: string;
  colorDetail: string;
  smartLock: 'Yes' | 'No';
  retractableScreen: 'Yes' | 'No';
  glassType: string;
  glassTexture: string;
  glassTint: string;
  quantity: number;
  liftAndSlide: boolean;
  numberOfPanels: number;
  customPanels: boolean;
  calculatedPrice?: number;
  addonCostsBreakdown?: Record<string, number>;
  errors?: string[];
}

export interface Discount {
  id: number;
  name: string;
  discountType: string;
  valueType: 'percentage' | 'flat';
  amount: number;
  appliesTo: 'principle' | 'previous';
  isAutoCalculated: boolean;
  calculatedAmount?: number;
}

export interface Estimate {
  id?: string;
  customerName: string;
  agentName: string;
  address: string;
  projectDescription: string;
  date: string;
  products: Product[];
  discounts: Discount[];
  installationCost: number;
  smallOrderShipping: number;
  subtotalProducts: number;
  totalPrice: number;
  taxExempt: boolean;
  taxRateLow: number;
  taxRateHigh: number;
  taxSource?: string;
  zipCode?: string;
  city?: string;
  zipCodeState?: string;
  installEstimateLow?: number;
  installEstimateHigh?: number;
  taxEstimateLow?: number;
  taxEstimateHigh?: number;
}

export interface GlobalSettings {
  companyName: string;
  documentTitle: string;
  disclaimerText: string;
  roundingOption: 'none' | 'dollar' | 'hundred';
  invertText: boolean;
  bgImageBase64: string | null;
  bgImageOpacity: number;
  enableConversion: boolean;
  conversionTargetUnit: 'mm' | 'cm' | 'inches' | 'feet';
  agents: string[];
  materials: Material[];
  productTypes: ProductType[];
  options: {
    colors: string[];
    glassTypes: { name: string; description: string }[];
    glassTextures: string[];
    glassTints: string[];
    yesNo: { yes: string; no: string };
  };
  pricingFormulas: Record<string, PricingFormula>;
  additionalCosts: {
    smartLockBaseCost: number;
    retractableScreenBaseRate: number;
    glassTextureAddonCost: number;
  };
  displayAddonCosts: {
    triplePane: boolean;
    color: boolean;
    glassTint: boolean;
    smartLock: boolean;
    retractableScreen: boolean;
    glassTexture: boolean;
  };
}

export interface PricingFormula {
  formulaText: string;
  maxWidth: number;
  maxHeight: number;
  panelDivisor: number;
  rate1: number;
  rate2: number;
  rate3: number;
  multiplier1: number;
  multiplier2: number;
  smartLockCost: number;
  basePriceAmount: number;
  decreaseInterval: number;
  decreaseMultiplier: number;
  increaseInterval: number;
  increaseMultiplier: number;
  materialMaxSizes: Record<string, { maxWidth?: number; maxHeight?: number }>;
}

export interface GoalEntry {
  id?: number;
  month: string;
  date: string;
  goalId: string;
  entryData: Record<string, unknown>;
  createdAt?: string;
}

export interface GoalConfig {
  id: string;
  name: string;
  target: number;
  type: string;
  isCurrency?: boolean;
}

export interface MonthData {
  month: string;
  timestamp: number;
  sales: Record<string, unknown>;
  marketing: Record<string, unknown>;
}

// Quote Generator Types
export interface QuoteProduct {
  series: string;
  description: string;
  quantity: number;
  price: number;
  visualExample: string; // Base64
  additionalImages: string[]; // Array of Base64
  frameW: string;
  frameH: string;
  frameD: string;
  layoutMode: 'standard' | 'split' | 'full' | 'list';
  isTaxable: boolean;
  originalIndex?: number;
}

export interface QuoteDiscount {
  id: number;
  name: string;
  valueType: 'percentage' | 'flat';
  amount: number;
  calculatedAmount: number;
}

export interface QuotePricing {
  installation: 'Yes' | 'No';
  installationPrice: number;
  installationIncluded: string;
  installationIsTaxable: boolean;
  texasSalesTax: 'Yes' | 'No';
  taxZipCode: string;
  taxRate: number;
}

export interface QuoteState {
  id?: string;
  logo: string;
  quoteNumber: string;
  client: {
    name: string;
    number: string;
    email: string;
    address: string;
    signatureName: string;
    signatureTitle: string;
  };
  greenMainland: {
    name: string;
    title: string;
  };
  products: QuoteProduct[];
  pricing: QuotePricing;
  discounts: QuoteDiscount[];
  automatedDiscounts: {
    contractor: boolean;
    bulk: boolean;
    partner: boolean;
  };
  additionalTerms: {
    id: number;
    title: string;
    content: string;
  }[];
  totals: {
    productTotal: number;
    subtotal: number;
    tax: number;
    grandTotal: number;
    contractorDiscountCalculated?: { name: string; amount: number } | null;
    bulkDiscountCalculated?: { name: string; amount: number } | null;
    partnerDiscountCalculated?: { name: string; amount: number } | null;
  };
}
