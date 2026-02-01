import React, { useState, useEffect } from 'react';
import { fetchWithRetry } from '../services/marketApi';
import { Filter, Search, RotateCw, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getMarketPredictions, getCropRecommendations, PricePrediction, CropRecommendation } from '../services/predictionService';
import { Sprout, Calendar, DollarSign, BrainCircuit, Sparkles } from 'lucide-react';


interface MarketData {
    commodity: string;
    variety: string;
    min_price: number;
    max_price: number;
    modal_price: number;
    arrival_quantity: number;
    category: string;
    priceRange: number;
    priceChangePercent: number | string;
    date: string;
}

const MarketPlace: React.FC = () => {
    const { t } = useLanguage();
    const [data, setData] = useState<MarketData[]>([]);
    const [filteredData, setFilteredData] = useState<MarketData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    // AI Prediction State
    const [predictions, setPredictions] = useState<PricePrediction[]>([]);
    const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
    const [loadingPredictions, setLoadingPredictions] = useState<boolean>(false);
    const [showPredictions, setShowPredictions] = useState<boolean>(false);

    // Categories as requested
    const categories = [
        { id: 'all', label: t('market.categories.all') },
        { id: 'crop', label: t('market.categories.crops') },
        { id: 'vegetables', label: t('market.categories.vegetables') },
        { id: 'oilseeds', label: t('market.categories.oilseeds') }, // Mapped oil to oilseeds
        { id: 'cereal', label: t('market.categories.cereal') },
        { id: 'fruits', label: t('market.categories.fruits') }
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetching data for Gujarat generally, or we could use user's location
            const result = await fetchWithRetry({ state: 'Gujarat', limit: 50 });
            if (result && result.data) {
                setData(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch market data", error);
        } finally {
            setLoading(false);
            setLastUpdated(new Date());
        }
    };

    const generatePredictions = async () => {
        setLoadingPredictions(true);
        setShowPredictions(true);
        try {
            // Get top commodities from current data for prediction
            const topCommodities = [...new Set(data.slice(0, 5).map(item => item.commodity))];

            const [predData, recData] = await Promise.all([
                getMarketPredictions(topCommodities.length > 0 ? topCommodities : ['Wheat', 'Rice', 'Cotton', 'Onion']),
                getCropRecommendations(new Date().toLocaleString('default', { month: 'long' }))
            ]);

            setPredictions(predData);
            setRecommendations(recData);
        } catch (error) {
            console.error("Failed to generate predictions", error);
        } finally {
            setLoadingPredictions(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let result = data;

        // Apply Category Filter
        if (categoryFilter !== 'all') {
            result = result.filter(item => {
                if (categoryFilter === 'oilseeds') return item.category === 'oilseeds';
                if (categoryFilter === 'cereal') return item.category === 'cereal' || item.category === 'crops'; // Cereals often categorized as crops
                return item.category === categoryFilter;
            });
        }

        // Apply Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.commodity.toLowerCase().includes(lowerTerm) ||
                item.variety.toLowerCase().includes(lowerTerm)
            );
        }

        setFilteredData(result);
    }, [categoryFilter, searchTerm, data]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-blue-600 tracking-tight">{t('market.title')}</h1>
                    <p className="text-gray-500 mt-1">{t('market.subtitle')}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>{t('market.updated')}: {lastUpdated.toLocaleTimeString()}</span>
                </div>
            </div>

            {/* Filters & Controls */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">

                {/* Search */}
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder={t('market.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    />
                </div>

                {/* Category Filter - Styled as requested */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 border border-black rounded-lg bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-full md:w-48 appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto' }}
                    >
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-left text-sm font-bold text-green-600 uppercase tracking-wider">
                                    {t('market.table.name')}
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-red-500 uppercase tracking-wider">
                                    {t('market.table.qty')}
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-blue-500 uppercase tracking-wider">
                                    {t('market.table.min')}
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-green-600 uppercase tracking-wider">
                                    {t('market.table.max')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                // Skeleton Loading State
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                    </tr>
                                ))
                            ) : filteredData.length > 0 ? (
                                // Actual Data
                                filteredData.map((item, index) => (
                                    <tr
                                        key={`${item.commodity}-${index}`}
                                        className="hover:bg-blue-50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">{item.commodity}</div>
                                                    <div className="text-xs text-gray-500">{item.variety}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-red-500">
                                                {item.arrival_quantity} <span className="text-xs text-gray-400">Qt.</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-blue-600">
                                                ₹{item.min_price}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="text-sm font-bold text-green-600">₹{item.max_price}</span>
                                                {/* Price trend indication - cosmetic for now */}
                                                {index % 3 === 0 ? (
                                                    <TrendingUp className="h-4 w-4 text-green-500 ml-2" />
                                                ) : (
                                                    <TrendingDown className="h-4 w-4 text-red-400 ml-2" />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                // Empty State
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Search className="h-12 w-12 text-gray-300 mb-2" />
                                            <p>{t('market.no_data')}</p>
                                            <button onClick={fetchData} className="mt-4 text-blue-500 hover:underline flex items-center gap-1">
                                                <RotateCw className="h-4 w-4" /> {t('market.reload')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI Predictions Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm border border-indigo-100 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
                            <BrainCircuit className="h-6 w-6 text-indigo-600" />
                            {t('market.ai_insights') || "AI Market Insights"}
                        </h2>
                        <p className="text-indigo-600/80 mt-1">
                            {t('market.ai_subtitle') || "Powered by advanced agricultural algorithms to help you decide better."}
                        </p>
                    </div>
                    {!showPredictions && (
                        <button
                            onClick={generatePredictions}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-all font-medium flex items-center gap-2 shadow-lg shadow-indigo-200"
                        >
                            <Sparkles className="h-5 w-5" />
                            {t('market.generate_predictions') || "Generate Forecast"}
                        </button>
                    )}
                </div>

                {showPredictions && loadingPredictions && (
                    <div className="py-12 flex flex-col items-center justify-center text-indigo-400">
                        <RefreshCw className="h-10 w-10 animate-spin mb-4" />
                        <p className="text-lg animate-pulse">Analyzing market trends...</p>
                    </div>
                )}

                {showPredictions && !loadingPredictions && (
                    <div className="space-y-8 animate-fade-in">

                        {/* Price Trends */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-gray-500" />
                                Price Forecast (Next 30 Days)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {predictions.map((pred, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border border-gray-100"
                                        style={{ borderLeftColor: pred.trend === 'up' ? '#10B981' : pred.trend === 'down' ? '#EF4444' : '#F59E0B' }}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-gray-800">{pred.commodity}</h4>
                                            {pred.trend === 'up' && <TrendingUp className="h-5 w-5 text-green-500" />}
                                            {pred.trend === 'down' && <TrendingDown className="h-5 w-5 text-red-500" />}
                                            {pred.trend === 'stable' && <RefreshCw className="h-4 w-4 text-yellow-500" />}
                                        </div>
                                        <div className="text-sm font-medium mb-1">
                                            Trend: <span className={`${pred.trend === 'up' ? 'text-green-600' : pred.trend === 'down' ? 'text-red-600' : 'text-yellow-600'} capitalize`}>
                                                {pred.trend} {pred.percentageChange && `(${pred.percentageChange})`}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 italic">"{pred.reason}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Smart Recommendations */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Sprout className="h-5 w-5 text-green-600" />
                                Smart Planting Recommendations
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {recommendations.map((rec, idx) => (
                                    <div key={idx} className="bg-gradient-to-b from-white to-green-50/30 p-5 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-green-200 transition-colors">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Sprout className="h-24 w-24 text-green-500" />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-xl font-bold text-green-800 mb-3">{rec.crop}</h4>
                                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                                    {rec.potentialProfit} Profit
                                                </span>
                                            </div>

                                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-green-600" />
                                                    <span>Plant: {rec.plantingWindow}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-green-600" />
                                                    <span>Harvest: {rec.estimatedHarvest}</span>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-700 bg-white/60 p-3 rounded-lg border border-green-100">
                                                {rec.reason}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketPlace;
