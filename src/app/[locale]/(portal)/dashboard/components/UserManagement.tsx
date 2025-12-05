"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/contexts/LanguageContext';
import databaseAuth, { type AuthUser } from '@/lib/auth/database-auth';
import { USER_GROUPS, type UserGroup, hasPermission } from '@/lib/user-management/types';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

export default function UserManagement() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswords, setShowPasswords] = useState(true);

  // 创建用户表单状态
  const [newUsername, setNewUsername] = useState('');
  const [newUserGroup, setNewUserGroup] = useState('viewer');
  const [newPassword, setNewPassword] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  // 发送通知状态
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationTarget, setNotificationTarget] = useState<AuthUser | null>(null);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'info' | 'warning' | 'error' | 'success'>('info');

  // 调整用户组状态
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [editUserTarget, setEditUserTarget] = useState<AuthUser | null>(null);
  const [editUserGroup, setEditUserGroup] = useState('');

  // 存储创建用户的密码信息
  const [userPasswords, setUserPasswords] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    loadUsers();
    const user = databaseAuth.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();

      if (data.success) {
        setUsers(data.users || []);
      } else {
        showMessage('error', '加载用户失败: ' + data.error);
      }
    } catch (error) {
      console.error('加载用户失败:', error);
      showMessage('error', '加载用户失败');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 15000);
  };

  const handleCreateUser = async () => {
    if (!currentUser || !hasPermission(currentUser as any, 'user_write')) {
      showMessage('error', '没有创建用户的权限');
      return;
    }

    if (!newUsername.trim()) {
      showMessage('error', '用户名不能为空');
      return;
    }

    try {
      // 生成密码
      const password = newPassword || generateRandomPassword(8);

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUsername.trim(),
          password,
          userGroupId: newUserGroup,
          status: 'active',
          createdBy: currentUser.username
        }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', `用户 ${data.user.username} 创建成功，密码: ${password}`);

        // 保存密码到本地状态中
        setUserPasswords(prev => {
          const newMap = new Map(prev);
          newMap.set(data.user.id, password);
          return newMap;
        });

        loadUsers();
        setIsCreateModalOpen(false);
        setNewUsername('');
        setNewPassword('');
      } else {
        showMessage('error', data.error || '创建用户失败');
      }
    } catch (error) {
      console.error('创建用户失败:', error);
      showMessage('error', '创建用户失败');
    }
  };

  const handleDeleteUser = async (user: AuthUser) => {
    if (!currentUser || !hasPermission(currentUser as any, 'user_delete')) {
      showMessage('error', '没有删除用户的权限');
      return;
    }

    if (user.username === currentUser.username) {
      showMessage('error', '不能删除自己的账户');
      return;
    }

    if (!confirm(`确定要删除用户 ${user.username} 吗？`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users?id=${user.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', `用户 ${user.username} 已删除`);
        loadUsers();
      } else {
        showMessage('error', data.error || '删除用户失败');
      }
    } catch (error) {
      console.error('删除用户失败:', error);
      showMessage('error', '删除用户失败');
    }
  };

  const handleResetPassword = async (user: AuthUser) => {
    if (!currentUser || !hasPermission(currentUser as any, 'user_write')) {
      showMessage('error', '没有重置密码的权限');
      return;
    }

    try {
      const newPassword = generateRandomPassword(8);

      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', `用户 ${user.username} 的密码已重置为: ${newPassword}`);

        // 保存新密码到本地状态中
        if (data.newPassword) {
          setUserPasswords(prev => {
            const newMap = new Map(prev);
            newMap.set(user.id, data.newPassword);
            return newMap;
          });
        }
      } else {
        showMessage('error', data.error || '重置密码失败');
      }
    } catch (error) {
      console.error('重置密码失败:', error);
      showMessage('error', '重置密码失败');
    }
  };

  const handleSendNotification = async () => {
    if (!currentUser || !hasPermission(currentUser as any, 'user_write')) {
      showMessage('error', '没有发送通知的权限');
      return;
    }

    if (!notificationTarget || !notificationTitle.trim() || !notificationMessage.trim()) {
      showMessage('error', '请填写完整的通知信息');
      return;
    }

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: notificationTarget.id,
          title: notificationTitle.trim(),
          message: notificationMessage.trim(),
          type: notificationType,
          createdBy: currentUser.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', `通知已发送给 ${notificationTarget.username}`);
        setIsNotificationModalOpen(false);
        setNotificationTarget(null);
        setNotificationTitle('');
        setNotificationMessage('');
        setNotificationType('info');
      } else {
        showMessage('error', data.error || '发送通知失败');
      }
    } catch (error) {
      console.error('发送通知失败:', error);
      showMessage('error', '发送通知失败');
    }
  };

  const handleEditUserGroup = async () => {
    if (!currentUser || !hasPermission(currentUser as any, 'user_write')) {
      showMessage('error', '没有修改用户组的权限');
      return;
    }

    if (!editUserTarget || !editUserGroup) {
      showMessage('error', '请选择用户组');
      return;
    }

    if (editUserTarget.username === currentUser.username) {
      showMessage('error', '不能修改自己的用户组');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: editUserTarget.id,
          userGroupId: editUserGroup
        }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', `用户 ${editUserTarget.username} 的用户组已更新为: ${USER_GROUPS.find(g => g.id === editUserGroup)?.name}`);
        loadUsers();
        setIsEditGroupModalOpen(false);
        setEditUserTarget(null);
        setEditUserGroup('');
      } else {
        showMessage('error', data.error || '更新用户组失败');
      }
    } catch (error) {
      console.error('更新用户组失败:', error);
      showMessage('error', '更新用户组失败');
    }
  };

  const openEditGroupModal = (user: AuthUser) => {
    setEditUserTarget(user);
    setEditUserGroup(user.user_groups?.id || '');
    setIsEditGroupModalOpen(true);
  };

  const openNotificationModal = (user: AuthUser) => {
    setNotificationTarget(user);
    setNotificationTitle('');
    setNotificationMessage('');
    setNotificationType('info');
    setIsNotificationModalOpen(true);
  };

  const togglePasswordVisibility = (userId: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(userId)) {
      newVisible.delete(userId);
    } else {
      newVisible.add(userId);
    }
    setVisiblePasswords(newVisible);
  };

  const getUserGroupDisplay = (userGroup: any) => {
    if (typeof userGroup === 'string') {
      const group = USER_GROUPS.find(g => g.id === userGroup);
      return group ? group.displayName : userGroup;
    }
    return userGroup?.name || '未知';
  };

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
      case 'inactive':
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900';
      case 'suspended':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 消息提示 */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 头部操作 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          用户管理
        </h2>
        <div className="flex items-center space-x-4">
          {currentUser && hasPermission(currentUser as any, 'user_write') && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900"
              size="default"
            >
              创建用户
            </Button>
          )}
        </div>
      </div>

      {/* 用户列表 */}
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  用户名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  密码
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  用户组
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => {
                const userPassword = userPasswords.get(user.id);
                return (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {userPassword ? (
                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono">
                          {userPassword}
                        </code>
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-xs">
                        密码未记录
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {getUserGroupDisplay(user.user_groups)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserStatusColor(user.status)}`}>
                      {user.status === 'active' ? '活跃' : user.status === 'inactive' ? '未激活' : '暂停'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt || user.created_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {currentUser && hasPermission(currentUser as any, 'user_write') && user.username !== currentUser.username && (
                      <ButtonGroup>
                        <Button
                          onClick={() => openEditGroupModal(user)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-1.5 text-xs"
                        >
                          调整用户组
                        </Button>
                        <Button
                          onClick={() => openNotificationModal(user)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-1.5 text-xs"
                        >
                          发送通知
                        </Button>
                        <Button
                          onClick={() => handleResetPassword(user)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-1.5 text-xs"
                        >
                          重置密码
                        </Button>
                        {currentUser && hasPermission(currentUser as any, 'user_delete') && (
                          <Button
                            onClick={() => handleDeleteUser(user)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 px-3 py-1.5 text-xs"
                          >
                            删除
                          </Button>
                        )}
                      </ButtonGroup>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 创建用户弹窗 */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              创建新用户
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  用户名
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="输入用户名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  密码 (留空自动生成)
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="留空自动生成8位密码"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  用户组
                </label>
                <select
                  value={newUserGroup}
                  onChange={(e) => setNewUserGroup(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="new_student">新学员</option>
                  <option value="observer">观察者</option>
                  <option value="trader">交易员</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setNewUsername('');
                  setNewPassword('');
                }}
                variant="outline"
              >
                取消
              </Button>
              <Button
                onClick={handleCreateUser}
                className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900"
              >
                创建
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 发送通知弹窗 */}
      {isNotificationModalOpen && notificationTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              发送通知给 {notificationTarget.username}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  通知标题
                </label>
                <input
                  type="text"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="输入通知标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  通知内容
                </label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent dark:bg-gray-700 dark:text-white h-32 resize-none"
                  placeholder="输入通知内容"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  通知类型
                </label>
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="info">信息</option>
                  <option value="success">成功</option>
                  <option value="warning">警告</option>
                  <option value="error">错误</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                onClick={() => {
                  setIsNotificationModalOpen(false);
                  setNotificationTarget(null);
                  setNotificationTitle('');
                  setNotificationMessage('');
                  setNotificationType('info');
                }}
                variant="outline"
              >
                取消
              </Button>
              <Button
                onClick={handleSendNotification}
                className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900"
              >
                发送通知
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 调整用户组弹窗 */}
      {isEditGroupModalOpen && editUserTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              调整用户组 - {editUserTarget.username}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  当前用户组
                </label>
                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white">
                  {getUserGroupDisplay(editUserTarget.user_groups)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  新用户组
                </label>
                <select
                  value={editUserGroup}
                  onChange={(e) => setEditUserGroup(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">请选择用户组</option>
                  <option value="new_student">新学员</option>
                  <option value="observer">观察者</option>
                  <option value="trader">交易员</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  <strong>权限说明：</strong><br/>
                  • 新学员：仅查看仪表板<br/>
                  • 观察者：查看仪表板 + 天梯<br/>
                  • 交易员：查看仪表板 + 天梯 + 交易权限<br/>
                  • 管理员：完全系统管理权限
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                onClick={() => {
                  setIsEditGroupModalOpen(false);
                  setEditUserTarget(null);
                  setEditUserGroup('');
                }}
                variant="outline"
              >
                取消
              </Button>
              <Button
                onClick={handleEditUserGroup}
                className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900"
              >
                更新用户组
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 工具函数
function generateRandomPassword(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}