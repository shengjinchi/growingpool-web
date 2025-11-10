"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface EducationPasswordProtectionProps {
  onAuthenticated: () => void;
}

const CORRECT_PASSWORD = 'growingpool2025';

export default function EducationPasswordProtection({ onAuthenticated }: EducationPasswordProtectionProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const { language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === CORRECT_PASSWORD) {
      onAuthenticated();
    } else {
      setError(true);
      setAttempts(attempts + 1);

      // Lock after 3 failed attempts
      if (attempts >= 2) {
        setIsLocked(true);
      }
    }
  };

  const handleEmailContact = () => {
    window.open('mailto:growingpool@gmail.com?subject=' + encodeURIComponent(
      language === 'zh' ? '教育中心密码申请 - 申请获取访问权限' : 'Education Center Password Request - Request Access'
    ), '_blank');
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-black dark:bg-white flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-900 border-2 border-red-500 rounded-lg p-8 text-center"
        >
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            {language === 'zh' ? '访问被锁定' : 'Access Locked'}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {language === 'zh'
              ? '您已连续多次输入错误密码。为了保护内容安全，访问已被锁定。'
              : 'You have entered the wrong password multiple times. Access has been locked to protect the content.'
            }
          </p>
          <button
            onClick={handleEmailContact}
            className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold border border-yellow-600 hover:border-yellow-500 transition-all rounded-lg"
          >
            {language === 'zh' ? '联系我们获取帮助' : 'Contact Us for Help'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black dark:bg-white flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Lock Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 8h-1V6a5 5 0 0 0-5-5H7a5 5 0 0 0-5 5v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2v2a5 5 0 0 0 5 5h5a5 5 0 0 0 5-5v-2h1a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zM7 11h10v7H7V11z"/>
          </svg>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white dark:text-black mb-3">
            {language === 'zh' ? '教育中心' : 'Education Center'}
          </h1>
          <p className="text-gray-300 dark:text-gray-700 text-lg">
            {language === 'zh'
              ? '需要密码才能访问此内容'
              : 'Password required to access this content'
            }
          </p>
        </motion.div>

        {/* Password Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6"
        >
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
              {language === 'zh' ? '输入密码' : 'Enter Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder={language === 'zh' ? '请输入密码' : 'Please enter password'}
              disabled={isLocked}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <p className="text-red-600 dark:text-red-400 text-sm">
                {language === 'zh' ? '密码错误，请重试' : 'Incorrect password, please try again'}
              </p>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLocked || !password}
            className="w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold border-2 border-black dark:border-white hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
          >
            {language === 'zh' ? '解锁内容' : 'Unlock Content'}
          </button>
        </motion.form>

        {/* Email Contact Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-400 dark:text-gray-600 text-sm mb-4">
            {language === 'zh'
              ? '不知道密码？联系我们获取访问权限'
              : 'Don\'t know the password? Contact us to get access'
            }
          </p>
          <button
            onClick={handleEmailContact}
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-medium border border-yellow-600 hover:border-yellow-500 transition-all rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {language === 'zh' ? '发送邮件' : 'Send Email'}
          </button>
        </motion.div>

        {/* Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-200 rounded-full">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-400 dark:text-gray-600 text-xs">
              {language === 'zh' ? '提示：密码由数字和字母组成' : 'Hint: Password contains numbers and letters'}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}