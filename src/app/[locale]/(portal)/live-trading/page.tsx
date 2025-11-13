import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '直播交易 | GrowingPool',
  description: '实时观看GrowingPool的专业交易直播，学习实战技巧，掌握交易策略',
};

import LiveTradingClient from './LiveTradingClient';

export default function LiveTradingPage() {
  return <LiveTradingClient />;
}