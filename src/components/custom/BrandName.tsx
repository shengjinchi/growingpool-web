"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function BrandName() {
  const { language } = useLanguage();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // 标记动画已播放，避免切换语言时重复播放
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const text = language === 'zh' ? '生金池' : 'GrowingPool';
  const chars = text.split('');

  return (
    <>
      {chars.map((char, index) => {
        // Three different gold shades for each character
        const getGoldColor = (index: number) => {
          if (language === 'zh') {
            // For 生金池: 生=yellow-400, 金=yellow-500, 池=yellow-600
            return index === 0 ? 'text-yellow-400 dark:text-yellow-300' :
                   index === 1 ? 'text-yellow-500 dark:text-yellow-400' :
                   'text-yellow-600 dark:text-yellow-500';
          } else {
            // For GrowingPool: Create gradient effect with three gold shades
            const goldColors = [
              'text-yellow-400 dark:text-yellow-300',
              'text-yellow-500 dark:text-yellow-400',
              'text-yellow-600 dark:text-yellow-500',
              'text-yellow-500 dark:text-yellow-400',
              'text-yellow-400 dark:text-yellow-300',
              'text-yellow-600 dark:text-yellow-500',
              'text-yellow-500 dark:text-yellow-400',
              'text-yellow-400 dark:text-yellow-300',
              'text-yellow-600 dark:text-yellow-500',
              'text-yellow-500 dark:text-yellow-400',
              'text-yellow-400 dark:text-yellow-300'
            ];
            return goldColors[index % goldColors.length];
          }
        };

        const isSecondPart = language === 'zh' ? index >= 1 : index >= 2;

        return (
          <motion.span
            key={`${language}-${index}`}
            className={`${isSecondPart ? 'font-normal' : 'font-black'} ${getGoldColor(index)}`}
            initial={hasAnimated ? false : {
              x: (index % 2 === 0 ? -1 : 1) * 150,
              y: (index % 3 === 0 ? -1 : 1) * 80,
              opacity: 0,
              rotate: (index % 2 === 0 ? -1 : 1) * 45,
              scale: 0.5,
            }}
            animate={{
              x: 0,
              y: 0,
              opacity: 1,
              rotate: 0,
              scale: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 12,
              delay: hasAnimated ? 0 : index * 0.08,
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </>
  );
}
