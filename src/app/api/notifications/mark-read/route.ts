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

// PUT - 标记通知为已读
export async function PUT(request: NextRequest) {
  try {
    const { notificationId, markAll = false, userId } = await request.json();

    if (!notificationId && !markAll) {
      return NextResponse.json({
        success: false,
        error: '缺少通知ID或未指定标记全部'
      }, { status: 400 });
    }

    let result;

    if (markAll && userId) {
      // 标记用户的所有未读通知为已读
      result = await supabase
        .from('notifications')
        .update({
          read_status: true,
          read_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('read_status', false);

    } else if (notificationId) {
      // 标记单个通知为已读
      result = await supabase
        .from('notifications')
        .update({
          read_status: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

    } else {
      return NextResponse.json({
        success: false,
        error: '无效的请求参数'
      }, { status: 400 });
    }

    const { error } = result;

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: markAll ? '所有通知已标记为已读' : '通知已标记为已读'
    });

  } catch (error) {
    console.error('标记通知失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}