/**
 * User tier system utility functions
 * Provides centralized tier calculation and progress tracking 
 */

// Tier interface representing user levels
export interface Tier {
  name: string;
  bonus: number;
  progress: number;
  nextTier: string;
  nextAmount: number;
  currentMin: number;
  nextMin: number;
}

/**
 * Calculates the user tier based on balance/token amount
 * @param balance User balance or token amount
 * @returns Tier information including bonus, progress and next tier data
 */
export function getUserTier(balance: number): Tier {
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
  
  // Maximum tier level
  return { 
    name: 'Legend', 
    bonus: 30, 
    progress: 100, 
    nextTier: 'Legend', 
    nextAmount: 0,
    currentMin: 50000,
    nextMin: 50000
  };
}

/**
 * Calculates tier progress percentage for visual indicators
 * @param amount User balance or token amount
 * @returns Progress percentage from 0-100
 */
export function getTierProgress(amount: number): number {
  if (amount < 80) return 0;
  if (amount < 100) return (amount - 80) / (100 - 80) * 16.6667;
  if (amount < 250) return 16.6667 + ((amount - 100) / (250 - 100) * 16.6667);
  if (amount < 1000) return 33.3334 + ((amount - 250) / (1000 - 250) * 16.6667);
  if (amount < 5000) return 50 + ((amount - 1000) / (5000 - 1000) * 16.6667);
  if (amount < 25000) return 66.6667 + ((amount - 5000) / (25000 - 5000) * 16.6667);
  if (amount < 50000) return 83.3334 + ((amount - 25000) / (50000 - 25000) * 16.6667);
  return 100;
}

/**
 * Gets simplified tier information with just name and bonus
 * @param amount User balance or token amount 
 * @returns Simplified tier object with name and bonus
 */
export function getCurrentTier(amount: number): { name: string; bonus: number } {
  if (amount < 80) return { name: 'Basic', bonus: 0 };
  if (amount < 100) return { name: 'Basic', bonus: 0 };
  if (amount < 250) return { name: 'Bronze', bonus: 5 };
  if (amount < 1000) return { name: 'Silver', bonus: 10 };
  if (amount < 5000) return { name: 'Gold', bonus: 15 };
  if (amount < 25000) return { name: 'Platinum', bonus: 20 };
  if (amount < 50000) return { name: 'Diamond', bonus: 25 };
  return { name: 'Legend', bonus: 30 };
} 