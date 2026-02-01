import React, { useState, useEffect, useRef } from 'react';
import { Mic, Phone, User, MessageSquare, MicOff, Send, Image as ImageIcon, Languages, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getAIResponse } from '../services/aiService';

interface Advisor {
    id: number;
    name: string;
    role: string;
    image: string;
    phone: string;
}

const advisors: Advisor[] = [
    { id: 1, name: 'Dr. Ramesh Gupta', role: 'Soil Specialist', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop', phone: '9974205599' },
    { id: 2, name: 'Dr. Anita Desai', role: 'Plant Pathologist', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop', phone: '7862067246' },
    { id: 3, name: 'Dr. Sunil Kumar', role: 'Agronomist', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', phone: '8140665265' },
];

const Advisory: React.FC = () => {
    const { t } = useLanguage();

    // AI State
    const [isListeningAI, setIsListeningAI] = useState(false);
    const [aiMessages, setAiMessages] = useState<{ type: 'user' | 'ai'; text: string; image?: string }[]>([]);
    const [aiInputText, setAiInputText] = useState('');
    const [aiSelectedImage, setAiSelectedImage] = useState<string | null>(null);

    // Human Advisory State
    const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
    const [humanMessages, setHumanMessages] = useState<Record<number, { type: 'user' | 'advisor'; text: string; image?: string }[]>>({});
    const [humanInputText, setHumanInputText] = useState('');
    const [humanSelectedImage, setHumanSelectedImage] = useState<string | null>(null);

    // Shared / Toggle State
    const [isHindiMode, setIsHindiMode] = useState(false);

    // Refs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);
    const aiFileInputRef = useRef<HTMLInputElement>(null);
    const humanFileInputRef = useRef<HTMLInputElement>(null);
    const activeInputRef = useRef<'ai' | 'human'>('ai'); // To track which input to update with speech

    // ----------------------------------------------------------------------
    // Speech Recognition & Synthesis
    // ----------------------------------------------------------------------
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const SpeechRecognitionAPI = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognitionRef.current = new SpeechRecognitionAPI();
            recognitionRef.current!.continuous = false;
            recognitionRef.current!.interimResults = false;
            recognitionRef.current!.lang = isHindiMode ? 'hi-IN' : 'en-US';

            recognitionRef.current!.onstart = () => {
                if (activeInputRef.current === 'ai') setIsListeningAI(true);
                // Human doesn't have visible listening state button right now in layout plan but we can add one
            };
            recognitionRef.current!.onend = () => {
                setIsListeningAI(false);
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognitionRef.current!.onresult = (event: any) => {
                const text = event.results[0][0].transcript;
                if (activeInputRef.current === 'ai') {
                    setAiInputText(prev => prev + (prev ? ' ' : '') + text);
                } else {
                    setHumanInputText(prev => prev + (prev ? ' ' : '') + text);
                }
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognitionRef.current!.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListeningAI(false);
            };
        }
    }, [isHindiMode]);

    const toggleListening = (type: 'ai' | 'human') => {
        activeInputRef.current = type;
        if ((type === 'ai' && isListeningAI)) { // Simple toggle logic
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
    };

    const speakText = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = isHindiMode ? 'hi-IN' : 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    };

    // ----------------------------------------------------------------------
    // Transliteration
    // ----------------------------------------------------------------------
    const fetchTransliteration = async (word: string) => {
        try {
            const response = await fetch(`https://inputtools.google.com/request?text=${word}&itc=hi-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8`);
            const data = await response.json();
            if (data[0] === 'SUCCESS') {
                return data[1][0][1][0];
            }
        } catch (e) {
            console.error(e);
        }
        return word;
    };

    const handleInputChange = async (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        setter: React.Dispatch<React.SetStateAction<string>>,
        currentVal: string
    ) => {
        const val = e.target.value;

        if (isHindiMode && val.endsWith(' ') && val.length > currentVal.length) {
            const words = val.trim().split(' ');
            const lastWord = words[words.length - 1];
            if (lastWord && /^[a-zA-Z]+$/.test(lastWord)) {
                const hindiWord = await fetchTransliteration(lastWord);
                const newText = words.slice(0, -1).join(' ') + ' ' + hindiWord + ' ';
                setter(newText);
                return;
            }
        }
        setter(val);
    };

    // ----------------------------------------------------------------------
    // Image Handling
    // ----------------------------------------------------------------------
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, setImg: (s: string | null) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImg(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // ----------------------------------------------------------------------
    // Submission Handlers
    // ----------------------------------------------------------------------
    const handleAISubmit = async () => {
        if (!aiInputText.trim() && !aiSelectedImage) return;

        const text = aiInputText;
        const img = aiSelectedImage;

        setAiInputText('');
        setAiSelectedImage(null);

        setAiMessages(prev => [...prev, { type: 'user', text, image: img || undefined }]);

        try {
            const response = await getAIResponse(text, img || undefined);
            setAiMessages(prev => [...prev, { type: 'ai', text: response }]);
            speakText(response);
        } catch {
            setAiMessages(prev => [...prev, { type: 'ai', text: "Sorry, I encountered an error." }]);
        }
    };

    const handleHumanSubmit = () => {
        if (!humanInputText.trim() && !humanSelectedImage) return;
        if (!selectedAdvisor) return;

        const advisorId = selectedAdvisor.id;
        const text = humanInputText;
        const img = humanSelectedImage;

        setHumanInputText('');
        setHumanSelectedImage(null);

        setHumanMessages(prev => ({
            ...prev,
            [advisorId]: [...(prev[advisorId] || []), { type: 'user', text, image: img || undefined }]
        }));

        setTimeout(() => {
            setHumanMessages(prev => ({
                ...prev,
                [advisorId]: [...(prev[advisorId] || []), { type: 'advisor', text: 'Thank you for your query. I will review it and get back to you shortly.' }]
            }));
        }, 1000);
    };

    const handleCall = (phone: string) => {
        const message = encodeURIComponent("Hello, I need advice regarding my crop.");
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-5rem)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

                {/* Left Side: Human Advisory */}
                <div className="bg-white rounded-2xl shadow-lg border border-green-100 flex flex-col overflow-hidden">

                    {/* Top Section: Active Chat / ask Expert */}
                    <div className="flex-1 flex flex-col border-b border-gray-200 min-h-0">
                        <div className="p-4 bg-green-50 border-b border-green-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <User className="h-6 w-6 text-green-600" />
                                {selectedAdvisor ? `Ask ${selectedAdvisor.name}` : t('advisory.human.title')}
                            </h2>
                            {selectedAdvisor && (
                                <button onClick={() => setSelectedAdvisor(null)} className="text-gray-500 hover:text-gray-700">
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50/50">
                            {!selectedAdvisor ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <User className="h-16 w-16 mb-4 opacity-20" />
                                    <p>Select an expert from the list below to start chatting</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {(humanMessages[selectedAdvisor.id] || []).map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.type === 'user' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                                                }`}>
                                                {msg.image && (
                                                    <img src={msg.image} alt="Upload" className="w-full h-32 object-cover rounded-lg mb-2" />
                                                )}
                                                {msg.text && <p>{msg.text}</p>}
                                            </div>
                                        </div>
                                    ))}
                                    {(!humanMessages[selectedAdvisor.id] || humanMessages[selectedAdvisor.id].length === 0) && (
                                        <div className="text-center text-gray-500 mt-10">Start a conversation with {selectedAdvisor.name}</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Input Area (Only visible when expert selected to match 'Ask Expert' concept) */}
                        {selectedAdvisor && (
                            <div className="p-3 bg-white">
                                {humanSelectedImage && (
                                    <div className="mb-2 relative inline-block">
                                        <img src={humanSelectedImage} alt="Preview" className="h-12 w-12 rounded-lg object-cover border border-gray-200" />
                                        <button onClick={() => setHumanSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 text-white">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 mb-1">
                                    <button
                                        onClick={() => setIsHindiMode(!isHindiMode)}
                                        className={`text-[10px] px-2 py-0.5 rounded border ${isHindiMode ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                    >
                                        {isHindiMode ? 'Hindi' : 'English'}
                                    </button>
                                </div>
                                <div className="flex gap-2 items-end">
                                    <div className="flex-1 relative">
                                        <textarea
                                            value={humanInputText}
                                            onChange={(e) => handleInputChange(e, setHumanInputText, humanInputText)}
                                            placeholder={isHindiMode ? "संदेश लिखें..." : "Type message..."}
                                            className="w-full pl-3 pr-8 py-2 rounded-xl border border-gray-200 focus:ring-1 focus:ring-green-500 focus:border-green-500 resize-none h-10 scrollbar-hide text-sm"
                                        />
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={humanFileInputRef}
                                        onChange={(e) => handleImageSelect(e, setHumanSelectedImage)}
                                    />
                                    <button onClick={() => humanFileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full">
                                        <ImageIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={handleHumanSubmit}
                                        disabled={!humanInputText.trim() && !humanSelectedImage}
                                        className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50"
                                    >
                                        <Send className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Section: Advisor List */}
                    <div className="h-1/3 bg-gray-50 border-t border-gray-200 flex flex-col">
                        <div className="px-4 py-2 bg-white border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Available Experts
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-2">
                            {advisors.map(advisor => (
                                <div key={advisor.id} className={`bg-white p-3 rounded-xl border flex items-center gap-3 transition-colors ${selectedAdvisor?.id === advisor.id ? 'border-green-500 ring-1 ring-green-100' : 'border-gray-100 hover:border-green-200'}`}>
                                    <img src={advisor.image} alt={advisor.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-800 text-sm truncate">{advisor.name}</h4>
                                        <p className="text-xs text-gray-500 truncate">{advisor.role}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setSelectedAdvisor(advisor)}
                                            className={`p-2 rounded-full transition-colors ${selectedAdvisor?.id === advisor.id ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleCall(advisor.phone)}
                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                        >
                                            <Phone className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: AI Advisory */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl flex flex-col relative overflow-hidden">
                    <div className="bg-white/10 backdrop-blur-md p-4 border-b border-white/10 flex items-center justify-between z-10">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <MessageSquare className="h-6 w-6" />
                            {t('advisory.ai.title')}
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 blue-scrollbar z-10">
                        {aiMessages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-blue-100 opacity-60">
                                <Mic className="h-12 w-12 mb-2" />
                                <p>Talk to our AI Assistant</p>
                            </div>
                        )}
                        {aiMessages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl ${msg.type === 'user' ? 'bg-white/20 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'
                                    }`}>
                                    {msg.image && (
                                        <img src={msg.image} alt="User upload" className="w-full h-40 object-cover rounded-lg mb-2" />
                                    )}
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* AI Input Area */}
                    <div className="p-4 bg-white/10 backdrop-blur-md z-10">
                        {aiSelectedImage && (
                            <div className="mb-2 relative inline-block">
                                <img src={aiSelectedImage} alt="Preview" className="h-16 w-16 rounded-lg object-cover border-2 border-white" />
                                <button onClick={() => setAiSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-2 mb-2">
                            <button
                                onClick={() => setIsHindiMode(!isHindiMode)}
                                className={`text-xs px-2 py-1 rounded-md flex items-center gap-1 ${isHindiMode ? 'bg-orange-500 text-white' : 'bg-white/20 text-white'}`}
                            >
                                <Languages className="h-3 w-3" />
                                {isHindiMode ? 'Hindi' : 'English'}
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <textarea
                                    value={aiInputText}
                                    onChange={(e) => handleInputChange(e, setAiInputText, aiInputText)}
                                    placeholder={isHindiMode ? "पूछें..." : "Ask anything..."}
                                    className="w-full pl-3 pr-10 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:ring-2 focus:ring-white/50 focus:border-transparent resize-none h-12 scrollbar-hide"
                                    style={{ color: 'white' }}
                                />
                                <button
                                    onClick={() => toggleListening('ai')}
                                    className={`absolute right-2 top-2 p-1 rounded-full hover:bg-white/10 ${isListeningAI ? 'text-red-400 animate-pulse' : 'text-blue-100'}`}
                                >
                                    {isListeningAI ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                                </button>
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={aiFileInputRef}
                                onChange={(e) => handleImageSelect(e, setAiSelectedImage)}
                            />
                            <button
                                onClick={() => aiFileInputRef.current?.click()}
                                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-colors"
                            >
                                <ImageIcon className="h-6 w-6" />
                            </button>

                            <button
                                onClick={handleAISubmit}
                                disabled={!aiInputText.trim() && !aiSelectedImage}
                                className="bg-white text-blue-600 hover:bg-blue-50 p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                            >
                                <Send className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24 pointer-events-none"></div>
                </div>

            </div>
        </div>
    );
};

export default Advisory;
