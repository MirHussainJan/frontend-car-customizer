import { API_ENDPOINTS, fetcher } from '../api-config';
import { CustomizationAsset } from '../types';

// Get all customization assets
export const getAllAssets = async (): Promise<CustomizationAsset[]> => {
  const response = await fetcher(API_ENDPOINTS.assets);
  return response.data;
};

// Get assets by category
export const getAssetsByCategory = async (category: string): Promise<CustomizationAsset[]> => {
  const response = await fetcher(API_ENDPOINTS.assetsByCategory(category));
  return response.data;
};

// Get asset by ID
export const getAssetById = async (id: string): Promise<CustomizationAsset> => {
  const response = await fetcher(API_ENDPOINTS.asset(id));
  return response.data;
};

// Create new asset
export const createAsset = async (assetData: Omit<CustomizationAsset, 'id' | 'createdAt'>): Promise<CustomizationAsset> => {
  const response = await fetcher(API_ENDPOINTS.assets, {
    method: 'POST',
    body: JSON.stringify(assetData),
  });
  return response.data;
};

// Update asset
export const updateAsset = async (id: string, assetData: Partial<CustomizationAsset>): Promise<CustomizationAsset> => {
  const response = await fetcher(API_ENDPOINTS.asset(id), {
    method: 'PUT',
    body: JSON.stringify(assetData),
  });
  return response.data;
};

// Delete asset
export const deleteAsset = async (id: string): Promise<void> => {
  await fetcher(API_ENDPOINTS.asset(id), {
    method: 'DELETE',
  });
};
