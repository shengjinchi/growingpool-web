import type { User, UserGroup } from './types';
import { USER_GROUPS } from './types';

// Default admin user
const DEFAULT_USERS: User[] = [
  {
    id: '1',
    username: 'noahzeng',
    password: '19961203',
    userGroup: USER_GROUPS[0], // admin
    status: 'active',
    createdAt: new Date(),
    lastLogin: undefined,
    createdBy: 'system',
  },
];

// Local storage key
const STORAGE_KEY = 'user_management_data';
const CURRENT_USER_KEY = 'current_user';

// Initialize storage with default users if empty
function initializeStorage(): void {
  if (typeof window === 'undefined') return;

  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  }
}

// Get all users from localStorage
function getUsersFromStorage(): User[] {
  if (typeof window === 'undefined') return DEFAULT_USERS;

  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return DEFAULT_USERS;

  try {
    const users = JSON.parse(data);
    // Convert string dates back to Date objects
    return users.map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
    }));
  } catch {
    return DEFAULT_USERS;
  }
}

// Save users to localStorage
function saveUsersToStorage(users: User[]): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// Generate random password
function generateRandomPassword(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Authentication functions
export function authenticateUser(username: string, password: string): { success: boolean; user?: User; error?: string } {
  const users = getUsersFromStorage();
  const user = users.find(u => u.username === username && u.password === password);

  if (user && user.status === 'active') {
    // Update last login
    user.lastLogin = new Date();
    saveUsersToStorage(users);

    // Store current user
    setCurrentUser(user);

    return { success: true, user };
  } else if (user && user.status !== 'active') {
    return { success: false, error: '账户已被禁用' };
  } else {
    return { success: false, error: '用户名或密码错误' };
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;

  const userData = localStorage.getItem(CURRENT_USER_KEY);
  if (!userData) return null;

  try {
    const user = JSON.parse(userData);
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
    };
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(CURRENT_USER_KEY);
}

// User management functions
export function getAllUsers(): User[] {
  return getUsersFromStorage();
}

export function createUser(username: string, userGroupId: string, createdBy: string): { success: boolean; password?: string; error?: string } {
  const users = getUsersFromStorage();

  // Check if username already exists
  if (users.some(u => u.username === username)) {
    return { success: false, error: '用户名已存在' };
  }

  // Find user group
  const userGroup = USER_GROUPS.find(g => g.id === userGroupId);
  if (!userGroup) {
    return { success: false, error: '用户组不存在' };
  }

  // Generate password
  const password = generateRandomPassword();

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    username,
    password,
    userGroup,
    status: 'active',
    createdAt: new Date(),
    createdBy,
  };

  // Save to storage
  users.push(newUser);
  saveUsersToStorage(users);

  return { success: true, password };
}

export function updateUser(username: string, updates: Partial<Omit<User, 'id' | 'username' | 'createdAt' | 'createdBy'>>): { success: boolean; error?: string } {
  const users = getUsersFromStorage();
  const userIndex = users.findIndex(u => u.username === username);

  if (userIndex === -1) {
    return { success: false, error: '用户不存在' };
  }

  // Update user
  users[userIndex] = { ...users[userIndex], ...updates };
  saveUsersToStorage(users);

  return { success: true };
}

export function deleteUser(username: string): { success: boolean; error?: string } {
  const users = getUsersFromStorage();
  const userIndex = users.findIndex(u => u.username === username);

  if (userIndex === -1) {
    return { success: false, error: '用户不存在' };
  }

  // Remove user
  users.splice(userIndex, 1);
  saveUsersToStorage(users);

  return { success: true };
}

export function resetUserPassword(username: string): { success: boolean; password?: string; error?: string } {
  const users = getUsersFromStorage();
  const user = users.find(u => u.username === username);

  if (!user) {
    return { success: false, error: '用户不存在' };
  }

  // Generate new password
  const password = generateRandomPassword();
  user.password = password;

  saveUsersToStorage(users);

  return { success: true, password };
}

export { generateRandomPassword };