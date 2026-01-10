export const GOAL_CONFIGS = {
  sales: [
    { id: 'reviews', name: 'Monthly Reviews', target: 10, type: 'link' },
    { id: 'meetings', name: 'Monthly Out of office meetings', target: 10, type: 'meeting' },
    { id: 'businesses', name: 'Monthly New Businesses Contacted', target: 25, type: 'business' },
    { id: 'outboundVolume', name: 'Monthly Outbound Volume', target: 750, type: 'volume' },
    { id: 'totalSales', name: 'Total Sales Goal', target: 100000, type: 'sale', isCurrency: true },
    { id: 'partners', name: 'Monthly partner accounts', target: 1, type: 'partner' }
  ],
  marketing: [
    { id: 'videos', name: 'Monthly videos', target: 30, type: 'link' },
    { id: 'subscribers', name: 'Monthly news letter subscribers', target: 10, type: 'congrats' },
    { id: 'facebookPosts', name: 'Monthly Facebook blog posts', target: 10, type: 'link' },
    { id: 'linkedinPosts', name: 'Monthly Linked-in blog posts', target: 10, type: 'link' },
    { id: 'faqPosts', name: 'Monthly FAQ question update', target: 5, type: 'link' }
  ]
};

export const INITIAL_MATERIALS = [
  { name: 'Aluminum', description: 'Thermally broken aluminum profiles.', multiplier: 1 },
  { name: 'Aluminum Hurricane', description: 'Hurricane-rated aluminum profiles (FBC)', multiplier: 1.4 },
  { name: 'Luxury Pivot', description: 'Special order, high-end thermal profiles', multiplier: 2 },
  { name: 'Galvanized Steel', description: 'Heavy duty, thermally broken steel profiles', multiplier: 4 },
  { name: 'Burnished Brass', description: 'Aesthetic, custom finished, thermally broken profiles', multiplier: 8 },
  { name: 'Made in U.S.A.', description: 'Premium, domestic production, thermally broken profiled', multiplier: 5 },
  { name: 'Corton Steel', description: 'Weathering steel with rustic finish, thermally broken profiles', multiplier: 8.5 },
  { name: 'Italian', description: 'Premium Italian craftsmanship, hurricane or secure door', multiplier: 7 },
  { name: 'Artisan', description: 'Custom artisan work - quote only', multiplier: 0 },
  { name: 'U.S. Garage', description: 'Luxury garage door material, domestic', multiplier: 1 },
  { name: 'European Vinyl', description: 'European vinyl profiles, thermally broken, best overall performance', multiplier: 0.7 }
];

export const INITIAL_PRODUCT_TYPES = [
  { name: 'Bi-fold door', category: 'Door', hasHurricaneOption: true, pricingKey: 'bifoldDoor', availableMaterials: ['Aluminum', 'Aluminum Hurricane', 'Galvanized Steel', 'Burnished Brass', 'Made in U.S.A.', 'Corton Steel', 'European Vinyl'] },
  { name: 'Bi-fold window', category: 'Window', hasHurricaneOption: true, pricingKey: 'bifoldWindow', availableMaterials: ['Aluminum', 'Aluminum Hurricane', 'Galvanized Steel', 'Burnished Brass', 'Made in U.S.A.', 'Corton Steel', 'European Vinyl'] },
  { name: 'Sliding Door', category: 'Door', hasHurricaneOption: true, pricingKey: 'slidingDoor', availableMaterials: ['Aluminum', 'Aluminum Hurricane', 'Galvanized Steel', 'Burnished Brass', 'Made in U.S.A.', 'Corton Steel', 'European Vinyl'] },
  { name: 'Sliding Window', category: 'Window', hasHurricaneOption: true, pricingKey: 'slidingWindow', availableMaterials: ['Aluminum', 'Aluminum Hurricane', 'Galvanized Steel', 'Burnished Brass', 'Made in U.S.A.', 'Corton Steel', 'European Vinyl'] },
  { name: 'Panel Pivot Door', category: 'Door', hasHurricaneOption: true, pricingKey: 'panelPivotDoor', availableMaterials: ['Aluminum', 'Galvanized Steel', 'Burnished Brass', 'Made in U.S.A.', 'Corton Steel', 'Italian', 'Artisan'] },
  { name: 'Panel Swing Door', category: 'Door', hasHurricaneOption: false, pricingKey: 'panelSwingDoor', availableMaterials: ['Aluminum', 'Aluminum Hurricane', 'Luxury Pivot', 'Galvanized Steel', 'Burnished Brass', 'Made in U.S.A.', 'Corton Steel', 'Italian', 'Artisan', 'European Vinyl'] },
  { name: 'Glass Pivot Door', category: 'Door', hasHurricaneOption: false, pricingKey: 'glassPivotDoor', availableMaterials: ['Aluminum', 'Luxury Pivot', 'Galvanized Steel', 'Burnished Brass', 'Made in U.S.A.', 'Corton Steel', 'Italian', 'Artisan'] },
  { name: 'Glass Swing Door', category: 'Door', hasHurricaneOption: false, pricingKey: 'glassSwingDoor', availableMaterials: ['Aluminum', 'Aluminum Hurricane', 'Luxury Pivot', 'Galvanized Steel', 'Burnished Brass', 'Made in U.S.A.', 'Corton Steel', 'Italian', 'Artisan', 'European Vinyl'] },
  { name: 'Glass French Door', category: 'Door', hasHurricaneOption: true, pricingKey: 'glassFrenchDoor', availableMaterials: ['Aluminum', 'Aluminum Hurricane', 'Galvanized Steel', 'Burnished Brass', 'Made in U.S.A.', 'Corton Steel', 'Italian', 'Artisan', 'European Vinyl'] },
  { name: 'Interior System', category: 'Other', hasHurricaneOption: false, pricingKey: 'interiorSystem', availableMaterials: ['Aluminum', 'Aluminum Hurricane', 'Galvanized Steel', 'Burnished Brass', 'Made in U.S.A.', 'Corton Steel', 'European Vinyl'] },
  { name: 'Casement Window', category: 'Window', hasHurricaneOption: true, pricingKey: 'casementWindow', availableMaterials: ['Aluminum', 'Aluminum Hurricane', 'Galvanized Steel', 'Burnished Brass', 'Made in U.S.A.', 'Corton Steel', 'European Vinyl'] },
  { name: 'Awning Window', category: 'Window', hasHurricaneOption: true, pricingKey: 'awningWindow', availableMaterials: ['Aluminum', 'Aluminum Hurricane', 'Galvanized Steel', 'Burnished Brass', 'Made in U.S.A.', 'Corton Steel', 'European Vinyl'] },
  { name: 'Fixed Glass', category: 'Window', hasHurricaneOption: false, pricingKey: 'fixedGlass', availableMaterials: ['Aluminum', 'Aluminum Hurricane', 'Luxury Pivot', 'Galvanized Steel', 'Burnished Brass', 'Made in U.S.A.', 'Corton Steel', 'Italian', 'Artisan', 'European Vinyl'] },
  { name: 'Garage Door', category: 'Other', hasHurricaneOption: false, pricingKey: 'fixedGlass', availableMaterials: ['Aluminum', 'U.S. Garage'] }
];

export const SALES_TAX_RATES: Record<string, { low: number, high: number }> = {
  'AL': { low: 4.00, high: 11.50 }, 'AK': { low: 0.00, high: 7.85 }, 'AZ': { low: 5.60, high: 11.20 },
  'AR': { low: 6.50, high: 11.625 }, 'CA': { low: 7.25, high: 10.75 }, 'CO': { low: 2.90, high: 8.84 },
  'CT': { low: 6.35, high: 6.35 }, 'DE': { low: 0.00, high: 0.00 }, 'DC': { low: 6.00, high: 6.00 },
  'FL': { low: 6.00, high: 8.50 }, 'GA': { low: 4.00, high: 9.00 }, 'HI': { low: 4.00, high: 4.50 },
  'ID': { low: 6.00, high: 9.00 }, 'IL': { low: 6.25, high: 11.50 }, 'IN': { low: 7.00, high: 7.00 },
  'IA': { low: 6.00, high: 7.00 }, 'KS': { low: 6.50, high: 10.50 }, 'KY': { low: 6.00, high: 6.00 },
  'LA': { low: 4.45, high: 11.45 }, 'ME': { low: 5.50, high: 5.50 }, 'MD': { low: 6.00, high: 6.00 },
  'MA': { low: 6.25, high: 6.25 }, 'MI': { low: 6.00, high: 6.00 }, 'MN': { low: 6.875, high: 8.875 },
  'MS': { low: 7.00, high: 7.25 }, 'MO': { low: 4.225, high: 10.60 }, 'MT': { low: 0.00, high: 0.00 },
  'NE': { low: 5.50, high: 7.75 }, 'NV': { low: 6.85, high: 8.375 }, 'NH': { low: 0.00, high: 0.00 },
  'NJ': { low: 6.625, high: 6.625 }, 'NM': { low: 5.125, high: 9.475 }, 'NY': { low: 4.00, high: 8.875 },
  'NC': { low: 4.75, high: 7.75 }, 'ND': { low: 5.00, high: 8.50 }, 'OH': { low: 5.75, high: 8.00 },
  'OK': { low: 4.50, high: 11.50 }, 'OR': { low: 0.00, high: 0.00 }, 'PA': { low: 6.00, high: 8.00 },
  'RI': { low: 7.00, high: 7.00 }, 'SC': { low: 6.00, high: 9.00 }, 'SD': { low: 4.50, high: 6.50 },
  'TN': { low: 7.00, high: 9.75 }, 'TX': { low: 6.25, high: 8.25 }, 'UT': { low: 6.10, high: 9.05 },
  'VT': { low: 6.00, high: 7.00 }, 'VA': { low: 5.30, high: 7.00 }, 'WA': { low: 6.50, high: 10.50 },
  'WV': { low: 6.00, high: 7.00 }, 'WI': { low: 5.00, high: 5.60 }, 'WY': { low: 4.00, high: 6.00 }
};

