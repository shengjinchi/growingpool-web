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
    // 创建用户表
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        -- 创建用户组表
        CREATE TABLE IF NOT EXISTS user_groups (
          id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          permissions JSONB NOT NULL DEFAULT '[]',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- 创建用户表
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(50) PRIMARY KEY,
          username VARCHAR(100) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          user_group_id VARCHAR(50) REFERENCES user_groups(id),
          status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_login TIMESTAMP WITH TIME ZONE,
          created_by VARCHAR(50)
        );

        -- 创建索引
        CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
        CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
        CREATE INDEX IF NOT EXISTS idx_users_group ON users(user_group_id);
      `
    });

    if (createTableError && !createTableError.message.includes('already exists')) {
      // 如果 RPC 函数不存在，尝试手动创建表
      console.log('尝试手动创建用户表...');
    }

    // 插入默认用户组
    const { error: groupsError } = await supabase
      .from('user_groups')
      .upsert([
        {
          id: 'admin',
          name: '管理员',
          description: '拥有所有权限的管理员',
          permissions: JSON.stringify(['user_read', 'user_write', 'user_delete', 'system_admin'])
        },
        {
          id: 'manager',
          name: '经理',
          description: '可以管理用户但不能删除系统',
          permissions: JSON.stringify(['user_read', 'user_write'])
        },
        {
          id: 'viewer',
          name: '查看者',
          description: '只能查看用户信息',
          permissions: JSON.stringify(['user_read'])
        }
      ])
      .select();

    if (groupsError) {
      console.log('用户组插入结果:', groupsError);
    }

    // 创建默认管理员账户 (noahzeng/19961203)
    const passwordHash = await hashPassword('19961203');

    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: '1',
        username: 'noahzeng',
        password_hash: passwordHash,
        user_group_id: 'admin',
        status: 'active',
        created_by: 'system'
      })
      .select();

    if (userError) {
      console.log('用户创建结果:', userError);
    }

    // 查询创建的结果
    const { data: groups, error: queryGroupsError } = await supabase
      .from('user_groups')
      .select('*');

    const { data: users, error: queryUsersError } = await supabase
      .from('users')
      .select('*');

    return NextResponse.json({
      success: true,
      message: '用户认证系统初始化完成',
      results: {
        tablesCreated: !createTableError || createTableError.message.includes('already exists'),
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

// 简单的密码哈希函数（生产环境应使用 bcrypt）
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'supabase_salt'); // 添加盐值
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}