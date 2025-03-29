'use client';

import Link from 'next/link';

export default function SalesProgress() {
  return (
    <div style={{ opacity: 1, transform: 'none' }}>
      <div className="text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-20" />
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 opacity-10 blur-2xl" />
        <div className="flex-col space-y-1.5 p-6 flex items-center justify-between px-6 py-4">
          <div className="space-y-1">
            <div className="tracking-tight text-xl font-semibold text-white flex items-center gap-2">
              $GROK Sales Progress
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            </div>
            <p className="text-sm text-gray-400">Real-time token sale tracking</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-2 rounded-xl">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">84.4%</div>
          </div>
        </div>
        <div className="p-6 pt-0 px-6 pb-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-gray-400 text-sm mb-1">Raised Amount</p>
              <div className="text-xl font-bold text-blue-400">5.326.503 $GROK</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-gray-400 text-sm mb-1">Remaining</p>
              <div className="text-xl font-bold text-purple-400">1.148.497 $GROK</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <div className="h-4 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative" style={{ width: '82.2626%' }}>
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-shine" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                <span className="text-gray-400">Sale Progress</span>
              </div>
              <span className="text-gray-400">Stage 3 Active</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="text-xs px-3 py-1.5 bg-white/5 rounded-lg text-gray-400 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-3.5 h-3.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              1.4k+ Holders
            </div>
            <div className="text-xs px-3 py-1.5 bg-white/5 rounded-lg text-gray-400 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-3.5 h-3.5">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Stage 3 Price
            </div>
          </div>
          <div className="flex justify-center pt-2">
            <Link href="/dashboard/buy-coins" className="w-full sm:w-auto">
              <button className="whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary shadow hover:bg-primary/90 h-9 w-full sm:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-12 py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign w-5 h-5">
                  <line x1="12" x2="12" y1="2" y2="22"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                Buy GROK
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-5 h-5">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 