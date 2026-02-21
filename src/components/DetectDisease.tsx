import React, { useState } from 'react';
import { Upload, X, Loader, AlertCircle, CheckCircle2, FlaskConical, Stethoscope } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { detectDisease, StructuredDiseaseAnalysis } from '../services/identificationService';

const DetectDisease: React.FC = () => {
    const { t } = useLanguage();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<StructuredDiseaseAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async () => {
        if (!selectedImage) return;

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const base64Image = await fileToBase64(selectedImage);
            // New flow: detectDisease now returns StructuredDiseaseAnalysis directly from Kindwise
            const formattedResult = await detectDisease(base64Image);
            setResult(formattedResult);
        } catch (err: any) {
            console.error('Identification failed:', err);
            setError(err.message || 'Failed to identify crop. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="bg-green-600 px-6 py-4">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <Stethoscope className="mr-2 h-6 w-6" />
                            {t('detect disease') || 'Crop Disease Diagnostics'}
                        </h2>
                    </div>

                    <div className="p-6">
                        <div className="mb-8">
                            {!previewUrl ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-green-500 transition-all cursor-pointer bg-gray-50 group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                                        <div className="bg-green-100 p-4 rounded-full group-hover:bg-green-200 transition-colors mb-4">
                                            <Upload className="h-10 w-10 text-green-600" />
                                        </div>
                                        <span className="text-xl font-semibold text-gray-700">Upload Crop Photo</span>
                                        <span className="text-gray-500 mt-2">Clearly capture the affected area</span>
                                    </label>
                                </div>
                            ) : (
                                <div className="relative rounded-xl overflow-hidden bg-gray-100 border-2 border-green-100">
                                    <img src={previewUrl} alt="Preview" className="w-full h-80 object-contain" />
                                    <button
                                        onClick={removeImage}
                                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-md"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-700 animate-in fade-in duration-300">
                                <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={!selectedImage || loading}
                            className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all transform active:scale-95 shadow-lg ${!selectedImage || loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 hover:shadow-green-200'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <Loader className="animate-spin -ml-1 mr-3 h-6 w-6" />
                                    Analyzing Crop Health...
                                </span>
                            ) : (
                                'Run Diagnosis'
                            )}
                        </button>
                    </div>
                </div>

                {result && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        {/* Result Main Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
                            <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                                <h3 className="text-xl font-bold text-green-800 flex items-center">
                                    <CheckCircle2 className="mr-2 h-6 w-6 text-green-600" />
                                    Diagnosis Results
                                </h3>
                            </div>

                            <div className="p-6">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <div className="mb-6">
                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Detected Disease</h4>
                                            <p className="text-2xl font-extrabold text-gray-900">{result.disease}</p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Recommended Remedy</h4>
                                            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                                <p className="text-gray-700 leading-relaxed font-medium">{result.remedy}</p>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetectDisease;
