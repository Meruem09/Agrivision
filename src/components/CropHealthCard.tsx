import React from 'react';
import { Activity, Leaf } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
 
interface CropHealthCardProps {
  crop: {
    id: string;
    name: string;
    area: string;
    health: 'healthy' | 'warning' | 'critical';
    ndvi: number;
    lastUpdate: string;
  };
}

const CropHealthCard: React.FC<CropHealthCardProps> = ({ crop }) => {
  const { t } = useLanguage();

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600'
        };
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-600'
        };
    }
  };

  const getNDVIColor = (ndvi: number) => {
    if (ndvi >= 0.7) return 'text-green-600';
    if (ndvi >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const colors = getHealthColor(crop.health);

  return (
    <div className={`p-4 rounded-lg border-2 ${colors.bg} ${colors.border} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Leaf className={`h-5 w-5 ${colors.icon}`} />
          <h3 className="font-semibold text-gray-800 capitalize">
            {t(`crop.${crop.name}`)}
          </h3>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.text} ${colors.bg}`}>
          {t(`crop.${crop.health}`)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Area:</span>
          <span className="font-medium text-gray-800">{crop.area}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">NDVI:</span>
          <span className={`font-bold ${getNDVIColor(crop.ndvi)}`}>
            {crop.ndvi.toFixed(2)}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className={`h-2 rounded-full ${
              crop.ndvi >= 0.7 ? 'bg-green-500' : 
              crop.ndvi >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(crop.ndvi * 100, 100)}%` }}
          ></div>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Updated: {crop.lastUpdate}
        </p>
      </div>
      
      <div className="mt-3 flex space-x-2">
        <button className="flex-1 bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors">
          View Details
        </button>
        <button className={`flex items-center justify-center px-3 py-1 rounded text-sm transition-colors ${
          crop.health === 'critical' || crop.health === 'warning'
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-200 text-gray-600 cursor-not-allowed'
        }`}>
          <Activity className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default CropHealthCard;