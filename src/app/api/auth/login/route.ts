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
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: '用户名和密码不能为空'
      }, { status: 400 });
    }

    // 查询用户
    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        user_groups: user_group_id (
          id,
          name,
          description,
          permissions
        )
      `)
      .eq('username', username)
      .single();

    if (userError || !user) {
      return NextResponse.json({
        success: false,
        error: '用户名或密码错误'
      });
    }

    // 检查用户状态
    if (user.status !== 'active') {
      return NextResponse.json({
        success: false,
        error: '账户已被禁用或暂停'
      });
    }

    // 验证密码
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: '用户名或密码错误'
      });
    }

    // 更新最后登录时间
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // 创建会话token (简单的JWT替代方案)
    const sessionToken = await createSessionToken(user);

    // 返回用户信息（不包含密码哈希）
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      sessionToken,
      message: '登录成功'
    });

  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json({
      success: false,
      error: '登录过程中发生错误'
    }, { status: 500 });
  }
}

// 密码验证函数
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'supabase_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return computedHash === hash;
}

// 创建会话token
async function createSessionToken(user: any): Promise<string> {
  const tokenData = {
    userId: user.id,
    username: user.username,
    userGroupId: user.user_group_id,
    timestamp: Date.now()
  };

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(tokenData));
  const tokenBuffer = await crypto.subtle.digest('SHA-256', data);
  const tokenArray = Array.from(new Uint8Array(tokenBuffer));
  return tokenArray.map(b => b.toString(16).padStart(2, '0')).join('');
}