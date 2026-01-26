import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import ReportsChart from '../components/ReportsChart';
import AnalyticsChart from '../components/AnalyticsChart';
import RecentOrders from '../components/RecentOrders';
import TopSellingProducts from '../components/TopSellingProducts';
import { Heart, Package, ShoppingBag, Briefcase } from 'lucide-react';

const Dashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isExpanded={isSidebarExpanded} />
      <Header isSidebarExpanded={isSidebarExpanded} onToggleSidebar={toggleSidebar} />

      <div className={`mt-20 p-8 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<Heart className="text-blue-500" size={24} />}
            value="178+"
            label="Save Products"
            bgColor="bg-blue-50"
          />
          <StatsCard
            icon={<Package className="text-yellow-500" size={24} />}
            value="20+"
            label="Stock Products"
            bgColor="bg-yellow-50"
          />
          <StatsCard
            icon={<ShoppingBag className="text-orange-500" size={24} />}
            value="190+"
            label="Sales Products"
            bgColor="bg-orange-50"
          />
          <StatsCard
            icon={<Briefcase className="text-blue-600" size={24} />}
            value="12+"
            label="Job Application"
            bgColor="bg-blue-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ReportsChart />
          </div>
          <div>
            <AnalyticsChart />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentOrders />
          </div>
          <div>
            <TopSellingProducts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
