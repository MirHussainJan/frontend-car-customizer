'use client';

import React from "react"
import { useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { OverviewDashboard } from '@/components/admin/OverviewDashboard';
import { BrandManagement } from '@/components/admin/BrandManagement';
import { VehicleManagement } from '@/components/admin/VehicleManagement';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { AssetManagement } from '@/components/admin/AssetManagement';
import { OrderManagement } from '@/components/admin/OrderManagement';
import { ProtectedRoute } from '@/components/ProtectedRoute';

type SectionType = 'overview' | 'brands' | 'vehicles' | 'assets' | 'analytics' | 'orders';

const sectionConfig: Record<
  SectionType,
  {
    title: string;
    description: string;
    component: React.ComponentType;
  }
> = {
  overview: {
    title: 'Dashboard Overview',
    description: 'Real-time metrics and performance indicators',
    component: OverviewDashboard,
  },
  brands: {
    title: 'Brand Management',
    description: 'Create, edit, and manage car brands',
    component: BrandManagement,
  },
  vehicles: {
    title: 'Vehicle Management',
    description: 'Manage vehicle inventory and 3D models with embedded assets',
    component: VehicleManagement,
  },
  analytics: {
    title: 'Analytics & Reports',
    description: 'Detailed analytics and performance metrics',
    component: AnalyticsDashboard,
  },
  assets: {
    title: 'Asset Management',
    description: 'Manage customization assets and components',
    component: AssetManagement,
  },
  orders: {
    title: 'Order Management',
    description: 'Track and manage customer orders',
    component: OrderManagement,
  },
};

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<SectionType>('overview');

  const currentSection = sectionConfig[activeSection];
  const SectionComponent = currentSection.component;

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeSection={activeSection} onNavigate={(id) => setActiveSection(id as SectionType)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
          {/* Header */}
          <Header
            title={currentSection.title}
            description={currentSection.description}
          />

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <SectionComponent />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
