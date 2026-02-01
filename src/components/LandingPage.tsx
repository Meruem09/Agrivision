import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Satellite, BarChart3, ShieldCheck, Map as MapIcon } from 'lucide-react';


const LandingPage: React.FC = () => {
    const navigate = useNavigate();


    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-green-50 via-emerald-50 to-teal-50">
                {/* Simple Header */}
                <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-green-600 p-2 rounded-xl">
                            <Satellite className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">CropCare</span>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-all shadow-md"
                    >
                        Get Started
                    </button>
                </div>

                {/* Decorative birds */}
                <svg className="absolute top-32 left-20 w-8 h-8 text-gray-800 opacity-40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.5 12c0 0 2.5-5 7-5s7 5 7 5-2.5 5-7 5-7-5-7-5z" />
                </svg>
                <svg className="absolute top-40 left-32 w-6 h-6 text-gray-800 opacity-30" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.5 12c0 0 2.5-5 7-5s7 5 7 5-2.5 5-7 5-7-5-7-5z" />
                </svg>
                <svg className="absolute top-28 right-32 w-7 h-7 text-gray-800 opacity-35" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.5 12c0 0 2.5-5 7-5s7 5 7 5-2.5 5-7 5-7-5-7-5z" />
                </svg>

                {/* Content Container */}
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                        Trusted Digital Partner<br />for Farming Success
                    </h1>

                    <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto font-medium">
                        An agri-tech platform helping farmers reduce risks and increase profits.<br className="hidden md:block" />
                        Built with trust, reliable data, and simple tools
                    </p>

                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-semibold text-base transition-all shadow-lg inline-flex items-center gap-2"
                    >

                        Grow Smarter
                    </button>

                    {/* Illustration */}
                    <div className="mt-16 relative">
                        {/* Ground/Field */}
                        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-green-400 via-green-300 to-transparent rounded-t-full"></div>

                        {/* Farmer Illustrations */}
                        <div className="flex justify-center items-end -space-x-4 relative z-10 pb-8">
                            {/* Female Farmer */}
                            <div className="relative z-10">
                                <svg className="w-48 h-60 md:w-60 md:h-72" viewBox="0 0 180 280" fill="none">
                                    {/* Shadow */}
                                    <ellipse cx="90" cy="265" rx="40" ry="8" fill="#2E7D32" opacity="0.3" />

                                    {/* Saree Bottom (Pink) */}
                                    <path d="M65 170 Q60 260 70 260 L110 260 Q120 260 115 170" fill="#C2185B" />
                                    <path d="M65 170 L115 170 L120 260 L60 260 Z" fill="#D81B60" />

                                    {/* Saree Pleats/Detail */}
                                    <path d="M85 170 L80 260 M95 170 L100 260" stroke="#AD1457" strokeWidth="1" />

                                    {/* Blouse/Upper Body (Yellow/Orange) */}
                                    <path d="M70 110 Q65 140 70 170 L110 170 Q115 140 110 110" fill="#FFB300" />
                                    <path d="M70 170 L110 170 L110 130 Q90 180 70 130 Z" fill="#FFA000" />

                                    {/* Neck/Skin */}
                                    <rect x="82" y="90" width="16" height="25" fill="#A16E5C" />

                                    {/* Head */}
                                    <ellipse cx="90" cy="80" rx="20" ry="24" fill="#A16E5C" />

                                    {/* Hair (Bun) */}
                                    <circle cx="90" cy="75" r="23" fill="#212121" />
                                    <circle cx="108" cy="85" r="10" fill="#212121" /> {/* Bun side */}

                                    {/* Facial Features */}
                                    <circle cx="90" cy="72" r="1.5" fill="#C62828" /> {/* Bindi */}
                                    <path d="M84 80 Q90 85 96 80" stroke="#3E2723" strokeWidth="1.5" fill="none" /> {/* Smile */}
                                    <circle cx="82" cy="75" r="1.5" fill="#1A1A1A" />
                                    <circle cx="98" cy="75" r="1.5" fill="#1A1A1A" />

                                    {/* Arms holding Pot */}
                                    <path d="M70 130 Q60 150 70 170" stroke="#A16E5C" strokeWidth="10" strokeLinecap="round" />
                                    <path d="M110 130 Q120 150 110 170" stroke="#A16E5C" strokeWidth="10" strokeLinecap="round" />

                                    {/* Clay Pot */}
                                    <circle cx="90" cy="175" r="25" fill="#795548" />
                                    <ellipse cx="90" cy="155" rx="15" ry="5" fill="#5D4037" /> {/* Pot rim */}
                                    <path d="M75 160 Q90 190 105 160" fill="#8D6E63" opacity="0.3" />
                                </svg>
                            </div>

                            {/* Male Farmer */}
                            <div className="relative">
                                <svg className="w-52 h-64 md:w-64 md:h-80" viewBox="0 0 180 280" fill="none">
                                    {/* Shadow */}
                                    <ellipse cx="90" cy="265" rx="40" ry="8" fill="#2E7D32" opacity="0.3" />

                                    {/* Pants (Dark) */}
                                    <path d="M75 180 L72 255 Q72 260 77 260 L83 260 Q88 260 88 255 L85 180" fill="#263238" />
                                    <path d="M105 180 L108 255 Q108 260 103 260 L97 260 Q92 260 92 255 L95 180" fill="#263238" />

                                    {/* Kurta (Red) */}
                                    <path d="M65 95 L115 95 L120 190 L60 190 Z" fill="#E53935" />
                                    <rect x="88" y="95" width="4" height="95" fill="#C62828" opacity="0.3" /> {/* Placket */}

                                    {/* Neck/Skin */}
                                    <rect x="83" y="80" width="14" height="20" fill="#A16E5C" />

                                    {/* Head */}
                                    <ellipse cx="90" cy="70" rx="20" ry="24" fill="#A16E5C" />

                                    {/* Turban (Green) */}
                                    <path d="M65 65 Q65 45 90 40 Q115 45 115 65 Q115 75 105 75 L75 75 Q65 75 65 65 Z" fill="#2E7D32" />
                                    <path d="M70 60 Q90 50 110 60" stroke="#1B5E20" strokeWidth="2" fill="none" />
                                    <path d="M75 50 Q90 40 105 50" stroke="#1B5E20" strokeWidth="2" fill="none" />

                                    {/* Facial Features */}
                                    <path d="M82 78 Q90 80 98 78" stroke="#1A1A1A" strokeWidth="2" fill="none" /> {/* Mustache */}
                                    <circle cx="82" cy="68" r="1.5" fill="#1A1A1A" />
                                    <circle cx="98" cy="68" r="1.5" fill="#1A1A1A" />

                                    {/* Arms */}
                                    <path d="M65 110 Q50 130 55 160" stroke="#E53935" strokeWidth="12" strokeLinecap="round" />
                                    <path d="M115 110 Q130 130 125 160" stroke="#E53935" strokeWidth="12" strokeLinecap="round" />

                                    {/* Hands */}
                                    <circle cx="55" cy="165" r="7" fill="#A16E5C" />
                                    <circle cx="125" cy="165" r="7" fill="#A16E5C" />

                                    {/* Crate (Wood) */}
                                    <rect x="50" y="150" width="80" height="40" rx="2" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" />
                                    <line x1="50" y1="162" x2="130" y2="162" stroke="#5D4037" strokeWidth="1" />
                                    <line x1="50" y1="174" x2="130" y2="174" stroke="#5D4037" strokeWidth="1" />

                                    {/* Vegetables in Crate */}
                                    {/* Pumpkin */}
                                    <circle cx="90" cy="140" r="12" fill="#FB8C00" />
                                    <path d="M90 128 L90 135" stroke="#388E3C" strokeWidth="3" />

                                    {/* Greens/Leaves */}
                                    <path d="M65 145 Q60 130 70 135 Q75 145 65 145" fill="#4CAF50" />
                                    <path d="M75 145 Q80 125 85 140" fill="#66BB6A" />

                                    {/* Beetroot/Radish */}
                                    <circle cx="115" cy="142" r="8" fill="#AD1457" />
                                    <path d="M115 134 L112 125 M115 134 L118 125" stroke="#4CAF50" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>

                        {/* Decorative plants */}
                        <div className="absolute bottom-4 left-8 md:left-24 flex gap-2">
                            <div className="relative">
                                <div className="w-1 h-12 bg-green-800 rounded-t-full"></div>
                                <div className="absolute top-2 -left-1 w-3 h-3 bg-green-700 rounded-full"></div>
                                <div className="absolute top-5 -right-1 w-2 h-2 bg-green-700 rounded-full"></div>
                            </div>
                            <div className="relative mt-4">
                                <div className="w-1 h-8 bg-green-800 rounded-t-full"></div>
                                <div className="absolute top-1 -left-1 w-2 h-2 bg-green-700 rounded-full"></div>
                            </div>
                        </div>
                        <div className="absolute bottom-8 right-12 md:right-28 flex gap-1">
                            <div className="relative">
                                <div className="w-1 h-10 bg-green-800 rounded-t-full"></div>
                                <div className="absolute top-3 -left-1 w-2 h-2 bg-green-700 rounded-full"></div>
                                <div className="absolute top-6 -right-1 w-2 h-2 bg-green-700 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom wave transition */}
                <div className="absolute bottom-0 w-full">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
                    </svg>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h3 className="text-green-600 font-bold tracking-wider uppercase text-sm mb-2">Why Choose CropCare?</h3>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Empowering Farmers with Technology</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Feature 1 */}
                    <div className="bg-green-50 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300 border border-green-100">
                        <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                            <MapIcon className="h-7 w-7 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Satellite Monitoring</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Track vegetation health indices (NDVI, EVI) remotely using the latest Sentinel-2 satellite data.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-blue-50 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300 border border-blue-100">
                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                            <BarChart3 className="h-7 w-7 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Data-Driven Insights</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Get actionable analysis on water stress, crop growth stages, and potential yield predictions.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-orange-50 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300 border border-orange-100">
                        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck className="h-7 w-7 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">AI Advisory</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Receive personalized pest alerts and farming advice powered by advanced AI algorithms.
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-900 text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your farming?</h2>
                    <p className="text-gray-400 text-lg mb-8">Join thousands of farmers using CropCare to make smarter decisions.</p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-10 py-4 bg-green-500 hover:bg-green-400 text-gray-900 rounded-full font-bold text-lg shadow-lg hover:shadow-green-500/20 transition-all transform hover:-translate-y-1"
                    >
                        Create Free Account
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-green-600 p-1.5 rounded-lg">
                            <Satellite className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">CropCare</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">Privacy</a>
                        <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">Terms</a>
                        <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;