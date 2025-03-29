'use client';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="relative max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_0_15px_rgba(255,0,255,0.15),0_0_30px_rgba(120,0,255,0.1)] p-8 z-10">
        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_2px_#fff,inset_0_0_4px_#fff,0_0_8px_rgba(255,0,255,0.4),0_0_16px_rgba(255,0,255,0.2)] pointer-events-none"></div>
        
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-[0_0_5px_rgba(255,0,255,0.5)] tracking-wide">
          Privacy Policy
        </h1>
        
        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-purple-500/70 to-transparent shadow-[0_0_8px_rgba(210,0,255,0.8)]"></div>
        
        <div className="mt-6 text-gray-200/90 leading-relaxed">
          <p>We value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data to ensure a secure and transparent experience with our services.</p>

          <h2 className="mt-6 text-xl font-semibold text-purple-400">1. Data Collection</h2>
          <p>We collect various types of information to provide and improve our services, including:</p>
          <ul className="list-disc ml-8">
            <li><strong>Personal Identification Information:</strong> Such as your name, email address, phone number, and other contact details provided during registration.</li>
            <li><strong>Usage Data:</strong> Information on how you interact with our website and services, including pages visited and links clicked.</li>
            <li><strong>Cookies and Tracking Technologies:</strong> Used to personalize your experience and analyze usage trends.</li>
          </ul>
          <p>We ensure that the data collected is necessary for delivering a seamless and personalized service.</p>

          <h2 className="mt-6 text-xl font-semibold text-purple-400">2. Data Usage</h2>
          <p>Your data is used in several important ways:</p>
          <ul className="list-disc ml-8">
            <li><strong>Service Enhancement:</strong> Analyzing usage patterns helps us continuously improve our offerings and user experience.</li>
            <li><strong>Customer Support:</strong> Your information enables us to provide prompt and effective support.</li>
            <li><strong>Communication:</strong> We may send you important notifications, updates, and promotional materials related to our presale events, always with your consent.</li>
            <li><strong>Legal Compliance:</strong> Ensuring our practices adhere to applicable laws and regulations.</li>
          </ul>
          <p>We only use your data in ways that benefit you and ensure transparency throughout your experience with us.</p>

          <h2 className="mt-6 text-xl font-semibold text-purple-400">3. Security</h2>
          <p>Your security is our top priority. We implement industry-standard measures including:</p>
          <ul className="list-disc ml-8">
            <li><strong>Encryption:</strong> Sensitive data is encrypted both in transit and at rest.</li>
            <li><strong>Access Controls:</strong> Only authorized personnel have access to your personal information.</li>
            <li><strong>Regular Audits:</strong> We conduct frequent audits of our systems to identify and address vulnerabilities.</li>
            <li><strong>Incident Response:</strong> In the unlikely event of a data breach, our robust response plan is designed to quickly mitigate any issues.</li>
          </ul>
          <p>Our commitment is to continuously monitor and improve our security measures to protect your personal data.</p>

          <h2 className="mt-6 text-xl font-semibold text-purple-400">4. Data Sharing and Third Parties</h2>
          <p>We may share your data with trusted third parties under these circumstances:</p>
          <ul className="list-disc ml-8">
            <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our website and services.</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our legal rights.</li>
            <li><strong>Business Transfers:</strong> In the event of mergers, acquisitions, or asset sales, your data may be transferred accordingly.</li>
          </ul>
          <p>We ensure that any third parties with access to your information adhere to strict data protection guidelines.</p>

          <h2 className="mt-6 text-xl font-semibold text-purple-400">5. Your Rights</h2>
          <p>You have several rights regarding your personal data, including:</p>
          <ul className="list-disc ml-8">
            <li><strong>Access:</strong> Requesting a copy of the data we hold about you.</li>
            <li><strong>Correction:</strong> Requesting corrections to any inaccurate or incomplete data.</li>
            <li><strong>Deletion:</strong> Requesting deletion of your personal data, subject to legal requirements.</li>
            <li><strong>Opt-Out:</strong> Withdrawing consent for marketing communications at any time.</li>
          </ul>
          <p>To exercise any of these rights, please contact us using the details provided below.</p>

          <h2 className="mt-6 text-xl font-semibold text-purple-400">6. Contact Information</h2>
          <p>If you have any questions or concerns regarding this Privacy Policy or our data practices, please reach out to us:</p>
          <p><strong>Email:</strong> support@x.com</p>
          <p><strong>Address:</strong> Fenian Street, Dublin 2, D02 AX07, Ireland</p>

          <p>We are dedicated to addressing your concerns and ensuring your trust throughout your experience with our services.</p>

          <p className="mt-6">By using our services, you acknowledge that you have read and understood this Privacy Policy. We reserve the right to update or modify this policy at any time, and any changes will be communicated promptly on our website.</p>
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