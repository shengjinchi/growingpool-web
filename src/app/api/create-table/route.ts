import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'development' ? false : { rejectUnauthorized: false }
});

export async function POST(request: NextRequest) {
  try {
    const createTableSQL = `
      -- 创建测试表
      CREATE TABLE IF NOT EXISTS test_users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- 创建更新时间触发器函数
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- 删除已存在的触发器
      DROP TRIGGER IF EXISTS test_users_updated_at ON test_users;

      -- 创建触发器
      CREATE TRIGGER test_users_updated_at
        BEFORE UPDATE ON test_users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

      -- 插入一条测试数据来验证表创建成功
      INSERT INTO test_users (name, email)
      VALUES ('Test User', 'test@example.com')
      ON CONFLICT (email) DO NOTHING;
    `;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 执行 SQL
      const result = await client.query(createTableSQL);

      // 查询验证表是否创建成功
      const { rows } = await client.query(
        'SELECT COUNT(*) as count FROM test_users'
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'test_users 表创建成功',
        recordCount: parseInt(rows[0].count),
        tableInfo: {
          tableName: 'test_users',
          columns: ['id', 'name', 'email', 'created_at', 'updated_at'],
          hasTrigger: true
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('创建表错误:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '创建表失败',
      details: {
        databaseUrl: process.env.DATABASE_URL ? '已配置' : '未配置',
        env: process.env.NODE_ENV
      }
    });
  }
}

// 测试表是否存在的 GET 请求
export async function GET() {
  try {
    const client = await pool.connect();

    try {
      // 检查表是否存在
      const { rows } = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'test_users'
        );
      `);

      const tableExists = rows[0].exists;

      if (tableExists) {
        // 获取表结构信息
        const { rows: columns } = await client.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'test_users'
          ORDER BY ordinal_position;
        `);

        // 获取记录数
        const { rows: countRows } = await client.query(
          'SELECT COUNT(*) as count FROM test_users'
        );

        return NextResponse.json({
          success: true,
          tableExists: true,
          columns,
          recordCount: parseInt(countRows[0].count),
          message: 'test_users 表已存在'
        });
      } else {
        return NextResponse.json({
          success: true,
          tableExists: false,
          message: 'test_users 表不存在'
        });
      }

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('检查表错误:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '检查表失败',
      tableExists: false
    });
  }
}