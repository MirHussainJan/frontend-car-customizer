'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { getDashboardMetrics } from '@/lib/api';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';

const chartData = [
  { month: 'Jan', revenue: 24000, customizations: 4000 },
  { month: 'Feb', revenue: 30000, customizations: 3000 },
  { month: 'Mar', revenue: 20000, customizations: 9800 },
  { month: 'Apr', revenue: 27800, customizations: 3908 },
  { month: 'May', revenue: 18390, customizations: 4800 },
  { month: 'Jun', revenue: 39490, customizations: 3800 },
];

const assetCategoryData = [
  { name: 'Paint', value: 25, fill: '#3b82f6' },
  { name: 'Wheels', value: 20, fill: '#8b5cf6' },
  { name: 'Interior', value: 20, fill: '#ec4899' },
  { name: 'Exterior', value: 20, fill: '#f59e0b' },
  { name: 'Performance', value: 15, fill: '#10b981' },
];

const StatCard = ({
  label,
  value,
  change,
  isPositive = true,
}: {
  label: string;
  value: string | number;
  change: number;
  isPositive?: boolean;
}) => (
  <Card className="p-6 bg-gradient-to-br from-card to-muted/20">
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <div
        className={`flex items-center gap-1 text-sm font-semibold ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {isPositive ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        <span>{Math.abs(change)}% vs last month</span>
      </div>
    </div>
  </Card>
);

export function OverviewDashboard() {
  const [metrics, setMetrics] = useState({
    totalBrands: 0,
    totalVehicles: 0,
    totalAssets: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      const data = await getDashboardMetrics();
      setMetrics(data);
    } catch (error) {
      toast.error('Failed to load dashboard metrics');
      console.error('Error loading metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Brands" value={metrics.totalBrands} change={12} />
        <StatCard label="Total Vehicles" value={metrics.totalVehicles} change={8} />
        <StatCard label="Total Assets" value={metrics.totalAssets} change={23} />
        <StatCard label="Total Revenue" value={`$${metrics.totalRevenue.toLocaleString()}`} change={15} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Revenue & Customization Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="customizations" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Asset Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Asset Categories
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={assetCategoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {assetCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-sm">
            {assetCategoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-semibold text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Growth Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          12-Month Growth Projection
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="customizations"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
