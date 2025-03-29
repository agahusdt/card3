'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function SmartSupp() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) return null;

  return (
    <>
      <Script id="smartsupp" strategy="afterInteractive">
        {`
          var _smartsupp = _smartsupp || {};
          _smartsupp.key = '1e97a2c8de93603e092ca3b2d43b48f21e673b37';
          window.smartsupp||(function(d) {
            var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
            s=d.getElementsByTagName('script')[0];c=d.createElement('script');
            c.type='text/javascript';c.charset='utf-8';c.async=true;
            c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
          })(document);
        `}
      </Script>
      <noscript> Powered by <a href="https://www.smartsupp.com" target="_blank">Smartsupp</a></noscript>
    </>
  );
} 