'use client';

import React from "react"

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Tag,
  Car,
  BarChart3,
  Menu,
  X,
  LogOut,
  Home,
  Layers,
  ShoppingBag,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  id: string;
}

const navItems: NavItem[] = [
  {
    label: 'Overview',
    href: '#overview',
    icon: <LayoutDashboard className="w-5 h-5" />,
    id: 'overview',
  },
  {
    label: 'Brands',
    href: '#brands',
    icon: <Tag className="w-5 h-5" />,
    id: 'brands',
  },
  {
    label: 'Vehicles',
    href: '#vehicles',
    icon: <Car className="w-5 h-5" />,
    id: 'vehicles',
  },
  {
    label: 'Analytics',
    href: '#analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    id: 'analytics',
  },
  {
    label: 'Assets',
    href: '#assets',
    icon: <Layers className="w-5 h-5" />,
    id: 'assets',
  },
  {
    label: 'Orders',
    href: '#orders',
    icon: <ShoppingBag className="w-5 h-5" />,
    id: 'orders',
  },
];

interface SidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-4 z-50 lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="px-6 py-8 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                ⚡
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AutoForge</h1>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  'text-sm font-medium',
                  activeSection === item.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer Section */}
          <div className="px-4 py-6 border-t border-border">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="text-sm font-medium text-foreground">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 bg-transparent"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Site
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
