import React, { useState } from 'react';
import { Bell, AlertTriangle, Droplets, Bug, Leaf, Clock, CheckCircle, Filter } from 'lucide-react';
import { useAlerts } from '../contexts/AlertContext';
import { useLanguage } from '../contexts/LanguageContext';

const AlertsPage: React.FC = () => {
  const { alerts, markAsRead } = useAlerts();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'water_stress':
        return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'nutrient_deficiency':
        return <Leaf className="h-5 w-5 text-green-500" />;
      case 'pest_risk':
        return <Bug className="h-5 w-5 text-red-500" />;
      case 'disease_detected':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.read;
    if (filter === 'high') return alert.severity === 'high';
    return true;
  });

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-800">
              {t('nav.alerts')}
            </h1>
          </div>

          {/* Filter Options */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'high')}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('alerts.filter.all')}</option>
              <option value="unread">{t('alerts.filter.unread')}</option>
              <option value="high">{t('alerts.filter.high')}</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-600">{t('alerts.stats.total')}</p>
            <p className="text-lg font-bold text-blue-800">{alerts.length}</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-600">{t('alerts.stats.unread')}</p>
            <p className="text-lg font-bold text-yellow-800">{alerts.filter(a => !a.read).length}</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-sm text-red-600">{t('alerts.stats.high')}</p>
            <p className="text-lg font-bold text-red-800">{alerts.filter(a => a.severity === 'high').length}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-600">{t('alerts.stats.resolved')}</p>
            <p className="text-lg font-bold text-green-800">5</p>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-lg p-6 shadow-sm border-2 transition-all hover:shadow-md ${!alert.read ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    {getAlertIcon(alert.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {t(`alert.${alert.type}`)}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                        {t(`crop.${alert.crop}`)}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-2">{alert.message}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(alert.timestamp)}</span>
                      </div>
                      <span>📍 {alert.location}</span>
                      <span>🎯 {alert.confidence}% confidence</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!alert.read && (
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>{t('alerts.mark_read')}</span>
                    </button>
                  )}

                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    {t('alerts.view_details')}
                  </button>
                </div>
              </div>

              {/* Action Recommendations */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-medium text-gray-800 mb-2">{t('alerts.recommended')}</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {alert.type === 'water_stress' && (
                    <>
                      <li>• Increase irrigation frequency in affected areas</li>
                      <li>• Check soil moisture levels manually</li>
                      <li>• Consider drip irrigation for efficient water usage</li>
                    </>
                  )}
                  {alert.type === 'nutrient_deficiency' && (
                    <>
                      <li>• Apply balanced NPK fertilizer</li>
                      <li>• Conduct soil testing for precise nutrient analysis</li>
                      <li>• Consider organic compost supplementation</li>
                    </>
                  )}
                  {alert.type === 'pest_risk' && (
                    <>
                      <li>• Monitor fields for pest activity signs</li>
                      <li>• Apply preventive organic pest control measures</li>
                      <li>• Consult local agricultural extension officer</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No alerts match your current filter
            </h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? t('alerts.empty.all')
                : filter === 'unread'
                  ? t('alerts.empty.unread')
                  : t('alerts.empty.high')
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;