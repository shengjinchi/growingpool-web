"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TiantiPanel() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { t } = useLanguage();
  const imageUrl = 'https://qingwuwei.github.io/tianti/images/tianti.png';

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

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