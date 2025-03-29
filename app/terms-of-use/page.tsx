'use client';

export default function TermsOfUse() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="relative max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_0_15px_rgba(255,0,255,0.15),0_0_30px_rgba(120,0,255,0.1)] p-8 z-10">
        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_2px_#fff,inset_0_0_4px_#fff,0_0_8px_rgba(255,0,255,0.4),0_0_16px_rgba(255,0,255,0.2)] pointer-events-none"></div>
        
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-[0_0_5px_rgba(255,0,255,0.5)] tracking-wide">
          Terms of Use
        </h1>
        
        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-purple-500/70 to-transparent shadow-[0_0_8px_rgba(210,0,255,0.8)]"></div>
        
        <div className="mt-6 text-gray-200/90 leading-relaxed">
          <p>Welcome to our platform. By accessing and using our services, including the $GROK Coin presale, you agree to abide by these terms and conditions. Please read them carefully.</p>

          <h2 className="mt-6 text-xl font-semibold text-purple-400">1. Acceptance of Terms</h2>
          <p>By accessing this website and participating in the $GROK Coin presale, you accept and agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please refrain from using our services.</p>

          <h2 className="mt-6 text-xl font-semibold text-purple-400">2. Use of Service</h2>
          <p>Our services are provided to you under these terms. You agree to use our platform responsibly and in compliance with all applicable laws. Unauthorized use of our services, including any interference or disruption, may result in termination of your access.</p>
          <ul className="list-disc ml-8">
            <li>Use the platform only for lawful purposes.</li>
            <li>Avoid any activities that may harm or compromise the integrity of our system.</li>
            <li>Respect all guidelines and instructions provided on the platform.</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold text-purple-400">3. Modifications</h2>
          <p>We reserve the right to modify or update these Terms of Use at any time. Any changes will be posted on this page, and your continued use of our services after such modifications constitutes acceptance of the updated terms.</p>

          <h2 className="mt-6 text-xl font-semibold text-purple-400">4. Investor Terms for $GROK Coin</h2>
          <p>The $GROK Coin presale is subject to these additional terms:</p>
          <ul className="list-disc ml-8">
            <li><strong>Risk Acknowledgement:</strong> You acknowledge that investments in digital assets, including $GROK Coin, carry inherent risks such as market volatility, liquidity issues, and regulatory uncertainty.</li>
            <li><strong>Informational Purposes:</strong> Any information provided regarding $GROK Coin is for informational purposes only and should not be construed as financial advice.</li>
            <li><strong>Regulatory Compliance:</strong> It is your responsibility to ensure that your participation in the presale complies with all applicable laws and regulations.</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold text-purple-400">5. User Conduct and Responsibilities</h2>
          <p>You agree to conduct yourself in a responsible manner while using our platform. Prohibited behaviors include:</p>
          <ul className="list-disc ml-8">
            <li>Engaging in fraudulent or deceptive activities.</li>
            <li>Attempting to gain unauthorized access to any portion of our services.</li>
            <li>Distributing malware or engaging in any activity that compromises system security.</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold text-purple-400">6. Intellectual Property</h2>
          <p>All content, trademarks, and data on our platform, including the $GROK Coin brand and related materials, are the intellectual property of their respective owners. You are prohibited from reproducing, distributing, or exploiting any content without prior written consent.</p>

          <h2 className="mt-6 text-xl font-semibold text-purple-400">7. Disclaimers and Limitations of Liability</h2>
          <p>Our platform and all its content are provided on an "as is" basis without warranties of any kind, either express or implied. We are not liable for any direct, indirect, or consequential damages arising from your use of our services or from any investment in $GROK Coin.</p>

          <h2 className="mt-6 text-xl font-semibold text-purple-400">8. Indemnification</h2>
          <p>You agree to indemnify and hold harmless our platform, its affiliates, and their respective directors, officers, employees, and agents from any claims, losses, or damages arising from your use of our services or breach of these terms.</p>

          <h2 className="mt-6 text-xl font-semibold text-purple-400">9. Governing Law</h2>
          <p>These Terms of Use shall be governed by and construed in accordance with the laws of the applicable jurisdiction. You agree to submit to the exclusive jurisdiction of the courts in that jurisdiction for the resolution of any disputes.</p>

          <h2 className="mt-6 text-xl font-semibold text-purple-400">10. Contact Information</h2>
          <p>If you have any questions or concerns regarding these Terms of Use or the $GROK Coin presale, please contact us:</p>
          <p><strong>Email:</strong> support@x.com</p>
          <p><strong>Address:</strong> Fenian Street, Dublin 2, D02 AX07, Ireland</p>

          <p className="mt-6">By using our platform and participating in the $GROK Coin presale, you acknowledge that you have read, understood, and agreed to these Terms of Use.</p>
        </div>

        <div className="mt-8 text-center">
          <a 
            className="relative inline-block px-6 py-2 text-purple-300 font-medium transition-all duration-300 overflow-hidden rounded-lg group" 
            href="/dashboard"
          >
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,100,255,0.8)] transition-all duration-300">
              Back to Dashboard
            </span>
          </a>
        </div>
      </div>
    </main>
  );
} 