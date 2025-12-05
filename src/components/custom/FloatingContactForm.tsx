"use client";

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function FloatingContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const { language } = useLanguage();
  const isZh = language === 'zh';

  const emailAddress = "growingpool@gmail.com";
  const siteUrl = "https://growingpool.com";

  const handleSubmit = (e: React.FormEvent) => {
    // Form will be submitted by FormSubmit.co
    // No need to prevent default
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed right-8 bottom-24 z-40"
        >
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="px-6 h-14 rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-2xl border-2 border-amber-600/20 flex items-center gap-2"
            aria-label={isZh ? '联系我们' : 'Contact Us'}
            title={isZh ? '快速联系我们' : 'Quick Contact'}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">
              {isZh ? '联系我们' : 'Contact'}
            </span>
          </Button>
        </motion.div>
      )}

      {/* Floating Form - Using shadcn Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md w-full bg-white dark:bg-gray-900 border-2 border-amber-500/30 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              {isZh ? '快速联系' : 'Quick Contact'}
            </DialogTitle>
            <div className="w-full h-0.5 bg-amber-500/60 rounded-full mt-2 mb-4"></div>
            <DialogDescription>
              {isZh
                ? '填写表单，我们会尽快回复您'
                : 'Fill out the form and we will respond as soon as possible'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isZh ? '姓名 *' : 'Name *'}
              </Label>
              <Input
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={isZh ? '请输入您的姓名' : 'Enter your name'}
                className="mt-1 border-gray-200 dark:border-gray-600 focus:border-amber-500 dark:focus:border-amber-400"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isZh ? '邮箱 *' : 'Email *'}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={isZh ? '请输入您的邮箱' : 'Enter your email'}
                className="mt-1 border-gray-200 dark:border-gray-600 focus:border-amber-500 dark:focus:border-amber-400"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isZh ? '电话' : 'Phone'}
                <span className="text-gray-400 ml-1">({isZh ? '可选' : 'optional'})</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder={isZh ? '请输入您的电话' : 'Enter your phone'}
                className="mt-1 border-gray-200 dark:border-gray-600 focus:border-amber-500 dark:focus:border-amber-400"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isZh ? '留言' : 'Message'}
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder={isZh ? '请告诉我们您的需求...' : 'Tell us your needs...'}
                className="mt-1 border-gray-200 dark:border-gray-600 focus:border-amber-500 dark:focus:border-amber-400 resize-none"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-700/30 p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  🔒 {isZh
                    ? '我们重视您的隐私，不会分享您的信息。'
                    : 'We value your privacy and will not share your information.'}
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <Button
                onClick={() => {
                  // 创建临时表单提交
                  const form = document.createElement('form');
                  form.action = `https://formsubmit.co/${emailAddress}`;
                  form.method = 'POST';
                  form.style.display = 'none';

                  const hiddenNext = document.createElement('input');
                  hiddenNext.type = 'hidden';
                  hiddenNext.name = '_next';
                  hiddenNext.value = `${siteUrl}/${language}/thank-you`;

                  const hiddenSubject = document.createElement('input');
                  hiddenSubject.type = 'hidden';
                  hiddenSubject.name = '_subject';
                  hiddenSubject.value = isZh ? '快速联系 - 浮动表单' : 'Quick Contact - Floating Form';

                  const hiddenCaptcha = document.createElement('input');
                  hiddenCaptcha.type = 'hidden';
                  hiddenCaptcha.name = '_captcha';
                  hiddenCaptcha.value = 'false';

                  form.appendChild(hiddenNext);
                  form.appendChild(hiddenSubject);
                  form.appendChild(hiddenCaptcha);

                  // 添加表单字段
                  Object.entries(formData).forEach(([key, value]) => {
                    const input = document.createElement('input');
                    input.type = key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text';
                    input.name = key;
                    input.value = value;
                    input.required = key === 'name' || key === 'email';
                    form.appendChild(input);
                  });

                  document.body.appendChild(form);
                  form.submit();
                  document.body.removeChild(form);

                  setIsOpen(false);
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-sm hover:shadow transition-all duration-200"
              >
                {isZh ? '发送消息' : 'Send Message'}
              </Button>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}