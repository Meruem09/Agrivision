import React, { useState } from 'react';
import { Users, Sprout, AlertTriangle, TrendingUp, Download, BarChart3, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedDistrict, setSelectedDistrict] = useState('Ahmedabad');

  const districts = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'];

  const regionalStats = {
    totalFarmers: 12847,
    totalArea: 89234, // in hectares
    activeAlerts: 156,
    healthyFields: 78.2,
    avgNDVI: 0.67
  };

  const cropDistribution = [
    { crop: 'Cotton', percentage: 45, area: 40155 },
    { crop: 'Wheat', percentage: 32, area: 28555 },
    { crop: 'Rice', percentage: 23, area: 20524 }
  ];

  const recentReports = [
    {
      id: '1',
      title: 'Weekly Crop Health Report - Week 45',
      district: 'Ahmedabad',
      date: '2024-11-08',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Pest Risk Assessment - Cotton Belt',
      district: 'Surat',
      date: '2024-11-07',
      status: 'completed'
    },
    {
      id: '3',
      title: 'Irrigation Advisory - Northern Districts',
      district: 'Gandhinagar',
      date: '2024-11-06',
      status: 'pending'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {t('admin.title')}
        </h1>
        <p className="text-blue-100">
          {t('admin.subtitle')} • {user?.name}
        </p>
      </div>

      {/* District Selector */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-800">{t('admin.district')}:</span>
          </div>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {districts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('admin.stats.farmers')}</p>
              <p className="text-2xl font-bold text-gray-800">{regionalStats.totalFarmers.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('admin.stats.area')}</p>
              <p className="text-2xl font-bold text-green-600">{regionalStats.totalArea.toLocaleString()}</p>
            </div>
            <Sprout className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('admin.stats.alerts')}</p>
              <p className="text-2xl font-bold text-red-600">{regionalStats.activeAlerts}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('admin.stats.healthy')}</p>
              <p className="text-2xl font-bold text-green-600">{regionalStats.healthyFields}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('admin.stats.ndvi')}</p>
              <p className="text-2xl font-bold text-blue-600">{regionalStats.avgNDVI}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t('admin.crop.dist')} - {selectedDistrict}</h2>
          <div className="space-y-4">
            {cropDistribution.map((crop, index) => (
              <div key={crop.crop}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">{crop.crop}</span>
                  <span className="text-sm text-gray-600">{crop.percentage}% ({crop.area.toLocaleString()} ha)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                    style={{ width: `${crop.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Status Overview */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t('admin.health.status')}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">{t('crop.healthy')}</span>
              </div>
              <span className="text-green-700 font-bold">78.2%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="font-medium text-yellow-800">{t('crop.warning')}</span>
              </div>
              <span className="text-yellow-700 font-bold">16.4%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="font-medium text-red-800">{t('crop.critical')}</span>
              </div>
              <span className="text-red-700 font-bold">5.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reports and Downloads */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">{t('admin.reports.title')}</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Download className="h-4 w-4" />
            <span>{t('admin.reports.export')}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">{t('admin.reports.table.title')}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">{t('admin.reports.table.district')}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">{t('admin.reports.table.date')}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">{t('admin.reports.table.status')}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">{t('admin.reports.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report) => (
                <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">{report.title}</td>
                  <td className="py-3 px-4 text-gray-600">{report.district}</td>
                  <td className="py-3 px-4 text-gray-600">{new Date(report.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${report.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      {t('admin.reports.view')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;