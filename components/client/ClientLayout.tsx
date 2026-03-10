'use client';

import React from "react"

import { ClientHeader } from './ClientHeader';
import { ClientFooter } from './ClientFooter';
import CartSidebar from './CartSidebar';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <ClientHeader />
      <CartSidebar />
      <div className="flex-1">
        {children}
      </div>
      <ClientFooter />
    </div>
  );
}
