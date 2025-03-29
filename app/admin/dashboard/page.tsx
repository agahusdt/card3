'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Users, 
  DollarSign, 
  TrendingUp,
  Check,
  X,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Mail,
  Calendar,
  User,
  MapPin,
  Chrome,
  Activity,
  Zap,
  Trash2,
  Bitcoin
} from 'lucide-react';

interface OnlineUser {
  id: string;
  name: string;
  email: string;
  lastActive: string;
  device: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  country: string;
  balance?: number;
}

interface TokenPurchase {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
    activities?: {
      device: string;
      country: string;
      browser: string;
    }[];
  };
  cryptoAmount: number;
  tokenAmount: number;
  usdAmount: number;
  bonusAmount: number;
  tokenPrice: number;
  cryptoSymbol: string;
  status: string;
  createdAt: string;
}

interface CompletedTransaction extends TokenPurchase {
  status: 'APPROVED' | 'REJECTED';
}

// Helper function to display crypto symbols
const CryptoIcon = ({ symbol }: { symbol: string }) => {
  switch (symbol.toUpperCase()) {
    case 'BTC':
      return <Bitcoin className="h-3 w-3 text-yellow-400" />;
    case 'ETH':
      return <div className="h-3 w-3 rounded-full bg-purple-400" />;
    case 'BNB':
      return <div className="h-3 w-3 rounded-full bg-yellow-500" />;
    case 'SOL':
      return <div className="h-3 w-3 rounded-full bg-green-500" />;
    case 'USDT':
      return <div className="h-3 w-3 rounded-full bg-teal-500" />;
    default:
      return <div className="h-3 w-3 rounded-full bg-gray-400" />;
  }
};

export default function AdminDashboard() {
  const router = useRouter();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [pendingPurchases, setPendingPurchases] = useState<TokenPurchase[]>([]);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [transactionHistory, setTransactionHistory] = useState<CompletedTransaction[]>([]);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [actionStatus, setActionStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [pendingRequests, setPendingRequests] = useState<TokenPurchase[]>([]);

  useEffect(() => {
    // Admin kimliğini kontrol et
    const checkAdminAuth = async () => {
      try {
        const response = await fetch('/api/admin/me');
        const data = await response.json();
        
        if (!data.success) {
          console.error('Admin authentication failed:', data.error);
          router.push('/admin/login');
          return;
        }
        
        fetchData();
      } catch (_) {
        console.error('Failed to check admin authentication:');
        router.push('/admin/login');
      }
    };
    
    checkAdminAuth();
  }, [router]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch online users
      const onlineUsersRes = await fetch('/api/admin/online-users', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        credentials: 'include'
      });

      if (!onlineUsersRes.ok) {
        const errorText = await onlineUsersRes.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          console.error('Failed to parse error response:', errorText);
          throw new Error('Failed to fetch online users');
        }
        throw new Error(errorData.message || 'Failed to fetch online users');
      }

      const onlineUsersText = await onlineUsersRes.text();
      let onlineUsersData;
      try {
        onlineUsersData = JSON.parse(onlineUsersText);
      } catch (e) {
        console.error('Failed to parse online users response:', onlineUsersText);
        throw new Error('Invalid response format for online users');
      }
      setOnlineUsers(Array.isArray(onlineUsersData) ? onlineUsersData : 
                    Array.isArray(onlineUsersData.users) ? onlineUsersData.users : []);

      // Fetch pending purchases
      const purchasesRes = await fetch('/api/admin/pending-purchases', {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        credentials: 'include'
      });

      if (!purchasesRes.ok) {
        const errorText = await purchasesRes.text();
        // Boş yanıt durumunda güvenli bir mesaj göster
        if (!errorText || errorText.trim() === '') {
          throw new Error('API yanıt döndürmedi. Lütfen daha sonra tekrar deneyin.');
        }
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          console.error('Failed to parse error response:', errorText);
          throw new Error('İşlemleri alırken bir hata oluştu');
        }
        throw new Error(errorData.message || 'İşlemleri alırken bir hata oluştu');
      }

      const purchasesText = await purchasesRes.text();
      let purchases;
      
      // Boş yanıt kontrolü
      if (!purchasesText || purchasesText.trim() === '') {
        purchases = [];
        console.log('No pending transactions found - empty response received');
      } else {
        try {
          purchases = JSON.parse(purchasesText);
        } catch (e) {
          console.error('Failed to parse purchases response:', purchasesText);
          throw new Error('İşlem yanıtı geçersiz formatta');
        }
      }
      setPendingPurchases(purchases);

      // Fetch transaction history
      const historyRes = await fetch('/api/admin/transaction-history', {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        credentials: 'include'
      });

      if (!historyRes.ok) {
        throw new Error('Failed to fetch transaction history');
      }

      const historyData = await historyRes.json();
      setTransactionHistory(historyData);

      // Admin durumunu kontrol etmeye gerek yok, zaten middleware'de kontrol ediliyor
      setIsAdmin(true);
      
      setIsLoading(false);
    } catch (_) {
      console.error('Error fetching data:');
      setError('An error occurred');
      setIsLoading(false);
    }
  };

  const handlePurchaseAction = async (purchaseId: string, action: 'approve' | 'reject') => {
    if (processingIds.has(purchaseId)) return;

    try {
      setProcessingIds(prev => new Set(prev).add(purchaseId));
      
      // We don't need to manually extract the adminToken from cookies
      // The credentials: 'include' option will automatically send all cookies
      const res = await fetch(`/api/admin/purchase-action/${purchaseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Action failed' }));
        throw new Error(errorData.message || 'Action failed');
      }
      
      // Move the purchase to transaction history
      const purchase = pendingPurchases.find(p => p.id === purchaseId);
      if (purchase) {
        const status = action === 'approve' ? 'APPROVED' as const : 'REJECTED' as const;
        const newTransaction: CompletedTransaction = {
          ...purchase,
          status
        };
        
        // Add to transaction history
        setTransactionHistory(prev => [newTransaction, ...prev]);
        
        // Remove from pending purchases
        setPendingPurchases(prev => prev.filter(p => p.id !== purchaseId));
      }

      // Refresh transaction history to ensure sync with server
      const historyRes = await fetch('/api/admin/transaction-history', {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        credentials: 'include'
      });

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setTransactionHistory(historyData);
      }
      
      // Show success message
      setActionStatus({
        type: 'success',
        message: `Transaction ${action === 'approve' ? 'approved' : 'rejected'} successfully`
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionStatus({ type: null, message: '' });
      }, 3000);
    } catch (_) {
      console.error('Action error:');
      setActionStatus({
        type: 'error',
        message: 'Failed to process transaction'
      });
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setActionStatus({ type: null, message: '' });
      }, 3000);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(purchaseId);
        return newSet;
      });
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeletingId(id);
      const res = await fetch(`/api/admin/delete-transaction/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to delete transaction');

      // Remove from state
      setTransactionHistory(prev => prev.filter(t => t.id !== id));
    } catch (_) {
      console.error('Delete error:');
      alert('Failed to delete transaction');
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleDeleteAllTransactions = async () => {
    if (!confirm('Are you sure you want to delete ALL transaction history? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeletingAll(true);
      const res = await fetch('/api/admin/delete-all-transactions', {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete transactions');
      }

      // Clear transaction history from state
      setTransactionHistory([]);
      
      // Optionally show success message
      alert('All transactions deleted successfully');
    } catch (_) {
      console.error('Delete all transactions error:');
      alert('Failed to delete transactions');
    } finally {
      setIsDeletingAll(false);
    }
  };

  // Onaylanmamış işlemleri getir
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch('/api/admin/purchase-requests', {
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          setPendingRequests(data.data);
        } else {
          // Gereksiz log kaldırıldı
          setPendingRequests([]);
        }
      } catch (error) {
        console.error('Error fetching pending requests:', error);
        setPendingRequests([]);
      }
    };
    
    fetchPendingRequests();
    const intervalId = setInterval(fetchPendingRequests, 60000); // Her 1 dakikada bir güncelle
    
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-white">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Glass background pattern */}
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-black opacity-80" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      </div>

      {/* Notification */}
      {actionStatus.type && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 ${
          actionStatus.type === 'success' 
            ? 'bg-emerald-500/90 text-white border border-emerald-600' 
            : 'bg-red-500/90 text-white border border-red-600'
        }`}>
          <div className="flex items-center gap-3">
            {actionStatus.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
            <span>{actionStatus.message}</span>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="relative border-b border-white/5 bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <span className="text-xl font-semibold text-white">Dashboard</span>
              <div className="flex items-center gap-4">
                <Link href="/admin/dashboard" className="text-white px-3 py-1 rounded-md bg-white/10">
                  Dashboard
                </Link>
                <Link href="/admin/users" className="text-gray-400 hover:text-white px-3 py-1 rounded-md hover:bg-white/5">
                  Kullanıcılar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
          <p className="text-gray-500">Monitor system activities and metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="group relative backdrop-blur-xl bg-black/30 rounded-2xl p-6 border border-white/5 hover:border-emerald-500/20 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm font-medium text-emerald-400">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Active now</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-white">{onlineUsers.length}</h3>
                  <span className="text-emerald-400 text-sm">users</span>
                </div>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
                  Online Users
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-400">
                    +12% ↑
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="group relative backdrop-blur-xl bg-black/30 rounded-2xl p-6 border border-white/5 hover:border-orange-500/20 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <DollarSign className="w-6 h-6 text-orange-400" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm font-medium text-orange-400">
                    <span className="flex h-2 w-2 rounded-full bg-orange-400 animate-pulse"></span>
                    <span>Pending</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-white">
                    ${pendingPurchases.reduce((sum, p) => sum + (p.tokenAmount * p.tokenPrice), 0).toLocaleString()}
                  </h3>
                  <span className="text-orange-400 text-sm">USD</span>
                </div>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
                  Pending Transactions
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 text-xs font-medium text-orange-400">
                    +23% ↑
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="group relative backdrop-blur-xl bg-black/30 rounded-2xl p-6 border border-white/5 hover:border-purple-500/20 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm font-medium text-purple-400">
                    <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse"></span>
                    <span>Total</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-white">
                    {pendingPurchases.reduce((sum, p) => sum + p.tokenAmount, 0).toLocaleString()}
                  </h3>
                  <span className="text-purple-400 text-sm">tokens</span>
                </div>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
                  Total Tokens
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/10 text-xs font-medium text-purple-400">
                    +8% ↑
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Online Users */}
          <div className="backdrop-blur-xl bg-black/30 rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 via-purple-500/10 to-emerald-500/10 border border-emerald-500/20">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-medium text-white">Online Users</h3>
                    <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-sm font-medium text-emerald-400">{onlineUsers.length} active now</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Real-time user activity monitoring</p>
                </div>
              </div>
              <div className="flex -space-x-3">
                {onlineUsers.slice(0, 4).map((user: OnlineUser, index) => (
                  <div key={index} className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/10 to-purple-500/10 border border-black ring-2 ring-black flex items-center justify-center group transition-transform hover:scale-110 hover:-translate-y-1 duration-300">
                    <span className="text-sm font-medium text-white">{user.name?.[0]?.toUpperCase() || '?'}</span>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black ring-2 ring-emerald-500/20"></div>
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300">
                      <span className="text-xs text-white font-medium px-2 py-1 rounded-lg bg-white/10">{user.name}</span>
                    </div>
                  </div>
                ))}
                {onlineUsers.length > 4 && (
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/10 to-purple-500/10 border border-black ring-2 ring-black flex items-center justify-center transition-transform hover:scale-110 hover:-translate-y-1 duration-300">
                    <span className="text-sm font-medium text-white">+{onlineUsers.length - 4}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              {onlineUsers.map((user: OnlineUser) => (
                <div key={user.id} className="group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
                  <div className="relative p-4 rounded-xl bg-gradient-to-r from-black/50 to-black/30 hover:from-emerald-950/20 hover:to-purple-950/20 transition-all duration-300 border border-white/5 hover:border-emerald-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative group-hover:scale-110 transition-transform duration-500">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-purple-500/10 border border-white/10 ring-2 ring-white/5 group-hover:ring-emerald-500/20 flex items-center justify-center transition-all duration-300">
                            <User className="w-6 h-6 text-white/60 group-hover:text-white/90 transition-colors duration-300" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black ring-2 ring-emerald-500/20 flex items-center justify-center">
                            <Zap className="w-2.5 h-2.5 text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors duration-300">
                              {user.name || 'Anonymous'}
                            </span>
                            {Math.round((Date.now() - new Date(user.lastActive).getTime()) / 1000 / 60) < 1 ? (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">Just Now</span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                Active
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1.5">
                            <Mail className="w-3 h-3" />
                            <span className="group-hover:text-gray-400 transition-colors duration-300">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="px-3 py-1.5 rounded-lg bg-black/20 border border-white/5 group-hover:border-emerald-500/20 transition-all duration-300">
                              <div className="text-[10px] text-gray-500 mb-0.5">Balance</div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors duration-300">{(user.balance ?? 0).toLocaleString()}</span>
                                <span className="text-xs text-emerald-400">X</span>
                              </div>
                            </div>
                            {typeof user.balance === 'number' && user.balance > 0 && (
                              <div className="px-3 py-1.5 rounded-lg bg-black/20 border border-white/5 group-hover:border-emerald-500/20 transition-all duration-300">
                                <div className="text-[10px] text-gray-500 mb-0.5">Value</div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors duration-300">${(user.balance * 3.95).toLocaleString()}</span>
                                  <span className="text-xs text-blue-400">USD</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            {new Date(user.lastActive).toLocaleDateString([], {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        {Math.round((Date.now() - new Date(user.lastActive).getTime()) / 1000 / 60) > 0 && (
                          <span className="text-xs px-2 py-1 rounded-lg bg-black/20 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {Math.round((Date.now() - new Date(user.lastActive).getTime()) / 1000 / 60)} min ago
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-4 gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/5 group-hover:border-emerald-500/20 transition-all duration-300">
                        {user.device === 'mobile' ? (
                          <Smartphone className="w-4 h-4 text-blue-400" />
                        ) : user.device === 'tablet' ? (
                          <Smartphone className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Monitor className="w-4 h-4 text-emerald-400" />
                        )}
                        <span className="text-xs text-gray-400 capitalize">{user.device || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/5 group-hover:border-emerald-500/20 transition-all duration-300">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        <span className="text-xs text-gray-400">
                          {user.country === 'Turkey' ? '🇹🇷 Turkey' : 
                           user.country === 'United States' ? '🇺🇸 USA' :
                           user.country === 'United Kingdom' ? '🇬🇧 UK' :
                           user.country === 'Germany' ? '🇩🇪 Germany' :
                           user.country === 'France' ? '🇫🇷 France' :
                           user.country === 'Italy' ? '🇮🇹 Italy' :
                           user.country === 'Spain' ? '🇪🇸 Spain' :
                           user.country === 'Netherlands' ? '🇳🇱 Netherlands' :
                           user.country === 'Belgium' ? '🇧🇪 Belgium' :
                           user.country === 'Switzerland' ? '🇨🇭 Switzerland' :
                           user.country ? '🌍 ' + user.country : '🌍 Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/5 group-hover:border-emerald-500/20 transition-all duration-300">
                        {user.browser === 'Chrome' ? (
                          <Chrome className="w-4 h-4 text-blue-400" />
                        ) : user.browser === 'Firefox' ? (
                          <Globe className="w-4 h-4 text-orange-400" />
                        ) : user.browser === 'Safari' ? (
                          <Globe className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Globe className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-xs text-gray-400">{user.browser || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/5 group-hover:border-emerald-500/20 transition-all duration-300">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-gray-400">
                          {new Date(user.lastActive).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: false 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {onlineUsers.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/5 to-purple-500/5 border border-white/10 ring-2 ring-white/5 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-gray-400 font-medium mb-1">No Active Users</h3>
                  <p className="text-gray-500 text-sm">There are currently no users online</p>
                </div>
              )}
            </div>
          </div>

          {/* Pending Transactions */}
          <div className="backdrop-blur-xl bg-black/30 rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-white">Pending Transactions</h3>
                <p className="text-sm text-gray-500 mt-1">Transactions awaiting approval</p>
              </div>
              <span className="px-3 py-1.5 text-xs font-medium text-orange-400 bg-orange-500/10 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                {pendingPurchases.length} pending
              </span>
            </div>
            <div className="space-y-4">
              {pendingPurchases.map(purchase => (
                <div key={purchase.id} className="group relative overflow-hidden p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-blue-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative group-hover:scale-110 transition-transform">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/10 to-purple-500/10 flex items-center justify-center border border-white/10">
                          <User className="w-8 h-8 text-white/60" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-orange-500 border-2 border-black flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white flex items-center gap-2 group-hover:scale-105 transition-transform">
                          {purchase.user.name || 'Anonymous'}
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 flex items-center gap-1">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                            New User
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Mail className="w-3 h-3" />
                          {purchase.user.email}
                        </div>
                      </div>
                    </div>

                    {/* Device Info */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-black/20 border border-white/5 group-hover:border-emerald-500/20 transition-colors">
                        <span className="text-xs text-gray-400 capitalize">
                          {purchase.user.activities && purchase.user.activities[0]?.device || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-black/20 border border-white/5 group-hover:border-emerald-500/20 transition-colors">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        <span className="text-xs text-gray-400">
                          {purchase.user.activities && purchase.user.activities[0]?.country ? (
                            purchase.user.activities[0].country === 'Turkey' ? '🇹🇷 Turkey' : 
                            purchase.user.activities[0].country === 'United States' ? '🇺🇸 USA' :
                            purchase.user.activities[0].country === 'United Kingdom' ? '🇬🇧 UK' :
                            purchase.user.activities[0].country === 'Germany' ? '🇩🇪 Germany' :
                            purchase.user.activities[0].country === 'France' ? '🇫🇷 France' :
                            purchase.user.activities[0].country === 'Italy' ? '🇮🇹 Italy' :
                            purchase.user.activities[0].country === 'Spain' ? '🇪🇸 Spain' :
                            purchase.user.activities[0].country === 'Netherlands' ? '🇳🇱 Netherlands' :
                            purchase.user.activities[0].country === 'Belgium' ? '🇧🇪 Belgium' :
                            purchase.user.activities[0].country === 'Switzerland' ? '🇨🇭 Switzerland' :
                            '🌍 ' + purchase.user.activities[0].country
                          ) : '🌍 Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-black/20 border border-white/5 group-hover:border-emerald-500/20 transition-colors">
                        {purchase.user.activities && purchase.user.activities[0]?.browser === 'Chrome' ? (
                          <Chrome className="w-4 h-4 text-blue-400" />
                        ) : purchase.user.activities && purchase.user.activities[0]?.browser === 'Firefox' ? (
                          <Globe className="w-4 h-4 text-orange-400" />
                        ) : purchase.user.activities && purchase.user.activities[0]?.browser === 'Safari' ? (
                          <Globe className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Globe className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-xs text-gray-400">
                          {purchase.user.activities && purchase.user.activities[0]?.browser || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-black/20 border border-white/5 group-hover:border-emerald-500/20 transition-colors">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-gray-400">
                          {new Date(purchase.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: false 
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                        <div className="text-xs text-gray-500 mb-1">Amount</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            {typeof purchase.cryptoAmount === 'string' 
                              ? parseFloat(purchase.cryptoAmount).toFixed(6) 
                              : purchase.cryptoAmount.toFixed(6)}
                          </span>
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5">
                            <CryptoIcon symbol={purchase.cryptoSymbol} />
                            <span className="text-xs text-gray-400">{purchase.cryptoSymbol}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ${(parseFloat(String(purchase.tokenAmount)) * 4.78).toFixed(2)} USD
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                        <div className="text-xs text-gray-500 mb-1">Tokens</div>
                        <div className="text-sm font-medium text-white">
                          {typeof purchase.tokenAmount === 'string'
                            ? parseFloat(purchase.tokenAmount).toLocaleString()
                            : purchase.tokenAmount.toLocaleString()} GROK
                        </div>
                        <div className="text-xs text-emerald-400 mt-1">
                          +{typeof purchase.bonusAmount === 'string'
                             ? parseFloat(purchase.bonusAmount).toLocaleString()
                             : purchase.bonusAmount.toLocaleString()} Bonus
                        </div>
                      </div>
                    </div>

                    {/* Time and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-400">
                          {new Date(purchase.createdAt).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePurchaseAction(purchase.id, 'approve')}
                          disabled={processingIds.has(purchase.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 transition-all duration-300"
                        >
                          <Check className="w-4 h-4" />
                          <span className="text-xs font-medium">Approve</span>
                        </button>
                        <button
                          onClick={() => handlePurchaseAction(purchase.id, 'reject')}
                          disabled={processingIds.has(purchase.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-all duration-300"
                        >
                          <X className="w-4 h-4" />
                          <span className="text-xs font-medium">Reject</span>
                        </button>
                      </div>
                    </div>

                    {/* Processing Indicator */}
                    {processingIds.has(purchase.id) && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                          <span className="text-sm text-gray-400">Processing...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {pendingPurchases.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500">No pending transactions</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="backdrop-blur-xl bg-black/30 rounded-2xl p-6 border border-white/5 mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-white">Transaction History</h3>
              <p className="text-sm text-gray-500 mt-1">All completed transactions</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded-full flex items-center gap-2">
                  <Check className="w-3 h-3" />
                  Approved
                </span>
                <span className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 rounded-full flex items-center gap-2">
                  <X className="w-3 h-3" />
                  Rejected
                </span>
              </div>
              <button
                onClick={handleDeleteAllTransactions}
                disabled={isDeletingAll || transactionHistory.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                  isDeletingAll ? 'animate-pulse' : ''
                }`}
              >
                {isDeletingAll ? (
                  <div className="w-4 h-4 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span className="text-xs font-medium">Delete All</span>
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {transactionHistory.map(transaction => (
              <div key={transaction.id} className={`group relative overflow-hidden p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-transparent ${
                transaction.status === 'APPROVED' ? 'hover:border-emerald-500/20' : 'hover:border-red-500/20'
              }`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${
                  transaction.status === 'APPROVED' 
                    ? 'from-emerald-500/0 via-emerald-500/5 to-purple-500/5'
                    : 'from-red-500/0 via-red-500/5 to-purple-500/5'
                } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative">
                  {/* User Info */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/10 to-purple-500/10 flex items-center justify-center border border-white/10">
                          <span className="text-lg font-medium text-white">{transaction.user.name?.[0] || 'A'}</span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${
                          transaction.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-red-500'
                        } border-2 border-black flex items-center justify-center`}></div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white flex items-center gap-2">
                          {transaction.user.name || 'Anonymous'}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            transaction.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}>
                            {transaction.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">{transaction.user.email}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        disabled={isDeletingId === transaction.id}
                        className={`p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all ${
                          isDeletingId === transaction.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isDeletingId === transaction.id ? (
                          <div className="w-5 h-5 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                      <div className="text-xs text-gray-500 mb-1">Amount</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">
                          {typeof transaction.cryptoAmount === 'string' 
                            ? parseFloat(transaction.cryptoAmount).toFixed(6) 
                            : transaction.cryptoAmount.toFixed(6)}
                        </span>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5">
                          <CryptoIcon symbol={transaction.cryptoSymbol} />
                          <span className="text-xs text-gray-400">{transaction.cryptoSymbol}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ${(parseFloat(String(transaction.tokenAmount)) * 4.78).toFixed(2)} USD
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                      <div className="text-xs text-gray-500 mb-1">Tokens</div>
                      <div className="text-sm font-medium text-white">
                        {typeof transaction.tokenAmount === 'string'
                          ? parseFloat(transaction.tokenAmount).toLocaleString()
                          : transaction.tokenAmount.toLocaleString()} GROK
                      </div>
                      <div className="text-xs text-emerald-400 mt-1">
                        +{typeof transaction.bonusAmount === 'string'
                           ? parseFloat(transaction.bonusAmount).toLocaleString()
                           : transaction.bonusAmount.toLocaleString()} Bonus
                      </div>
                    </div>
                  </div>

                  {/* Time and Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-400">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                        transaction.status === 'APPROVED'
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-red-400 bg-red-500/10'
                      }`}>
                        {transaction.status === 'APPROVED' ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        <span className="text-xs font-medium">
                          {transaction.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {transactionHistory.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-500">No transaction history</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
