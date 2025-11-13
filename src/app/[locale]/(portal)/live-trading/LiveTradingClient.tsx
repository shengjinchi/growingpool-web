'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Users,
  Wifi,
  WifiOff,
  ChevronRight,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import EmailContactModal from '@/components/custom/EmailContactModal';

export default function LiveTradingClient() {
  const [isConnected, setIsConnected] = useState(true);
  const [viewers, setViewers] = useState(1234);
  const [onlineStreamers, setOnlineStreamers] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [exchangeStatus, setExchangeStatus] = useState<{name: string, isOpen: boolean}[]>([]);
  const [mainStreamMuted, setMainStreamMuted] = useState(false);
  const [selectedSideStream, setSelectedSideStream] = useState(0);
  const [sideStreamsMuted, setSideStreamsMuted] = useState([true, true]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const mainVideoRef = useRef<HTMLIFrameElement>(null);
  const mainStreamRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // 获取全球交易所开盘状态
  const getExchangeStatus = () => {
    const now = new Date();
    const exchanges = [
      // 美洲
      { name: '纽约证券交易所', timezone: 'America/New_York', open: 9, close: 16 },
      { name: '纳斯达克', timezone: 'America/New_York', open: 9, close: 16 },
      { name: '多伦多证券交易所', timezone: 'America/Toronto', open: 9.5, close: 16 },
      { name: '圣保罗证券交易所', timezone: 'America/Sao_Paulo', open: 10, close: 17 },

      // 欧洲
      { name: '伦敦证券交易所', timezone: 'Europe/London', open: 8, close: 16.5 },
      { name: '法兰克福证券交易所', timezone: 'Europe/Berlin', open: 9, close: 17.5 },
      { name: '巴黎证券交易所', timezone: 'Europe/Paris', open: 9, close: 17.5 },
      { name: '苏黎世证券交易所', timezone: 'Europe/Zurich', open: 9, close: 17.5 },

      // 亚洲
      { name: '东京证券交易所', timezone: 'Asia/Tokyo', open: 9, close: 15 },
      { name: '香港交易所', timezone: 'Asia/Hong_Kong', open: 9.5, close: 16 },
      { name: '上海证券交易所', timezone: 'Asia/Shanghai', open: 9.5, close: 15 },
      { name: '深圳证券交易所', timezone: 'Asia/Shanghai', open: 9.5, close: 15 },
      { name: '新加坡交易所', timezone: 'Asia/Singapore', open: 9, close: 17 },
      { name: '孟买证券交易所', timezone: 'Asia/Kolkata', open: 9, close: 15.5 },

      // 大洋洲
      { name: '悉尼证券交易所', timezone: 'Australia/Sydney', open: 10, close: 16 },
      { name: '新西兰证券交易所', timezone: 'Pacific/Auckland', open: 10, close: 17 },
    ];

    return exchanges.map(exchange => {
      const time = new Date(now.toLocaleString("en-US", {timeZone: exchange.timezone}));
      const hour = time.getHours() + time.getMinutes() / 60;
      const isOpen = hour >= exchange.open && hour < exchange.close;
      return {
        name: exchange.name,
        isOpen: isOpen
      };
    });
  };

  // 确保客户端挂载
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 更新交易所状态
  useEffect(() => {
    if (!isMounted) return;

    setExchangeStatus(getExchangeStatus());

    const timer = setInterval(() => {
      setExchangeStatus(getExchangeStatus());
    }, 60000); // 每分钟更新一次

    return () => clearInterval(timer);
  }, [isMounted]);

  // 模拟连接状态和实时数据
  useEffect(() => {
    if (!isMounted) return;

    const timer = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 10 - 5));
      setIsConnected(Math.random() > 0.1);
    }, 5000);

    return () => clearInterval(timer);
  }, [isMounted]);

  
  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const mainStreamId = "hsHO39PnC1s";

  const sideStreams = [
    {
      id: 0,
      name: "分支频道1",
      title: "分支频道1",
      streamId: null, // 暂时移除频道ID
      viewers: 456,
      isActive: false
    },
    {
      id: 1,
      name: "分支频道2",
      title: "分支频道2",
      streamId: null, // 暂时移除频道ID
      viewers: 234,
      isActive: false
    }
  ];

  const toggleSideStreamMute = (index: number) => {
    const newMuted = [...sideStreamsMuted];
    newMuted[index] = !newMuted[index];
    setSideStreamsMuted(newMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (mainStreamRef.current) {
        mainStreamRef.current.requestFullscreen().catch((err) => {
          console.error('Error attempting to enable fullscreen:', err);
        });
      }
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900/90 via-black/95 to-gray-900/90 backdrop-blur-xl text-white border-b border-gray-800/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-lg rounded-full mb-10 shadow-2xl">
            <div className={`w-4 h-4 ${isConnected ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-red-400 to-pink-400'} rounded-full animate-pulse shadow-lg`}></div>
            <span className="text-sm font-bold tracking-wider uppercase">
              {isConnected ? '系统连接正常' : '连接中...'}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
              多屏直播交易室
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
            欢迎参与我们的实时交易！
          </p>

          {/* Live Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg backdrop-blur-sm">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-white">99+</span>
              <span className="text-gray-300">矩阵成员</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg backdrop-blur-sm">
              <Wifi className="w-5 h-5 text-green-400" />
              <span className="font-bold text-white">{onlineStreamers + 2}</span>
              <span className="text-gray-300">频道在线</span>
            </div>
            </div>
        </div>
      </div>

      {/* Exchange Status */}
      <div className="bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-blue-900/30 border-b border-blue-700/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-center mb-3">
            <span className="text-sm font-bold text-blue-200 tracking-wide">
              🌍 全球主要交易所状态
            </span>
          </div>
          {isMounted ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 max-w-6xl mx-auto">
              {/* 第一行：美洲交易所 */}
              <div className="flex items-center gap-2 justify-center bg-blue-800/20 rounded-lg px-2 py-2 border border-blue-600/20">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${exchangeStatus[0]?.isOpen ? 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg' : 'bg-red-400'}`}></div>
                <span className="text-xs font-medium text-blue-100 whitespace-nowrap">{exchangeStatus[0]?.name}</span>
              </div>
              <div className="flex items-center gap-2 justify-center bg-blue-800/20 rounded-lg px-2 py-2 border border-blue-600/20">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${exchangeStatus[1]?.isOpen ? 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg' : 'bg-red-400'}`}></div>
                <span className="text-xs font-medium text-blue-100 whitespace-nowrap">{exchangeStatus[1]?.name}</span>
              </div>
              <div className="flex items-center gap-2 justify-center bg-blue-800/20 rounded-lg px-2 py-2 border border-blue-600/20">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${exchangeStatus[2]?.isOpen ? 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg' : 'bg-red-400'}`}></div>
                <span className="text-xs font-medium text-blue-100 whitespace-nowrap">{exchangeStatus[2]?.name}</span>
              </div>
              <div className="flex items-center gap-2 justify-center bg-blue-800/20 rounded-lg px-2 py-2 border border-blue-600/20">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${exchangeStatus[3]?.isOpen ? 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg' : 'bg-red-400'}`}></div>
                <span className="text-xs font-medium text-blue-100 whitespace-nowrap">{exchangeStatus[3]?.name}</span>
              </div>

              {/* 第二行：欧洲交易所 */}
              <div className="flex items-center gap-2 justify-center bg-purple-800/20 rounded-lg px-2 py-2 border border-purple-600/20">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${exchangeStatus[4]?.isOpen ? 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg' : 'bg-red-400'}`}></div>
                <span className="text-xs font-medium text-blue-100 whitespace-nowrap">{exchangeStatus[4]?.name}</span>
              </div>
              <div className="flex items-center gap-2 justify-center bg-purple-800/20 rounded-lg px-2 py-2 border border-purple-600/20">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${exchangeStatus[5]?.isOpen ? 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg' : 'bg-red-400'}`}></div>
                <span className="text-xs font-medium text-blue-100 whitespace-nowrap">{exchangeStatus[5]?.name}</span>
              </div>
              <div className="flex items-center gap-2 justify-center bg-purple-800/20 rounded-lg px-2 py-2 border border-purple-600/20">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${exchangeStatus[6]?.isOpen ? 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg' : 'bg-red-400'}`}></div>
                <span className="text-xs font-medium text-blue-100 whitespace-nowrap">{exchangeStatus[6]?.name}</span>
              </div>
              <div className="flex items-center gap-2 justify-center bg-purple-800/20 rounded-lg px-2 py-2 border border-purple-600/20">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${exchangeStatus[7]?.isOpen ? 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg' : 'bg-red-400'}`}></div>
                <span className="text-xs font-medium text-blue-100 whitespace-nowrap">{exchangeStatus[7]?.name}</span>
              </div>

              {/* 第三行：亚洲交易所 */}
              <div className="flex items-center gap-2 justify-center bg-amber-800/20 rounded-lg px-2 py-2 border border-amber-600/20">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${exchangeStatus[8]?.isOpen ? 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg' : 'bg-red-400'}`}></div>
                <span className="text-xs font-medium text-blue-100 whitespace-nowrap">{exchangeStatus[8]?.name}</span>
              </div>
              <div className="flex items-center gap-2 justify-center bg-amber-800/20 rounded-lg px-2 py-2 border border-amber-600/20">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${exchangeStatus[9]?.isOpen ? 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg' : 'bg-red-400'}`}></div>
                <span className="text-xs font-medium text-blue-100 whitespace-nowrap">{exchangeStatus[9]?.name}</span>
              </div>
              <div className="flex items-center gap-2 justify-center bg-amber-800/20 rounded-lg px-2 py-2 border border-amber-600/20">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${exchangeStatus[10]?.isOpen ? 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg' : 'bg-red-400'}`}></div>
                <span className="text-xs font-medium text-blue-100 whitespace-nowrap">{exchangeStatus[10]?.name}</span>
              </div>
              <div className="flex items-center gap-2 justify-center bg-amber-800/20 rounded-lg px-2 py-2 border border-amber-600/20">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${exchangeStatus[11]?.isOpen ? 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg' : 'bg-red-400'}`}></div>
                <span className="text-xs font-medium text-blue-100 whitespace-nowrap">{exchangeStatus[11]?.name}</span>
              </div>
              <div className="flex items-center gap-2 justify-center bg-amber-800/20 rounded-lg px-2 py-2 border border-amber-600/20">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${exchangeStatus[12]?.isOpen ? 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg' : 'bg-red-400'}`}></div>
                <span className="text-xs font-medium text-blue-100 whitespace-nowrap">{exchangeStatus[12]?.name}</span>
              </div>
              <div className="flex items-center gap-2 justify-center bg-amber-800/20 rounded-lg px-2 py-2 border border-amber-600/20">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${exchangeStatus[13]?.isOpen ? 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg' : 'bg-red-400'}`}></div>
                <span className="text-xs font-medium text-blue-100 whitespace-nowrap">{exchangeStatus[13]?.name}</span>
              </div>

              {/* 第四行：大洋洲交易所 */}
              <div className="flex items-center gap-2 justify-center bg-teal-800/20 rounded-lg px-2 py-2 border border-teal-600/20 col-span-2">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${exchangeStatus[14]?.isOpen ? 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg' : 'bg-red-400'}`}></div>
                <span className="text-xs font-medium text-blue-100 whitespace-nowrap">{exchangeStatus[14]?.name}</span>
              </div>
              <div className="flex items-center gap-2 justify-center bg-teal-800/20 rounded-lg px-2 py-2 border border-teal-600/20 col-span-2">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${exchangeStatus[15]?.isOpen ? 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg' : 'bg-red-400'}`}></div>
                <span className="text-xs font-medium text-blue-100 whitespace-nowrap">{exchangeStatus[15]?.name}</span>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-sm font-medium text-blue-100">加载中...</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:h-[600px]">
          {/* Main Stream - 9 columns on XL */}
          <div className="xl:col-span-9 h-full">
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl relative h-full flex flex-col group hover:shadow-blue-500/10 hover:shadow-3xl transition-all duration-500" ref={mainStreamRef} style={{zIndex: 1}}>
              {/* Main Stream Header */}
              <div className="bg-gradient-to-r from-black/70 via-gray-900/80 to-black/70 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-700/30">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg"></div>
                    <span className="font-bold text-white">主直播间</span>
                    <span className="text-sm text-gray-400">• 99+ 矩阵成员</span>
                  </div>
                  <div className="h-6 w-px bg-gray-700/50"></div>
                  <span className="text-sm text-gray-400">日内实时交易</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMainStreamMuted(!mainStreamMuted)}
                    className="p-2.5 hover:bg-white/10 rounded-lg transition-all duration-200 group/btn"
                    title={mainStreamMuted ? "取消静音" : "静音"}
                  >
                    {mainStreamMuted ? (
                      <VolumeX className="w-4 h-4 text-gray-400 group-hover/btn:text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-gray-400 group-hover/btn:text-white" />
                    )}
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2.5 hover:bg-white/10 rounded-lg transition-all duration-200 group/btn"
                    title={isFullscreen ? "退出全屏" : "全屏"}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4 text-gray-400 group-hover/btn:text-white" />
                    ) : (
                      <Maximize2 className="w-4 h-4 text-gray-400 group-hover/btn:text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Main Stream Player */}
              <div className="flex-1 relative bg-black min-h-0 overflow-hidden rounded-b-2xl">
                <iframe
                  src={`https://www.youtube.com/embed/${mainStreamId}?autoplay=1&mute=${mainStreamMuted ? 1 : 0}&controls=1&rel=0&modestbranding=1`}
                  title="GrowingPool 主直播"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{position: 'relative', zIndex: 1}}
                />
                {/* Subtle overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Side Streams - 3 columns on XL */}
          <div className="xl:col-span-3 flex flex-col h-full gap-4">
            {sideStreams.map((stream, index) => (
              <div
                key={stream.id}
                className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/50 transition-all cursor-pointer flex-1 group hover:scale-[1.02] hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-400/10"
              >
                {/* Side Stream Header */}
                <div className="bg-gradient-to-r from-black/70 via-gray-900/60 to-black/70 backdrop-blur-md px-3 py-2.5 flex items-center justify-between border-b border-gray-700/30">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stream.streamId ? 'bg-green-400 animate-pulse shadow-lg' : 'bg-gray-400'}`}></div>
                    <span className="text-xs font-semibold truncate text-gray-300 group-hover:text-white transition-colors">{stream.name}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSideStreamMute(index);
                    }}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 group/btn"
                    title={sideStreamsMuted[index] ? "取消静音" : "静音"}
                  >
                    {sideStreamsMuted[index] ? (
                      <VolumeX className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-white" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-white" />
                    )}
                  </button>
                </div>

                {/* Side Stream Player */}
                <div className="h-full relative bg-black min-h-0 overflow-hidden">
                  {stream.streamId ? (
                    <>
                      <iframe
                        src={`https://www.youtube.com/embed/${stream.streamId}?autoplay=1&mute=${sideStreamsMuted[index] ? 1 : 0}&controls=0&rel=0&modestbranding=1`}
                        title={stream.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                      {/* Subtle overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  ) : (
                    /* 离线状态显示 */
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                      </div>
                      <div className="text-center">
                        <p className="text-red-400 font-bold text-lg mb-2">离线</p>
                        <p className="text-gray-500 text-sm">暂无直播信号</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stream Info */}
                <div className="bg-gradient-to-r from-black/60 via-gray-900/50 to-black/60 backdrop-blur-sm px-3 py-2.5 border-t border-gray-700/30">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">{stream.title}</p>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{stream.viewers}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            </div>
        </div>
      </div>

      {/* CTA Section - 交易员生涯招募 */}
      <div className="relative bg-gradient-to-br from-gray-950 via-black to-gray-950 py-24 w-full border-t border-gray-800/50 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-white mb-8">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              {t('cta.title')}
            </span>
          </h2>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('cta.subtitle')}
          </p>

          {/* 通过率警告 */}
          <div className="relative max-w-4xl mx-auto mb-16">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 via-red-500/30 to-yellow-500/30 blur-3xl rounded-2xl"></div>

            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-yellow-500/30 p-10 shadow-2xl backdrop-blur-xl rounded-2xl">
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center mb-6 rounded-2xl shadow-2xl animate-pulse">
                  <svg className="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                  </svg>
                </div>
                <h3 className="text-4xl font-black text-yellow-400 mb-3 tracking-wide">{t('cta.notice.title')}</h3>
                <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"></div>
              </div>

              <div className="text-center mb-10">
                <p className="text-xl text-gray-400 mb-4 uppercase tracking-wider font-semibold">{t('cta.passrate')}</p>
                <p className="text-8xl font-black text-white mb-3 leading-none">
                  <span className="text-6xl bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">10-15</span>
                  <span className="text-6xl text-gray-400 ml-2">%</span>
                </p>
                <p className="text-gray-300 text-xl font-light">
                  {t('cta.passrate.desc')}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/60 backdrop-blur-sm p-4 border border-red-500/20 rounded-xl hover:border-red-500/40 hover:scale-[1.02] transition-all">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{t('cta.elimination')}</p>
                  <p className="text-sm text-white font-bold">{t('cta.elimination.reason')}</p>
                </div>
                <div className="bg-black/60 backdrop-blur-sm p-4 border border-red-500/20 rounded-xl hover:border-red-500/40 hover:scale-[1.02] transition-all">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{t('cta.opportunity')}</p>
                  <p className="text-sm text-white font-bold">{t('cta.opportunity.value')}</p>
                </div>
                <div className="bg-black/60 backdrop-blur-sm p-4 border border-red-500/20 rounded-xl hover:border-red-500/40 hover:scale-[1.02] transition-all">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{t('cta.time.cost')}</p>
                  <p className="text-sm text-white font-bold">{t('cta.time.value')}</p>
                </div>
                <div className="bg-black/60 backdrop-blur-sm p-4 border border-green-500/20 rounded-xl hover:border-green-500/40 hover:scale-[1.02] transition-all">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{t('cta.money.cost')}</p>
                  <p className="text-sm text-green-400 font-bold">{t('cta.money.value')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="px-12 py-6 bg-gradient-to-r from-white to-gray-100 text-black font-bold text-xl border-2 border-white hover:from-black hover:to-gray-900 hover:text-white transition-all duration-300 shadow-2xl hover:shadow-white/20 rounded-lg hover:scale-[1.05]"
            >
              {t('cta.button.interview')}
            </button>
            <p className="text-sm text-gray-500 font-medium">
              {t('cta.button.note')}
            </p>
          </div>
        </div>
      </div>

      {/* Email Contact Modal */}
      <EmailContactModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title="职业交易员面试"
      />

      </div>
  );
}