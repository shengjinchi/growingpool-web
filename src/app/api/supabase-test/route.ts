import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // 检查环境变量
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: '缺少 Supabase 环境变量',
        details: {
          supabaseUrl: !!supabaseUrl,
          supabaseAnonKey: !!supabaseAnonKey,
          supabaseServiceKey: !!supabaseServiceKey
        }
      });
    }

    const results: any = {};

    switch (action) {
      case 'test-connection':
        // 测试基本连接
        try {
          const supabase = createClient(supabaseUrl, supabaseAnonKey);

          // 测试基本连接 - 尝试获取项目信息
          const { data: projectInfo, error: projectError } = await supabase
            .from('_test_connection')
            .select('*')
            .limit(1);

          // 即使表不存在，只要连接成功就不应该抛出错误
          results.basicConnection = {
            success: !projectError || projectError.message.includes('does not exist'),
            error: projectError?.message,
            note: projectError?.message.includes('does not exist') ?
              '表不存在是正常的，说明连接成功' : undefined
          };

          // 测试服务密钥连接（如果可用）
          if (supabaseServiceKey) {
            try {
              const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

              // 尝试获取数据库版本信息
              const { data: versionData, error: versionError } = await adminSupabase
                .rpc('version');

              results.adminConnection = {
                success: !versionError,
                data: versionData,
                error: versionError?.message
              };

              // 测试创建测试表
              const { error: createError } = await adminSupabase.rpc('create_test_table');

              if (createError && !createError.message.includes('already exists')) {
                results.tableCreation = {
                  success: false,
                  error: createError.message
                };
              } else {
                results.tableCreation = {
                  success: true,
                  note: '测试表已存在或创建成功'
                };

                // 插入测试数据
                const { data: insertData, error: insertError } = await adminSupabase
                  .from('_test_connection')
                  .insert([
                    {
                      test_name: 'connection_test',
                      test_time: new Date().toISOString(),
                      test_data: { env: 'development', timestamp: Date.now() }
                    }
                  ])
                  .select();

                results.dataInsertion = {
                  success: !insertError,
                  data: insertData,
                  error: insertError?.message
                };

                // 查询测试数据
                const { data: queryData, error: queryError } = await adminSupabase
                  .from('_test_connection')
                  .select('*')
                  .order('test_time', { ascending: false })
                  .limit(5);

                results.dataQuery = {
                  success: !queryError,
                  data: queryData,
                  error: queryError?.message
                };
              }

            } catch (adminError) {
              results.adminConnection = {
                success: false,
                error: adminError instanceof Error ? adminError.message : '未知错误'
              };
            }
          } else {
            results.adminConnection = {
              success: false,
              error: '服务密钥未设置'
            };
          }

        } catch (error) {
          results.basicConnection = {
            success: false,
            error: error instanceof Error ? error.message : '未知错误'
          };
        }
        break;

      default:
        return NextResponse.json({
          success: false,
          error: '未知的测试操作'
        });
    }

    return NextResponse.json({
      success: true,
      action,
      results,
      environment: {
        supabaseUrl: supabaseUrl?.substring(0, 20) + '...',
        hasAnonKey: !!supabaseAnonKey,
        hasServiceKey: !!supabaseServiceKey,
        nodeEnv: process.env.NODE_ENV
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '服务器错误',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
}