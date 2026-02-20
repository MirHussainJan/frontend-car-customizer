import { API_ENDPOINTS, fetcher } from '../api-config';
import { Brand } from '../types';

// Get all brands
export const getAllBrands = async (): Promise<Brand[]> => {
  const response = await fetcher(API_ENDPOINTS.brands);
  return response.data;
};

// Get brand by ID
export const getBrandById = async (id: string): Promise<Brand> => {
  const response = await fetcher(API_ENDPOINTS.brand(id));
  return response.data;
};

// Create new brand
export const createBrand = async (brandData: Omit<Brand, 'id' | 'createdAt'>): Promise<Brand> => {
  const response = await fetcher(API_ENDPOINTS.brands, {
    method: 'POST',
    body: JSON.stringify(brandData),
  });
  return response.data;
};

// Update brand
export const updateBrand = async (id: string, brandData: Partial<Brand>): Promise<Brand> => {
  const response = await fetcher(API_ENDPOINTS.brand(id), {
    method: 'PUT',
    body: JSON.stringify(brandData),
  });
  return response.data;
};

// Delete brand
export const deleteBrand = async (id: string): Promise<void> => {
  await fetcher(API_ENDPOINTS.brand(id), {
    method: 'DELETE',
  });
};
