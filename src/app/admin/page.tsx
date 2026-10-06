'use client';

import * as React from 'react';
import { StatsCard } from '@/components/admin/StatsCard';
import { DataTable } from '@/components/admin/DataTable';
import { LeaderboardCard } from '@/components/admin/LeaderboardCard';

import {
  Profile2User,
  Star1,
  User,
  Book1,
} from 'iconsax-react';

import { useRouter } from 'next/navigation';

import { useGetProductList } from '@/modules/admin/hooks/useProductAdmin';
import { useGetReviewList } from '@/modules/admin/hooks/useReviewAdmin';
import { useGetLeaderboard } from '@/modules/admin/hooks/useLeaderboardAdmin';
import { useDashboardStats } from '@/modules/admin/hooks/useDashboardAdmin';

export default function AdminDashboard() {
  const router = useRouter();

  const { data: productsResponse } = useGetProductList();
  const { data: dashboardStatsResponse } = useDashboardStats();

  const { data: reviewsResponse } = useGetReviewList({
    page: 1,
    limit: 10,
    search: '',
    rating: undefined,
    status: undefined,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const { data: leaderboardResponse } = useGetLeaderboard({
    limit: 8,
  });

  const productsData = productsResponse?.data || [];
  const reviewsData = reviewsResponse?.data?.data || [];
  const leaderboardData = leaderboardResponse?.data || [];

  const overview = dashboardStatsResponse?.data?.overview;

  const statsData = [
    {
      title: 'Tổng chuyên đề',
      value: overview?.totalCourses?.value?.toString() || '0',
      description: 'Chuyên đề đang quản lý',
      icon: Book1,
      iconColor: '#E4722C',
    },
    {
      title: overview?.totalUsers?.label || 'Người dùng',
      value: overview?.totalUsers?.value?.toString() || '0',
      description: 'Tổng tài khoản hệ thống',
      icon: Profile2User,
      iconColor: '#58735E',
    },
    {
      title: overview?.newEnrollmentsToday?.label || 'Khám phá mới',
      value:
        overview?.newEnrollmentsToday?.value?.toString() ||
        '0',
      description: 'Hoạt động trong hôm nay',
      icon: User,
      iconColor: '#C98B3C',
    },
    {
      title: overview?.totalReviews?.label || 'Đánh giá',
      value:
        overview?.totalReviews?.avgRating?.toString() ||
        '0',
      description: 'Điểm đánh giá trung bình',
      icon: Star1,
      iconColor: '#A85A44',
    },
  ];

  const formatDate = (value: string) => {
    if (!value) return '-';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (value: string) => {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const coursesColumns = [
    {
      key: 'thumbnail',
      label: 'Chuyên đề',
      render: (value: any, row: any) => (
        <div className='flex min-w-[240px] items-center gap-3'>
          <div className='h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F2ECE7]'>
            {value ? (
              <img
                src={value}
                alt={row.title || 'Chuyên đề'}
                className='h-full w-full object-cover'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F0AA70] to-[#B95635]'>
                <Book1
                  size={20}
                  color='#FFFFFF'
                  variant='Bold'
                />
              </div>
            )}
          </div>

          <div className='min-w-0'>
            <p className='truncate text-sm font-semibold text-[#24211F]'>
              {row.title}
            </p>

            <p className='mt-1 max-w-[320px] truncate text-xs text-[#8A817B]'>
              {row.short_description || 'Chưa có mô tả'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      render: (value: any) => (
        <div className='min-w-[100px]'>
          <p className='text-sm font-medium text-[#36302C]'>
            {formatDate(value)}
          </p>

          <p className='mt-1 text-xs text-[#9B918B]'>
            {formatTime(value)}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value: any) => {
        const published = value === 'published';

        return (
          <span
            className={
              published
                ? 'inline-flex rounded-full bg-[#EDF6EE] px-3 py-1 text-xs font-semibold text-[#4F7653]'
                : 'inline-flex rounded-full bg-[#FFF4E8] px-3 py-1 text-xs font-semibold text-[#B67429]'
            }
          >
            {published ? 'Đã xuất bản' : 'Bản nháp'}
          </span>
        );
      },
    },
  ];

  const reviewsColumns = [
    {
      key: 'user',
      label: 'Người dùng',
      render: (value: any) => (
        <div className='flex min-w-[180px] items-center gap-3'>
          <img
            src={
              value?.avatar ??
              'https://i.pravatar.cc/150?img=32'
            }
            alt={value?.fullName || 'Người dùng'}
            className='h-9 w-9 rounded-full border border-[#EEE8E3] object-cover'
          />

          <span className='text-sm font-medium text-[#36302C]'>
            {value?.fullName || 'Người dùng'}
          </span>
        </div>
      ),
    },
    {
      key: 'comment',
      label: 'Nội dung',
      render: (value: any) => (
        <p className='max-w-[420px] line-clamp-2 text-sm leading-6 text-[#655C56]'>
          {value || 'Không có nội dung'}
        </p>
      ),
    },
    {
      key: 'rating',
      label: 'Đánh giá',
      render: (value: any) => (
        <div className='flex min-w-[100px] items-center gap-1'>
          {[...Array(5)].map((_, i) => (
            <Star1
              key={i}
              size={16}
              variant={i < value ? 'Bold' : 'Outline'}
              color={i < value ? '#E7A23B' : '#D7D0CB'}
            />
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className='min-h-full bg-[#F8F6F3]'>
      <div className='mx-auto w-full max-w-[1600px] space-y-8 p-4 md:p-6 xl:p-8'>
        {/* Page heading */}
        <section>
          <p className='mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#E4722C]'>
            Vinyl Heritage Vietnam
          </p>

          <div className='flex flex-col justify-between gap-3 lg:flex-row lg:items-end'>
            <div>
              <h1 className='text-2xl font-bold tracking-tight text-[#24211F] md:text-3xl'>
                Tổng quan hệ thống
              </h1>

              <p className='mt-2 max-w-2xl text-sm leading-6 text-[#817871]'>
                Theo dõi chuyên đề, hoạt động người dùng và
                mức độ tương tác với kho tư liệu di sản.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              iconColor={stat.iconColor}
            />
          ))}
        </section>

        {/* Main content */}
        <section className='grid grid-cols-1 gap-6 xl:grid-cols-12'>
          {/* Main column */}
          <div className='space-y-6 xl:col-span-8'>
            <DataTable
              title='Chuyên đề gần đây'
              description='Các chuyên đề được tạo và cập nhật gần nhất.'
              columns={coursesColumns}
              data={productsData.slice(0, 5)}
              handleSeeAll={() =>
                router.push('/admin/topics')
              }
              isEditing={false}
              emptyMessage='Chưa có chuyên đề nào.'
            />

            <DataTable
              title='Đánh giá mới nhất'
              description='Phản hồi gần đây từ người dùng hệ thống.'
              columns={reviewsColumns}
              data={reviewsData.slice(0, 5)}
              handleSeeAll={() =>
                router.push('/admin/reviews')
              }
              isEditing={false}
              emptyMessage='Chưa có đánh giá nào.'
            />
          </div>

          {/* Sidebar */}
          <aside className='xl:col-span-4'>
            <div className='xl:sticky xl:top-6'>
              <LeaderboardCard data={leaderboardData} />
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}