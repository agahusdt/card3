'use client';

import React from 'react';

// Gradient arka planlar için bileşenler
export const GradientBackground = ({ 
  children, 
  className = "",
  from = "purple-500", 
  to = "teal-500", 
  opacity = "10",
  blur = "xl",
  rounded = "2xl"
}: {
  children: React.ReactNode,
  className?: string,
  from?: string,
  to?: string,
  opacity?: string,
  blur?: string,
  rounded?: string
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-br from-${from}/${opacity} to-${to}/${opacity} blur-${blur} rounded-${rounded}`}></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Animasyonlu hover efekti için bileşen
export const HoverEffect = ({ 
  children, 
  className = "",
  scale = "105"
}: {
  children: React.ReactNode,
  className?: string,
  scale?: string
}) => {
  return (
    <div className={`transition-all duration-300 transform hover:scale-${scale} ${className}`}>
      {children}
    </div>
  );
};

// Glass efekti için bileşen
export const GlassMorphism = ({ 
  children, 
  className = "",
  bgOpacity = "40",
  borderOpacity = "5"
}: {
  children: React.ReactNode,
  className?: string,
  bgOpacity?: string,
  borderOpacity?: string
}) => {
  return (
    <div className={`bg-black/${bgOpacity} backdrop-blur-xl border border-white/${borderOpacity} rounded-2xl ${className}`}>
      {children}
    </div>
  );
};

// Glow efekti için bileşen
export const GlowEffect = ({
  children,
  className = "",
  color = "purple", 
  secondColor = "pink",
  opacity = "25",
  hover = true
}: {
  children: React.ReactNode,
  className?: string,
  color?: string,
  secondColor?: string,
  opacity?: string,
  hover?: boolean
}) => {
  return (
    <div className="group relative">
      <div className={`absolute -inset-1 bg-gradient-to-r from-${color}-600 to-${secondColor}-600 rounded-lg blur opacity-${opacity} ${hover ? "group-hover:opacity-40" : ""} transition duration-200`}></div>
      <div className={`relative ${className}`}>
        {children}
      </div>
    </div>
  );
};

// Pulse efekti için bileşen
export const PulseIndicator = ({
  className = "",
  color = "blue-400"
}: {
  className?: string,
  color?: string
}) => {
  return (
    <div className={`w-2 h-2 rounded-full bg-${color} animate-pulse ${className}`}></div>
  );
};

// Gradient Text için bileşen
export const GradientText = ({
  children,
  className = "",
  from = "purple-400",
  to = "pink-400"
}: {
  children: React.ReactNode,
  className?: string,
  from?: string,
  to?: string
}) => {
  return (
    <span className={`text-transparent bg-clip-text bg-gradient-to-r from-${from} to-${to} ${className}`}>
      {children}
    </span>
  );
}; 