"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { language } = useLanguage();

  const contactOptions = [
    {
      name: language === 'zh' ? '微信' : 'WeChat',
      handle: 'growingpool',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 6.025-1.31-.452-3.79-4.214-6.876-8.768-6.876zm-2.924 5.232a.72.72 0 0 1 .717-.72.72.72 0 0 1 .718.72.72.72 0 0 1-.718.72.72.72 0 0 1-.717-.72zm5.674 0a.72.72 0 0 1 .717-.72.72.72 0 0 1 .717.72.72.72 0 0 1-.717.72.72.72 0 0 1-.717-.72zm7.735 4.55c0-3.564-3.51-6.446-7.835-6.446-4.325 0-7.835 2.882-7.835 6.446 0 1.948 1.03 3.703 2.646 4.895a.52.52 0 0 1 .188.586l-.344 1.304a.488.488 0 0 0-.042.188c0 .144.115.26.255.26a.289.289 0 0 0 .148-.047l1.677-.982a.762.762 0 0 1 .632-.086c.784.19 1.61.295 2.475.295 4.325 0 7.835-2.882 7.835-6.446zm-9.606-1.31a.635.635 0 0 1-.633-.634c0-.35.283-.633.633-.633.35 0 .634.283.634.633a.635.635 0 0 1-.634.633zm3.81 0a.635.635 0 0 1-.633-.634c0-.35.283-.633.633-.633.35 0 .634.283.634.633a.635.635 0 0 1-.634.633z"/>
        </svg>
      ),
      action: () => {
        navigator.clipboard.writeText('growingpool');
        alert(language === 'zh' ? '微信号已复制！' : 'WeChat ID copied!');
      }
    },
    {
      name: 'Telegram',
      handle: '@growingpool',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
      ),
      action: () => {
        window.open('https://t.me/growingpool', '_blank', 'noopener,noreferrer');
      }
    },
    {
      name: language === 'zh' ? '邮箱' : 'Email',
      handle: 'growingpool@gmail.com',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      ),
      action: () => {
        window.open('mailto:growingpool@gmail.com', '_blank', 'noopener,noreferrer');
      }
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, type: "spring", damping: 25, stiffness: 400 }}
            className="relative bg-white dark:bg-gray-900 border-2 border-black dark:border-white rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {language === 'zh' ? '联系我们' : 'Contact Us'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-white dark:text-black hover:bg-white/10 dark:hover:bg-black/10 rounded-lg p-1 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contact Options */}
            <div className="p-6 space-y-3">
              {contactOptions.map((option, index) => (
                <motion.button
                  key={option.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={option.action}
                  className="w-full flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white rounded-lg transition-all hover:shadow-md group"
                >
                  <div className="flex-shrink-0 text-black dark:text-white group-hover:scale-110 transition-transform">
                    {option.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-black dark:text-white">
                      {option.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {option.handle}
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {language === 'zh'
                  ? '选择您偏好的联系方式，我们会尽快回复您，请备注您希望咨询的问题，如“交易员训练”'
                  : 'Choose your preferred contact method and we will respond as soon as possible'
                }
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}