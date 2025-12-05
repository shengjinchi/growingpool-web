"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  email: string;
  messageKey: string;
}

// 生成随机Gmail邮箱（中间部分用*替代）
function generateRandomEmail(): string {
  const prefixes = ['user', 'trader', 'investor', 'crypto', 'finance', 'bitcoin', 'eth', 'trade', 'market', 'pro'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomNum = Math.floor(Math.random() * 9999);

  // 邮箱格式: us***23@gmail.com
  const visibleStart = prefix.substring(0, 2);
  const visibleEnd = randomNum.toString().substring(0, 2);

  return `${visibleStart}***${visibleEnd}@gmail.com`;
}

// 随机消息内容 - 返回翻译key
function getRandomMessageKey(): string {
  const messageKeys = [
    'notification.message1',
    'notification.message2'
  ];
  return messageKeys[Math.floor(Math.random() * messageKeys.length)];
}

export default function SubscriptionNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const showNotification = () => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        email: generateRandomEmail(),
        messageKey: getRandomMessageKey(),
      };

      setNotifications(prev => [...prev, newNotification]);

      // 4秒后自动移除通知
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 4000);
    };

    // 首次延迟2秒显示
    const initialTimeout = setTimeout(showNotification, 2000);

    // 之后每8-15秒随机显示一次
    const interval = setInterval(() => {
      showNotification();
    }, Math.random() * 7000 + 8000); // 8-15秒随机间隔

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20, x: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              x: 0,
            }}
            exit={{ opacity: 0, y: 20, x: -20 }}
            transition={{
              duration: 0.3,
            }}
            className="mb-3 pointer-events-auto"
          >
            <Card className="bg-white dark:bg-gray-900 border-2 border-amber-500/30 shadow-xl max-w-sm">

              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* NEW 标签 */}
                  <Badge
                    variant="default"
                    className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-2 py-1 h-auto flex-shrink-0"
                  >
                    NEW
                  </Badge>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate mb-1">
                      {notification.email}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t(notification.messageKey)}
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      {t('notification.time')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
