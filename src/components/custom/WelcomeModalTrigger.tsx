"use client";

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface WelcomeModalTriggerProps {
  onOpen: () => void;
}

export default function WelcomeModalTrigger({ onOpen }: WelcomeModalTriggerProps) {
  const { language } = useLanguage();
  const isZh = language === 'zh';

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed right-8 bottom-40 z-40"
    >
      <Button
        onClick={onOpen}
        size="lg"
        className="px-6 h-14 rounded-lg bg-gradient-to-br from-gray-900 to-black dark:from-white dark:to-gray-200 text-white dark:text-black shadow-2xl border-2 border-gray-800/30 dark:border-white/30 flex items-center gap-2"
        aria-label={isZh ? '重看介绍视频' : 'Rewatch Intro Video'}
        title={isZh ? '重看介绍视频' : 'Rewatch Intro Video'}
      >
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="font-medium">
          {isZh ? '重看视频' : 'Rewatch'}
        </span>
      </Button>
    </motion.div>
  );
}
