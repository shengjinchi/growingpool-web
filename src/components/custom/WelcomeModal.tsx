"use client";

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import EmailContactModal from './EmailContactModal';

type ModalState = 'closed' | 'expanded' | 'minimized';

export interface WelcomeModalHandle {
  open: () => void;
  close: () => void;
  minimize: () => void;
}

const WelcomeModal = forwardRef<WelcomeModalHandle>((props, ref) => {
  const [modalState, setModalState] = useState<ModalState>('closed');
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { language } = useLanguage();
  const isZh = language === 'zh';

  // B站视频嵌入地址
  const bilibiliEmbedUrl = "//player.bilibili.com/player.html?isOutside=true&aid=258136585&bvid=BV19a411X7eY&cid=767139112&p=1&muted=1&autoplay=0";

  const pauseVideo = () => {
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      iframeRef.current.src = currentSrc;
    }
  };

  const handleClose = () => {
    pauseVideo();
    setModalState('closed');
  };

  const handleMinimize = () => {
    setModalState('minimized');
  };

  const handleExpand = () => {
    setModalState('expanded');
  };

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    open: () => setModalState('expanded'),
    close: handleClose,
    minimize: handleMinimize,
  }));

  useEffect(() => {
    const hasVisited = localStorage.getItem('growingpool_welcome_shown');
    if (!hasVisited) {
      setTimeout(() => {
        setModalState('expanded');
      }, 1000);
      localStorage.setItem('growingpool_welcome_shown', 'true');
    }
  }, []);

  if (modalState === 'closed') {
    return null;
  }

  const isMinimized = modalState === 'minimized';
  const isExpanded = modalState === 'expanded';

  const minimizedStyle = {
    top: 'auto',
    left: 'auto',
    right: '2rem',
    bottom: '10rem',
    width: '20rem',
    height: 'auto',
  };

  return (
    <>
      {/* 最小化状态 */}
      {isMinimized && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={minimizedStyle}
          className="fixed z-50 bg-white dark:bg-gray-900 border-2 border-amber-500/30 shadow-2xl rounded-lg overflow-hidden"
        >
          <div className="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎓</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {isZh ? '职业交易员介绍' : 'Professional Trader Intro'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleExpand}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                aria-label={isZh ? '展开' : 'Expand'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5" />
                </svg>
              </button>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                aria-label={isZh ? '关闭' : 'Close'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="w-full aspect-video bg-black">
            <iframe
              ref={iframeRef}
              src={bilibiliEmbedUrl}
              scrolling="no"
              frameBorder="0"
              className="w-full h-full"
              allowFullScreen
            />
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              {isZh ? '点击展开查看完整内容' : 'Click expand to view full content'}
            </p>
          </div>
        </motion.div>
      )}

      {/* 展开状态 */}
      <Dialog open={isExpanded} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-4xl w-full bg-white dark:bg-gray-900 border-2 border-amber-500/30 shadow-2xl p-0">
          <DialogHeader className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="flex items-center gap-3 text-xl font-black">
              <span className="text-2xl">🎓</span>
              {isZh ? '欢迎来到 生金池' : 'Welcome to GrowingPool'}
            </DialogTitle>
            <div className="w-full h-0.5 bg-amber-500/60 rounded-full mt-2"></div>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
              {isZh ? '了解职业交易员职位，开启你的交易生涯' : 'Learn about professional trading careers'}
            </DialogDescription>
          </DialogHeader>

          <div className="relative w-full aspect-video bg-black">
            <iframe
              ref={iframeRef}
              src={bilibiliEmbedUrl}
              scrolling="no"
              frameBorder="0"
              className="w-full h-full"
              allowFullScreen
            />
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-2xl">💰</span>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {isZh ? '百万美金交易员的真实故事' : 'Million Dollar Trader - True Story'}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {isZh
                    ? '观看这部纪录片，了解普通人如何通过专业培训，成为年收入百万的职业交易员。'
                    : 'Watch this documentary to see how ordinary people become professional traders earning millions.'}
                </p>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold"
                onClick={() => setEmailModalOpen(true)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {isZh ? '免费领取交易资料' : 'Get Free Trading Resources'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Contact Modal */}
      <EmailContactModal
        open={emailModalOpen}
        onOpenChange={setEmailModalOpen}
        title={isZh ? '免费领取交易资料' : 'Get Free Trading Resources'}
      />
    </>
  );
});

WelcomeModal.displayName = 'WelcomeModal';

export default WelcomeModal;