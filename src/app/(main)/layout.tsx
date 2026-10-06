'use client';

import Footer from '@/components/common/Footer';
import Header from '@/components/common/header/Header';
import { AiFloatingButton } from '@/components/ui/ai-floating-button';
import { ERouteTable } from '@/constants/route';
import { usePathname } from 'next/navigation';
import React, { PropsWithChildren } from 'react';

function MainLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isAskAi = pathname === ERouteTable.ASK_AI;

  return (
    <div>
      <Header />
      <main className='flex-1'>{children}</main>
      {!isAskAi && <Footer />}
      {!isAskAi && <AiFloatingButton />}
    </div>
  );
}

export default MainLayout;
