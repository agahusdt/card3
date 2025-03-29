'use client';

export default function BinanceWithdrawalGuide() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-20 md:mt-0">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-2xl blur-3xl"></div>
        <div className="relative">
          <div className="space-y-8 max-w-4xl mx-auto pb-12">
            <div>
              <h1 className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text mb-4">
                How to withdraw crypto on Binance
              </h1>
              <p className="text-gray-400">A step-by-step guide to safely withdraw your crypto from Binance</p>
            </div>

            <div className="text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="relative" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    src="https://fast.wistia.net/embed/iframe/x460r4tnc7"
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-center text-sm text-gray-400">Tutorial Video</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">1. Access Withdrawal</h3>
                <p className="text-gray-300">
                  Log in to your Binance app and tap <span className="font-semibold text-white">Wallets</span> - <span className="font-semibold text-white">Spot</span> - <span className="font-semibold text-white">Withdraw</span>.
                </p>
                <div className="relative h-[300px] w-full sm:w-[313px]">
                  <img
                    alt="Binance withdrawal step 1"
                    src="/binance/ebe467ad28f70003844d591ed51b10fc.webp"
                    className="object-contain"
                    style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0 }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">2. Select Cryptocurrency</h3>
                <p className="text-gray-300">
                  Choose the cryptocurrency you want to withdraw, for example, BNB. Then, tap <span className="font-semibold text-white">Send via Crypto Network</span>.
                </p>
                <div className="relative h-[300px] w-full">
                  <img
                    alt="Binance withdrawal step 2"
                    src="/binance/1c6df4eb905efd0fcaf3768f463d2835.webp"
                    className="object-contain"
                    style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0 }}
                  />
                </div>
              </div>

              <div className="rounded-xl border text-card-foreground shadow bg-red-500/10 border-red-500/20">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-triangle-alert w-6 h-6 text-red-400 flex-shrink-0 mt-1">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
                      <path d="M12 9v4"></path>
                      <path d="M12 17h.01"></path>
                    </svg>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-red-400">Important Warning</h4>
                      <p className="text-gray-300">
                        Choose the network carefully and make sure that the selected network is the same as the network of the platform you are withdrawing funds to. If you select the wrong network, your funds might be lost and couldn't be recovered.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white">Common Networks</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5">
                    <div className="p-4">
                      <h5 className="font-bold text-white">BEP2</h5>
                      <p className="text-sm text-gray-400">BNB Beacon Chain</p>
                    </div>
                  </div>
                  <div className="rounded-xl text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5">
                    <div className="p-4">
                      <h5 className="font-bold text-white">BEP20</h5>
                      <p className="text-sm text-gray-400">BNB Smart Chain (BSC)</p>
                    </div>
                  </div>
                  <div className="rounded-xl text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5">
                    <div className="p-4">
                      <h5 className="font-bold text-white">ERC20</h5>
                      <p className="text-sm text-gray-400">Ethereum network</p>
                    </div>
                  </div>
                  <div className="rounded-xl text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5">
                    <div className="p-4">
                      <h5 className="font-bold text-white">TRC20</h5>
                      <p className="text-sm text-gray-400">TRON network</p>
                    </div>
                  </div>
                  <div className="rounded-xl text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5">
                    <div className="p-4">
                      <h5 className="font-bold text-white">BTC</h5>
                      <p className="text-sm text-gray-400">Bitcoin network</p>
                    </div>
                  </div>
                  <div className="rounded-xl text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5">
                    <div className="p-4">
                      <h5 className="font-bold text-white">BTC (SegWit)</h5>
                      <p className="text-sm text-gray-400">Native Segwit (bech32). Address starts with "bc1"</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5">
                <div className="p-6 space-y-4">
                  <h4 className="font-bold text-white">Important Notes</h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
                      <span>DO NOT select the cheapest fee option. Select the one that is compatible with the external platform.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
                      <span>Confirm that the receiving platform supports the contract address of the token you're withdrawing.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
                      <span>For certain networks (BEP2, EOS), you must fill in the Memo when making a transfer.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Completing the Withdrawal</h3>
                <div className="space-y-6">
                  <p className="text-gray-300">1. Enter the withdrawal amount to see the transaction fee and final amount.</p>
                  <div className="relative h-[300px] w-full">
                    <img
                      alt="Enter withdrawal amount"
                      src="/binance/5fc358d1b5e02386046a53ac266152a2.webp"
                      className="object-contain"
                      style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0 }}
                    />
                  </div>
                  <p className="text-gray-300">2. Review and confirm the transaction details carefully.</p>
                  <div className="relative h-[300px] w-full sm:w-[377px]">
                    <img
                      alt="Confirm transaction"
                      src="/binance/25192bcbda93c7af06a0f314c02946a3.webp"
                      className="object-contain"
                      style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0 }}
                    />
                  </div>
                  <p className="text-gray-300">3. Verify the transaction with your passkey or 2FA devices and wait for processing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 