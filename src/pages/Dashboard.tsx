import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import ReportsChart from '../components/ReportsChart';
import AnalyticsChart from '../components/AnalyticsChart';
import { Users, Wallet, Coins, TrendingUp, RefreshCw, AlertCircle, Clock, CheckCircle2, X, Activity, Ticket, RotateCcw, Shield } from 'lucide-react';
import {
  getDashboardStatistics,
  DashboardStatistics,
  getCronJobsStatus,
  getDailyResetStatus,
  CronJobsStatusResponse,
  DailyResetStatusResponse,
} from '../services/api';

const Dashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [dashboardData, setDashboardData] = useState<DashboardStatistics | null>(null);
  const [days, setDays] = useState(30);
  const [cronJobsStatus, setCronJobsStatus] = useState<CronJobsStatusResponse | null>(null);
  const [dailyResetStatus, setDailyResetStatus] = useState<DailyResetStatusResponse | null>(null);
  const [loadingCronStatus, setLoadingCronStatus] = useState(false);
  const [loadingDailyReset, setLoadingDailyReset] = useState(false);
  const [showCronModal, setShowCronModal] = useState(false);
  const [showDailyResetModal, setShowDailyResetModal] = useState(false);

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

  const fetchCronJobsStatus = async () => {
    setLoadingCronStatus(true);
    setError('');
    try {
      const response = await getCronJobsStatus();
      setCronJobsStatus(response);
      setShowCronModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cron jobs status');
    } finally {
      setLoadingCronStatus(false);
    }
  };

  const fetchDailyResetStatus = async () => {
    setLoadingDailyReset(true);
    setError('');
    try {
      const response = await getDailyResetStatus();
      setDailyResetStatus(response);
      setShowDailyResetModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load daily reset status');
    } finally {
      setLoadingDailyReset(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
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
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-8">
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

            {/* Cron Jobs Management Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Clock className="text-indigo-600" size={24} />
                    Cron Jobs Management
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Monitor and check automated system jobs</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={fetchCronJobsStatus}
                  disabled={loadingCronStatus}
                  className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl hover:border-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                      <Activity className="text-indigo-600" size={24} />
                    </div>
                    {loadingCronStatus && <RefreshCw className="animate-spin text-indigo-600" size={20} />}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">Get Cron Jobs Status</h3>
                  <p className="text-sm text-gray-600">View status and schedule of all automated cron jobs</p>
                </button>

                <button
                  onClick={fetchDailyResetStatus}
                  disabled={loadingDailyReset}
                  className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl hover:border-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <RefreshCw className="text-green-600" size={24} />
                    </div>
                    {loadingDailyReset && <RefreshCw className="animate-spin text-green-600" size={20} />}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">Check Daily Reset Status</h3>
                  <p className="text-sm text-gray-600">View daily limit reset statistics and status</p>
                </button>
              </div>
            </div>
          </>
        ) : null}

        {/* Cron Jobs Status Modal */}
        {showCronModal && cronJobsStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Activity className="text-indigo-600" size={24} />
                  Cron Jobs Status
                </h3>
                <button
                  onClick={() => {
                    setShowCronModal(false);
                    setCronJobsStatus(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Daily Reset Job */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-800">Daily Reset Job</h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cronJobsStatus.data.dailyResetJob.scheduled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {cronJobsStatus.data.dailyResetJob.scheduled ? 'Scheduled' : 'Not Scheduled'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Schedule</div>
                      <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                        <Clock size={16} className="text-indigo-600" />
                        {cronJobsStatus.data.dailyResetJob.schedule}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Description</div>
                      <div className="text-sm text-gray-700">{cronJobsStatus.data.dailyResetJob.description}</div>
                    </div>
                  </div>
                </div>

                {/* Cleanup Old Records Job */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-800">Cleanup Old Records Job</h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cronJobsStatus.data.cleanupOldRecordsJob.scheduled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {cronJobsStatus.data.cleanupOldRecordsJob.scheduled ? 'Scheduled' : 'Not Scheduled'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Schedule</div>
                      <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                        <Clock size={16} className="text-blue-600" />
                        {cronJobsStatus.data.cleanupOldRecordsJob.schedule}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Description</div>
                      <div className="text-sm text-gray-700">{cronJobsStatus.data.cleanupOldRecordsJob.description}</div>
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Note:</p>
                      <p>{cronJobsStatus.data.note}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowCronModal(false);
                    setCronJobsStatus(null);
                  }}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Daily Reset Status Modal */}
        {showDailyResetModal && dailyResetStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <RefreshCw className="text-green-600" size={24} />
                  Daily Reset Status
                </h3>
                <button
                  onClick={() => {
                    setShowDailyResetModal(false);
                    setDailyResetStatus(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Reset Time</div>
                    <div className="text-sm font-medium text-gray-800">{formatDate(dailyResetStatus.data.resetTime)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Today</div>
                    <div className="text-sm font-medium text-gray-800">{formatDate(dailyResetStatus.data.today)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Yesterday</div>
                    <div className="text-sm font-medium text-gray-800">{formatDate(dailyResetStatus.data.yesterday)}</div>
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Daily Limit Statistics</h4>
                  <div className="space-y-4">
                    {/* Scratch Card */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-semibold text-gray-800">Scratch Card</h5>
                        <Ticket className="text-yellow-600" size={20} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Today</div>
                          <div className="text-2xl font-bold text-gray-800">{dailyResetStatus.data.statistics.scratchCard.today}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Yesterday</div>
                          <div className="text-2xl font-bold text-gray-600">{dailyResetStatus.data.statistics.scratchCard.yesterday}</div>
                        </div>
                      </div>
                    </div>

                    {/* Daily Spin */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-semibold text-gray-800">Daily Spin</h5>
                        <RotateCcw className="text-purple-600" size={20} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Today</div>
                          <div className="text-2xl font-bold text-gray-800">{dailyResetStatus.data.statistics.dailySpin.today}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Yesterday</div>
                          <div className="text-2xl font-bold text-gray-600">{dailyResetStatus.data.statistics.dailySpin.yesterday}</div>
                        </div>
                      </div>
                    </div>

                    {/* Captcha */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-semibold text-gray-800">Captcha</h5>
                        <Shield className="text-blue-600" size={20} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Today</div>
                          <div className="text-2xl font-bold text-gray-800">{dailyResetStatus.data.statistics.captcha.today}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Yesterday</div>
                          <div className="text-2xl font-bold text-gray-600">{dailyResetStatus.data.statistics.captcha.yesterday}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-green-800">
                      <p className="font-semibold mb-1">Note:</p>
                      <p>{dailyResetStatus.data.note}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowDailyResetModal(false);
                    setDailyResetStatus(null);
                  }}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
