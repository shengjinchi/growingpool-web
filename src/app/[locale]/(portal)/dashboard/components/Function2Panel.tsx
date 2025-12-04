"use client";

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Function2Panel() {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('dashboard.tab.function2')}
        </h2>
        <div className="text-gray-600 dark:text-gray-400 space-y-4">
          <p>此功能页面暂时留空，等待未来开发。</p>
          <p>This feature page is temporarily reserved for future development.</p>
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              预计功能：待定
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Expected Feature: To be determined
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}