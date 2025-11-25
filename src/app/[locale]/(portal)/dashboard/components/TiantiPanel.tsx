"use client";

import React, { useState } from 'react';

export default function TiantiPanel() {
  const [refreshKey, setRefreshKey] = useState(0);
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
            alt="Tianti Ranking"
            width={800}
            height={450}
            className="rounded-lg"
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Ranking
          </button>
        </div>
      </div>
    </div>
  );
}