import { API_ENDPOINTS, fetcher } from '../api-config';
import { DashboardMetrics } from '../types';

// Get dashboard metrics
export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const response = await fetcher(API_ENDPOINTS.analyticsMetrics);
  return response.data;
};

// Get detailed analytics
export const getAnalytics = async (): Promise<{
  vehiclesByBrand: any[];
  assetsByCategory: any[];
  priceStats: {
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
  };
}> => {
  const response = await fetcher(API_ENDPOINTS.analytics);
  return response.data;
};
