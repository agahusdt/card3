'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserInfo from '../components/dashboard/UserInfo';
import UserTierComponent from '../components/dashboard/UserTier';
import PurchaseList from '../components/dashboard/PurchaseList';
import SalesProgress from '../components/dashboard/SalesProgress';
import ElonMuskPost from '../components/dashboard/ElonMuskPost';

// Random purchase generator functions
const generateRandomHash = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  return Array(5).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('') + '...' + Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const generateRandomAmount = () => {
  return (Math.random() * (5000 - 100) + 100).toFixed(4);
};

const generateRandomGrokAmount = () => {
  return Math.floor(Math.random() * (1000 - 100) + 100);
};

// CoinGecko API endpoints
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Price state interface
interface CryptoPrices {
  bnb: number;
  bitcoin: number;
  ethereum: number;
  tether: number;
  dogecoin: number;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  balance: number;
  emailVerified: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrices>({ 
    bnb: 0, 
    bitcoin: 0, 
    ethereum: 0,
    tether: 0,
    dogecoin: 0
  });
  const [purchases, setPurchases] = useState<Array<{
    id: string;
    currency: string;
    amount: string;
    grokAmount: number;
    hash: string;
    time: number;
  }>>([]);
  const [currentTier, setCurrentTier] = useState({ 
    name: 'Basic', 
    bonus: 0, 
    progress: 0, 
    nextTier: 'Bronze', 
    nextAmount: 100,
    currentMin: 0,
    nextMin: 100
  });

  // Fetch crypto prices from CoinGecko with better error handling and caching
  const fetchCryptoPrices = async () => {
    try {
      const cachedPrices = localStorage.getItem('cryptoPrices');
      const cachedTime = localStorage.getItem('cryptoPricesTime');
      
      // If we have cached data less than 5 minutes old, use it
      if (cachedPrices && cachedTime) {
        const now = Date.now();
        const cacheTime = parseInt(cachedTime);
        
        if (now - cacheTime < 5 * 60 * 1000) { // 5 minutes
          // Önbellekten fiyatları kullan
          setCryptoPrices(JSON.parse(cachedPrices));
          return;
        }
      }
      
      // If no cache or it's old, fetch from API
      const response = await fetch('/api/crypto-prices');

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCryptoPrices(data.data);
        
        // Save to state and cache
        localStorage.setItem('cryptoPrices', JSON.stringify(data.data));
        localStorage.setItem('cryptoPricesTime', Date.now().toString());
      } else {
        // API hatası, önbellekteki verileri kullan
        if (cachedPrices) {
          setCryptoPrices(JSON.parse(cachedPrices));
        } else {
          // Use fallback values if no cache is available
          const fallbackPrices = {
            bnb: 606,
            bitcoin: 67824,
            ethereum: 3340,
            tether: 1,
            dogecoin: 0.15
          };
          setCryptoPrices(fallbackPrices);
          localStorage.setItem('cryptoPrices', JSON.stringify(fallbackPrices));
          localStorage.setItem('cryptoPricesTime', Date.now().toString());
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('Request timeout fetching crypto prices');
      } else {
        console.error('Error fetching crypto prices:', error);
      }
    }
  };

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

  // Function to determine user's tier based on balance
  const getUserTier = (balance: number) => {
    if (balance < 80) {
      return { 
        name: 'Basic', 
        bonus: 0, 
        progress: 0, 
        nextTier: 'Bronze', 
        nextAmount: 100 - balance,
        currentMin: 0,
        nextMin: 100
      };
    }
    if (balance < 100) {
      return { 
        name: 'Basic', 
        bonus: 0, 
        progress: (balance / 100) * 100, 
        nextTier: 'Bronze', 
        nextAmount: 100 - balance,
        currentMin: 0,
        nextMin: 100
      };
    }
    if (balance < 250) {
      return { 
        name: 'Bronze', 
        bonus: 5, 
        progress: ((balance - 100) / 150) * 100, 
        nextTier: 'Silver', 
        nextAmount: 250 - balance,
        currentMin: 100,
        nextMin: 250
      };
    }
    if (balance < 1000) {
      return { 
        name: 'Silver', 
        bonus: 10, 
        progress: ((balance - 250) / 750) * 100, 
        nextTier: 'Gold', 
        nextAmount: 1000 - balance,
        currentMin: 250,
        nextMin: 1000
      };
    }
    if (balance < 5000) {
      return { 
        name: 'Gold', 
        bonus: 15, 
        progress: ((balance - 1000) / 4000) * 100, 
        nextTier: 'Platinum', 
        nextAmount: 5000 - balance,
        currentMin: 1000,
        nextMin: 5000
      };
    }
    if (balance < 25000) {
      return { 
        name: 'Platinum', 
        bonus: 20, 
        progress: ((balance - 5000) / 20000) * 100, 
        nextTier: 'Diamond', 
        nextAmount: 25000 - balance,
        currentMin: 5000,
        nextMin: 25000
      };
    }
    if (balance < 50000) {
      return { 
        name: 'Diamond', 
        bonus: 25, 
        progress: ((balance - 25000) / 25000) * 100, 
        nextTier: 'Legend', 
        nextAmount: 50000 - balance,
        currentMin: 25000,
        nextMin: 50000
      };
    }
    return { 
      name: 'Legend', 
      bonus: 30, 
      progress: 100, 
      nextTier: '', 
      nextAmount: 0,
      currentMin: 50000,
      nextMin: 50000
    };
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        
        if (!data.success) {
          console.error('Failed to fetch user data:', data.error);
          router.push('/');
          return;
        }
        
        setUserData(data.data);
        setCurrentTier(getUserTier(data.data.balance));
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        router.push('/');
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    // Fetch initial crypto prices
    fetchCryptoPrices();

    // Update crypto prices every 5 minutes (300000ms)
    const priceInterval = setInterval(fetchCryptoPrices, 300000);

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
      clearInterval(priceInterval);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 mt-20 md:mt-0">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-2xl blur-3xl" />
        <div className="relative">
          <div className="space-y-2" style={{ opacity: 1 }}>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-7 space-y-6">
                <div className="mb-6" style={{ opacity: 1, transform: 'none' }}>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                </div>
                <UserInfo userData={userData} isLoading={isLoading} />
                <SalesProgress />
              </div>
              <div className="col-span-12 lg:col-span-5 space-y-6">
                <UserTierComponent currentTier={currentTier} />
                <PurchaseList cryptoPrices={cryptoPrices} />
              </div>
            </div>
            <div className="col-span-12 w-full" style={{ opacity: 1, transform: 'none' }}>
              <ElonMuskPost />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 