import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { setTokenExpirationHandler } from './services/api';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import CaptchaSettings from './pages/CaptchaSettings';
import ReferralSettings from './pages/ReferralSettings';
import DailyBonusSettings from './pages/DailyBonusSettings';
import ScratchCardSettings from './pages/ScratchCardSettings';
import ScratchCardDailyLimitSettings from './pages/ScratchCardDailyLimitSettings';
import SignupBonusSettings from './pages/SignupBonusSettings';
import WithdrawalRequests from './pages/WithdrawalRequests';
import Users from './pages/Users';
import AppsInstall from './pages/AppsInstall';
import CoinConversionSettings from './pages/CoinConversionSettings';
import WithdrawalSettings from './pages/WithdrawalSettings';
import SpinWheelSettings from './pages/SpinWheelSettings';
import CommissionSlabSettings from './pages/CommissionSlabSettings';
import SponsorPromotions from './pages/SponsorPromotions';
import SupportSettings from './pages/SupportSettings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated, handleTokenExpiration } = useAuth();

  useEffect(() => {
    // Set the token expiration handler globally
    setTokenExpirationHandler(handleTokenExpiration);
  }, [handleTokenExpiration]);

  return (
    <Routes>
      {/* Public routes - redirect to dashboard if already authenticated */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />}
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/captcha-settings"
        element={
          <ProtectedRoute>
            <CaptchaSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/referral-settings"
        element={
          <ProtectedRoute>
            <ReferralSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/daily-bonus-settings"
        element={
          <ProtectedRoute>
            <DailyBonusSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scratch-card-settings"
        element={
          <ProtectedRoute>
            <ScratchCardSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scratch-card-daily-limit-settings"
        element={
          <ProtectedRoute>
            <ScratchCardDailyLimitSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/signup-bonus-settings"
        element={
          <ProtectedRoute>
            <SignupBonusSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <WithdrawalRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apps-install"
        element={
          <ProtectedRoute>
            <AppsInstall />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coin-conversion"
        element={
          <ProtectedRoute>
            <CoinConversionSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/withdrawal-settings"
        element={
          <ProtectedRoute>
            <WithdrawalSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/spin-wheel-settings"
        element={
          <ProtectedRoute>
            <SpinWheelSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/commission-slab-settings"
        element={
          <ProtectedRoute>
            <CommissionSlabSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sponsor-promotions"
        element={
          <ProtectedRoute>
            <SponsorPromotions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support-settings"
        element={
          <ProtectedRoute>
            <SupportSettings />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default App;
