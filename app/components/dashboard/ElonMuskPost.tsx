'use client';

export default function ElonMuskPost() {
  return (
    <div className="text-card-foreground shadow bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-emerald-500/5 to-blue-500/10 opacity-20 pointer-events-none rounded-2xl group-hover:opacity-30 transition-opacity"></div>
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-600 opacity-10 group-hover:opacity-20 blur-xl transition-all duration-300"></div>
      <div className="p-6 px-8 py-6">
        <div className="flex items-center gap-6 border-b border-gray-800/50 pb-6">
          <img 
            alt="Elon Musk" 
            className="w-16 h-16 rounded-full object-cover" 
            src="https://pbs.twimg.com/profile_images/1893803697185910784/Na5lOWi5_400x400.jpg"
          />
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Elon Musk
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big w-5 h-5 text-blue-400">
                <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                <path d="m9 11 3 3L22 4"></path>
              </svg>
            </h3>
            <p className="text-sm text-gray-400">@elonmusk</p>
          </div>
        </div>
        <div className="mt-6 text-gray-300 leading-relaxed space-y-4">
          <p>X is embarking on an ambitious project to create a revolutionary payment system that leverages the benefits of blockchain technology to design a better and more inclusive financial ecosystem. Our team begins pursuing this vision with determination and perseverance, motivated by the desire to deliver substantial benefits to consumers and businesses, along with a payment solution for those who are currently underserved or excluded altogether from the traditional financial system.</p>
          <p>We are setting out to build and test a blockchain-based payment system with industry-leading controls to protect consumers and combat financial crime, intended to be safe for people making ordinary day-to-day payments.</p>
          <p>One of our highest priorities in designing the payment network is building in controls to protect it against misuse by illicit actors. We are approaching this concern in novel ways, implementing numerous controls including a prohibition on anonymous transactions, which pose both a sanctions and money laundering risk.</p>
          <p>As we undertake this effort, we are actively seeking feedback from governments and regulators around the world, and the project will evolve and improve as a result. Our system is being designed to address not only the risks related to the issuance of a stablecoin but also the risks associated with transferring stablecoins between parties.</p>
          <p>We are confident in the potential for a stablecoin operating on a blockchain to deliver significant benefits to users. Our team is excited to begin developing this technology that aims to set new standards in digital payments.</p>
        </div>
      </div>
    </div>
  );
} 