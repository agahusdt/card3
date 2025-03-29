'use client';

export default function HowToBuy() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 mt-20 md:mt-0">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-2xl blur-3xl"></div>
        <div className="relative">
          <div className="space-y-8" style={{ opacity: 1 }}>
            <div className="text-center space-y-4" style={{ opacity: 1, transform: 'none' }}>
              <h1 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">How to Buy $GROK</h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">Never bought crypto before? Don't worry! We've made it super easy. Just follow our step-by-step guide below.</p>
            </div>

            {/* Quick Start Section */}
            <div className="text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex flex-col space-y-1.5 p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap w-5 h-5 text-blue-400">
                      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                    </svg>
                  </div>
                  <div className="tracking-tight text-xl font-semibold text-white">Quick Start (for experienced users)</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-6 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-dollar-sign w-4 h-4 text-blue-400">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                      <path d="M12 18V6"></path>
                    </svg>
                    <span>Current Price: $4.78</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4 text-blue-400">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>Stage 3 Active</span>
                  </div>
                </div>
                <div className="mt-6 px-4 py-6 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl">
                  <p className="text-center text-lg text-gray-300 mb-4">
                    You've been exclusively selected for our early presale – an opportunity not available to everyone. Thanks to our targeted advertising, only a select group of visionary investors have been handpicked to secure $GROK at the introductory price of $4.78. This rare chance allows you to join the ranks of early investors before the token is opened up to the general public. Act now and be part of the revolution!
                  </p>
                  <div className="flex justify-center">
                    <a href="/dashboard/buy-coins">
                      <button className="justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-9 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 flex items-center gap-2">
                        Buy $GROK Now
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-5 h-5">
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl">
              <div className="flex flex-col space-y-1.5 p-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-5 h-5 text-green-400">
                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                        <path d="M20 3v4"></path>
                        <path d="M22 5h-4"></path>
                        <path d="M4 17v2"></path>
                        <path d="M5 18H3"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="tracking-tight text-xl font-semibold text-white">Easiest Method: Buy with Card</div>
                      <p className="text-sm text-gray-400 mt-1">Recommended for beginners</p>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge bg-green-500/10 text-green-400 border-green-500/20">
                    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path>
                    Fastest Way
                  </svg>
                </div>
              </div>
              <div className="p-6 pt-6 space-y-6">
                <div className="flex space-x-6 items-start" style={{ opacity: 1, transform: 'none' }}>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md text-white font-extrabold">1</div>
                    <div className="absolute top-full left-1/2 w-[2px] h-full -translate-x-1/2 bg-gradient-to-b from-blue-500 via-purple-600 to-transparent"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-card-foreground shadow relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl hover:shadow-[0_0_40px_rgba(0,225,201,0.09)] transition-transform duration-300 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/5 opacity-20 rounded-2xl pointer-events-none"></div>
                      <div className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card w-6 h-6 text-white">
                              <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                              <line x1="2" x2="22" y1="10" y2="10"></line>
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-white">Get Your Debit/Credit Card Ready</h3>
                        </div>
                        <div className="text-gray-300 leading-relaxed">You'll need a card that works for online international purchases. Most regular cards work fine!</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-6 items-start" style={{ opacity: 1, transform: 'none' }}>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md text-white font-extrabold">2</div>
                    <div className="absolute top-full left-1/2 w-[2px] h-full -translate-x-1/2 bg-gradient-to-b from-blue-500 via-purple-600 to-transparent"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-card-foreground shadow relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl hover:shadow-[0_0_40px_rgba(0,225,201,0.09)] transition-transform duration-300 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/5 opacity-20 rounded-2xl pointer-events-none"></div>
                      <div className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet w-6 h-6 text-white">
                              <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                              <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-white">Install Trust Wallet</h3>
                        </div>
                        <div className="text-gray-300 leading-relaxed">
                          <div className="space-y-2">
                            <p>Download Trust Wallet from your phone's app store:</p>
                            <div className="flex gap-4 mt-2">
                              <a className="flex items-center gap-2 text-blue-400 hover:text-blue-300" href="https://apps.apple.com/app/trust-ethereum-wallet/id1288339409">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-apple w-4 h-4">
                                  <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
                                  <path d="M10 2c1 .5 2 2 2 5"></path>
                                </svg>
                                <span>iPhone</span>
                              </a>
                              <a className="flex items-center gap-2 text-blue-400 hover:text-blue-300" href="https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smartphone w-4 h-4">
                                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
                                  <path d="M12 18h.01"></path>
                                </svg>
                                <span>Android</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-6 items-start" style={{ opacity: 1, transform: 'none' }}>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md text-white font-extrabold">3</div>
                    <div className="absolute top-full left-1/2 w-[2px] h-full -translate-x-1/2 bg-gradient-to-b from-blue-500 via-purple-600 to-transparent"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-card-foreground shadow relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl hover:shadow-[0_0_40px_rgba(0,225,201,0.09)] transition-transform duration-300 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/5 opacity-20 rounded-2xl pointer-events-none"></div>
                      <div className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key w-6 h-6 text-white">
                              <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"></path>
                              <path d="m21 2-9.6 9.6"></path>
                              <circle cx="7.5" cy="15.5" r="5.5"></circle>
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-white">Set Up Your Wallet</h3>
                        </div>
                        <div className="text-gray-300 leading-relaxed">
                          <div className="space-y-2">
                            <p>Follow the app's setup instructions. You'll get a "recovery phrase" - write it down on paper and keep it super safe!</p>
                            <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-sm">
                              <div className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-triangle-alert w-4 h-4 text-yellow-400 mt-0.5">
                                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
                                  <path d="M12 9v4"></path>
                                  <path d="M12 17h.01"></path>
                                </svg>
                                <p className="text-yellow-200">Never share your recovery phrase with anyone, not even if they claim to be support!</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-6 items-start" style={{ opacity: 1, transform: 'none' }}>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md text-white font-extrabold">4</div>
                    <div className="absolute top-full left-1/2 w-[2px] h-full -translate-x-1/2 bg-gradient-to-b from-blue-500 via-purple-600 to-transparent"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-card-foreground shadow relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl hover:shadow-[0_0_40px_rgba(0,225,201,0.09)] transition-transform duration-300 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/5 opacity-20 rounded-2xl pointer-events-none"></div>
                      <div className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign w-6 h-6 text-white">
                              <line x1="12" x2="12" y1="2" y2="22"></line>
                              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-white">Buy USDT (Tether)</h3>
                        </div>
                        <div className="text-gray-300 leading-relaxed">
                          <div className="space-y-2">
                            <p>In Trust Wallet:</p>
                            <ol className="list-decimal list-inside space-y-1 text-gray-300">
                              <li>Tap the "Buy" button</li>
                              <li>Select "USDT" or "Tether"</li>
                              <li>Enter how much you want to buy</li>
                              <li>Follow the steps to pay with your card</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-6 items-start" style={{ opacity: 1, transform: 'none' }}>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md text-white font-extrabold">5</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-card-foreground shadow relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl hover:shadow-[0_0_40px_rgba(0,225,201,0.09)] transition-transform duration-300 hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/5 opacity-20 rounded-2xl pointer-events-none"></div>
                      <div className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-6 h-6 text-white">
                              <path d="M5 12h14"></path>
                              <path d="m12 5 7 7-7 7"></path>
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-white">Send USDT to Us</h3>
                        </div>
                        <div className="text-gray-300 leading-relaxed">
                          <div className="space-y-2">
                            <p>Head to our Buy Token page and you'll get an address to send your USDT to. Double-check it's correct!</p>
                            <div className="flex gap-4">
                              <a className="inline-flex items-center text-blue-400 hover:text-blue-300" href="/dashboard/buy-coins">
                                Go to Buy Token page
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-4 h-4 ml-1">
                                  <path d="M5 12h14"></path>
                                  <path d="m12 5 7 7-7 7"></path>
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative Method Section */}
            <div className="text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl">
              <div className="flex flex-col space-y-1.5 p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2 w-5 h-5 text-blue-400">
                      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                      <path d="M10 6h4"></path>
                      <path d="M10 10h4"></path>
                      <path d="M10 14h4"></path>
                      <path d="M10 18h4"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="tracking-tight text-xl font-semibold text-white">Alternative: Using an Exchange</div>
                    <p className="text-sm text-gray-400 mt-1">For those who already have a crypto exchange account</p>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-lg font-medium text-white mb-2">Binance</h3>
                    <a className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300" href="/dashboard/how-to/withdrawal/binance">
                      View Binance guide
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-4 h-4 ml-1">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help Section */}
            <div className="text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl">
              <div className="flex flex-col space-y-1.5 p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-help w-5 h-5 text-purple-400">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <path d="M12 17h.01"></path>
                    </svg>
                  </div>
                  <div className="tracking-tight text-xl font-semibold text-white">Need Help?</div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300">Our support team is here 24/7 to help you with your purchase. Don't hesitate to reach out if you have any questions!</p>
              </div>
            </div>

            {/* Final CTA */}
            <div className="flex justify-center pt-4">
              <a href="/dashboard/buy-coins">
                <button className="justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-9 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 flex items-center gap-2">
                  Buy $GROK Now
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-5 h-5">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
