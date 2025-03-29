'use client';

import { useState, useEffect } from 'react';

interface CryptoPrices {
  bnb: number;
  bitcoin: number;
  ethereum: number;
  tether: number;
  dogecoin: number;
}

interface Purchase {
  id: string;
  currency: string;
  amount: string;
  grokAmount: number;
  hash: string;
  time: number;
}

interface PurchaseListProps {
  cryptoPrices: CryptoPrices;
}

const generateRandomHash = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  return Array(5).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('') + '...' + Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export default function PurchaseList({ cryptoPrices }: PurchaseListProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const generateRandomPurchase = () => {
    // GROK token price is $4.78
    const GROK_PRICE = 4.78;
    
    // Generate a random USD amount between $500 and $5000
    const usdAmount = Math.floor(Math.random() * 4500) + 500;
    
    // Calculate GROK amount based on USD
    const grokAmount = Math.floor(usdAmount / GROK_PRICE);
    
    // Select random currency with weighted probabilities
    const currencies = ['BNB', 'BTC', 'ETH', 'USDT', 'DOGE'];
    const weights = [0.3, 0.25, 0.25, 0.1, 0.1]; // 30% BNB, 25% BTC, 25% ETH, 10% USDT, 10% DOGE
    
    let random = Math.random();
    let cumulativeWeight = 0;
    let selectedCurrency = currencies[0];
    
    for (let i = 0; i < weights.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        selectedCurrency = currencies[i];
        break;
      }
    }

    // Calculate crypto amount based on current prices
    let cryptoAmount;
    switch (selectedCurrency) {
      case 'BNB':
        cryptoAmount = (usdAmount / (cryptoPrices.bnb || 606)).toFixed(4);
        break;
      case 'BTC':
        cryptoAmount = (usdAmount / (cryptoPrices.bitcoin || 62000)).toFixed(6);
        break;
      case 'ETH':
        cryptoAmount = (usdAmount / (cryptoPrices.ethereum || 3500)).toFixed(4);
        break;
      case 'USDT':
        cryptoAmount = (usdAmount / (cryptoPrices.tether || 1)).toFixed(2);
        break;
      case 'DOGE':
        cryptoAmount = (usdAmount / (cryptoPrices.dogecoin || 0.15)).toFixed(2);
        break;
      default:
        cryptoAmount = '0';
    }

    return {
      id: Math.random().toString(36).substring(7),
      currency: selectedCurrency,
      amount: cryptoAmount,
      grokAmount,
      hash: generateRandomHash(),
      time: 0
    };
  };

  useEffect(() => {
    // Start with 2 initial purchases
    if (purchases.length === 0) {
      const initialPurchases = Array(2)
        .fill(null)
        .map(() => generateRandomPurchase());
      setPurchases(initialPurchases);
    }

    // Update times every second
    const timeInterval = setInterval(() => {
      setPurchases(prev => 
        prev.map(purchase => ({
          ...purchase,
          time: purchase.time + 1
        }))
      );
    }, 1000);

    // Add new purchase every 10 seconds
    const purchaseInterval = setInterval(() => {
      setPurchases(prev => {
        const newPurchase = generateRandomPurchase();
        if (prev.length >= 5) {
          return [newPurchase, ...prev.slice(0, -1)];
        }
        return [newPurchase, ...prev];
      });
    }, 10000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(purchaseInterval);
    };
  }, []);

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'BTC':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bitcoin w-6 h-6 text-orange-400">
            <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"></path>
          </svg>
        );
      case 'ETH':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 32 32"
            className="w-6 h-6"
          >
            <g fill="none" fillRule="evenodd">
              <circle cx="16" cy="16" r="16" fill="#627EEA" fillOpacity="0.2"/>
              <g fill="currentColor" className="text-blue-400">
                <path fillOpacity="0.8" d="M16.498 4v8.87l7.497 3.35z"/>
                <path d="M16.498 4L9 16.22l7.498-3.35z"/>
                <path fillOpacity="0.8" d="M16.498 21.968v6.027L24 17.616z"/>
                <path d="M16.498 27.995v-6.028L9 17.616z"/>
                <path fillOpacity="0.4" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/>
                <path fillOpacity="0.6" d="M9 16.22l7.498 4.353v-7.701z"/>
              </g>
            </g>
          </svg>
        );
      case 'DOGE':
      case 'BNB':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-circle-dollar-sign w-6 h-6 text-${getCurrencyColor(currency)}-400`}>
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
            <path d="M12 18V6"></path>
          </svg>
        );
      case 'USDT':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-dollar-sign w-6 h-6 text-green-400">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
            <path d="M12 18V6"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign w-6 h-6 text-green-400">
            <line x1="12" x2="12" y1="2" y2="22"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        );
    }
  };

  const getCurrencyColor = (currency: string) => {
    switch (currency) {
      case 'BNB':
        return 'yellow';
      case 'DOGE':
        return 'amber';
      case 'USDT':
        return 'green';
      case 'BTC':
        return 'orange';
      case 'ETH':
        return 'blue';
      default:
        return 'blue';
    }
  };

  return (
    <div style={{ opacity: 1, transform: 'none' }}>
      <div className="text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-emerald-500/5 to-blue-500/10 opacity-20 pointer-events-none rounded-2xl group-hover:opacity-30 transition-opacity"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-600 opacity-10 group-hover:opacity-20 blur-xl transition-all duration-300"></div>
        <div className="flex flex-col space-y-1.5 p-6 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="tracking-tight text-lg font-semibold text-white flex items-center gap-2">
              Live Purchases
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-5 h-5 text-blue-400">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
              <path d="M20 3v4"></path>
              <path d="M22 5h-4"></path>
              <path d="M4 17v2"></path>
              <path d="M5 18H3"></path>
            </svg>
          </div>
          <p className="text-sm text-gray-400">Real-time token purchases</p>
        </div>
        <div className="p-6 pt-0 px-6 pb-6 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-white/5" style={{ opacity: 1, transform: 'none' }}>
                <div className="flex items-center gap-4">
                  <div className={`p-2 bg-${getCurrencyColor(purchase.currency)}-900/30 rounded-full`}>
                    {getCurrencyIcon(purchase.currency)}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {purchase.amount} {purchase.currency}
                      <span className="text-gray-400 text-sm ml-2">→</span>
                      <span className="text-green-400 ml-2">{purchase.grokAmount} $GROK</span>
                    </p>
                    <p className="text-gray-400 text-sm">{purchase.hash}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{purchase.time}s ago</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right w-4 h-4 text-green-400">
                    <path d="M7 7h10v10"></path>
                    <path d="M7 17 17 7"></path>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 