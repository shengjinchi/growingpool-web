const fs = require('fs');
const path = require('path');

// 需要检查的组件文件
const componentFiles = [
  '../src/app/[locale]/(portal)/(site)/page.tsx',
  '../src/components/custom/BrandSlogans.tsx',
  '../src/components/custom/CandidateRequirements.tsx',
  '../src/components/custom/Testimonials.tsx',
  '../src/components/custom/InterviewCTA.tsx'
];

function detectHardcodedContent() {
  console.log('🔍 检测硬编码中文内容...');

  componentFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');

      // 查找中文硬编码（排除翻译函数调用）
      const hardcodedChinese = content.match(/[^`'"t\(]([\u4e00-\u9fff]+)/g);

      if (hardcodedChinese && hardcodedChinese.length > 0) {
        console.log(`\n📁 文件: ${filePath}`);
        console.log(`🔤 发现硬编码中文内容:`);
        hardcodedChinese.forEach((text, index) => {
          console.log(`  ${index + 1}. ${text.trim()}`);
        });
      }
    }
  });

  console.log('\n✅ 硬编码内容检测完成');
}

detectHardcodedContent();