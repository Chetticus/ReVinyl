'use client';

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { HambergerMenu } from 'iconsax-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { clsx } from 'clsx';

import { useAuthStore } from '@/stores/useAuthStore';
import { ERouteTable } from '@/constants/route';
import { VINYL_IMAGES } from '@/constants/vinyl-home';

type MenuMobileProps = {
  tone?: 'light' | 'dark';
};

export const MenuMobile = ({ tone = 'light' }: MenuMobileProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, signOut } = useAuthStore();

  const [open, setOpen] = useState(false);

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

  const handleNavigate = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <Drawer
      direction='left'
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger className='cursor-pointer'>
        <HambergerMenu
          variant='Broken'
          size={24}
          color={tone === 'light' ? '#212B36' : '#FFFFFF'}
        />
      </DrawerTrigger>

      <DrawerContent className='bg-[#FDF6F1] w-[320px] rounded-none h-full shadow-md overflow-y-auto'>
        <DrawerTitle className='sr-only'>
          Menu
        </DrawerTitle>

        {/* Logo */}
        <div className='p-4 w-full'>
          <div className='relative h-10 w-[180px]'>
            <Image
              src={VINYL_IMAGES.logoPrimary}
              alt='Vinyl Heritage Vietnam'
              fill
              className='object-contain object-left cursor-pointer'
              onClick={() => handleNavigate(ERouteTable.HOME)}
            />
          </div>
        </div>

        {/* Menu */}
        <div className='flex-1 p-4'>
          <div className='flex flex-col gap-2'>
            {menuItems.map(item => {
              const isActive = pathname === item.href;

              return (
                <Button
                  key={item.href}
                  variant='ghost'
                  onClick={() => handleNavigate(item.href)}
                  className={clsx(
                    'w-full justify-start rounded-md px-4 py-5 text-sm font-medium',
                    isActive
                      ? 'bg-[#E4722C]/10 text-[#E4722C] font-semibold'
                      : 'text-[#212B36] hover:bg-[#919EAB14]'
                  )}
                >
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <DrawerFooter className='mb-6'>
          {isAuthenticated ? (
            <Button
              onClick={() => {
                signOut();
                setOpen(false);
              }}
              variant='ghost'
              className='w-full text-red-600 hover:bg-red-50 hover:text-red-600'
            >
              Đăng xuất
            </Button>
          ) : (
            <>
              <Button
                variant='ghost'
                className='w-full'
                onClick={() => handleNavigate(ERouteTable.LOGIN)}
              >
                Đăng nhập
              </Button>

              <Button
                className='w-full rounded-full bg-[#E4722C] text-white hover:bg-[#E4722C]/90'
                onClick={() => handleNavigate(ERouteTable.LOGIN)}
              >
                Bắt đầu miễn phí
              </Button>
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};