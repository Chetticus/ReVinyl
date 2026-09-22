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

export function SectionLabel({ children, dark }: PropsWithChildren<{ dark?: boolean }>) {
  return (
    <span
      className={cn(
        'inline-flex w-max items-center rounded-full px-3 py-2 text-sm font-[family-name:var(--font-body)] font-medium uppercase tracking-[0.1em]',
        dark
          ? 'border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold)]'
          : 'border border-[var(--gold)]/40 bg-[var(--parchment)] text-[var(--lacquer)]',
      )}
    >
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
        'text-center font-[family-name:var(--font-display)] text-3xl font-medium leading-tight tracking-tight md:text-[48px]',
        dark ? 'text-[var(--parchment)]' : 'text-[var(--wood-darkest)]',
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
        dark ? 'text-[var(--parchment-dim)]' : 'text-[var(--parchment-faint)]',
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
  variant?: 'solid' | 'ghost';
};

export function VinylButton({ children, href, className, onClick, variant = 'solid' }: VinylButtonProps) {
  const classes = cn(
    'inline-flex h-12 cursor-pointer items-center justify-center rounded-full px-[22px] text-[15px] font-[family-name:var(--font-body)] font-medium tracking-[0.02em] transition-all duration-300 [transition-timing-function:var(--ease-vinyl)] hover:-translate-y-0.5',
    variant === 'solid' &&
      'bg-[linear-gradient(180deg,var(--gold-bright),var(--gold))] text-[var(--wood-darkest)] shadow-[0_10px_30px_-8px_rgba(201,162,75,0.55)] hover:shadow-[0_18px_40px_-10px_rgba(201,162,75,0.65)]',
    variant === 'ghost' &&
      'border border-[var(--border-gold-strong)] bg-transparent text-[var(--parchment)] hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 hover:text-[var(--gold)]',
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
