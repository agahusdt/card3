'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
  id: string;
  email: string;
  name: string;
  balance: number;
  emailVerified: boolean;
}

export default function Profile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStatus, setPasswordStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        router.push('/');
      }
    };

    fetchUserData();
  }, [router]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPasswordStatus({ 
          type: 'success', 
          message: 'Password changed successfully!' 
        });
        // Reset form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Close dialog after successful password change
        setTimeout(() => {
          setIsPasswordDialogOpen(false);
          setPasswordStatus({ type: null, message: '' });
        }, 2000);
      } else {
        setPasswordStatus({ 
          type: 'error', 
          message: data.error || 'Failed to change password' 
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordStatus({ 
        type: 'error', 
        message: 'An error occurred while changing your password' 
      });
    } finally {
      setIsChangingPassword(false);
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
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-2xl blur-3xl"></div>
        <div className="relative">
          <div className="space-y-8" style={{ opacity: 1 }}>
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                {/* Profile Card */}
                <div className="text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
                  <div className="p-8 text-center border-b border-white/5 space-y-4">
                    <div className="relative w-24 h-24 mx-auto">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50"></div>
                      <div className="relative w-24 h-24 bg-black/40 rounded-full border-2 border-white/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user w-12 h-12 text-white/60">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{userData?.name}</h2>
                      <p className="text-sm text-gray-400">{userData?.email}</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span>Active Account</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                      <div className="space-y-3">
                        <button 
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground h-9 border border-white/10 bg-black/40 text-white px-8 py-4 rounded-xl shadow hover:bg-white/5 transition" 
                          type="button"
                          aria-haspopup="dialog"
                          aria-expanded="false"
                          aria-controls="radix-:r9:"
                          data-state="closed"
                          onClick={() => setIsPasswordDialogOpen(true)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock w-5 h-5 mr-2">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coin Balance Card */}
                <div className="text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
                  <div className="flex flex-col space-y-1.5 p-6 px-6 py-4 border-b border-white/5">
                    <div className="tracking-tight text-lg font-semibold text-white flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet w-5 h-5 text-blue-400">
                        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                      </svg>
                      Coin Balance
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-xl">
                      <p className="text-sm text-gray-400">Available Balance</p>
                      <p className="text-3xl font-bold text-white mt-1">{userData?.balance || 0} $GROK</p>
                      <p className="text-lg text-green-400 mt-1">${((userData?.balance || 0) * 4.78).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm p-3 bg-white/5 rounded-xl">
                      <span className="text-gray-400">Price per Coin</span>
                      <span className="text-white font-medium">$4.78</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text" style={{ transform: 'none' }}>
                    Settings
                  </h1>
                </div>

                {/* Settings Form */}
                <div className="text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl">
                  <div className="p-6">
                    <form id="profile-form" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-gray-400" htmlFor="name">
                            Full Name
                          </label>
                          <div className="relative group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors">
                              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <input
                              className="flex h-9 px-3 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                              id="name"
                              type="text"
                              value={userData?.name}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-gray-400" htmlFor="email">
                            Email Address
                          </label>
                          <div className="relative group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors">
                              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                            </svg>
                            <input
                              className="flex h-9 px-3 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                              id="email"
                              type="email"
                              value={userData?.email}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl p-4 text-sm text-gray-400">
                        <p>Member since 2025</p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Password Change Dialog */}
      {isPasswordDialogOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" 
            style={{ pointerEvents: 'auto' }} 
            data-aria-hidden="true" 
            aria-hidden="true"
          ></div>
          
          {/* Dialog */}
          <div 
            role="dialog"
            className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg bg-black/40 border border-white/5 rounded-3xl p-6 text-white" 
            tabIndex={-1} 
            style={{ pointerEvents: 'auto' }}
          >
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="tracking-tight text-lg font-semibold text-white">Change Password</h2>
            </div>
            <form className="space-y-4" onSubmit={handlePasswordSubmit}>
              <div>
                <label className="font-medium text-sm text-gray-400" htmlFor="currentPassword">Current Password</label>
                <input 
                  className="flex h-9 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full bg-black/40 border border-white/10 rounded-lg px-6 py-3 text-white" 
                  id="currentPassword" 
                  type="password" 
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div>
                <label className="font-medium text-sm text-gray-400" htmlFor="newPassword">New Password</label>
                <input 
                  className="flex h-9 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full bg-black/40 border border-white/10 rounded-lg px-6 py-3 text-white" 
                  id="newPassword" 
                  type="password" 
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div>
                <label className="font-medium text-sm text-gray-400" htmlFor="confirmPassword">Confirm New Password</label>
                <input 
                  className="flex h-9 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full bg-black/40 border border-white/10 rounded-lg px-6 py-3 text-white" 
                  id="confirmPassword" 
                  type="password" 
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              
              {passwordStatus.type && (
                <div className={`p-3 rounded-xl ${
                  passwordStatus.type === 'success' 
                    ? 'bg-green-500/10 text-green-400' 
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {passwordStatus.message}
                </div>
              )}
              
              <button 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-9 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105" 
                type="submit" 
                disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword || passwordForm.newPassword !== passwordForm.confirmPassword || isChangingPassword}
              >
                {isChangingPassword ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
            <button 
              type="button" 
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={() => setIsPasswordDialogOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>
        </>
      )}
    </main>
  );
} 