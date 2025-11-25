export interface User {
  id: string;
  username: string;
  password: string;
  userGroup: UserGroup;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  lastLogin?: Date;
  createdBy?: string;
}

export interface UserGroup {
  id: string;
  displayName: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export const USER_GROUPS: UserGroup[] = [
  {
    id: 'admin',
    displayName: '管理员',
    permissions: [
      { id: 'user_read', name: '查看用户', description: '可以查看用户列表' },
      { id: 'user_write', name: '管理用户', description: '可以创建、修改用户' },
      { id: 'user_delete', name: '删除用户', description: '可以删除用户' },
      { id: 'system_admin', name: '系统管理', description: '完全系统管理权限' },
    ],
  },
  {
    id: 'trader',
    displayName: '交易员',
    permissions: [
      { id: 'trade_read', name: '查看交易', description: '可以查看交易数据' },
      { id: 'trade_write', name: '执行交易', description: '可以执行交易操作' },
    ],
  },
  {
    id: 'observer',
    displayName: '观察者',
    permissions: [
      { id: 'view_dashboard', name: '查看仪表板', description: '可以查看仪表板数据' },
    ],
  },
];

export function hasPermission(user: User, permissionId: string): boolean {
  return user.userGroup.permissions.some(p => p.id === permissionId);
}