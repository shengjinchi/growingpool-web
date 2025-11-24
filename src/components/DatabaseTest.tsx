"use client";

import React, { useState } from 'react';

interface TestResult {
  operation: string;
  status: 'success' | 'error' | 'loading';
  message: string;
  data?: any;
  error?: string;
}

interface TestData {
  id?: number;
  name: string;
  email: string;
  created_at?: string;
}

export default function DatabaseTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testData, setTestData] = useState<TestData>({
    name: 'Test User',
    email: 'test@example.com'
  });

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const executeDatabaseTest = async (operation: string, action: string, data?: any) => {
    addTestResult({
      operation,
      status: 'loading',
      message: `正在执行 ${operation}...`
    });

    try {
      const response = await fetch('/api/database-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, data })
      });

      const result = await response.json();

      if (result.success) {
        addTestResult({
          operation,
          status: 'success',
          message: `✅ ${operation} 成功！`,
          data: result.data
        });
      } else {
        addTestResult({
          operation,
          status: 'error',
          message: `❌ ${operation} 失败: ${result.error}`,
          error: result.details
        });
      }
    } catch (error) {
      addTestResult({
        operation,
        status: 'error',
        message: `❌ ${operation} 失败: ${error instanceof Error ? error.message : '未知错误'}`,
        error: error
      });
    }
  };

  const testCreateTable = async () => {
    addTestResult({
      operation: '创建测试表',
      status: 'loading',
      message: '正在创建 test_users 表...'
    });

    try {
      const response = await fetch('/api/create-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (result.success) {
        addTestResult({
          operation: '创建测试表',
          status: 'success',
          message: `✅ ${result.message}`,
          data: result
        });
      } else {
        addTestResult({
          operation: '创建测试表',
          status: 'error',
          message: `❌ 创建表失败: ${result.error}`,
          error: result.details
        });
      }
    } catch (error) {
      addTestResult({
        operation: '创建测试表',
        status: 'error',
        message: `❌ 创建表失败: ${error instanceof Error ? error.message : '未知错误'}`,
        error: error
      });
    }
  };

  const testInsertData = () => {
    executeDatabaseTest('插入测试数据', 'insert-data', testData);
  };

  const testQueryData = () => {
    executeDatabaseTest('查询数据', 'query-data');
  };

  const testUpdateData = () => {
    if (testResults.length === 0) {
      alert('请先插入数据再测试更新功能');
      return;
    }
    executeDatabaseTest('更新数据', 'update-data', {
      id: 1, // 假设更新第一条记录
      ...testData,
      name: testData.name + ' (Updated)'
    });
  };

  const testDeleteData = () => {
    if (testResults.length === 0) {
      alert('请先插入数据再测试删除功能');
      return;
    }
    executeDatabaseTest('删除数据', 'delete-data', { id: 1 });
  };

  const testDropTable = () => {
    if (confirm('确定要删除测试表吗？这将删除所有测试数据。')) {
      executeDatabaseTest('删除测试表', 'drop-table');
    }
  };

  const runAllTests = async () => {
    clearResults();

    // 依次执行所有测试
    await new Promise(resolve => setTimeout(resolve, 500));
    await testCreateTable();

    // 等待表创建完成
    await new Promise(resolve => setTimeout(resolve, 2000));

    await new Promise(resolve => setTimeout(resolve, 1000));
    await testInsertData();

    await new Promise(resolve => setTimeout(resolve, 1000));
    await testQueryData();

    await new Promise(resolve => setTimeout(resolve, 1000));
    await testUpdateData();

    await new Promise(resolve => setTimeout(resolve, 1000));
    await testQueryData(); // 再次查询查看更新结果

    await new Promise(resolve => setTimeout(resolve, 1000));
    await testDeleteData();

    await new Promise(resolve => setTimeout(resolve, 1000));
    await testQueryData(); // 最后查询确认删除
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        数据库操作测试
      </h2>

      {/* 测试数据输入 */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          测试数据
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              姓名
            </label>
            <input
              type="text"
              value={testData.name}
              onChange={(e) => setTestData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="输入测试姓名"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              邮箱
            </label>
            <input
              type="email"
              value={testData.email}
              onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="输入测试邮箱"
            />
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          数据库操作
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <button
            onClick={testCreateTable}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            创建表
          </button>
          <button
            onClick={testInsertData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            插入数据
          </button>
          <button
            onClick={testQueryData}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            查询数据
          </button>
          <button
            onClick={testUpdateData}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            更新数据
          </button>
          <button
            onClick={testDeleteData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            删除数据
          </button>
          <button
            onClick={testDropTable}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            删除表
          </button>
          <button
            onClick={clearResults}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            清空结果
          </button>
          <button
            onClick={runAllTests}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors md:col-span-1"
          >
            运行全部测试
          </button>
        </div>
      </div>

      {/* 测试结果 */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          测试结果
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              暂无测试结果，点击上方按钮开始测试
            </div>
          ) : (
            testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.status === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : result.status === 'error'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {result.operation}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.status === 'success'
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : result.status === 'error'
                          ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                      }`}>
                        {result.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {result.message}
                    </p>
                  </div>
                </div>

                {/* 显示详细数据 */}
                {result.data && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                      查看详细数据
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}

                {/* 显示错误信息 */}
                {result.error && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
                      查看错误详情
                    </summary>
                    <pre className="mt-2 p-3 bg-red-100 dark:bg-red-900/20 rounded text-xs overflow-x-auto text-red-800 dark:text-red-200">
                      {JSON.stringify(result.error, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}