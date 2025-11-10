"use client";

import React, { useState, useEffect } from 'react';
import EducationPasswordProtection from './EducationPasswordProtection';

interface EducationPasswordProtectionWrapperProps {
  locale: string;
  children: React.ReactNode;
}

export default function EducationPasswordProtectionWrapper({
  locale,
  children
}: EducationPasswordProtectionWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated in this session
    const authStatus = sessionStorage.getItem('education_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('education_authenticated', 'true');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-black dark:text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <EducationPasswordProtection onAuthenticated={handleAuthenticated} />;
  }

  return <>{children}</>;
}