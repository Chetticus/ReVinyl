import { cn } from '@/lib/utils';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

export function SectionContainer({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('mx-auto w-full max-w-[1280px] px-4 md:px-10', className)}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: PropsWithChildren) {
  return (
    <span className='inline-flex rounded-full bg-white px-3 py-2 text-sm w-max font-medium text-[#212B36]'>
      {children}
    </span>
  );
}

export function SectionTitle({
  children,
  className,
  dark,
}: PropsWithChildren<{ className?: string; dark?: boolean }>) {
  return (
    <h2
      className={cn(
        'text-center text-3xl font-normal leading-tight tracking-tight md:text-[48px]',
        dark ? 'text-white' : 'text-[#212B36]',
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function SectionDescription({
  children,
  className,
  dark,
}: PropsWithChildren<{ className?: string; dark?: boolean }>) {
  return (
    <p
      className={cn(
        'text-base leading-6',
        dark ? 'text-[#919EAB]' : 'text-[#637381]',
        className,
      )}
    >
      {children}
    </p>
  );
}

type VinylButtonProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
};

export function VinylButton({ children, href, className, onClick }: VinylButtonProps) {
  const classes = cn(
    'inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-[#E4722C] px-[22px] text-[15px] font-bold text-white transition-opacity hover:opacity-90',
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type='button' onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
