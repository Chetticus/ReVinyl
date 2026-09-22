'use client';

import * as React from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { usePathname, useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false); // Start closed on mobile

  // Set initial sidebar state based on screen size
  React.useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      setIsSidebarOpen(isDesktop);
    };

    // Set initial state
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getActiveTab = () => {
    if (pathname === '/admin') return 'dashboard';
    if (pathname.startsWith('/admin/users')) return 'users';
    if (pathname.startsWith('/admin/topics')) return 'courses';
    if (pathname.startsWith('/admin/archive/recordings')) return 'recordings';
    if (pathname.startsWith('/admin/archive/taxonomies')) return 'taxonomies';
    if (pathname.startsWith('/admin/community/contributions'))
      return 'contributions';
    if (pathname.startsWith('/admin/discovery-activities')) return 'challenges';
    if (pathname.startsWith('/admin/reviews')) return 'reviews';
    return 'dashboard';
  };

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        router.push('/admin');
        break;
      case 'users':
        router.push('/admin/users');
        break;
      case 'courses':
        router.push('/admin/topics');
        break;
      case 'challenges':
        router.push('/admin/discovery-activities');
        break;
      case 'reviews':
        router.push('/admin/reviews');
        break;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <Sidebar
        activeTab={getActiveTab()}
        onTabChange={handleTabChange}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />

      {/* Main content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <AdminHeader onToggleSidebar={toggleSidebar} />

        {/* Page content */}
        <main className='flex-1 overflow-y-auto'>{children}</main>
      </div>
    </div>
  );
}
