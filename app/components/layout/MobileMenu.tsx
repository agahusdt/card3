'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNavigation, navigationItems } from './NavigationItems';
import { GlassMorphism } from '../UI/StyleUtils';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { isActive } = useNavigation();

  // Handle click outside to close menu
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking the overlay itself, not its children
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <div className="block md:hidden">
      {/* Mobile Menu Button */}
      <div className="fixed inset-x-0 top-0 z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-transparent"></div>
          <div className="relative px-4 h-16 flex items-center justify-between">
            <a href="/dashboard" className="relative z-10">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/50 to-purple-600/50 rounded-xl blur-md opacity-25 group-hover:opacity-40 transition duration-200"></div>
                <img
                  alt="Logo"
                  width={40}
                  height={40}
                  className="transform group-hover:scale-105 transition-all duration-200"
                  src="/grok.svg"
                />
              </div>
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5 text-gray-400 hover:text-white transition-colors z-[60]"
            >
              <div className="relative">
                {isOpen ? (
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
                    className="lucide lucide-x w-5 h-5"
                  >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
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
                    className="lucide lucide-menu w-5 h-5"
                  >
                    <line x1="4" x2="20" y1="12" y2="12"></line>
                    <line x1="4" x2="20" y1="6" y2="6"></line>
                    <line x1="4" x2="20" y1="18" y2="18"></line>
                  </svg>
                )}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-40 md:hidden"
          onClick={handleOverlayClick}
        >
          <div 
            className="absolute right-0 top-0 bottom-0 w-[280px] bg-black/40 backdrop-blur-xl border-l border-white/5 transition-transform duration-300 ease-out" 
            style={{ 
              transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
              animation: isOpen ? 'slideIn 0.3s ease-out forwards' : 'slideOut 0.3s ease-out forwards'
            }}
          >
            <style jsx>{`
              @keyframes slideIn {
                from {
                  transform: translateX(100%);
                }
                to {
                  transform: translateX(0);
                }
              }
              
              @keyframes slideOut {
                from {
                  transform: translateX(0);
                }
                to {
                  transform: translateX(100%);
                }
              }
            `}</style>
            <div className="h-16"></div>
            <div className="px-3 py-4">
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <a href={item.path} key={item.path}>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${isActive(item.path) ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'} transition-all duration-200`}>
                      <div className={`p-2 rounded-lg ${isActive(item.path) ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' : 'bg-white/5'}`}>
                        {React.cloneElement(item.icon as React.ReactElement, { 
                          className: `w-4 h-4 ${isActive(item.path) ? 'text-blue-400' : ''}` 
                        })}
                      </div>
                      <span>{item.label}</span>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-8 px-4">
                <GlassMorphism className="p-4 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet w-4 h-4 text-blue-400">
                        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Stage 3</div>
                      <div className="text-xs text-gray-400">$4.78 per coin</div>
                    </div>
                  </div>
                </GlassMorphism>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-800/50 text-gray-400 text-sm mt-auto">
              <div className="space-y-2">
                <a
                  href="/whitepaper.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Whitepaper
                </a>
                <Link 
                  href="/terms-of-use"
                  className="block hover:text-white transition-colors"
                >
                  Terms of Use
                </Link>
                <Link 
                  href="/privacy-policy"
                  className="block hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 