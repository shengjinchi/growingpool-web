"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import BrandName from '@/components/custom/BrandName';
import Link from 'next/link';
import databaseAuth, { type AuthUser } from '@/lib/auth/database-auth';

interface AdminLoginProps {
  onAuthenticate: () => void;
}

export default function AdminLogin({ onAuthenticate }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await databaseAuth.login(username, password);

      if (result.success && result.user) {
        // Update dashboard authentication flag for compatibility
        localStorage.setItem('dashboard_authenticated', 'true');

        onAuthenticate();
      } else {
        setError(result.error || '登录失败');
        setPassword('');
      }
    } catch (err) {
      setError('登录过程中发生错误');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              <BrandName /> {t('login.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('login.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('login.username.label')}
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-black dark:focus:border-white dark:bg-gray-700 dark:text-white transition-all"
                placeholder={t('login.username.placeholder')}
                autoFocus
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('login.password.label')}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-black dark:focus:border-white dark:bg-gray-700 dark:text-white transition-all"
                placeholder={t('login.password.placeholder')}
                disabled={loading}
              />
              {error && (
                <p className="mt-2 text-sm text-gray-900 dark:text-white font-semibold">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black font-semibold border-2 border-black dark:border-white hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : t('login.button')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              {t('login.back')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}