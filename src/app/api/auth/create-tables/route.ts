import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('缺少 Supabase 环境变量');
}

// 创建服务端客户端
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    console.log('开始创建用户表...');

    // 首先尝试直接插入数据到用户组表（如果表存在）
    const { error: groupsInsertError, data: existingGroups } = await supabase
      .from('user_groups')
      .select('*')
      .limit(1);

    const tablesExist = !groupsInsertError;

    if (!tablesExist) {
      console.log('表不存在，请通过Supabase Dashboard创建表');
      return NextResponse.json({
        success: false,
        message: '表不存在，请手动创建',
        sql: `
-- 请在 Supabase Dashboard 的 SQL Editor 中执行以下SQL:

-- 创建用户组表
CREATE TABLE user_groups (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户表
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_group_id VARCHAR(50) REFERENCES user_groups(id),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  created_by VARCHAR(50)
);

-- 创建通知表
CREATE TABLE notifications (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  read_status BOOLEAN DEFAULT FALSE,
  created_by VARCHAR(50) REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_group ON users(user_group_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read_status ON notifications(read_status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_type ON notifications(type);

-- 插入默认用户组（与前端保持一致）
INSERT INTO user_groups (id, name, description, permissions) VALUES
('admin', '管理员', '拥有所有权限的管理员', '["user_read", "user_write", "user_delete", "system_admin", "tianti_read"]'),
('trader', '交易员', '可以查看交易数据并执行交易操作', '["trade_read", "trade_write", "tianti_read"]'),
('observer', '观察者', '只能查看仪表板数据', '["view_dashboard", "tianti_read"]'),
('new_student', '新学员', '新注册的学员，仅基础权限', '["view_dashboard"]');
        `
      });
    }

    // 插入默认用户组（与前端USER_GROUPS保持一致）
    const { error: groupsError, data: groups } = await supabase
      .from('user_groups')
      .upsert([
        {
          id: 'admin',
          name: '管理员',
          description: '拥有所有权限的管理员',
          permissions: JSON.stringify(['user_read', 'user_write', 'user_delete', 'system_admin', 'tianti_read'])
        },
        {
          id: 'trader',
          name: '交易员',
          description: '可以查看交易数据并执行交易操作',
          permissions: JSON.stringify(['trade_read', 'trade_write', 'tianti_read'])
        },
        {
          id: 'observer',
          name: '观察者',
          description: '只能查看仪表板数据',
          permissions: JSON.stringify(['view_dashboard', 'tianti_read'])
        },
        {
          id: 'new_student',
          name: '新学员',
          description: '新注册的学员，仅基础权限',
          permissions: JSON.stringify(['view_dashboard'])
        }
      ])
      .select();

    // 创建默认管理员账户 (noahzeng/19961203)
    const passwordHash = await hashPassword('19961203');

    const { error: userError, data: users } = await supabase
      .from('users')
      .upsert({
        id: '1',
        username: 'noahzeng',
        password_hash: passwordHash,
        user_group_id: 'admin',
        status: 'active',
        created_by: 'system'
      })
      .select(`
        *,
        user_groups: user_group_id (
          id,
          name,
          description,
          permissions
        )
      `);

    return NextResponse.json({
      success: true,
      message: '用户认证系统设置完成',
      results: {
        tablesExisted: tablesExist,
        groupsCreated: !groupsError,
        adminUserCreated: !userError,
        userGroups: groups || [],
        users: users || []
      }
    });

  } catch (error) {
    console.error('设置用户认证系统失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      details: error
    }, { status: 500 });
  }
}

// 简单的密码哈希函数
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'supabase_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}