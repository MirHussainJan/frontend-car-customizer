'use client';

import React from "react"

import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  isPositive?: boolean;
  trend?: 'up' | 'down' | 'neutral';
  backgroundColor?: string;
}

export function StatCard({
  icon,
  label,
  value,
  change,
  isPositive = true,
  trend,
  backgroundColor = 'from-card to-muted/20',
}: StatCardProps) {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return isPositive ? 'text-green-500' : 'text-red-500';
  };

  const getTrendIcon = () => {
    if (trend === 'up' || (trend !== 'down' && isPositive)) {
      return <TrendingUp className="w-4 h-4" />;
    }
    return <TrendingDown className="w-4 h-4" />;
  };

  return (
    <Card className={`p-6 bg-gradient-to-br ${backgroundColor}`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {icon && <div className="text-2xl">{icon}</div>}
        </div>

        <p className="text-3xl font-bold text-foreground">{value}</p>

        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{Math.abs(change)}% vs last month</span>
          </div>
        )}
      </div>
    </Card>
  );
}
