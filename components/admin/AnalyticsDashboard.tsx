'use client';

import React from "react"

import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
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

const brandPerformanceData = [
  { brand: 'Apex Motors', sales: 42, customizations: 58 },
  { brand: 'Velocity Dynamics', sales: 38, customizations: 52 },
  { brand: 'EliteForge', sales: 35, customizations: 48 },
  { brand: 'QuantumDrive', sales: 28, customizations: 35 },
];

const pricePointAnalysis = [
  { vehicle: 'Apex GT-R', price: 89, popularity: 85 },
  { vehicle: 'Velocity RS', price: 95, popularity: 88 },
  { vehicle: 'EliteForge Classico', price: 125, popularity: 72 },
  { vehicle: 'QuantumDrive X1', price: 78, popularity: 80 },
];

const monthlyActiveUsers = [
  { month: 'Jan', users: 2400, engaged: 2100 },
  { month: 'Feb', users: 2900, engaged: 2200 },
  { month: 'Mar', users: 3200, engaged: 2600 },
  { month: 'Apr', users: 3800, engaged: 3100 },
  { month: 'May', users: 4200, engaged: 3800 },
  { month: 'Jun', users: 4800, engaged: 4300 },
];

const customizationPopularity = [
  { name: 'Paint', value: 28, fill: '#3b82f6' },
  { name: 'Wheels', value: 22, fill: '#8b5cf6' },
  { name: 'Interior', value: 18, fill: '#ec4899' },
  { name: 'Exterior', value: 20, fill: '#f59e0b' },
  { name: 'Performance', value: 12, fill: '#10b981' },
];

const AnalyticsCard = ({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Card className={`p-6 ${className}`}>
    <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>
    {children}
  </Card>
);

export function AnalyticsDashboard() {
  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Order Value', value: '$11,250' },
          { label: 'Conversion Rate', value: '3.2%' },
          { label: 'Customer Retention', value: '87%' },
          { label: 'Avg Customizations/Sale', value: '2.4' },
        ].map((metric) => (
          <Card key={metric.label} className="p-6 bg-gradient-to-br from-card to-muted/20">
            <p className="text-sm font-medium text-muted-foreground">
              {metric.label}
            </p>
            <p className="text-2xl font-bold text-foreground mt-2">{metric.value}</p>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsCard title="Brand Performance Comparison">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={brandPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="brand" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="customizations" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Price vs Popularity Analysis">
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: -10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" dataKey="price" stroke="#666" />
              <YAxis type="number" dataKey="popularity" stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Scatter name="Vehicles" data={pricePointAnalysis} fill="#3b82f6" />
            </ScatterChart>
          </ResponsiveContainer>
        </AnalyticsCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnalyticsCard title="Monthly Active Users" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={monthlyActiveUsers}
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
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="engaged"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Customization Popularity">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customizationPopularity}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {customizationPopularity.map((entry, index) => (
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
            {customizationPopularity.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
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
        </AnalyticsCard>
      </div>

      {/* Detailed Metrics Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Top Performing Customization Assets
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Asset Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Units Sold
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Revenue
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                {
                  name: 'Carbon Black Pearl',
                  category: 'Paint',
                  units: 42,
                  revenue: '$126,000',
                  growth: '+18%',
                },
                {
                  name: '20-inch Forged Titanium Wheels',
                  category: 'Wheels',
                  units: 38,
                  revenue: '$209,000',
                  growth: '+24%',
                },
                {
                  name: 'Premium Leather Interior',
                  category: 'Interior',
                  units: 35,
                  revenue: '$280,000',
                  growth: '+12%',
                },
                {
                  name: 'Carbon Fiber Body Kit',
                  category: 'Exterior',
                  units: 18,
                  revenue: '$216,000',
                  growth: '+9%',
                },
                {
                  name: 'ECU Tune Performance Package',
                  category: 'Performance',
                  units: 52,
                  revenue: '$166,400',
                  growth: '+31%',
                },
              ].map((asset, index) => (
                <tr key={index} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {asset.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {asset.category}
                  </td>
                  <td className="px-4 py-3 text-foreground">{asset.units}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">
                    {asset.revenue}
                  </td>
                  <td className="px-4 py-3 text-green-500 font-semibold">
                    {asset.growth}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
