"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 页面加载动画
export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 检测暗黑模式和移动设备
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkDarkMode();
    checkMobile();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);

    // 页面加载完成后隐藏加载动画
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5秒后消失

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const text = "生金池GrowingPool";
  const chars = text.split("");

  // Three different gold shades for each character
  const getCharColor = (char: string, index: number) => {
    const isChinese = /[\u4e00-\u9fff]/.test(char);
    if (isChinese) {
      // For 生金池: 生=lightest, 金=medium, 池=darkest
      if (isDark) {
        return index === 0 ? "#fde047" :   // yellow-300 (lightest)
               index === 1 ? "#fbbf24" :   // yellow-400 (medium)
               "#f59e0b";                   // yellow-600 (darkest)
      } else {
        return index === 0 ? "#facc15" :   // yellow-400 (lightest)
               index === 1 ? "#eab308" :   // yellow-500 (medium)
               "#ca8a04";                   // yellow-700 (darkest)
      }
    } else {
      // For GrowingPool: cycle through three gold shades
      const goldShades = isDark ?
        ["#fde047", "#fbbf24", "#f59e0b"] :  // dark mode: yellow-300, yellow-400, yellow-600
        ["#facc15", "#eab308", "#ca8a04"];   // light mode: yellow-400, yellow-500, yellow-700
      return goldShades[index % goldShades.length];
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[100] bg-white dark:bg-black flex items-center justify-center px-4"
        >
          {/* Logo 文字分裂重组动画 */}
          <div className="flex flex-col items-center gap-4 sm:gap-8 w-full max-w-md">
            {/* 分裂重组文字 - Mobile: wrap to prevent overflow */}
            <div className={`${isMobile ? 'flex flex-wrap justify-center gap-2' : 'flex'} text-center`}>
              {chars.map((char, index) => (
                <motion.span
                  key={index}
                  style={{
                    color: getCharColor(char, index),
                    fontFamily: "'Noto Sans SC', 'Inter', sans-serif",
                    fontSize: isMobile ? '1.5rem' : 'inherit'
                  }}
                  initial={{
                    x: (index % 2 === 0 ? -1 : 1) * (isMobile ? 40 : 80),
                    y: (index % 3 === 0 ? -1 : 1) * (isMobile ? 15 : 30),
                    opacity: 0,
                    rotate: (index % 2 === 0 ? -1 : 1) * (isMobile ? 15 : 30),
                  }}
                  animate={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                    rotate: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: index * 0.05,
                  }}
                  className={`${isMobile ? 'text-3xl' : 'text-7xl sm:text-8xl md:text-9xl lg:text-10xl'} font-bold`}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* 加载条 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="w-32 sm:w-48 md:w-64 h-1 bg-yellow-200 dark:bg-yellow-900 overflow-hidden"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.8,
                }}
                className="h-full w-1/2 bg-yellow-500 dark:bg-yellow-400"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}