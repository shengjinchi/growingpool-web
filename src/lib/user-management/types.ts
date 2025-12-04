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
  name: string;
  displayName?: string; // 兼容原有字段
  permissions: Permission[] | string; // 可能是数组或JSON字符串
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export const USER_GROUPS: UserGroup[] = [
  {
    id: 'admin',
    name: '管理员',
    displayName: '管理员',
    permissions: [
      { id: 'user_read', name: '查看用户', description: '可以查看用户列表' },
      { id: 'user_write', name: '管理用户', description: '可以创建、修改用户' },
      { id: 'user_delete', name: '删除用户', description: '可以删除用户' },
      { id: 'system_admin', name: '系统管理', description: '完全系统管理权限' },
      { id: 'tianti_read', name: '查看天梯', description: '可以查看天梯交易信号' },
    ],
  },
  {
    id: 'trader',
    name: '交易员',
    displayName: '交易员',
    permissions: [
      { id: 'trade_read', name: '查看交易', description: '可以查看交易数据' },
      { id: 'trade_write', name: '执行交易', description: '可以执行交易操作' },
      { id: 'tianti_read', name: '查看天梯', description: '可以查看天梯交易信号' },
    ],
  },
  {
    id: 'observer',
    name: '观察者',
    displayName: '观察者',
    permissions: [
      { id: 'view_dashboard', name: '查看仪表板', description: '可以查看仪表板数据' },
      { id: 'tianti_read', name: '查看天梯', description: '可以查看天梯交易信号' },
    ],
  },
  {
    id: 'new_student',
    name: '新学员',
    displayName: '新学员',
    permissions: [
      { id: 'view_dashboard', name: '查看仪表板', description: '可以查看仪表板数据' },
    ],
  },
];

export function hasPermission(user: User, permissionId: string): boolean {
  // Handle both old format (userGroup) and new format (user_groups)
  const userGroup = (user as any).user_groups || user.userGroup;
  if (!userGroup) return false;

  // Handle both array format and object format
  const permissions = userGroup.permissions;
  if (!permissions) return false;

  // If permissions is a string (from database JSON), parse it
  if (typeof permissions === 'string') {
    try {
      const parsedPermissions = JSON.parse(permissions);
      return Array.isArray(parsedPermissions) && parsedPermissions.includes(permissionId);
    } catch {
      return false;
    }
  }

  // If permissions is an array of objects (old format)
  if (Array.isArray(permissions)) {
    return permissions.some((p: any) =>
      typeof p === 'string' ? p === permissionId : p.id === permissionId
    );
  }

  return false;
}