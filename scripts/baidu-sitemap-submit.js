const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 百度API配置
const BAIDU_SITEMAP_API = 'http://data.zz.baidu.com/sitemap?site=https://www.shengjinchi.com&token=lsaUAWIgDMZ0FQRB';

// sitemap文件URL
const SITEMAP_URLS = [
  'https://www.shengjinchi.com/sitemap.xml',
  'https://www.shengjinchi.com/sitemap-index.xml'
];

// 提交sitemap到百度
async function submitSitemap() {
  for (const sitemapUrl of SITEMAP_URLS) {
    try {
      console.log(`🚀 提交sitemap: ${sitemapUrl}`);

      const response = await axios.get(`${BAIDU_SITEMAP_API}&sitemap=${sitemapUrl}`);

      if (response.data.status === 200) {
        console.log(`✅ ${sitemapUrl} 提交成功!`);
        console.log(`📊 成功提交: ${response.data.success || 0} 个URL`);
        console.log(`📊 剩余配额: ${response.data.remain || 0} 个`);
      } else {
        console.log(`⚠️ ${sitemapUrl} 提交状态: ${response.data.message || '未知状态'}`);
      }

      // 等待1秒再提交下一个
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`❌ ${sitemapUrl} 提交失败:`, error.message);
      if (error.response) {
        console.error('响应数据:', error.response.data);
      }
    }
  }
}

// 检查sitemap文件是否存在
function checkSitemapFiles() {
  const publicDir = path.join(__dirname, '../public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  const sitemapIndexPath = path.join(publicDir, 'sitemap-index.xml');

  if (!fs.existsSync(sitemapPath)) {
    console.error('❌ sitemap.xml 文件不存在，请先运行生成脚本');
    return false;
  }

  if (!fs.existsSync(sitemapIndexPath)) {
    console.error('❌ sitemap-index.xml 文件不存在，请先运行生成脚本');
    return false;
  }

  console.log('✅ sitemap文件检查通过');
  return true;
}

// 主函数
async function main() {
  console.log('🔍 检查sitemap文件...');

  if (!checkSitemapFiles()) {
    console.log('💡 提示: 请先运行 npm run generate-sitemap');
    process.exit(1);
  }

  console.log('📡 开始提交sitemap到百度...');
  await submitSitemap();

  console.log('\n🎉 sitemap提交完成！');
  console.log('📈 请访问百度资源平台查看详细数据:');
  console.log('https://ziyuan.baidu.com/linksubmit/index?site=https://www.shengjinchi.com/');
}

// 执行主函数
main().catch(error => {
  console.error('💥 程序执行失败:', error);
  process.exit(1);
});