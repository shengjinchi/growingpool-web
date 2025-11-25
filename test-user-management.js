// 测试用户管理功能
import { USER_GROUPS } from './src/lib/user-management/types.js';
import { getCurrentUser, hasPermission } from './src/lib/user-management/userService.js';

console.log('Testing user management functionality...');
console.log('USER_GROUPS:', USER_GROUPS);
console.log('hasPermission function available:', typeof hasPermission === 'function');

// 测试当前用户
const currentUser = getCurrentUser();
console.log('Current user:', currentUser);
console.log('Has user_read permission:', hasPermission(currentUser, 'user_read'));