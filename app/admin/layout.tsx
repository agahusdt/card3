'use client';

import { ReactNode, useEffect } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // Disable Smartsupp in admin pages
  useEffect(() => {
    // Check if Smartsupp is loaded and hide it
    if (typeof window !== 'undefined' && (window as any).smartsupp) {
      (window as any).smartsupp('chat:hide');
    }
    
    // Add event listener for when SmartSupp loads later
    const hideSmartSupp = () => {
      if ((window as any).smartsupp) {
        (window as any).smartsupp('chat:hide');
      }
    };
    
    // Check every few seconds until SmartSupp is loaded
    const interval = setInterval(() => {
      if ((window as any).smartsupp) {
        hideSmartSupp();
        clearInterval(interval);
      }
    }, 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
} 