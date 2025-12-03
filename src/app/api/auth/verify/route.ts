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
    const { sessionToken } = await request.json();

    if (!sessionToken) {
      return NextResponse.json({
        success: false,
        error: '缺少会话token'
      }, { status: 401 });
    }

    // 简单的token验证（在真实应用中应使用JWT）
    // 这里我们检查localStorage中存储的用户信息
    const authHeader = request.headers.get('authorization');
    const username = authHeader?.replace('Bearer ', '');

    if (!username) {
      return NextResponse.json({
        success: false,
        error: '无效的认证信息'
      }, { status: 401 });
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
      .eq('status', 'active')
      .single();

    if (userError || !user) {
      return NextResponse.json({
        success: false,
        error: '用户不存在或已被禁用'
      }, { status: 401 });
    }

    // 返回用户信息（不包含密码哈希）
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: '会话有效'
    });

  } catch (error) {
    console.error('验证会话失败:', error);
    return NextResponse.json({
      success: false,
      error: '会话验证失败'
    }, { status: 500 });
  }
}