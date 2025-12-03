import type { User, UserGroup } from '@/lib/user-management/types';

export interface AuthUser extends Omit<User, 'userGroup'> {
  user_group_id: string;
  user_groups: UserGroup;
}

export interface LoginResponse {
  success: boolean;
  user?: AuthUser;
  sessionToken?: string;
  error?: string;
  message?: string;
}

export interface VerifyResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
  message?: string;
}

class DatabaseAuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '');
  }

  // 登录
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // 存储会话信息
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_session_token', data.sessionToken);
          localStorage.setItem('auth_username', data.user.username);
          localStorage.setItem('current_user', JSON.stringify(data.user));
        }
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '登录失败'
      };
    }
  }

  // 验证会话
  async verifySession(): Promise<VerifyResponse> {
    try {
      if (typeof window === 'undefined') {
        return { success: false, error: '服务器端不支持' };
      }

      const username = localStorage.getItem('auth_username');
      const sessionToken = localStorage.getItem('auth_session_token');

      if (!username || !sessionToken) {
        return { success: false, error: '未找到会话信息' };
      }

      const response = await fetch(`${this.baseUrl}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${username}`,
        },
        body: JSON.stringify({ sessionToken }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        // 更新本地存储的用户信息
        localStorage.setItem('current_user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '会话验证失败'
      };
    }
  }

  // 登出
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_session_token');
      localStorage.removeItem('auth_username');
      localStorage.removeItem('current_user');
      localStorage.removeItem('dashboard_authenticated');
      localStorage.removeItem('admin_username');
    }
  }

  // 获取当前用户
  getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;

    const userData = localStorage.getItem('current_user');
    if (!userData) return null;

    try {
      const user = JSON.parse(userData);
      return {
        ...user,
        createdAt: new Date(user.created_at),
        lastLogin: user.last_login ? new Date(user.last_login) : undefined,
        userGroup: user.user_groups,
      };
    } catch {
      return null;
    }
  }

  // 检查用户权限
  hasPermission(user: AuthUser, permission: string): boolean {
    if (!user?.user_groups?.permissions) return false;

    try {
      const permissions = Array.isArray(user.user_groups.permissions)
        ? user.user_groups.permissions
        : JSON.parse(user.user_groups.permissions);

      return permissions.includes(permission);
    } catch {
      return false;
    }
  }

  // 获取会话token
  getSessionToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_session_token');
  }

  // 检查是否已认证
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;

    return !!(localStorage.getItem('auth_session_token') &&
             localStorage.getItem('auth_username') &&
             localStorage.getItem('current_user'));
  }
}

// 创建单例
export const databaseAuth = new DatabaseAuthService();
export default databaseAuth;