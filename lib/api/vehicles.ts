import { API_ENDPOINTS, fetcher } from '../api-config';
import { Vehicle } from '../types';

// Get all vehicles
export const getAllVehicles = async (): Promise<Vehicle[]> => {
  const response = await fetcher(API_ENDPOINTS.vehicles);
  return response.data;
};

// Get vehicles by brand
export const getVehiclesByBrand = async (brandId: string): Promise<Vehicle[]> => {
  const response = await fetcher(API_ENDPOINTS.vehiclesByBrand(brandId));
  return response.data;
};

// Get vehicle by ID
export const getVehicleById = async (id: string): Promise<Vehicle> => {
  const response = await fetcher(API_ENDPOINTS.vehicle(id));
  return response.data;
};

// Create new vehicle
export const createVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'createdAt'>): Promise<Vehicle> => {
  const response = await fetcher(API_ENDPOINTS.vehicles, {
    method: 'POST',
    body: JSON.stringify(vehicleData),
  });
  return response.data;
};

// Update vehicle
export const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
  const response = await fetcher(API_ENDPOINTS.vehicle(id), {
    method: 'PUT',
    body: JSON.stringify(vehicleData),
  });
  return response.data;
};

// Delete vehicle
export const deleteVehicle = async (id: string): Promise<void> => {
  await fetcher(API_ENDPOINTS.vehicle(id), {
    method: 'DELETE',
  });
};

// Upload vehicle 3D model (GLB file)
export const uploadVehicleModel = async (file: File): Promise<{ filename: string; modelUrl: string; size: number }> => {
  const formData = new FormData();
  formData.append('model', file);

  // Must manually add the auth token — can't use fetcher() because FormData
  // requires the browser to set Content-Type (with multipart boundary) itself.
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const response = await fetch(API_ENDPOINTS.uploadVehicleModel, {
    method: 'POST',
    body: formData,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'File upload failed');
  }

  return data.data;
};
