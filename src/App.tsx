import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import FarmerDashboard from './components/FarmerDashboard';
import AdminDashboard from './components/AdminDashboard.tsx';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import MapView from './components/MapView';
import AlertsPage from './components/AlertsPage';
import MarketPlace from './components/MarketPlace';
import Advisory from './components/Advisory';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AlertProvider } from './contexts/AlertContext';

function AppRouter() {
  const { user } = useAuth();
  const location = useLocation();

  // Hide header on landing page when user is not logged in
  const isLandingPage = location.pathname === '/' && !user;
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  const hideHeader = isLandingPage || isLoginPage || isSignupPage;

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeader && <Header />}
      <main className={hideHeader ? "" : "container mx-auto px-4 py-6"}>
        <Routes>
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
          <Route path="/" element={user ? <MapView /> : <Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AlertProvider>
          <Router>
            <AppRouter />
          </Router>
        </AlertProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;