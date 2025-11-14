"use client";
import { Code, Flex, Text } from "@radix-ui/themes";
import { LinkPreview } from "@/components/ui/link-preview";
import { SparklesCore } from "@/components/ui/sparkles";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EmailContactModal from '@/components/custom/EmailContactModal';
import BrandName from '@/components/custom/BrandName';
import BrandSlogans from '@/components/custom/BrandSlogans';
import { FadeInSlide, ScaleFadeIn, HoverCard, PulseButton, FloatingBadge, StaggeredFadeIn } from '@/components/custom/AnimatedSection';
import CandlestickChart from '@/components/custom/CandlestickChart';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import ShineButton from '@/components/custom/ShineButton';

const DummyContent = () => {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 收益图片列表 (1-15)
  const profitImages = [
    '/profits/1.png',
    '/profits/2.png',
    '/profits/3.png',
    '/profits/4.png',
    '/profits/5.png',
    '/profits/6.png',
    '/profits/7.png',
    '/profits/8.png',
    '/profits/9.png',
    '/profits/10.png',
    '/profits/11.png',
    '/profits/12.jpg',
    '/profits/13.png',
    '/profits/14.png',
    '/profits/15.png',
  ];

  // 自动滚动图片 - 每次显示3张
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const nextIndex = prev + 3;
        // 如果超出范围，回到开头
        return nextIndex >= profitImages.length ? 0 : nextIndex;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [profitImages.length]);

  return (
    <div className="w-full -mt-20">
      {/* Hero Section - Full Width K-line Background */}
      <div className="relative bg-white dark:bg-black overflow-hidden h-screen">
        {/* K-line Chart Background */}
        <div className="absolute inset-0 w-full h-full">
          <CandlestickChart />
        </div>

        {/* Gradient Overlay - from left (opaque) to right (transparent) */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 30%, rgba(255, 255, 255, 0.3) 60%, rgba(255, 255, 255, 0) 100%)'
          }}
        />
        <div
          className="absolute inset-0 w-full h-full pointer-events-none dark:block hidden"
          style={{
            background: 'linear-gradient(to right, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.85) 30%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0) 100%)'
          }}
        />

        {/* Content Overlay - Centered in viewport */}
        <div className="relative z-10 flex items-center h-full">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-3xl flex flex-col space-y-10">
            {/* Main Title */}
            <ScaleFadeIn delay={0.2}>
              <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-black dark:text-white tracking-tight leading-none">
                <BrandName />
              </h1>
            </ScaleFadeIn>

            {/* Subtitle */}
            <FadeInSlide direction="right" delay={0.4}>
              <p className="text-2xl md:text-3xl lg:text-4xl text-black dark:text-white font-bold leading-tight">
                {t('hero.subtitle')}
              </p>
            </FadeInSlide>

            {/* CTAs */}
            <FadeInSlide direction="right" delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-6">
                <PulseButton>
                  <ShineButton
                    onClick={() => router.push(`/${language}/splan/join-us`)}
                    className="px-12 py-6 bg-black dark:bg-white text-white dark:text-black text-xl font-black border-2 border-black dark:border-white hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all shadow-lg sm:min-w-[200px] min-w-[240px]"
                  >
                    {t('hero.cta.learn')}
                  </ShineButton>
                </PulseButton>
                <button
                  onClick={() => router.push(`/${language}/dashboard`)}
                  className="px-12 py-6 bg-white dark:bg-black text-black dark:text-white text-xl font-black border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                >
                  {t('hero.cta.dashboard')}
                </button>
              </div>
            </FadeInSlide>
            </div>
          </div>
        </div>
      </div>

      {/* 为什么选择 GrowingPool - 增强版 */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-black dark:text-white">
            {t('why.title')}
          </h2>
          <div className="w-24 h-1 bg-black dark:bg-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t('why.subtitle')}
          </p>
        </div>

        {/* 核心优势 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <FadeInSlide direction="up" delay={0.1}>
            <HoverCard className="h-full">
              <div className="p-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 h-full hover:border-black dark:hover:border-white transition-colors">
                <div className="mb-4 w-12 h-12 bg-black dark:bg-white flex items-center justify-center">
                  <span className="text-2xl text-white dark:text-black font-bold">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">{t('advantage.selection.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('advantage.selection.desc')}
                </p>
              </div>
            </HoverCard>
          </FadeInSlide>

          <FadeInSlide direction="up" delay={0.2}>
            <HoverCard className="h-full">
              <div className="p-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 h-full hover:border-black dark:hover:border-white transition-colors">
                <div className="mb-4 w-12 h-12 bg-black dark:bg-white flex items-center justify-center">
                  <span className="text-2xl text-white dark:text-black font-bold">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">{t('advantage.growth.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('advantage.growth.desc')}
                </p>
              </div>
            </HoverCard>
          </FadeInSlide>

          <FadeInSlide direction="up" delay={0.3}>
            <HoverCard className="h-full">
              <div className="p-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 h-full hover:border-black dark:hover:border-white transition-colors">
                <div className="mb-4 w-12 h-12 bg-black dark:bg-white flex items-center justify-center">
                  <span className="text-2xl text-white dark:text-black font-bold">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">{t('advantage.commission.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('advantage.commission.desc')}
                </p>
              </div>
            </HoverCard>
          </FadeInSlide>
        </div>

        {/* 与传统培训对比 */}
        <div className="bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 p-8">
          <h3 className="text-2xl font-bold text-center mb-8 text-black dark:text-white">
            <span className="bg-black dark:bg-white text-white dark:text-black px-4 py-2">{t('comparison.vs')}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* GrowingPool */}
            <div className="bg-white dark:bg-gray-800 p-6 border-l-4 border-black dark:border-white">
              <h4 className="text-xl font-bold mb-4 text-black dark:text-white flex items-center gap-2">
                <span className="text-2xl"></span> {t('comparison.growingpool')}
              </h4>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-black dark:text-white font-bold">•</span>
                  <span>{t('comparison.free')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black dark:text-white font-bold">•</span>
                  <span>{t('comparison.practical')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black dark:text-white font-bold">•</span>
                  <span>{t('comparison.selection')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black dark:text-white font-bold">•</span>
                  <span>{t('comparison.funding')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black dark:text-white font-bold">•</span>
                  <span>{t('comparison.share')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black dark:text-white font-bold">•</span>
                  <span>{t('comparison.career')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black dark:text-white font-bold">•</span>
                  <span>{t('comparison.discipline')}</span>
                </li>
              </ul>
            </div>

            {/* 传统培训 */}
            <div className="bg-gray-100 dark:bg-gray-700 p-6 border-l-4 border-gray-400">
              <h4 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span className="text-2xl"></span> {t('comparison.traditional')}
              </h4>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>{t('comparison.highfee')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>{t('comparison.theory')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>{t('comparison.acceptall')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>{t('comparison.selffunded')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>{t('comparison.nosupport')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>{t('comparison.noplan')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>{t('comparison.loose')}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-black dark:bg-gray-950 text-white p-6 text-center">
            <p className="text-lg font-semibold">
              {t('comparison.emphasis')}
            </p>
          </div>
        </div>
      </div>

      {/* 职业发展路径 - 全新设计 */}
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black py-20 border-y-2 border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 text-black dark:text-white border-b-4 border-black dark:border-white inline-block pb-2 w-full">
            {t('career.title')}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 text-lg">
            {t('career.subtitle')}
          </p>

          {/* 发展阶梯 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {/* 阶段 1 */}
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-white p-6 h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-black dark:bg-white border-2 border-black dark:border-white flex items-center justify-center">
                  <span className="text-white dark:text-black font-black text-2xl">1</span>
                </div>
                <div className="mt-4">
                  <div className="inline-block px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold mb-3">
                    {t('career.stage1.days')}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-black dark:text-white">{t('career.stage1.title')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {t('career.stage1.desc')}
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 border-l-2 border-gray-400">
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      {t('career.stage1.warning')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 阶段 2 */}
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 border-2 border-gray-700 dark:border-gray-400 p-6 h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gray-700 dark:bg-gray-400 border-2 border-gray-700 dark:border-gray-400 flex items-center justify-center">
                  <span className="text-white dark:text-black font-black text-2xl">2</span>
                </div>
                <div className="mt-4">
                  <div className="inline-block px-3 py-1 bg-gray-700 dark:bg-gray-400 text-white dark:text-black text-xs font-bold mb-3">
                    {t('career.stage2.days')}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-black dark:text-white">{t('career.stage2.title')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {t('career.stage2.desc')}
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 border-l-2 border-gray-600">
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      {t('career.stage2.tip')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 阶段 3 */}
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 border-2 border-gray-800 dark:border-gray-300 p-6 h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gray-800 dark:bg-gray-300 border-2 border-gray-800 dark:border-gray-300 flex items-center justify-center">
                  <span className="text-white dark:text-black font-black text-2xl">3</span>
                </div>
                <div className="mt-4">
                  <div className="inline-block px-3 py-1 bg-gray-800 dark:bg-gray-300 text-white dark:text-black text-xs font-bold mb-3">
                    {t('career.stage3.days')}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-black dark:text-white">{t('career.stage3.title')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {t('career.stage3.desc')}
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 border-l-2 border-gray-700">
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      {t('career.stage3.success')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 阶段 4 */}
            <div className="relative">
              <div className="bg-black dark:bg-white border-2 border-black dark:border-white p-6 h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-black dark:bg-white border-2 border-black dark:border-white flex items-center justify-center">
                  <span className="text-white dark:text-black font-black text-2xl">★</span>
                </div>
                <div className="mt-4">
                  <div className="inline-block px-3 py-1 bg-white dark:bg-black text-black dark:text-white text-xs font-bold mb-3">
                    {t('career.stage4.path')}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white dark:text-black">{t('career.stage4.title')}</h3>
                  <p className="text-sm text-gray-300 dark:text-gray-700 mb-4">
                    {t('career.stage4.desc')}
                  </p>
                  <div className="bg-gray-800 dark:bg-gray-200 p-3 border-l-2 border-white dark:border-black">
                    <p className="text-xs text-white dark:text-black font-semibold">
                      {t('career.stage4.goal')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 你是否符合基本条件 - 全新设计 */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-black dark:text-white">
            {t('req.title')}
          </h2>
          <div className="w-24 h-1 bg-black dark:bg-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t('req.subtitle')}
          </p>
        </div>

        {/* 条件卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 人群画像 */}
          <div className="bg-gradient-to-br from-gray-900 to-black dark:from-gray-100 dark:to-white p-8 border-2 border-black dark:border-white shadow-lg hover:shadow-2xl transition-shadow">
            <div className="text-white dark:text-black">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white dark:bg-black flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-2xl font-bold">{t('req.profile.title')}</h3>
              </div>
              <div className="space-y-5">
                <div className="border-l-4 border-white dark:border-black pl-4 hover:pl-6 transition-all">
                  <p className="font-bold text-lg mb-1">{t('req.profile.education')}</p>
                  <p className="text-sm text-gray-300 dark:text-gray-600">{t('req.profile.education.desc')}</p>
                </div>
                <div className="border-l-4 border-white dark:border-black pl-4 hover:pl-6 transition-all">
                  <p className="font-bold text-lg mb-1">{t('req.profile.psychology')}</p>
                  <p className="text-sm text-gray-300 dark:text-gray-600">{t('req.profile.psychology.desc')}</p>
                </div>
                <div className="border-l-4 border-white dark:border-black pl-4 hover:pl-6 transition-all">
                  <p className="font-bold text-lg mb-1">{t('req.profile.character')}</p>
                  <p className="text-sm text-gray-300 dark:text-gray-600">{t('req.profile.character.desc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 时间与环境 */}
          <div className="bg-white dark:bg-gray-900 p-8 border-2 border-black dark:border-white shadow-lg hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-black dark:bg-white flex items-center justify-center">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white">{t('req.time.title')}</h3>
            </div>
            <div className="space-y-5">
              <div className="flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-3 -m-3 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 bg-black dark:bg-white flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white mb-1">{t('req.time.commitment')}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('req.time.commitment.desc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-3 -m-3 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 bg-black dark:bg-white flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white mb-1">{t('req.time.equipment')}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('req.time.equipment.desc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-3 -m-3 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 bg-black dark:bg-white flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white mb-1">{t('req.time.environment')}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('req.time.environment.desc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 在线时间 */}
          <div className="bg-gradient-to-br from-gray-900 to-black dark:from-gray-100 dark:to-white p-8 border-2 border-black dark:border-white shadow-lg hover:shadow-2xl transition-shadow">
            <div className="text-white dark:text-black">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white dark:bg-black flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-2xl font-bold">{t('req.online.title')}</h3>
              </div>
              <div className="space-y-5">
                <div className="border-l-4 border-white dark:border-black pl-4 hover:pl-6 transition-all">
                  <p className="font-bold text-lg mb-1">{t('req.online.hours')}</p>
                  <p className="text-sm text-gray-300 dark:text-gray-600">{t('req.online.hours.desc')}</p>
                </div>
                <div className="border-l-4 border-white dark:border-black pl-4 hover:pl-6 transition-all">
                  <p className="font-bold text-lg mb-1">{t('req.online.debrief')}</p>
                  <p className="text-sm text-gray-300 dark:text-gray-600">{t('req.online.debrief.desc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 适合与否 */}
          <div className="bg-white dark:bg-gray-900 p-8 border-2 border-black dark:border-white shadow-lg hover:shadow-2xl transition-shadow">
            <div className="text-black dark:text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-black dark:bg-white flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-2xl font-bold">{t('unsuitable.title')}</h3>
              </div>
              <div className="space-y-5">
                <div className="border-l-4 border-black dark:border-white pl-4 hover:pl-6 transition-all">
                  <p className="font-bold text-lg flex items-center gap-2 mb-1">
                    <span className="text-red-600 dark:text-red-400">✗</span>
                    {t('unsuitable.gambler')}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-400">{t('unsuitable.gambler.desc')}</p>
                </div>
                <div className="border-l-4 border-black dark:border-white pl-4 hover:pl-6 transition-all">
                  <p className="font-bold text-lg flex items-center gap-2 mb-1">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    {t('expectations.mindset')}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-400">{t('expectations.mindset.desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 重要提示 */}
        <div className="mt-8 bg-gradient-to-r from-gray-900 to-black dark:from-gray-100 dark:to-white text-white dark:text-black p-8 border-2 border-black dark:border-white shadow-xl">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-white dark:bg-black flex items-center justify-center rounded-full">
              <svg className="w-8 h-8 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold mb-3">{t('req.notice.title')}</h4>
              <p className="text-lg leading-relaxed mb-4">
                {t('req.notice.once')}{t('req.notice.desc')}
              </p>
              <p className="text-gray-300 dark:text-gray-700">
                {t('req.notice.philosophy')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 视频介绍板块 */}
      <div className="bg-gray-50 dark:bg-gray-900 py-20 border-y-2 border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 text-black dark:text-white border-b-4 border-black dark:border-white inline-block pb-2 w-full">
            {t('video.title')}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 text-lg">
            {t('video.subtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 视频 1 */}
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 overflow-hidden group hover:border-black dark:hover:border-white transition-all">
              <div className="relative h-64 bg-black dark:bg-gray-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4"></div>
                  <p className="text-lg font-semibold">{t('video.doc1.title')}</p>
                  <p className="text-sm text-gray-400">{t('video.doc1.rating')}</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-black dark:text-white">{t('video.doc1.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                  {t('video.doc1.desc')}
                </p>
                <a
                  href="https://www.bilibili.com/video/BV19a411X7eY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold border-2 border-black dark:border-white hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors"
                >
                  {t('video.doc1.cta')}
                </a>
              </div>
            </div>

            {/* 视频 2 */}
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 overflow-hidden group hover:border-black dark:hover:border-white transition-all">
              <div className="relative h-64 bg-black dark:bg-gray-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4"></div>
                  <p className="text-lg font-semibold">{t('video.doc2.title')}</p>
                  <p className="text-sm text-gray-400">{t('video.doc2.rating')}</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-black dark:text-white">{t('video.doc2.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                  {t('video.doc2.desc')}
                </p>
                <a
                  href="https://www.bilibili.com/video/BV1FZ4y1o734"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold border-2 border-black dark:border-white hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors"
                >
                  {t('video.doc2.cta')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 学员展示 - 收益滚动 */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-4 text-black dark:text-white border-b-4 border-black dark:border-white inline-block pb-2 w-full">
          {t('showcase.title')}
        </h2>

        {/* 收益统计 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 border-2 border-gray-200 dark:border-gray-700 text-center">
            <div className="text-4xl font-black text-black dark:text-white mb-2">{t('showcase.junior')}</div>
            <p className="text-2xl font-bold text-black dark:text-white">¥10,000 - ¥30,000</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{t('showcase.income.range')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 border-2 border-black dark:border-white text-center">
            <div className="text-4xl font-black text-black dark:text-white mb-2">{t('showcase.intermediate')}</div>
            <p className="text-2xl font-bold text-black dark:text-white">¥30,000 - ¥60,000</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{t('showcase.income.range')}</p>
          </div>
          <div className="bg-black dark:bg-white p-6 border-2 border-black dark:border-white text-center">
            <div className="text-4xl font-black text-white dark:text-black mb-2">{t('showcase.senior')}</div>
            <p className="text-2xl font-bold text-white dark:text-black">¥60,000 - ¥100,000+</p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-2">{t('showcase.income.range')}</p>
          </div>
        </div>

        {/* 收益图片滚动展示 - 每次显示3张 */}
        <div className="bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-8">
          <h3 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">
            {t('showcase.screenshots.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((offset) => {
              const imageIndex = currentImageIndex + offset;
              const image = profitImages[imageIndex < profitImages.length ? imageIndex : imageIndex - profitImages.length];
              return (
                <div key={offset} className="relative h-80 overflow-hidden bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600">
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <img
                      src={image}
                      alt={`学员收益 ${imageIndex + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('showcase.screenshots.note')}
            </p>
          </div>
        </div>
      </div>

      {/* Official Partners */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16 w-full">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              官方合作伙伴
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              与全球领先的交易平台和专业机构合作
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-center justify-center">
            {/* FTMO */}
            <div className="flex justify-center">
              <a
                href="https://trader.ftmo.com/?affiliates=VYNFNBgLsulOXujdoJoM"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-80 transition-opacity duration-300"
              >
                <svg width="150" height="40" viewBox="0 0 3950 1000" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-14 w-auto">
                  <path d="M1309.81 780.68H1417.27V532.224H1676.62V438.809H1417.27V312.848H1724.34V218.528H1309.81V780.68Z" fill="#262729"/>
                  <path d="M1806.29 312.823H2000.2V780.655H2107.66V312.823H2301.57V218.503H1806.29V312.823Z" fill="#262729"/>
                  <path d="M2726.88 500.407L2528.93 220.311L2527.57 218.503H2434.97V780.655H2542.43V408.046L2585.96 475.848L2722.53 671.418L2726.13 676.541L2864.81 476.601C2883.87 449.481 2899.18 426.428 2910.43 408.046V780.504H3017.89V218.503H2925.29L2726.88 500.407Z" fill="#262729"/>
                  <path d="M3674.28 294.152C3618.3 238.404 3547.62 210.078 3464.17 210.078C3380.58 210.078 3309.89 238.404 3253.91 294.152C3198.08 350.051 3169.71 419.058 3169.71 499.667C3169.71 580.728 3198.08 650.187 3253.91 706.086C3309.74 761.834 3380.58 790.16 3464.17 790.16C3547.77 790.16 3618.45 761.834 3674.28 706.086C3730.11 650.337 3758.48 580.878 3758.48 499.667C3758.48 419.058 3730.11 349.9 3674.28 294.152ZM3594.44 635.27C3559.77 672.637 3516.25 691.47 3465.07 691.47C3413.29 691.47 3369.32 672.486 3334.35 635.27C3299.38 597.904 3281.52 552.251 3281.52 499.516C3281.52 446.932 3299.23 401.43 3334.35 364.214C3369.32 327.149 3413.29 308.315 3465.07 308.315C3516.25 308.315 3559.77 327.149 3594.59 364.063C3629.41 401.128 3646.97 446.631 3646.97 499.366C3646.82 552.251 3629.11 597.904 3594.44 635.27Z" fill="#262729"/>
                  <path d="M117.066 617.598L497.981 235.197V0L0 500.075L117.066 617.598Z" fill="#262729"/>
                  <path d="M498.028 999.987V674.388L335.936 837.263L498.028 999.987Z" fill="#262729"/>
                  <path d="M497.944 334.323L166.406 667.154L286.324 787.54L497.944 575.095V334.323Z" fill="#262729"/>
                  <path d="M560.322 0V235.197L824.021 499.925L560.322 764.803V1000L1058.3 499.925L560.322 0Z" fill="#262729"/>
                  <path d="M3852.75 18.1377C3798.27 18.1377 3754.89 60.6268 3754.89 113.512C3754.89 167.603 3798.27 209.941 3852.75 209.941C3907.68 209.941 3950 167.452 3950 113.512C3950 60.4761 3907.83 18.1377 3852.75 18.1377ZM3853.35 189.601C3810.57 189.601 3779.2 155.851 3779.2 113.512C3779.2 71.6257 3810.42 37.4235 3852.75 37.4235C3895.07 37.4235 3925.69 71.7764 3925.69 114.115C3925.69 155.851 3895.07 189.601 3853.35 189.601Z" fill="#262729"/>
                  <path d="M3874.77 116.241V115.035C3886.32 111.57 3894.43 103.434 3894.43 92.8867C3894.43 83.5452 3890.38 76.0116 3885.12 71.9435C3878.22 67.8754 3870.11 65.0127 3852.1 65.0127C3836.49 65.0127 3824.34 66.2181 3815.63 67.8754V163.25H3837.7V124.829H3848.05C3860.21 124.829 3866.06 129.5 3867.71 139.896C3870.56 150.895 3872.37 159.634 3875.22 163.099H3898.93C3896.68 159.634 3894.88 153.758 3892.03 139.293C3889.17 126.637 3884.07 119.706 3874.77 116.241ZM3848.65 109.159H3838.3V81.8878C3840.55 81.2851 3844.75 80.6824 3850.45 80.6824C3864.41 80.6824 3870.71 86.5586 3870.71 95.1468C3870.71 105.091 3860.81 109.159 3848.65 109.159Z" fill="#262729"/>
                </svg>
              </a>
            </div>

            {/* Binance */}
            <div className="flex justify-center">
              <a
                href="https://accounts.maxweb.red/register?ref=836146089"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-80 transition-opacity duration-300"
              >
                <svg viewBox="0 0 633.04 126.61" xmlns="http://www.w3.org/2000/svg" className="h-14 w-auto">
                  <g fill="#f3ba2f">
                    <path d="m38.72 53.2 24.59-24.58 24.6 24.6 14.3-14.31-38.9-38.91-38.9 38.9z"/>
                    <path d="m3.64 53.19h20.23v20.23h-20.23z" transform="matrix(.70710678 -.70710678 .70710678 .70710678 -40.19 28.27)"/>
                    <path d="m38.72 73.41 24.59 24.59 24.6-24.6 14.31 14.29-.01.01-38.9 38.91-38.9-38.89-.02-.02z"/>
                    <path d="m101.64 53.19h20.23v20.23h-20.23z" transform="matrix(.70710678 -.70710678 .70710678 .70710678 -11.49 97.57)"/>
                    <path d="m77.82 63.3-14.51-14.52-10.73 10.73-1.24 1.23-2.54 2.54-.02.02.02.03 14.51 14.5 14.51-14.52.01-.01z"/>
                    <g transform="translate(.55)">
                      <path d="m148.37 30.68h31.12q11.58 0 17.52 6a15.5 15.5 0 0 1 4.59 11.32v.19a16.67 16.67 0 0 1 -.71 5.08 15.6 15.6 0 0 1 -1.91 4 14.77 14.77 0 0 1 -2.76 3.12 17.92 17.92 0 0 1 -3.39 2.3 22.66 22.66 0 0 1 9.17 6q3.34 3.8 3.34 10.5v.19a17.44 17.44 0 0 1 -1.77 8.06 15.72 15.72 0 0 1 -5.07 5.76 24.05 24.05 0 0 1 -7.95 3.45 42.7 42.7 0 0 1 -10.29 1.15h-31.89zm28 27.14a15.39 15.39 0 0 0 7.77-1.68 5.8 5.8 0 0 0 2.86-5.42v-.19a5.93 5.93 0 0 0 -2.49-5.13q-2.49-1.77-7.19-1.77h-14.56v14.19zm3.93 27.05a14.2 14.2 0 0 0 7.7-1.77 6.08 6.08 0 0 0 2.78-5.52v-.19a6.31 6.31 0 0 0 -2.59-5.32q-2.58-2-8.34-2h-17.09v14.8z"/>
                      <path d="m223.88 30.68h14.77v67.14h-14.77z"/>
                      <path d="m261 30.68h13.62l31.48 41.32v-41.32h14.58v67.14h-12.57l-32.51-42.68v42.68h-14.6z"/>
                      <path d="m365.4 30.2h13.6l28.77 67.62h-15.42l-6.14-15.06h-28.39l-6.14 15.06h-15.06zm15.54 39.52-8.94-21.78-8.9 21.78z"/>
                      <path d="m423.74 30.68h13.62l31.46 41.32v-41.32h14.58v67.14h-12.57l-32.51-42.68v42.68h-14.58z"/>
                      <path d="m536.56 99a34.93 34.93 0 0 1 -13.72-2.68 33.17 33.17 0 0 1 -18.13-18.32 35.54 35.54 0 0 1 -2.59-13.53v-.19a34.84 34.84 0 0 1 9.79-24.51 33.23 33.23 0 0 1 11-7.48 35.9 35.9 0 0 1 14.19-2.73 44.49 44.49 0 0 1 8.58.77 35.66 35.66 0 0 1 7.06 2.11 30.5 30.5 0 0 1 5.85 3.26 39.52 39.52 0 0 1 5 4.22l-9.39 10.84a35.71 35.71 0 0 0 -8-5.57 20.47 20.47 0 0 0 -9.16-2 18.58 18.58 0 0 0 -14 6.14 21.09 21.09 0 0 0 -4.04 6.67 22.87 22.87 0 0 0 -1.43 8.11v.19a23.21 23.21 0 0 0 1.43 8.1 21.32 21.32 0 0 0 4 6.71 18.46 18.46 0 0 0 14 6.24 20.52 20.52 0 0 0 9.73-2.11 37.62 37.62 0 0 0 7.91-5.76l9.4 9.5a47.93 47.93 0 0 1 -5.37 5 32 32 0 0 1 -6.09 3.79 31.56 31.56 0 0 1 -7.24 2.39 43.11 43.11 0 0 1 -8.78.84z"/>
                      <path d="m581.47 30.68h50.53v13.14h-36v13.62h31.7v13.14h-31.65v14.1h36.45v13.14h-51z"/>
                    </g>
                  </g>
                </svg>
              </a>
            </div>

            {/* TradingView */}
            <div className="flex justify-center">
              <a
                href="https://cn.tradingview.com/black-friday/?aff_id=158982"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-80 transition-opacity duration-300"
              >
                <svg width="140" height="20" viewBox="0 0 185 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto">
                  <path d="M14 20H7V9H0V2H14V20ZM28 20H20L27.5 2H35.5L28 20Z" fill="black"/>
                  <path d="M20 10C22.2091 10 24 8.20914 24 6C24 3.79086 22.2091 2 20 2C17.7909 2 16 3.79086 16 6C16 8.20914 17.7909 10 20 10Z" fill="black"/>
                  <path d="M43.793 20.024H47.495V5.519H52.338V2.02H39V5.52H43.793V20.024ZM52.343 20.024H55.817V13.964C55.817 11.859 56.907 10.591 58.557 10.591C59.139 10.591 59.596 10.692 60.128 10.87V7.345C59.7493 7.23548 59.3561 7.18423 58.962 7.193C57.542 7.193 56.249 8.131 55.817 9.373V7.346H52.343V20.025V20.024ZM66.796 20.303C68.546 20.303 69.864 19.415 70.448 18.603V20.023H73.922V7.346H70.448V8.766C69.864 7.955 68.546 7.067 66.796 7.067C63.424 7.067 60.837 10.11 60.837 13.685C60.837 17.261 63.424 20.304 66.797 20.304L66.796 20.303ZM67.532 17.133C65.604 17.133 64.336 15.688 64.336 13.685C64.336 11.681 65.604 10.235 67.532 10.235C69.459 10.235 70.727 11.681 70.727 13.685C70.727 15.688 69.459 17.133 67.532 17.133ZM82.193 20.303C83.943 20.303 85.261 19.415 85.844 18.603V20.023H89.318V1.007H85.844V8.767C85.261 7.955 83.943 7.067 82.193 7.067C78.82 7.067 76.233 10.11 76.233 13.685C76.233 17.261 78.82 20.304 82.193 20.304V20.303ZM82.928 17.133C81.001 17.133 79.733 15.688 79.733 13.685C79.733 11.681 81.001 10.235 82.928 10.235C84.855 10.235 86.123 11.681 86.123 13.685C86.123 15.688 84.855 17.133 82.928 17.133ZM94.166 5.412C94.4576 5.41451 94.7469 5.35935 95.0171 5.24969C95.2873 5.14004 95.5332 4.97805 95.7406 4.77305C95.9481 4.56805 96.1129 4.32407 96.2257 4.05514C96.3385 3.78621 96.3971 3.49763 96.398 3.206C96.3971 2.91437 96.3385 2.62579 96.2257 2.35686C96.1129 2.08793 95.9481 1.84395 95.7406 1.63895C95.5332 1.43395 95.2873 1.27196 95.0171 1.16231C94.7469 1.05265 94.4576 0.997495 94.166 1C93.5824 1.0047 93.024 1.23863 92.6113 1.65132C92.1986 2.06401 91.9647 2.62239 91.96 3.206C91.9647 3.78961 92.1986 4.34799 92.6113 4.76068C93.024 5.17337 93.5824 5.4073 94.166 5.412ZM92.442 20.024H95.916V7.49H92.442V20.023V20.024ZM98.998 20.024H102.472V13.837C102.472 11.402 103.664 10.236 105.287 10.236C106.732 10.236 107.519 11.352 107.519 13.177V20.024H110.993V12.594C110.993 9.298 109.167 7.066 106.099 7.066C104.45 7.066 103.157 7.776 102.472 8.79V7.345H98.998V20.024V20.024ZM119.833 16.65C118.083 16.65 116.613 15.331 116.613 13.404C116.613 11.452 118.083 10.158 119.833 10.158C121.583 10.158 123.053 11.452 123.053 13.404C123.053 15.331 121.583 16.65 119.833 16.65ZM119.427 25.5C123.307 25.5 126.249 23.522 126.249 18.957V7.268H122.775V8.688C122.09 7.7 120.72 6.99 119.098 6.99C115.776 6.99 113.113 9.83 113.113 13.405C113.113 16.955 115.776 19.795 119.098 19.795C120.721 19.795 122.09 19.06 122.775 18.122V18.984C122.775 21.013 121.431 22.458 119.377 22.458C117.957 22.458 116.537 21.976 115.421 20.886L113.519 23.472C114.964 24.867 117.221 25.501 119.427 25.501V25.5ZM133.594 20.024H136.864L144.32 2.02H140.263L135.242 14.521L130.145 2.02H126.164L133.594 20.024ZM147.508 5.266C147.8 5.26837 148.089 5.21312 148.359 5.1034C148.629 4.99369 148.875 4.83168 149.082 4.62669C149.289 4.4217 149.454 4.17777 149.567 3.9089C149.68 3.64004 149.738 3.35155 149.739 3.06C149.738 2.76845 149.68 2.47996 149.567 2.2111C149.454 1.94223 149.289 1.6983 149.082 1.49331C148.875 1.28832 148.629 1.12631 148.359 1.0166C148.089 0.906885 147.8 0.851627 147.508 0.854C146.316 0.854 145.301 1.842 145.301 3.06C145.301 4.277 146.316 5.266 147.508 5.266ZM145.783 20.024H149.257V7.345H145.783V20.024ZM158.248 20.303C160.91 20.303 162.939 19.187 164.131 17.463L161.544 15.536C160.961 16.423 159.871 17.133 158.273 17.133C156.6 17.133 155.104 16.195 154.901 14.496H164.384C164.46 13.963 164.435 13.608 164.435 13.304C164.435 9.171 161.519 7.066 158.197 7.066C154.343 7.066 151.528 9.931 151.528 13.684C151.528 17.691 154.47 20.303 158.248 20.303V20.303ZM155.027 12.138C155.357 10.591 156.802 9.931 158.096 9.931C159.389 9.931 160.657 10.616 160.961 12.138H155.027ZM177.45 20.024H180.899L185.083 7.345H181.355L178.972 15.459L176.385 7.345H173.723L171.162 15.459L168.753 7.345H165.05L169.26 20.024H172.708L175.067 12.822L177.45 20.024V20.024Z" fill="black"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              更多合作机构持续接入中...
            </p>
          </div>
        </div>
      </div>

      {/* CTA - 优化版 */}
      <div className="bg-black dark:bg-gray-950 py-20 w-full border-y-2 border-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-gray-300 mb-4">
            {t('cta.subtitle')}
          </p>

          {/* 通过率警告 - 重新设计 */}
          <div className="relative max-w-3xl mx-auto mb-12">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-red-500/20 to-yellow-500/20 blur-xl"></div>

            <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500/50 p-8 shadow-2xl">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-yellow-500 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-yellow-500 mb-2">{t('cta.notice.title')}</h3>
                <div className="h-1 w-24 bg-yellow-500"></div>
              </div>

              <div className="text-center mb-8">
                <p className="text-sm text-gray-400 mb-3">{t('cta.passrate')}</p>
                <p className="text-6xl font-black text-white mb-2">
                  <span className="text-yellow-500">10</span>-<span className="text-yellow-500">15</span><span className="text-4xl">%</span>
                </p>
                <p className="text-gray-300 text-lg">
                  {t('cta.passrate.desc')}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-black/50 backdrop-blur-sm p-4 border border-red-500/30">
                  <p className="text-xs text-gray-500 mb-2">{t('cta.elimination')}</p>
                  <p className="text-sm text-white font-bold">{t('cta.elimination.reason')}</p>
                </div>
                <div className="bg-black/50 backdrop-blur-sm p-4 border border-red-500/30">
                  <p className="text-xs text-gray-500 mb-2">{t('cta.opportunity')}</p>
                  <p className="text-sm text-white font-bold">{t('cta.opportunity.value')}</p>
                </div>
                <div className="bg-black/50 backdrop-blur-sm p-4 border border-red-500/30">
                  <p className="text-xs text-gray-500 mb-2">{t('cta.time.cost')}</p>
                  <p className="text-sm text-white font-bold">{t('cta.time.value')}</p>
                </div>
                <div className="bg-black/50 backdrop-blur-sm p-4 border border-green-500/30">
                  <p className="text-xs text-gray-500 mb-2">{t('cta.money.cost')}</p>
                  <p className="text-sm text-green-400 font-bold">{t('cta.money.value')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="px-10 py-5 bg-white text-black font-bold text-lg border-2 border-white hover:bg-black hover:text-white transition-colors animate-shake"
            >
              {t('cta.button.interview')}
            </button>
            <p className="text-sm text-gray-500">
              {t('cta.button.note')}
            </p>
          </div>
        </div>
      </div>

      {/* Email Contact Modal */}

      <EmailContactModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title="职业交易员面试"
      />
    </div>
  );
};

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="w-full">
      <DummyContent />
    </div>
  );
}
