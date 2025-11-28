const fs = require('fs');
const path = require('path');

// 新闻内容状态检查
function checkNewsContent() {
  console.log('✅ 检查新闻内容状态...');

  const newsPath = path.join(__dirname, '../src/content/news');

  if (!fs.existsSync(newsPath)) {
    console.log('⚠️  新闻内容目录不存在');
    return;
  }

  const newsItems = fs.readdirSync(newsPath).filter(item => {
    const itemPath = path.join(newsPath, item);
    return fs.statSync(itemPath).isDirectory();
  });

  console.log(`📰 发现 ${newsItems.length} 个新闻项目`);

  newsItems.forEach(newsId => {
    const zhPath = path.join(newsPath, newsId, 'zh.md');
    const enPath = path.join(newsPath, newsId, 'en.md');

    const hasZh = fs.existsSync(zhPath);
    const hasEn = fs.existsSync(enPath);

    console.log(`\n📄 ${newsId}:`);
    console.log(`  中文版本: ${hasZh ? '✅' : '❌'}`);
    console.log(`  英文版本: ${hasEn ? '✅' : '❌'}`);

    if (hasZh && hasEn) {
      const zhStat = fs.statSync(zhPath);
      const enStat = fs.statSync(enPath);

      console.log(`  中文更新: ${zhStat.mtime.toLocaleDateString()}`);
      console.log(`  英文更新: ${enStat.mtime.toLocaleDateString()}`);

      if (zhStat.mtime > enStat.mtime) {
        console.log(`  📝 提示: 中文版本较新（暂不更新英文版本）`);
      } else {
        console.log(`  ✅ 英文版本保持最新状态`);
      }
    }

    // 读取内容概要
    if (hasZh) {
      const zhContent = fs.readFileSync(zhPath, 'utf8');
      const titleMatch = zhContent.match(/^#\s+(.+)$/m);
      if (titleMatch) {
        console.log(`  中文标题: ${titleMatch[1]}`);
      }
    }
  });

  console.log('\n✅ 新闻内容状态检查完成');
}

checkNewsContent();