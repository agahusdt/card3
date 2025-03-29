export const runtime = 'edge';

import { NextResponse } from 'next/server';



type CoinPriceResponse = {
  [key: string]: {
    usd: number;
  };
};

// List of crypto IDs to fetch
const CRYPTO_IDS = [
  'bitcoin',
  'ethereum',
  'ripple',
  'tether',
  'usd-coin',
  'binancecoin',
  'cardano',
  'solana',
  'dogecoin',
  'tron',
  'litecoin',
  'stellar'
];

// Cache object to store prices and last fetch time
let priceCache: {
  prices: { [key: string]: number };
  lastUpdated: number;
} = {
  prices: {},
  lastUpdated: 0
};

// Time in milliseconds before refreshing the cache (1 minute)
const CACHE_DURATION = 60 * 1000;

export async function GET() {
  try {
    const currentTime = Date.now();
    
    // Check if cache is still valid
    if (currentTime - priceCache.lastUpdated < CACHE_DURATION && Object.keys(priceCache.prices).length > 0) {
      return NextResponse.json({
        success: true,
        prices: priceCache.prices,
        cached: true,
        lastUpdated: priceCache.lastUpdated
      });
    }

    // Fetch new prices from CoinGecko
    const coinIds = CRYPTO_IDS.join(',');
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API responded with status: ${response.status}`);
    }

    const data: CoinPriceResponse = await response.json();
    
    // Format the data for our frontend
    const prices: { [key: string]: number } = {};
    
    // Map CoinGecko IDs to our crypto symbols
    prices['BTC'] = data.bitcoin?.usd || 0;
    prices['ETH'] = data.ethereum?.usd || 0;
    prices['XRP'] = data.ripple?.usd || 0;
    prices['USDT'] = data.tether?.usd || 0;
    prices['USDC'] = data['usd-coin']?.usd || 0;
    prices['BNB'] = data.binancecoin?.usd || 0;
    prices['ADA'] = data.cardano?.usd || 0;
    prices['SOL'] = data.solana?.usd || 0;
    prices['DOGE'] = data.dogecoin?.usd || 0;
    prices['TRX'] = data.tron?.usd || 0;
    prices['LTC'] = data.litecoin?.usd || 0;
    prices['XLM'] = data.stellar?.usd || 0;
    
    // Add GROK with fixed price of 4.78
    prices['GROK'] = 4.78;
    
    // Update cache
    priceCache = {
      prices,
      lastUpdated: currentTime
    };
    
    return NextResponse.json({
      success: true,
      prices,
      cached: false,
      lastUpdated: currentTime
    });
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    
    // If cache exists, return it as fallback
    if (Object.keys(priceCache.prices).length > 0) {
      return NextResponse.json({
        success: true,
        prices: priceCache.prices,
        cached: true,
        fallback: true,
        lastUpdated: priceCache.lastUpdated,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch crypto prices',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}