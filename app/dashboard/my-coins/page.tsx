'use client';

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TOKEN_PRICE } from '@/lib/constants';

interface Transaction {
  id: string;
  type: 'purchase' | 'transaction';
  cryptoAmount?: string;
  cryptoSymbol?: string;
  tokenAmount: number;
  bonusAmount?: number;
  amount?: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  createdAt?: string;
  date?: string;
  orderId?: string;
  transactionType?: 'TOKEN_PURCHASE' | 'TRANSACTION';
}

interface UserData {
  id: string;
  email: string;
  name: string;
  balance: number;
  emailVerified: boolean;
}

export default function MyCoinsPage() {
  const router = useRouter();
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isCheckingBalance, setIsCheckingBalance] = useState(true);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [error, setError] = useState('');
  const [showLiveSupport, setShowLiveSupport] = useState(false);

  // Date formatter function
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return '-';
      
      // Custom date format: DD.MM.YYYY
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}.${month}.${year}`;
    } catch (err) {
      return '-';
    }
  };
  
  // Time formatter function
  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return '-';
      
      // Custom time format: HH:MM:SS
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      
      return `${hours}:${minutes}:${seconds}`;
    } catch (err) {
      return '-';
    }
  };

  useEffect(() => {
    // Fetch user data when component mounts
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
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        router.push('/');
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    // İşlemleri getir
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        const data = await response.json();
        
        if (data.success) {
          // Gereksiz log kaldırıldı
          setTransactions(data.data);
        } else {
          setError("Failed to fetch transactions");
        }
      } catch (err) {
        setError("An error occurred while fetching your transactions");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    if (isWithdrawDialogOpen) {
      setIsCheckingBalance(true);
      const timer = setTimeout(() => {
        setIsCheckingBalance(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isWithdrawDialogOpen]);

  const handleWithdraw = () => {
    setShowLiveSupport(true);
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

  // Calculate USD value based on current token price (imported from constants)
  const usdValue = userData?.balance ? (userData.balance * TOKEN_PRICE).toFixed(2) : '0.00';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-20 md:mt-0">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-2xl blur-3xl"></div>
        <div className="relative">
          <div className="space-y-8" style={{ opacity: 1 }}>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-8 space-y-6">
                <div className="flex flex-col gap-4" style={{ opacity: 1, transform: 'none' }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
                      Token Management
                    </h1>
                    <div className="flex items-center gap-3">
                      <a href="/dashboard/buy-coins">
                        <button className="justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-9 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transform transition hover:scale-105 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus w-4 h-4">
                            <path d="M5 12h14"></path>
                            <path d="M12 5v14"></path>
                          </svg>
                          Buy $GROK
                        </button>
                      </a>
                      <button 
                        onClick={() => setIsWithdrawDialogOpen(true)}
                        className="justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-9 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transform transition hover:scale-105 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right w-4 h-4">
                          <path d="M7 7h10v10" />
                          <path d="M7 17 17 7" />
                        </svg>
                        Withdraw
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ opacity: 1, transform: 'none' }}>
                  <div className="text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="col-span-2 md:col-span-1 space-y-2">
                          <p className="text-gray-400 text-sm">Total Balance</p>
                          <h3 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                            {Number(userData?.balance || 0).toLocaleString()} $GROK
                          </h3>
                          <p className="text-lg text-green-400">${Number(usdValue || 0).toLocaleString()}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-gray-400 text-sm">Purchased</p>
                          <h3 className="text-2xl font-bold text-blue-400">{userData?.balance || 0} $GROK</h3>
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card w-4 h-4">
                              <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                              <line x1="2" x2="22" y1="10" y2="10"></line>
                            </svg>
                            Total Invested
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-gray-400 text-sm">Bonus Earned</p>
                          <h3 className="text-2xl font-bold text-purple-400">0 $GROK</h3>
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gift w-4 h-4">
                              <rect x="3" y="8" width="18" height="4" rx="1"></rect>
                              <path d="M12 8v13"></path>
                              <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path>
                              <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path>
                            </svg>
                            From Referrals
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ opacity: 1, transform: 'none' }}>
                  <div className="text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl">
                    <div className="flex-col space-y-1.5 p-6 flex items-center justify-between px-6 py-4 border-b border-white/5">
                      <div className="space-y-1">
                        <div className="tracking-tight text-xl font-semibold text-white">Recent Activity</div>
                        <p className="text-sm text-gray-400">Your latest transactions</p>
                      </div>
                      <button 
                        onClick={() => setIsHistoryDialogOpen(true)}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent h-9 px-4 py-2 text-blue-400 hover:text-blue-300"
                      >
                        View All
                      </button>
                    </div>
                    <div className="p-6">
                      {transactions.length > 0 ? (
                        <div className="space-y-4">
                          {transactions.slice(0, 5).map((transaction) => (
                            <div 
                              key={transaction.id} 
                              className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition"
                            >
                              <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl ${
                                  transaction.status === 'APPROVED' 
                                    ? 'bg-green-500/20' 
                                    : transaction.status === 'PENDING' 
                                    ? 'bg-yellow-500/20'
                                    : 'bg-red-500/20'
                                }`}>
                                  {transaction.status === 'APPROVED' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check w-5 h-5 text-green-400">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  ) : transaction.status === 'PENDING' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-5 h-5 text-yellow-400">
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-5 h-5 text-red-400">
                                      <path d="M18 6 6 18"></path>
                                      <path d="m6 6 12 12"></path>
                                    </svg>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-white">
                                    {transaction.type === 'purchase' || transaction.transactionType === 'TOKEN_PURCHASE'
                                      ? `${transaction.cryptoAmount || ''} ${transaction.cryptoSymbol || ''}`
                                      : `${transaction.tokenAmount || 0} $GROK`
                                    }
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    {transaction.tokenAmount || 0} $GROK
                                  </p>
                                  {transaction.bonusAmount && transaction.bonusAmount > 0 && (
                                    <p className="text-sm text-emerald-400">
                                      +{transaction.bonusAmount} $GROK Bonus
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-400">
                                  {formatDate(transaction.date || transaction.createdAt)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatTime(transaction.date || transaction.createdAt)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-400">No recent activity to show</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4 space-y-6">
                <div style={{ opacity: 1, transform: 'none' }}>
                  <div className="text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl">
                    <div className="flex flex-col space-y-1.5 p-6 px-6 py-4 border-b border-white/5">
                      <div className="tracking-tight text-xl font-semibold text-white">Quick Actions</div>
                    </div>
                    <div className="p-6 space-y-4">
                      <button 
                        onClick={() => setIsHistoryDialogOpen(true)}
                        className="whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-9 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Transaction History
                      </button>
                      <button className="whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-9 w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white p-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share2 w-4 h-4">
                          <circle cx="18" cy="5" r="3"></circle>
                          <circle cx="6" cy="12" r="3"></circle>
                          <circle cx="18" cy="19" r="3"></circle>
                          <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                          <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
                        </svg>
                        Generate Referral Link
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ opacity: 1, transform: 'none' }}>
                  <div className="text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl">
                    <div className="flex flex-col space-y-1.5 p-6 px-6 py-4 border-b border-white/5">
                      <div className="tracking-tight text-xl font-semibold text-white">Price Information</div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-gray-400">Current Price</p>
                          <p className="text-white font-medium">$4.78</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-400">Next Stage Price</p>
                          <p className="text-white font-medium">$21.60</p>
                        </div>
                        <div className="p-3 bg-yellow-500/10 rounded-xl">
                          <div className="flex items-center gap-2 text-yellow-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <p className="text-sm">Price increase coming soon</p>
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
      </div>

      <Dialog.Root open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <Dialog.Title className="tracking-tight text-lg font-bold text-white mb-4">
                {userData?.balance ? 'Withdraw Tokens' : 'Empty Balance'}
              </Dialog.Title>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet w-8 h-8 text-blue-400">
                  <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                  <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                </svg>
              </div>
              
              {isCheckingBalance ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  <p className="text-gray-300">Checking withdrawal availability...</p>
                </div>
              ) : userData?.balance ? (
                <div className="w-full space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400">Available Balance</p>
                    <p className="text-white font-medium">{userData.balance} $GROK</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-left block text-sm text-gray-400">
                      Amount to Withdraw
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter amount"
                        min="0"
                        max={userData.balance}
                        step="0.01"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        $GROK
                      </span>
                    </div>
                  </div>

                  {showLiveSupport ? (
                    <div className="p-4 bg-blue-500/10 rounded-xl flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle w-5 h-5 text-blue-400">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm text-blue-400 font-medium">Please contact live support</p>
                        <p className="text-xs text-blue-400/80">Our support team will assist you with your withdrawal</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleWithdraw}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform transition hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right w-4 h-4">
                        <path d="M7 7h10v10" />
                        <path d="M7 17 17 7" />
                      </svg>
                      Withdraw Tokens
                    </button>
                  )}

                  <div className="bg-black/20 rounded-lg p-4">
                    <p className="text-sm text-gray-400">
                      Withdrawals are processed within 24 hours. You will receive your tokens in your wallet once approved.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-300">Your balance is empty. Purchase some tokens first to make a withdrawal.</p>
                  <div className="bg-black/20 rounded-lg p-4 w-full mt-4">
                    <p className="text-sm text-gray-400">Head over to the token purchase page to get started!</p>
                  </div>
                  <Link className="w-full" href="/dashboard/buy-coins">
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-9 w-full mt-4 bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform">
                      Buy Tokens
                    </button>
                  </Link>
                </>
              )}
            </div>
            <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl max-w-3xl">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left border-b border-white/10 p-6">
              <Dialog.Title className="tracking-tight text-xl font-bold text-white">Transaction History</Dialog.Title>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-black/40 text-gray-400 border-b border-white/10">
                  <tr>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-black/20 transition">
                      <td className="py-3 px-4">
                        <span className="text-white">
                          {formatDate(transaction.date || transaction.createdAt)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <p className="font-semibold text-white">
                            {transaction.type === 'purchase' || transaction.transactionType === 'TOKEN_PURCHASE'
                              ? `${transaction.cryptoAmount || ''} ${transaction.cryptoSymbol || ''}`
                              : `${transaction.tokenAmount || 0} $GROK`
                            }
                          </p>
                          {transaction.type === 'purchase' && (
                            <div>
                              <p className="text-sm text-gray-400">
                                {transaction.tokenAmount || 0} $GROK
                              </p>
                              {transaction.bonusAmount && transaction.bonusAmount > 0 && (
                                <p className="text-sm text-emerald-400">
                                  +{transaction.bonusAmount} $GROK (Bonus)
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'APPROVED'
                            ? 'bg-green-500/20 text-green-400'
                            : transaction.status === 'PENDING'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white">{transaction.orderId || transaction.id}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {selectedTransaction && (
        <div>
          {/* Transaction details content will go here */}
        </div>
      )}
    </div>
  );
} 