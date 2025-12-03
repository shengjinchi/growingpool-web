"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import UserManagement from './components/UserManagement';
import TiantiPanel from './components/TiantiPanel';
import AdminLogin from './components/AdminLogin';
import { useLanguage } from '@/contexts/LanguageContext';
import BrandName from '@/components/custom/BrandName';
import databaseAuth, { type AuthUser } from '@/lib/auth/database-auth';
import { hasPermission } from '@/lib/user-management/types';

export default function TradingDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
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
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            {t('dashboard.logout')}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="tianti" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="tianti">
              {t('dashboard.tab.tianti')}
            </TabsTrigger>
            {currentUser && hasPermission(currentUser as any, 'user_read') ? (
              <TabsTrigger value="users">
                {t('dashboard.tab.users')}
              </TabsTrigger>
            ) : (
              <div className="opacity-0 pointer-events-none">
                {/* Debug: Current user: {currentUser?.username}, Has user_read: {currentUser ? hasPermission(currentUser, 'user_read') : false} */}
                Debug - User: {currentUser?.username || 'null'}, user_read: {currentUser ? hasPermission(currentUser as any, 'user_read') : false}
              </div>
            )}
          </TabsList>

          <TabsContent value="tianti" className="space-y-6">
            <TiantiPanel />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
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
    </div>
  );
}