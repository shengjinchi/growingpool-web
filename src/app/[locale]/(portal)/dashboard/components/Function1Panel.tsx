"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Function1Panel() {
  const { t } = useLanguage();
  const [showPart4, setShowPart4] = useState(false);
  const [showPart5, setShowPart5] = useState(false);

  const handleCompleteNotes = () => {
    setShowPart4(true);
  };

  const handleActivation = () => {
    setShowPart5(true);
  };

  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        {t('dashboard.preparation.title')}
      </h1>

      {/* 下载加密播放器&加密视频教程 */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-1 h-8 bg-yellow-600 dark:bg-yellow-400"></div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t('dashboard.preparation.part1.title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <a
            href="https://pan.quark.cn/s/10c8fdc7df58"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white font-medium">
                {t('dashboard.preparation.part1.player')}
              </span>
              <span className="text-yellow-600 dark:text-yellow-400">→</span>
            </div>
          </a>

          <a
            href="https://pan.quark.cn/s/dc5d8c368c78"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white font-medium">
                {t('dashboard.preparation.part1.videos')}
              </span>
              <span className="text-yellow-600 dark:text-yellow-400">→</span>
            </div>
          </a>
        </div>
      </section>

      {/* 如何播放加密教程？ */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-1 h-8 bg-yellow-600 dark:bg-yellow-400"></div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t('dashboard.preparation.part2.title')}
          </h2>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <ol className="space-y-4 text-gray-700 dark:text-gray-300">
            <li className="flex">
              <span className="font-bold mr-2">1.</span>
              <span>{t('dashboard.preparation.part2.step1')}</span>
            </li>
            <li className="flex">
              <span className="font-bold mr-2">2.</span>
              <span>{t('dashboard.preparation.part2.step2')}</span>
            </li>
            <li className="flex">
              <span className="font-bold mr-2">3.</span>
              <span>{t('dashboard.preparation.part2.step3')}</span>
            </li>
            <li className="flex">
              <span className="font-bold mr-2">4.</span>
              <span>{t('dashboard.preparation.part2.step4')}</span>
            </li>
          </ol>
        </div>
      </section>

      {/* 完成学习笔记 */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-1 h-8 bg-yellow-600 dark:bg-yellow-400"></div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t('dashboard.preparation.part3.title')}
          </h2>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t('dashboard.preparation.part3.step1')}
          </p>

          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600">
            <p className="text-yellow-800 dark:text-yellow-200 font-medium">
              {t('dashboard.preparation.part3.focus')}
            </p>
          </div>

          {!showPart4 && (
            <div className="text-center">
              <button
                onClick={handleCompleteNotes}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                {t('dashboard.preparation.part3.button')}
              </button>
            </div>
          )}

          {showPart4 && (
            <div className="text-center">
              <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 rounded-lg">
                ✓ {t('dashboard.preparation.part3.button')}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 下载并安装交易系统 */}
      {showPart4 && (
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-8 bg-yellow-600 dark:bg-yellow-400"></div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t('dashboard.preparation.part4.title')}
            </h2>
          </div>

          <div className="mb-6">
            <a
              href="https://pan.quark.cn/s/46b717ef2def"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                  {t('dashboard.preparation.part4.download')}
                </span>
                <span className="text-yellow-600 dark:text-yellow-400">→</span>
              </div>
            </a>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('dashboard.preparation.part4.install.title')}
            </h3>

            <ol className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex">
                <span className="font-bold mr-2">1.</span>
                <span>{t('dashboard.preparation.part4.install.step1')}</span>
              </li>
              <li className="flex">
                <span className="font-bold mr-2">2.</span>
                <span>{t('dashboard.preparation.part4.install.step2')}</span>
              </li>
              <li className="flex">
                <span className="font-bold mr-2">3.</span>
                <span>{t('dashboard.preparation.part4.install.step3')}</span>
              </li>
              <li className="flex">
                <span className="font-bold mr-2">4.</span>
                <span>{t('dashboard.preparation.part4.install.step4')}</span>
              </li>
              <li className="flex">
                <span className="font-bold mr-2">5.</span>
                <span>{t('dashboard.preparation.part4.install.step5')}</span>
              </li>
              <li className="flex">
                <span className="font-bold mr-2">6.</span>
                <span>{t('dashboard.preparation.part4.install.step6')}</span>
              </li>
            </ol>

            {!showPart5 && (
              <div className="text-center mt-6">
                <button
                  onClick={handleActivation}
                  className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                >
                  {t('dashboard.preparation.part4.button')}
                </button>
              </div>
            )}

            {showPart5 && (
              <div className="text-center mt-6">
                <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 rounded-lg">
                  ✓ {t('dashboard.preparation.part4.button')}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 完成激活 */}
      {showPart5 && (
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-8 bg-yellow-600 dark:bg-yellow-400"></div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t('dashboard.preparation.part5.title')}
            </h2>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <ol className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex">
                <span className="font-bold mr-2">7.</span>
                <span>{t('dashboard.preparation.part5.step7')}</span>
              </li>
              <li className="flex">
                <span className="font-bold mr-2">8.</span>
                <span>{t('dashboard.preparation.part5.step8')}</span>
              </li>
              <li className="flex">
                <span className="font-bold mr-2">9.</span>
                <span>{t('dashboard.preparation.part5.step9')}</span>
              </li>
              <li className="flex">
                <span className="font-bold mr-2">10.</span>
                <span>{t('dashboard.preparation.part5.step10')}</span>
              </li>
              <li className="flex">
                <span className="font-bold mr-2">11.</span>
                <span>{t('dashboard.preparation.part5.step11')}</span>
              </li>
              <li className="flex">
                <span className="font-bold mr-2">12.</span>
                <span>{t('dashboard.preparation.part5.step12')}</span>
              </li>
              <li className="flex">
                <span className="font-bold mr-2">13.</span>
                <span>{t('dashboard.preparation.part5.step13')}</span>
              </li>
            </ol>

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600">
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                {t('dashboard.preparation.part5.note')}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}