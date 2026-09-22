'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthStore } from '@/stores/useAuthStore';
import { ERouteTable } from '@/constants/route';
import { AvatarKid } from '@/constants/images';
import { VINYL_IMAGES } from '@/constants/vinyl-home';
import { cn } from '@/lib/utils';
import { useUserCourse } from '@/modules/auth/hooks/useUser';
import { MenuMobile } from './MenuMobile';
import { usePublicI18n } from '@/i18n/PublicI18nProvider';
import { buildLocalePath } from '@/i18n/config';
import { LocaleSwitch } from '@/components/archive/LocaleSwitch';

function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, dictionary } = usePublicI18n();

  const [scrolled, setScrolled] = useState(false);

  const { isAuthenticated } = useAuthStore();
  const { getUserMe } = useUserCourse();

  const isHome = pathname === buildLocalePath(locale);
  const solidNav = !isHome || scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 30);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const textClass = 'text-[var(--parchment)]';

  const menuItems = [
    {
      label: dictionary.navigation.archive,
      href: buildLocalePath(locale, '/archive'),
    },
    {
      label: dictionary.navigation.timeline,
      href: buildLocalePath(locale, '/timeline'),
    },
    {
      label: dictionary.navigation.contribute,
      href: buildLocalePath(locale, '/contribute'),
    },
    {
      label: dictionary.navigation.about,
      href: buildLocalePath(locale, '/about'),
    },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 z-50 w-full transition-all duration-300',
        !solidNav && 'bg-transparent',
        solidNav &&
          'bg-[var(--wood-darkest)]/95 shadow-[var(--shadow-soft)] backdrop-blur-md'
      )}
    >
      <div className='mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 md:px-10'>
        {/* Left */}
        <div className='flex items-center gap-4 md:gap-6'>
          {/* Mobile Menu */}
          <div className='md:hidden'>
            <MenuMobile tone='dark' />
          </div>

          {/* Logo */}
          <Link
            href={buildLocalePath(locale)}
            className='relative block h-10 w-[140px] cursor-pointer md:w-[200px]'
          >
            <Image
              src={VINYL_IMAGES.logoWhite}
              alt='Vinyl Heritage Vietnam'
              fill
              className='object-contain object-left'
              priority
            />
          </Link>

          {/* Divider */}
          <div className='hidden h-5 w-px bg-[var(--parchment)]/30 md:block' />

          {/* Desktop Navigation */}
          <nav className='hidden items-center gap-8 md:flex'>
            {menuItems.map(item => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative text-sm font-medium transition-colors',
                    textClass,
                    isActive && 'font-semibold',
                    'hover:text-[var(--gold-bright)]'
                  )}
                >
                  {item.label}

                  {/* Active underline */}
                  {isActive && (
                    <span
                      className={cn(
                        'absolute -bottom-2 left-0 h-[2px] w-full rounded-full',
                        'bg-[var(--gold)]'
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right */}
        <div className='flex items-center gap-3 md:gap-4'>
          <LocaleSwitch locale={locale} />
          {isAuthenticated ? (
            <button
              type='button'
              className='cursor-pointer'
              onClick={() => router.push(ERouteTable.DASHBOARD)}
            >
              <Image
                src={getUserMe?.data?.avatar ?? AvatarKid}
                alt='Avatar'
                width={40}
                height={40}
                className='size-10 rounded-full object-cover'
              />
            </button>
          ) : (
            <div className='flex items-center gap-2'>
              <Link
                href={ERouteTable.LOGIN}
                className={cn(
                  'hidden cursor-pointer px-2 text-sm font-medium md:inline-flex',
                  textClass
                )}
              >
                {dictionary.common.signIn}
              </Link>

              <Link
                href={ERouteTable.LOGIN}
                className='inline-flex h-9 cursor-pointer items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--gold-bright),var(--gold))] px-4 text-sm font-medium text-[var(--wood-darkest)] transition-all duration-300 [transition-timing-function:var(--ease-vinyl)] hover:-translate-y-0.5'
              >
                <span className='hidden sm:inline'>
                  {dictionary.common.start}
                </span>

                <span className='sm:hidden'>{dictionary.common.explore}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
