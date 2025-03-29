'use client';

import Link from 'next/link';

interface UserData {
  id: string;
  email: string;
  name: string;
  balance: number;
  emailVerified: boolean;
}

interface UserInfoProps {
  userData: UserData | null;
  isLoading: boolean;
}

export default function UserInfo({ userData, isLoading }: UserInfoProps) {
  return (
    <div className="gap-6">
      <div className="relative group h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-emerald-500/5 to-blue-500/10 opacity-20 pointer-events-none rounded-2xl group-hover:opacity-30 transition-opacity"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-600 opacity-10 group-hover:opacity-20 blur-xl transition-all duration-300"></div>
        <div className="text-card-foreground bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-[0_0_30px_rgba(0,0,255,0.15)] transition-all duration-300 transform hover:scale-105 h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-20 pointer-events-none rounded-2xl"></div>
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 space-y-3 sm:space-y-0">
            <div className="p-2 bg-blue-900/30 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet w-6 h-6 text-blue-400">
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
              </svg>
            </div>
          </div>
          <div className="p-6 pt-0 px-6 pb-6">
            <div className="relative group h-full">
              <div className="flex flex-col items-start space-y-4">
                <div className="space-y-4 w-full">
                  <div className="space-y-2">
                    <div className="relative">
                      <h3 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                        {userData?.balance} $GROK
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                      <p className="text-gray-400 text-sm">Available Balance</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <h3 className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text group-hover:scale-105 transition-transform">${((userData?.balance || 0) * 4.78).toFixed(2)}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm bg-white/5 rounded-lg px-3 py-2">
                      <span className="text-green-400">1 $GROK</span>
                      <span>=</span>
                      <span className="text-white">$4.78</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Link href="/dashboard/buy-coins" className="flex-1">
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-9 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign w-4 h-4">
                        <line x1="12" x2="12" y1="2" y2="22"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      Buy Now at $4.78
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-4 h-4">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </button>
                  </Link>
                </div>
                <div className="w-full flex flex-wrap gap-2 pt-2">
                  <div className="text-xs px-3 py-1.5 bg-white/5 rounded-lg text-gray-400 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-dollar-sign w-3.5 h-3.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                      <path d="M12 18V6"></path>
                    </svg>
                    Stage 3 Active: $4.78
                  </div>
                  <div className="text-xs px-3 py-1.5 bg-red-500/10 rounded-lg text-red-400 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right w-3.5 h-3.5">
                      <path d="M7 7h10v10"></path>
                      <path d="M7 17 17 7"></path>
                    </svg>
                    Stage 4 Coming: $21.60
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 