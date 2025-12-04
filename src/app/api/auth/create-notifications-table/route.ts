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
    console.log('开始创建通知表...');

    // 检查表是否已存在
    const { data: existingNotifications, error: notificationsCheckError } = await supabase
      .from('notifications')
      .select('*')
      .limit(1);

    const notificationsTableExists = !notificationsCheckError;

    if (notificationsTableExists) {
      return NextResponse.json({
        success: true,
        message: '通知表已存在',
        tablesExisted: true
      });
    }

    // 创建通知表的SQL
    const createTableSQL = `
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
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read_status ON notifications(read_status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_type ON notifications(type);
    `;

    console.log('请在 Supabase Dashboard 的 SQL Editor 中执行以下SQL:');
    console.log(createTableSQL);

    return NextResponse.json({
      success: false,
      message: '请手动创建通知表',
      sql: createTableSQL
    });

  } catch (error) {
    console.error('创建通知表失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      details: error
    }, { status: 500 });
  }
}