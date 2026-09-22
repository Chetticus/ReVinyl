'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowRight,
  Disc3,
  FilePenLine,
  Inbox,
  Plus,
  Tags,
} from 'lucide-react';
import { archiveApi } from '@/modules/archive/api';
import {
  ArchiveAdminDashboard,
  ContributionStatus,
  ContributionType,
} from '@/modules/archive/types';

const cardClass = 'rounded-2xl border border-[#E8ECEF] bg-white shadow-sm';

const statusLabel: Record<ContributionStatus, string> = {
  PENDING: 'Chờ xem xét',
  UNDER_REVIEW: 'Đang kiểm tra',
  APPROVED: 'Đã chọn lọc',
  REJECTED: 'Bỏ qua',
};
const statusClass: Record<ContributionStatus, string> = {
  PENDING: 'bg-orange-50 text-orange-700',
  UNDER_REVIEW: 'bg-blue-50 text-blue-700',
  APPROVED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-slate-100 text-slate-600',
};
const typeLabel: Record<ContributionType, string> = {
  NEW_RECORDING: 'Đề xuất bản thu',
  INFORMATION: 'Bổ sung tư liệu',
  CORRECTION: 'Đề xuất chỉnh sửa',
  STORY: 'Câu chuyện (cũ)',
  REFERENCE: 'Nguồn tham khảo (cũ)',
};

function DashboardSkeleton() {
  return (
    <div
      aria-label='Đang tải bảng điều khiển'
      className='animate-pulse space-y-6'
    >
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {[0, 1, 2, 3].map(item => (
          <div key={item} className={`${cardClass} h-40 p-5`}>
            <div className='h-10 w-10 rounded-xl bg-slate-100' />
            <div className='mt-5 h-4 w-24 rounded bg-slate-100' />
            <div className='mt-3 h-8 w-16 rounded bg-slate-100' />
          </div>
        ))}
      </div>
      <div className='grid gap-6 xl:grid-cols-2'>
        {[0, 1].map(item => (
          <div key={item} className={`${cardClass} h-80 p-6`}>
            <div className='h-6 w-40 rounded bg-slate-100' />
            <div className='mt-8 space-y-5'>
              {[0, 1, 2, 3].map(row => (
                <div key={row} className='h-7 rounded bg-slate-100' />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={`${cardClass} h-72 p-6`}>
        <div className='h-6 w-52 rounded bg-slate-100' />
        <div className='mt-7 space-y-4'>
          {[0, 1, 2].map(row => (
            <div key={row} className='h-10 rounded bg-slate-100' />
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Disc3;
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className={`${cardClass} p-5`}>
      <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF3EB] text-[#E4722C]'>
        <Icon size={22} aria-hidden='true' />
      </div>
      <p className='mt-4 text-sm font-semibold text-[#637381]'>{label}</p>
      <p className='mt-1 text-3xl font-bold tracking-tight text-[#212B36]'>
        {value}
      </p>
      <p className='mt-1 text-sm text-[#919EAB]'>{detail}</p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  percentage,
  color,
}: {
  label: string;
  value: number;
  percentage: number;
  color: string;
}) {
  return (
    <div>
      <div className='mb-2 flex items-center justify-between text-sm'>
        <span className='font-medium text-[#637381]'>{label}</span>
        <span className='font-bold text-[#212B36]'>
          {value} · {percentage}%
        </span>
      </div>
      <div className='h-2.5 overflow-hidden rounded-full bg-[#F0F2F4]'>
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function DashboardContent({ data }: { data: ArchiveAdminDashboard }) {
  const total = data.recordings.total;
  const publishedPercentage =
    total > 0 ? Math.round((data.recordings.published / total) * 100) : 0;
  const draftPercentage =
    total > 0 ? Math.round((data.recordings.draft / total) * 100) : 0;
  const taxonomyRows = [
    ['Nghệ sĩ', data.taxonomies.artists],
    ['Album', data.taxonomies.albums],
    ['Thời kỳ', data.taxonomies.eras],
    ['Thể loại', data.taxonomies.genres],
    ['Vùng miền', data.taxonomies.regions],
    ['Nhạc cụ', data.taxonomies.instruments],
  ] as const;
  const contributionRows = [
    ['Chờ xem xét', data.contributions.pending, 'text-orange-700'],
    ['Đang kiểm tra', data.contributions.underReview, 'text-blue-700'],
    ['Đã chọn lọc', data.contributions.approved, 'text-emerald-700'],
    ['Bỏ qua', data.contributions.rejected, 'text-slate-600'],
  ] as const;
  const attention = [
    {
      value: data.recordings.draft,
      label: 'bản thu đang ở trạng thái Draft',
      href: '/admin/archive/recordings?status=DRAFT',
      className: 'bg-amber-50 text-amber-700',
    },
    {
      value: data.contributions.pending,
      label: 'đóng góp đang chờ xem xét',
      href: '/admin/archive/contributions',
      className: 'bg-orange-50 text-orange-700',
    },
    {
      value: data.contributions.underReview,
      label: 'đóng góp đang được kiểm tra',
      href: '/admin/archive/contributions',
      className: 'bg-blue-50 text-blue-700',
    },
  ].filter(item => item.value > 0);

  return (
    <>
      <section
        aria-label='Chỉ số chính'
        className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'
      >
        <KpiCard
          icon={Disc3}
          label='Tổng bản thu'
          value={total}
          detail={`${data.recordings.published} đã xuất bản`}
        />
        <KpiCard
          icon={FilePenLine}
          label='Bản nháp'
          value={data.recordings.draft}
          detail='Cần hoàn thiện'
        />
        <KpiCard
          icon={Tags}
          label='Phân loại'
          value={data.taxonomies.total}
          detail='6 nhóm dữ liệu'
        />
        <KpiCard
          icon={Inbox}
          label='Đóng góp'
          value={data.contributions.total}
          detail={`${data.contributions.pending} chờ xem xét`}
        />
      </section>

      <section className='grid gap-6 xl:grid-cols-2'>
        <article className={`${cardClass} p-6`}>
          <h2 className='text-xl font-bold text-[#212B36]'>Bản thu</h2>
          <p className='mt-1 text-sm text-[#637381]'>
            Tình trạng xuất bản của kho lưu trữ.
          </p>
          <div className='mt-7 space-y-6'>
            <ProgressRow
              label='Đã xuất bản'
              value={data.recordings.published}
              percentage={publishedPercentage}
              color='bg-emerald-500'
            />
            <ProgressRow
              label='Bản nháp'
              value={data.recordings.draft}
              percentage={draftPercentage}
              color='bg-amber-500'
            />
          </div>
          <div className='mt-8 flex flex-wrap gap-3'>
            <Link
              href='/admin/archive/recordings'
              className='rounded-lg border border-[#DFE3E8] px-4 py-2.5 text-sm font-semibold text-[#212B36] hover:bg-[#F8F9FA]'
            >
              Xem tất cả bản thu
            </Link>
            <Link
              href='/admin/archive/recordings/new'
              className='inline-flex items-center gap-2 rounded-lg bg-[#E4722C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#C95F22]'
            >
              <Plus size={17} />
              Thêm bản thu
            </Link>
          </div>
        </article>

        <article className={`${cardClass} p-6`}>
          <h2 className='text-xl font-bold text-[#212B36]'>
            Phân loại kho lưu trữ
          </h2>
          <div className='mt-5 divide-y divide-[#F0F2F4]'>
            {taxonomyRows.map(([label, value]) => (
              <div key={label} className='flex justify-between py-3 text-sm'>
                <span className='text-[#637381]'>{label}</span>
                <strong className='text-[#212B36]'>{value}</strong>
              </div>
            ))}
          </div>
          <Link
            href='/admin/archive/taxonomies'
            className='mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#E4722C]'
          >
            Quản lý phân loại <ArrowRight size={16} />
          </Link>
        </article>
      </section>

      <section className='grid gap-6 xl:grid-cols-3'>
        <article className={`${cardClass} p-6`}>
          <h2 className='text-xl font-bold text-[#212B36]'>
            Đóng góp cộng đồng
          </h2>
          <div className='mt-5 divide-y divide-[#F0F2F4]'>
            {contributionRows.map(([label, value, color]) => (
              <div key={label} className='flex justify-between py-3 text-sm'>
                <span className='text-[#637381]'>{label}</span>
                <strong className={color}>{value}</strong>
              </div>
            ))}
          </div>
          <Link
            href='/admin/archive/contributions'
            className='mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#E4722C]'
          >
            Xem đóng góp <ArrowRight size={16} />
          </Link>
        </article>

        <article className={`${cardClass} p-6 xl:col-span-2`}>
          <h2 className='text-xl font-bold text-[#212B36]'>Cần chú ý</h2>
          <p className='mt-1 text-sm text-[#637381]'>
            Những việc Admin nên ưu tiên xử lý.
          </p>
          {attention.length ? (
            <div className='mt-5 space-y-3'>
              {attention.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className='flex items-center justify-between rounded-xl border border-[#E8ECEF] p-4 hover:bg-[#F8F9FA]'
                >
                  <span className='text-sm font-medium text-[#212B36]'>
                    <strong
                      className={`mr-2 rounded-lg px-2.5 py-1 ${item.className}`}
                    >
                      {item.value}
                    </strong>
                    {item.label}
                  </span>
                  <ArrowRight className='shrink-0 text-[#919EAB]' size={18} />
                </Link>
              ))}
            </div>
          ) : (
            <p className='mt-8 rounded-xl bg-emerald-50 p-5 text-center text-sm font-medium text-emerald-700'>
              Không có nội dung cần xử lý.
            </p>
          )}
        </article>
      </section>

      <section className={`${cardClass} overflow-hidden`}>
        <div className='flex items-center justify-between gap-4 border-b border-[#E8ECEF] p-6'>
          <div>
            <h2 className='text-xl font-bold text-[#212B36]'>
              Đóng góp mới nhất
            </h2>
            <p className='mt-1 text-sm text-[#637381]'>
              Tối đa 5 đóng góp được gửi gần đây.
            </p>
          </div>
          <Link
            href='/admin/archive/contributions'
            className='shrink-0 text-sm font-semibold text-[#E4722C]'
          >
            Xem tất cả
          </Link>
        </div>
        {!data.recentContributions.length ? (
          <p className='p-12 text-center text-sm text-[#637381]'>
            Chưa có đóng góp mới.
          </p>
        ) : (
          <div className='divide-y divide-[#F0F2F4]'>
            {data.recentContributions.map(item => (
              <div
                key={item.id}
                className='grid gap-3 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center'
              >
                <div className='min-w-0'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <span className='font-semibold text-[#212B36]'>
                      {item.submitter?.fullName || 'Người đóng góp cũ'}
                    </span>
                    <span className='rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700'>
                      {typeLabel[item.type] ?? 'Đóng góp cũ'}
                    </span>
                  </div>
                  <p className='mt-2 truncate text-sm font-medium text-[#212B36]'>
                    {item.title}
                  </p>
                  <p className='mt-1 text-xs text-[#637381]'>
                    {item.recording?.title || 'Không gắn với bản thu'} ·{' '}
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className='flex items-center gap-3'>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[item.status] ?? 'bg-slate-100 text-slate-600'}`}
                  >
                    {statusLabel[item.status] ?? 'Trạng thái cũ'}
                  </span>
                  <Link
                    href='/admin/archive/contributions'
                    className='text-sm font-semibold text-[#E4722C]'
                  >
                    Xem
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default function AdminDashboard() {
  const query = useQuery({
    queryKey: ['archive-admin-dashboard'],
    queryFn: archiveApi.adminDashboard,
    staleTime: 60_000,
  });

  return (
    <main className='min-h-full bg-[#F8F9FA]'>
      <div className='mx-auto w-full max-w-[1600px] space-y-6 p-4 md:p-6 xl:p-8'>
        <header>
          <p className='text-xs font-bold uppercase tracking-[.18em] text-[#E4722C]'>
            Kho lưu trữ
          </p>
          <h1 className='mt-2 text-3xl font-bold tracking-tight text-[#212B36]'>
            Bảng điều khiển Archive
          </h1>
          <p className='mt-2 max-w-2xl text-sm leading-6 text-[#637381]'>
            Theo dõi tình trạng kho lưu trữ, dữ liệu phân loại và các đóng góp
            đang chờ kiểm duyệt.
          </p>
        </header>
        {query.isLoading ? (
          <DashboardSkeleton />
        ) : query.isError ? (
          <section
            className={`${cardClass} flex flex-col items-center p-10 text-center`}
          >
            <AlertCircle className='text-red-500' size={32} />
            <h2 className='mt-4 text-lg font-bold text-[#212B36]'>
              Không thể tải dữ liệu bảng điều khiển.
            </h2>
            <p className='mt-1 text-sm text-[#637381]'>Vui lòng thử lại.</p>
            <button
              onClick={() => query.refetch()}
              className='mt-5 rounded-lg bg-[#E4722C] px-4 py-2.5 text-sm font-semibold text-white'
            >
              Thử lại
            </button>
          </section>
        ) : query.data ? (
          <DashboardContent data={query.data} />
        ) : null}
      </div>
    </main>
  );
}
