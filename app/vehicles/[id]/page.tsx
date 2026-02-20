'use client';

import { ClientLayout } from '@/components/client/ClientLayout';
import { VehicleDetail } from '@/components/client/VehicleDetail';
import { use } from 'react';

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return (
    <ClientLayout>
      <VehicleDetail vehicleId={id} />
    </ClientLayout>
  );
}
