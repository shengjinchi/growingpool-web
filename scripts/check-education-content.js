const fs = require('fs');
const path = require('path');

// 教育页面内容映射（仅需验证完整性）
const educationPages = [
  'bollinger-bands',
  'breakout-trading',
  'broker-selection-guide',
  'candlestick-patterns',
  'currency-pairs-guide',
  'day-trading',
  'ema-moving-averages',
  'forex-basics',
  'keltner-channels',
  'leverage-and-margin',
  'macd-indicator',
  'market-participants',
  'position-sizing',
  'price-action',
  'risk-management',
  'risk-reward',
  'rsi-indicator',
  'scalping',
  'spreads-and-commissions',
  'stop-loss-strategies',
  'support-resistance',
  'swing-trading',
  'trading-psychology',
  'trading-sessions-guide',
  'trend-following'
];

// 验证函数
function verifyEducationContent() {
  console.log('✅ 验证教育页面内容完整性...');

  educationPages.forEach(page => {
    const zhPage = path.join(__dirname, `../src/app/[locale]/(portal)/education/${page}/page.tsx`);
    const enPage = zhPage; // 同一文件，需要检查内容中的语言标记

    if (fs.existsSync(zhPage)) {
      const content = fs.readFileSync(zhPage, 'utf8');

      // 检查是否包含翻译函数调用
      const hasTranslation = /t\(['"`]/.test(content);
      const hasChinese = /[\u4e00-\u9fff]/.test(content);
      const hasEnglish = /[a-zA-Z]{3,}/.test(content);

      console.log(`📄 ${page}: 翻译函数=${hasTranslation ? '✅' : '❌'}, 中文=${hasChinese ? '✅' : '❌'}, 英文=${hasEnglish ? '✅' : '❌'}`);

      if (hasTranslation) {
        console.log(`  ✅ ${page} - 使用翻译函数，支持双语切换`);
      } else if (hasChinese && hasEnglish) {
        console.log(`  ✅ ${page} - 包含中英文内容`);
      } else {
        console.log(`  ⚠️  ${page} - 需要检查双语支持情况`);
      }
    } else {
      console.log(`❌ ${page} - 页面文件不存在`);
    }
  });

  console.log('✅ 教育页面内容验证完成');
}

verifyEducationContent();