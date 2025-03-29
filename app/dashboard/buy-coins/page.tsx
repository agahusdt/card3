'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import * as Collapsible from '@radix-ui/react-collapsible';
import Link from 'next/link';
import { getTierProgress, getCurrentTier } from '@/lib/userTiers';
import QRCode from 'react-qr-code';

interface CryptoCalculatorProps {
  selectedCrypto: any;
}

interface CryptoSelectorProps {
  onSelect: (crypto: any) => void;
}

interface CryptoCardProps {
  symbol: string;
  name: string;
  icon: string;
  grokAmount: string;
  viewMode: string;
  onClick?: () => void;
  contractAddress?: string;
  price?: number;
  isSelected?: boolean;
  networks?: Record<string, string>;
}

// Static crypto information (without grokAmount which will be calculated dynamically)
const staticCryptoList: Omit<CryptoCardProps, 'grokAmount' | 'viewMode'>[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/btc.svg',
    contractAddress: 'bc1qcez97tlhc0aezv3w7wcpcmf4c2lk296xuad4kt'
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/usdt.svg',
    contractAddress: '0x9fd175c249060e3b5f6aCe89ce25a023e0709c9a',  // ERC20
    networks: {
      ERC20: '0x9fd175c249060e3b5f6aCe89ce25a023e0709c9a',
      TRC20: 'TCiHoNRXm9Fmk6xgXA4AjY1XWxZuTY3PYR',
      BEP20: '0x9fd175c249060e3b5f6aCe89ce25a023e0709c9a'
    }
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/usdc.svg',
    contractAddress: '0x9fd175c249060e3b5f6aCe89ce25a023e0709c9a'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/eth.svg',
    contractAddress: '0x9fd175c249060e3b5f6aCe89ce25a023e0709c9a'
  },
  {
    symbol: 'TRX',
    name: 'Tron',
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/trx.svg',
    contractAddress: 'TUn6h87CkZHGGuXUV195amqEFLmRvQiikf'
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/xrp.svg',
    contractAddress: 'rnD5LYFyEirJpNSeLgSsBnsiKAXroUDP9N'
  },
  {
    symbol: 'XLM',
    name: 'Stellar',
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/xlm.svg',
    contractAddress: 'GDHT3HIZF2MYSL34A7PA2MRZDBXE63S2KVXFV67UJYZQMNF7CLEJVSYO'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/sol.svg',
    contractAddress: 'FsMPu9GaKLmJ8KHTDoLCnVH453wzP3fRHG72twLckpUV'
  },
  {
    symbol: 'BNB',
    name: 'Binance Coin',
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/bnb.svg',
    contractAddress: '0x9fd175c249060e3b5f6aCe89ce25a023e0709c9a'
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/doge.svg',
    contractAddress: 'DGreMdcR7DQo3uuZ1fvxoo6cJZ4bugzKZb'
  },
  {
    symbol: 'LTC',
    name: 'Litecoin',
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/ltc.svg',
    contractAddress: 'MD8udRKvamizENMmx9mB7ySCmcKYHTEfu3'
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    icon: 'https://cryptologos.cc/logos/cardano-ada-logo.svg?v=040',
    contractAddress: 'addr1qxpryyaztrewq0ar0wzqffmvwsdvzsndeh8pdp4endkugzqty05vsxk37s76y4warh7gzvqxlmdzjjmxpatype2awujqfcsz5c'
  }
];

function CryptoCalculator({ selectedCrypto }: CryptoCalculatorProps) {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [isSwapped, setIsSwapped] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('ERC20');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('wallet');
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [cryptoAmount, setCryptoAmount] = useState('');

  // Function to get the correct wallet address based on selected network for USDT
  const getWalletAddress = () => {
    if (selectedCrypto?.symbol === 'USDT' && selectedCrypto.networks && selectedCrypto.networks[selectedNetwork]) {
      return selectedCrypto.networks[selectedNetwork];
    }
    return selectedCrypto?.contractAddress;
  };

  const handleSwap = () => {
    const amountNum = parseFloat(amount) || 0;
    
    if (isSwapped) {
      // Switch back to GROK input
      setAmount(cryptoAmount || '');
    } else {
      // Switch to crypto input
      // Save current GROK amount
      setCryptoAmount(amount);
      
      // Calculate equivalent crypto amount
      const cryptoValue = selectedCrypto?.grokAmount 
        ? (amountNum / parseFloat(selectedCrypto.grokAmount)).toFixed(6) 
        : '0';
      
      setAmount(cryptoValue);
    }
    
    setIsSwapped(!isSwapped);
  };

  const networks = ['ERC20', 'TRC20', 'BEP20'];

  const tiers = [
    { min: 100, label: '100' },
    { min: 250, label: '250' },
    { min: 1000, label: '1.000' },
    { min: 5000, label: '5.000' },
    { min: 25000, label: '25.000' },
    { min: 50000, label: '50.000' }
  ];

  // Update the amountValue calculation to handle both modes
  const getGrokAmount = () => {
    if (isSwapped) {
      // When in crypto mode, calculate the equivalent GROK amount
      // Use Math.round to ensure we get whole GROK numbers
      return Math.round(parseFloat(amount || '0') * parseFloat(selectedCrypto?.grokAmount || '1'));
    } else {
      // In GROK mode, use the amount directly
      return parseFloat(amount || '0');
    }
  };

  const amountValue = getGrokAmount();
  const tier = getCurrentTier(amountValue);
  const progress = getTierProgress(amountValue);
  const bonusAmount = (amountValue * tier.bonus) / 100;
  const totalAmount = amountValue + bonusAmount;

  const handleCopyAmount = async () => {
    if (amountValue > 100000) {
      alert('Maximum purchase amount is 100,000 GROK');
      return;
    }
    // Directly use the amount in the swapped mode, otherwise calculate it
    const amountToCopy = isSwapped ? amount : (amountValue / parseFloat(selectedCrypto?.grokAmount || "1")).toFixed(6);
    await navigator.clipboard.writeText(amountToCopy);
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleCopyAddress = async () => {
    const address = getWalletAddress();
    if (!address) {
      alert('No address available for this cryptocurrency');
      return;
    }
    await navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  // Generate a unique order ID
  const generateOrderId = () => {
    return `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const handlePaymentSent = async () => {
    if (!selectedCrypto) {
      alert('Please select a payment method');
      return;
    }
    try {
      const cryptoAmount = isSwapped ? amount : (amountValue / parseFloat(selectedCrypto?.grokAmount || "1")).toFixed(6);
      const orderId = generateOrderId();

      // Create purchase record in database
      const response = await fetch('/api/create-token-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cryptoAmount,
          cryptoSymbol: selectedCrypto.symbol,
          tokenAmount: amountValue,
          bonusAmount,
          totalAmount,
          orderId,
          network: selectedCrypto.symbol === 'USDT' ? selectedNetwork : null
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Cloudflare Analytics otomatik olarak çalışacak, manuel log gerekli değil
        
        // Close dialog and redirect to pending page with order details
        setIsPaymentDialogOpen(false);
        
        // Fix the number formatting to ensure consistent display
        const params = new URLSearchParams({
          cryptoAmount,
          cryptoSymbol: selectedCrypto.symbol,
          tokenAmount: Math.round(amountValue).toString(), // Round to whole number
          bonusAmount: Math.round(bonusAmount).toString(), // Round to whole number
          totalAmount: Math.round(totalAmount).toString(), // Round to whole number
          orderId,
          address: getWalletAddress() || '0xc53Cb23f3F6DF46a4904Cabb8712F0E98D471e4e'
        });
        router.push(`/dashboard/pending?${params.toString()}`);
      } else {
        alert(data.message || 'Failed to create purchase. Please try again.');
      }
    } catch (error) {
      console.error('Error creating purchase:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex flex-col space-y-1.5 border-b border-white/5 p-6">
        <div className="tracking-tight text-xl font-semibold text-white flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-calculator w-5 h-5 text-blue-400 text-white"
          >
            <rect width="16" height="20" x="4" y="2" rx="2"></rect>
            <line x1="8" x2="16" y1="6" y2="6"></line>
            <line x1="16" x2="16" y1="14" y2="18"></line>
            <path d="M16 10h.01"></path>
            <path d="M12 10h.01"></path>
            <path d="M8 10h.01"></path>
            <path d="M12 14h.01"></path>
            <path d="M8 14h.01"></path>
            <path d="M12 18h.01"></path>
            <path d="M8 18h.01"></path>
          </svg>
          Calculator
        </div>
      </div>
      <div className="p-4 text-white">
        {selectedCrypto ? (
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent rounded-2xl"></div>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex w-full items-center gap-4">
                  <div className="flex-grow relative">
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-sm bg-[length:200%_200%] animate-gradient-move"></div>
                      <input
                        className="flex py-1 shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm relative text-lg h-14 sm:h-16 px-4 sm:px-6 w-full bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="Enter amount"
                        type="number"
                        value={amount}
                        onChange={(e) => {
                          const value = e.target.value;
                          
                          if (isSwapped) {
                            // If in crypto mode, check only maximum limit
                            const grokEquivalent = parseFloat(value || '0') * parseFloat(selectedCrypto?.grokAmount || '1');
                            
                            if (grokEquivalent > 100000) {
                              // Cap at maximum
                              const maxCrypto = 100000 / parseFloat(selectedCrypto?.grokAmount || '1');
                              setAmount(maxCrypto.toFixed(6));
                            } else {
                              setAmount(value);
                            }
                          } else {
                            // If in GROK mode, check only maximum limit
                            const numValue = parseFloat(value);
                            if (numValue > 100000) {
                              setAmount('100000');
                            } else {
                              setAmount(value);
                            }
                          }
                        }}
                        min=""
                        max={isSwapped ? (100000 / parseFloat(selectedCrypto?.grokAmount || '1')).toFixed(6) : '100000'}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="px-3 py-1.5 rounded-lg bg-white/5 text-sm font-medium text-gray-400">
                          {isSwapped ? selectedCrypto.symbol : '$GROK'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSwap}
                    className="h-14 sm:h-16 px-4 rounded-2xl w-auto bg-black/40 backdrop-blur-xl border border-white/5 hover:border-blue-500/50 transition-all duration-300 flex items-center justify-center group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-up-down w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform"
                    >
                      <path d="m21 16-4 4-4-4"></path>
                      <path d="M17 20V4"></path>
                      <path d="m3 8 4-4 4 4"></path>
                      <path d="M7 4v16"></path>
                    </svg>
                  </button>
                </div>
                {selectedCrypto.symbol === 'USDT' && (
                  <div className="w-full sm:w-48 relative z-10">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button
                          className="text-xl h-14 sm:h-16 px-4 sm:px-6 text-xl sm:text-xl w-full border border-white/5 rounded-2xl text-white bg-black/40 backdrop-blur-xl focus:outline-none hover:border-blue-500/50 transition-all duration-300"
                          type="button"
                        >
                          {selectedNetwork}
                        </button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="z-50 min-w-[8rem] overflow-hidden p-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 bg-black/40 text-white rounded-xl shadow-lg backdrop-blur-xl border border-white/5"
                          sideOffset={5}
                        >
                          {networks.map((network) => (
                            <DropdownMenu.Item
                              key={network}
                              className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 !text-white [&>*]:text-white hover:bg-white/10 focus:bg-white/10 transition-all duration-300"
                              onSelect={() => setSelectedNetwork(network)}
                            >
                              {network}
                            </DropdownMenu.Item>
                          ))}
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                )}
              </div>
            </div>
            {amountValue > 0 && (
              <div className="space-y-6">
                <div className="relative space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progress to next tier</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">{amountValue} $GROK</span>
                      <span className="text-blue-400">{tier.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <div className="flex items-center gap-2">
                      <span>Min:</span>
                      <div className="px-2 py-0.5 rounded-lg bg-white/5 font-medium">80 $GROK</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Max:</span>
                      <div className="px-2 py-0.5 rounded-lg bg-white/5 font-medium">100,000 $GROK</div>
                    </div>
                  </div>
                  <div className="h-3 bg-black/40 rounded-full overflow-hidden backdrop-blur-xl border border-white/5">
                    <div className="relative h-full flex">
                      {tiers.map((_, index) => (
                        <div
                          key={index}
                          className="h-full border-r border-white/10 flex-grow last:border-0"
                          style={{ flexBasis: '16.6667%' }}
                        />
                      ))}
                      <div
                        className={`absolute top-0 left-0 h-full ${tier.name === 'Legendary' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 px-1">
                    {tiers.map((t, index) => (
                      <div key={index} className="text-center">{t.label}</div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative overflow-hidden bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-blue-500/20 transition-all duration-300">
                    <p className="text-sm text-gray-400">You Pay</p>
                    <div className="flex items-baseline mt-2">
                      <span className="text-xl sm:text-2xl font-bold text-white">
                        {isSwapped 
                          ? amount 
                          : (parseFloat(amount || '0') / parseFloat(selectedCrypto.grokAmount)).toFixed(6)}
                      </span>
                      <span className="ml-2 text-blue-400 font-medium">{selectedCrypto.symbol}</span>
                    </div>
                  </div>
                  <div className="relative overflow-hidden bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-blue-500/20 transition-all duration-300">
                    <p className="text-sm text-gray-400">You Receive</p>
                    <div className="flex items-baseline mt-2">
                      <span className="text-xl sm:text-2xl font-bold text-white">
                        {isSwapped 
                          ? Math.round(parseFloat(amount || '0') * parseFloat(selectedCrypto.grokAmount)) 
                          : amount}
                      </span>
                      <span className="ml-2 text-blue-400 font-medium">$GROK</span>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl border border-blue-500/20 p-4 sm:p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/5"></div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-gray-400">Status Level</h3>
                        <div className="px-2 py-0.5 rounded-full bg-blue-500/20 text-xs font-medium text-blue-400">
                          {tier.bonus}% Bonus
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-white mt-2">{tier.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-dollar-sign w-12 h-12 text-blue-500/30 mx-auto"
            >
              <line x1="12" x2="12" y1="2" y2="22"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <p className="text-gray-400">Select a payment method to calculate your Coins</p>
            <div className="absolute left-1/2 -translate-x-1/2 sm:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-down w-8 h-8 text-blue-400/50 animate-bounce"
              >
                <path d="M12 5v14"></path>
                <path d="m19 12-7 7-7-7"></path>
              </svg>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 hidden sm:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-right w-8 h-8 text-blue-400/50 animate-pulse"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>
          </div>
        )}
      </div>
      {selectedCrypto && (
        <div className="p-6 border-t border-white/5 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <span style={{ position: 'absolute', border: 0, width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', overflowWrap: 'normal' }}>
              <h2 id="radix-:r1:" className="text-lg font-semibold leading-none tracking-tight">Payment</h2>
            </span>
          </div>
          <Dialog.Root open={isDialogOpen ? true : false} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger asChild>
              <button
                className="whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 md:px-8 md:py-5 text-base md:text-lg font-semibold rounded-2xl shadow-indigo-900/20 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                disabled={amountValue < 80}
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-credit-card w-4 h-4 md:w-5 md:h-5"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                  <line x1="2" x2="22" y1="10" y2="10"></line>
                </svg>
                {amountValue >= 80 ? 'Purchase Coins' : 'Minimum required: 80 $GROK'}
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-w-2xl p-0 border-0 rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 text-white w-[calc(100%-2rem)] md:w-auto">
                <Dialog.Title className="sr-only">Checkout</Dialog.Title>
                <div className="flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] overflow-hidden">
                  <div className="w-full md:w-1/2 bg-indigo-900/20 flex flex-col overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between">
                      <h2 className="text-xl md:text-2xl font-bold">Checkout</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                      <div className="space-y-4 md:space-y-6">
                        <div className="rounded-xl bg-white/5 p-4">
                          <h3 className="text-xs md:text-sm font-medium text-indigo-300 uppercase tracking-wider mb-3">Your Purchase</h3>
                          <div className="flex items-center gap-3 md:gap-4 mb-4">
                            <div className="w-12 h-12 md:w-12 md:h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                              <img alt="Logo" loading="lazy" width="35" height="35" decoding="async" className="transform group-hover:scale-105 transition-all duration-200" src="/grok.svg" />
                            </div>
                            <div>
                              <h4 className="font-medium">$GROK Coins</h4>
                              <p className="text-xs md:text-sm text-indigo-200">Stage 3 Price</p>
                            </div>
                          </div>
                          <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Base Coins</span>
                              <span>{amountValue.toFixed(2)} $GROK</span>
                            </div>
                            <div className="flex justify-between text-indigo-300">
                              <span>Bonus </span>
                              <span>+{bonusAmount.toFixed(2)} $GROK</span>
                            </div>
                            <div className="pt-2 md:pt-3 border-t border-white/10 flex justify-between font-medium">
                              <span>Total Coins</span>
                              <span>{totalAmount.toFixed(2)} $GROK</span>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-xl bg-white/5 p-4">
                          <h3 className="text-xs md:text-sm font-medium text-indigo-300 uppercase tracking-wider mb-3">Payment Details</h3>
                          <div className="flex items-center gap-3 p-3 bg-indigo-900/30 rounded-lg mb-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-indigo-900/50 flex items-center justify-center">
                              <img alt={selectedCrypto.symbol} loading="lazy" width="20" height="20" decoding="async" src={selectedCrypto.icon} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium text-sm">{selectedCrypto.symbol}</span>
                                <span className="text-sm">{(amountValue / parseFloat(selectedCrypto.grokAmount)).toFixed(6)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-2xs md:text-xs text-gray-400 mb-3">
                            Rate: 1 {selectedCrypto.symbol} = {selectedCrypto.grokAmount} $GROK
                          </div>
                          <div role="alert" className="relative w-full rounded-lg border px-4 py-3 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7 text-foreground bg-black/20 border-indigo-500/30 text-2xs md:text-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info w-3 h-3 md:w-4 md:h-4 text-indigo-400">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M12 16v-4"></path>
                              <path d="M12 8h.01"></path>
                            </svg>
                            <div className="text-sm [&_p]:leading-relaxed text-gray-300">
                              Coins will be credited to your account after payment confirmation
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 md:p-6 mt-auto border-t border-white/10">
                      <div className="flex items-start gap-3 mb-4">
                        <p className="text-xs md:text-sm text-gray-300">
                          By proceeding, you agree to our{' '}
                          <span 
                            className="text-indigo-400 hover:underline cursor-pointer"
                            onClick={() => setIsTermsDialogOpen(true)}
                          >
                            Terms & Conditions
                          </span>
                          .
                        </p>
                      </div>
                      <button 
                        onClick={() => setIsPaymentDialogOpen(true)}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 w-full py-3 md:py-4 rounded-xl text-white font-medium transition-all duration-300 bg-indigo-600 hover:bg-indigo-700"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </div>
                  <div className="hidden md:block w-1/2 bg-gradient-to-br from-indigo-800/10 to-purple-800/10 p-8">
                    <div className="h-full flex flex-col">
                      <h2 className="text-2xl font-bold mb-6 text-center">Why Buy $GROK?</h2>
                      <div className="space-y-6 flex-1">
                        <div className="flex gap-4 p-4 rounded-xl bg-white/5">
                          <div className="w-12 h-12 rounded-xl bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rocket w-6 h-6 text-indigo-400">
                              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-indigo-200">Early Investor Advantage</h3>
                            <p className="text-sm text-gray-400 mt-1">Get in early with pre-launch pricing before exchange listing</p>
                          </div>
                        </div>
                        <div className="flex gap-4 p-4 rounded-xl bg-white/5">
                          <div className="w-12 h-12 rounded-xl bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-6 h-6 text-indigo-400">
                              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                              <path d="M20 3v4"></path>
                              <path d="M22 5h-4"></path>
                              <path d="M4 17v2"></path>
                              <path d="M5 18H3"></path>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-indigo-200">Stage 3 Bonuses</h3>
                            <p className="text-sm text-gray-400 mt-1">Current stage offers bonus Coins on all purchases</p>
                          </div>
                        </div>
                        <div className="flex gap-4 p-4 rounded-xl bg-white/5">
                          <div className="w-12 h-12 rounded-xl bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart w-6 h-6 text-indigo-400">
                              <circle cx="8" cy="21" r="1"></circle>
                              <circle cx="19" cy="21" r="1"></circle>
                              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-indigo-200">Limited Supply</h3>
                            <p className="text-sm text-gray-400 mt-1">Only 30% of total supply available during presale</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/20">
                        <div className="flex items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-5 h-5 text-indigo-400">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <div>
                            <h3 className="font-medium text-indigo-200">Limited Time Offer</h3>
                            <p className="text-sm text-gray-400">Price increases in Stage 4</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="block md:hidden border-t border-white/10">
                    <Collapsible.Root className="w-full">
                      <Collapsible.Trigger className="w-full p-4 flex items-center justify-between border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info w-4 h-4 text-indigo-400">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 16v-4"></path>
                            <path d="M12 8h.01"></path>
                          </svg>
                          <span className="font-medium">Why buy $GROK?</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-4 h-4 text-indigo-400 transition-transform duration-200 ui-open:rotate-180">
                          <path d="m6 9 6 6 6-6"></path>
                        </svg>
                      </Collapsible.Trigger>
                      <Collapsible.Content className="p-4 bg-indigo-900/10">
                        <div className="space-y-4">
                          <div className="flex gap-3 p-3 rounded-lg bg-white/5">
                            <div className="w-10 h-10 rounded-lg bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rocket w-5 h-5 text-indigo-400">
                                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-sm text-indigo-200">Early Investor Advantage</h3>
                              <p className="text-xs text-gray-400 mt-0.5">Pre-launch pricing before exchange listing</p>
                            </div>
                          </div>
                          <div className="flex gap-3 p-3 rounded-lg bg-white/5">
                            <div className="w-10 h-10 rounded-lg bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-5 h-5 text-indigo-400">
                                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                                <path d="M20 3v4"></path>
                                <path d="M22 5h-4"></path>
                                <path d="M4 17v2"></path>
                                <path d="M5 18H3"></path>
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-sm text-indigo-200">Stage 3 Bonuses</h3>
                              <p className="text-xs text-gray-400 mt-0.5">Bonus Coins on all purchases</p>
                            </div>
                          </div>
                          <div className="flex gap-3 p-3 rounded-lg bg-white/5">
                            <div className="w-10 h-10 rounded-lg bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart w-5 h-5 text-indigo-400">
                                <circle cx="8" cy="21" r="1"></circle>
                                <circle cx="19" cy="21" r="1"></circle>
                                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-sm text-indigo-200">Limited Supply</h3>
                              <p className="text-xs text-gray-400 mt-0.5">Only 30% available during presale</p>
                            </div>
                          </div>
                        </div>
                      </Collapsible.Content>
                    </Collapsible.Root>
                  </div>
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
        </div>
      )}

      <Dialog.Root open={isTermsDialogOpen} onOpenChange={setIsTermsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-w-lg p-6 rounded-2xl bg-slate-900 text-white">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <Dialog.Title className="tracking-tight text-lg font-semibold">Terms & Conditions</Dialog.Title>
            </div>
            <div className="text-sm text-gray-300 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <p><strong>1. Acceptance of Terms</strong></p>
              <p>By accessing or using this service, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.</p>
              <p><strong>2. Eligibility</strong></p>
              <p>You must be of legal age in your jurisdiction to use this service. By proceeding, you confirm that you meet the legal requirements.</p>
              <p><strong>3. Financial Risk</strong></p>
              <p>All transactions are final and non-refundable. Cryptocurrency transactions are volatile, and we are not responsible for any financial losses incurred.</p>
              <p><strong>4. Account Security</strong></p>
              <p>You are responsible for maintaining the security of your account credentials and transactions. We will not be held liable for unauthorized access.</p>
              <p><strong>5. Fraud & Misuse</strong></p>
              <p>Any fraudulent activity, including chargebacks, money laundering, or manipulation, will result in account suspension and legal action.</p>
              <p><strong>6. Regulatory Compliance</strong></p>
              <p>You are responsible for ensuring that your use of this service complies with all applicable laws and regulations in your jurisdiction.</p>
              <p><strong>7. Changes to Terms</strong></p>
              <p>We reserve the right to update these terms at any time without prior notice. Continued use of the service constitutes acceptance of the revised terms.</p>
              <p><strong>8. Data Privacy</strong></p>
              <p>Your data is handled in accordance with our Privacy Policy. We do not sell or share personal information without consent.</p>
              <p><strong>9. Service Availability</strong></p>
              <p>We strive for continuous service uptime but do not guarantee uninterrupted access. We are not liable for downtime or technical issues.</p>
              <p><strong>10. Limitation of Liability</strong></p>
              <p>Under no circumstances shall we be held liable for any indirect, incidental, or consequential damages arising from the use of this service.</p>
              <p><strong>11. Contact Information</strong></p>
              <p>If you have any questions about these terms, please contact our support team.</p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={() => setIsTermsDialogOpen(false)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input shadow-sm h-9 px-4 w-full py-3 md:py-4 rounded-xl text-white font-medium transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 hover:text-white"
              >
                Back
              </button>
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

      <Dialog.Root open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-w-2xl p-0 border-0 rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 text-white w-[calc(100%-2rem)] md:w-auto">
            <div className="flex flex-col h-screen md:h-[85vh] bg-slate-950">
              <div className="flex flex-col space-y-1.5 text-center sm:text-left p-4 md:p-6 border-b border-white/10 bg-gradient-to-r from-slate-900 to-indigo-900/20 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="tracking-tight text-xl md:text-2xl font-bold text-white">Payment Instructions</Dialog.Title>
                </div>
              </div>
              <div dir="ltr" data-orientation="horizontal" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 md:px-6 pt-4 md:pt-6 border-b border-white/10">
                  <div role="tablist" aria-orientation="horizontal" className="items-center justify-center text-muted-foreground w-full bg-slate-900 p-1 rounded-lg grid grid-cols-2 h-auto">
                    <button
                      type="button"
                      role="tab"
                      className={`whitespace-nowrap rounded-md px-3 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow py-3 text-sm ${activeTab === 'wallet' ? 'bg-indigo-600 text-white' : ''} flex items-center justify-center gap-2`}
                      onClick={() => setActiveTab('wallet')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet w-4 h-4">
                        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                      </svg>
                      <span>Crypto Wallet</span>
                    </button>
                    <button
                      type="button"
                      role="tab"
                      className={`whitespace-nowrap rounded-md px-3 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow py-3 text-sm ${activeTab === 'qr' ? 'bg-indigo-600 text-white' : ''} flex items-center justify-center gap-2`}
                      onClick={() => setActiveTab('qr')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-qr-code w-4 h-4">
                        <rect width="5" height="5" x="3" y="3" rx="1"></rect>
                        <rect width="5" height="5" x="16" y="3" rx="1"></rect>
                        <rect width="5" height="5" x="3" y="16" rx="1"></rect>
                        <path d="M21 16h-3a2 2 0 0 0-2 2v3"></path>
                        <path d="M21 21v.01"></path>
                        <path d="M12 7v3a2 2 0 0 1-2 2H7"></path>
                        <path d="M3 12h.01"></path>
                        <path d="M12 3h.01"></path>
                        <path d="M12 16v.01"></path>
                        <path d="M16 12h1"></path>
                        <path d="M21 12v.01"></path>
                        <path d="M12 21v-1"></path>
                      </svg>
                      <span>QR Code</span>
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden flex flex-col">
                  {activeTab === 'wallet' && (
                    <div className="flex-1 overflow-y-auto mt-0">
                      <div className="p-4 md:p-6">
                        <div className="rounded-xl border text-card-foreground shadow bg-slate-900/60 border-white/5 mb-20 md:mb-0">
                          <div className="flex flex-col space-y-1.5 p-6 pb-3">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold tracking-tight text-lg md:text-xl text-white">Send Payment</div>
                              <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow hover:bg-primary/80 bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                                Awaiting
                              </div>
                            </div>
                            <div className="text-sm text-gray-400">Order ID: #7YS55F8NNNE</div>
                          </div>
                          <div className="p-6 pt-0 space-y-6">
                            <div className="space-y-3">
                              <label className="text-sm text-indigo-200 font-medium flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send w-4 h-4">
                                  <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                                  <path d="m21.854 2.147-10.94 10.939"></path>
                                </svg>
                                Send exactly this amount:
                              </label>
                              <div className="p-4 bg-indigo-950/50 rounded-xl flex items-center justify-between border border-indigo-500/20">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-indigo-900/50 flex items-center justify-center">
                                    <img alt={selectedCrypto?.symbol} width="24" height="24" src={selectedCrypto?.icon} />
                                  </div>
                                  <div>
                                    <div className="font-mono text-xl font-semibold text-white">
                                      {(amountValue / parseFloat(selectedCrypto?.grokAmount || "1")).toFixed(6)}
                                    </div>
                                    <div className="text-sm text-gray-500">{selectedCrypto?.symbol}</div>
                                  </div>
                                </div>
                                <button 
                                  onClick={handleCopyAmount}
                                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground h-10 w-10 rounded-lg bg-indigo-900/50 hover:bg-indigo-800/60">
                                  {copiedAmount ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="lucide lucide-check w-5 h-5 text-green-400 animate-fade-in"
                                    >
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  ) : (
                                    <svg 
                                      xmlns="http://www.w3.org/2000/svg" 
                                      width="24" 
                                      height="24" 
                                      viewBox="0 0 24 24" 
                                      fill="none" 
                                      stroke="currentColor" 
                                      strokeWidth="2" 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      className="lucide lucide-copy w-5 h-5 text-indigo-400"
                                    >
                                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <label className="text-sm text-indigo-200 font-medium flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet w-4 h-4">
                                  <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                                  <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                                </svg>
                                To this wallet address:
                              </label>
                              <div className="p-4 bg-indigo-950/50 rounded-xl border border-indigo-500/20">
                                <div className="flex justify-between items-center gap-4">
                                  <div className="overflow-hidden">
                                    <div className="font-mono text-sm break-all text-gray-300">
                                      {getWalletAddress() || 'Select a cryptocurrency'}
                                    </div>
                                  </div>
                                  <button 
                                    onClick={handleCopyAddress}
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground h-10 w-10 rounded-lg bg-indigo-900/50 hover:bg-indigo-800/60 flex-shrink-0">
                                    {copiedAddress ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-check w-5 h-5 text-green-400 animate-fade-in"
                                      >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                    ) : (
                                      <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        width="24" 
                                        height="24" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        className="lucide lucide-copy w-5 h-5 text-indigo-400"
                                      >
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                                      </svg>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="bg-indigo-950/30 rounded-xl p-4 border border-indigo-500/10">
                              <h4 className="text-sm font-medium text-indigo-300 mb-4">Payment Steps</h4>
                              <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-6 h-6 rounded-full bg-indigo-900/70 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs text-indigo-300">1</span>
                                  </div>
                                  <p className="text-sm text-gray-300">Copy the address and amount above</p>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-6 h-6 rounded-full bg-indigo-900/70 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs text-indigo-300">2</span>
                                  </div>
                                  <p className="text-sm text-gray-300">Send payment from your wallet or exchange</p>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-6 h-6 rounded-full bg-indigo-900/70 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs text-indigo-300">3</span>
                                  </div>
                                  <p className="text-sm text-gray-300">Wait for blockchain confirmation</p>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-6 h-6 rounded-full bg-indigo-900/70 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs text-indigo-300">4</span>
                                  </div>
                                  <p className="text-sm text-gray-300">Click 'I've Sent Payment' after sending</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/95 border-t border-white/10 backdrop-blur-sm z-50 md:relative md:bg-transparent md:border-0 md:p-0 md:backdrop-blur-none">
                            <div className="max-w-2xl mx-auto flex gap-3">
                              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border shadow-sm h-9 px-4 flex-1 bg-red-950 border-white/20 text-white hover:bg-red-950/30 hover:text-red-300 py-6 md:py-4 text-sm">
                                Cancel Order
                              </button>
                              <button 
                                onClick={handlePaymentSent}
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 flex-1 bg-green-600 hover:bg-green-700 text-white py-6 md:py-4 text-sm shadow-lg shadow-green-900/20"
                              >
                                I've Sent Payment
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'qr' && (
                    <div className="flex-1 overflow-y-auto mt-0">
                      <div className="p-6 text-center">
                        <div className="max-w-xs mx-auto space-y-6">
                          <div className="bg-white p-4 rounded-2xl mx-auto">
                            <QRCode
                              size={256}
                              value={getWalletAddress() || ''}
                              style={{height: 'auto', maxWidth: '100%', width: '100%'}}
                            />
                          </div>
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="flex items-center gap-2">
                              {selectedCrypto && (
                                <img 
                                  src={selectedCrypto.icon} 
                                  alt={selectedCrypto.symbol} 
                                  className="w-6 h-6" 
                                />
                              )}
                              <span className="font-medium text-lg text-white">
                                {isSwapped ? amount : (amountValue / parseFloat(selectedCrypto?.grokAmount || "1")).toFixed(6)} {selectedCrypto?.symbol}
                              </span>
                            </div>
                            <div className="text-sm text-gray-400 break-all">
                              {getWalletAddress()}
                            </div>
                          </div>
                          <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
                            <h3 className="font-medium text-lg mb-2 text-white">Scan with your wallet</h3>
                            <p className="text-sm text-gray-400">Open your crypto wallet app and scan this QR code to make your payment</p>
                          </div>
                          <div className="p-4 bg-indigo-950/30 rounded-xl border border-indigo-500/20">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-triangle-alert w-5 h-5 text-indigo-400">
                                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
                                  <path d="M12 9v4"></path>
                                  <path d="M12 17h.01"></path>
                                </svg>
                              </div>
                              <div className="text-left">
                                <h4 className="font-medium text-base text-indigo-200">Verify Amount</h4>
                                <p className="text-sm text-gray-400 mt-1">Make sure your wallet shows exactly {(amountValue / parseFloat(selectedCrypto?.grokAmount || "1")).toFixed(6)} {selectedCrypto?.symbol}</p>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={handlePaymentSent}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 px-4 w-full bg-green-600 hover:bg-green-700 text-white py-3"
                          >
                            I've Completed Payment
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
    </div>
  );
}

function CryptoCard({ symbol, name, icon, grokAmount, viewMode, onClick, contractAddress, isSelected }: CryptoCardProps & { isSelected?: boolean }) {
  return (
    <div className="animate-fade-in">
      <div 
        className={`
          group relative bg-black/40 backdrop-blur-xl
          border border-white/5 rounded-2xl
          cursor-pointer overflow-hidden
          hover:border-blue-500/50 transition-all duration-300
          ${isSelected ? 'border-blue-500 shadow-[0_0_30px_rgba(0,0,255,0.15)]' : ''}
        `}
        tabIndex={0}
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {isSelected && <div className="absolute inset-0 bg-blue-500/5"></div>}
        <div className="relative p-5 flex items-center gap-5">
          <div className="relative">
            <div className="rounded-xl bg-gradient-to-br from-black/80 to-black/40 flex items-center justify-center border border-white/5 shadow-inner w-16 h-16 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300">
              <img
                alt={symbol}
                loading="lazy"
                width={34}
                height={34}
                decoding="async"
                className="group-hover:scale-110 transition-transform duration-300"
                src={icon}
                style={{ color: 'transparent' }}
              />
            </div>
            {isSelected && (
              <div className="absolute -right-1 -top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-black shadow-md"></div>
            )}
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                {symbol}
              </h3>
            </div>
            <div className="flex flex-col mt-1.5 gap-1.5">
              <p className="text-sm text-gray-400 truncate flex items-center gap-1.5">
                <span className={`text-gray-300 font-medium inline-block ${viewMode === 'list' ? '' : 'sm:animate-[marqueeBounce_6s_linear_infinite]'}`}>
                  1 <span className="text-[10px] text-gray-400">{symbol}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-refresh-cw w-3.5 h-3.5 text-gray-500 inline mx-1"
                  >
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                    <path d="M21 3v5h-5"></path>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                    <path d="M8 16H3v5"></path>
                  </svg>
                  {grokAmount}
                  <span className="text-[10px] text-gray-400"> $GROK</span>
                </span>
              </p>
            </div>
          </div>
          <div className="text-gray-500 group-hover:text-blue-400 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-right w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ExtendedCryptoSelectorProps extends CryptoSelectorProps {
  cryptoList: CryptoCardProps[];
}

function CryptoSelector({ onSelect, cryptoList }: ExtendedCryptoSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const itemsPerPage = 12;
  const [viewMode, setViewMode] = useState('grid');

  const handleSelect = (crypto: CryptoCardProps) => {
    setSelectedCrypto(crypto.symbol);
    onSelect(crypto);
    
    // Scroll to top on mobile
    if (window.innerWidth < 1024) { // lg breakpoint is 1024px
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleClearSelection = () => {
    setSelectedCrypto(null);
    onSelect(null);
  };

  const filteredCryptos = cryptoList.filter((crypto: CryptoCardProps) =>
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCryptos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCryptos = filteredCryptos.slice(startIndex, endIndex);

  return (
    <div className="relative">
      <div className="relative" id="crypto-selector">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 rounded-2xl blur-3xl"></div>
        <div className="space-y-8">
          <div className="block relative z-20 mb-2 sm:mb-0 sm:absolute sm:-top-10 sm:left-0">
            {selectedCrypto && (
              <button
                onClick={handleClearSelection}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-white h-9 px-4 py-2 text-gray-400 hover:text-black"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-4 h-4 mr-2">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
                Clear selection
              </button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow group">
              <input
                className="flex px-3 py-1 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full h-12 pl-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-blue-500/50 transition-all group-hover:border-white/20"
                placeholder="Search cryptocurrency..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-gray-300 transition-colors"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <div className="absolute inset-0 rounded-xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-1 hover:border-white/20 transition-colors">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10' : 'text-gray-400 hover:text-gray-300'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-grid3x3 w-5 h-5"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <path d="M3 9h18"></path>
                    <path d="M3 15h18"></path>
                    <path d="M9 3v18"></path>
                    <path d="M15 3v18"></path>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10' : 'text-gray-400 hover:text-gray-300'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-list w-5 h-5"
                  >
                    <path d="M3 12h.01"></path>
                    <path d="M3 18h.01"></path>
                    <path d="M3 6h.01"></path>
                    <path d="M8 12h13"></path>
                    <path d="M8 18h13"></path>
                    <path d="M8 6h13"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className={`grid gap-4 transition-all ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {currentCryptos.map((crypto) => (
              <CryptoCard 
                key={crypto.symbol} 
                {...crypto} 
                viewMode={viewMode}
                onClick={() => handleSelect(crypto)}
                isSelected={selectedCrypto === crypto.symbol}
              />
            ))}
          </div>

          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="p-2 rounded-lg bg-black/40 backdrop-blur-xl border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500/50 hover:bg-blue-500/5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-left w-5 h-5"
              >
                <path d="m15 18-6-6 6-6"></path>
              </svg>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg text-sm">
              <span className="text-blue-400">{currentPage}</span>
              <span className="text-gray-500">/</span>
              <span className="text-gray-400">{totalPages}</span>
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="p-2 rounded-lg bg-black/40 backdrop-blur-xl border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500/50 hover:bg-blue-500/5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-right w-5 h-5"
              >
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </button>
          </div>
          <div className="text-center text-gray-500 text-sm">Need help? Contact our support team 24/7</div>
        </div>
      </div>
    </div>
  );
}

export default function BuyCoinsPage() {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCardProps | null>(null);
  const [cryptoList, setCryptoList] = useState<CryptoCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const GROK_PRICE = 4.78; // Fixed GROK price

  // Fetch crypto prices and calculate GROK amount
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/crypto-prices');
        
        if (!response.ok) {
          throw new Error('Failed to fetch crypto prices');
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch crypto prices');
        }
        
        // Calculate GROK amount for each crypto
        const updatedCryptoList = staticCryptoList.map((crypto) => {
          const price = data.prices[crypto.symbol] || 0;
          // Calculate how much GROK can be bought with 1 unit of this crypto
          // Formula: (crypto price in USD) / (GROK price in USD)
          const grokAmount = price > 0 ? (price / GROK_PRICE).toFixed(6) : '0';
          
          return {
            ...crypto,
            grokAmount,
            price,
            viewMode: 'grid'
          };
        });
        
        setCryptoList(updatedCryptoList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching crypto prices:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Fallback to static data with estimated values if API fails
        const fallbackCryptoList = staticCryptoList.map((crypto) => ({
          ...crypto,
          grokAmount: '0',
          viewMode: 'grid'
        }));
        
        setCryptoList(fallbackCryptoList);
        setLoading(false);
      }
    };
    
    fetchPrices();
    
    // Refresh prices every 1 minute
    const intervalId = setInterval(fetchPrices, 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 mt-20 md:mt-0">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-2xl blur-3xl"></div>
        <div className="relative">
          <div className="relative min-h-screen text-white">
            <div className="relative">
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-2 py-12">
                <div className="mb-12 space-y-4" style={{ opacity: 1, transform: 'none' }}>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-white to-blue-400 bg-clip-text text-transparent">
                    Buy $GROK
                  </h1>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center">
                    <p className="text-lg text-gray-300">
                      Current price: <span className="text-blue-400 font-semibold">${GROK_PRICE}</span>
                    </p>
                    <span className="hidden md:inline text-gray-500">•</span>
                    <p className="text-lg text-gray-300">Stage 3 active</p>
                  </div>
                  <a
                    className="inline-flex items-center mt-2 text-blue-400 hover:text-blue-300 text-sm transition-all duration-200 group"
                    href="/dashboard/how-to-buy"
                  >
                    New to crypto? Learn how to get started
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-right w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 ">
                  <div id="calculator-section" className="lg:col-span-5 lg:sticky lg:top-8 space-y-8 h-fit" style={{ opacity: 1, transform: 'none' }}>
                    <CryptoCalculator selectedCrypto={selectedCrypto} />
                  </div>
                  <div className="lg:col-span-7">
                    <div className="sticky top-8 space-y-6">
                      {loading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                          <p className="text-gray-400">Loading cryptocurrency prices...</p>
                        </div>
                      ) : error ? (
                        <div className="text-center py-8 text-red-400">
                          <p>Error loading prices: {error}</p>
                          <button 
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 mt-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Retry
                          </button>
                        </div>
                      ) : (
                        <CryptoSelector onSelect={setSelectedCrypto} cryptoList={cryptoList} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ... existing dialogs ... */}
    </main>
  );
} 