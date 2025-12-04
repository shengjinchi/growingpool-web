"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read_status: boolean;
  created_at: string;
  read_at?: string;
  sender?: {
    username: string;
  };
}

interface NotificationsPanelProps {
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ currentUserId, isOpen, onClose }: NotificationsPanelProps) {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  // 加载通知列表
  const loadNotifications = async () => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/notifications?userId=${currentUserId}&limit=20`);
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } else {
        console.error('加载通知失败:', data.error);
      }
    } catch (error) {
      console.error('加载通知失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 标记通知为已读
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId
              ? { ...notif, read_status: true, read_at: new Date().toISOString() }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('标记通知失败:', error);
    }
  };

  // 标记所有通知为已读
  const markAllAsRead = async () => {
    if (!currentUserId) return;

    setMarkingAll(true);
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markAll: true, userId: currentUserId }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif => ({
            ...notif,
            read_status: true,
            read_at: new Date().toISOString()
          }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('标记所有通知失败:', error);
    } finally {
      setMarkingAll(false);
    }
  };

  // 获取通知类型样式
  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      default:
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
    }
  };

  // 获取通知图标
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    return `${diffDays}天前`;
  };

  // 当面板打开时加载通知
  useEffect(() => {
    if (isOpen && currentUserId) {
      loadNotifications();
    }
  }, [isOpen, currentUserId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-black dark:bg-white text-white dark:text-black p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  通知中心 {unreadCount > 0 && `(${unreadCount})`}
                </h2>
                <button
                  onClick={onClose}
                  className="text-white dark:text-black hover:opacity-70 transition-opacity"
                >
                  ✕
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={markingAll}
                  className="w-full bg-white dark:bg-black text-black dark:text-white py-2 px-4 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {markingAll ? '标记中...' : '全部标记为已读'}
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="h-[calc(100vh-200px)] overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <div className="text-4xl mb-4">📭</div>
                  <p>暂无通知</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                        getNotificationStyles(notification.type)
                      } ${
                        !notification.read_status ? 'font-semibold' : ''
                      }`}
                      onClick={() => !notification.read_status && markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                              {notification.title}
                            </h3>
                            {!notification.read_status && (
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                未读
                              </span>
                            )}
                          </div>

                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 whitespace-pre-line">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatTime(notification.created_at)}</span>
                            {notification.sender && notification.sender.username ? (
                              <span>来自: {notification.sender.username}</span>
                            ) : (
                              <span>系统通知</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}