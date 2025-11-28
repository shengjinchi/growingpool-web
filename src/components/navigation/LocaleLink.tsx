'use client';

import Link from 'next/link';
import { ComponentProps } from 'react';
import { usePathname } from 'next/navigation';

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
  locale?: string;
};

/**
 * Locale-aware Link component that automatically prefixes href with current locale
 * Usage: <LocaleLink href="/education">Education</LocaleLink>
 * Result: /zh/education or /en/education based on current URL locale
 */
export default function LocaleLink({ href, locale, ...props }: LocaleLinkProps) {
  const pathname = usePathname();

  // If locale is specified, use it; otherwise use current locale from pathname
  const effectiveLocale = locale || getCurrentLocaleFromPathname(pathname);

  // Function to extract current locale from pathname
  function getCurrentLocaleFromPathname(path: string): string {
    if (path.startsWith('/zh')) return 'zh';
    if (path.startsWith('/en')) return 'en';
    return 'zh'; // default to Chinese
  }

  // Don't prefix if href is external or already has locale
  const isExternal = href.startsWith('http') || href.startsWith('//');
  const hasLocale = href.startsWith('/zh/') || href.startsWith('/en/');

  let localizedHref = href;

  if (!isExternal && !hasLocale) {
    // Add locale prefix
    localizedHref = `/${effectiveLocale}${href.startsWith('/') ? href : `/${href}`}`;
  }

  return <Link href={localizedHref} {...props} />;
}
