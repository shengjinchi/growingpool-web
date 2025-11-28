const fs = require('fs');
const path = require('path');

// 博客"关于我们"内容检查和同步
function syncAboutUsContent() {
  console.log('🔄 开始同步博客"关于我们"内容...');

  // 查找"关于我们"相关文章
  const aboutUsSlugs = [
    'about-growingpool',
    'about-us',
    'about',
    'about-fx-killer'  // 可能的旧版本
  ];

  const articlesPath = path.join(__dirname, '../src/app/[locale]/(portal)/blog/articles');

  if (!fs.existsSync(articlesPath)) {
    console.log('❌ 博客文章目录不存在');
    return;
  }

  const articles = fs.readdirSync(articlesPath).filter(item => {
    const itemPath = path.join(articlesPath, item);
    return fs.statSync(itemPath).isDirectory();
  });

  // 查找"关于我们"文章
  const aboutUsArticles = articles.filter(slug =>
    aboutUsSlugs.some(aboutSlug => slug.includes(aboutSlug))
  );

  console.log(`📝 找到 ${aboutUsArticles.length} 篇"关于我们"相关文章`);

  aboutUsArticles.forEach(slug => {
    console.log(`\n📄 处理文章: ${slug}`);

    const articlePage = path.join(articlesPath, slug, 'page.tsx');
    const zhPath = path.join(articlesPath, slug, 'zh.md');
    const enPath = path.join(articlesPath, slug, 'en.md');

    if (fs.existsSync(articlePage)) {
      const content = fs.readFileSync(articlePage, 'utf8');

      // 检查是否使用翻译函数
      const hasTranslation = /t\(['"`]/.test(content);
      const hasChinese = /[\u4e00-\u9fff]/.test(content);
      const hasHardcodedChinese = /[^`'"t\(]([\u4e00-\u9fff]+)/.test(content);

      console.log(`  翻译函数支持: ${hasTranslation ? '✅' : '❌'}`);
      console.log(`  包含中文: ${hasChinese ? '✅' : '❌'}`);
      console.log(`  硬编码中文: ${hasHardcodedChinese ? '⚠️ 需要修改' : '✅ 无问题'}`);

      // 检查markdown文件
      const hasZhMd = fs.existsSync(zhPath);
      const hasEnMd = fs.existsSync(enPath);

      console.log(`  中文MD文件: ${hasZhMd ? '✅' : '❌'}`);
      console.log(`  英文MD文件: ${hasEnMd ? '✅' : '❌'}`);

      if (hasZhMd && hasEnMd) {
        const zhStat = fs.statSync(zhPath);
        const enStat = fs.statSync(enPath);

        console.log(`  中文更新: ${zhStat.mtime.toLocaleDateString()}`);
        console.log(`  英文更新: ${enStat.mtime.toLocaleDateString()}`);

        if (zhStat.mtime > enStat.mtime) {
          console.log(`  ⚠️  需要更新英文版本`);

          // 显示内容概要
          const zhContent = fs.readFileSync(zhPath, 'utf8');
          const titleMatch = zhContent.match(/^#\s+(.+)$/m);
          if (titleMatch) {
            console.log(`  中文标题: ${titleMatch[1]}`);
          }

          console.log(`  🔧 操作建议: 更新英文MD文件以匹配中文版本`);
        } else {
          console.log(`  ✅ 英文版本保持最新`);
        }
      } else if (hasZhMd && !hasEnMd) {
        console.log(`  ⚠️  需要创建英文版本`);
      }
    } else {
      console.log(`  ❌ 文章页面文件不存在`);
    }
  });

  // 检查其他博客文章状态
  const otherArticles = articles.filter(slug =>
    !aboutUsSlugs.some(aboutSlug => slug.includes(aboutSlug))
  );

  console.log(`\n📝 其他博客文章 (${otherArticles.length}篇) - 暂不需要更新英文内容`);

  // 只做基本检查，不进行更新
  otherArticles.slice(0, 5).forEach(slug => {  // 只显示前5个作为示例
    const articlePage = path.join(articlesPath, slug, 'page.tsx');
    if (fs.existsSync(articlePage)) {
      const content = fs.readFileSync(articlePage, 'utf8');
      const hasChinese = /[\u4e00-\u9fff]/.test(content);
      console.log(`  📄 ${slug}: 包含中文=${hasChinese ? '✅' : '❌'} (暂不更新英文)`);
    }
  });

  if (otherArticles.length > 5) {
    console.log(`  📄 ... 还有 ${otherArticles.length - 5} 篇文章（暂不处理）`);
  }

  console.log('\n✅ 博客"关于我们"内容检查完成');
  console.log('📝 总结: 只需要更新"关于我们"相关文章的英文版本');
}

syncAboutUsContent();