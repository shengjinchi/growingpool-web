const fs = require('fs');
const path = require('path');

// 翻译文件完整性检查
function checkTranslationCompleteness() {
  console.log('🔍 检查翻译文件完整性...');

  const languageContextPath = path.join(__dirname, '../src/contexts/LanguageContext.tsx');

  if (!fs.existsSync(languageContextPath)) {
    console.log('❌ LanguageContext 文件不存在');
    return;
  }

  const content = fs.readFileSync(languageContextPath, 'utf8');

  // 提取中文翻译键值
  const zhMatches = content.match(/zh:\s*\{([^}]+)\}/s);
  const enMatches = content.match(/en:\s*\{([^}]+)\}/s);

  if (!zhMatches || !enMatches) {
    console.log('❌ 无法提取翻译数据');
    return;
  }

  // 提取键值对
  const extractKeys = (translationString) => {
    const keyMatches = translationString.match(/'([^']+)':/g);
    return keyMatches ? keyMatches.map(match => match.slice(1, -1)) : [];
  };

  const zhKeys = extractKeys(zhMatches[1]);
  const enKeys = extractKeys(enMatches[1]);

  console.log(`📊 中文翻译键值: ${zhKeys.length} 个`);
  console.log(`📊 英文翻译键值: ${enKeys.length} 个`);

  // 检查缺失的键值
  const missingInEn = zhKeys.filter(key => !enKeys.includes(key));
  const missingInZh = enKeys.filter(key => !zhKeys.includes(key));

  if (missingInEn.length > 0) {
    console.log(`❌ 英文版本缺失 ${missingInEn.length} 个翻译键值:`);
    missingInEn.slice(0, 10).forEach((key, index) => {
      console.log(`  ${index + 1}. ${key}`);
    });
    if (missingInEn.length > 10) {
      console.log(`  ... 还有 ${missingInEn.length - 10} 个键值缺失`);
    }
  } else {
    console.log('✅ 英文翻译键值完整');
  }

  if (missingInZh.length > 0) {
    console.log(`❌ 中文版本缺失 ${missingInZh.length} 个翻译键值:`);
    missingInZh.slice(0, 10).forEach((key, index) => {
      console.log(`  ${index + 1}. ${key}`);
    });
    if (missingInZh.length > 10) {
      console.log(`  ... 还有 ${missingInZh.length - 10} 个键值缺失`);
    }
  } else {
    console.log('✅ 中文翻译键值完整');
  }

  // 检查总翻译键值数量
  const totalKeys = new Set([...zhKeys, ...enKeys]);
  console.log(`📈 翻译键值总数: ${totalKeys.size} 个`);

  // 检查关键页面翻译
  const criticalPages = [
    'brand.name',
    'nav.home',
    'nav.training',
    'nav.tradingTools',
    'nav.blog',
    'nav.psychology',
    'nav.dashboard',
    'hero.title',
    'hero.subtitle',
    'why.title',
    'career.title',
    'blog.title',
    'faq.hero.title',
    'donate.hero.title1'
  ];

  const missingCritical = criticalPages.filter(key => !enKeys.includes(key));

  if (missingCritical.length > 0) {
    console.log(`⚠️  关键页面翻译缺失: ${missingCritical.length} 个`);
    missingCritical.forEach(key => {
      console.log(`  - ${key}`);
    });
  } else {
    console.log('✅ 关键页面翻译完整');
  }

  // 检查是否有空翻译值
  const emptyTranslations = zhKeys.filter(key => {
    const zhValue = content.match(new RegExp(`'${key}'\\s*:\\s*'([^']+)'`));
    const enValue = content.match(new RegExp(`'${key}'\\s*:\\s*'([^']+)'`));
    return (!zhValue || zhValue[1].trim() === '') && (!enValue || enValue[1].trim() === '');
  });

  if (emptyTranslations.length > 0) {
    console.log(`⚠️ 发现 ${emptyTranslations.length} 个空翻译值:`);
    emptyTranslations.slice(0, 5).forEach(key => {
      console.log(`  - ${key}`);
    });
    if (emptyTranslations.length > 5) {
      console.log(`  ... 还有 ${emptyTranslations.length - 5} 个空翻译值`);
    }
  } else {
    console.log('✅ 没有发现空翻译值');
  }

  // 统计结果
  const completeness = {
    zhKeys: zhKeys.length,
    enKeys: enKeys.length,
    totalKeys: totalKeys.size,
    missingInEn: missingInEn.length,
    missingInZh: missingInZh.length,
    criticalPages: criticalPages.length,
    missingCritical: missingCritical.length,
    emptyTranslations: emptyTranslations.length,
    completenessPercentage: Math.round(((totalKeys.size - Math.max(missingInEn.length, missingInZh.length)) / totalKeys.size) * 100)
  };

  console.log('\n📊 翻译文件完整性统计:');
  console.log(`  中文键值: ${completeness.zhKeys}`);
  console.log(`  英文键值: ${completeness.enKeys}`);
  console.log(`  总键值数: ${completeness.totalKeys}`);
  console.log(`  英文缺失: ${completeness.missingInEn}`);
  console.log(`  中文缺失: ${completeness.missingInZh}`);
  console.log(`  关键页缺失: ${completeness.missingCritical}`);
  console.log(`  空翻译值: ${completeness.emptyTranslations}`);
  console.log(`  完整性: ${completeness.completenessPercentage}%`);

  return completeness;
}

checkTranslationCompleteness();