'use client';

import Link from 'next/link';

interface UserTier {
  name: string;
  bonus: number;
  progress: number;
  nextTier: string;
  nextAmount: number;
  currentMin: number;
  nextMin: number;
}

interface UserTierProps {
  currentTier: UserTier;
}

export default function UserTier({ currentTier }: UserTierProps) {
  return (
    <div style={{ opacity: 1, transform: 'none' }}>
      <div className="relative h-full" tabIndex={0} style={{ transform: 'none' }}>
        <div className="text-card-foreground bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-[0_0_30px_rgba(0,255,211,0.15)] h-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-400 opacity-5 pointer-events-none rounded-2xl" />
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 group-hover:opacity-20 blur-xl transition-all duration-300" />
          <div className="flex flex-col space-y-1.5 p-6 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="tracking-tight text-base sm:text-lg font-semibold text-white">Current Status</div>
                <div className="w-2 h-2 rounded-full text-gray-400 animate-pulse" />
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award w-5 h-5 sm:w-6 sm:h-6 text-gray-400">
                  <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
                  <circle cx="12" cy="8" r="6" />
                </svg>
              </div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">Your membership tier</p>
          </div>
          <div className="p-6 pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-3xl sm:text-4xl font-bold text-gray-400">{currentTier.name}</h3>
                  {currentTier.nextTier ? (
                    <p className="text-xs sm:text-sm text-gray-400">Next: <span className="text-amber-500">{currentTier.nextTier}</span></p>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-400">Highest tier achieved</p>
                  )}
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-400">{currentTier.bonus}%</div>
              </div>
              <div className="relative">
                <div className="h-2.5 sm:h-3 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                  <div 
                    className={`absolute top-0 left-0 h-full ${currentTier.name === 'Legend' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-gray-500 to-gray-400'} transition-all duration-300 rounded-full`} 
                    style={{ width: `${Math.min(currentTier.progress, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-shine" />
                  </div>
                </div>
              </div>
              {currentTier.nextTier && (
                <Link href="/dashboard/buy-coins" className="mt-2">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-9 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Upgrade to {currentTier.nextTier}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-4 h-4">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 