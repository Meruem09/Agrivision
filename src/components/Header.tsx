import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Satellite, Bell, LogOut, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAlerts } from '../contexts/AlertContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { unreadCount } = useAlerts();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    { path: '/', label: t('nav.dashboard') },
    { path: '/map', label: t('nav.map') },
    { path: '/alerts', label: t('nav.alerts') },
    { path: '/marketplace', label: t('nav.marketplace') },
    { path: '/advisory', label: t('nav.advisory') }
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'gu', label: 'ગુજરાતી' }
  ];

  return (
    <header className="bg-white shadow-lg border-b-2 border-green-500">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 p-2 rounded-lg">
              <Satellite className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
              {t('app.title')}
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-green-600 transition-colors">
                <Globe className="h-4 w-4" />
                <span className="text-sm">{language.toUpperCase()}</span>
              </button>
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border hidden group-hover:block z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as 'en' | 'hi' | 'gu')}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-green-50 ${language === lang.code ? 'bg-green-100 text-green-700' : 'text-gray-700'
                      }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <Link
              to="/alerts"
              className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user.role}</div>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
                title={t('nav.logout')}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${location.pathname === item.path
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;