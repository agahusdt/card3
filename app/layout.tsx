import type { Metadata } from "next";
import "./globals.css";
// Vercel Analytics artık kullanılmıyor - Cloudflare Analytics otomatik olarak çalışıyor
// import { Analytics } from '@vercel/analytics/react';
// Speed Insights de kaldırılıyor - Cloudflare Analytics yeterli olacak
// import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: "$GROK COIN Presale | Official Grok Coin Platform - Buy Grok Coin",
  description: "$GROK COIN Presale | Official Grok Coin Platform - Buy Grok Coin. Early access with guaranteed allocation before public launch.",
  keywords: "grokcoinsale, grok-coin-sale, groksale, grok-sale, grokcoinbuy, grok-coin-buy, grokbuy, grok-buy, grokcoinpresale, grok-coin-presale, grokpresale, grok-presale, grokcoin, coingrok, coin-grok, groktoken, grok-token, token-grok, grokcryptosale, grok-crypto-sale, crypto-grok-sale, grokcryptobuy, grok-crypto-buy, crypto-grok-buy, grokcryptopresale, grok-crypto-presale, crypto-grok-presale, buygrok, buy-grok, buygrokcoin, buy-grok-coin, buygroktoken, buy-grok-token, buygroksale, buy-grok-sale, officialgrok, official-grok, officialgrokcoin, official-grok-coin, officialgroktoken, official-grok-token, officialgroksale, official-grok-sale, grokpresalecrypto, grok-presale-crypto, grokcryptopresale, grok-crypto-presale",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    title: '$GROK COIN Presale | Official Grok Coin Platform',
    description: 'Early access with guaranteed allocation before public launch.',
    siteName: 'GROK COIN Presale',
    images: [
      {
        url: '/android-chrome-512x512.png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '$GROK COIN Presale',
    description: 'Official Grok Coin Platform - Buy Grok Coin',
    images: ['/android-chrome-512x512.png']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="stylesheet" href="/css/cc4d93477c984ee6.css" />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
        
        {/* SmartSupp Chat Script */}
        <Script id="smartsupp-chat" strategy="afterInteractive">
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
      </body>
    </html>
  );
}
