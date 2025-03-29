'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

interface OrderDetails {
  cryptoAmount: string;
  cryptoSymbol: string;
  tokenAmount: number;
  bonusAmount: number;
  totalAmount: number;
  orderId: string;
  address: string;
}

// Create a client component that uses searchParams
function PendingContent() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get order details from URL parameters
    const details: OrderDetails = {
      cryptoAmount: searchParams.get('cryptoAmount') || '0',
      cryptoSymbol: searchParams.get('cryptoSymbol') || 'USDT',
      tokenAmount: parseFloat(searchParams.get('tokenAmount') || '0'),
      bonusAmount: parseFloat(searchParams.get('bonusAmount') || '0'),
      totalAmount: parseFloat(searchParams.get('totalAmount') || '0'),
      orderId: searchParams.get('orderId') || 'Unknown',
      address: searchParams.get('address') || '0xc53Cb23f3F6DF46a4904Cabb8712F0E98D471e4e'
    };
    setOrderDetails(details);
  }, [searchParams]);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 mt-20 md:mt-0">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-2xl blur-3xl"></div>
        <div className="relative">
          <div className="flex flex-col items-center justify-center py-12 text-white px-6">
            <div className="relative mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-circle w-16 h-16 animate-spin text-blue-500">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-5 h-5 text-yellow-500">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span className="text-yellow-500 font-mono">Time remaining: 57:45</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Waiting for Payment</h3>
            <p className="text-gray-400 text-center max-w-md mb-8">
              Order <span className="font-mono text-blue-400">#{orderDetails.orderId}</span> is being processed..
              <br />
              <span>If payment has not been completed, please do so at your earliest convenience.</span>
              <br />
              If you have already made the payment, please wait while we process your transaction.
            </p>
            <div className="p-6 bg-black/50 rounded-2xl shadow-lg border border-blue-500/10 w-full max-w-md space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="font-mono font-bold">{orderDetails.cryptoAmount} {orderDetails.cryptoSymbol}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 mb-2">Address:</span>
                <div className="p-3 bg-black rounded-xl flex justify-between items-center">
                  <span className="font-mono font-bold text-blue-400 break-all">{orderDetails.address}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Coins:</span>
                <span className="font-mono font-bold text-green-400">{orderDetails.tokenAmount} $GROK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bonus Coins:</span>
                <span className="font-mono font-bold text-purple-400">+{orderDetails.bonusAmount} $GROK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Coins:</span>
                <span className="font-mono font-bold text-blue-400">{orderDetails.totalAmount} $GROK</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-400 m-6">
                If you're new to cryptocurrency, check out our{' '}
                <Link href="/dashboard/how-to-buy" className="text-blue-400 underline hover:text-blue-300">
                  How to Buy
                </Link>{' '}
                guide to get started.
              </p>
            </div>
            <Link href="/dashboard" className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

// Create a loading fallback for Suspense
function PendingFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold text-white">Loading order details...</h3>
      </div>
    </div>
  );
}

// Main component that wraps the content with Suspense
export default function PendingPage() {
  return (
    <Suspense fallback={<PendingFallback />}>
      <PendingContent />
    </Suspense>
  );
} 