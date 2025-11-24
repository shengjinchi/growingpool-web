"use client";

import React, { useState, useEffect } from 'react';

interface TestResult {
  status: 'success' | 'error' | 'loading';
  message: string;
  data?: any;
}

export default function SupabaseTest() {
  const [testResult, setTestResult] = useState<TestResult>({
    status: 'loading',
    message: '正在初始化测试...'
  });

  const testSupabaseConnection = async () => {
    try {
      setTestResult({ status: 'loading', message: '正在测试 Supabase 连接...' });

      // 测试 1: 基本连接测试
      const response = await fetch('/api/supabase-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'test-connection' })
      });

      const result = await response.json();

      if (result.success) {
        setTestResult({
          status: 'success',
          message: '✅ Supabase 连接成功！',
          data: result.data
        });
      } else {
        setTestResult({
          status: 'error',
          message: `❌ 连接失败: ${result.error}`,
          data: result.details
        });
      }
    } catch (error) {
      setTestResult({
        status: 'error',
        message: `❌ 测试失败: ${error instanceof Error ? error.message : '未知错误'}`,
        data: error
      });
    }
  };

  const testEnvironmentVariables = () => {
    const envVars = {
      'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
      'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '已设置' : '未设置',
      'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY ? '已设置' : '未设置',
      'DATABASE_URL': process.env.DATABASE_URL ? '已设置' : '未设置',
    };

    return envVars;
  };

  useEffect(() => {
    // 页面加载时自动测试
    testSupabaseConnection();
  }, []);

  const envVars = testEnvironmentVariables();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Supabase 连接测试
      </h2>

      {/* 环境变量状态 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          环境变量状态
        </h3>
        <div className="space-y-2">
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{key}</span>
              <span className={`text-sm font-medium ${
                value === '未设置' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
              }`}>
                {key.includes('URL') && value !== '未设置' ?
                  `${value?.substring(0, 20)}...` : value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 测试结果 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          连接测试结果
        </h3>
        <div className={`p-4 rounded-lg ${
          testResult.status === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
          testResult.status === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
          'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
        } border`}>
          <div className="flex items-center mb-2">
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              {testResult.message}
            </span>
          </div>

          {testResult.data && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              <details className="cursor-pointer">
                <summary className="font-medium">查看详细信息</summary>
                <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <button
          onClick={testSupabaseConnection}
          disabled={testResult.status === 'loading'}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {testResult.status === 'loading' ? '测试中...' : '重新测试'}
        </button>
      </div>
    </div>
  );
}