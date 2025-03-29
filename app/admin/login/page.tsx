'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Key, Eye, EyeOff, Shield } from 'lucide-react';

export default function AdminLogin() {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Geçersiz API anahtarı');
        setIsLoading(false);
        return;
      }

      // Başarılı giriş
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error('Giriş hatası:', err);
      setError('Giriş sırasında bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Glass background pattern */}
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-black opacity-80" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 backdrop-blur">
              <Shield className="h-6 w-6 text-blue-500" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">Admin Panel</h1>
            <p className="text-gray-500 mt-2">Log in to access the administrator panel</p>
          </div>

          {/* Login Form */}
          <div className="backdrop-blur-xl bg-black/30 rounded-2xl p-8 border border-white/5">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-400 mb-2">
                  API Anahtarı
                </label>
                <div className="relative">
                  <input
                    id="apiKey"
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-4 py-2 pl-10 pr-10 bg-white/5 border border-white/5 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="API anahtarınızı girin"
                    required
                    disabled={isLoading}
                  />
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    {showKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Giriş yapılıyor...</span>
                  </div>
                ) : (
                  'Giriş Yap'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 