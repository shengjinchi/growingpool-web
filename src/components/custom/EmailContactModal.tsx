"use client";

import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface EmailContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}

export default function EmailContactModal({ open, onOpenChange, title }: EmailContactModalProps) {
  const { t } = useLanguage();
  const emailAddress = "growingpool@gmail.com";

  const displayTitle = title || t('email.default.title');
  const emailSubject = t('email.subject');

  const handleSendEmail = () => {
    window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}`;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    alert(t('email.copied'));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
        {/* Subtle Gold Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 -mx-6 -mt-6 mb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white inline-block">
            {displayTitle}
          </DialogTitle>
          <div className="w-full h-1 bg-amber-500/60 rounded-full mt-2"></div>
        </div>

        <div className="space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-700 dark:text-gray-300"
          >
            {t('email.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('email.address.label')}</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-gray-900 dark:text-white font-mono text-sm flex-1">
                  {emailAddress}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyEmail}
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 font-medium whitespace-nowrap"
                >
                  {t('email.copy')}
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('email.subject.label')}</p>
              <code className="text-gray-900 dark:text-white font-mono text-sm">
                {emailSubject}
              </code>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-700/30 p-4 shadow-sm">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong className="text-amber-700 dark:text-amber-300">{t('email.tip')}</strong>{t('email.tip.text')}
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3 pt-4"
          >
            <Button
              onClick={handleSendEmail}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-sm hover:shadow transition-all duration-200"
            >
              {t('email.send')}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-all"
            >
              {t('email.close')}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
