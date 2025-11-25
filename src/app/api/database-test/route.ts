import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('缺少 Supabase 环境变量');
}

// 创建服务端客户端（使用服务密钥，具有更高权限）
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    let result;

    switch (action) {
      case 'create-table':
        result = await createTestTable();
        break;

      case 'insert-data':
        result = await insertTestData(data);
        break;

      case 'query-data':
        result = await queryTestData();
        break;

      case 'update-data':
        result = await updateTestData(data);
        break;

      case 'delete-data':
        result = await deleteTestData(data);
        break;

      case 'drop-table':
        result = await dropTestTable();
        break;

      default:
        return NextResponse.json({
          success: false,
          error: '未知的数据库操作'
        });
    }

    return NextResponse.json({
      success: true,
      action,
      data: result
    });

  } catch (error) {
    console.error('数据库测试错误:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      details: error
    });
  }
}

async function createTestTable() {
  // 首先检查表是否已存在
  const { data: existingTable, error: checkError } = await supabase
    .from('test_users')
    .select('*')
    .limit(1);

  if (!checkError) {
    return {
      message: '测试表已存在',
      table: 'test_users',
      exists: true
    };
  }

  // 表不存在，我们需要使用原始 SQL 创建
  // 使用 DATABASE_URL 直接执行 SQL
  try {
    const { error: sqlError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE test_users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- 创建更新时间触发器
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        DROP TRIGGER IF EXISTS test_users_updated_at ON test_users;
        CREATE TRIGGER test_users_updated_at
          BEFORE UPDATE ON test_users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `
    });

    if (sqlError && !sqlError.message.includes('does not exist')) {
      throw new Error(`SQL 执行失败: ${sqlError.message}`);
    }

    // 如果 RPC 函数不存在，我们使用 Supabase SQL Editor 的方式
    // 创建一个简单的临时记录来触发表创建
    const { error: insertError } = await supabase
      .from('test_users')
      .insert([{
        name: 'System Init',
        email: `init_${Date.now()}@system.com`
      }]);

    if (insertError && !insertError.message.includes('does not exist') && !insertError.message.includes('duplicate key')) {
      throw new Error(`创建表失败: ${insertError.message}`);
    }

    // 如果成功插入了数据，删除它
    if (!insertError) {
      await supabase
        .from('test_users')
        .delete()
        .eq('email', `init_${Date.now()}@system.com`);
    }

    return {
      message: '测试表创建成功',
      table: 'test_users',
      created: true,
      note: insertError?.message.includes('does not exist') ?
        '表需要通过 Supabase Dashboard 手动创建' :
        '表已自动创建'
    };

  } catch (error) {
    return {
      message: '表创建遇到问题',
      table: 'test_users',
      error: error instanceof Error ? error.message : '未知错误',
      note: '请通过 Supabase Dashboard 的 SQL Editor 执行以下命令创建表:\n\n' +
            'CREATE TABLE test_users (\n' +
            '  id SERIAL PRIMARY KEY,\n' +
            '  name VARCHAR(255) NOT NULL,\n' +
            '  email VARCHAR(255) UNIQUE NOT NULL,\n' +
            '  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n' +
            '  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n' +
            ');'
    };
  }
}

async function insertTestData(userData: { name: string; email: string }) {
  const { data, error } = await supabase
    .from('test_users')
    .insert([userData])
    .select()
    .single();

  if (error) {
    throw new Error(`插入数据失败: ${error.message}`);
  }

  return {
    message: '数据插入成功',
    insertedData: data
  };
}

async function queryTestData() {
  const { data, error, count } = await supabase
    .from('test_users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`查询数据失败: ${error.message}`);
  }

  return {
    message: `查询成功，共 ${count} 条记录`,
    records: data,
    totalCount: count
  };
}

async function updateTestData(updateData: { id: number; name: string; email: string }) {
  const { id, name, email } = updateData;

  const { data, error } = await supabase
    .from('test_users')
    .update({ name, email, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`更新数据失败: ${error.message}`);
  }

  return {
    message: '数据更新成功',
    updatedData: data
  };
}

async function deleteTestData(deleteData: { id: number }) {
  const { id } = deleteData;

  // 先查询要删除的数据
  const { data: existingData, error: queryError } = await supabase
    .from('test_users')
    .select('*')
    .eq('id', id)
    .single();

  if (queryError) {
    throw new Error(`查询要删除的数据失败: ${queryError.message}`);
  }

  // 删除数据
  const { error: deleteError } = await supabase
    .from('test_users')
    .delete()
    .eq('id', id);

  if (deleteError) {
    throw new Error(`删除数据失败: ${deleteError.message}`);
  }

  return {
    message: '数据删除成功',
    deletedData: existingData
  };
}

async function dropTestTable() {
  // 先获取表中的数据数量
  const { count, error: countError } = await supabase
    .from('test_users')
    .select('*', { count: 'exact', head: true });

  if (countError && !countError.message.includes('does not exist')) {
    throw new Error(`查询表数据失败: ${countError.message}`);
  }

  // 删除表
  const { error } = await supabase.rpc('execute_sql', {
    sql: 'DROP TABLE IF EXISTS test_users CASCADE;'
  });

  if (error && !error.message.includes('does not exist')) {
    // 如果 RPC 不可用，我们无法直接删除表，但可以删除所有数据
    const { error: deleteError } = await supabase
      .from('test_users')
      .delete()
      .neq('id', -1); // 删除所有记录

    if (deleteError) {
      throw new Error(`清空表数据失败: ${deleteError.message}`);
    }

    return {
      message: '表数据清空成功（表删除需要数据库权限）',
      recordsDeleted: count || 0
    };
  }

  return {
    message: '测试表删除成功',
    recordsDeleted: count || 0
  };
}