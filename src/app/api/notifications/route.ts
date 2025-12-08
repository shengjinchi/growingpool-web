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

// GET - 获取通知列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('notifications')
      .select(`
        *,
        sender: created_by (
          username
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (unreadOnly) {
      query = query.eq('read_status', false);
    }

    const { data: notifications, error } = await query;

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    // 获取未读通知数量
    const { data: unreadCount, error: countError } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('read_status', false)
      .eq('user_id', userId);

    return NextResponse.json({
      success: true,
      notifications: notifications || [],
      unreadCount: countError ? 0 : unreadCount || 0
    });

  } catch (error) {
    console.error('获取通知列表失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}

// POST - 发送新通知
export async function POST(request: NextRequest) {
  try {
    const { userId, title, message, type = 'info', createdBy } = await request.json();

    if (!userId || !title || !message || !createdBy) {
      return NextResponse.json({
        success: false,
        error: '缺少必要参数: userId, title, message, createdBy'
      }, { status: 400 });
    }

    // 验证通知类型
    const validTypes = ['info', 'warning', 'error', 'success'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({
        success: false,
        error: '无效的通知类型'
      }, { status: 400 });
    }

    // 创建通知
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        id: Date.now().toString(),
        user_id: userId,
        title,
        message,
        type,
        created_by: createdBy,
        read_status: false
      })
      .select(`
        *,
        sender: created_by (
          username
        )
      `)
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      notification: data
    });

  } catch (error) {
    console.error('发送通知失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}

// DELETE - 删除通知
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const beforeDate = searchParams.get('beforeDate');
    const all = searchParams.get('all') === 'true';
    const allUsers = searchParams.get('allUsers') === 'true';

    if (allUsers) {
      // 删除所有用户的通知（管理员功能）
      if (beforeDate) {
        // 删除所有用户在某个日期之前的所有通知
        const { error } = await supabase
          .from('notifications')
          .delete()
          .lt('created_at', beforeDate);

        if (error) {
          return NextResponse.json({
            success: false,
            error: error.message
          }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: '所有用户通知删除成功'
        });
      } else {
        // 删除所有用户的所有通知
        try {
          // 先获取所有通知的ID，然后批量删除
          const { data: allNotifications, error: fetchError } = await supabase
            .from('notifications')
            .select('id')
            .limit(1000); // 限制数量避免内存问题

          if (fetchError) {
            return NextResponse.json({
              success: false,
              error: `获取通知列表失败: ${fetchError.message}`
            }, { status: 500 });
          }

          if (allNotifications && allNotifications.length > 0) {
            const idsToDelete = allNotifications.map(n => n.id);
            const { error: deleteError } = await supabase
              .from('notifications')
              .delete()
              .in('id', idsToDelete);

            if (deleteError) {
              return NextResponse.json({
                success: false,
                error: `删除通知失败: ${deleteError.message}`
              }, { status: 500 });
            }
          }

          return NextResponse.json({
            success: true,
            message: `成功删除 ${allNotifications?.length || 0} 条通知`
          });
        } catch (error) {
          return NextResponse.json({
            success: false,
            error: `删除通知时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
          }, { status: 500 });
        }
      }
    } else {
      // 删除指定用户的通知
      if (!userId) {
        return NextResponse.json({
          success: false,
          error: '缺少必需参数: userId'
        }, { status: 400 });
      }

      let query = supabase.from('notifications');

      if (all) {
        // 删除指定用户的所有通知
        const { error } = await query.delete().eq('user_id', userId);

        if (error) {
          return NextResponse.json({
            success: false,
            error: error.message
          }, { status: 500 });
        }
      } else if (beforeDate) {
        // 删除指定用户在某个日期之前的所有通知
        const { error } = await query
          .delete()
          .eq('user_id', userId)
          .lt('created_at', beforeDate);

        if (error) {
          return NextResponse.json({
            success: false,
            error: error.message
          }, { status: 500 });
        }
      } else {
        return NextResponse.json({
          success: false,
          error: '参数错误，需要指定 beforeDate 或 all=true'
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: '通知删除成功'
      });
    }

  } catch (error) {
    console.error('删除通知失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}