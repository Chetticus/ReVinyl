import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/context/QueryProvider';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Vinyl Heritage Vietnam',
  description:
    'Vinyl Heritage Vietnam gìn giữ và kể lại những câu chuyện làm nên di sản âm nhạc Việt Nam.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await headers()).get('x-page-locale') === 'en' ? 'en' : 'vi';
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className=''>
        <Toaster
          position='top-center'
          richColors
          closeButton
          toastOptions={{
            className: 'bg-white text-black dark:bg-gray-800 dark:text-white',
            style: {
              fontSize: '14px',
              padding: '10px 15px',
            },
          }}
        />
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
