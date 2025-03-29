'use client';

import React from 'react';
import MobileMenu from '@/app/components/layout/MobileMenu';
import { useNavigation, navigationItems } from '@/app/components/layout/NavigationItems';
import Link from 'next/link';
import { GlowEffect, GradientText } from '@/app/components/UI/StyleUtils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pathname, isActive } = useNavigation();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col fixed h-screen w-64 bg-black/80 backdrop-blur-md border-r border-gray-800/50">
        <div className="p-6">
          <a href="/dashboard">
            <GlowEffect>
              <div className="relative flex items-center space-x-2">
                <img
                  alt="Logo"
                  width="48"
                  height="48"
                  className="transform group-hover:scale-105 transition-all duration-200"
                  src="/grok.svg"
                />
                <GradientText className="text-5xl font-bold">
                  COIN
                </GradientText>
              </div>
            </GlowEffect>
          </a>
        </div>
        <div className="flex-1 px-4 py-4 space-y-2">
          {navigationItems.map((item) => (
            <a className="block" href={item.path} key={item.path}>
              <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium ${isActive(item.path) ? 'text-white bg-gradient-to-r from-purple-600/20 to-pink-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'} transition-all duration-200`}>
                {React.cloneElement(item.icon as React.ReactElement, { 
                  className: `w-5 h-5 ${isActive(item.path) ? 'text-purple-400' : 'text-gray-400'}`
                })}
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-r"></div>
                )}
              </div>
            </a>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-800/50 text-gray-400 text-sm">
          <div className="space-y-2">
            <a
              href="/whitepaper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-white transition-colors"
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

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {children}
      </div>
    </div>
  );
} 