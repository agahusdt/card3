'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const [activeTab, setActiveTab] = useState('signup');
  const router = useRouter();
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      repeatPassword: formData.get('repeatPassword'),
    };

    if (data.password !== data.repeatPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred during registration');
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('signinEmail'),
      password: formData.get('signinPassword'),
    };

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-black to-blue-900/20"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(120,50,255,0.15),transparent_70%)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,220,170,0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full border border-purple-500/30 animate-pulse"></div>
          <div className="absolute top-1/3 left-1/2 w-64 h-64 rounded-full border border-teal-500/20 animate-ping" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full border border-blue-500/20 animate-pulse" style={{animationDuration: '7s'}}></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.05),transparent)] animate-scan"></div>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTSAwIDQwIEwgNDAgNDAgTSA0MCAwIEwgNDAgNDAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-gradient-to-br from-purple-600 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <img
                  alt="GROK Logo"
                  width={28}
                  height={28}
                  className="object-contain relative z-10"
                  src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGhlaWdodD0iMWVtIiBzdHlsZT0iZmxleDpub25lO2xpbmUtaGVpZ2h0OjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjFlbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+R3JvazwvdGl0bGU+PHBhdGggZD0iTTYuNDY5IDguNzc2TDE2LjUxMiAyM2gtNC40NjRMMi4wMDUgOC43NzZINi40N3ptLS4wMDQgNy45bDIuMjMzIDMuMTY0TDYuNDY3IDIzSDJsNC40NjUtNi4zMjR6TTIyIDIuNTgyVjIzaC0zLjY1OVY3Ljc2NEwyMiAyLjU4MnpNMjIgMWwtOS45NTIgMTQuMDk1LTIuMjMzLTMuMTYzTDE3LjUzMyAxSDIyeiI+PC9wYXRoPjwvc3ZnPg=="
                />
                <div className="absolute inset-0 bg-black/30 rounded-xl backdrop-blur-sm"></div>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400">$GROK</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="bg-gradient-to-r from-purple-600/50 to-teal-500/50 rounded-full p-px hidden md:block">
                <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield h-4 w-4 text-purple-400 mr-2">
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                  </svg>
                  <span className="text-white/90 text-sm font-medium">Verified Exclusive Presale</span>
                </div>
              </div>
              <a
                href="/whitepaper.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-teal-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <button className="relative bg-black px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 transition hover:bg-black/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span className="font-medium">Whitepaper</span>
                </button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-16 md:pt-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="relative z-10 mb-12 md:mb-0">
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="relative">
                  <div className="inline-flex items-center mb-4 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up h-4 w-4 text-teal-400 mr-2">
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                      <polyline points="16 7 22 7 22 13"></polyline>
                    </svg>
                    <span className="text-white/80 text-sm font-medium">83% Target Reached</span>
                  </div>
                  <h1 className="text-6xl md:text-7xl font-black leading-none tracking-tight mb-4">
                    <div className="inline-block relative">
                      <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-teal-300 to-blue-400">$GROK</span>
                      <div className="absolute inset-0 blur-lg bg-gradient-to-r from-purple-400/30 to-teal-400/30 -z-10 scale-110"></div>
                    </div>
                    <br />
                    <span className="text-white leading-tight">Exclusive<br />Presale</span>
                  </h1>
                  <p className="text-xl text-white/80 leading-relaxed max-w-xl">
                    You've been selected to participate in this exclusive presale through our educational program. Early access with <span className="text-teal-400 font-semibold">guaranteed allocation</span> before public launch.
                  </p>
                  <div className="mt-8 space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 flex items-center justify-center mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check h-3.5 w-3.5 text-white">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </div>
                      <p className="ml-3 text-white/80">Specially curated for new investors through educational outreach</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 flex items-center justify-center mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check h-3.5 w-3.5 text-white">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </div>
                      <p className="ml-3 text-white/80">Limited participation window before public launch</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 flex items-center justify-center mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check h-3.5 w-3.5 text-white">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </div>
                      <p className="ml-3 text-white/80">Guaranteed allocation at preferential pricing</p>
                    </div>
                  </div>
                  <div className="mt-10 flex gap-4 flex-wrap">
                    <a href="#register-form" className="group relative inline-flex">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-teal-500 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                      <button className="relative px-8 py-4 bg-black border border-white/10 rounded-lg font-bold text-lg text-white transition">
                        Secure Your Allocation
                      </button>
                    </a>
                    <div className="flex items-center space-x-4">
                      <div className="flex -space-x-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/80 to-teal-500/80 flex items-center justify-center border-2 border-black">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user h-5 w-5 text-white/90">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/80 to-teal-500/80 flex items-center justify-center border-2 border-black">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user h-5 w-5 text-white/90">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/80 to-teal-500/80 flex items-center justify-center border-2 border-black">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user h-5 w-5 text-white/90">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </div>
                      </div>
                      <div className="text-white/70">
                        <span className="font-bold text-white">1.8K+</span> participants joined
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="register-form" className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-teal-500/10 blur-3xl rounded-full"></div>
                <div className="relative backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 shadow-[0_20px_60px_-30px_rgba(130,90,255,0.6)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-teal-500/5 rounded-2xl"></div>
                  <div className="relative">
                    <div className="inline-flex items-center mb-2 bg-white/10 px-3 py-1 rounded-full border border-white/5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield h-4 w-4 text-purple-400 mr-1">
                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                      </svg>
                      <span className="text-white/90 text-xs font-medium">Limited Access</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-6">Access Your Reserved Allocation</h2>
                    <div className="relative z-10">
                      <div dir="ltr" data-orientation="horizontal" className="w-full">
                        <div className="relative p-1 backdrop-blur-xl bg-black/30 rounded-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-teal-500/20 to-blue-600/20 animate-pulse" style={{animationDuration: '3s'}}></div>
                          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDUgTCAyMCA1IE0gNSAwIEwgNSAyMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10"></div>
                          <div role="tablist" aria-orientation="horizontal" className="h-9 items-center justify-center rounded-lg text-muted-foreground relative w-full grid grid-cols-2 bg-transparent z-10 p-1" tabIndex={0} data-orientation="horizontal" style={{outline: 'none'}}>
                            <button 
                              type="button" 
                              role="tab" 
                              aria-selected={activeTab === 'signup'} 
                              aria-controls="radix-:r0:-content-signup" 
                              data-state={activeTab === 'signup' ? 'active' : 'inactive'} 
                              id="radix-:r0:-trigger-signup" 
                              className="whitespace-nowrap px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground relative py-3 rounded-lg font-medium flex-1 flex items-center justify-center transition-all duration-300 overflow-hidden group data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:shadow-[0_2px_10px_rgba(105,30,255,0.3)] data-[state=inactive]:hover:bg-white/5"
                              onClick={() => setActiveTab('signup')}
                            >
                              <div className="absolute inset-0 data-[state=active]:blur-sm bg-gradient-to-r from-purple-600/70 to-blue-600/70 opacity-0 data-[state=active]:opacity-30 pointer-events-none"></div>
                              <div className="relative flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-all duration-300 group-data-[state=active]:text-white group-data-[state=inactive]:text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                                </svg>
                                <span className="font-semibold transition-all duration-300 group-data-[state=active]:text-white group-data-[state=inactive]:text-white/80">Sign Up</span>
                              </div>
                            </button>
                            <button 
                              type="button" 
                              role="tab" 
                              aria-selected={activeTab === 'signin'} 
                              aria-controls="radix-:r0:-content-signin" 
                              data-state={activeTab === 'signin' ? 'active' : 'inactive'} 
                              id="radix-:r0:-trigger-signin" 
                              className="whitespace-nowrap px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground relative py-3 rounded-lg font-medium flex-1 flex items-center justify-center transition-all duration-300 overflow-hidden group data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:shadow-[0_2px_10px_rgba(105,30,255,0.3)] data-[state=inactive]:hover:bg-white/5"
                              onClick={() => setActiveTab('signin')}
                            >
                              <div className="absolute inset-0 data-[state=active]:blur-sm bg-gradient-to-r from-purple-600/70 to-blue-600/70 opacity-0 data-[state=active]:opacity-30 pointer-events-none"></div>
                              <div className="relative flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-all duration-300 group-data-[state=active]:text-white group-data-[state=inactive]:text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                                </svg>
                                <span className="font-semibold transition-all duration-300 group-data-[state=active]:text-white group-data-[state=inactive]:text-white/80">Sign In</span>
                              </div>
                            </button>
                          </div>
                        </div>
                        <div 
                          data-state={activeTab === 'signup' ? 'active' : 'inactive'} 
                          data-orientation="horizontal" 
                          role="tabpanel" 
                          aria-labelledby="radix-:r0:-trigger-signup" 
                          id="radix-:r0:-content-signup" 
                          tabIndex={0} 
                          className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0" 
                          style={{animationDuration: '0s', display: activeTab === 'signup' ? 'block' : 'none'}}
                        >
                          <div className="rounded-xl text-card-foreground border-0 bg-transparent shadow-none">
                            <form onSubmit={handleRegister} className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/90" htmlFor="name">Name</label>
                                <div className="relative">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                  </svg>
                                  <input required className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 bg-white/5 border-white/10 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500" id="name" placeholder="Enter your full name" name="name" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/90" htmlFor="email">Email</label>
                                <div className="relative">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5">
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                  </svg>
                                  <input required type="email" className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 bg-white/5 border-white/10 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500" id="email" placeholder="Enter your email" name="email" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/90" htmlFor="password">Password</label>
                                <div className="relative">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5">
                                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                  </svg>
                                  <input required minLength={6} className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 bg-white/5 border-white/10 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500" id="password" placeholder="Create a password" type="password" name="password" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/90" htmlFor="repeatPassword">Repeat Password</label>
                                <div className="relative">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5">
                                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                  </svg>
                                  <input required minLength={6} className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 bg-white/5 border-white/10 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500" id="repeatPassword" placeholder="Repeat your password" type="password" name="repeatPassword" />
                                </div>
                              </div>
                              {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                                  <p className="text-red-400 text-sm">{error}</p>
                                </div>
                              )}
                              <button type="submit" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary shadow hover:bg-primary/90 h-9 px-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-5 rounded-lg">
                                Secure Your Allocation
                              </button>
                            </form>
                          </div>
                        </div>
                        <div 
                          data-state={activeTab === 'signin' ? 'active' : 'inactive'} 
                          data-orientation="horizontal" 
                          role="tabpanel" 
                          aria-labelledby="radix-:r0:-trigger-signin" 
                          id="radix-:r0:-content-signin" 
                          tabIndex={0} 
                          className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0"
                          style={{display: activeTab === 'signin' ? 'block' : 'none'}}
                        >
                          <div className="rounded-xl text-card-foreground border-0 bg-transparent shadow-none">
                            <form onSubmit={handleLogin} className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/90" htmlFor="signinEmail">Email</label>
                                <div className="relative">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5">
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                  </svg>
                                  <input required type="email" className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 bg-white/5 border-white/10 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500" id="signinEmail" placeholder="Enter your email" name="signinEmail" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/90" htmlFor="signinPassword">Password</label>
                                <div className="relative">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5">
                                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                  </svg>
                                  <input required className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 bg-white/5 border-white/10 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500" id="signinPassword" placeholder="Enter your password" type="password" name="signinPassword" />
                                </div>
                              </div>
                              <button type="submit" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary shadow hover:bg-primary/90 h-9 px-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-5 rounded-lg">
                                Secure Your Allocation
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <div className="flex flex-wrap gap-2 justify-center">
                        <div className="flex items-center bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield h-3.5 w-3.5 text-teal-400 mr-1.5">
                            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                          </svg>
                          <span className="text-xs text-white/80">KYC Verified</span>
                        </div>
                        <div className="flex items-center bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award h-3.5 w-3.5 text-teal-400 mr-1.5">
                            <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                            <circle cx="12" cy="8" r="6"></circle>
                          </svg>
                          <span className="text-xs text-white/80">Audited by CertiK</span>
                        </div>
                        <div className="flex items-center bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock h-3.5 w-3.5 text-teal-400 mr-1.5">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                          <span className="text-xs text-white/80">Secure Transaction</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-20 mt-16">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent"></div>
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-teal-900/10"></div>
              <div className="relative grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
                <div className="relative p-8 text-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"></div>
                  <div className="relative">
                    <div className="mx-auto w-16 h-16 rounded-2xl border border-white/5 flex items-center justify-center mb-4 text-purple-400 bg-purple-400/10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rocket w-8 h-8">
                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                      </svg>
                    </div>
                    <div className="text-4xl font-extrabold text-white mb-1">$4.78</div>
                    <div className="text-white/60">Coin Price</div>
                  </div>
                </div>
                <div className="relative p-8 text-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"></div>
                  <div className="relative">
                    <div className="mx-auto w-16 h-16 rounded-2xl border border-white/5 flex items-center justify-center mb-4 text-teal-400 bg-teal-400/10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-8 h-8">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div className="text-4xl font-extrabold text-white mb-1">1.8K+</div>
                    <div className="text-white/60">Selected Participants</div>
                  </div>
                </div>
                <div className="relative p-8 text-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"></div>
                  <div className="relative">
                    <div className="mx-auto w-16 h-16 rounded-2xl border border-white/5 flex items-center justify-center mb-4 text-blue-400 bg-blue-400/10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up w-8 h-8">
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                        <polyline points="16 7 22 7 22 13"></polyline>
                      </svg>
                    </div>
                    <div className="text-4xl font-extrabold text-white mb-1">83%</div>
                    <div className="text-white/60">Target Reached</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-teal-400 to-blue-400 inline-block">
                <span className="relative">
                  Exclusive Educational Selection
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/50 via-teal-500/50 to-blue-500/50 rounded-full"></div>
                </span>
              </h2>
              <p className="text-white/70 text-lg max-w-3xl mx-auto mt-6">
                Unlike mass market presales, $GROK specifically targets educational channels to find promising new investors, ensuring fair distribution and project longevity.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/50 to-teal-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative h-full backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-8 transition duration-300 group-hover:translate-y-[-4px]">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl"></div>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-teal-600 flex items-center justify-center mb-6 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap h-8 w-8 text-white">
                        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                        <path d="M22 10v6"></path>
                        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">Educational Selection</h3>
                    <p className="text-white/70">Only participants from selected educational channels were invited, ensuring informed investment decisions.</p>
                  </div>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/50 to-teal-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative h-full backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-8 transition duration-300 group-hover:translate-y-[-4px]">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl"></div>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center mb-6 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield h-8 w-8 text-white">
                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">Verified Participants</h3>
                    <p className="text-white/70">Each invitation is carefully distributed to genuine new investors, avoiding whales and ensuring fair distribution.</p>
                  </div>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/50 to-teal-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative h-full backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-8 transition duration-300 group-hover:translate-y-[-4px]">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl"></div>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mb-6 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award h-8 w-8 text-white">
                        <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                        <circle cx="12" cy="8" r="6"></circle>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">Pre-Public Access</h3>
                    <p className="text-white/70">This exclusive window gives you privileged access before the public launch at significantly higher prices.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-black/0 to-teal-900/20 blur-2xl"></div>
              <div className="relative rounded-2xl backdrop-blur-md bg-black/40 border border-white/10 p-8 shadow-[0_20px_80px_-20px_rgba(130,90,255,0.3)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-teal-500 to-blue-500"></div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="md:w-1/2">
                    <div className="inline-block mb-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/5">
                      <span className="text-sm font-medium text-white">Triple-Layer Security</span>
                    </div>
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400 mb-4">Security Verified</h3>
                    <p className="text-white/70 mb-6">Smart contract audited by CertiK and SlowMist. Our multi-signature treasury ensures maximum protection of investor funds.</p>
                    <div className="flex flex-wrap gap-3">
                      <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield h-4 w-4 text-teal-400 mr-2">
                          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                        </svg>
                        <span className="text-sm text-white/80">CertiK Audited</span>
                      </div>
                      <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield h-4 w-4 text-teal-400 mr-2">
                          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                        </svg>
                        <span className="text-sm text-white/80">SlowMist Verified</span>
                      </div>
                      <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield h-4 w-4 text-teal-400 mr-2">
                          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                        </svg>
                        <span className="text-sm text-white/80">KYC Completed</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block h-32 w-px bg-gradient-to-b from-white/5 via-white/10 to-white/5"></div>
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400 mb-4">Transparent Team</h3>
                    <p className="text-white/70">Our founding team comes from established tech companies with verifiable backgrounds in blockchain, AI, and fintech sectors.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-12 mt-12">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-purple-900/5 to-black/20"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-gradient-to-br from-purple-600 to-teal-400 rounded-xl flex items-center justify-center">
                <img
                  alt="GROK Logo"
                  width={24}
                  height={24}
                  className="object-contain z-10"
                  src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGhlaWdodD0iMWVtIiBzdHlsZT0iZmxleDpub25lO2xpbmUtaGVpZ2h0OjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjFlbSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+R3JvazwvdGl0bGU+PHBhdGggZD0iTTYuNDY5IDguNzc2TDE2LjUxMiAyM2gtNC40NjRMMi4wMDUgOC43NzZINi40N3ptLS4wMDQgNy45bDIuMjMzIDMuMTY0TDYuNDY3IDIzSDJsNC40NjUtNi4zMjR6TTIyIDIuNTgyVjIzaC0zLjY1OVY3Ljc2NEwyMiAyLjU4MnpNMjIgMWwtOS45NTIgMTQuMDk1LTIuMjMzLTMuMTYzTDE3LjUzMyAxSDIyeiI+PC9wYXRoPjwvc3ZnPg=="
                />
                <div className="absolute inset-0 bg-black/30 rounded-xl backdrop-blur-sm"></div>
              </div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400">$GROK</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield h-4 w-4 text-teal-400 mr-2">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                </svg>
                <span className="text-sm text-white/80">KYC Verified</span>
              </div>
              <div className="flex items-center bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock h-4 w-4 text-teal-400 mr-2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span className="text-sm text-white/80">Audited by CertiK</span>
              </div>
              <div className="flex items-center bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user h-4 w-4 text-teal-400 mr-2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="text-sm text-white/80">Team Doxxed</span>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-white/50 text-sm">© 2025 $GROK. All rights reserved. This exclusive presale is only available to invited participants.</p>
            <div className="flex justify-center gap-6 mt-4">
              <a href="/terms-of-use" className="text-sm text-white/60 hover:text-teal-400 transition">Terms of Service</a>
              <a href="/privacy-policy" className="text-sm text-white/60 hover:text-teal-400 transition">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mt-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
