import { MoreHorizontal } from 'lucide-react';

const AnalyticsChart = () => {
  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-bold text-gray-900">Analytics</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-52 h-52">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="104"
              cy="104"
              r="90"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="24"
              strokeDasharray="339.292 565"
            />
            <circle
              cx="104"
              cy="104"
              r="90"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="24"
              strokeDasharray="113.097 565"
              strokeDashoffset="-339.292"
            />
            <circle
              cx="104"
              cy="104"
              r="90"
              fill="none"
              stroke="#FB923C"
              strokeWidth="24"
              strokeDasharray="112.611 565"
              strokeDashoffset="-452.389"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-900">80%</div>
            <div className="text-sm text-gray-500">Transactions</div>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Sale</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Distribute</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Return</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
