'use client';

import {
  AlertCircle,
  Archive,
  CheckCircle2,
  Eye,
  FilePenLine,
  Loader2,
  Music2,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { archiveApi } from '@/modules/archive/api';

type RecordingStatusFilter =
  | ''
  | 'DRAFT'
  | 'PUBLISHED';

const STATUS_OPTIONS: Array<{
  value: RecordingStatusFilter;
  label: string;
}> = [
    {
      value: '',
      label: 'Tất cả',
    },
    {
      value: 'DRAFT',
      label: 'Bản nháp',
    },
    {
      value: 'PUBLISHED',
      label: 'Đã xuất bản',
    },
  ];

export default function RecordingsAdminPage() {
  const [searchInput, setSearchInput] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [status, setStatus] =
    useState<RecordingStatusFilter>('');

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  const qc = useQueryClient();

  /**
   * Debounce search để tránh gọi API
   * ở mỗi lần người dùng gõ một ký tự.
   */
  useEffect(() => {
    const timeout = window.setTimeout(
      () => {
        setSearch(
          searchInput.trim()
        );
      },
      350
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchInput]);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      'admin-recordings',
      search,
      status,
    ],

    queryFn: () =>
      archiveApi.adminList({
        search:
          search ||
          undefined,

        status:
          status ||
          undefined,

        perPage: 100,
      }),
  });

  const recordings =
    data?.data ?? [];

  const visibleCount =
    recordings.length;

  const draftCount = useMemo(
    () =>
      recordings.filter(
        recording =>
          recording.status ===
          'DRAFT'
      ).length,
    [recordings]
  );

  const publishedCount = useMemo(
    () =>
      recordings.filter(
        recording =>
          recording.status ===
          'PUBLISHED'
      ).length,
    [recordings]
  );

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setStatus('');
  };

  const toggleStatus = async (
    id: string,
    currentStatus: string
  ) => {
    try {
      setProcessingId(id);

      await archiveApi.status(
        id,
        currentStatus ===
          'PUBLISHED'
          ? 'DRAFT'
          : 'PUBLISHED'
      );

      await qc.invalidateQueries({
        queryKey: [
          'admin-recordings',
        ],
      });
    } finally {
      setProcessingId(null);
    }
  };

  const removeRecording = async (
    id: string,
    title: string
  ) => {
    const accepted =
      window.confirm(
        `Bạn có chắc muốn xóa "${title}"?\n\nHành động này không thể hoàn tác.`
      );

    if (!accepted) return;

    try {
      setProcessingId(id);

      await archiveApi.remove(id);

      await qc.invalidateQueries({
        queryKey: [
          'admin-recordings',
        ],
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <main className='min-h-screen bg-[#F8F9FA] p-4 md:p-6 lg:p-8'>
      <div className='mx-auto max-w-[1500px]'>
        {/* HEADER */}
        <header className='mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.16em] text-[#E4722C]'>
              Kho lưu trữ
            </p>

            <h1 className='mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#212B36] md:text-3xl'>
              Ca khúc & bản thu
            </h1>

            <p className='mt-2 max-w-2xl text-sm leading-6 text-[#637381]'>
              Quản lý nội dung, trạng thái xuất bản và thông tin của
              các bản thu trong Vinyl Heritage Vietnam.
            </p>
          </div>

          <Link
            href='/admin/archive/recordings/new'
            className='inline-flex h-11 w-fit items-center justify-center gap-2 rounded-xl bg-[#E4722C] px-5 text-sm font-semibold text-white transition hover:bg-[#D56829]'
          >
            <Plus size={17} />

            Thêm bản thu
          </Link>
        </header>

        {/* SUMMARY */}
        <section className='mb-6 grid gap-3 sm:grid-cols-3'>
          <SummaryCard
            icon={
              <Archive size={18} />
            }
            label='Đang hiển thị'
            value={visibleCount}
          />

          <SummaryCard
            icon={
              <FilePenLine size={18} />
            }
            label='Bản nháp'
            value={draftCount}
          />

          <SummaryCard
            icon={
              <CheckCircle2 size={18} />
            }
            label='Đã xuất bản'
            value={publishedCount}
          />
        </section>

        {/* FILTER TOOLBAR */}
        <section className='mb-6 rounded-2xl border border-[#E8ECEF] bg-white p-4 shadow-sm md:p-5'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            {/* SEARCH */}
            <div className='relative min-w-0 flex-1 lg:max-w-xl'>
              <Search
                size={18}
                className='absolute left-3.5 top-1/2 -translate-y-1/2 text-[#919EAB]'
              />

              <input
                value={searchInput}
                onChange={event =>
                  setSearchInput(
                    event.target.value
                  )
                }
                placeholder='Tìm theo tên ca khúc, nghệ sĩ...'
                className='h-11 w-full rounded-xl border border-[#DFE3E8] bg-white pl-11 pr-10 text-sm text-[#212B36] outline-none transition placeholder:text-[#B5BEC7] focus:border-[#E4722C] focus:ring-2 focus:ring-[#E4722C]/10'
              />

              {searchInput && (
                <button
                  type='button'
                  onClick={() => {
                    setSearchInput('');
                    setSearch('');
                  }}
                  aria-label='Xóa tìm kiếm'
                  className='absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-[#919EAB] transition hover:bg-[#F4F6F8] hover:text-[#637381]'
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* STATUS OPTIONS */}
            <div className='flex flex-wrap gap-2'>
              {STATUS_OPTIONS.map(
                option => {
                  const active =
                    status ===
                    option.value;

                  return (
                    <button
                      key={
                        option.value ||
                        'all'
                      }
                      type='button'
                      onClick={() =>
                        setStatus(
                          option.value
                        )
                      }
                      className={[
                        'rounded-xl border px-4 py-2.5 text-sm font-medium transition',
                        active
                          ? 'border-[#E4722C] bg-[#FFF4ED] text-[#CA6128]'
                          : 'border-[#E4E8EB] bg-white text-[#637381] hover:border-[#CCD3D8] hover:bg-[#FAFBFC]',
                      ].join(
                        ' '
                      )}
                    >
                      {
                        option.label
                      }
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {(searchInput ||
            status) && (
              <div className='mt-4 flex items-center gap-3 border-t border-[#EEF1F3] pt-4'>
                <span className='text-xs text-[#919EAB]'>
                  Đang áp dụng bộ lọc
                </span>

                <button
                  type='button'
                  onClick={
                    clearFilters
                  }
                  className='text-xs font-semibold text-[#D56829] hover:text-[#E4722C]'
                >
                  Xóa tất cả
                </button>
              </div>
            )}
        </section>

        {/* CONTENT */}
        <section className='overflow-hidden rounded-2xl border border-[#E8ECEF] bg-white shadow-sm'>
          {/* TABLE HEADER */}
          <div className='flex items-center justify-between border-b border-[#EEF1F3] px-5 py-4 md:px-6'>
            <div>
              <h2 className='text-sm font-semibold text-[#212B36]'>
                Danh sách bản thu
              </h2>

              <p className='mt-1 text-xs text-[#919EAB]'>
                {visibleCount}{' '}
                kết quả
              </p>
            </div>
          </div>

          {isLoading ? (
            <RecordingTableSkeleton />
          ) : isError ? (
            <ErrorState />
          ) : recordings.length ===
            0 ? (
            <EmptyState
              hasFilters={
                Boolean(search) ||
                Boolean(status)
              }
              clearFilters={
                clearFilters
              }
            />
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className='hidden overflow-x-auto lg:block'>
                <table className='w-full min-w-[1000px] text-left'>
                  <thead>
                    <tr className='border-b border-[#EEF1F3] bg-[#FAFBFC]'>
                      <TableHead className='w-[72px]'>
                        Artwork
                      </TableHead>

                      <TableHead>
                        Bản thu
                      </TableHead>

                      <TableHead>
                        Nghệ sĩ
                      </TableHead>

                      <TableHead>
                        Thời kỳ
                      </TableHead>

                      <TableHead>
                        Trạng thái
                      </TableHead>

                      <TableHead>
                        Cập nhật
                      </TableHead>

                      <TableHead className='text-right'>
                        Thao tác
                      </TableHead>
                    </tr>
                  </thead>

                  <tbody className='divide-y divide-[#EEF1F3]'>
                    {recordings.map(
                      recording => {
                        const title =
                          recording.translations.find(
                            translation =>
                              translation.locale ===
                              'vi'
                          )?.title ??
                          recording.slug;

                        const busy =
                          processingId ===
                          recording.id;

                        return (
                          <tr
                            key={
                              recording.id
                            }
                            className='group transition hover:bg-[#FAFBFC]'
                          >
                            {/* ARTWORK */}
                            <td className='px-5 py-4'>
                              <RecordingArtwork
                                src={
                                  recording.coverImage
                                }
                                title={
                                  title
                                }
                              />
                            </td>

                            {/* TITLE */}
                            <td className='px-4 py-4'>
                              <div className='max-w-[300px]'>
                                <Link
                                  href={`/admin/archive/recordings/${recording.id}`}
                                  className='line-clamp-1 text-sm font-semibold text-[#212B36] transition hover:text-[#E4722C]'
                                >
                                  {
                                    title
                                  }
                                </Link>

                                <p className='mt-1 truncate font-mono text-[11px] text-[#919EAB]'>
                                  /
                                  {
                                    recording.slug
                                  }
                                </p>
                              </div>
                            </td>

                            {/* ARTIST */}
                            <td className='px-4 py-4 text-sm text-[#637381]'>
                              {recording
                                .artist
                                ?.name ??
                                '—'}
                            </td>

                            {/* ERA */}
                            <td className='px-4 py-4'>
                              {recording
                                .era
                                ?.name ? (
                                <span className='rounded-full bg-[#F4F6F8] px-2.5 py-1.5 text-xs font-medium text-[#637381]'>
                                  {
                                    recording
                                      .era
                                      .name
                                  }
                                </span>
                              ) : (
                                <span className='text-sm text-[#919EAB]'>
                                  —
                                </span>
                              )}
                            </td>

                            {/* STATUS */}
                            <td className='px-4 py-4'>
                              <StatusBadge
                                status={
                                  recording.status
                                }
                              />
                            </td>

                            {/* UPDATED */}
                            <td className='px-4 py-4 text-sm text-[#637381]'>
                              {formatDate(
                                recording.updatedAt
                              )}
                            </td>

                            {/* ACTIONS */}
                            <td className='px-5 py-4'>
                              <div className='flex items-center justify-end gap-1'>
                                <ActionLink
                                  href={`/vi/recordings/${recording.slug}`}
                                  label='Xem'
                                  external
                                >
                                  <Eye
                                    size={
                                      16
                                    }
                                  />
                                </ActionLink>

                                <ActionLink
                                  href={`/admin/archive/recordings/${recording.id}`}
                                  label='Sửa'
                                >
                                  <FilePenLine
                                    size={
                                      16
                                    }
                                  />
                                </ActionLink>

                                <ActionButton
                                  label={
                                    recording.status ===
                                      'PUBLISHED'
                                      ? 'Gỡ xuất bản'
                                      : 'Xuất bản'
                                  }
                                  disabled={
                                    busy
                                  }
                                  onClick={() =>
                                    toggleStatus(
                                      recording.id,
                                      recording.status
                                    )
                                  }
                                >
                                  {busy ? (
                                    <Loader2
                                      size={
                                        16
                                      }
                                      className='animate-spin'
                                    />
                                  ) : (
                                    <Upload
                                      size={
                                        16
                                      }
                                    />
                                  )}
                                </ActionButton>

                                <ActionButton
                                  label='Xóa'
                                  danger
                                  disabled={
                                    busy
                                  }
                                  onClick={() =>
                                    removeRecording(
                                      recording.id,
                                      title
                                    )
                                  }
                                >
                                  <Trash2
                                    size={
                                      16
                                    }
                                  />
                                </ActionButton>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE / TABLET */}
              <div className='divide-y divide-[#EEF1F3] lg:hidden'>
                {recordings.map(
                  recording => {
                    const title =
                      recording.translations.find(
                        translation =>
                          translation.locale ===
                          'vi'
                      )?.title ??
                      recording.slug;

                    const busy =
                      processingId ===
                      recording.id;

                    return (
                      <article
                        key={
                          recording.id
                        }
                        className='p-4 md:p-5'
                      >
                        <div className='flex gap-4'>
                          <RecordingArtwork
                            src={
                              recording.coverImage
                            }
                            title={
                              title
                            }
                            large
                          />

                          <div className='min-w-0 flex-1'>
                            <div className='flex items-start justify-between gap-3'>
                              <div className='min-w-0'>
                                <Link
                                  href={`/admin/archive/recordings/${recording.id}`}
                                  className='line-clamp-2 font-semibold text-[#212B36]'
                                >
                                  {
                                    title
                                  }
                                </Link>

                                <p className='mt-1 truncate font-mono text-[11px] text-[#919EAB]'>
                                  /
                                  {
                                    recording.slug
                                  }
                                </p>
                              </div>

                              <StatusBadge
                                status={
                                  recording.status
                                }
                              />
                            </div>

                            <div className='mt-3 space-y-1 text-xs text-[#637381]'>
                              <p>
                                {recording
                                  .artist
                                  ?.name ??
                                  'Chưa có nghệ sĩ'}
                              </p>

                              <p>
                                {recording
                                  .era
                                  ?.name ??
                                  'Chưa xác định thời kỳ'}
                              </p>

                              <p className='text-[#919EAB]'>
                                Cập nhật{' '}
                                {formatDate(
                                  recording.updatedAt
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className='mt-4 flex flex-wrap gap-2 border-t border-[#EEF1F3] pt-4'>
                          <MobileActionLink
                            href={`/vi/recordings/${recording.slug}`}
                            label='Xem'
                            external
                            icon={
                              <Eye
                                size={
                                  15
                                }
                              />
                            }
                          />

                          <MobileActionLink
                            href={`/admin/archive/recordings/${recording.id}`}
                            label='Sửa'
                            icon={
                              <FilePenLine
                                size={
                                  15
                                }
                              />
                            }
                          />

                          <button
                            type='button'
                            disabled={
                              busy
                            }
                            onClick={() =>
                              toggleStatus(
                                recording.id,
                                recording.status
                              )
                            }
                            className='inline-flex items-center gap-1.5 rounded-lg border border-[#DFE3E8] px-3 py-2 text-xs font-medium text-[#637381] transition hover:bg-[#F4F6F8] disabled:opacity-50'
                          >
                            {busy ? (
                              <Loader2
                                size={
                                  14
                                }
                                className='animate-spin'
                              />
                            ) : (
                              <Upload
                                size={
                                  14
                                }
                              />
                            )}

                            {recording.status ===
                              'PUBLISHED'
                              ? 'Gỡ xuất bản'
                              : 'Xuất bản'}
                          </button>

                          <button
                            type='button'
                            disabled={
                              busy
                            }
                            onClick={() =>
                              removeRecording(
                                recording.id,
                                title
                              )
                            }
                            className='ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50'
                          >
                            <Trash2
                              size={
                                14
                              }
                            />

                            Xóa
                          </button>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className='flex items-center gap-4 rounded-2xl border border-[#E8ECEF] bg-white p-4 shadow-sm'>
      <div className='grid h-10 w-10 place-items-center rounded-xl bg-[#FFF2EA] text-[#E4722C]'>
        {icon}
      </div>

      <div>
        <p className='text-xs text-[#919EAB]'>
          {label}
        </p>

        <p className='mt-0.5 text-xl font-semibold text-[#212B36]'>
          {value}
        </p>
      </div>
    </div>
  );
}

function RecordingArtwork({
  src,
  title,
  large = false,
}: {
  src?: string | null;
  title: string;
  large?: boolean;
}) {
  const sizeClass = large
    ? 'size-20'
    : 'size-12';

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl bg-[#F0E8E2] ${sizeClass}`}
    >
      {src ? (
        <Image
          src={src}
          alt={title}
          fill
          sizes={
            large
              ? '80px'
              : '48px'
          }
          className='object-cover'
        />
      ) : (
        <div className='grid h-full place-items-center text-[#A38F82]'>
          <Music2
            size={
              large
                ? 24
                : 18
            }
            strokeWidth={
              1.5
            }
          />
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  if (
    status === 'PUBLISHED'
  ) {
    return (
      <span className='inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700'>
        <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />

        Đã xuất bản
      </span>
    );
  }

  return (
    <span className='inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700'>
      <span className='h-1.5 w-1.5 rounded-full bg-amber-500' />

      Bản nháp
    </span>
  );
}

function TableHead({
  children,
  className = '',
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#919EAB] ${className}`}
    >
      {children}
    </th>
  );
}

function ActionLink({
  href,
  label,
  external = false,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target={
        external
          ? '_blank'
          : undefined
      }
      rel={
        external
          ? 'noreferrer'
          : undefined
      }
      title={label}
      aria-label={label}
      className='grid h-9 w-9 place-items-center rounded-lg text-[#637381] transition hover:bg-[#F4F6F8] hover:text-[#212B36]'
    >
      {children}
    </Link>
  );
}

function ActionButton({
  label,
  danger = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type='button'
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={[
        'grid h-9 w-9 place-items-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-50',
        danger
          ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
          : 'text-[#637381] hover:bg-[#F4F6F8] hover:text-[#212B36]',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function MobileActionLink({
  href,
  label,
  external = false,
  icon,
}: {
  href: string;
  label: string;
  external?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target={
        external
          ? '_blank'
          : undefined
      }
      rel={
        external
          ? 'noreferrer'
          : undefined
      }
      className='inline-flex items-center gap-1.5 rounded-lg border border-[#DFE3E8] px-3 py-2 text-xs font-medium text-[#637381] transition hover:bg-[#F4F6F8]'
    >
      {icon}

      {label}
    </Link>
  );
}

function EmptyState({
  hasFilters,
  clearFilters,
}: {
  hasFilters: boolean;
  clearFilters: () => void;
}) {
  return (
    <div className='px-6 py-20 text-center'>
      <div className='mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#F4F6F8] text-[#919EAB]'>
        <Archive
          size={24}
          strokeWidth={1.5}
        />
      </div>

      <h3 className='mt-4 text-base font-semibold text-[#212B36]'>
        {hasFilters
          ? 'Không tìm thấy bản thu phù hợp'
          : 'Chưa có bản thu'}
      </h3>

      <p className='mx-auto mt-2 max-w-sm text-sm leading-6 text-[#919EAB]'>
        {hasFilters
          ? 'Hãy thử thay đổi từ khóa hoặc trạng thái để tìm kiếm lại.'
          : 'Bắt đầu xây dựng kho lưu trữ bằng cách thêm bản thu đầu tiên.'}
      </p>

      {hasFilters ? (
        <button
          type='button'
          onClick={
            clearFilters
          }
          className='mt-5 rounded-xl border border-[#DFE3E8] px-4 py-2.5 text-sm font-semibold text-[#637381] transition hover:bg-[#F4F6F8]'
        >
          Xóa bộ lọc
        </button>
      ) : (
        <Link
          href='/admin/archive/recordings/new'
          className='mt-5 inline-flex items-center gap-2 rounded-xl bg-[#E4722C] px-4 py-2.5 text-sm font-semibold text-white'
        >
          <Plus size={16} />

          Thêm bản thu
        </Link>
      )}
    </div>
  );
}

function ErrorState() {
  return (
    <div className='px-6 py-20 text-center'>
      <AlertCircle
        size={36}
        strokeWidth={1.5}
        className='mx-auto text-[#919EAB]'
      />

      <h3 className='mt-4 font-semibold text-[#212B36]'>
        Không thể tải danh sách bản thu
      </h3>

      <p className='mt-2 text-sm text-[#919EAB]'>
        Vui lòng kiểm tra kết nối và thử lại.
      </p>
    </div>
  );
}

function RecordingTableSkeleton() {
  return (
    <div className='divide-y divide-[#EEF1F3]'>
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className='flex animate-pulse items-center gap-5 px-6 py-4'
        >
          <div className='h-12 w-12 rounded-xl bg-[#EDF0F2]' />

          <div className='flex-1'>
            <div className='h-3 w-48 rounded bg-[#E8ECEF]' />

            <div className='mt-2 h-2.5 w-28 rounded bg-[#F0F2F4]' />
          </div>

          <div className='hidden h-3 w-28 rounded bg-[#E8ECEF] md:block' />

          <div className='hidden h-7 w-20 rounded-full bg-[#EEF1F3] lg:block' />
        </div>
      ))}
    </div>
  );
}

function formatDate(
  value: string | Date
) {
  return new Intl.DateTimeFormat(
    'vi-VN',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }
  ).format(
    new Date(value)
  );
}