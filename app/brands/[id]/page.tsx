'use client';

import { ClientLayout } from '@/components/client/ClientLayout';
import { BrandDetail } from '@/components/client/BrandDetail';
import { use } from 'react';

export default function BrandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return (
    <ClientLayout>
      <BrandDetail brandId={id} />
    </ClientLayout>
  );
}
