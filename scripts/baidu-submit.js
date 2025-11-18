const axios = require('axios');

// 百度API配置
const BAIDU_URLS_API = 'http://data.zz.baidu.com/urls?site=https://www.shengjinchi.com&token=lsaUAWIgDMZ0FQRB';

// 重要的页面URL（按优先级排序）
const IMPORTANT_URLS = [
  // 首页和主要功能页面
  'https://www.shengjinchi.com/',
  'https://www.shengjinchi.com/splan/join-us',
  'https://www.shengjinchi.com/live-trading',
  'https://www.shengjinchi.com/splan/donate',

  // 教育和培训页面
  'https://www.shengjinchi.com/splan/faq',
  'https://www.shengjinchi.com/splan/psychology-test',
  'https://www.shengjinchi.com/dashboard',
  'https://www.shengjinchi.com/economic-calendar',

  // 工具页面
  'https://www.shengjinchi.com/tools/position-calculator',
  'https://www.shengjinchi.com/splan/blog',

  // 验证页面（确保可访问）
  'https://www.shengjinchi.com/baidu_verify_codeva-C31MHoLTsU.html'
];

// 分批提交URL（百度API限制每次最多提交50个）
async function submitUrls(urls, batchSize = 50) {
  const batches = [];

  // 将URL分成批次
  for (let i = 0; i < urls.length; i += batchSize) {
    batches.push(urls.slice(i, i + batchSize));
  }

  let totalSuccess = 0;
  let totalFailed = 0;

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`📤 推送第 ${i + 1}/${batches.length} 批，共 ${batch.length} 个URL...`);

    try {
      const response = await axios.post(BAIDU_URLS_API, batch.join('\n'), {
        headers: {
          'Content-Type': 'text/plain'
        },
        timeout: 10000 // 10秒超时
      });

      const data = response.data;

      if (data.success !== undefined) {
        console.log(`✅ 第 ${i + 1} 批推送成功: ${data.success} 个URL`);
        console.log(`📊 剩余配额: ${data.remain} 个`);

        totalSuccess += data.success;

        // 检查失败的URL
        if (data.not_valid && data.not_valid.length > 0) {
          console.log(`⚠️ 无效URL: ${data.not_valid.join(', ')}`);
          totalFailed += data.not_valid.length;
        }

        if (data.not_same_site && data.not_same_site.length > 0) {
          console.log(`⚠️ 非本站URL: ${data.not_same_site.join(', ')}`);
          totalFailed += data.not_same_site.length;
        }
      } else {
        console.log(`⚠️ 第 ${i + 1} 批推送状态未知`);
        console.log('响应:', data);
      }

    } catch (error) {
      console.error(`❌ 第 ${i + 1} 批推送失败:`, error.message);
      if (error.response) {
        console.error('错误详情:', error.response.data);
      }
      totalFailed += batch.length;
    }

    // 批次之间等待2秒，避免过于频繁的请求
    if (i < batches.length - 1) {
      console.log('⏳ 等待2秒后继续下一批...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return { totalSuccess, totalFailed };
}

// 验证URL是否可访问
async function validateUrls(urls) {
  console.log('🔍 验证URL可访问性...');

  for (const url of urls.slice(0, 3)) { // 只验证前3个，避免过多请求
    try {
      const response = await axios.head(url, { timeout: 5000 });
      console.log(`✅ ${url} - ${response.status}`);
    } catch (error) {
      console.warn(`⚠️ ${url} - ${error.message}`);
    }
  }
}

// 主函数
async function main() {
  console.log('🚀 开始百度URL推送任务...');
  console.log(`📋 共准备推送 ${IMPORTANT_URLS.length} 个重要页面\n`);

  // 验证关键URL可访问性
  await validateUrls(IMPORTANT_URLS);

  console.log('\n📡 开始向百度推送URL...');

  const { totalSuccess, totalFailed } = await submitUrls(IMPORTANT_URLS);

  console.log('\n📊 推送统计:');
  console.log(`✅ 成功推送: ${totalSuccess} 个URL`);
  console.log(`❌ 失败推送: ${totalFailed} 个URL`);
  console.log(`📈 总计推送: ${IMPORTANT_URLS.length} 个URL`);

  if (totalSuccess > 0) {
    console.log('\n🎉 URL推送完成！');
    console.log('📈 请在百度资源平台查看推送效果:');
    console.log('https://ziyuan.baidu.com/linksubmit/index?site=https://www.shengjinchi.com/');
  } else {
    console.log('\n⚠️ 没有URL成功推送，请检查API配置');
  }
}

// 执行主函数
main().catch(error => {
  console.error('💥 推送程序执行失败:', error);
  process.exit(1);
});