'use client';

import { useInView } from '@/hooks/useInView';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'fadeInScale';
  delay?: number;
  className?: string;
  id?: string;
}

export default function AnimatedSection({
  children,
  animation = 'fadeInUp',
  delay = 0,
  className = '',
  id,
}: AnimatedSectionProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '-50px',
    triggerOnce: true,
  });

  const animationClass = isInView
    ? `animate-${animation.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    : '';
  const delayClass = delay > 0 ? `animate-delay-${delay}` : '';

  return (
    <div
      ref={ref}
      id={id}
      className={`scroll-section ${animationClass} ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
}
