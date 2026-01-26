import { useState, useEffect } from 'react';
import { Wallet, Save, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getWithdrawalThreshold, setWithdrawalThreshold, WithdrawalThresholdRequest } from '../services/api';

const WithdrawalSettings = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState<WithdrawalThresholdRequest>({
    MinimumWithdrawalAmount: 100,
  });

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Fetch current settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setFetching(true);
    setError('');
    try {
      const response = await getWithdrawalThreshold();
      if (response.data) {
        setFormData({
          MinimumWithdrawalAmount: response.data.MinimumWithdrawalAmount,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.MinimumWithdrawalAmount < 1) {
      setError('Minimum Withdrawal Amount must be at least 1');
      setLoading(false);
      return;
    }

    try {
      const response = await setWithdrawalThreshold(formData);
      setSuccess(response.message || 'Settings updated successfully');
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isExpanded={isSidebarExpanded} />
      <Header isSidebarExpanded={isSidebarExpanded} onToggleSidebar={toggleSidebar} />

      <div className={`mt-20 p-8 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'}`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Withdrawal Settings</h1>
                <p className="text-gray-500 text-sm">Configure minimum withdrawal amount threshold</p>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
              <p className="text-green-700 text-sm font-medium">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Settings Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {fetching ? (
              <div className="p-12 text-center">
                <RefreshCw className="animate-spin text-green-600 mx-auto mb-4" size={32} />
                <p className="text-gray-500">Loading settings...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8">
                {/* Minimum Withdrawal Amount */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Minimum Withdrawal Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="MinimumWithdrawalAmount"
                      value={formData.MinimumWithdrawalAmount}
                      onChange={handleChange}
                      min="1"
                      step="1"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all text-gray-800"
                      placeholder="Enter minimum withdrawal amount"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      ₹
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    The minimum amount users must have in their wallet to make a withdrawal request (must be at least 1)
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="animate-spin" size={20} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Save Settings
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={fetchSettings}
                    disabled={fetching}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={fetching ? 'animate-spin' : ''} size={20} />
                    Refresh
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Info Card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">About Withdrawal Settings</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• This threshold is enforced when users submit withdrawal requests</li>
                  <li>• Users cannot withdraw amounts below this threshold</li>
                  <li>• Changes take effect immediately after saving</li>
                  <li>• Default minimum withdrawal amount is 100 if not set by admin</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalSettings;
