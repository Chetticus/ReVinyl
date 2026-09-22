'use client';

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer';
import Image from 'next/image';
import React, { useState } from 'react';
import { AvatarKid } from '@/constants/images';
import {
  Home,
  User,
  BookOpen,
  Heart,
  Star,
  AlertCircle,
  ShoppingCart,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Optional helper

const UserButton = () => {
  const [open, setOpen] = useState(false);
  const activePath = 'Tổng quan'; // Replace with route match logic

  const menuItems = [
    { label: 'Tổng quan', icon: <Home size={18} /> },
    { label: 'Hồ sơ', icon: <User size={18} /> },
    { label: 'Chuyên đề đã đăng ký', icon: <BookOpen size={18} /> },
    { label: 'Yêu thích', icon: <Heart size={18} /> },
    { label: 'Đánh giá', icon: <Star size={18} /> },
    { label: 'Điểm kiểm tra', icon: <AlertCircle size={18} /> },
    { label: 'Lịch sử mua hàng', icon: <ShoppingCart size={18} /> },
    { label: 'Cài đặt', icon: <Settings size={18} /> },
  ];

  return (
    <div>
      <Drawer
        direction='right'
        open={open}
        onOpenChange={setOpen}
        onClose={() => {}}
      >
        <DrawerTrigger>
          <Image
            src={AvatarKid}
            alt='Avatar'
            width={40}
            height={40}
            className='cursor-pointer rounded-full h-10 w-10'
          />
        </DrawerTrigger>

        <DrawerContent className='bg-white w-[320px] rounded-none h-full shadow-md p-4 flex flex-col justify-between'>
          <div>
            {/* Nút đóng Drawer */}
            <button
              onClick={() => setOpen(false)}
              className='absolute top-4 left-4 p-1 rounded-full hover:bg-muted transition'
              aria-label='Đóng menu'
            >
              <X size={20} />
            </button>

            {/* Avatar & Info */}
            <div className='flex flex-col items-center py-4'>
              <Image
                src={AvatarKid}
                alt='Avatar'
                width={64}
                height={64}
                className='rounded-full border-4 border-red-200'
              />
              <h3 className='mt-2 font-semibold text-sm'>Chris Hemsworth</h3>
              <p className='text-xs text-muted-foreground'>
                demo@lichsukythu.cc
              </p>
            </div>

            <div className='border-t my-4' />

            {/* Menu Items */}
            <div className='flex flex-col gap-1'>
              {menuItems.map(item => (
                <button
                  key={item.label}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition',
                    activePath === item.label
                      ? 'bg-red-50 text-destructive font-semibold'
                      : 'hover:bg-accent hover:text-foreground text-muted-foreground'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <DrawerFooter className='pt-6'>
            <Button
              variant='destructive'
              className='w-full h-10 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg'
            >
              <LogOut size={16} className='mr-2' />
              Đăng xuất
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default UserButton;
