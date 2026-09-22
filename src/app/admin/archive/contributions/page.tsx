'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, LoaderCircle, Search, X } from 'lucide-react';
import {
  AdminReviewChecklist,
  ReviewValues,
} from '@/components/admin/archive/AdminReviewChecklist';
import { archiveApi } from '@/modules/archive/api';
import {
  Contribution,
  ContributionStatus,
  ModerateContributionInput,
} from '@/modules/archive/types';

const statusLabel: Record<ContributionStatus, string> = {
  PENDING: 'Chờ xem xét',
  UNDER_REVIEW: 'Đang kiểm tra',
  APPROVED: 'Đã chọn lọc',
  REJECTED: 'Bỏ qua',
};
const statusClass: Record<ContributionStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  UNDER_REVIEW: 'bg-blue-50 text-blue-700',
  APPROVED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-slate-100 text-slate-600',
};
const typeLabel = {
  NEW_RECORDING: 'Đề xuất bản thu',
  INFORMATION: 'Bổ sung tư liệu',
  CORRECTION: 'Đề xuất chỉnh sửa',
  STORY: 'Câu chuyện (cũ)',
  REFERENCE: 'Nguồn tham khảo (cũ)',
} as const;
const resourceLabel = {
  SOURCE: 'NGUỒN',
  IMAGE: 'HÌNH ẢNH',
  AUDIO: 'ÂM THANH',
  VIDEO: 'VIDEO',
  DOCUMENT: 'TÀI LIỆU',
  OTHER: 'KHÁC',
} as const;
const defaults: ReviewValues = {
  sourceReviewStatus: 'NOT_REVIEWED',
  rightsReviewStatus: 'NOT_REVIEWED',
  accuracyReviewStatus: 'NOT_REVIEWED',
  duplicateReviewStatus: 'NOT_REVIEWED',
};
const recordingTitle = (item: Contribution) =>
  item.recording?.translations.find(t => t.locale === 'vi')?.title ||
  item.recording?.translations[0]?.title ||
  '—';

export default function ContributionsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ContributionStatus | ''>('');
  const [selected, setSelected] = useState<Contribution | null>(null);
  const [note, setNote] = useState('');
  const [review, setReview] = useState<ReviewValues>(defaults);
  const query = useQuery({
    queryKey: ['admin-contributions', search, status],
    queryFn: () =>
      archiveApi.adminContributions({
        search: search || undefined,
        status: status || undefined,
      }),
  });
  const update = useMutation({
    mutationFn: (nextStatus: ContributionStatus) =>
      archiveApi.updateContribution(selected!.id, {
        status: nextStatus,
        moderatorNote: note.trim() || undefined,
        ...review,
      } satisfies ModerateContributionInput),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['admin-contributions'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['archive-admin-dashboard'],
      });
      setSelected(null);
    },
  });
  const open = (item: Contribution) => {
    setSelected(item);
    setNote(item.moderatorNote ?? '');
    setReview({
      sourceReviewStatus: item.sourceReviewStatus ?? 'NOT_REVIEWED',
      rightsReviewStatus: item.rightsReviewStatus ?? 'NOT_REVIEWED',
      accuracyReviewStatus: item.accuracyReviewStatus ?? 'NOT_REVIEWED',
      duplicateReviewStatus: item.duplicateReviewStatus ?? 'NOT_REVIEWED',
    });
  };
  return (
    <main className='p-6 lg:p-8'>
      <p className='text-xs font-bold uppercase tracking-[.18em] text-[#E4722C]'>
        Kho lưu trữ
      </p>
      <h1 className='mt-2 text-3xl font-bold text-[#212B36]'>
        Đóng góp từ người dùng
      </h1>
      <p className='mt-2 text-[#637381]'>
        Xem, kiểm chứng và chọn lọc thông tin được cộng đồng gửi về.
      </p>
      <div className='mt-7 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row'>
        <label className='relative flex-1'>
          <Search className='absolute left-3 top-3 text-[#919EAB]' size={20} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Tìm tiêu đề, tên hoặc email...'
            className='h-11 w-full rounded-lg border border-[#DFE3E8] pl-10 pr-3'
          />
        </label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value as ContributionStatus | '')}
          className='h-11 rounded-lg border border-[#DFE3E8] bg-white px-3'
        >
          <option value=''>Tất cả trạng thái</option>
          {Object.entries(statusLabel).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <div className='mt-5 overflow-hidden rounded-xl bg-white shadow-sm'>
        {query.isLoading ? (
          <div className='flex justify-center gap-2 p-12 text-[#637381]'>
            <LoaderCircle className='animate-spin' />
            Đang tải...
          </div>
        ) : query.isError ? (
          <p className='p-12 text-center text-red-700'>
            Không thể tải danh sách đóng góp.
          </p>
        ) : !query.data?.length ? (
          <p className='p-12 text-center text-[#637381]'>
            Chưa có đóng góp phù hợp.
          </p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[1100px] text-left text-sm'>
              <thead className='bg-[#F4F6F8] text-xs uppercase text-[#637381]'>
                <tr>
                  {[
                    'Người đóng góp',
                    'Loại',
                    'Tiêu đề',
                    'Bản thu liên quan',
                    'Ngôn ngữ',
                    'Trạng thái',
                    'Ngày gửi',
                    'Thao tác',
                  ].map(h => (
                    <th key={h} className='p-4'>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-[#F0F2F4]'>
                {query.data.map(item => (
                  <tr key={item.id} className='hover:bg-[#FAFAFA]'>
                    <td className='p-4'>
                      <p className='font-semibold'>
                        {item.submitter?.fullName ||
                          'Tài khoản không còn tồn tại'}
                      </p>
                      <p className='text-[#637381]'>
                        {item.submitter?.email || '—'}
                      </p>
                    </td>
                    <td className='p-4'>
                      <span className='rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700'>
                        {typeLabel[item.type] ?? 'Đóng góp cũ'}
                      </span>
                    </td>
                    <td className='max-w-xs p-4 font-medium'>{item.title}</td>
                    <td className='p-4'>{recordingTitle(item)}</td>
                    <td className='p-4 uppercase'>{item.locale ?? '—'}</td>
                    <td className='p-4'>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[item.status]}`}
                      >
                        {statusLabel[item.status]}
                      </span>
                    </td>
                    <td className='p-4 text-[#637381]'>
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className='p-4'>
                      <button
                        onClick={() => open(item)}
                        className='font-semibold text-[#E4722C]'
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {selected && (
        <div
          className='fixed inset-0 z-50 flex justify-end bg-black/35'
          onMouseDown={() => setSelected(null)}
        >
          <aside
            className='h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-2xl'
            onMouseDown={e => e.stopPropagation()}
          >
            <div className='flex items-start justify-between'>
              <div>
                <p className='text-xs font-bold uppercase tracking-[.15em] text-[#E4722C]'>
                  Chi tiết đóng góp
                </p>
                <h2 className='mt-2 text-2xl font-bold'>{selected.title}</h2>
              </div>
              <button aria-label='Đóng' onClick={() => setSelected(null)}>
                <X />
              </button>
            </div>
            <dl className='mt-7 grid gap-5 rounded-xl bg-[#F8F9FA] p-5 text-sm sm:grid-cols-2'>
              <div>
                <dt className='text-[#637381]'>Người đóng góp</dt>
                <dd className='mt-1 font-semibold'>
                  {selected.submitter?.fullName || '—'}
                </dd>
                <dd>{selected.submitter?.email || '—'}</dd>
                <dd className='mt-1'>
                  Đồng ý ghi nhận:{' '}
                  <strong>{selected.creditConsent ? 'Có' : 'Không'}</strong>
                </dd>
              </div>
              <div>
                <dt className='text-[#637381]'>Loại · Ngôn ngữ · Ngày gửi</dt>
                <dd className='mt-1 font-semibold'>
                  {typeLabel[selected.type] ?? 'Đóng góp cũ'} ·{' '}
                  {(selected.locale ?? '—').toUpperCase()}
                </dd>
                <dd>{new Date(selected.createdAt).toLocaleString('vi-VN')}</dd>
              </div>
              <div>
                <dt className='text-[#637381]'>
                  {selected.type === 'NEW_RECORDING'
                    ? 'Bản thu đề xuất'
                    : 'Bản thu liên quan'}
                </dt>
                <dd className='mt-1 font-semibold'>
                  {selected.type === 'NEW_RECORDING'
                    ? selected.proposedRecordingTitle || '—'
                    : recordingTitle(selected)}
                </dd>
                {selected.type === 'NEW_RECORDING' && (
                  <dd>
                    {[selected.proposedArtistName, selected.proposedYear]
                      .filter(Boolean)
                      .join(' · ') || '—'}
                  </dd>
                )}
              </div>
              <div>
                <dt className='text-[#637381]'>Trạng thái</dt>
                <dd className='mt-2'>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[selected.status]}`}
                  >
                    {statusLabel[selected.status]}
                  </span>
                </dd>
              </div>
            </dl>
            <section className='mt-7'>
              <h3 className='font-bold'>Nội dung</h3>
              <p className='mt-2 whitespace-pre-wrap leading-7 text-[#454F5B]'>
                {selected.content}
              </p>
            </section>
            {(selected.resources?.length > 0 || selected.sourceUrl) && (
              <section className='mt-7'>
                <h3 className='font-bold'>Tư liệu và nguồn tham khảo</h3>
                <div className='mt-3 space-y-3'>
                  {selected.resources?.map(resource => (
                    <article
                      key={resource.id}
                      className='rounded-lg border border-[#DFE3E8] p-4'
                    >
                      <span className='text-xs font-bold text-[#E4722C]'>
                        {resourceLabel[resource.type]}
                      </span>
                      {resource.title && (
                        <h4 className='mt-1 font-semibold'>{resource.title}</h4>
                      )}
                      <a
                        href={resource.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='mt-1 inline-flex items-center gap-1 break-all text-[#E4722C] underline'
                      >
                        {resource.url}
                        <ExternalLink size={15} />
                      </a>
                      {resource.note && (
                        <p className='mt-2 text-sm'>
                          <strong>Ghi chú:</strong> {resource.note}
                        </p>
                      )}
                      {resource.rightsNote && (
                        <p className='mt-2 text-sm'>
                          <strong>Thông tin quyền:</strong>{' '}
                          {resource.rightsNote}
                        </p>
                      )}
                    </article>
                  ))}
                  {selected.sourceUrl && (
                    <article className='rounded-lg border border-[#DFE3E8] p-4'>
                      <span className='text-xs font-bold text-[#E4722C]'>
                        NGUỒN CŨ
                      </span>
                      <br />
                      <a
                        href={selected.sourceUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='break-all text-[#E4722C] underline'
                      >
                        {selected.sourceUrl}
                      </a>
                    </article>
                  )}
                </div>
              </section>
            )}
            <AdminReviewChecklist value={review} onChange={setReview} />
            <label className='mt-7 block font-bold'>
              Ghi chú nội bộ
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                maxLength={2000}
                rows={5}
                className='mt-2 w-full rounded-lg border border-[#DFE3E8] p-3 font-normal'
              />
            </label>
            {update.isError && (
              <p className='mt-3 text-sm text-red-700'>
                Không thể cập nhật đóng góp.
              </p>
            )}
            <div className='mt-6 flex flex-wrap justify-end gap-3'>
              {(
                ['UNDER_REVIEW', 'REJECTED', 'APPROVED'] as ContributionStatus[]
              ).map(value => (
                <button
                  key={value}
                  disabled={update.isPending}
                  onClick={() => update.mutate(value)}
                  className={
                    value === 'APPROVED'
                      ? 'rounded-lg bg-[#E4722C] px-4 py-2.5 font-semibold text-white disabled:opacity-50'
                      : 'rounded-lg border border-[#DFE3E8] px-4 py-2.5 font-semibold disabled:opacity-50'
                  }
                >
                  {update.isPending ? 'Đang lưu...' : statusLabel[value]}
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
