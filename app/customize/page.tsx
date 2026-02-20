'use client';

import { ClientLayout } from '@/components/client/ClientLayout';
import { VehicleCatalog } from '@/components/client/VehicleCatalog';

export default function CustomizePage() {
  return (
    <ClientLayout>
      <VehicleCatalog />
    </ClientLayout>
  );
}
