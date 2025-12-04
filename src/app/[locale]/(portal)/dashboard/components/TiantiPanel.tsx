"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import databaseAuth, { type AuthUser } from '@/lib/auth/database-auth';
import { hasPermission } from '@/lib/user-management/types';

export default function TiantiPanel() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const { t } = useLanguage();
  const imageUrl = 'https://qingwuwei.github.io/tianti/images/tianti.png';

  useEffect(() => {
    const user = databaseAuth.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const hasTiantiPermission = currentUser ? hasPermission(currentUser as any, 'tianti_read') : false;

  if (!hasTiantiPermission) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 opacity-60">
          <div className="relative">
            {/* 覆盖层 */}
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-6xl mb-4 text-gray-400 dark:text-gray-500">🔒</div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  权限不足
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  您需要天梯查看权限才能访问此功能
                </p>
              </div>
            </div>

            {/* 模糊的内容 */}
            <div className="filter blur-sm">
              <div className="flex justify-center mb-6">
                <img
                  src={imageUrl}
                  alt="Tianti Trading Signals"
                  width={800}
                  height={450}
                  className="rounded-lg opacity-50"
                />
              </div>
              <div className="flex justify-center">
                <button
                  disabled
                  className="px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-600 cursor-not-allowed rounded"
                >
                  {t('dashboard.tianti.refresh')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-center mb-6">
          <img
            key={refreshKey}
            src={imageUrl}
            alt="Tianti Trading Signals"
            width={800}
            height={450}
            className="rounded-lg"
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-yellow-600 dark:hover:border-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all rounded"
          >
            {t('dashboard.tianti.refresh')}
          </button>
        </div>
      </div>
    </div>
  );
}