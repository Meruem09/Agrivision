import React from 'react';
import { Droplets, Package, Scissors, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface RecommendationCardProps {
  recommendation: {
    id: string;
    type: string;
    priority: 'low' | 'medium' | 'high';
    crop: string;
    message: string;
  };
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const { t } = useLanguage();

  const getIcon = (type: string) => {
    switch (type) {
      case 'irrigation':
        return <Droplets className="h-4 w-4" />;
      case 'fertilizer':
        return <Package className="h-4 w-4" />;
      case 'harvest':
        return <Scissors className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          icon: 'text-red-600'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          icon: 'text-yellow-600'
        };
      case 'low':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          icon: 'text-blue-600'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          icon: 'text-gray-600'
        };
    }
  };

  const colors = getPriorityColor(recommendation.priority);

  return (
    <div className={`p-3 rounded-lg border ${colors.bg} ${colors.border}`}>
      <div className="flex items-start space-x-3">
        <div className={`${colors.icon} mt-0.5`}>
          {getIcon(recommendation.type)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-gray-800 capitalize">
              {t(`crop.${recommendation.crop}`)}
            </p>
            <span className={`text-xs px-2 py-1 rounded-full capitalize ${colors.text} ${colors.bg}`}>
              {recommendation.priority}
            </span>
          </div>
          <p className="text-sm text-gray-700">{recommendation.message}</p>
          <button className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium">
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;