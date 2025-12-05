"use client";

import React, { useState, useEffect } from 'react';
import UserManagement from './components/UserManagement';
import TiantiPanel from './components/TiantiPanel';
import AdminLogin from './components/AdminLogin';
import Function1Panel from './components/Function1Panel';
import Function2Panel from './components/Function2Panel';
import Function3Panel from './components/Function3Panel';
import NotificationsPanel from '@/components/dashboard/NotificationsPanel';
import { useLanguage } from '@/contexts/LanguageContext';
import BrandName from '@/components/custom/BrandName';
import databaseAuth, { type AuthUser } from '@/lib/auth/database-auth';
import { hasPermission } from '@/lib/user-management/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function TradingDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isUserManagementVisible, setIsUserManagementVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        // Check localStorage for authentication flag
        const authenticated = localStorage.getItem('dashboard_authenticated');

        if (authenticated === 'true' && databaseAuth.isAuthenticated()) {
          // Verify session with server
          const result = await databaseAuth.verifySession();

          if (result.success && result.user) {
            setIsAuthenticated(true);
            setCurrentUser(result.user);
          } else {
            // Invalid session, clear authentication
            databaseAuth.logout();
            setIsAuthenticated(false);
            setCurrentUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('认证检查失败:', error);
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Listen for storage changes to update user state in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const user = databaseAuth.getCurrentUser();
      setCurrentUser(user);
      console.log('Dashboard - Storage change detected, updated user:', user?.username);
    };

    // Listen for storage events (for changes in other tabs)
    window.addEventListener('storage', handleStorageChange);

    // Custom event listener for same-tab changes
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      originalSetItem.call(this, key, value);
      if (key === 'current_user') {
        handleStorageChange();
      }
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  const handleLogout = () => {
    databaseAuth.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // 获取未读通知数量
  const fetchUnreadCount = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch(`/api/notifications?userId=${currentUser.id}&unreadOnly=true&limit=1`);

      if (!response.ok) {
        console.warn('Notifications API not available:', response.status);
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('Notifications API returned non-JSON response');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      // 静默处理错误，避免影响用户体验
      // console.error('获取未读通知数量失败:', error);
    }
  };

  // 定时刷新未读通知数量
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchUnreadCount();
      // 每30秒刷新一次未读通知数量
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">验证身份中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onAuthenticate={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              <BrandName /> {t('dashboard.title')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('dashboard.subtitle')}
            </p>
            {currentUser && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                当前用户: {currentUser.username} ({currentUser.user_groups?.name})
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {/* 用户管理按钮 - 仅对有权限的用户显示 */}
            {currentUser && hasPermission(currentUser as any, 'user_read') && (
              <button
                onClick={() => setIsUserManagementVisible(!isUserManagementVisible)}
                className={`px-4 py-2 text-sm font-medium transition-all rounded ${
                  isUserManagementVisible
                    ? 'bg-yellow-600 text-white border-yellow-600'
                    : 'text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-yellow-600 dark:hover:border-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-400'
                }`}
              >
                <span className="mr-1">👥</span>
                {t('dashboard.tab.users')}
              </button>
            )}

            {/* 通知按钮 */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center gap-2 rounded"
              >
                <span className="text-xl">🔔</span>
                通知中心
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-red-600 dark:hover:border-red-400 hover:text-red-600 dark:hover:text-red-400 transition-all rounded"
            >
              {t('dashboard.logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 用户管理页面 - 如果有权限且按钮被点击则显示在tabs上方 */}
        {currentUser && hasPermission(currentUser as any, 'user_read') && isUserManagementVisible && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span>👥</span>
                {t('dashboard.tab.users')}
              </h2>
            </div>
            <div className="space-y-6">
              <UserManagement />
            </div>
          </div>
        )}

        {/* Tabs for other functions */}
        <Tabs defaultValue="tianti" className="space-y-6">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="function1">
                <span className="mr-2">🔧</span>
                {t('dashboard.tab.function1')}
              </TabsTrigger>
              <TabsTrigger value="function2">
                <span className="mr-2">⚙️</span>
                {t('dashboard.tab.function2')}
              </TabsTrigger>
              <TabsTrigger value="function3">
                <span className="mr-2">🚀</span>
                {t('dashboard.tab.function3')}
              </TabsTrigger>
              <TabsTrigger value="tianti">
                <span className="mr-2">🏆</span>
                {t('dashboard.tab.tianti')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tianti" className="space-y-6">
            <TiantiPanel />
          </TabsContent>

          <TabsContent value="function1" className="space-y-6">
            <Function1Panel />
          </TabsContent>

          <TabsContent value="function2" className="space-y-6">
            <Function2Panel />
          </TabsContent>

          <TabsContent value="function3" className="space-y-6">
            <Function3Panel />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="font-semibold text-gray-900 dark:text-white">{t('dashboard.footer.warning')}</p>
          <p className="mt-1">{t('dashboard.footer.copyright')}</p>
        </div>
      </div>

      {/* 通知面板 */}
      {currentUser && (
        <NotificationsPanel
          currentUserId={currentUser.id}
          isOpen={isNotificationsOpen}
          onClose={() => {
            setIsNotificationsOpen(false);
            // 关闭面板后刷新未读数量
            fetchUnreadCount();
          }}
        />
      )}
    </div>
  );
}