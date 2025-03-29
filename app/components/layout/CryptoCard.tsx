interface CryptoCardProps {
    symbol: string;
    name: string;
    image: string;
    grokAmount: number;
    networks?: string[];
    viewMode?: 'grid' | 'list';
  }
  
  export default function CryptoCard({ symbol, name, image, grokAmount, networks, viewMode = 'grid' }: CryptoCardProps) {
    return (
      <div className="animate-fade-in">
        <div className={`
          group relative bg-black/40 backdrop-blur-xl
          border border-white/5 rounded-2xl
          cursor-pointer overflow-hidden
          hover:border-blue-500/50 transition-all duration-300
          ${viewMode === 'list' ? 'max-w-full' : ''}
        `}>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className={`
            relative p-5 flex items-center gap-5
            ${viewMode === 'list' ? 'py-4 px-5' : 'p-5'}
          `}>
            <div className="relative">
              <div className="
                rounded-xl bg-gradient-to-br from-black/80 to-black/40 
                flex items-center justify-center
                border border-white/5 shadow-inner
                w-12 h-12
                group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300
              ">
                <img
                  alt={symbol}
                  src={image}
                  className="group-hover:scale-110 transition-transform duration-300"
                  width={24}
                  height={24}
                />
              </div>
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                  {symbol}
                </h3>
              </div>
              <div className="flex flex-col mt-1.5 gap-1.5">
                <p className="text-sm text-gray-400 truncate flex items-center gap-1.5">
                  <span className="text-gray-300 font-medium inline-block">
                    1 <span className="text-[10px] text-gray-400">{symbol}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw w-3.5 h-3.5 text-gray-500 inline mx-1">
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                      <path d="M21 3v5h-5"></path>
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                      <path d="M8 16H3v5"></path>
                    </svg>
                    {grokAmount}<span className="text-[10px] text-gray-400"> $GROK</span>
                  </span>
                </p>
                {networks && viewMode === 'list' && (
                  <p className="text-xs text-gray-500 truncate block sm:hidden">
                    {networks.join(', ')}
                  </p>
                )}
              </div>
            </div>
            <div className="text-gray-500 group-hover:text-blue-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }