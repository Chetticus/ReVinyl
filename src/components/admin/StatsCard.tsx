'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: any;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  (
    {
      title,
      value,
      description,
      icon: Icon,
      iconColor = 'text-blue-600',
      trend,
    },
    ref
  ) => {
    return (
      <Card ref={ref} className='bg-white border-gray-200 shadow-sm'>
        <CardContent className='p-6'>
          <div className='flex justify-between'>
            <div className='flex-1'>
              <p className='text-sm font-medium text-gray-600 mb-1'>{title}</p>
              <p className='text-2xl font-bold text-gray-900 mb-1'>{value}</p>
              <p className='text-xs text-gray-500'>{description}</p>
              {trend && (
                <div className='flex items-center mt-2'>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      trend.isPositive ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {trend.isPositive ? '+' : '-'}
                    {trend.value}
                  </span>
                  <span className='text-xs text-gray-500 ml-1'>
                    so với tháng trước
                  </span>
                </div>
              )}
            </div>
            <Icon size={32} variant='Bold' color={iconColor} />
          </div>
        </CardContent>
      </Card>
    );
  }
);
StatsCard.displayName = 'StatsCard';

export { StatsCard };
