import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'gu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations = {
  en: {
    // Header
    'app.title': 'Gujarat AgriVision Platform',
    'nav.dashboard': 'Dashboard',
    'nav.map': 'Farm Map',
    'nav.alerts': 'Alerts',
    'nav.marketplace': 'Marketplace',
    'nav.advisory': 'Advisory',
    'nav.logout': 'Logout',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
    'common.success': 'Success',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.send': 'Send',
    'common.search': 'Search',

    // Login
    'login.title': 'Login to AgriVision',
    'login.subtitle': 'Welcome back, please enter your details.',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.signin': 'Sign In',
    'login.remember': 'Remember me',
    'login.forgot': 'Forgot password?',
    'login.no_account': "Don't have an account?",
    'login.signup': 'Sign up for free',
    'login.demo': 'Quick Demo Login',
    'login.farmer': 'Farmer',
    'login.admin': 'Admin',

    // Landing Page
    'landing.hero.title': 'AgriVision',
    'landing.hero.subtitle': 'Precision Farming from Space to Your Fingertips',
    'landing.hero.description': 'Monitor crop health, receive real-time weather alerts, and access AI-driven advisory services to maximize your yield.',
    'landing.hero.cta.start': 'Get Started Now',
    'landing.hero.cta.demo': 'View Demo',
    'landing.features.title': 'Why Choose AgriVision?',
    'landing.features.subtitle': 'Empowering Farmers with Technology',
    'landing.feature.satellite.title': 'Satellite Monitoring',
    'landing.feature.satellite.desc': 'Track vegetation health indices (NDVI, EVI) remotely using the latest Sentinel-2 satellite data.',
    'landing.feature.insights.title': 'Data-Driven Insights',
    'landing.feature.insights.desc': 'Get actionable analysis on water stress, crop growth stages, and potential yield predictions.',
    'landing.feature.advisory.title': 'AI Advisory',
    'landing.feature.advisory.desc': 'Receive personalized pest alerts and farming advice powered by advanced AI algorithms.',
    'landing.cta.title': 'Ready to transform your farming?',
    'landing.cta.subtitle': 'Join thousands of farmers using AgriVision to make smarter decisions.',
    'landing.cta.button': 'Create Free Account',
    'landing.footer.privacy': 'Privacy',
    'landing.footer.terms': 'Terms',
    'landing.footer.contact': 'Contact',

    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.farm.health': 'Farm Health Overview',
    'dashboard.recent.alerts': 'Recent Alerts',
    'dashboard.weather': 'Weather Information',
    'dashboard.recommendations': 'Recommendations',
    'dashboard.stats.area': 'Total Area',
    'dashboard.stats.ndvi': 'Avg NDVI',
    'dashboard.stats.alerts': 'Active Alerts',
    'dashboard.stats.irrigation': 'Irrigation Due',
    'dashboard.alerts.none': 'No recent alerts',

    // Crop Health
    'crop.healthy': 'Healthy',
    'crop.warning': 'Attention Needed',
    'crop.critical': 'Critical',
    'crop.wheat': 'Wheat',
    'crop.cotton': 'Cotton',
    'crop.rice': 'Rice',

    // Alerts
    'alert.water.stress': 'Water Stress Detected',
    'alert.nutrient.deficiency': 'Nutrient Deficiency',
    'alert.pest.risk': 'Pest Risk Alert',
    'alert.disease.detected': 'Disease Detected',
    'alerts.title': 'Alerts',
    'alerts.filter.all': 'All Alerts',
    'alerts.filter.unread': 'Unread',
    'alerts.filter.high': 'High Priority',
    'alerts.stats.total': 'Total Alerts',
    'alerts.stats.unread': 'Unread',
    'alerts.stats.high': 'High Priority',
    'alerts.stats.resolved': 'Resolved Today',
    'alerts.mark_read': 'Mark Read',
    'alerts.view_details': 'View Details',
    'alerts.recommended': 'Recommended Actions',
    'alerts.empty.all': 'All your fields are looking good!',
    'alerts.empty.unread': 'No unread alerts at the moment.',
    'alerts.empty.high': 'No high priority alerts currently.',

    // Map
    'map.title': 'Farm Field Monitoring',
    'map.ndvi': 'NDVI Index',
    'map.evi': 'EVI Index',
    'map.ndmi': 'NDMI Index',
    'map.satellite.date': 'Satellite Date',
    'map.index.label': 'Vegetation Index',
    'map.date.label': 'Satellite Date',
    'map.health.label': 'Health Status',
    'map.tools.label': 'Selection Tools',
    'map.tools.enable': 'Enable Drawing',
    'map.tools.enabled': 'Drawing Enabled',
    'map.tools.report': 'Generate Report',
    'map.tools.export': 'Export Data',
    'map.tools.hint': 'Use the toolbar on the map to draw rectangles, polygons, or circles to select and analyze specific areas',
    'map.selected.title': 'Selected Area',
    'map.selected.list': 'Selected Areas',
    'map.index.info': 'Index Information',
    'map.summary': 'Field Summary',

    // Recommendations
    'rec.irrigation': 'Increase irrigation frequency',
    'rec.fertilizer': 'Apply balanced fertilizer',
    'rec.pesticide': 'Consider pest control measures',
    'rec.harvest': 'Monitor for harvest readiness',

    // Index Interpretations
    'map.interpretation.ndvi.good': 'Vegetation is dense and healthy. No immediate action needed.',
    'map.interpretation.ndvi.moderate': 'Vegetation health is moderate. Check for early signs of stress.',
    'map.interpretation.ndvi.critical': 'Vegetation is stressed or sparse. Check for water/nutrient deficiency immediately.',

    'map.interpretation.evi.good': 'High canopy density and healthy growth.',
    'map.interpretation.evi.moderate': 'Moderate growth detected. Monitor field conditions.',
    'map.interpretation.evi.critical': 'Poor growth or bare soil detected. Needs attention.',

    'map.interpretation.ndmi.good': 'Optimal moisture levels. No irrigation needed currently.',
    'map.interpretation.ndmi.moderate': 'Moderate moisture. Plan for irrigation soon.',
    'map.interpretation.ndmi.critical': 'Severe water stress. Immediate irrigation recommended.',

    // Marketplace
    'market.title': 'MARKET PLACE',
    'market.subtitle': 'Real-time agricultural commodity prices',
    'market.updated': 'Updated',
    'market.search': 'Search commodity (e.g. Wheat, Tomato)...',
    'market.no_data': 'No market data found for your filters.',
    'market.reload': 'Try Reloading',
    'market.table.name': 'Name',
    'market.table.qty': 'Qty.',
    'market.table.min': 'Min Price',
    'market.table.max': 'Max Price',
    'market.categories.all': 'All Commodities',
    'market.categories.crops': 'Crops',
    'market.categories.vegetables': 'Vegetables',
    'market.categories.oilseeds': 'Oil/Oilseeds',
    'market.categories.cereal': 'Cereal',
    'market.categories.fruits': 'Fruits',

    // Advisory
    'advisory.human.title': 'Human Advisory',
    'advisory.ai.title': 'AI Assistant',
    'advisory.ask_expert': 'Ask an Expert',
    'advisory.placeholder': 'Type your query for an agricultural expert...',
    'advisory.submit': 'Submit Query',
    'advisory.helplines': 'Toll-Free Helplines',
    'advisory.ai.tap_speak': 'Tap to speak',
    'advisory.ai.tap_stop': 'Tap to stop',
    'advisory.ai.listening': 'Listening...',

    // Admin Dashboard
    'admin.title': 'Gujarat Agricultural Monitoring System',
    'admin.subtitle': 'Regional crop health overview and analytics',
    'admin.district': 'Selected District',
    'admin.stats.farmers': 'Total Farmers',
    'admin.stats.area': 'Total Area (ha)',
    'admin.stats.alerts': 'Active Alerts',
    'admin.stats.healthy': 'Healthy Fields',
    'admin.stats.ndvi': 'Avg NDVI',
    'admin.crop.dist': 'Crop Distribution',
    'admin.health.status': 'Field Health Status',
    'admin.reports.title': 'Recent Reports',
    'admin.reports.export': 'Export Data',
    'admin.reports.table.title': 'Report Title',
    'admin.reports.table.district': 'District',
    'admin.reports.table.date': 'Date',
    'admin.reports.table.status': 'Status',
    'admin.reports.table.actions': 'Actions',
    'admin.reports.view': 'View Report',
    'dashboard.jankari': 'Knowledge',
    'dashboard.jankari.notSupported': 'Text-to-speech is not supported in this browser.',
    'dashboard.jankari.greeting': 'Namaste {name}',
    'dashboard.jankari.weather': 'Current temperature is {temp} degrees.',
    'dashboard.jankari.weather.unavailable': 'Weather information is currently unavailable.',
    'dashboard.jankari.alerts': 'You have {count} unread alerts.',
    'dashboard.jankari.alerts.highPriority': 'You have {count} high priority alerts.',
    'dashboard.jankari.alerts.none': 'You have no unread alerts.',
    'dashboard.jankari.recommendations': 'You have {count} high priority recommendations.',
    'dashboard.jankari.recommendations.none': 'You have no high priority recommendations.',
    'dashboard.jankari.recommendation.detail': 'For {crop}, {message}.',
    'dashboard.jankari.crops.intro': 'You have {count} crops planted.',
    'dashboard.jankari.crop.detail': '{name} in {area}, health is {health}.',
  },

  hi: {
    'app.title': 'गुजरात कृषि तकनीक प्लेटफॉर्म',
    'dashboard.jankari.crops.intro': 'आपने {count} फसलें लगाई हैं।',
    'dashboard.jankari.crop.detail': '{area} में {name}, स्वास्थ्य {health} है।',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.map': 'खेत का नक्शा',
    'nav.alerts': 'अलर्ट',
    'nav.marketplace': 'मंडी भाव',
    'nav.advisory': 'सलाहकार',
    'nav.logout': 'लॉग आउट',

    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि हुई',
    'common.success': 'सफलता',
    'common.submit': 'सबमिट करें',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.send': 'दें',
    'common.search': 'खोजें',

    // Login
    'login.title': 'क्रॉपलाइट में लॉगिन करें',
    'login.subtitle': 'वापस स्वागत है, कृपया अपना विवरण दर्ज करें।',
    'login.email': 'ईमेल',
    'login.password': 'पासवर्ड',
    'login.signin': 'साइन इन',
    'login.remember': 'मुझे याद रखें',
    'login.forgot': 'पासवर्ड भूल गए?',
    'login.no_account': "खाता नहीं है?",
    'login.signup': 'मुफ्त साइन अप करें',
    'login.demo': 'क्विक डेमो लॉगिन',
    'login.farmer': 'किसान',
    'login.admin': 'एडमिन',

    // Landing Page
    'landing.hero.title': 'क्रॉपलाइट',
    'landing.hero.subtitle': 'अंतरिक्ष से आपकी हथेलियों तक सटीक खेती',
    'landing.hero.description': 'फसल की सेहत की निगरानी करें, वास्तविक समय में मौसम की चेतावनी प्राप्त करें और अपनी पैदावार को अधिकतम करने के लिए एआई-संचालित सलाहकार सेवाओं का उपयोग करें।',
    'landing.hero.cta.start': 'अभी शुरू करें',
    'landing.hero.cta.demo': 'डेमो देखें',
    'landing.features.title': 'क्रॉपलाइट क्यों चुनें?',
    'landing.features.subtitle': 'तकनीक के साथ किसानों को सशक्त बनाना',
    'landing.feature.satellite.title': 'सैटेलाइट निगरानी',
    'landing.feature.satellite.desc': 'नवीनतम सेंटिनल-2 उपग्रह डेटा का उपयोग करके वनस्पति स्वास्थ्य सूचकांकों (NDVI, EVI) को दूर से ट्रैक करें।',
    'landing.feature.insights.title': 'डेटा-संचालित अंतर्दृष्टि',
    'landing.feature.insights.desc': 'पानी के तनाव, फसल वृद्धि के चरणों और संभावित उपज भविष्यवाणियों पर कार्रवाई योग्य विश्लेषण प्राप्त करें।',
    'landing.feature.advisory.title': 'एआई सलाहकार',
    'landing.feature.advisory.desc': 'उन्नत एआई एल्गोरिदम द्वारा संचालित व्यक्तिगत कीट अलर्ट और खेती की सलाह प्राप्त करें।',
    'landing.cta.title': 'अपनी खेती को बदलने के लिए तैयार हैं?',
    'landing.cta.subtitle': 'स्मार्ट निर्णय लेने के लिए क्रॉपलाइट का उपयोग करने वाले हजारों किसानों से जुड़ें।',
    'landing.cta.button': 'मुफ्त खाता बनाएं',
    'landing.footer.privacy': 'गोपनीयता',
    'landing.footer.terms': 'शर्तें',
    'landing.footer.contact': 'संपर्क',

    // Dashboard
    'dashboard.welcome': 'स्वागत',
    'dashboard.farm.health': 'खेत की स्वास्थ्य स्थिति',
    'dashboard.recent.alerts': 'हाल की अलर्ट',
    'dashboard.weather': 'मौसम की जानकारी',
    'dashboard.recommendations': 'सुझाव',
    'dashboard.stats.area': 'कुल क्षेत्रफल',
    'dashboard.stats.ndvi': 'औसत NDVI',
    'dashboard.stats.alerts': 'सक्रिय अलर्ट',
    'dashboard.stats.irrigation': 'सिंचाई देय',
    'dashboard.alerts.none': 'कोई हालिया अलर्ट नहीं',
    'dashboard.jankari': 'जानकारी',
    'dashboard.jankari.notSupported': 'इस ब्राउज़र में टेक्स्ट-टू-स्पीच समर्थित नहीं है।',
    'dashboard.jankari.greeting': 'नमस्ते {name}',
    'dashboard.jankari.weather': 'वर्तमान तापमान {temp} डिग्री है।',
    'dashboard.jankari.weather.unavailable': 'मौसम की जानकारी अभी उपलब्ध नहीं है।',
    'dashboard.jankari.alerts': 'आपके पास {count} अपठित अलर्ट हैं।',
    'dashboard.jankari.alerts.highPriority': 'आपके पास {count} उच्च प्राथमिकता वाले अलर्ट हैं।',
    'dashboard.jankari.alerts.none': 'आपके पास कोई अपठित अलर्ट नहीं है।',
    'dashboard.jankari.recommendations': 'आपके पास {count} उच्च प्राथमिकता वाले सुझाव हैं।',
    'dashboard.jankari.recommendations.none': 'आपके पास कोई उच्च प्राथमिकता वाले सुझाव नहीं हैं।',
    'dashboard.jankari.recommendation.detail': '{crop} के लिए, {message}।',

    // Crop Health
    'crop.healthy': 'स्वस्थ',
    'crop.warning': 'ध्यान दें',
    'crop.critical': 'गंभीर',
    'crop.wheat': 'गेहूं',
    'crop.cotton': 'कपास',
    'crop.rice': 'धान',

    // Alerts
    'alert.water.stress': 'पानी की कमी का पता चला',
    'alert.nutrient.deficiency': 'पोषक तत्वों की कमी',
    'alert.pest.risk': 'कीट जोखिम अलर्ट',
    'alert.disease.detected': 'बीमारी का पता चला',
    'alerts.title': 'अलर्ट',
    'alerts.filter.all': 'सभी अलर्ट',
    'alerts.filter.unread': 'अपठित',
    'alerts.filter.high': 'उच्च प्राथमिकता',
    'alerts.stats.total': 'कुल अलर्ट',
    'alerts.stats.unread': 'अपठित',
    'alerts.stats.high': 'उच्च प्राथमिकता',
    'alerts.stats.resolved': 'आज सुलझाया गया',
    'alerts.mark_read': 'पढ़ा गया चिह्नित करें',
    'alerts.view_details': 'विवरण देखें',
    'alerts.recommended': 'सुझाए गए उपाय',
    'alerts.empty.all': 'आपके सभी खेत अच्छे दिख रहे हैं!',
    'alerts.empty.unread': 'फिलहाल कोई अपठित अलर्ट नहीं।',
    'alerts.empty.high': 'वर्तमान में कोई उच्च प्राथमिकता अलर्ट नहीं।',

    // Map
    'map.title': 'खेत निगरानी',
    'map.ndvi': 'NDVI सूचकांक',
    'map.evi': 'EVI सूचकांक',
    'map.ndmi': 'NDMI सूचकांक',
    'map.satellite.date': 'उपग्रह दिनांक',
    'map.index.label': 'वनस्पति सूचकांक',
    'map.date.label': 'उपग्रह दिनांक',
    'map.health.label': 'स्वास्थ्य स्थिति',
    'map.tools.label': 'चयन उपकरण',
    'map.tools.enable': 'ड्राइंग सक्षम करें',
    'map.tools.enabled': 'ड्राइंग सक्षम है',
    'map.tools.report': 'रिपोर्ट जनरेट करें',
    'map.tools.export': 'डेटा निर्यात करें',
    'map.tools.hint': 'विशिष्ट क्षेत्रों का चयन और विश्लेषण करने के लिए आयत, बहुभुज, या वृत्त खींचने के लिए मानचित्र पर टूलबार का उपयोग करें',
    'map.selected.title': 'चयनित क्षेत्र',
    'map.selected.list': 'चयनित क्षेत्र',
    'map.index.info': 'सूचकांक जानकारी',
    'map.summary': 'खेत सारांश',

    // Recommendations
    'rec.irrigation': 'सिंचाई की आवृत्ति बढ़ाएं',
    'rec.fertilizer': 'संतुलित उर्वरक डालें',
    'rec.pesticide': 'कीट नियंत्रण उपायों पर विचार करें',
    'rec.harvest': 'फसल की तैयारी की निगरानी करें',

    // Index Interpretations
    'map.interpretation.ndvi.good': 'वनस्पति घनी और स्वस्थ है। तत्काल किसी कार्रवाई की आवश्यकता नहीं है।',
    'map.interpretation.ndvi.moderate': 'वनस्पति स्वास्थ्य मध्यम है। तनाव के शुरुआती संकेतों की जाँच करें।',
    'map.interpretation.ndvi.critical': 'वनस्पति तनावग्रस्त या कम है। पानी/पोषक तत्वों की कमी के लिए तुरंत जाँच करें।',

    'map.interpretation.evi.good': 'उच्च फसल घनत्व और स्वस्थ विकास।',
    'map.interpretation.evi.moderate': 'मध्यम विकास का पता चला। खेत की स्थिति की निगरानी करें।',
    'map.interpretation.evi.critical': 'खराब विकास या खाली मिट्टी का पता चला। ध्यान देने की आवश्यकता है।',

    'map.interpretation.ndmi.good': 'नमी का स्तर अनुकूल है। वर्तमान में सिंचाई की आवश्यकता नहीं है।',
    'map.interpretation.ndmi.moderate': 'मध्यम नमी। जल्द ही सिंचाई की योजना बनाएं।',
    'map.interpretation.ndmi.critical': 'पानी की गंभीर कमी। तत्काल सिंचाई की सिफारिश की जाती है।',

    // Marketplace
    'market.title': 'मार्केट प्लेस',
    'market.subtitle': 'वास्तविक समय कृषि उपज मूल्य',
    'market.updated': 'अपडेट किया गया',
    'market.search': 'उपज खोजें (जैसे गेहूं, टमाटर)...',
    'market.no_data': 'आपके फिल्टर के लिए कोई बाजार डेटा नहीं मिला।',
    'market.reload': 'रिलोड का प्रयास करें',
    'market.table.name': 'नाम',
    'market.table.qty': 'मात्रा',
    'market.table.min': 'न्यूनतम मूल्य',
    'market.table.max': 'अधिकतम मूल्य',
    'market.categories.all': 'सभी उपज',
    'market.categories.crops': 'फसलें',
    'market.categories.vegetables': 'सब्जियां',
    'market.categories.oilseeds': 'तेल/तिलहन',
    'market.categories.cereal': 'अनाज',
    'market.categories.fruits': 'फल',

    // Advisory
    'advisory.human.title': 'मानव सलाहकार',
    'advisory.ai.title': 'एआई सहायक',
    'advisory.ask_expert': 'विशेषज्ञ से पूछें',
    'advisory.placeholder': 'कृषि विशेषज्ञ के लिए अपना प्रश्न लिखें...',
    'advisory.submit': 'प्रश्न सबमिट करें',
    'advisory.helplines': 'टोल-फ्री हेल्पलाइन',
    'advisory.ai.tap_speak': 'बोलने के लिए टैप करें',
    'advisory.ai.tap_stop': 'रोकने के लिए टैप करें',
    'advisory.ai.listening': 'सुन रहा हूँ...',

    // Admin Dashboard
    'admin.title': 'गुजरात कृषि निगरानी प्रणाली',
    'admin.subtitle': 'क्षेत्रीय फसल स्वास्थ्य अवलोकन और विश्लेषण',
    'admin.district': 'चयनित जिला',
    'admin.stats.farmers': 'कुल किसान',
    'admin.stats.area': 'कुल क्षेत्रफल (हेक्टेयर)',
    'admin.stats.alerts': 'सक्रिय अलर्ट',
    'admin.stats.healthy': 'स्वस्थ खेत',
    'admin.stats.ndvi': 'औसत NDVI',
    'admin.crop.dist': 'फसल वितरण',
    'admin.health.status': 'खेत स्वास्थ्य स्थिति',
    'admin.reports.title': 'हाल की रिपोर्ट',
    'admin.reports.export': 'डेटा निर्यात करें',
    'admin.reports.table.title': 'रिपोर्ट शीर्षक',
    'admin.reports.table.district': 'जिला',
    'admin.reports.table.date': 'दिनांक',
    'admin.reports.table.status': 'स्थिति',
    'admin.reports.table.actions': 'कदम',
    'admin.reports.view': 'रिपोर्ट देखें',
  },

  gu: {
    // Header
    'app.title': 'ગુજરાત એગ્રીટેક પ્લેટફોર્મ',
    'nav.dashboard': 'ડેશબોર્ડ',
    'nav.map': 'ખેતનો નકશો',
    'nav.alerts': 'અલર્ટ',
    'nav.marketplace': 'માર્કેટ પ્લેસ',
    'nav.advisory': 'સલાહકાર',
    'nav.logout': 'લોગ આઉટ',

    // Common
    'common.loading': 'લોડ થઈ રહ્યું છે...',
    'common.error': 'ભૂલ થઈ',
    'common.success': 'સફળતા',
    'common.submit': 'સબમિટ કરો',
    'common.cancel': 'રદ કરો',
    'common.save': 'સેવ કરો',
    'common.send': 'મોકલો',
    'common.search': 'શોધો',

    // Login
    'login.title': 'ક્રોપલાઇટમાં લોગિન કરો',
    'login.subtitle': 'ફરી સ્વાગત છે, કૃપા કરીને તમારી વિગતો દાખલ કરો.',
    'login.email': 'ઈમેઈલ',
    'login.password': 'પાસવર્ડ',
    'login.signin': 'સાઈન ઈન',
    'login.remember': 'મને યાદ રાખો',
    'login.forgot': 'પાસવર્ડ ભૂલી ગયા?',
    'login.no_account': "ખાતું નથી?",
    'login.signup': 'મફત સાઇન અપ કરો',
    'login.demo': 'ક્વિક ડેમો લોગિન',
    'login.farmer': 'ખેડૂત',
    'login.admin': 'એડમિન',

    // Landing Page
    'landing.hero.title': 'ક્રોપલાઇટ',
    'landing.hero.subtitle': 'અવકાશથી તમારી આંગળીના ટેરવે સચોટ ખેતી',
    'landing.hero.description': 'પાકની તંદુરસ્તીનું નિરીક્ષણ કરો, હવામાનની ચેતવણીઓ મેળવો અને તમારી ઉપજ વધારવા માટે એઆઈ-આધારિત સલાહકાર સેવાઓનો ઉપયોગ કરો.',
    'landing.hero.cta.start': 'હવે શરૂ કરો',
    'landing.hero.cta.demo': 'ડેમો જુઓ',
    'landing.features.title': 'ક્રોપલાઇટ શા માટે પસંદ કરો?',
    'landing.features.subtitle': 'ટેકનોલોજી સાથે ખેડૂતોને સશક્તિકરણ',
    'landing.feature.satellite.title': 'સેટેલાઇટ મોનીટરીંગ',
    'landing.feature.satellite.desc': 'નવીનતમ સેન્ટિનલ-2 સેટેલાઇટ ડેટાનો ઉપયોગ કરીને વનસ્પતિ આરોગ્ય સૂચકાંકો (NDVI, EVI) ને દૂરથી ટ્રેક કરો.',
    'landing.feature.insights.title': 'ડેટા-આધારિત આંતરદૃષ્ટિ',
    'landing.feature.insights.desc': 'પાણીની તંગી, પાકના વિકાસના તબક્કાઓ અને સંભવિત ઉપજની આગાહીઓ પર કાર્યક્ષમ વિશ્લેષણ મેળવો.',
    'landing.feature.advisory.title': 'એઆઈ સલાહકાર',
    'landing.feature.advisory.desc': 'અદ્યતન એઆઈ અલ્ગોરિધમ્સ દ્વારા સંચાલિત વ્યક્તિગત જીવાત ચેતવણીઓ અને ખેતીની સલાહ મેળવો।',
    'landing.cta.title': 'શું તમે તમારી ખેતીને બદલવા માટે તૈયાર છો?',
    'landing.cta.subtitle': 'સ્માર્ટ નિર્ણયો લેવા માટે ક્રોપલાઇટનો ઉપયોગ કરતા હજારો ખેડૂતો સાથે જોડાઓ.',
    'landing.cta.button': 'મફત ખાતું બનાવો',
    'landing.footer.privacy': 'ગોપનીયતા',
    'landing.footer.terms': 'શરતો',
    'landing.footer.contact': 'સંપર્ક',

    // Dashboard
    'dashboard.welcome': 'સ્વાગત',
    'dashboard.farm.health': 'ખેતની આરોગ્ય સ્થિતિ',
    'dashboard.recent.alerts': 'તાજેતરની અલર્ટ',
    'dashboard.weather': 'હવામાનની માહિતી',
    'dashboard.recommendations': 'સૂચનાઓ',
    'dashboard.stats.area': 'કુલ વિસ્તાર',
    'dashboard.stats.ndvi': 'સરેરાશ NDVI',
    'dashboard.stats.alerts': 'સક્રિય અલર્ટ',
    'dashboard.stats.irrigation': 'સિંચાઈ બાકી',
    'dashboard.alerts.none': 'કોઈ તાજેતરની અલર્ટ નથી',
    'dashboard.jankari': 'જાણકારી',
    'dashboard.jankari.notSupported': 'આ બ્રાઉઝરમાં ટેક્સ્ટ-ટુ-સ્પીચ સપોર્ટેડ નથી.',
    'dashboard.jankari.greeting': 'નમસ્તે {name}',
    'dashboard.jankari.weather': 'વર્તમાન તાપમાન {temp} ડિગ્રી છે.',
    'dashboard.jankari.weather.unavailable': 'હવામાન માહિતી હાલમાં ઉપલબ્ધ નથી.',
    'dashboard.jankari.alerts': 'તમારી પાસે {count} વણવાંચેલા અલર્ટ છે.',
    'dashboard.jankari.alerts.highPriority': 'તમારી પાસે {count} ઉચ્ચ અગ્રતા અલર્ટ છે.',
    'dashboard.jankari.alerts.none': 'તમારી પાસે કોઈ વણવાંચેલા અલર્ટ નથી.',
    'dashboard.jankari.recommendations': 'તમારી પાસે {count} ઉચ્ચ અગ્રતા ભલામણો છે.',
    'dashboard.jankari.recommendations.none': 'તમારી પાસે કોઈ ઉચ્ચ અગ્રતા ભલામણો નથી.',
    'dashboard.jankari.recommendation.detail': '{crop} માટે, {message}.',
    'dashboard.jankari.crops.intro': 'તમે {count} પાક વાવ્યા છે.',
    'dashboard.jankari.crop.detail': '{area} માં {name}, આરોગ્ય {health} છે.',

    // Crop Health
    'crop.healthy': 'તંદુરસ્ત',
    'crop.warning': 'ધ્યાન આપો',
    'crop.critical': 'ગંભીર',
    'crop.wheat': 'ઘઉં',
    'crop.cotton': 'કપાસ',
    'crop.rice': 'ચોખા',

    // Alerts
    'alert.water.stress': 'પાણીની તંગીની શોધ',
    'alert.nutrient.deficiency': 'પોષક તત્વોની કમી',
    'alert.pest.risk': 'જીવાત જોખમ અલર્ટ',
    'alert.disease.detected': 'રોગની શોધ',
    'alerts.title': 'અલર્ટ',
    'alerts.filter.all': 'બધી અલર્ટ',
    'alerts.filter.unread': 'વંચાયેલ નથી',
    'alerts.filter.high': 'ઉચ્ચ અગ્રતા',
    'alerts.stats.total': 'કુલ અલર્ટ',
    'alerts.stats.unread': 'વંચાયેલ નથી',
    'alerts.stats.high': 'ઉચ્ચ અગ્રતા',
    'alerts.stats.resolved': 'આજે ઉકેલાયેલ',
    'alerts.mark_read': 'વાંચેલું માર્ક કરો',
    'alerts.view_details': 'વિગતો જુઓ',
    'alerts.recommended': 'ભલામણ કરેલ પગલાં',
    'alerts.empty.all': 'તમારા બધા ખેતરો સારા દેખાઈ રહ્યા છે!',
    'alerts.empty.unread': 'હાલમાં કોઈ વંચાયેલ ન હોય તેવી અલર્ટ નથી.',
    'alerts.empty.high': 'હાલમાં કોઈ ઉચ્ચ અગ્રતા વાળી અલર્ટ નથી.',

    // Map
    'map.title': 'ખેત નિરીક્ષણ',
    'map.ndvi': 'NDVI ઈન્ડેક્સ',
    'map.evi': 'EVI ઈન્ડેક્સ',
    'map.ndmi': 'NDMI ઈન્ડેક્સ',
    'map.satellite.date': 'સેટેલાઈટ તારીખ',
    'map.index.label': 'વનસ્પતિ સૂચકાંક',
    'map.date.label': 'સેટેલાઈટ તારીખ',
    'map.health.label': 'આરોગ્ય સ્થિતિ',
    'map.tools.label': 'પસંદગી સાધનો',
    'map.tools.enable': 'ડ્રોઈંગ સક્ષમ કરો',
    'map.tools.enabled': 'ડ્રોઈંગ સક્ષમ છે',
    'map.tools.report': 'રિપોર્ટ બનાવો',
    'map.tools.export': 'ડેટા નિકાસ કરો',
    'map.tools.hint': 'ચોક્કસ વિસ્તારો પસંદ કરવા અને તેનું વિશ્લેષણ કરવા માટે નકશા પર લંબચોરસ, બહુકોણ અથવા વર્તુળ દોરવા માટે ટૂલબારનો ઉપયોગ કરો',
    'map.selected.title': 'પસંદ કરેલ વિસ્તાર',
    'map.selected.list': 'પસંદ કરેલ વિસ્તારો',
    'map.index.info': 'સૂચકાંક માહિતી',
    'map.summary': 'ખેત સારાંશ',

    // Recommendations
    'rec.irrigation': 'સિંચાઈની આવૃત્તિ વધારો',
    'rec.fertilizer': 'સંતુલિત ખાતર નાખો',
    'rec.pesticide': 'જીવાત નિયંત્રણના ઉપાયો વિચારો',
    'rec.harvest': 'ફસલની તૈયારીનું નિરીક્ષણ કરો',

    // Index Interpretations
    'map.interpretation.ndvi.good': 'વનસ્પતિ ગીચ અને સ્વસ્થ છે. તાત્કાલિક કોઈ પગલાંની જરૂર નથી.',
    'map.interpretation.ndvi.moderate': 'વનસ્પતિનું સ્વાસ્થ્ય મધ્યમ છે. તણાવના પ્રારંભિક ચિહ્નો માટે તપાસો.',
    'map.interpretation.ndvi.critical': 'વનસ્પતિ તણાવગ્રસ્ત છે અથવા ઓછી છે. પાણી/પોષક તત્વોની ઉણપ માટે તાત્કાલિક તપાસો.',

    'map.interpretation.evi.good': 'ઉચ્ચ પાક ગીચતા અને સ્વસ્થ વૃદ્ધિ.',
    'map.interpretation.evi.moderate': 'મધ્યમ વૃદ્ધિ જોવા મળી. ખેતરની સ્થિતિનું નિરીક્ષણ કરો.',
    'map.interpretation.evi.critical': 'નબળી વૃદ્ધિ અથવા ખુલ્લી જમીન જોવા મળી. ધ્યાન આપવાની જરૂર છે.',

    'map.interpretation.ndmi.good': 'ભેજનું સ્તર શ્રેષ્ઠ છે. હાલમાં સિંચાઈની જરૂર નથી.',
    'map.interpretation.ndmi.moderate': 'મધ્યમ ભેજ. ટૂંક સમયમાં સિંચાઈનું આયોજન કરો.',
    'map.interpretation.ndmi.critical': 'પાણીની ગંભીર તંગી. તાત્કાલિક સિંચાઈની ભલામણ કરવામાં આવે છે.',

    // Marketplace
    'market.title': 'માર્કેટ પ્લેસ',
    'market.subtitle': 'રીઅલ-ટાઇમ કૃષિ કોમોડિટીના ભાવ',
    'market.updated': 'અપડેટ કર્યું',
    'market.search': 'કોમોડિટી શોધો (દા.ત. ઘઉં, ટામેટા)...',
    'market.no_data': 'તમારા ફિલ્ટર્સ માટે કોઈ માર્કેટ ડેટા મળ્યો નથી.',
    'market.reload': 'ફરી પ્રયાસ કરો',
    'market.table.name': 'નામ',
    'market.table.qty': 'જથ્થો',
    'market.table.min': 'લઘુત્તમ ભાવ',
    'market.table.max': 'મહત્તમ ભાવ',
    'market.categories.all': 'બધી પ્રોડક્ટ્સ',
    'market.categories.crops': 'પાક',
    'market.categories.vegetables': 'શાકભાજી',
    'market.categories.oilseeds': 'તેલ/તેલીબિયાં',
    'market.categories.cereal': 'અનાજ',
    'market.categories.fruits': 'ફળો',

    // Advisory
    'advisory.human.title': 'માનવ સલાહકાર',
    'advisory.ai.title': 'એઆઈ સહાયક',
    'advisory.ask_expert': 'નિષ્ણાતને પૂછો',
    'advisory.placeholder': 'કૃષિ નિષ્ણાત માટે તમારો પ્રશ્ન લખો...',
    'advisory.submit': 'પ્રશ્ન સબમિટ કરો',
    'advisory.helplines': 'ટોલ-ફ્રી હેલ્પલાઇન',
    'advisory.ai.tap_speak': 'બોલવા માટે ટેપ કરો',
    'advisory.ai.tap_stop': 'રોકવા માટે ટેપ કરો',
    'advisory.ai.listening': 'સાંભળી રહ્યો છું...',

    // Admin Dashboard
    'admin.title': 'ગુજરાત કૃષિ દેખરેખ પ્રણાલી',
    'admin.subtitle': 'પ્રાદેશિક પાક આરોગ્ય ઝાંખી અને વિશ્લેષણ',
    'admin.district': 'પસંદ કરેલ જિલ્લો',
    'admin.stats.farmers': 'કુલ ખેડૂતો',
    'admin.stats.area': 'કુલ વિસ્તાર (હેક્ટર)',
    'admin.stats.alerts': 'સક્રિય અલર્ટ',
    'admin.stats.healthy': 'તંદુરસ્ત ખેતરો',
    'admin.stats.ndvi': 'સરેરાશ NDVI',
    'admin.crop.dist': 'પાક વિતરણ',
    'admin.health.status': 'ખેત આરોગ્ય સ્થિતિ',
    'admin.reports.title': 'તાજેતરની રિપોર્ટ્સ',
    'admin.reports.export': 'ડેટા નિકાસ કરો',
    'admin.reports.table.title': 'રિપોર્ટ શીર્ષક',
    'admin.reports.table.district': 'જિલ્લો',
    'admin.reports.table.date': 'તારીખ',
    'admin.reports.table.status': 'સ્થિતિ',
    'admin.reports.table.actions': 'ક્રિયાઓ',
    'admin.reports.view': 'રિપોર્ટ જુઓ',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('AgriVision_language') as Language;
    if (savedLanguage && ['en', 'hi', 'gu'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('AgriVision_language', lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = translations[language][key as keyof typeof translations[typeof language]] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{${paramKey}}`, String(paramValue));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};