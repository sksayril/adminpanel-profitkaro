import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import ReportsChart from '../components/ReportsChart';
import AnalyticsChart from '../components/AnalyticsChart';
import { Users, Wallet, Coins, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { getDashboardStatistics, DashboardStatistics } from '../services/api';

const Dashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [dashboardData, setDashboardData] = useState<DashboardStatistics | null>(null);
  const [days, setDays] = useState(30);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getDashboardStatistics(days);
      setDashboardData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [days]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const formatCurrency = (num: number): string => {
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isExpanded={isSidebarExpanded} />
      <Header isSidebarExpanded={isSidebarExpanded} onToggleSidebar={toggleSidebar} />

      <div className={`mt-20 p-8 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'}`}>
        {/* Days Filter */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Overview of your platform statistics</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last year</option>
            </select>
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {loading && !dashboardData ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="animate-spin text-blue-600" size={32} />
          </div>
        ) : dashboardData ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                icon={<Users className="text-blue-500" size={24} />}
                value={formatNumber(dashboardData.users.totalUsers)}
                label="Total Users"
                bgColor="bg-blue-50"
              />
              <StatsCard
                icon={<TrendingUp className="text-green-500" size={24} />}
                value={formatNumber(dashboardData.users.todayRegistrations)}
                label="Today's Registrations"
                bgColor="bg-green-50"
              />
              <StatsCard
                icon={<Wallet className="text-purple-500" size={24} />}
                value={formatCurrency(dashboardData.wallet.totalWalletBalance)}
                label="Total Wallet Balance"
                bgColor="bg-purple-50"
              />
              <StatsCard
                icon={<Coins className="text-yellow-500" size={24} />}
                value={formatNumber(dashboardData.wallet.totalCoins)}
                label="Total Coins"
                bgColor="bg-yellow-50"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <ReportsChart registrationData={dashboardData.registrationChart.data} days={days} />
              </div>
              <div>
                <AnalyticsChart withdrawalStats={dashboardData.withdrawals.statistics} />
              </div>
            </div>

            {/* Withdrawal Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600">Pending Withdrawals</h3>
                  <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-yellow-600" size={20} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {dashboardData.withdrawals.statistics.pending.count}
                </div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(dashboardData.withdrawals.statistics.pending.totalAmount)}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600">Approved Withdrawals</h3>
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-green-600" size={20} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {dashboardData.withdrawals.statistics.approved.count}
                </div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(dashboardData.withdrawals.statistics.approved.totalAmount)}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600">Rejected Withdrawals</h3>
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-red-600" size={20} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {dashboardData.withdrawals.statistics.rejected.count}
                </div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(dashboardData.withdrawals.statistics.rejected.totalAmount)}
                </div>
              </div>
            </div>

            {/* Total Withdrawals Summary */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Total Withdrawals</p>
                  <p className="text-3xl font-bold">{formatCurrency(dashboardData.withdrawals.totalWithdrawals)}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <Wallet className="text-white" size={32} />
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
