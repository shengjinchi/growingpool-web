const fs = require('fs');
const path = require('path');

// 网站基础配置
const SITE_URL = 'https://www.shengjinchi.com';
const PUBLIC_DIR = path.join(__dirname, '../public');

// 网站页面列表
const pages = [
  // 主要页面
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/splan/join-us', changefreq: 'weekly', priority: 0.9 },
  { url: '/splan/donate', changefreq: 'weekly', priority: 0.8 },
  { url: '/splan/faq', changefreq: 'monthly', priority: 0.8 },
  { url: '/splan/psychology-test', changefreq: 'monthly', priority: 0.7 },
  { url: '/splan/blog', changefreq: 'weekly', priority: 0.8 },

  // 功能页面
  { url: '/live-trading', changefreq: 'daily', priority: 0.9 },
  { url: '/dashboard', changefreq: 'monthly', priority: 0.7 },
  { url: '/economic-calendar', changefreq: 'daily', priority: 0.8 },
  { url: '/tools/position-calculator', changefreq: 'monthly', priority: 0.6 },

  // 教育页面
  { url: '/education', changefreq: 'monthly', priority: 0.7 },

  // 其他重要页面
  { url: '/about', changefreq: 'monthly', priority: 0.6 },
  { url: '/contact', changefreq: 'monthly', priority: 0.5 },
];

// 生成sitemap XML
function generateSitemap() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  pages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${page.url}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  return xml;
}

// 写入sitemap文件
function writeSitemap() {
  const sitemap = generateSitemap();
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');

  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log('✅ sitemap.xml 生成成功！');
  console.log(`📍 位置: ${sitemapPath}`);
  console.log(`📊 包含 ${pages.length} 个页面`);

  // 同时生成sitemap索引文件
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

  const sitemapIndexPath = path.join(PUBLIC_DIR, 'sitemap-index.xml');
  fs.writeFileSync(sitemapIndexPath, sitemapIndex, 'utf8');
  console.log('✅ sitemap-index.xml 生成成功！');
}

// 执行生成
writeSitemap();