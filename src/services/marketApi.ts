// ============================================
// DATA.GOV.IN API INTEGRATION
// Resource ID: 35985678-0d79-46b4-9ed6-6f13308a1d24
// ============================================

import axios from 'axios';

// Your API configuration
const DATA_GOV_CONFIG = {
    baseUrl: 'https://api.data.gov.in/resource',
    resourceId: '35985678-0d79-46b4-9ed6-6f13308a1d24',
    apiKey: 'YOUR_API_KEY_HERE', // Replace with your actual API key from data.gov.in
    format: 'json'
};

// ============================================
// MAIN FUNCTION TO FETCH MARKET PRICES
// ============================================

/**
 * Fetch market prices from data.gov.in
 * @param {Object} params - Query parameters
 * @param {string} params.state - State name (e.g., "Gujarat")
 * @param {string} params.district - District name (e.g., "Ahmedabad")
 * @param {string} params.market - Market name (optional)
 * @param {string} params.commodity - Commodity name (optional)
 * @param {number} params.limit - Number of records to fetch (default: 100)
 * @returns {Promise<Array>} Array of market price records
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchMarketPrices = async (params: any = {}) => {
    const {
        state = null,
        district = null,
        market = null,
        commodity = null,
        limit = 100,
        offset = 0
    } = params;

    try {
        // Build the API URL
        const url = `${DATA_GOV_CONFIG.baseUrl}/${DATA_GOV_CONFIG.resourceId}`;

        // Build query parameters
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const queryParams: any = {
            'api-key': DATA_GOV_CONFIG.apiKey,
            format: DATA_GOV_CONFIG.format,
            limit: limit,
            offset: offset
        };

        // Add filters if provided
        const filters = [];
        if (state) filters.push(`state:${state}`);
        if (district) filters.push(`district:${district}`);
        if (market) filters.push(`market:${market}`);
        if (commodity) filters.push(`commodity:${commodity}`);

        if (filters.length > 0) {
            queryParams.filters = filters.join(',');
        }

        // Make the API request
        console.log('Fetching from:', url);
        console.log('With params:', queryParams);

        const response = await axios.get(url, { params: queryParams });

        // Check if response is successful
        if (response.data && response.data.records) {
            console.log(`✓ Fetched ${response.data.records.length} records`);
            return processMarketData(response.data.records);
        }

        return [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error fetching market prices:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
};

// ============================================
// PROCESS AND FORMAT THE DATA
// ============================================

/**
 * Process raw data from API into usable format
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processMarketData = (records: any[]) => {
    return records.map(record => {
        // Parse prices (they might come as strings)
        const minPrice = parseFloat(record.min_price || record.Min_Price || 0);
        const maxPrice = parseFloat(record.max_price || record.Max_Price || 0);
        const modalPrice = parseFloat(record.modal_price || record.Modal_Price || (minPrice + maxPrice) / 2);
        const arrivalQty = parseFloat(record.arrival_to_mandi || record.arrivals_in_qtl || 0);

        return {
            // Basic info
            commodity: record.commodity || record.Commodity || 'Unknown',
            variety: record.variety || record.Variety || 'Local',

            // Location
            state: record.state || record.State || '',
            district: record.district || record.District || '',
            market: record.market || record.Market || '',

            // Prices (in ₹ per quintal)
            min_price: minPrice,
            max_price: maxPrice,
            modal_price: modalPrice,

            // Quantity
            arrival_quantity: arrivalQty,

            // Date
            date: record.price_date || record.Price_Date || new Date().toLocaleDateString('en-IN'),

            // Additional computed fields
            priceRange: maxPrice - minPrice,
            priceChangePercent: minPrice > 0 ? ((maxPrice - minPrice) / minPrice * 100).toFixed(1) : 0,

            // Category (will be added by your classification function)
            category: getCommodityCategory(record.commodity || record.Commodity || '')
        };
    });
};

// ============================================
// COMMODITY CLASSIFICATION
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commodityMapping: any = {
    crops: ['Wheat', 'Rice', 'Paddy', 'Maize', 'Bajra', 'Jowar', 'Barley', 'Ragi'],
    vegetables: ['Tomato', 'Potato', 'Onion', 'Cabbage', 'Cauliflower', 'Brinjal', 'Carrot', 'Beetroot', 'Radish', 'Capsicum', 'Green Peas', 'Beans', 'Okra', 'Bitter Gourd'],
    fruits: ['Mango', 'Apple', 'Banana', 'Grapes', 'Orange', 'Papaya', 'Pomegranate', 'Watermelon', 'Guava', 'Pineapple', 'Coconut'],
    spices: ['Turmeric', 'Chilli', 'Dry Chilli', 'Coriander', 'Cumin', 'Pepper', 'Garlic', 'Ginger', 'Fenugreek', 'Cardamom'],
    oilseeds: ['Groundnut', 'Mustard', 'Soybean', 'Sunflower', 'Sesame', 'Castor Seed', 'Cotton Seed', 'Linseed', 'Niger Seed'],
    pulses: ['Chana', 'Tur', 'Moong', 'Urad', 'Masoor', 'Gram', 'Arhar', 'Lentil', 'Pigeon Pea'],
    cereal: ['Wheat', 'Rice', 'Maize', 'Bajra', 'Jowar', 'Barley'] // Adding cereal as per request sketch, though overlaps with crops
};

const getCommodityCategory = (commodityName: string) => {
    const name = commodityName.toLowerCase();

    for (const [category, items] of Object.entries(commodityMapping)) {
        if ((items as string[]).some(item => name.includes(item.toLowerCase()))) {
            return category;
        }
    }

    return 'crops'; // default category
};

// ============================================
// HELPER FUNCTIONS FOR SPECIFIC QUERIES
// ============================================

/**
 * Get prices for a specific state and district
 */
export const getPricesByLocation = async (state: string, district: string) => {
    return await fetchMarketPrices({ state, district, limit: 100 });
};

/**
 * Search for a specific commodity
 */
export const searchCommodity = async (commodityName: string, state: string | null = null) => {
    const params: { commodity: string; limit: number; state?: string } = { commodity: commodityName, limit: 50 };
    if (state) params.state = state;
    return await fetchMarketPrices(params);
};

/**
 * Get all commodities for a specific category
 */
export const getCommoditiesByCategory = async (category: string, state: string | null = null, district: string | null = null) => {
    const allData = await fetchMarketPrices({ state, district, limit: 500 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return allData.filter((item: any) => item.category === category);
};

/**
 * Get today's top prices
 */
export const getTopPrices = async (state: string, district: string, limit = 20) => {
    const data = await fetchMarketPrices({ state, district, limit: 500 });
    return data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .sort((a: any, b: any) => b.modal_price - a.modal_price)
        .slice(0, limit);
};

// ============================================
// ERROR HANDLING WRAPPER
// ============================================

/**
 * Fetch with automatic retry and fallback
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchWithRetry = async (params: any, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const data = await fetchMarketPrices(params);
            if (data && data.length > 0) {
                return { success: true, data, cached: false };
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(`Attempt ${i + 1} failed, retrying...`);
            if (i === retries - 1) {
                // Last attempt failed, return mock data
                console.log('All attempts failed, using mock data');
                return { success: false, data: getMockData(), cached: false, error: error.message };
            }
            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
};

// ============================================
// MOCK DATA FOR TESTING/FALLBACK
// ============================================

const getMockData = () => {
    return [
        { commodity: 'Wheat', variety: 'Lokwan', state: 'Gujarat', district: 'Ahmedabad', market: 'Ahmedabad', min_price: 2400, max_price: 2550, modal_price: 2475, arrival_quantity: 1250, category: 'crop', date: new Date().toLocaleDateString('en-IN'), priceRange: 150, priceChangePercent: 6.25 },
        { commodity: 'Rice', variety: 'Basmati', state: 'Gujarat', district: 'Ahmedabad', market: 'Ahmedabad', min_price: 3200, max_price: 3450, modal_price: 3325, arrival_quantity: 980, category: 'crop', date: new Date().toLocaleDateString('en-IN'), priceRange: 250, priceChangePercent: 7.8 },
        { commodity: 'Tomato', variety: 'Local', state: 'Gujarat', district: 'Ahmedabad', market: 'Ahmedabad', min_price: 1200, max_price: 1800, modal_price: 1500, arrival_quantity: 2500, category: 'vegetables', date: new Date().toLocaleDateString('en-IN'), priceRange: 600, priceChangePercent: 50 },
        { commodity: 'Potato', variety: 'Local', state: 'Gujarat', district: 'Ahmedabad', market: 'Ahmedabad', min_price: 800, max_price: 1100, modal_price: 950, arrival_quantity: 3200, category: 'vegetables', date: new Date().toLocaleDateString('en-IN'), priceRange: 300, priceChangePercent: 37.5 },
        { commodity: 'Onion', variety: 'Nasik', state: 'Gujarat', district: 'Ahmedabad', market: 'Ahmedabad', min_price: 1500, max_price: 2000, modal_price: 1750, arrival_quantity: 2800, category: 'vegetables', date: new Date().toLocaleDateString('en-IN'), priceRange: 500, priceChangePercent: 33.3 },
        { commodity: 'Cotton', variety: 'Hybrid', state: 'Gujarat', district: 'Rajkot', market: 'Rajkot', min_price: 5500, max_price: 6200, modal_price: 5800, arrival_quantity: 4500, category: 'crop', date: new Date().toLocaleDateString('en-IN'), priceRange: 700, priceChangePercent: 12.7 },
        { commodity: 'Groundnut', variety: 'Bold', state: 'Gujarat', district: 'Rajkot', market: 'Rajkot', min_price: 4800, max_price: 5200, modal_price: 5000, arrival_quantity: 1500, category: 'oilseeds', date: new Date().toLocaleDateString('en-IN'), priceRange: 400, priceChangePercent: 8.3 },
        { commodity: 'Mango', variety: 'Kesar', state: 'Gujarat', district: 'Junagadh', market: 'Junagadh', min_price: 4000, max_price: 6000, modal_price: 5000, arrival_quantity: 200, category: 'fruits', date: new Date().toLocaleDateString('en-IN'), priceRange: 2000, priceChangePercent: 50 },
        { commodity: 'Banana', variety: 'Robusta', state: 'Gujarat', district: 'Bharuch', market: 'Bharuch', min_price: 1200, max_price: 1500, modal_price: 1350, arrival_quantity: 3000, category: 'fruits', date: new Date().toLocaleDateString('en-IN'), priceRange: 300, priceChangePercent: 25 }
    ];
};

export default {
    fetchMarketPrices,
    getPricesByLocation,
    searchCommodity,
    getCommoditiesByCategory,
    getTopPrices,
    fetchWithRetry,
    DATA_GOV_CONFIG
};
