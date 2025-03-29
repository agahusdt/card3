'use client';

import { useState, useEffect } from 'react';

export default function Status() {
  const [expandedTier, setExpandedTier] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [usdValue, setUsdValue] = useState(0);
  const [currentTier, setCurrentTier] = useState({ 
    name: 'Basic', 
    bonus: 0, 
    progress: 0, 
    nextTier: 'Bronze', 
    nextAmount: 100,
    currentMin: 0,
    nextMin: 100
  });

  const GROK_PRICE = 4.78;

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
    const fetchBalance = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        if (data.success) {
          setBalance(data.data.balance);
          setUsdValue(data.data.balance * 4.78);
          const tier = getUserTier(data.data.balance);
          setCurrentTier(tier);
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    };

    fetchBalance();
  }, []);

  const formatUSD = (amount: number) => {
    return `$${(amount * GROK_PRICE).toFixed(2)}`;
  };

  const formatBalanceUSD = () => {
    return `$${usdValue.toFixed(2)}`;
  };

  const handleTierClick = (tier: string) => {
    setExpandedTier(expandedTier === tier ? null : tier);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 mt-20 md:mt-0">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-2xl blur-3xl"></div>
        <div className="relative">
          <div className="relative text-white">
            <div className="absolute inset-0 backdrop-blur-3xl"></div>
            <div className="relative">
              <div className="max-w-[1400px] mx-auto px-4 py-6 sm:py-12">
                <div className="mb-6 sm:mb-12 space-y-2 sm:space-y-4" style={{ opacity: 1, transform: 'none' }}>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-white to-blue-400 bg-clip-text text-transparent">
                    Status Tiers
                  </h1>
                  <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
                    Explore our exclusive membership tiers and unlock premium benefits.
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                  <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                    <div className="grid gap-3 sm:gap-4" style={{ opacity: 1, transform: 'none' }}>
                      {/* Bronze Tier */}
                      <div style={{ opacity: 1, transform: 'none' }}>
                        <div 
                          className={`
                            group relative cursor-pointer
                            bg-black/40 backdrop-blur-xl
                            border border-white/5 rounded-2xl overflow-hidden
                            transition-all duration-300
                            hover:border-blue-500/50
                            ${expandedTier === 'bronze' ? 'border-blue-500 shadow-[0_0_30px_rgba(0,0,255,0.15)]' : ''}
                          `}
                          onClick={() => handleTierClick('bronze')}
                          tabIndex={0}
                          style={{ transform: 'none' }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          {expandedTier === 'bronze' && <div className="absolute inset-0 bg-blue-500/5"></div>}
                          <div className="relative p-4 sm:p-6">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="relative">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-black/40 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-medal w-5 h-5 sm:w-7 sm:h-7 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"></path>
                                    <path d="M11 12 5.12 2.2"></path>
                                    <path d="m13 12 5.88-9.8"></path>
                                    <path d="M8 7h8"></path>
                                    <circle cx="12" cy="17" r="5"></circle>
                                    <path d="M12 18v-2h-.5"></path>
                                  </svg>
                                </div>
                                {expandedTier === 'bronze' && <div className="absolute -right-1 -top-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full border-2 border-black"></div>}
                              </div>
                              <div className="flex-grow">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                  <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">Bronze Status</h3>
                                  <div className={`
                                    px-2 py-0.5 rounded-full text-xs font-medium
                                    ${expandedTier === 'bronze' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-400'}
                                    transition-colors duration-300
                                  `}>TIER</div>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">100 - 250 tokens</p>
                              </div>
                            </div>
                            <div className="overflow-hidden" style={{ 
                              height: expandedTier === 'bronze' ? 'auto' : '0px', 
                              opacity: expandedTier === 'bronze' ? 1 : 0,
                              transition: 'height 0.3s ease, opacity 0.3s ease'
                            }}>
                              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/5">
                                <div className="grid gap-2 sm:gap-3">
                                  {/* Bronze Benefits */}
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'bronze' ? 1 : 0,
                                      transform: expandedTier === 'bronze' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Priority support via Discord</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'bronze' ? 1 : 0,
                                      transform: expandedTier === 'bronze' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.15s, transform 0.3s ease 0.15s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Bronze member badge on X</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'bronze' ? 1 : 0,
                                      transform: expandedTier === 'bronze' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Entry to monthly token holder giveaways</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Silver Tier */}
                      <div style={{ opacity: 1, transform: 'none' }}>
                        <div 
                          className={`
                            group relative cursor-pointer
                            bg-black/40 backdrop-blur-xl
                            border border-white/5 rounded-2xl overflow-hidden
                            transition-all duration-300
                            hover:border-blue-500/50
                            ${expandedTier === 'silver' ? 'border-blue-500 shadow-[0_0_30px_rgba(0,0,255,0.15)]' : ''}
                          `}
                          onClick={() => handleTierClick('silver')}
                          tabIndex={0}
                          style={{ transform: 'none' }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          {expandedTier === 'silver' && <div className="absolute inset-0 bg-blue-500/5"></div>}
                          <div className="relative p-4 sm:p-6">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="relative">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-black/40 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-medal w-5 h-5 sm:w-7 sm:h-7 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"></path>
                                    <path d="M11 12 5.12 2.2"></path>
                                    <path d="m13 12 5.88-9.8"></path>
                                    <path d="M8 7h8"></path>
                                    <circle cx="12" cy="17" r="5"></circle>
                                    <path d="M12 18v-2h-.5"></path>
                                  </svg>
                                </div>
                                {expandedTier === 'silver' && <div className="absolute -right-1 -top-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full border-2 border-black"></div>}
                              </div>
                              <div className="flex-grow">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                  <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">Silver Status</h3>
                                  <div className={`
                                    px-2 py-0.5 rounded-full text-xs font-medium
                                    ${expandedTier === 'silver' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-400'}
                                    transition-colors duration-300
                                  `}>TIER</div>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">250 - 1,000 tokens</p>
                              </div>
                            </div>
                            <div className="overflow-hidden" style={{ 
                              height: expandedTier === 'silver' ? 'auto' : '0px', 
                              opacity: expandedTier === 'silver' ? 1 : 0,
                              transition: 'height 0.3s ease, opacity 0.3s ease'
                            }}>
                              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/5">
                                <div className="grid gap-2 sm:gap-3">
                                  {/* Silver Benefits */}
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'silver' ? 1 : 0,
                                      transform: expandedTier === 'silver' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">All Bronze benefits</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'silver' ? 1 : 0,
                                      transform: expandedTier === 'silver' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.15s, transform 0.3s ease 0.15s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Exclusive Silver member badge on X</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'silver' ? 1 : 0,
                                      transform: expandedTier === 'silver' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Access to private Silver holders chat</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'silver' ? 1 : 0,
                                      transform: expandedTier === 'silver' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.25s, transform 0.3s ease 0.25s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Early access to new X features</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'silver' ? 1 : 0,
                                      transform: expandedTier === 'silver' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.3s, transform 0.3s ease 0.3s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Voting rights on community proposals</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Gold Tier */}
                      <div style={{ opacity: 1, transform: 'none' }}>
                        <div 
                          className={`
                            group relative cursor-pointer
                            bg-black/40 backdrop-blur-xl
                            border border-white/5 rounded-2xl overflow-hidden
                            transition-all duration-300
                            hover:border-blue-500/50
                            ${expandedTier === 'gold' ? 'border-blue-500 shadow-[0_0_30px_rgba(0,0,255,0.15)]' : ''}
                          `}
                          onClick={() => handleTierClick('gold')}
                          tabIndex={0}
                          style={{ transform: 'none' }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          {expandedTier === 'gold' && <div className="absolute inset-0 bg-blue-500/5"></div>}
                          <div className="relative p-4 sm:p-6">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="relative">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-black/40 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-medal w-5 h-5 sm:w-7 sm:h-7 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"></path>
                                    <path d="M11 12 5.12 2.2"></path>
                                    <path d="m13 12 5.88-9.8"></path>
                                    <path d="M8 7h8"></path>
                                    <circle cx="12" cy="17" r="5"></circle>
                                    <path d="M12 18v-2h-.5"></path>
                                  </svg>
                                </div>
                                {expandedTier === 'gold' && <div className="absolute -right-1 -top-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full border-2 border-black"></div>}
                              </div>
                              <div className="flex-grow">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                  <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">Gold Status</h3>
                                  <div className={`
                                    px-2 py-0.5 rounded-full text-xs font-medium
                                    ${expandedTier === 'gold' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-400'}
                                    transition-colors duration-300
                                  `}>TIER</div>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">1,000 - 5,000 tokens</p>
                              </div>
                            </div>
                            <div className="overflow-hidden" style={{ 
                              height: expandedTier === 'gold' ? 'auto' : '0px', 
                              opacity: expandedTier === 'gold' ? 1 : 0,
                              transition: 'height 0.3s ease, opacity 0.3s ease'
                            }}>
                              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/5">
                                <div className="grid gap-2 sm:gap-3">
                                  {/* Gold Benefits */}
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'gold' ? 1 : 0,
                                      transform: expandedTier === 'gold' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">All Silver benefits</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'gold' ? 1 : 0,
                                      transform: expandedTier === 'gold' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.15s, transform 0.3s ease 0.15s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Verified Gold member badge</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'gold' ? 1 : 0,
                                      transform: expandedTier === 'gold' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Exclusive Gold holders monthly calls</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'gold' ? 1 : 0,
                                      transform: expandedTier === 'gold' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.25s, transform 0.3s ease 0.25s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Access to private investment group</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'gold' ? 1 : 0,
                                      transform: expandedTier === 'gold' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.3s, transform 0.3s ease 0.3s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Early withdrawal options before listing</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Platinum Tier */}
                      <div style={{ opacity: 1, transform: 'none' }}>
                        <div 
                          className={`
                            group relative cursor-pointer
                            bg-black/40 backdrop-blur-xl
                            border border-white/5 rounded-2xl overflow-hidden
                            transition-all duration-300
                            hover:border-blue-500/50
                            ${expandedTier === 'platinum' ? 'border-blue-500 shadow-[0_0_30px_rgba(0,0,255,0.15)]' : ''}
                          `}
                          onClick={() => handleTierClick('platinum')}
                          tabIndex={0}
                          style={{ transform: 'none' }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          {expandedTier === 'platinum' && <div className="absolute inset-0 bg-blue-500/5"></div>}
                          <div className="relative p-4 sm:p-6">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="relative">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-black/40 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-medal w-5 h-5 sm:w-7 sm:h-7 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"></path>
                                    <path d="M11 12 5.12 2.2"></path>
                                    <path d="m13 12 5.88-9.8"></path>
                                    <path d="M8 7h8"></path>
                                    <circle cx="12" cy="17" r="5"></circle>
                                    <path d="M12 18v-2h-.5"></path>
                                  </svg>
                                </div>
                                {expandedTier === 'platinum' && <div className="absolute -right-1 -top-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full border-2 border-black"></div>}
                              </div>
                              <div className="flex-grow">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                  <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">Platinum Status</h3>
                                  <div className={`
                                    px-2 py-0.5 rounded-full text-xs font-medium
                                    ${expandedTier === 'platinum' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-400'}
                                    transition-colors duration-300
                                  `}>TIER</div>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">5,000 - 25,000 tokens</p>
                              </div>
                            </div>
                            <div className="overflow-hidden" style={{ 
                              height: expandedTier === 'platinum' ? 'auto' : '0px', 
                              opacity: expandedTier === 'platinum' ? 1 : 0,
                              transition: 'height 0.3s ease, opacity 0.3s ease'
                            }}>
                              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/5">
                                <div className="grid gap-2 sm:gap-3">
                                  {/* Platinum Benefits */}
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'platinum' ? 1 : 0,
                                      transform: expandedTier === 'platinum' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">All Gold benefits</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'platinum' ? 1 : 0,
                                      transform: expandedTier === 'platinum' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.15s, transform 0.3s ease 0.15s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Elite Platinum badge with special features</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'platinum' ? 1 : 0,
                                      transform: expandedTier === 'platinum' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Direct line to project advisors</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'platinum' ? 1 : 0,
                                      transform: expandedTier === 'platinum' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.25s, transform 0.3s ease 0.25s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Quarterly strategy meetings with team</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'platinum' ? 1 : 0,
                                      transform: expandedTier === 'platinum' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.3s, transform 0.3s ease 0.3s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Exclusive pre-listing allocation rights</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'platinum' ? 1 : 0,
                                      transform: expandedTier === 'platinum' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.35s, transform 0.3s ease 0.35s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Access to high-level networking events</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'platinum' ? 1 : 0,
                                      transform: expandedTier === 'platinum' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.4s, transform 0.3s ease 0.4s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Priority for future X ecosystem airdrops</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Diamond Tier */}
                      <div style={{ opacity: 1, transform: 'none' }}>
                        <div 
                          className={`
                            group relative cursor-pointer
                            bg-black/40 backdrop-blur-xl
                            border border-white/5 rounded-2xl overflow-hidden
                            transition-all duration-300
                            hover:border-blue-500/50
                            ${expandedTier === 'diamond' ? 'border-blue-500 shadow-[0_0_30px_rgba(0,0,255,0.15)]' : ''}
                          `}
                          onClick={() => handleTierClick('diamond')}
                          tabIndex={0}
                          style={{ transform: 'none' }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          {expandedTier === 'diamond' && <div className="absolute inset-0 bg-blue-500/5"></div>}
                          <div className="relative p-4 sm:p-6">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="relative">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-black/40 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-medal w-5 h-5 sm:w-7 sm:h-7 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"></path>
                                    <path d="M11 12 5.12 2.2"></path>
                                    <path d="m13 12 5.88-9.8"></path>
                                    <path d="M8 7h8"></path>
                                    <circle cx="12" cy="17" r="5"></circle>
                                    <path d="M12 18v-2h-.5"></path>
                                  </svg>
                                </div>
                                {expandedTier === 'diamond' && <div className="absolute -right-1 -top-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full border-2 border-black"></div>}
                              </div>
                              <div className="flex-grow">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                  <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">Diamond Status</h3>
                                  <div className={`
                                    px-2 py-0.5 rounded-full text-xs font-medium
                                    ${expandedTier === 'diamond' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-400'}
                                    transition-colors duration-300
                                  `}>TIER</div>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">25,000 - 50,000 tokens</p>
                              </div>
                            </div>
                            <div className="overflow-hidden" style={{ 
                              height: expandedTier === 'diamond' ? 'auto' : '0px', 
                              opacity: expandedTier === 'diamond' ? 1 : 0,
                              transition: 'height 0.3s ease, opacity 0.3s ease'
                            }}>
                              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/5">
                                <div className="grid gap-2 sm:gap-3">
                                  {/* Diamond Benefits */}
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'diamond' ? 1 : 0,
                                      transform: expandedTier === 'diamond' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">All Platinum benefits</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'diamond' ? 1 : 0,
                                      transform: expandedTier === 'diamond' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.15s, transform 0.3s ease 0.15s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Rare Diamond holder badge</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'diamond' ? 1 : 0,
                                      transform: expandedTier === 'diamond' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Private meetings with founding team</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'diamond' ? 1 : 0,
                                      transform: expandedTier === 'diamond' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.25s, transform 0.3s ease 0.25s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">First access to all new X features</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'diamond' ? 1 : 0,
                                      transform: expandedTier === 'diamond' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.3s, transform 0.3s ease 0.3s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Priority allocation in future X projects</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'diamond' ? 1 : 0,
                                      transform: expandedTier === 'diamond' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.35s, transform 0.3s ease 0.35s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Exclusive Diamond holder events</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'diamond' ? 1 : 0,
                                      transform: expandedTier === 'diamond' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.4s, transform 0.3s ease 0.4s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Personal account manager</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'diamond' ? 1 : 0,
                                      transform: expandedTier === 'diamond' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.45s, transform 0.3s ease 0.45s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Access to institutional investor insights</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Legendary Tier */}
                      <div style={{ opacity: 1, transform: 'none' }}>
                        <div 
                          className={`
                            group relative cursor-pointer
                            bg-black/40 backdrop-blur-xl
                            border border-white/5 rounded-2xl overflow-hidden
                            transition-all duration-300
                            hover:border-blue-500/50
                            ${expandedTier === 'legendary' ? 'border-blue-500 shadow-[0_0_30px_rgba(0,0,255,0.15)]' : ''}
                          `}
                          onClick={() => handleTierClick('legendary')}
                          tabIndex={0}
                          style={{ transform: 'none' }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          {expandedTier === 'legendary' && <div className="absolute inset-0 bg-blue-500/5"></div>}
                          <div className="relative p-4 sm:p-6">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="relative">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-black/40 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-medal w-5 h-5 sm:w-7 sm:h-7 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"></path>
                                    <path d="M11 12 5.12 2.2"></path>
                                    <path d="m13 12 5.88-9.8"></path>
                                    <path d="M8 7h8"></path>
                                    <circle cx="12" cy="17" r="5"></circle>
                                    <path d="M12 18v-2h-.5"></path>
                                  </svg>
                                </div>
                                {expandedTier === 'legendary' && <div className="absolute -right-1 -top-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full border-2 border-black"></div>}
                              </div>
                              <div className="flex-grow">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                  <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">Legendary Status</h3>
                                  <div className={`
                                    px-2 py-0.5 rounded-full text-xs font-medium
                                    ${expandedTier === 'legendary' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-400'}
                                    transition-colors duration-300
                                  `}>TIER</div>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">50,000+ tokens</p>
                              </div>
                            </div>
                            <div className="overflow-hidden" style={{ 
                              height: expandedTier === 'legendary' ? 'auto' : '0px', 
                              opacity: expandedTier === 'legendary' ? 1 : 0,
                              transition: 'height 0.3s ease, opacity 0.3s ease'
                            }}>
                              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/5">
                                <div className="grid gap-2 sm:gap-3">
                                  {/* Legendary Benefits */}
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'legendary' ? 1 : 0,
                                      transform: expandedTier === 'legendary' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">All Diamond benefits</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'legendary' ? 1 : 0,
                                      transform: expandedTier === 'legendary' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.15s, transform 0.3s ease 0.15s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Unique Legendary badge (only for 50k+ holders)</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'legendary' ? 1 : 0,
                                      transform: expandedTier === 'legendary' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Direct influence on X ecosystem development</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'legendary' ? 1 : 0,
                                      transform: expandedTier === 'legendary' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.25s, transform 0.3s ease 0.25s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Founding member status in X community</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'legendary' ? 1 : 0,
                                      transform: expandedTier === 'legendary' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.3s, transform 0.3s ease 0.3s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Maximum allocation in all future X projects</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'legendary' ? 1 : 0,
                                      transform: expandedTier === 'legendary' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.35s, transform 0.3s ease 0.35s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Private strategy sessions with X team</p>
                                  </div>
                                  <div className="flex items-start gap-2 sm:gap-3 group/benefit" 
                                    style={{ 
                                      opacity: expandedTier === 'legendary' ? 1 : 0,
                                      transform: expandedTier === 'legendary' ? 'none' : 'translateY(-10px)',
                                      transition: 'opacity 0.3s ease 0.4s, transform 0.3s ease 0.4s'
                                    }}>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover/benefit:scale-110 transition-transform duration-300">
                                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                        <path d="M20 3v4"></path>
                                        <path d="M22 5h-4"></path>
                                        <path d="M4 17v2"></path>
                                        <path d="M5 18H3"></path>
                                      </svg>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Early access to all future X innovations</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Important Note */}
                    <div className="p-4 sm:p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/5" style={{ opacity: 1, transform: 'none' }}>
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-yellow-500/10">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-triangle-alert w-5 h-5 sm:w-6 sm:h-6 text-yellow-400">
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
                            <path d="M12 9v4"></path>
                            <path d="M12 17h.01"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-white">Important Note</h3>
                          <p className="mt-1 text-xs sm:text-sm text-gray-300">Token holding requirements must be maintained to keep tier status and benefits.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Panel */}
                  <div className="lg:col-span-5 space-y-4 sm:space-y-6">
                    {/* User Status Card */}
                    <div className="rounded-2xl bg-black/40 backdrop-blur-xl border border-blue-500/20 overflow-hidden">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/5"></div>
                        <div className="relative p-4 sm:p-6 space-y-4 sm:space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            <div className="sm:col-span-2 bg-black/40 rounded-xl p-3 sm:p-4 border border-white/5">
                              <div className="flex items-center gap-3 sm:gap-4">
                                <div className="p-2 sm:p-3 rounded-xl bg-blue-500/10">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star w-5 h-5 sm:w-6 sm:h-6 text-blue-400">
                                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                                  </svg>
                                </div>
                                <div>
                                  <h3 className="text-xs sm:text-sm text-gray-400">Current Balance</h3>
                                  <div className="space-y-0.5 sm:space-y-1">
                                    <p className="text-xl sm:text-2xl font-bold text-white">{balance} $GROK</p>
                                    <p className="text-xs sm:text-sm text-green-400">{formatBalanceUSD()}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-black/40 rounded-xl p-3 sm:p-4 border border-white/5">
                              <div className="flex sm:flex-col sm:h-full sm:justify-between">
                                <p className="text-xs sm:text-sm text-gray-400">Current Tier</p>
                                <div className="flex items-center gap-2 ml-auto sm:ml-0 sm:mt-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-medal w-4 h-4 sm:w-5 sm:h-5 text-blue-400">
                                    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"></path>
                                    <path d="M11 12 5.12 2.2"></path>
                                    <path d="m13 12 5.88-9.8"></path>
                                    <path d="M8 7h8"></path>
                                    <circle cx="12" cy="17" r="5"></circle>
                                    <path d="M12 18v-2h-.5"></path>
                                  </svg>
                                  <p className="text-base sm:text-lg font-semibold text-blue-400">{currentTier.name} Status</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex justify-between items-end">
                              <div>
                                <h3 className="text-xs sm:text-sm text-gray-400">Progress to {currentTier.nextTier} Status</h3>
                                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">{typeof currentTier.nextAmount === 'number' ? currentTier.nextAmount.toFixed(2) : currentTier.nextAmount} $GROK needed</p>
                              </div>
                              <span className="text-base sm:text-lg font-semibold text-blue-400">{currentTier.progress.toFixed(0)}%</span>
                            </div>
                            <div className="relative">
                              <div className="h-2 sm:h-3 bg-black/40 rounded-full overflow-hidden backdrop-blur-xl border border-white/5">
                                <div className="h-full relative bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: `${currentTier.progress}%` }}>
                                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-shine"></div>
                                </div>
                              </div>
                              <div className="flex justify-between mt-2 text-xs text-gray-400">
                                <div className="flex flex-col items-start">
                                  <span>{currentTier.currentMin}</span>
                                  <span className="text-gray-500 text-xs hidden sm:inline">{formatUSD(currentTier.currentMin)}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span>{currentTier.nextMin}</span>
                                  <span className="text-gray-500 text-xs hidden sm:inline">{formatUSD(currentTier.nextMin)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="p-3 sm:p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up w-4 h-4 sm:w-5 sm:h-5 text-blue-400">
                                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                                  <polyline points="16 7 22 7 22 13"></polyline>
                                </svg>
                                <div>
                                  <p className="text-xs sm:text-sm text-gray-300">
                                    <span className="text-white font-medium">{typeof currentTier.nextAmount === 'number' ? currentTier.nextAmount.toFixed(2) : currentTier.nextAmount} $GROK</span> needed to reach {currentTier.nextTier} Status
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">{formatUSD(currentTier.nextAmount)} needed</p>
                                </div>
                              </div>
                            </div>
                            <a className="block" href="/dashboard/buy-coins">
                              <div className="h-full p-3 sm:p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/10 hover:from-blue-500/20 hover:to-purple-500/20 transition-all cursor-pointer group">
                                <div className="h-full flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus w-4 h-4 sm:w-5 sm:h-5 text-blue-400 group-hover:scale-110 transition-transform">
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5v14"></path>
                                  </svg>
                                  <p className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">Buy more tokens</p>
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Card */}
                    <div className="p-4 sm:p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-blue-500/20">
                      <div className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <div className="p-3 sm:p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                            <h4 className="text-xs sm:text-sm text-gray-400">All-Time High</h4>
                            <p className="text-base sm:text-lg font-semibold text-white mt-1">{balance} $GROK</p>
                          </div>
                          <div className="p-3 sm:p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                            <h4 className="text-xs sm:text-sm text-gray-400">Member Since</h4>
                            <p className="text-base sm:text-lg font-semibold text-white mt-1">March 2025</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {currentTier.nextTier ? (
                            <a href="/dashboard/buy-coins">
                              <button className="whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary shadow hover:bg-primary/90 h-9 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2.5 sm:p-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus w-3.5 h-3.5 sm:w-4 sm:h-4">
                                  <path d="M5 12h14"></path>
                                  <path d="M12 5v14"></path>
                                </svg>
                                Upgrade Status
                              </button>
                            </a>
                          ) : (
                            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/10 text-center">
                              <p className="text-xs sm:text-sm text-red-400">You've reached the highest tier!</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 