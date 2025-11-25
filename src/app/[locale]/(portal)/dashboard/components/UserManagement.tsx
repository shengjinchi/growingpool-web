"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  generateRandomPassword,
  getAllUsers,
  createUser,
  deleteUser,
  resetUserPassword,
  updateUser,
  getCurrentUser,
  authenticateUser,
  setCurrentUser,
  logoutUser
} from '@/lib/user-management/userService';
import { USER_GROUPS, type User, type UserGroup, hasPermission } from '@/lib/user-management/types';

export default function UserManagement() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 创建用户表单状态
  const [newUsername, setNewUsername] = useState('');
  const [newUserGroup, setNewUserGroup] = useState('observer');
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadUsers();
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const loadUsers = () => {
    setUsers(getAllUsers());
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCreateUser = () => {
    if (!currentUser || !hasPermission(currentUser, 'user_write')) {
      showMessage('error', '没有创建用户的权限');
      return;
    }

    if (!newUsername.trim()) {
      showMessage('error', '请输入用户名');
      return;
    }

    const result = createUser(newUsername.trim(), newUserGroup, currentUser?.username || 'system');

    if (result.success) {
      showMessage('success', `用户 ${newUsername} 创建成功，密码: ${result.password}`);
      setNewUsername('');
      setNewUserGroup('observer');
      setIsCreateModalOpen(false);
      loadUsers();
    } else {
      showMessage('error', result.error || '创建用户失败');
    }
  };

  const handleDeleteUser = (username: string) => {
    if (!currentUser || !hasPermission(currentUser, 'user_delete')) {
      showMessage('error', '没有删除用户的权限');
      return;
    }

    if (!confirm(`确定要删除用户 ${username} 吗？`)) {
      return;
    }

    if (currentUser && username === currentUser.username) {
      showMessage('error', '不能删除自己的账户');
      return;
    }

    const result = deleteUser(username);

    if (result.success) {
      showMessage('success', `用户 ${username} 删除成功`);
      setSelectedUser(null);
      loadUsers();
    } else {
      showMessage('error', result.error || '删除用户失败');
    }
  };

  const handleResetPassword = (username: string) => {
    if (!currentUser || !hasPermission(currentUser, 'user_write')) {
      showMessage('error', '没有重置密码的权限');
      return;
    }

    const result = resetUserPassword(username);

    if (result.success && result.password) {
      showMessage('success', `用户 ${username} 的新密码: ${result.password}`);
      loadUsers();
    } else {
      showMessage('error', result.error || '重置密码失败');
    }
  };

  const handleToggleUserStatus = (user: User) => {
    if (!currentUser || !hasPermission(currentUser, 'user_write')) {
      showMessage('error', '没有修改用户的权限');
      return;
    }

    if (currentUser && user.username === currentUser.username) {
      showMessage('error', '不能修改自己的账户状态');
      return;
    }

    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const result = updateUser(user.username, { status: newStatus });

    if (result.success) {
      showMessage('success', `用户 ${user.username} 状态已更新为${newStatus === 'active' ? '启用' : '禁用'}`);
      loadUsers();
    } else {
      showMessage('error', result.error || '更新用户状态失败');
    }
  };

  const getUserGroupDisplayName = (userGroup: UserGroup) => {
    switch (userGroup.id) {
      case 'admin': return '管理员';
      case 'trader': return '交易员';
      case 'observer': return '观察者';
      default: return userGroup.displayName;
    }
  };

  const getStatusBadgeClass = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: User['status']) => {
    switch (status) {
      case 'active': return '启用';
      case 'inactive': return '禁用';
      case 'suspended': return '暂停';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:text-red-200'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('userManagement.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('userManagement.subtitle')}
          </p>
        </div>

        {currentUser && hasPermission(currentUser, 'user_write') && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('userManagement.createUser')}
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('userManagement.table.username')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('userManagement.table.userGroup')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('userManagement.table.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('userManagement.table.createdAt')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('userManagement.table.lastLogin')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('userManagement.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.username}
                      {currentUser && user.username === currentUser.username && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                          当前用户
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      创建者: {user.createdBy || '系统'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {getUserGroupDisplayName(user.userGroup)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(user.status)}`}>
                      {getStatusText(user.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.lastLogin ? user.lastLogin.toLocaleDateString() : '从未登录'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {currentUser && hasPermission(currentUser, 'user_write') && (
                        <button
                          onClick={() => handleToggleUserStatus(user)}
                          disabled={currentUser ? user.username === currentUser.username : false}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {user.status === 'active' ? '禁用' : '启用'}
                        </button>
                      )}
                      <button
                        onClick={() => handleResetPassword(user.username)}
                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors"
                      >
                        重置密码
                      </button>
                      {currentUser && user.username !== user.username && hasPermission(currentUser, 'user_delete') && (
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                          详情
                        </button>
                      )}
                      {currentUser && user.username !== currentUser.username && hasPermission(currentUser, 'user_delete') && (
                        <button
                          onClick={() => handleDeleteUser(user.username)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          删除
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsCreateModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('userManagement.createModal.title')}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('userManagement.createModal.username')}
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-black dark:bg-gray-700 dark:text-white"
                    placeholder={t('userManagement.createModal.usernamePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('userManagement.createModal.userGroup')}
                  </label>
                  <select
                    value={newUserGroup}
                    onChange={(e) => setNewUserGroup(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-black dark:bg-gray-700 dark:text-white"
                  >
                    {USER_GROUPS.map((group) => (
                      <option key={group.id} value={group.id}>
                        {getUserGroupDisplayName(group)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t('userManagement.createModal.cancel')}
                </button>
                <button
                  onClick={handleCreateUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('userManagement.createModal.create')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}