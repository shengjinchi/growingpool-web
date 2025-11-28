"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import BrandName from '@/components/custom/BrandName';
import LocaleLink from '@/components/navigation/LocaleLink';

export default function UnifiedNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { theme, toggleTheme, mounted } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const navItems = [
    {
      name: t('nav.training'),
      link: "/splan/join-us",
    },
    {
      name: language === 'zh' ? '教育中心' : 'Education',
      link: "/education",
    },
      {
      name: t('nav.blog'),
      link: "/splan/blog",
    },
    {
      name: t('nav.psychology'),
      link: "/splan/psychology-test",
    },
    {
      name: t('nav.dashboard'),
      link: "/dashboard",
    },
    {
      name: language === 'zh' ? '交易直播' : 'Live Trading',
      link: "/live-trading",
    },
    {
      name: language === 'zh' ? '日历' : 'Calendar',
      link: "/economic-calendar",
    },
      {
      name: t('nav.tradingTools'),
      link: "/tools/position-calculator",
      hasDropdown: true,
      dropdownItems: [
        { name: language === 'zh' ? '仓位计算器' : 'Position Calculator', link: '/tools/position-calculator' },
        { name: language === 'zh' ? '风险回报计算器' : 'Risk/Reward Calculator', link: '/tools/risk-reward-calculator' },
        { name: language === 'zh' ? '点值计算器' : 'Pip Calculator', link: '/tools/pip-calculator' },
      ]
    },
    {
      name: t('nav.faq'),
      link: "/splan/faq",
    },
    {
      name: t('nav.membership'),
      link: "/splan/donate",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (link: string) => {
    // Extract path without locale prefix for comparison
    const pathSegments = pathname.split('/').filter(Boolean);
    const currentLocale = pathSegments[0] === 'en' || pathSegments[0] === 'zh' ? pathSegments[0] : 'zh';
    const pathWithoutLocale = '/' + pathSegments.slice(currentLocale === pathSegments[0] ? 1 : 0).join('/');

    if (link === '/') {
      return pathWithoutLocale === '/' || pathWithoutLocale === '';
    }
    return pathWithoutLocale.startsWith(link);
  };

  return (
    <>
      <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
          : 'bg-white dark:bg-gray-900'
      } border-b border-gray-200 dark:border-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - 靠左 */}
          <div className="flex items-center space-x-6">
            <LocaleLink href="/" className="flex items-center group">
              <span className="text-2xl"><BrandName /></span>
            </LocaleLink>

            {/* Desktop Navigation - 紧跟 Logo */}
            <div className="hidden md:flex items-center">
              {navItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.name)}
                onMouseLeave={() => item.hasDropdown && setOpenDropdown(null)}
              >
                <LocaleLink
                  href={item.link}
                  className="relative px-3 py-2 text-sm font-medium transition-colors group flex items-center gap-1"
                >
                  <span
                    className={`relative z-10 ${
                      isActive(item.link)
                        ? 'text-yellow-600 dark:text-yellow-400 font-bold'
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-400'
                    }`}
                  >
                    {item.name}
                  </span>
                  {item.hasDropdown && (
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        openDropdown === item.name ? 'rotate-180' : ''
                      } ${
                        isActive(item.link)
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-gray-600 dark:text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-400'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  {isActive(item.link) && !item.hasDropdown && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500 dark:bg-yellow-400"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </LocaleLink>

                {/* Dropdown Menu */}
                {item.hasDropdown && item.dropdownItems && (
                  <AnimatePresence>
                    {openDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg z-50"
                      >
                        {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                          <LocaleLink
                            key={dropdownIndex}
                            href={dropdownItem.link}
                            className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                          >
                            {dropdownItem.name}
                          </LocaleLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
            </div>
          </div>

          {/* Right Side Actions (Desktop) - 靠右 */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <motion.button
              onClick={() => {
                // Implement language switching
                const newLang = language === 'zh' ? 'en' : 'zh';
                const currentPath = window.location.pathname;

                // Replace language prefix
                let newPath = currentPath.replace(/^\/(zh|en)/, `/${newLang}`);

                // Add language prefix if not present
                if (!newPath.startsWith('/zh') && !newPath.startsWith('/en')) {
                  newPath = `/${newLang}${currentPath === '/' ? '' : currentPath}`;
                }

                // Perform full page refresh
                window.location.href = newPath;
              }}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-yellow-500 dark:hover:border-yellow-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={language === 'zh' ? 'Switch to English' : '切换到中文'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              {language === 'zh' ? 'EN' : '中文'}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item, index) => (
                <div key={index}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                          isActive(item.link)
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 font-bold border-l-4 border-yellow-500'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <span>{item.name}</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            openDropdown === item.name ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openDropdown === item.name && item.dropdownItems && (
                        <div className="pl-4 mt-1 space-y-1">
                          {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                            <LocaleLink
                              key={dropdownIndex}
                              href={dropdownItem.link}
                              className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white transition-colors"
                            >
                              {dropdownItem.name}
                            </LocaleLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <LocaleLink
                      href={item.link}
                      className={`block px-4 py-3 text-sm font-medium transition-colors ${
                        isActive(item.link)
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 font-bold border-l-4 border-yellow-500'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {item.name}
                    </LocaleLink>
                  )}
                </div>
              ))}

              {/* Mobile Language Switcher */}
              <div className="px-4 pt-2">
                <motion.button
                  onClick={() => {
                    // Implement language switching
                    const newLang = language === 'zh' ? 'en' : 'zh';
                    const currentPath = window.location.pathname;

                    // Replace language prefix
                    let newPath = currentPath.replace(/^\/(zh|en)/, `/${newLang}`);

                    // Add language prefix if not present
                    if (!newPath.startsWith('/zh') && !newPath.startsWith('/en')) {
                      newPath = `/${newLang}${currentPath === '/' ? '' : currentPath}`;
                    }

                    // Perform full page refresh
                    window.location.href = newPath;
                  }}
                  className="w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-yellow-500 dark:hover:border-yellow-400"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title={language === 'zh' ? 'Switch to English' : '切换到中文'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  {language === 'zh' ? 'Switch to English' : '切换到中文'}
                </motion.button>
              </div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
        </motion.nav>
    </>
  );
}
