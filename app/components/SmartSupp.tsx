'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

// Declare global types
declare global {
  interface Window {
    _smartsupp: any;
    smartsupp: any;
  }
}

export default function SmartSupp() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  
  useEffect(() => {
    if (isAdminPage) return;

    // Load Smartsupp script
    var _smartsupp = window._smartsupp = window._smartsupp || {};
    _smartsupp.key = '1e97a2c8de93603e092ca3b2d43b48f21e673b37';
    
    (function(d) {
      var s = d.createElement('script');
      s.type = 'text/javascript';
      s.charset = 'utf-8';
      s.async = true;
      s.src = 'https://www.smartsuppchat.com/loader.js?';
      (d.getElementsByTagName('head')[0] || d.getElementsByTagName('body')[0]).appendChild(s);
    })(document);
    
    return () => {
      // Cleanup if needed
      if (window.smartsupp) {
        // Optional: hide or cleanup on unmount
      }
    };
  }, [isAdminPage]);

  // Renders nothing in the DOM
  return null;
} 