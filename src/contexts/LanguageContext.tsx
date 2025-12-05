"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  mounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 完整翻译字典
const translations: Record<Language, Record<string, string>> = {
  zh: {
    // 品牌名
    'brand.name': '生金池',
    'brand.full': 'GrowingPool',

    // 导航栏
    'nav.home': '首页',
    'nav.training': '训练计划',
    'nav.tradingTools': '工具',
    'nav.blog': '博客',
    'nav.psychology': '心理测评',
    'nav.dashboard': '内部系统',
    'nav.faq': 'FAQ',
    'nav.membership': '捐赠',
    'nav.join': '立即报名',

    // Hero Section
    'hero.title': 'Professional FX Trader Training Platform',
    'hero.subtitle': '面向数字游民的交易人才培养专家',
    'hero.cta.learn': '交易训练计划',
    'hero.cta.dashboard': '进入内部系统',

    // Why Choose Section
    'why.title': '为什么选择生金池',
    'why.subtitle': '专业筛选和培养顶尖交易员，在世界的任何角落与我们共同管理基金',

    // Advantages
    'advantage.selection.title': '精准筛选',
    'advantage.selection.desc': '30个交易日内判断你是否适合成为交易员，节省时间。不适合我们会如实告知，适合则全力培养。',
    'advantage.growth.title': '快速成长',
    'advantage.growth.desc': '专业的标准化培养计划，让合适人选在30个交易日内达到专家级交易水平，这对个人学习者来说，往往需要10-20年的时间。',
    'advantage.commission.title': '共同管理',
    'advantage.commission.desc': '优秀的交易员将与我们一同管理基金，并随管理规模变化，提供多阶段的丰厚的奖学金',

    // Comparison
    'comparison.vs': 'VS 传统交易培训',
    'comparison.growingpool': '生金池',
    'comparison.traditional': '传统培训机构',
    'comparison.free': '学习免费 - 无培训费用',
    'comparison.practical': '实战培养 - 30交易日系统化交易员职业训练',
    'comparison.selection': '精准筛选 - 只接受特定人群，不适合直接劝退，节省时间',
    'comparison.funding': '资金支持 - 通过考核后与我们共同管理基金',
    'comparison.share': '协同工作 - 长期、即时的在线沟通',
    'comparison.career': '职业发展 - 成为独立交易员或基金管理人',
    'comparison.discipline': '严格管理 - 机构化专业管理，严格遵守职业素养',
    'comparison.highfee': '高额学费 - 培训费用平均>10,000 USD(约70,000 CNY）',
    'comparison.theory': '理论为主 - 缺少完整可执行的交易系统',
    'comparison.acceptall': '来者不拒 - 缴纳学费即开始学习',
    'comparison.selffunded': '自负盈亏 - 交易自己的资金',
    'comparison.nosupport': '无后续支持 - 培训结束即服务结束',
    'comparison.noplan': '无职业规划 - 无法提供任何职业化机会',
    'comparison.loose': '松散管理 - 容易形成不良交易习惯',
    'comparison.emphasis': '我们致力于用最短的时间，从大量人群中，筛选出少数适合成为顶尖交易员的人才，进行培养并给予全面支持',

    // Career Path
    'career.title': '职业化训练路径',
    'career.subtitle': '30个交易日系统化培养，从新手到合格交易员的完整路径',
    'career.stage1.days': '第1-5个交易日',
    'career.stage1.title': '规则学习',
    'career.stage1.desc': '完成15个标准进场点练习，熟悉交易系统基本规则',
    'career.stage1.warning': ' 5天内未通过规则考核将被劝退',
    'career.stage2.days': '第6-20个交易日',
    'career.stage2.title': '盈利练习',
    'career.stage2.desc': '找到适合自己的交易品种，按照盈利考核标准进行练习',
    'career.stage2.tip': ' 保持操作一致性，不错单、不漏单、不亏损',
    'career.stage3.days': '第21-30个交易日',
    'career.stage3.title': '盈利考核',
    'career.stage3.desc': '连续10个交易日，每天做到不错单、不漏单、不亏损',
    'career.stage3.success': ' 通过考核，进入小额账户稳定性测试阶段',
    'career.stage4.path': '小额账户  大额矩阵',
    'career.stage4.title': '合格交易员',
    'career.stage4.desc': '20个交易日小额账户稳定性测试通过后，正式开始管理小额账户，可选择进入大额矩阵',
    'career.stage4.goal': ' 弹性工作时间，开始独立交易员生涯',

    // Requirements
    'req.title': '你是否符合基本条件',
    'req.subtitle': '严格的准入标准 - 确保培训质量 - 每个人只有一次进入的机会',
    'req.profile.title': ' 人群画像',
    'req.profile.education': '学历与年龄',
    'req.profile.education.desc': '中国大陆大学专科同等学历及以上，年龄在35岁以下',
    'req.profile.psychology': '心理素质',
    'req.profile.psychology.desc': '认真、专注、细心、耐心、心理健康',
    'req.profile.character': '性格特质',
    'req.profile.character.desc': '理性、稳重、纪律严明且执行力强',
    'req.time.title': ' 时间与环境',
    'req.time.commitment': '时间投入',
    'req.time.commitment.desc': '连续30个交易日（约45自然日）',
    'req.time.equipment': '设备要求',
    'req.time.equipment.desc': 'Windows系统设备',
    'req.time.environment': '环境要求',
    'req.time.environment.desc': '独立的、不被打扰的交易环境，',
    'req.online.title': ' 在线时间',
    'req.online.hours': '交易时段',
    'req.online.hours.desc': '周一到周五 13:30-21:30',
    'req.online.debrief': '非交易时段',
    'req.online.debrief.desc': '以芝加哥商品交易所（CME）非交易时段为准',
    'req.notice.title': '重要提醒',
    'req.notice.once': '每个人只有一次进入的机会，',
    'req.notice.desc': '请在充分了解并确认自己符合全部条件后再申请。',
    'req.notice.philosophy': '我们专注培养真正适合交易的人才。在交易的世界里，有些人天生不适合。他们急于求成，却不知自己真正追求什么；他们只瞥一眼表象，便止步不前，无法洞察事物的深层本质。如果你属于这一类，或许其他行业更能发挥你的长处。',

    // Video Section
    'video.title': '了解交易员职业',
    'video.subtitle': '交易员并不神秘！ - 通过纪录片深入了解这个职业',
    'video.doc1.title': '百万美金交易员',
    'video.doc1.rating': '豆瓣评分 8.7',
    'video.doc1.desc': '这部纪录片展现了交易员培训的真实过程，从筛选到培养，再到成为职业交易员的完整路径。了解交易员这个职业的真实面貌，以及成为顶尖交易员需要具备的素质。',
    'video.doc1.cta': '观看视频 ',
    'video.doc2.title': '交易员：转瞬百万',
    'video.doc2.rating': '豆瓣评分 8.0',
    'video.doc2.desc': '深入展示交易员的日常工作和心理压力，揭示在二级市场中如何做出快速决策，以及职业交易员所需要的心理素质和专业技能。这是一个高压但充满机会的职业。',
    'video.doc2.cta': '观看视频 ',

    // Student Showcase
    'showcase.title': '学员真实收益展示',
    'showcase.junior': '初级交易员',
    'showcase.intermediate': '中级交易员',
    'showcase.senior': '资深交易员',
    'showcase.income.range': '月收入范围',
    'showcase.screenshots.title': '学员实盘收益截图',
    'showcase.screenshots.note': '以上为学员真实交易收益截图',

    // CTA Section
    'cta.title': '准备好开启你的交易员生涯了吗？',
    'cta.subtitle': '记住：最大风险是淘汰，成本是时间。准备就绪，预约面试。通过后，开始训练。',
    'cta.notice.title': '特别提示',
    'cta.passrate': '最终通过率',
    'cta.passrate.value': '10%',
    'cta.passrate.desc': '我们只留下最优秀的人选',
    'cta.elimination': '淘汰原因',
    'cta.elimination.reason': '不适合这一行业',
    'cta.opportunity': '机会次数',
    'cta.opportunity.value': '只有一次',
    'cta.time.cost': '时间成本',
    'cta.time.value': '45天',
    'cta.money.cost': '金钱成本',
    'cta.money.value': '训练免费',
    'cta.button.interview': '立即预约面试',
    'cta.button.note': '请在充分了解并确认自己符合全部条件后再申请',

    // Footer
    'footer.about': '面向数字游民的交易人才培养专家，用专业的方法筛选真正适合的交易人才，培养顶尖交易员。',
    'footer.nav.title': '快速导航',
    'footer.resources.title': '资源',
    'footer.contact.title': '联系我们',
    'footer.contact.focus': '专注交易培训',
    'footer.contact.cultivate': '培养职业交易员',
    'footer.contact.apply': '立即申请',
    'footer.copyright': '© 生金池 · 面向数字游民的交易人才培养专家 · growingpool.com',
    'footer.disclaimer': ' 交易有风险，投资需谨慎 · 本站内容仅供学习参考，不构成投资建议',
    'footer.partners.title': '合作伙伴',
    'footer.partners.brokers': '合作经纪商',
    'footer.partners.platforms': '合作平台',
    'footer.partners.propfirms': '自营交易公司',
    'footer.partners.tools': '交易工具',
    'footer.partners.copytrading': '跟单平台',
    'footer.partners.referral': '推荐码',

    // Join Us Page
    'joinus.hero.badge': 'GrowingPool',
    'joinus.hero.title1': '生金池',
    'joinus.hero.title2': '交易员培训计划',
    'joinus.hero.subtitle': '专业筛选和培养顶尖交易员，在世界的任何角落与我们共同管理基金',
    'joinus.hero.stat1': '通过率',
    'joinus.hero.stat2': '完整培训',
    'joinus.hero.stat3': '奖学金',
    'joinus.hero.stat1.value': '10%-15%',
    'joinus.hero.stat2.value': '30交易日',
    'joinus.hero.stat3.value': '多阶段',

    'joinus.welcome.title': '欢迎你！',
    'joinus.welcome.intro': '无论你通过什么方式来到这里，在开始前请先了解以下内容，认为自己各方面条件都满足的情况下再选择进入。',
    'joinus.welcome.warning': '每个人只有一次参与的机会',
    'joinus.welcome.desc': '与传统机构不同，我们希望在严格的风险控制和妥善的资金管理的前提下，给予我们的成员尽可能高的自由度。在世界的任何角落，你都可以随心所欲，在阿尔卑斯山滑雪，夏威夷游泳或北海道发呆……金钱会源源不断地自动流入你的口袋。从你通过考核那一天起，你就可以遨游在世界的任何一个角落，旅行、生活或工作，哪怕是漫无目的的活着；既不需要为日常的琐事烦恼，也不需要看任何人的脸色行事，自由自在心无旁骛的同时，尽可能地把生命旅程延展……',

    'joinus.about.title': '关于我们',
    'joinus.about.desc1': '我们是一个面向数字游民，专注于培养顶尖交易员的组织，我们致力于用最短的时间，从大量人群中筛选出少数适合成为交易员的人才并进行培养并给予全周期支持。',
    'joinus.about.desc2': '简单来说，我们在寻找优秀的交易员，但绝不是从事交易多年，有经验的交易员。因为优秀的交易员通常并不会在人才市场上流通，只能亲自培养。所以换句话说，我们在亲自筛选和培养我们的交易员，并致力于将合格的交易员培养成基金管理人。',
    'joinus.about.timeline': '我们将在 30个交易日(约45个自然日) 内判断新人是否是做交易员的可塑之才：',
    'joinus.about.phase1.title': '前20个交易日',
    'joinus.about.phase1.desc': '包含5天的交易基本规则学习和15天的盈利练习',
    'joinus.about.phase2.title': '后10个交易日',
    'joinus.about.phase2.desc': '连续的盈利考核测试',
    'joinus.about.notfit.title': '若不是',
    'joinus.about.notfit.desc': '我们会如实告知，结束训练',
    'joinus.about.fit.title': '若是',
    'joinus.about.fit.desc': '我们会为其分配账户，以独立交易员的身份为起点，招募进入我们的组织',

    'joinus.videos.title': '了解交易员职业',
    'joinus.videos.desc': '交易员并不神秘！推荐通过以下纪录片更进一步了解本职业：',
    'joinus.videos.doc1.rating': '豆瓣评分 8.7',
    'joinus.videos.doc1.desc': '展现交易员培训的真实过程，从筛选到培养，再到成为职业交易员的完整路径',
    'joinus.videos.doc1.cta': '观看纪录片 ',
    'joinus.videos.doc2.rating': '豆瓣评分 8.0',
    'joinus.videos.doc2.desc': '深入展示交易员的日常工作和心理压力，揭示职业交易员所需要的心理素质和专业技能',
    'joinus.videos.doc2.cta': '观看纪录片 ',

    'joinus.profile.title': '你的样子',
    'joinus.profile.unsuited': '在交易的世界里，有些人天生不适合。他们急于求成，却不知自己真正追求什么；他们只瞥一眼表象，便止步不前，无法洞察事物的深层本质；或者，他们压根就该选择那些"稳定"的岗位——当一天和尚，敲一天钟，过着可预测的日子。这不是贬低，而是现实：交易如战场，需要冷静、洞察与韧性。如果你不具备这些特质，或许其他行业更能发挥你的长处。',
    'joinus.profile.income.title': '关于收入、社保、底薪和薪资结构',
    'joinus.profile.income.desc': '任何盈利导向的组织，都不会做亏本买卖。在我们这个极简行业，所有价值都源于二级市场的买卖差价——简单、直接、残酷。在你证明盈利能力（通过考核）之前，我们不会投入一分钱。考核通过后，你所获得的奖励，也不会大于你在交易上产生的利润"。',
    'joinus.profile.basic.title': '基本条件',
    'joinus.profile.basic.1': '中国大陆大学专科同等学历及以上，年龄在35岁以下',
    'joinus.profile.basic.2': '认真、专注、细心、耐心、心理健康',
    'joinus.profile.basic.3': '能够连续30个交易日(约45自然日)参与训练',
    'joinus.profile.basic.4': 'Windows系统设备，独立不受打扰的交易环境',
    'joinus.profile.time.title': '时间要求',
    'joinus.profile.time.1': '周一到周五，每天最低保证 13:30 - 21:30 在线',
    'joinus.profile.time.2': '休息时段，参考芝加哥商品交易所（CME）非交易时段',

    'joinus.plan.title': '成长计划',
    'joinus.plan.phase0.days': '训练前准备',
    'joinus.plan.phase0.title': '学习内部交易系统课程',
    'joinus.plan.phase0.desc': '通过面试筛选后，你将获得一份内部交易系统课程，请在7个自然日内完成课程学习，并完成学习笔记',
    'joinus.plan.phase0.note': ' 本阶段不计入30个交易日内，如未能提交学习笔记，将无法进入正式训练阶段',
    'joinus.plan.phase1.days': '第 1 - 5 个交易日',
    'joinus.plan.phase1.title': '熟悉交易系统与规则',
    'joinus.plan.phase1.desc': '确定交易品种（固定2个品种），实操中完善学习笔记（每日复盘）',
    'joinus.plan.phase1.req': '一阶段目标：每天完成12笔订单，不错单，不漏单，合规操作。',
    'joinus.plan.phase1.warning': ' 有任何问题请及时与团队教练沟通，如果5 个交易日后无法完成一阶段目标，提前终止训练',
    'joinus.plan.phase2.days': '第 6 - 20 个交易日',
    'joinus.plan.phase2.title': '盈利练习',
    'joinus.plan.phase2.desc': '务必不要想法太多，找到适合自己的品种',
    'joinus.plan.phase2.week1': '（第6 - 10个交易日）：每天完成不少于8笔订单，不错单、不漏单、不亏损。',
    'joinus.plan.phase2.week2': '（第11 - 15个交易日）：可以提前发起考核，也可以选择继续按此标准练习',
    'joinus.plan.phase2.week3': '（第16 - 20个交易日）：与上周相同，可以提前发起考核，本周练习结束后，将强制进入考核阶段',
    'joinus.plan.phase3.days': '第 21 - 30 个交易日',
    'joinus.plan.phase3.title': '连续盈利考核测试',
    'joinus.plan.phase3.desc': '盈利考核要求：连续 10 个交易日，每天完成不少于8笔订单，所选交易品种不错单、不漏单、不亏损。',
    'joinus.plan.phase3.req': '考核统一在专用云电脑环境下进行，确定参与考核的学员需承担云电脑标准资费（人民币102元/15天），请知悉。',
    'joinus.plan.phase3.warning': ' ⚠️不能完成连续 10 个交易日盈利，考核失败',
    'joinus.plan.phase4.days': '小额实盘 20个交易日',
    'joinus.plan.phase4.title': '小额实盘稳定性测试',
    'joinus.plan.phase4.desc': '小额实盘仍旧只有一次机会，请珍惜。同时开放更大级别交易学习机会，请根据交易风险偏好与团队教练沟通。',
    'joinus.plan.phase4.1': '基本保持盈利考核要求，开放部分自由度：1-3 品种，每日单量不少于5笔，不错单，不漏单，允许单日有亏损，但按周计算必须盈利。',
    'joinus.plan.phase4.2': '认为自己盈利能力不稳定的，可以申请 1-4 周的小额仿真模拟盘固化练习。',
    'joinus.plan.phase4.warning': ' 重要：小额实盘账户：日回撤不超过 20%，周总回撤不得超过 30%，超过即劝退',
    'joinus.plan.phase5.days': '合格交易员阶段',
    'joinus.plan.phase5.title': '小额账户or大额矩阵',
    'joinus.plan.phase5.desc': '小额实盘 20 交易日稳定性测试通过，正式开始管理小额账户，或选择进入大额矩阵',
    'joinus.plan.phase5.1': ' 弹性工作时间，每天不限制交易量，保证每日不亏的底线即可',
    'joinus.plan.phase5.2': ' 资金规模与仓位：随着交易能力的不断稳定，仓位大小逐步提升',
    'joinus.plan.phase5.3': ' 小额实盘：100 USD账户',
    'joinus.plan.phase5.4': ' 大额实盘：依据小额实盘的表现进行分配',
    'joinus.plan.phase5.5': ' 仓位增长：随着盈利曲线的上升，逐步增加仓位规模，逐步增加奖励比例',

    'joinus.rules.title': '交易铁律',
    'joinus.rules.desc': '交易纪律就像法律法规，触碰一次就会被标上不信任的标签，一旦触碰，就再也无法进入矩阵团队，第二次触碰红线，直接劝退离开团队。交易就像做手术，务必严肃，容不得任何不遵守规则的人。',
    'joinus.rules.trading.title': '交易规则红线',
    'joinus.rules.trading.1': '硬止损线不能移动，位置务必设置正确',
    'joinus.rules.trading.2': '只有标准和激进两种进场方式',
    'joinus.rules.trading.3': '不能跨越红折线持仓',
    'joinus.rules.trading.4': '止损和出场必须满足规则条件',
    'joinus.rules.trading.5': '5倍以上利润才能使用自动止盈线',
    'joinus.rules.meeting.title': '团队纪律红线',
    'joinus.rules.meeting.1': '学员之间不得加微信、电话等一切联系方式',
    'joinus.rules.meeting.2': '会议室内保持严肃，只谈论会议预先设定的话题',

    'joinus.final.title': '写在最后',
    'joinus.final.motto': '寻找同频的少数人',
    'joinus.final.p1': '我们这是交易员专业训练营，在这里，我们将严格按照机构专业化管理的方式将你训练成顶尖的交易员。',
    'joinus.final.p2': '所以，我们会非常认真训练你们，但不能盈利的交易员不可能获得实盘交易的机会。',
    'joinus.final.p3': '通过考核后，我们就是合作共赢的关系。你可以选择独立作战，也可以选择和战友背靠背作战，我们不是公司员工隶属的关系，你是一个独立的创业者，独立的个体。',
    'joinus.final.highlight': '起始 60% 利得会奖励给你个人，对于最优秀的交易员，将单独设计奖励计划',
    'joinus.final.p4': '免费的也许会是比钱更"贵"的？你下决定决心并且被选中，一旦开始职业交易训练，请全身心投入。',

    'joinus.cta.title': '准备好了吗？',
    'joinus.cta.desc': '如果你愿意给自己一次实现人生理想的机会，那么：',
    'joinus.cta.psychology': '完成心理测评',
    'joinus.cta.interview': '预约面试',

    // FAQ Page
    'faq.hero.badge': 'FREQUENTLY ASKED QUESTIONS',
    'faq.hero.title': '常见问题解答',
    'faq.hero.subtitle': 'FAQ',
    'faq.hero.desc': '开启职业交易之路前，先读懂这些问题',
    'faq.search.placeholder': '搜索问题...',
    'faq.search.button': '搜索',
    'faq.category.course': '关于 GrowingPool',
    'faq.category.learning': '关于培训',
    'faq.category.pricing': '关于收入与分润',
    'faq.category.support': '交易铁律',
    'faq.category.other': '其他问题',
    'faq.contact.title': '没有找到答案？',
    'faq.contact.desc': '联系我们的团队长，我们将尽快为您解答疑问',
    'faq.contact.button': '联系团队长',
    'faq.contact.modal.title': '咨询团队长',

    // Donate Page
    'donate.hero.badge': 'GLOBAL TRIAL MEMBERSHIP',
    'donate.hero.title1': '全球试用会员',
    'donate.hero.title2': '招募计划',
    'donate.hero.desc': '自2025年10月1日起全球范围接受捐赠成为90天试用会员',
    'donate.hero.stat1': '试用期',
    'donate.hero.stat2': '教练陪跑',
    'donate.hero.stat3': '晋级机会',
    'donate.hero.stat1.value': '90天',
    'donate.hero.stat2.value': '21天',
    'donate.hero.stat3.value': '终身',

    'donate.amount.badge': 'CURRENT DONATION AMOUNT',
    'donate.amount.warning': '金额每日自动增加 $5',
    'donate.amount.start': '起始金额',
    'donate.amount.daily': '每日增长',
    'donate.amount.payment': '支付方式',
    'donate.amount.crypto': '仅加密货币',

    'donate.benefits.title': '试用会员权益',
    'donate.benefits.desc': '90天专业培训，开启职业交易员之路',
    'donate.benefits.a.title': '顶尖交易员集训',
    'donate.benefits.a.desc': '参与会员社区的顶尖交易员集训课程，学习专业交易技术和策略，掌握市场核心规律',
    'donate.benefits.b.title': '21天教练陪跑',
    'donate.benefits.b.desc': '专业教练一对一指导，21天密集训练，快速提升交易能力，避免常见错误',
    'donate.benefits.c.title': '挑战晋级机会',
    'donate.benefits.c.desc': '成绩优异可自愿参与挑战，挑战成功获得终身进阶受训资格及实盘操作权',

    'donate.rewards.title': '挑战成功奖励',
    'donate.rewards.desc': '证明自己的实力，获得终身职业发展机会',
    'donate.rewards.a.title': '终身进阶受训',
    'donate.rewards.a.desc': '获得终身进阶培训资格，持续提升交易技能，成为顶尖交易员，享受持续的专业指导',
    'donate.rewards.b.title': '1-20万$ MOM操作权',
    'donate.rewards.b.desc': '获得 1万到20万美元的资金管理权限，在顶尖矩阵俱乐部进行实盘操作，实现财富增长',

    'donate.how.title': '如何进行捐赠',
    'donate.how.desc': '完成心理测评后，通过邮件联系我们获取捐赠地址',
    'donate.how.flow.title': '捐赠流程',
    'donate.how.step1.title': '完成心理测评',
    'donate.how.step1.desc': '首先完成心理测评，确保您具备成为职业交易员的心理素质',
    'donate.how.step2.title': '发送邮件申请',
    'donate.how.step2.desc': '邮件至 growingpool@gmail.com，说明您的意向',
    'donate.how.step3.title': '获取捐赠地址',
    'donate.how.step3.desc': '我们将通过邮件回复您具体的 USDT/USDC 捐赠地址',
    'donate.how.step4.title': '完成捐赠并开始培训',
    'donate.how.step4.desc': '按照提供的地址完成捐赠后，即可开始90天试用会员培训',
    'donate.how.cta.test': '立即完成心理测评',
    'donate.how.cta.email': '发送邮件申请',

    'donate.notice.title': '重要说明',
    'donate.notice.1': '捐赠将默认为私人自愿行为，无任何商业承诺和约束力',
    'donate.notice.2': '试用会员期限：90天',
    'donate.notice.3': '参与条件：需完成心理测评并通过初步筛选',
    'donate.notice.4': '挑战机会：成绩优异者可自愿参与，非强制要求',

    'donate.modal.title': '申请成为会员',

    // Psychology Test Page
    'psytest.welcome.title': '交易员心理测试',
    'psytest.welcome.subtitle': '全面评估您的交易心理素质',
    'psytest.welcome.duration.label': '时长',
    'psytest.welcome.duration.title': '测试时长',
    'psytest.welcome.duration.value': '约 5-8 分钟',
    'psytest.welcome.questions.label': '题目',
    'psytest.welcome.questions.title': '题目数量',
    'psytest.welcome.questions.value': '20 道题目',
    'psytest.welcome.dimensions.label': '维度',
    'psytest.welcome.dimensions.title': '评估维度',
    'psytest.welcome.dimensions.value': '5 个核心维度',
    'psytest.welcome.includes': '测试维度包括：',
    'psytest.welcome.start': '开始测试',
    'psytest.welcome.note': '请根据您的真实感受作答，没有对错之分',

    'psytest.dimension.risk': '风险承受能力',
    'psytest.dimension.emotion': '情绪控制能力',
    'psytest.dimension.decision': '决策能力',
    'psytest.dimension.discipline': '纪律性',
    'psytest.dimension.stress': '压力管理',

    'psytest.progress.question': '问题',

    'psytest.result.complete': '🎉 测评完成',
    'psytest.result.title': '测试完成',
    'psytest.result.subtitle': '您的交易心理素质评估报告',
    'psytest.result.overall': '综合得分',
    'psytest.result.dimensions.title': '各维度得分',
    'psytest.result.recommendations.title': '改进建议',
    'psytest.result.rec1.label': '学习',
    'psytest.result.rec1.title': '系统学习',
    'psytest.result.rec1.text': '深入学习交易心理学和行为金融学，理解交易中的心理陷阱和认知偏差。',
    'psytest.result.rec2.label': '记录',
    'psytest.result.rec2.title': '记录交易日志',
    'psytest.result.rec2.text': '详细记录每笔交易的心理状态、决策过程和结果，定期回顾总结。',
    'psytest.result.rec3.label': '训练',
    'psytest.result.rec3.title': '模拟训练',
    'psytest.result.rec3.text': '通过模拟交易来锻炼决策能力和情绪控制，在无风险环境中提升技能。',
    'psytest.result.rec4.label': '专注',
    'psytest.result.rec4.title': '冥想练习',
    'psytest.result.rec4.text': '每天进行10-15分钟的冥想，提升专注力和情绪管理能力。',
    'psytest.result.retry': '重新测试',
    'psytest.result.retry.confirm': '确定要重新开始测试吗？当前结果将会丢失。',

    'psytest.level.excellent': '优秀交易员',
    'psytest.level.excellent.desc': '您展现出了出色的交易心理素质。在风险控制、情绪管理、决策能力等方面都表现优异。继续保持这种专业的交易态度，您很可能成为一名成功的交易员。',
    'psytest.level.good': '良好交易员',
    'psytest.level.good.desc': '您具备较好的交易心理素质，在多个维度上表现良好。通过持续学习和实践，关注弱项的改进，您有很大的提升空间。',
    'psytest.level.pass': '合格交易员',
    'psytest.level.pass.desc': '您具备基本的交易心理素质，但在某些方面还需要加强。建议重点关注得分较低的维度，通过学习和训练来提升。',
    'psytest.level.improve': '需要提升',
    'psytest.level.improve.desc': '您的交易心理素质还有很大的提升空间。建议在进行实盘交易前，先系统学习交易心理学，并通过模拟交易来锻炼心理素质。',

    // Email Contact Modal
    'email.default.title': '交易员训练面试',
    'email.subject': '交易员训练+你的真实姓名',
    'email.description': '请发送您的简历到以下邮箱,我们会尽快与您联系：',
    'email.address.label': '邮箱地址：',
    'email.copy': '复制',
    'email.copied': '邮箱地址已复制到剪贴板',
    'email.subject.label': '邮件主题：',
    'email.tip': '提示：',
    'email.tip.text': '请在邮件中包含您的基本信息、教育背景、以及为什么想成为交易员。',
    'email.send': '打开邮件客户端',
    'email.close': '关闭',

    // Trading Dashboard
    'dashboard.title': '内部系统',
    'dashboard.subtitle': '交易员内部系统',
    'dashboard.logout': '退出登录',
    'dashboard.tab.backtest': '回测分析',
    'dashboard.tab.live': '实时交易',
    'dashboard.tab.tianti': '天梯',
    'dashboard.tab.config': '策略配置',
    'dashboard.tab.users': '用户管理',
    'dashboard.tab.function1': '学前准备',
    'dashboard.tab.function2': '功能2',
    'dashboard.tab.function3': '功能3',
    'dashboard.tianti.refresh': '刷新信号',
    // 学前准备
    'dashboard.preparation.title': '学前准备',
    'dashboard.preparation.part1.title': '下载加密播放器&加密视频教程',
    'dashboard.preparation.part1.player': '下载加密播放器',
    'dashboard.preparation.part1.videos': '下载加密视频教程',
    'dashboard.preparation.part2.title': '如何播放加密教程？',
    'dashboard.preparation.part2.step1': '打开播放器，任意播放一集课程（解压后视频格式为.gem）',
    'dashboard.preparation.part2.step2': '此时会弹出一个窗口，把上面显示的机器码（Machine Code）复制下来，发送给团队教练',
    'dashboard.preparation.part2.step3': '把团队教练发给你的播放密码粘贴到下方播放密码（Play Password）文本框内，点击播放（Play）即可播放视频。',
    'dashboard.preparation.part2.step4': '如果没有反应，也没有提示密码错误，请卸载播放器重新安装，再用同样的播放密码尝试。',
    'dashboard.preparation.part3.title': '完成学习笔记',
    'dashboard.preparation.part3.step1': '认真学习课程内容，并整理成文字版学习笔记（电子版或手写均可）',
    'dashboard.preparation.part3.focus': '重点提示：三要素，标准进场点，激进进场点，二号位，硬止损，标准止损，保守止损等等...的准确定义/如何制定交易计划...',
    'dashboard.preparation.part3.button': '我已完成学习笔记',
    'dashboard.preparation.part4.title': '下载并安装交易系统',
    'dashboard.preparation.part4.download': '下载交易系统',
    'dashboard.preparation.part4.install.title': '安装顺序：',
    'dashboard.preparation.part4.install.step1': '双击"tickmill4setup.exe"安装tickmill MT4客户端，一切选择默认即可。',
    'dashboard.preparation.part4.install.step2': '完成安装后，立刻关闭tickmill客户端。',
    'dashboard.preparation.part4.install.step3': '双击"交易系统.exe"安装。路径选择默认。',
    'dashboard.preparation.part4.install.step4': '在注册窗口输入个人信息（必填项：姓名，微信，手机，邮箱）。推荐人：曾剑宏。',
    'dashboard.preparation.part4.install.step5': '填写完毕后，点击下方"试用"按钮。提示："软件已过租用期"。点击"确定"。关闭软件。',
    'dashboard.preparation.part4.install.step6': '告知团队教练你已点击试用。',
    'dashboard.preparation.part4.install.step7': '团队长回复系统已激活后，再次双击"交易系统.exe"安装。确认个人信息与之前填写的相同，再次点击"试用"。',
    'dashboard.preparation.part4.install.step8': '提示"MT4指标等已安装成功"即可。桌面会新增一个"交易模板"图标',
    'dashboard.preparation.part4.install.step9': '双击桌面"交易模板"图标，填写团队教练提供的模拟账户，密码，正确选择对应服务器进行登录。',
    'dashboard.preparation.part4.install.step10': '解压缩"模板.zip"文件，复制里面的"MQL4和"templates"两个文件夹',
    'dashboard.preparation.part4.install.step11': '打开交易系统客户端左上角选择"文件"——"打开数据文件夹"，把两个文件夹粘贴进去，如果提示覆盖，选"是"。',
    'dashboard.preparation.part4.install.step12': '关闭交易系统，重新通过桌面"交易模板"图标打开，尝试加载模板，看是否正常显示。',
    'dashboard.preparation.part4.note': '提示：以后都要从"交易模板"图标进入交易系统，不要从"Tickmill"图标进入，否则模板可能无法正常显示。',
    'dashboard.footer.warning': ' 仅用于测试环境。实盘交易需要充分测试和风险评估。',
    'dashboard.footer.copyright': '2024-2025 © GrowingPool 专业外汇交易员培训平台',

    // Admin Login
    'login.title': '内部系统',
    'login.subtitle': '交易员信息管理',
    'login.username.label': '用户名',
    'login.username.placeholder': '请输入用户名',
    'login.password.label': '密码',
    'login.password.placeholder': '请输入密码',
    'login.error': '用户名或密码错误，请重试',
    'login.button': '登录',
    'login.back': '返回首页',

    // User Management
    'userManagement.title': '用户管理',
    'userManagement.subtitle': '管理系统用户和权限',
    'userManagement.createUser': '创建用户',
    'userManagement.table.username': '用户名',
    'userManagement.table.userGroup': '用户组',
    'userManagement.table.status': '状态',
    'userManagement.table.createdAt': '创建时间',
    'userManagement.table.lastLogin': '最后登录',
    'userManagement.table.actions': '操作',
    'userManagement.createModal.title': '创建新用户',
    'userManagement.createModal.username': '用户名',
    'userManagement.createModal.usernamePlaceholder': '请输入用户名',
    'userManagement.createModal.userGroup': '用户组',
    'userManagement.createModal.cancel': '取消',
    'userManagement.createModal.create': '创建',

    // Subscription Notification
    'notification.message1': '已联系团队长参加交易员培训',
    'notification.message2': '已成为试用会员',
    'notification.time': '刚刚',

    // 不适合人群 & 候选人期望 & 考察重点
    'qualification.title': '你是否符合基本条件？',
    'qualification.subtitle': '请认真评估自己是否具备成为职业交易员的基本条件',
    'unsuitable.title': '明确不适合的人群',
    'unsuitable.subtitle': '以下类型的候选人不适合我们的培训',
    'unsuitable.pressure': '经济压力大、指望交易快速变现的人',
    'unsuitable.pressure.desc': '交易需要时间积累和心态培养，急功近利只会导致失败',
    'unsuitable.gambler': '期望通过交易"暴富"或有"赌徒"心态的人',
    'unsuitable.gambler.desc': '职业交易是一项严肃的事业，需要理性和纪律，不是赌博',

    'expectations.title': '对候选人的期望',
    'expectations.subtitle': '我们希望您具备以下特质',
    'expectations.mindset': '拥有平和的心态、果决的执行力',
    'expectations.mindset.desc': '能够冷静面对市场波动，果断执行交易计划',
    'expectations.stable': '当前无经济困扰，能将交易作为终身事业追求',
    'expectations.stable.desc': '有稳定的经济基础，可以专注于长期发展',
    'expectations.initiative': '具备高度主观能动性，认真对待培训',
    'expectations.initiative.desc': '主动学习，积极实践，对培训全力以赴',

    'assessment.title': '考察重点',
    'assessment.subtitle': '面试和培训将重点评估以下综合能力',
    'assessment.learning': '学习力',
    'assessment.learning.desc': '快速理解和掌握新知识的能力',
    'assessment.understanding': '理解力',
    'assessment.understanding.desc': '深入理解市场规律和交易逻辑',
    'assessment.execution': '执行力',
    'assessment.execution.desc': '严格执行交易计划和风险管理',
    'assessment.mentality': '心态',
    'assessment.mentality.desc': '保持稳定情绪，不受盈亏影响',
    'assessment.motivation': '交易动机',
    'assessment.motivation.desc': '正确的交易动机和职业追求',

    // Blog
    'blog.title': '交易博客',
    'blog.subtitle': '专业交易知识、实战经验与交易智慧分享',
    'blog.hero.badge': '专业交易知识',
    'blog.featured': '精选',
    'blog.minRead': '分钟阅读',
    'blog.noPosts': '暂无文章',
    'blog.notFound': '文章未找到',
    'blog.backToBlog': '返回博客',
    'blog.relatedPosts': '相关文章',
    'blog.cta.title': '准备开始您的交易之旅？',
    'blog.cta.subtitle': '加入GrowingPool，接受专业的交易员培训',
    'blog.cta.button': '立即加入',

    // Tianti Panel
    'tianti.autoRefresh': '自动刷新',
    'tianti.manualRefresh': '手动刷新',
    'tianti.countdown': '倒计时: {0}秒',
    'tianti.refreshStopped': '自动刷新已停止',
    'tianti.autoRefreshNote': '图片将每60秒自动刷新一次',
  },
  en: {
    // Brand Name
    'brand.name': 'GrowingPool',
    'brand.full': 'GrowingPool',

    // Navigation
    'nav.home': 'Home',
    'nav.training': 'Free Training',
    'nav.tradingTools': 'Tools',
    'nav.blog': 'Blog',
    'nav.psychology': 'Test',
    'nav.dashboard': 'Quant',
    'nav.faq': 'FAQ',
    'nav.membership': 'Donate',
    'nav.join': 'Join Now',

    // Hero Section
    'hero.title': 'Professional Trader Training Platform',
    'hero.subtitle': 'Digital Nomad Trader Training Expert - Professionally screening and cultivating truly suitable trading talent',
    'hero.cta.learn': 'Forex Trader Training',
    'hero.cta.dashboard': 'Internal System',

    // Why Choose Section
    'why.title': 'Why Choose Sheng Jin Chi (GrowingPool)',
    'why.subtitle': 'Professional screening and cultivating top trading talent, managing funds together with us from any corner of the world',

    // Advantages
    'advantage.selection.title': 'Precise Screening',
    'advantage.selection.desc': 'Determine if you are suitable to become a trader within 30 trading days. We will honestly inform you if not suitable, and fully cultivate if suitable.',
    'advantage.growth.title': 'Rapid Growth',
    'advantage.growth.desc': 'Professional standardized training program allows suitable candidates to reach expert-level trading ability in 30 trading days, which typically takes 10-20 years for individual learners.',
    'advantage.commission.title': 'Joint Management',
    'advantage.commission.desc': 'Excellent traders will manage funds with us, with multi-stage generous scholarships provided as the management scale changes.',

    // Comparison
    'comparison.vs': 'VS Traditional Forex Training',
    'comparison.growingpool': 'GrowingPool',
    'comparison.traditional': 'Traditional Training Institutions',
    'comparison.free': 'Completely Free - No Training Fees',
    'comparison.practical': 'Practical Training - 30 Days of Systematic Professional Training',
    'comparison.selection': 'Precise Selection - Direct Advising if Not Suited, No Wasted Time',
    'comparison.funding': 'Funding Support - Capital Provided Upon Passing Assessment',
    'comparison.share': 'High Profit Share - 60%-90% of Profits Go to You',
    'comparison.career': 'Career Development - Development as Independent Trader or Fund Manager',
    'comparison.discipline': 'Strict Discipline - Military-Style Management, Professional Development',
    'comparison.highfee': 'High Tuition - Training Costs Often Reaching Tens of Thousands',
    'comparison.theory': 'Theory-Based - Lacking Practical Guidance',
    'comparison.acceptall': 'Accept Everyone - Anyone Can Learn if They Pay',
    'comparison.selffunded': 'Self-Funded - All Trading on Your Own',
    'comparison.nosupport': 'No Follow-up Support - Ends After Training',
    'comparison.noplan': 'No Career Planning - Self-Navigation After Training',
    'comparison.loose': 'Loose Management - Easy to Form Bad Trading Habits',
    'comparison.emphasis': 'We are dedicated to identifying, from a large population, the few individuals truly suited for forex trading, and providing them with comprehensive development and support in the shortest timeframe possible.',

    // Career Path
    'career.title': 'Career Development Path',
    'career.subtitle': '30-Day Systematic Development: Complete Path from Novice to Professional Forex Trader',
    'career.stage1.days': 'Days 1-5',
    'career.stage1.title': 'Rule Learning',
    'career.stage1.desc': 'Complete 15 standard entry point exercises, master fundamental forex trading system rules',
    'career.stage1.warning': ' Failure to pass rules assessment within 5 days results in advising to pursue other paths',
    'career.stage2.days': 'Days 6-20',
    'career.stage2.title': 'Profit Practice',
    'career.stage2.desc': 'Find suitable currency pairs for yourself, practice according to profitability standards',
    'career.stage2.tip': ' Maintain operational consistency: no missed entries, no missed exits, no losses',
    'career.stage3.days': 'Days 21-30',
    'career.stage3.title': 'Profit Assessment',
    'career.stage3.desc': '10 consecutive working days of: no missed entries, no missed exits, no losses daily',
    'career.stage3.success': ' Pass assessment, enter small-amount live trading phase',
    'career.stage4.path': 'Small-Amount Live Trading  Large-Amount Matrix',
    'career.stage4.title': 'Professional Trader',
    'career.stage4.desc': 'After 20 working days of small-amount live trading consolidation, enter large-amount matrix',
    'career.stage4.goal': ' Complete work time freedom, begin independent forex trader career',

    // Requirements
    'req.title': 'Do You Meet Basic Requirements',
    'req.subtitle': 'Strict admission standards ensure training quality - Everyone has only one opportunity to enter',
    'req.profile.title': ' Profile',
    'req.profile.education': 'Education & Age',
    'req.profile.education.desc': 'Associate Degree or Higher, Under 35 Years Old',
    'req.profile.psychology': 'Psychological Qualities',
    'req.profile.psychology.desc': 'Serious, Meticulous, Patient, Psychologically Healthy',
    'req.profile.character': 'Character Traits',
    'req.profile.character.desc': 'Introverted, Steady, Disciplined, Strong Execution',
    'req.time.title': ' Time & Environment',
    'req.time.commitment': 'Time Commitment',
    'req.time.commitment.desc': '30 Consecutive Working Days (Approximately 45 Days)',
    'req.time.equipment': 'Equipment Requirements',
    'req.time.equipment.desc': 'Windows Computer',
    'req.time.environment': 'Environment Requirements',
    'req.time.environment.desc': 'Independent Trading Environment, Uninterrupted Focus',
    'req.online.title': ' Online Hours',
    'req.online.hours': 'Trading Hours',
    'req.online.hours.desc': 'Monday to Friday 1:30 PM - 9:30 PM',
    'req.online.debrief': 'Team Debrief',
    'req.online.debrief.desc': 'Daily 8:00 PM Team Leader Conference Room Debrief',
    'req.notice.title': 'Important Reminder',
    'req.notice.once': 'Everyone has only ONE opportunity to enter',
    'req.notice.desc': 'Please apply only after fully understanding and confirming you meet ALL requirements.',
    'req.notice.philosophy': 'We focus on cultivating individuals truly suited for forex trading. In the world of forex trading, some people are inherently unsuited. They rush for success yet don\'t know what they truly seek; they glance at surfaces then stop, unable to perceive deeper truths. If this describes you, other industries may better suit your strengths.',

    // Video Section
    'video.title': 'Understand the Trader Profession',
    'video.subtitle': 'Traders are freelancers unrestricted by time and space - Deep dive into this profession through documentaries',
    'video.doc1.title': 'Million Dollar Trader',
    'video.doc1.rating': 'Douban Rating 8.7',
    'video.doc1.desc': 'This documentary reveals the true process of trader training, from selection to development to becoming a professional trader. Understand the real nature of the trader profession and the qualities needed to become an elite trader.',
    'video.doc1.cta': 'Watch Video ',
    'video.doc2.title': 'Trader: Instant Millions',
    'video.doc2.rating': 'Douban Rating 8.0',
    'video.doc2.desc': 'In-depth look at traders\' daily work and psychological stress, revealing how to make quick decisions in secondary markets, and the psychological and professional skills required. A high-pressure but opportunity-rich profession.',
    'video.doc2.cta': 'Watch Video ',

    // Student Showcase
    'showcase.title': 'Actual Student Profit Showcase',
    'showcase.junior': 'Junior Trader',
    'showcase.intermediate': 'Intermediate Trader',
    'showcase.senior': 'Senior Trader',
    'showcase.income.range': 'Monthly Income Range',
    'showcase.screenshots.title': 'Student Live Trading Profit Screenshots',
    'showcase.screenshots.note': 'Above are actual student trading profit screenshots',

    // CTA Section
    'cta.title': 'Ready to Start Your Forex Trading Career?',
    'cta.subtitle': 'Remember: The greatest risk is elimination, the cost is time. If clear-headed and ready, schedule an interview. After passing, enter training.',
    'cta.notice.title': 'Special Notice',
    'cta.passrate': 'Final Pass Rate',
    'cta.passrate.value': '10%',
    'cta.passrate.desc': 'We cultivate those truly suited, retaining the few, advising the majority to pursue other paths',
    'cta.elimination': 'Elimination Reason',
    'cta.elimination.reason': 'Not Suited for This Industry',
    'cta.opportunity': 'Number of Opportunities',
    'cta.opportunity.value': 'Only One',
    'cta.time.cost': 'Time Cost',
    'cta.time.value': '45 Days',
    'cta.money.cost': 'Financial Cost',
    'cta.money.value': 'Completely Free',
    'cta.button.interview': 'Schedule Interview Now',
    'cta.button.note': 'Please apply only after fully understanding and confirming you meet all requirements',

    // Footer
    'footer.about': 'Digital nomad trader training expert - professionally screening truly suitable trading talent and cultivating top traders.',
    'footer.nav.title': 'Quick Navigation',
    'footer.resources.title': 'Resources',
    'footer.contact.title': 'Contact Us',
    'footer.contact.focus': 'Focus on trader training',
    'footer.contact.cultivate': 'Cultivate professional traders',
    'footer.contact.apply': 'Apply Now',
    'footer.copyright': '© Sheng Jin Chi · Digital Nomad Trader Training Expert · growingpool.com',
    'footer.disclaimer': ' Forex trading carries risk, investment requires caution · Site content for learning reference only, not investment advice',
    'footer.partners.title': 'Partners',
    'footer.partners.brokers': 'Partner Brokers',
    'footer.partners.platforms': 'Platforms',
    'footer.partners.propfirms': 'Prop Firms',
    'footer.partners.tools': 'Trading Tools',
    'footer.partners.copytrading': 'Copy Trading',
    'footer.partners.referral': 'Referral Code',

    // Join Us Page
    'joinus.hero.badge': 'PROFESSIONAL TRADER TRAINING',
    'joinus.hero.title1': 'GrowingPool',
    'joinus.hero.title2': 'Forex Trader Training',
    'joinus.hero.subtitle': 'Cultivating those truly suited, retaining the few, advising the majority to pursue other paths',
    'joinus.hero.stat1': 'Pass Rate',
    'joinus.hero.stat2': 'Complete Training',
    'joinus.hero.stat3': 'Profit Share',
    'joinus.hero.stat1.value': '10%-15%',
    'joinus.hero.stat2.value': '30 Days',
    'joinus.hero.stat3.value': '60%-90%',

    'joinus.welcome.title': 'First, Congratulations!',
    'joinus.welcome.intro': 'Having navigated through multiple filters to arrive here, before stepping inside, take time to deeply understand what we offer. Enter only when you believe you meet all requirements.',
    'joinus.welcome.warning': 'Everyone has only ONE opportunity to enter',
    'joinus.welcome.desc': 'Here, you don\'t need a boss—you are your own boss. In fact, anywhere in the world, you can do as you please: skiing in the Alps, swimming in Hawaii, or daydreaming in Hokkaido... Money will continuously flow into your pocket. From the day you pass the assessment, you can roam anywhere in the world, traveling, living, or working—even living aimlessly; no longer troubled by daily trivialities, no longer needing to answer to anyone, free and undistracted while extending your life journey as far as possible...',

    'joinus.about.title': 'About Us',
    'joinus.about.desc1': 'We are a training organization focused on selecting and cultivating elite forex traders. We are committed to identifying, in the shortest time possible, the few individuals from a large population who are suited for forex trading, and providing them with cultivation and support.',
    'joinus.about.desc2': 'Simply put, we are recruiting forex traders—but not experienced traders with years in the field. Excellent traders don\'t circulate in the job market; they can only be cultivated personally. In other words, we personally select and train our traders, committed to developing qualified traders into fund managers.',
    'joinus.about.timeline': 'Within 45 days (30 working days), we will determine whether newcomers have the potential to become forex traders:',
    'joinus.about.phase1.title': 'First 20 Working Days',
    'joinus.about.phase1.desc': 'Including 5 days of basic trading rules learning and 15 days of profit practice',
    'joinus.about.phase2.title': 'Final 10 Working Days',
    'joinus.about.phase2.desc': 'Continuous profit assessment testing',
    'joinus.about.notfit.title': 'If Not Suited',
    'joinus.about.notfit.desc': 'We will be honest with you and advise you never to enter secondary markets',
    'joinus.about.fit.title': 'If Suited',
    'joinus.about.fit.desc': 'We will allocate capital to you, recruit you into our organization starting as an independent trader',

    'joinus.videos.title': 'Understand the Trader Profession',
    'joinus.videos.desc': 'Trading is a freelance profession unrestricted by time or space. Gain deeper understanding through these documentaries:',
    'joinus.videos.doc1.rating': 'Douban Rating 8.7',
    'joinus.videos.doc1.desc': 'Reveals the true process of trader training, from selection to cultivation to becoming a professional trader',
    'joinus.videos.doc1.cta': 'Watch Documentary ',
    'joinus.videos.doc2.rating': 'Douban Rating 8.0',
    'joinus.videos.doc2.desc': 'In-depth look at traders\' daily work and psychological stress, revealing the psychological qualities and professional skills required',
    'joinus.videos.doc2.cta': 'Watch Documentary ',

    'joinus.profile.title': 'Your Profile',
    'joinus.profile.unsuited': 'In the world of forex trading, some people are inherently unsuited. They rush for success yet don\'t know what they truly seek; they glance at surfaces then stop, unable to perceive deeper truths. Or perhaps they should choose those "stable" positions—going through the motions, living predictable days. This isn\'t disparagement, but reality: forex trading is a battlefield requiring composure, insight, and resilience. If this describes you, other industries may better suit your strengths.',
    'joinus.profile.income.title': 'About Income, Benefits, Base Salary, and Compensation Structure',
    'joinus.profile.income.desc': 'Any profit-oriented enterprise won\'t do business at a loss. Even hiring an inexperienced graduate at high salary stems from government subsidies or judgment of that person\'s potential. In our minimalist industry, all value comes from market price differences—simple, direct, brutal. Before you prove profitability (pass assessment), we won\'t invest a penny. After passing, your actual income will never exceed the "spoils" you capture in the "battlefield" (secondary market).',
    'joinus.profile.basic.title': 'Basic Requirements',
    'joinus.profile.basic.1': 'Associate Degree or higher, under 35 years old',
    'joinus.profile.basic.2': 'Serious, meticulous, patient, psychologically healthy',
    'joinus.profile.basic.3': 'Continuous 30 working days (approx. 45 days), Windows computer',
    'joinus.profile.basic.4': 'Independent trading environment',
    'joinus.profile.time.title': 'Time Requirements',
    'joinus.profile.time.1': 'Monday to Friday, minimum guaranteed online 1:30 PM - 9:30 PM',
    'joinus.profile.time.2': 'Beijing Time 8:00 PM team leader conference room debrief',

    'joinus.plan.title': 'Development Plan',
    'joinus.plan.phase0.days': 'Pre-Training Preparation',
    'joinus.plan.phase0.title': 'Interview Screening & Basic Preparation',
    'joinus.plan.phase0.desc': 'Pass interview screening, complete psychology assessment, establish trading mindset foundation, understand basic requirements and development path for professional traders',
    'joinus.plan.phase0.note': ' This phase is not included in the 30 trading days, designed to ensure candidates possess the basic qualities and correct understanding to become professional traders',
    'joinus.plan.phase1.days': 'Days 1-5',
    'joinus.plan.phase1.title': 'Complete Rules Learning',
    'joinus.plan.phase1.desc': 'Quickly familiarize yourself with basic trading system rules',
    'joinus.plan.phase1.req': 'Phase 1 rules assessment requirement: 15 standard entry points without errors',
    'joinus.plan.phase1.warning': ' Important: Failure to complete rules assessment within 5 working days results in discretionary dismissal',
    'joinus.plan.phase2.days': 'Days 6-20',
    'joinus.plan.phase2.title': 'Profit Practice',
    'joinus.plan.phase2.desc': 'Don\'t overthink; find currency pairs suitable for you',
    'joinus.plan.phase2.week1': 'Week 1: Practice extensively, find suitable currency pairs (start with 4-6 for observation, stabilize to 2 trading pairs)',
    'joinus.plan.phase2.week2': 'Week 2: Practice according to profit assessment standards: no missed entries, no missed exits, no losses',
    'joinus.plan.phase2.week3': 'Week 3: Must avoid elementary mistakes, must achieve operational consistency',
    'joinus.plan.phase3.days': 'Days 21-30',
    'joinus.plan.phase3.title': 'Continuous Profit Assessment',
    'joinus.plan.phase3.desc': 'This is the final assessment phase, requiring 10 consecutive working days of stable profitability',
    'joinus.plan.phase3.req': 'Profit assessment requirement: 10 consecutive working days, daily achievement for selected trading pairs—no missed entries, no missed exits, no losses',
    'joinus.plan.phase3.warning': ' Important: Failure to complete 10 consecutive profitable days within 30 working days results in dismissal',
    'joinus.plan.phase4.days': 'Small-Amount Live 20 Working Days',
    'joinus.plan.phase4.title': 'Small-Amount Live Trading',
    'joinus.plan.phase4.desc': 'Small-amount live trading still has only one chance; exceeding drawdown requirements is considered failure. Please cherish it.',
    'joinus.plan.phase4.1': 'Small-amount live trading maintains profit assessment requirements: 1-3 currency pairs, no missed entries, no missed exits, no losses',
    'joinus.plan.phase4.2': 'Those who feel their profitability is unstable can apply for 1-4 weeks of small-amount simulation consolidation',
    'joinus.plan.phase4.warning': ' Important: Small-amount live account: daily drawdown not exceeding 20%, weekly total drawdown not exceeding 30%, exceeding results in dismissal',
    'joinus.plan.phase5.days': 'Professional Trader Phase',
    'joinus.plan.phase5.title': 'Large-Amount Matrix (Professional Trader)',
    'joinus.plan.phase5.desc': 'After 20 working days of small-amount live trading consolidation without errors, enter large-amount matrix',
    'joinus.plan.phase5.1': ' Complete freedom in working hours, no daily trading volume limits, just maintain the baseline of no daily losses',
    'joinus.plan.phase5.2': ' Capital Scale & Position: As trading ability stabilizes, position size gradually increases',
    'joinus.plan.phase5.3': ' Small-amount live: $20 position, $100 capital allocation',
    'joinus.plan.phase5.4': ' Large-amount live: Determined based on small-amount live performance',
    'joinus.plan.phase5.5': ' Position growth: As profit curve rises, gradually increase position scale and profit share ratio',

    'joinus.rules.title': 'Trading Iron Laws',
    'joinus.rules.desc': 'Trading discipline is like laws and regulations; touching it once brands you as untrustworthy. Once touched, you can never enter the matrix team. A second violation of red lines results in direct dismissal from the team. Trading is like performing surgery—utmost seriousness required, no tolerance for rule violators.',
    'joinus.rules.trading.title': 'Trading Rule Red Lines',
    'joinus.rules.trading.1': 'Hard stop-loss lines cannot be moved; positions must be set correctly',
    'joinus.rules.trading.2': 'Only standard and aggressive entry methods',
    'joinus.rules.trading.3': 'Cannot hold positions across red折lines',
    'joinus.rules.trading.4': 'Stop-loss and exit must meet rule conditions',
    'joinus.rules.trading.5': 'Take-profit lines can only be used with 5x+ profit',
    'joinus.rules.meeting.title': 'Meeting Discipline Red Lines',
    'joinus.rules.meeting.1': 'Students must not add WeChat, phone, or other contact methods',
    'joinus.rules.meeting.2': 'Maintain seriousness in conference rooms; no discussion of topics other than trading',

    'joinus.final.title': 'Final Words',
    'joinus.final.motto': 'Cultivating those truly suited, retaining the few, advising the majority to pursue other paths.',
    'joinus.final.p1': 'This is a forex trader military training camp. Here, we will train you into regular forces (pass assessment) through strict military-style management. After passing, we will issue you weapons and ammunition, send you to the frontlines for combat (live trading), and welcome you back victorious (profitable).',
    'joinus.final.p2': 'Therefore, we will train you very seriously, because no general wishes to sacrifice the soldiers they\'ve painstakingly trained (we won\'t send unprofitable traders to the frontlines to become cannon fodder).',
    'joinus.final.p3': 'After passing the assessment, our relationship is one of mutual cooperation and shared success. You can choose to operate independently or back-to-back with comrades. We are not an employer-employee relationship—you are an independent entrepreneur, an independent individual.',
    'joinus.final.highlight': 'The spoils you capture on the battlefield—at least 60% belong to you personally. As your abilities improve, this ratio will increase, reaching up to 90% and beyond.',
    'joinus.final.p4': 'Because this is a narrow gate, haven\'t you heard that "free" may be more "expensive" than money? First, once you commit and are selected, professional trading training requires full dedication. Second, those who truly persevere won\'t be burdened by money, but indeed "the road is long and arduous." Third, unlike traditional disciplines, you don\'t need to pay tens of thousands in "tuition"—after all, this is a business of money making money.',

    'joinus.cta.title': 'Ready?',
    'joinus.cta.desc': 'If you\'re willing to give yourself a chance to realize your life ideals, then:',
    'joinus.cta.psychology': 'Complete Psychology Test',
    'joinus.cta.interview': 'Schedule Interview',

    // FAQ Page
    'faq.hero.badge': 'FREQUENTLY ASKED QUESTIONS',
    'faq.hero.title': 'Frequently Asked Questions',
    'faq.hero.subtitle': 'FAQ',
    'faq.hero.desc': 'Understand these questions before starting your professional trading journey',
    'faq.search.placeholder': 'Search questions...',
    'faq.search.button': 'Search',
    'faq.category.course': 'About GrowingPool',
    'faq.category.learning': 'About Training',
    'faq.category.pricing': 'About Income & Profit Share',
    'faq.category.support': 'Trading Iron Laws',
    'faq.category.other': 'Other Questions',
    'faq.contact.title': 'Didn\'t Find the Answer?',
    'faq.contact.desc': 'Contact our team leader, we will answer your questions as soon as possible',
    'faq.contact.button': 'Contact Team Leader',
    'faq.contact.modal.title': 'Consult Team Leader',

    // Donate Page
    'donate.hero.badge': 'GLOBAL TRIAL MEMBERSHIP',
    'donate.hero.title1': 'Global Trial Membership',
    'donate.hero.title2': 'Recruitment Program',
    'donate.hero.desc': 'Accepting donations globally to become 90-day trial members starting October 1, 2025',
    'donate.hero.stat1': 'Trial Period',
    'donate.hero.stat2': 'Coach Guidance',
    'donate.hero.stat3': 'Advancement Opportunity',
    'donate.hero.stat1.value': '90 Days',
    'donate.hero.stat2.value': '21 Days',
    'donate.hero.stat3.value': 'Lifetime',

    'donate.amount.badge': 'CURRENT DONATION AMOUNT',
    'donate.amount.warning': 'Amount automatically increases by $5 daily',
    'donate.amount.start': 'Starting Amount',
    'donate.amount.daily': 'Daily Increase',
    'donate.amount.payment': 'Payment Method',
    'donate.amount.crypto': 'Cryptocurrency Only',

    'donate.benefits.title': 'Trial Membership Benefits',
    'donate.benefits.desc': '90-day professional training, start your professional trader career',
    'donate.benefits.a.title': 'Elite Trader Training',
    'donate.benefits.a.desc': 'Participate in elite trader training courses within the membership community, learn professional trading techniques and strategies, master core market principles',
    'donate.benefits.b.title': '21-Day Coach Guidance',
    'donate.benefits.b.desc': 'One-on-one professional coaching, 21 days of intensive training, rapidly improve trading abilities, avoid common mistakes',
    'donate.benefits.c.title': 'Challenge Advancement Opportunity',
    'donate.benefits.c.desc': 'Outstanding performers can voluntarily participate in challenges; successful challengers gain lifetime advanced training qualifications and live trading rights',

    'donate.rewards.title': 'Challenge Success Rewards',
    'donate.rewards.desc': 'Prove your strength, gain lifetime career development opportunities',
    'donate.rewards.a.title': 'Lifetime Advanced Training',
    'donate.rewards.a.desc': 'Obtain lifetime advanced training qualification, continuously improve trading skills, become an elite trader, enjoy ongoing professional guidance',
    'donate.rewards.b.title': '$10K-200K MOM Operation Rights',
    'donate.rewards.b.desc': 'Obtain management authority for $10,000 to $200,000, conduct live trading in the elite matrix club, achieve wealth growth',

    'donate.how.title': 'How to Donate',
    'donate.how.desc': 'After completing the psychology test, contact us via email to obtain the donation address',
    'donate.how.flow.title': 'Donation Process',
    'donate.how.step1.title': 'Complete Psychology Test',
    'donate.how.step1.desc': 'First complete the psychology test to ensure you possess the psychological qualities to become a professional trader',
    'donate.how.step2.title': 'Send Email Application',
    'donate.how.step2.desc': 'Email to growingpool@gmail.com explaining your intention',
    'donate.how.step3.title': 'Obtain Donation Address',
    'donate.how.step3.desc': 'We will reply via email with the specific USDT/USDC donation address',
    'donate.how.step4.title': 'Complete Donation and Begin Training',
    'donate.how.step4.desc': 'After completing donation to the provided address, begin your 90-day trial membership training',
    'donate.how.cta.test': 'Complete Psychology Test Now',
    'donate.how.cta.email': 'Send Email Application',

    'donate.notice.title': 'Important Notice',
    'donate.notice.1': 'Donations are voluntary private actions with no commercial commitments or binding force',
    'donate.notice.2': 'Trial membership duration: 90 days',
    'donate.notice.3': 'Participation requirement: Must complete psychology test and pass preliminary screening',
    'donate.notice.4': 'Challenge opportunity: Outstanding performers can voluntarily participate, not mandatory',

    'donate.modal.title': 'Apply for Membership',

    // Psychology Test Page
    'psytest.welcome.title': 'Trader Psychology Test',
    'psytest.welcome.subtitle': 'Comprehensive evaluation of your trading psychological qualities',
    'psytest.welcome.duration.label': 'Time',
    'psytest.welcome.duration.title': 'Test Duration',
    'psytest.welcome.duration.value': 'About 5-8 Minutes',
    'psytest.welcome.questions.label': 'Q',
    'psytest.welcome.questions.title': 'Number of Questions',
    'psytest.welcome.questions.value': '20 Questions',
    'psytest.welcome.dimensions.label': 'Dim',
    'psytest.welcome.dimensions.title': 'Assessment Dimensions',
    'psytest.welcome.dimensions.value': '5 Core Dimensions',
    'psytest.welcome.includes': 'Test dimensions include:',
    'psytest.welcome.start': 'Start Test',
    'psytest.welcome.note': 'Please answer according to your genuine feelings; there are no right or wrong answers',

    'psytest.dimension.risk': 'Risk Tolerance',
    'psytest.dimension.emotion': 'Emotional Control',
    'psytest.dimension.decision': 'Decision Making',
    'psytest.dimension.discipline': 'Discipline',
    'psytest.dimension.stress': 'Stress Management',

    'psytest.progress.question': 'Question',

    'psytest.result.complete': '🎉 Assessment Complete',
    'psytest.result.title': 'Test Complete',
    'psytest.result.subtitle': 'Your Trading Psychology Assessment Report',
    'psytest.result.overall': 'Overall Score',
    'psytest.result.dimensions.title': 'Dimension Scores',
    'psytest.result.recommendations.title': 'Improvement Recommendations',
    'psytest.result.rec1.label': 'Learn',
    'psytest.result.rec1.title': 'Systematic Learning',
    'psytest.result.rec1.text': 'Deeply study trading psychology and behavioral finance, understand psychological traps and cognitive biases in trading.',
    'psytest.result.rec2.label': 'Record',
    'psytest.result.rec2.title': 'Keep Trading Journal',
    'psytest.result.rec2.text': 'Record in detail the psychological state, decision process and results of each trade; review and summarize regularly.',
    'psytest.result.rec3.label': 'Train',
    'psytest.result.rec3.title': 'Simulation Training',
    'psytest.result.rec3.text': 'Exercise decision-making ability and emotional control through simulated trading in a risk-free environment.',
    'psytest.result.rec4.label': 'Focus',
    'psytest.result.rec4.title': 'Meditation Practice',
    'psytest.result.rec4.text': 'Practice meditation for 10-15 minutes daily to improve focus and emotional management abilities.',
    'psytest.result.retry': 'Retake Test',
    'psytest.result.retry.confirm': 'Are you sure you want to restart the test? Current results will be lost.',

    'psytest.level.excellent': 'Excellent Trader',
    'psytest.level.excellent.desc': 'You demonstrate outstanding trading psychological qualities. Excellent performance in risk control, emotional management, decision-making ability and other aspects. Continue maintaining this professional trading attitude, and you are likely to become a successful trader.',
    'psytest.level.good': 'Good Trader',
    'psytest.level.good.desc': 'You possess good trading psychological qualities, performing well across multiple dimensions. Through continuous learning and practice, focusing on improving weaknesses, you have significant room for improvement.',
    'psytest.level.pass': 'Qualified Trader',
    'psytest.level.pass.desc': 'You possess basic trading psychological qualities, but some aspects need strengthening. Focus on dimensions with lower scores and improve through learning and training.',
    'psytest.level.improve': 'Needs Improvement',
    'psytest.level.improve.desc': 'Your trading psychological qualities have significant room for improvement. Before engaging in live trading, systematically study trading psychology and exercise psychological qualities through simulated trading.',

    // Email Contact Modal
    'email.default.title': 'Forex Trader Interview',
    'email.subject': 'Forex Trader Communication',
    'email.description': 'Please send your resume to the following email address, and we will contact you as soon as possible:',
    'email.address.label': 'Email Address:',
    'email.copy': 'Copy',
    'email.copied': 'Email address copied to clipboard',
    'email.subject.label': 'Email Subject:',
    'email.tip': 'Tip:',
    'email.tip.text': 'Please include your basic information, educational background, and why you want to become a forex trader in your email.',
    'email.send': 'Open Email Client',
    'email.close': 'Close',

    // Trading Dashboard
    'dashboard.title': 'Internal System',
    'dashboard.subtitle': 'XAUUSD Hybrid Strategy - Professional Trading System',
    'dashboard.logout': 'Logout',
    'dashboard.tab.backtest': 'Backtest',
    'dashboard.tab.live': 'Live Trading',
    'dashboard.tab.tianti': 'Leaderboard',
    'dashboard.tab.config': 'Strategy Config',
    'dashboard.tab.users': 'User Management',
    'dashboard.tab.function1': 'Preparation',
    'dashboard.tab.function2': 'Function 2',
    'dashboard.tab.function3': 'Function 3',
    'dashboard.tianti.refresh': 'Refresh Signals',
    // 学前准备
    'dashboard.preparation.title': 'Pre-Training Preparation',
    'dashboard.preparation.part1.title': 'Part 1: Download Encrypted Player & Video Tutorials',
    'dashboard.preparation.part1.player': 'Download Encrypted Player',
    'dashboard.preparation.part1.videos': 'Download Encrypted Video Tutorials',
    'dashboard.preparation.part2.title': 'Part 2: How to Play Encrypted Tutorials?',
    'dashboard.preparation.part2.step1': 'Open the player and play any episode (video format is .gem after extraction)',
    'dashboard.preparation.part2.step2': 'A window will pop up. Copy the Machine Code and send it to your team coach',
    'dashboard.preparation.part2.step3': 'Paste the play password from your coach into the Play Password field and click Play',
    'dashboard.preparation.part2.step4': 'If nothing happens, uninstall and reinstall the player, then try with the same password',
    'dashboard.preparation.part3.title': 'Part 3: Complete Study Notes',
    'dashboard.preparation.part3.step1': 'Study the course content carefully and organize text-based study notes (digital or handwritten)',
    'dashboard.preparation.part3.focus': 'Key Focus: Precise definitions of three elements, standard entry points, aggressive entry points, secondary positions, hard stops, standard stops, conservative stops...',
    'dashboard.preparation.part3.button': 'I have completed my study notes',
    'dashboard.preparation.part4.title': 'Part 4: Download and Install Trading System',
    'dashboard.preparation.part4.download': 'Download Trading System',
    'dashboard.preparation.part4.install.title': 'Installation Sequence:',
    'dashboard.preparation.part4.install.step1': 'Double-click "tickmill4setup.exe" to install Tickmill MT4 client, select default options',
    'dashboard.preparation.part4.install.step2': 'After installation, close the Tickmill client immediately',
    'dashboard.preparation.part4.install.step3': 'Double-click "交易系统.exe" to install. Select default path',
    'dashboard.preparation.part4.install.step4': 'Enter personal information in registration window (required: name, WeChat, phone, email). Referrer: Zeng Jianhong',
    'dashboard.preparation.part4.install.step5': 'After completion, click "Trial" button. Prompt: "Software rental period expired". Click "OK". Close software',
    'dashboard.preparation.part4.install.step6': 'Inform your team coach that you have clicked trial',
    'dashboard.preparation.part4.install.step7': 'After team leader confirms system activation, double-click "交易系统.exe" again. Confirm personal information matches, click "Trial" again',
    'dashboard.preparation.part4.install.step8': 'Prompt "MT4 indicators installed successfully". A new "Trading Template" icon will appear on desktop',
    'dashboard.preparation.part4.install.step9': 'Double-click desktop "Trading Template" icon, enter demo account provided by coach, password, and select correct server to login',
    'dashboard.preparation.part4.install.step10': 'Extract "模板.zip" file, copy "MQL4" and "templates" folders',
    'dashboard.preparation.part4.install.step11': 'Open trading client, select "File" -> "Open Data Folder", paste the two folders. Select "Yes" if prompted to overwrite',
    'dashboard.preparation.part4.install.step12': 'Close trading system, reopen via desktop "Trading Template" icon, try loading templates to check if they display properly',
    'dashboard.preparation.part4.note': 'Note: Always enter the trading system via the "Trading Template" icon, not the "Tickmill" icon, otherwise templates may not display properly',
    'dashboard.footer.warning': ' For testing environment only. Live trading requires thorough testing and risk assessment.',
    'dashboard.footer.copyright': '2024-2025 © GrowingPool Professional Forex Trader Training Platform',

    // Admin Login
    'login.title': 'Internal System',
    'login.subtitle': 'Please enter admin credentials to continue',
  'login.username.label': 'Username',
  'login.username.placeholder': 'Enter username',
    'login.password.label': 'Admin Password',
    'login.password.placeholder': 'Enter password',
    'login.error': 'Incorrect username or password, please try again',
    'login.button': 'Login',
    'login.back': 'Back to Home',

    // User Management
    'userManagement.title': 'User Management',
    'userManagement.subtitle': 'Manage system users and permissions',
    'userManagement.createUser': 'Create User',
    'userManagement.table.username': 'Username',
    'userManagement.table.userGroup': 'User Group',
    'userManagement.table.status': 'Status',
    'userManagement.table.createdAt': 'Created',
    'userManagement.table.lastLogin': 'Last Login',
    'userManagement.table.actions': 'Actions',
    'userManagement.createModal.title': 'Create New User',
    'userManagement.createModal.username': 'Username',
    'userManagement.createModal.usernamePlaceholder': 'Enter username',
    'userManagement.createModal.userGroup': 'User Group',
    'userManagement.createModal.cancel': 'Cancel',
    'userManagement.createModal.create': 'Create',

    // Subscription Notification
    'notification.message1': 'Contacted team leader to join forex trader training',
    'notification.message2': 'Became a trial member',
    'notification.time': 'Just now',

    // Unsuitable Candidates & Expectations & Assessment
    'qualification.title': 'Do You Meet the Basic Requirements?',
    'qualification.subtitle': 'Please carefully assess whether you possess the basic qualifications to become a professional trader',
    'unsuitable.title': 'Unsuitable Candidates',
    'unsuitable.subtitle': 'The following types of candidates are not suitable for our training',
    'unsuitable.pressure': 'People with financial pressure seeking quick profits from trading',
    'unsuitable.pressure.desc': 'Trading requires time accumulation and mental cultivation; eagerness for quick success only leads to failure',
    'unsuitable.gambler': 'People expecting to "get rich quick" or with a "gambler" mentality',
    'unsuitable.gambler.desc': 'Professional trading is a serious career requiring rationality and discipline, not gambling',

    'expectations.title': 'Candidate Expectations',
    'expectations.subtitle': 'We hope you possess the following qualities',
    'expectations.mindset': 'Calm mindset and decisive execution',
    'expectations.mindset.desc': 'Ability to face market fluctuations calmly and execute trading plans decisively',
    'expectations.stable': 'No current financial troubles, able to pursue trading as a lifelong career',
    'expectations.stable.desc': 'Stable economic foundation to focus on long-term development',
    'expectations.initiative': 'High initiative and serious commitment to training',
    'expectations.initiative.desc': 'Proactive learning, active practice, full dedication to training',

    'assessment.title': 'Assessment Focus',
    'assessment.subtitle': 'Interview and training will assess the following comprehensive abilities',
    'assessment.learning': 'Learning Ability',
    'assessment.learning.desc': 'Ability to quickly understand and master new knowledge',
    'assessment.understanding': 'Comprehension',
    'assessment.understanding.desc': 'Deep understanding of market patterns and trading logic',
    'assessment.execution': 'Execution',
    'assessment.execution.desc': 'Strict execution of trading plans and risk management',
    'assessment.mentality': 'Mentality',
    'assessment.mentality.desc': 'Maintain stable emotions, unaffected by profits and losses',
    'assessment.motivation': 'Trading Motivation',
    'assessment.motivation.desc': 'Correct trading motivation and career pursuit',

    // Blog
    'blog.title': 'Trading Blog',
    'blog.subtitle': 'Professional trading knowledge, practical experience & trading wisdom sharing',
    'blog.hero.badge': 'Professional Knowledge',
    'blog.featured': 'Featured',
    'blog.minRead': 'min read',
    'blog.noPosts': 'No posts available',
    'blog.notFound': 'Post not found',
    'blog.backToBlog': 'Back to Blog',
    'blog.relatedPosts': 'Related Posts',
    'blog.cta.title': 'Ready to Start Your Trading Journey?',
    'blog.cta.subtitle': 'Join GrowingPool for professional trader training',
    'blog.cta.button': 'Join Now',

    // Tianti Panel
    'tianti.autoRefresh': 'Auto Refresh',
    'tianti.manualRefresh': 'Manual Refresh',
    'tianti.countdown': 'Countdown: {0}s',
    'tianti.refreshStopped': 'Auto refresh stopped',
    'tianti.autoRefreshNote': 'Image will auto-refresh every 60 seconds',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Get initial language from URL (works on both server and client)
  const getInitialLanguage = (): Language => {
    // Always use URL as source of truth
    const locale = pathname.split('/')[1];
    return locale === 'en' ? 'en' : 'zh';
  };

  const [language, setLanguage] = useState<Language>(getInitialLanguage());

  useEffect(() => {
    setMounted(true);

    // Sync localStorage with current language
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('language');
      if (stored !== language) {
        localStorage.setItem('language', language);
      }
    }
  }, [language]);

  // Update language when pathname changes
  useEffect(() => {
    const locale = pathname.split('/')[1];
    const pathLang: Language = locale === 'en' ? 'en' : 'zh';

    // If URL language differs from current state, update both state and localStorage
    if (pathLang !== language) {
      setLanguage(pathLang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', pathLang);
      }
    }
  }, [pathname, language]);

  const toggleLanguage = () => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const newLanguage = language === 'zh' ? 'en' : 'zh';

      // Smart path replacement
      let newPath = currentPath;

      if (currentPath.startsWith('/zh') || currentPath.startsWith('/en')) {
        // Replace existing language prefix
        newPath = currentPath.replace(/^\/(zh|en)/, `/${newLanguage}`);
      } else {
        // Add language prefix
        newPath = `/${newLanguage}${currentPath === '/' ? '' : currentPath}`;
      }

      // Use window.location.href for full page refresh
      window.location.href = newPath;
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
