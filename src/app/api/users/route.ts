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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const showPasswords = searchParams.get('showPasswords') === 'true';

    let query = supabase
      .from('users')
      .select(`
        id,
        username,
        user_group_id,
        status,
        created_at,
        last_login,
        created_by,
        user_groups: user_group_id (
          id,
          name,
          description,
          permissions
        )
      `)
      .order('created_at', { ascending: false });

    if (username) {
      query = query.eq('username', username);
    }

    const { data: users, error } = await query;

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    // 如果请求显示密码，尝试从用户管理的历史记录中获取
    let usersWithPasswords = users || [];
    if (showPasswords) {
      // 这里我们可以添加密码显示逻辑
      // 由于安全考虑，我们可以显示最后生成的密码或创建时指定的密码
      // 或者添加一个密码备注字段
      usersWithPasswords = (users || []).map((user: any) => ({
        ...user,
        password_hint: '密码已加密存储',
        created_password_note: user.created_by === 'system' ? '系统生成' : '管理员设置'
      }));
    }

    return NextResponse.json({
      success: true,
      users: usersWithPasswords
    });

  } catch (error) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, userGroupId, status = 'active', createdBy } = await request.json();

    if (!username || !userGroupId || !createdBy) {
      return NextResponse.json({
        success: false,
        error: '缺少必要参数'
      }, { status: 400 });
    }

    // 检查用户名是否已存在
    const { data: existingUsers } = await supabase
      .from('users')
      .select('username')
      .eq('username', username.trim());

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({
        success: false,
        error: '用户名已存在'
      }, { status: 400 });
    }

    // 生成密码哈希
    const finalPassword = password || generateRandomPassword(8);
    const passwordHash = await hashPassword(finalPassword);

    // 创建用户
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: Date.now().toString(),
        username: username.trim(),
        password_hash: passwordHash,
        user_group_id: userGroupId,
        status,
        created_by: createdBy
      })
      .select(`
        *,
        user_groups: user_group_id (
          id,
          name,
          description,
          permissions
        )
      `)
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    // 返回用户信息包含明文密码（用于显示）
    return NextResponse.json({
      success: true,
      user: {
        ...data,
        password: finalPassword, // 返回明文密码供显示
        password_note: '请保存此密码，系统不存储明文密码'
      }
    });

  } catch (error) {
    console.error('创建用户失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    const username = searchParams.get('username');

    if (!userId && !username) {
      return NextResponse.json({
        success: false,
        error: '缺少用户ID或用户名'
      }, { status: 400 });
    }

    let query = supabase.from('users').delete();

    if (userId) {
      query = query.eq('id', userId);
    } else {
      query = query.eq('username', username);
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '用户删除成功'
    });

  } catch (error) {
    console.error('删除用户失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, username, newPassword, status, userGroupId, updatedBy } = await request.json();

    if (!userId && !username) {
      return NextResponse.json({
        success: false,
        error: '缺少用户ID或用户名'
      }, { status: 400 });
    }

    let updateData: any = {};
    let newPasswordForDisplay: string | null = null;

    if (newPassword) {
      updateData.password_hash = await hashPassword(newPassword);
      newPasswordForDisplay = newPassword; // 保存明文密码用于返回
    }

    if (status) {
      updateData.status = status;
    }

    if (userGroupId) {
      updateData.user_group_id = userGroupId;
    }

    // updatedBy 字段在数据库中不存在，暂时移除
    // if (updatedBy) {
    //   updateData.updated_by = updatedBy;
    // }

    let query = supabase.from('users').update(updateData);

    if (userId) {
      query = query.eq('id', userId);
    } else {
      query = query.eq('username', username);
    }

    const { data, error } = await query
      .select(`
        *,
        user_groups: user_group_id (
          id,
          name,
          description,
          permissions
        )
      `)
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    // 返回更新后的用户信息
    const response: any = {
      success: true,
      user: data
    };

    // 如果重置了密码，返回新密码
    if (newPasswordForDisplay) {
      response.newPassword = newPasswordForDisplay;
      response.password_note = '请保存新密码，系统不存储明文密码';
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('更新用户失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
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

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'supabase_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}