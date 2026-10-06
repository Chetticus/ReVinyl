import React, { PropsWithChildren } from 'react';
import Header from '@/components/common/header/Header';
import Footer from '@/components/common/Footer';

function StudentLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <Header />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}

export default StudentLayout;
