'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  onToggleSidebar?: () => void;
}

const AdminHeader = React.forwardRef<HTMLDivElement, AdminHeaderProps>(
  ({ className, onToggleSidebar, ...props }, ref) => {
    const { signOut } = useAuthStore();
    const router = useRouter();

    return (
      <div
        ref={ref}
        className={cn(
          'flex h-16 items-center justify-between px-6 bg-white border-b border-gray-200',
          className
        )}
        {...props}
      >
        {/* Left side - Toggle button and Search */}
        <div className='flex items-center space-x-4'>
          {/* Sidebar Toggle Button - Always visible for better UX */}
          <Button
            variant='ghost'
            size='icon'
            onClick={onToggleSidebar}
            aria-label='Toggle sidebar'
            className='hover:bg-gray-100 transition-colors'
          >
            <Menu className='w-5 h-5 text-gray-600' />
          </Button>
        </div>

        {/* Right side - Actions */}
        <div
          onClick={() => {
            signOut();
            router.push('/login');
          }}
          className='bg-primary-main text-white font-semibold px-3 rounded-md cursor-pointer py-1.5'
        >
          Đăng xuất
        </div>
      </div>
    );
  }
);
AdminHeader.displayName = 'AdminHeader';

export { AdminHeader };
