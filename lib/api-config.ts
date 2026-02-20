// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-car-customizer.vercel.app/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  auth: `${API_BASE_URL}/auth`,
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  me: `${API_BASE_URL}/auth/me`,
  
  // Brands
  brands: `${API_BASE_URL}/brands`,
  brand: (id: string) => `${API_BASE_URL}/brands/${id}`,
  
  // Vehicles
  vehicles: `${API_BASE_URL}/vehicles`,
  vehicle: (id: string) => `${API_BASE_URL}/vehicles/${id}`,
  vehiclesByBrand: (brandId: string) => `${API_BASE_URL}/vehicles?brandId=${brandId}`,
  uploadVehicleModel: `${API_BASE_URL}/vehicles/upload`,
  
  // Customization Assets
  assets: `${API_BASE_URL}/assets`,
  asset: (id: string) => `${API_BASE_URL}/assets/${id}`,
  assetsByCategory: (category: string) => `${API_BASE_URL}/assets?category=${category}`,
  assetsByCategoryPath: (category: string) => `${API_BASE_URL}/assets/category/${category}`,
  
  // Analytics
  analyticsMetrics: `${API_BASE_URL}/analytics/metrics`,
  analytics: `${API_BASE_URL}/analytics`,
  
  // Health
  health: `${API_BASE_URL}/health`,
};

// Helper function for API calls
export const fetcher = async (url: string, options?: RequestInit) => {
  // Get token from localStorage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    // Log detailed error information
    console.error('API Error:', {
      url,
      status: response.status,
      statusText: response.statusText,
      error: data
    });
    throw new Error(data.message || data.error || 'API request failed');
  }

  return data;
};
