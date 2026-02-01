import React, { useState } from 'react';
import { Satellite, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleDemoLogin = (userType: 'farmer' | 'admin') => {
    if (userType === 'farmer') {
      setEmail('farmer@demo.com');
      setPassword('demo123');
    } else {
      setEmail('admin@demo.com');
      setPassword('demo123');
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 relative">
        {/* Brand Logo */}
        <div className="absolute top-8 left-8 sm:left-12 flex items-center gap-2">
          <div className="bg-green-600 p-2 rounded-lg">
            <Satellite className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">CropCare</span>
        </div>

        <div className="mt-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            {t('login.title')}
          </h1>
          <p className="text-gray-500 mb-8 text-lg">
            {t('login.subtitle')}
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                {t('login.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-shadow bg-gray-50"
                placeholder="example@CropCare.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                {t('login.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-shadow bg-gray-50"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
                  {t('login.remember')}
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  {t('login.forgot')}
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-70"
            >
              {loading ? t('common.loading') : t('login.signin')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {t('login.no_account')}{' '}
              <a href="#" className="font-semibold text-green-600 hover:text-green-500">
                {t('login.signup')}
              </a>
            </p>
          </div>

          {/* Quick Demo Login */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">{t('login.demo')}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleDemoLogin('farmer')}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium rounded border border-gray-200 transition-colors"
              >
                {t('login.farmer')}
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium rounded border border-gray-200 transition-colors"
              >
                {t('login.admin')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Illustration */}
      <div className="hidden lg:block lg:w-1/2 bg-green-50 relative overflow-hidden">
        {/* Decorative elements */}

        <div className="relative h-full w-full flex items-center justify-center">
          <img
            src="/images/farmer-login.png"
            alt="AgriTech Illustration"
            className="max-w-full max-h-[80%] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;