'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ArrowRight2,
  Star1,
  Category2,
  UserSquare,
  Book,
  Chart21,
  CloseSquare,
} from 'iconsax-react';
import { logoApp } from '@/constants/images';
import Image from 'next/image';
import { VINYL_IMAGES } from '@/constants/vinyl-home';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    { className, activeTab, onTabChange, isOpen = true, onToggle, ...props },
    ref
  ) => {
    const router = useRouter();
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
    const [isMobile, setIsMobile] = React.useState(false);

    // Check if we're on mobile
    React.useEffect(() => {
      const checkMobile = () => {
        const mobile = window.innerWidth < 1024;
        const wasMobile = isMobile;
        setIsMobile(mobile);

        // Only auto-close sidebar when transitioning from desktop to mobile
        // and sidebar was already open on desktop
        if (mobile && !wasMobile && isOpen && onToggle) {
          onToggle();
        }
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);

      return () => window.removeEventListener('resize', checkMobile);
    }, [isMobile, isOpen, onToggle]);

    const menuItems = [
      {
        section: 'TỔNG QUAN',
        items: [
          {
            id: 'dashboard',
            label: 'Bảng điều khiển',
            icon: Category2,
            href: '/admin',
          },
        ],
      },
      {
        section: 'QUẢN LÝ',
        items: [
          {
            id: 'users',
            label: 'Người dùng',
            icon: UserSquare,
            href: '/admin/users',
          },
          {
            id: 'courses',
            label: 'Chuyên đề',
            icon: Book,
            href: '/admin/topics',
            hasSubmenu: true,
            subItems: [
              {
                id: 'course-list',
                label: 'Danh sách chuyên đề',
                href: '/admin/topics',
              },
              {
                id: 'course-categories',
                label: 'Danh mục chuyên đề',
                href: '/admin/topics/categories',
              },
            ],
          },
          {
            id: 'reviews',
            label: 'Đánh giá',
            icon: Star1,
            href: '/admin/reviews',
          },
        ],
      },
    ];

    const toggleExpanded = (itemId: string) => {
      setExpandedItems(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    };

    const isItemExpanded = (itemId: string) => expandedItems.includes(itemId);

    const handleNavigation = (href: string, itemId: string) => {
      router.push(href);
      onTabChange?.(itemId);

      // Close sidebar on mobile after navigation
      if (isMobile && onToggle) {
        // Small delay to let the navigation happen first
        setTimeout(() => {
          onToggle();
        }, 150);
      }
    };

    const isActiveRoute = (href: string) => {
      return pathname === href;
    };

    // Auto-expand submenu if current path matches
    React.useEffect(() => {
      menuItems.forEach(section => {
        section.items.forEach(item => {
          if (item.hasSubmenu && item.subItems) {
            const hasActiveSubItem = item.subItems.some(subItem =>
              isActiveRoute(subItem.href)
            );
            if (hasActiveSubItem && !expandedItems.includes(item.id)) {
              setExpandedItems(prev => [...prev, item.id]);
            }
          }
        });
      });
    }, [pathname]);

    // Handle escape key to close sidebar
    React.useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen && isMobile && onToggle) {
          onToggle();
        }
      };

      if (isOpen && isMobile) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [isOpen, isMobile, onToggle]);

    // Prevent body scroll when sidebar is open on mobile
    React.useEffect(() => {
      if (isMobile && isOpen) {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = 'unset';
        };
      }
    }, [isMobile, isOpen]);

    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && isMobile && (
          <div
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden'
            onClick={onToggle}
          />
        )}

        {/* Sidebar */}
        <div
          ref={ref}
          className={cn(
            'fixed lg:relative inset-y-0 left-0 z-50 flex h-full w-64 flex-col bg-gray-50 border-r border-gray-200',
            // Smooth transition for all screen sizes
            'transition-transform duration-300 ease-in-out',
            // Mobile: Transform based on isOpen state
            !isOpen && 'lg:translate-x-0 -translate-x-full',
            // Desktop: Show/hide based on isOpen state
            !isOpen && 'lg:hidden',
            className
          )}
          {...props}
        >
          {/* Header with Toggle Button */}
          <div className='flex h-16 items-center justify-between px-6 border-b border-gray-200'>
            <Image
              src={VINYL_IMAGES.logoPrimary}
              alt='Logo'
              width={210}
              height={40}
              className='cursor-pointer'
            />
            <Button
              variant='ghost'
              size='sm'
              onClick={onToggle}
              className='lg:hidden'
              aria-label='Close sidebar'
            >
              <CloseSquare size='20' />
            </Button>
          </div>

          {/* Navigation */}
          <nav className='flex-1 px-4 py-6 space-y-6 overflow-y-auto'>
            {menuItems.map(section => (
              <div key={section.section} className='space-y-2'>
                <h3 className='text-xs font-semibold text-gray-500 uppercase tracking-wider px-2'>
                  {section.section}
                </h3>
                <div className='space-y-1'>
                  {section.items.map(item => {
                    const Icon = item.icon;
                    const isActive =
                      isActiveRoute(item.href) ||
                      (item.hasSubmenu &&
                        item.subItems?.some(subItem =>
                          isActiveRoute(subItem.href)
                        ));
                    const isExpanded = isItemExpanded(item.id);

                    return (
                      <div key={item.id} className='space-y-1'>
                        <Button
                          variant='ghost'
                          className={cn(
                            'w-full justify-start cursor-pointer h-10 px-3',
                            isActive
                              ? 'bg-[#E4722C14] text-[#E4722C] hover:bg-[#E4722C14] hover:text-[#E4722C]'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          )}
                          onClick={() => {
                            if (item.hasSubmenu) {
                              toggleExpanded(item.id);
                            } else {
                              handleNavigation(item.href, item.id);
                            }
                          }}
                        >
                          <Icon
                            size='24'
                            variant='Bulk'
                            color={isActive ? '#E4722C' : '#637381'}
                            className='mr-3'
                          />
                          {item.label}
                          {item.hasSubmenu && (
                            <ArrowRight2
                              size='16'
                              color={isActive ? '#E4722C' : '#637381'}
                              className={cn(
                                'ml-auto transition-transform duration-200',
                                isExpanded && 'rotate-90'
                              )}
                            />
                          )}
                        </Button>

                        {/* Submenu Items */}
                        {item.hasSubmenu && isExpanded && (
                          <div className='ml-6 space-y-1'>
                            {item.subItems?.map(subItem => {
                              const isSubActive = isActiveRoute(subItem.href);

                              return (
                                <Button
                                  key={subItem.id}
                                  variant='ghost'
                                  className={cn(
                                    'w-full justify-start cursor-pointer h-8 px-3 text-sm',
                                    isSubActive
                                      ? 'bg-[#E4722C14] text-[#E4722C] hover:bg-[#E4722C14] hover:text-[#E4722C]'
                                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                  )}
                                  onClick={() =>
                                    handleNavigation(subItem.href, subItem.id)
                                  }
                                >
                                  <div
                                    className={cn(
                                      'w-1.5 h-1.5 rounded-full mr-3',
                                      isSubActive
                                        ? 'bg-[#E4722C]'
                                        : 'bg-gray-400'
                                    )}
                                  />
                                  {subItem.label}
                                </Button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </>
    );
  }
);
Sidebar.displayName = 'Sidebar';

export { Sidebar };
