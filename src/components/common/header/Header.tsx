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

function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);

  const { isAuthenticated } = useAuthStore();
  const { getUserMe } = useUserCourse();

  const isHome = pathname === ERouteTable.HOME;
  const isLight = !isHome || scrolled;

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

  const textClass = isLight ? 'text-[#212B36]' : 'text-white';

  const dividerClass = isLight
    ? 'bg-[#919EAB3D]'
    : 'bg-white/30';

  const menuItems = [
    {
      label: 'Chuyên đề',
      href: ERouteTable.COURSE,
    },
    {
      label: 'Giới thiệu',
      href: ERouteTable.ABOUT,
    },
    {
      label: 'Liên hệ',
      href: ERouteTable.CONTACT,
    },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 z-50 w-full transition-all duration-300',
        isLight
          ? 'bg-white/95 shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      )}
    >
      <div className='mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 md:px-10'>
        {/* Left */}
        <div className='flex items-center gap-4 md:gap-6'>
          {/* Mobile Menu */}
          <div className='md:hidden'>
            <MenuMobile
              tone={isLight ? 'light' : 'dark'}
            />
          </div>

          {/* Logo */}
          <Link
            href={ERouteTable.HOME}
            className='relative block h-10 w-[140px] cursor-pointer md:w-[200px]'
          >
            <Image
              src={
                isLight
                  ? VINYL_IMAGES.logoPrimary
                  : VINYL_IMAGES.logoWhite
              }
              alt='Vinyl Heritage Vietnam'
              fill
              className='object-contain object-left'
              priority
            />
          </Link>

          {/* Divider */}
          <div
            className={cn(
              'hidden h-5 w-px md:block',
              dividerClass
            )}
          />

          {/* Desktop Navigation */}
          <nav className='hidden items-center gap-8 md:flex'>
            {menuItems.map(item => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative text-sm font-semibold transition-colors',
                    textClass,
                    isActive && 'font-bold',
                    isLight
                      ? 'hover:text-[#E4722C]'
                      : 'hover:text-white/80'
                  )}
                >
                  {item.label}

                  {/* Active underline */}
                  {isActive && (
                    <span
                      className={cn(
                        'absolute -bottom-2 left-0 h-[2px] w-full rounded-full',
                        isLight
                          ? 'bg-[#E4722C]'
                          : 'bg-white'
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
          {isAuthenticated ? (
            <button
              type='button'
              className='cursor-pointer'
              onClick={() =>
                router.push(ERouteTable.DASHBOARD)
              }
            >
              <Image
                src={
                  getUserMe?.data?.avatar ??
                  AvatarKid
                }
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
                  'hidden cursor-pointer px-2 text-sm font-bold md:inline-flex',
                  textClass
                )}
              >
                Đăng nhập
              </Link>

              <Link
                href={ERouteTable.LOGIN}
                className='inline-flex h-9 cursor-pointer items-center justify-center rounded-full bg-[#E4722C] px-4 text-sm font-bold text-white transition-opacity hover:opacity-90'
              >
                <span className='hidden sm:inline'>
                  Bắt đầu miễn phí
                </span>

                <span className='sm:hidden'>
                  Bắt đầu
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;