'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users as UsersIcon, 
  Activity,
  UserCheck,
  Search,
  ArrowLeft,
  ArrowRight,
  Globe,
  Smartphone,
  Monitor,
  Clock,
  Mail,
  Calendar,
  TrendingUp,
  UserPlus,
  Shield,
  Zap,
  Sparkles,
  User,
  MapPin,
  Chrome,
  Laptop,
  Edit,
  Save,
  X,
  Tablet,
  Trash2
} from 'lucide-react';

interface OnlineUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  lastActive: string;
  balance?: number;
}

// Debounce fonksiyonu
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function AdminUsers() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [allUsers, setAllUsers] = useState<OnlineUser[]>([]);
  const [view, setView] = useState<'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const router = useRouter();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingBalance, setEditingBalance] = useState<string>('');
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deletedUsers, setDeletedUsers] = useState<{id: string, name: string, email: string, deletedAt: string}[]>([]);
  const [showDeletedUsers, setShowDeletedUsers] = useState(false);

  // Admin authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/me');
        const data = await response.json();
        
        if (data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [router]);

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Get users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/all-users?page=${page}&limit=${limit}&search=${debouncedSearchTerm}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        
        if (data.users) {
          setAllUsers(data.users);
          setTotalPages(data.pagination.pages);
        } else {
          try {
            const users = JSON.parse(data);
            setAllUsers(users);
          } catch (e) {
            console.error('All users JSON parse error:', e);
            // Handle the error appropriately
          }
        }
      } catch (error) {
        console.warn('Could not get all users: No data or invalid format');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated, debouncedSearchTerm, page, limit]);

  // Get online users data
  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const response = await fetch('/api/admin/online-users', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch online users');
        }
        
        const data = await response.json();
        
        if (data.users) {
          setOnlineUsers(data.users);
        }
      } catch (error) {
        console.error('Failed to fetch online users:', error);
      }
    };
    
    if (isAuthenticated) {
      fetchOnlineUsers();
      
      // Refresh online users every 30 seconds
      const interval = setInterval(fetchOnlineUsers, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleUpdateBalance = async (userId: string) => {
    try {
      setUpdateLoading(true);
      
      // Validate input
      const balanceNum = parseFloat(editingBalance);
      if (isNaN(balanceNum)) {
        alert('Please enter a valid number');
        return;
      }
      
      const response = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          balance: balanceNum
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.user) {
        // Update user in the list
        setAllUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId 
              ? { ...user, balance: data.user.balance } 
              : user
          )
        );
        
        setEditingUserId(null);
        setEditingBalance('');
        alert('User balance updated successfully');
      } else {
        alert(data.message || 'Failed to update user balance');
      }
    } catch (error) {
      console.error('Error updating user balance:', error);
      alert('An error occurred while updating user balance');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingUserId(userId);
      
      // Save the information of the user to be deleted
      const userToDelete = allUsers.find(user => user.id === userId);
      
      const response = await fetch(`/api/admin/delete-user/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('An error occurred while deleting the user');
      }
      
      // Remove user from the list
      setAllUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      // Add to deleted users list
      if (userToDelete) {
        setDeletedUsers(prev => [...prev, {
          id: userToDelete.id,
          name: userToDelete.name || 'Unnamed',
          email: userToDelete.email,
          deletedAt: new Date().toISOString()
        }]);
      }
      
      alert('User successfully deleted');
    } catch (error) {
      console.error('User deletion error:', error);
      alert('An error occurred while deleting the user');
    } finally {
      setDeletingUserId(null);
    }
  };

  if (isLoading || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  // Add device icon helper function
  const getDeviceIcon = (device: string | undefined) => {
    if (!device) return <Laptop className="w-4 h-4 text-gray-500" />;
    
    device = device.toLowerCase();
    
    if (device.includes('mobile') || device.includes('phone') || device.includes('android') || device.includes('ios')) {
      return <Smartphone className="w-4 h-4 text-blue-400" />;
    } else if (device.includes('tablet') || device.includes('ipad')) {
      return <Tablet className="w-4 h-4 text-purple-400" />;
    } else {
      return <Monitor className="w-4 h-4 text-green-400" />;
    }
  };

  // Add browser icon helper function
  const getBrowserIcon = (browser: string | undefined) => {
    if (!browser) return <Globe className="w-4 h-4 text-gray-400" />;

    switch (browser.toLowerCase()) {
      case 'chrome':
        return <Chrome className="w-4 h-4 text-blue-400" />;
      default:
        return <Globe className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Glass background pattern */}
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-black opacity-80" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      </div>

      {/* Navbar */}
      <nav className="relative border-b border-white/5 bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-emerald-400" />
                <span className="text-xl font-semibold text-white">Admin Panel</span>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/admin/dashboard" className="text-gray-400 hover:text-white px-3 py-1 rounded-md hover:bg-white/5">
                  Dashboard
                </Link>
                <Link href="/admin/users" className="text-white px-3 py-1 rounded-md bg-white/10">
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
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <UsersIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Users Overview</h1>
          </div>
          <p className="text-gray-500 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Monitor and manage user activity across the platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Total Users Card */}
          <div className="group relative backdrop-blur-xl bg-black/30 rounded-2xl p-6 border border-white/5 hover:border-emerald-500/20 transition-all duration-300 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="absolute -inset-px bg-grid-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <UsersIcon className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm font-medium text-emerald-400">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>Total</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-bold text-white group-hover:scale-110 transition-transform">
                    {allUsers.length}
                  </h3>
                  <span className="text-emerald-400 text-sm">users</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-gray-500">Total Users</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-400 group-hover:scale-110 transition-transform">
                      <UserPlus className="w-3 h-3" />
                      +12% ↑
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Today Card */}
          <div className="group relative backdrop-blur-xl bg-black/30 rounded-2xl p-6 border border-white/5 hover:border-purple-500/20 transition-all duration-300 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="absolute -inset-px bg-grid-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm font-medium text-purple-400">
                    <Clock className="w-4 h-4 animate-pulse" />
                    <span>Today</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-bold text-white group-hover:scale-110 transition-transform">
                    {allUsers.filter(user => {
                      const lastActive = new Date(user.lastActive);
                      const today = new Date();
                      return lastActive.toDateString() === today.toDateString();
                    }).length}
                  </h3>
                  <span className="text-purple-400 text-sm">active</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-gray-500">Active Today</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/10 text-xs font-medium text-purple-400 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-3 h-3" />
                      +8% ↑
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deleted Users Card */}
          <div className="group relative backdrop-blur-xl bg-black/30 rounded-2xl p-6 border border-white/5 hover:border-red-500/20 transition-all duration-300 cursor-pointer" onClick={() => setShowDeletedUsers(!showDeletedUsers)}>
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="absolute -inset-px bg-grid-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 group-hover:scale-110 transition-transform">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm font-medium text-red-400">
                    <X className="w-4 h-4 animate-pulse" />
                    <span>Deleted</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-bold text-white group-hover:scale-110 transition-transform">
                    {deletedUsers.length}
                  </h3>
                  <span className="text-red-400 text-sm">users</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-gray-500">Deleted Users</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-xs font-medium text-red-400 group-hover:scale-110 transition-transform">
                      <Trash2 className="w-3 h-3" />
                      Click to view
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deleted Users Modal */}
        {showDeletedUsers && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl max-h-[80vh] overflow-auto backdrop-blur-xl bg-black/80 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <Trash2 className="w-6 h-6 text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Deleted Users</h2>
                </div>
                <button 
                  onClick={() => setShowDeletedUsers(false)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {deletedUsers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-gray-400 font-medium mb-1">No Deleted Users</h3>
                  <p className="text-gray-500 text-sm">No users have been deleted yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deletedUsers.map(user => (
                    <div key={user.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-red-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3 text-red-400" />
                          <span>
                            {new Date(user.deletedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="backdrop-blur-xl bg-black/30 rounded-2xl border border-white/5">
          {/* Header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-white">User Management</h2>
              </div>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 pl-10 bg-white/5 border border-white/5 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all group-hover:border-emerald-500/20"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" />
              </div>
            </div>
          </div>

          {/* Users Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allUsers.map(user => (
                <div key={user.id} className="group relative overflow-hidden p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-emerald-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -inset-px bg-grid-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative group-hover:scale-110 transition-transform">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/10 to-purple-500/10 flex items-center justify-center border border-white/10">
                          <User className="w-8 h-8 text-white/60" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white flex items-center gap-2 group-hover:scale-105 transition-transform">
                          {user.name || 'Anonymous'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                        
                        {/* Password Information */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Shield className="w-3 h-3 text-purple-400" />
                          <span className="text-purple-400 font-medium">Password:</span>
                          <span className="text-white">{user.password || 'Password not found'}</span>
                        </div>
                        
                        {/* Bakiye Bilgisi */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Bakiye:</span>
                          <div className="flex items-center gap-2">
                            {editingUserId === user.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={editingBalance}
                                  onChange={(e) => setEditingBalance(e.target.value)}
                                  className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                                />
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleUpdateBalance(user.id)}
                                    disabled={updateLoading}
                                    className="p-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                  >
                                    {updateLoading ? (
                                      <div className="w-3 h-3 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                                    ) : (
                                      <Save className="w-3 h-3" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => setEditingUserId(null)}
                                    className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <span className="text-white">{user.balance?.toLocaleString() || '0'} X</span>
                                <button
                                  onClick={() => setEditingUserId(user.id)}
                                  className="p-1 rounded bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Trash2 className="w-3 h-3 text-red-400" />
                          <span className="text-red-400 font-medium">İşlem:</span>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deletingUserId === user.id}
                            className="px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-1"
                          >
                            {deletingUserId === user.id ? (
                              <div className="w-3 h-3 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                            <span>Kullanıcıyı Sil</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(user.lastActive).toLocaleDateString([], {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-black/20 border border-white/5 group-hover:border-emerald-500/20 transition-colors">
                        <Clock className="w-3 h-3 text-emerald-400" />
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
            </div>

            {allUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <UsersIcon className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-gray-400 font-medium mb-1">No Users Found</h3>
                <p className="text-gray-500 text-sm">
                  No users match your search criteria
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1 || isLoading}
                  className="group flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm">Previous</span>
                </button>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-500/20 transition-colors">
                    <span className="text-sm text-white">Page {page}</span>
                  </div>
                  <span className="text-gray-500">of</span>
                  <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-500/20 transition-colors">
                    <span className="text-sm text-white">{totalPages}</span>
                  </div>
                </div>
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages || isLoading}
                  className="group flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span className="text-sm">Next</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 