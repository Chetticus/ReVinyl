'use client';

import {
  AlertCircle,
  CalendarRange,
  CheckCircle2,
  Disc3,
  History,
  Loader2,
  MapPinned,
  Music2,
  Pencil,
  Plus,
  Search,
  Tags,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { FormEvent, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { archiveApi } from '@/modules/archive/api';
import { ArchiveLookup } from '@/modules/archive/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type TaxonomyKind =
  | 'artists'
  | 'albums'
  | 'eras'
  | 'genres'
  | 'regions'
  | 'instruments';

const TAXONOMY_OPTIONS = [
  {
    value: 'artists',
    label: 'Nghệ sĩ',
    singular: 'nghệ sĩ',
    description: 'Ca sĩ, nhạc sĩ và người biểu diễn',
    icon: UserRound,
    nameLabel: 'Tên nghệ sĩ',
    placeholder: 'Ví dụ: Trịnh Công Sơn',
  },
  {
    value: 'albums',
    label: 'Album',
    singular: 'album',
    description: 'Album hoặc tuyển tập chứa bản thu',
    icon: Disc3,
    nameLabel: 'Tên album',
    placeholder: 'Ví dụ: Ca khúc da vàng',
  },
  {
    value: 'eras',
    label: 'Thời kỳ',
    singular: 'thời kỳ',
    description: 'Các giai đoạn trong lịch sử âm nhạc',
    icon: History,
    nameLabel: 'Tên định danh',
    placeholder: 'Ví dụ: 1986–2000',
  },
  {
    value: 'genres',
    label: 'Thể loại',
    singular: 'thể loại',
    description: 'Phân loại theo phong cách âm nhạc',
    icon: Tags,
    nameLabel: 'Tên thể loại',
    placeholder: 'Ví dụ: Dân ca',
  },
  {
    value: 'regions',
    label: 'Vùng miền',
    singular: 'vùng miền',
    description: 'Nguồn gốc hoặc không gian văn hóa',
    icon: MapPinned,
    nameLabel: 'Tên vùng miền',
    placeholder: 'Ví dụ: Bắc Bộ',
  },
  {
    value: 'instruments',
    label: 'Nhạc cụ',
    singular: 'nhạc cụ',
    description: 'Các nhạc cụ xuất hiện trong bản thu',
    icon: Music2,
    nameLabel: 'Tên nhạc cụ',
    placeholder: 'Ví dụ: Đàn bầu',
  },
] as const;

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function TaxonomiesPage() {
  const [kind, setKind] = useState<TaxonomyKind>('artists');

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);

  const [search, setSearch] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingItem, setEditingItem] = useState<ArchiveLookup | null>(null);
  const [deletingItem, setDeletingItem] = useState<ArchiveLookup | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['archive-lookups'],
    queryFn: archiveApi.lookups,
  });

  const selectedOption =
    TAXONOMY_OPTIONS.find(option => option.value === kind) ??
    TAXONOMY_OPTIONS[0];

  const key = kind as keyof NonNullable<typeof data>;

  const items = useMemo(() => {
    const source = data?.[key] ?? [];

    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return source;
    }

    return source.filter(item => {
      const title = String(item.name ?? item.title ?? '').toLowerCase();

      const itemSlug = String(item.slug ?? '').toLowerCase();

      return title.includes(keyword) || itemSlug.includes(keyword);
    });
  }, [data, key, search]);

  const changeKind = (nextKind: TaxonomyKind) => {
    setKind(nextKind);

    setName('');
    setSlug('');
    setSlugTouched(false);

    setSearch('');
    setError('');
    setSuccess('');
    setEditingItem(null);
    setDeletingItem(null);
  };

  const resetForm = () => {
    setEditingItem(null);
    setName('');
    setSlug('');
    setSlugTouched(false);
    setError('');
  };

  const startEditing = (item: ArchiveLookup) => {
    setEditingItem(item);
    setName(item.name ?? item.title ?? '');
    setSlug(item.slug);
    setSlugTouched(true);
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNameChange = (value: string) => {
    setName(value);

    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const fd = new FormData(form);

    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');

      const startYear = fd.get('startYear');

      const endYear = fd.get('endYear');

      const payload = {
        name: name.trim(),
        slug: slug.trim(),

        startYear:
          startYear && startYear.toString().trim() !== ''
            ? Number(startYear)
            : undefined,

        endYear:
          endYear && endYear.toString().trim() !== ''
            ? Number(endYear)
            : undefined,

        translations:
          kind === 'eras'
            ? [
                {
                  locale: 'vi',

                  title: fd.get('titleVi'),

                  summary: fd.get('summaryVi'),

                  musicalContext: fd.get('musicalContextVi'),
                },
                {
                  locale: 'en',

                  title: fd.get('titleEn'),

                  summary: fd.get('summaryEn'),

                  musicalContext: fd.get('musicalContextEn'),
                },
              ].filter(item => {
                return item.title && item.title.toString().trim().length > 0;
              })
            : undefined,
      };

      if (editingItem) {
        await archiveApi.updateLookup(kind, editingItem.id, payload);
      } else {
        await archiveApi.createLookup(kind, payload);
      }

      form.reset();

      setName('');
      setSlug('');
      setSlugTouched(false);

      setSuccess(
        editingItem
          ? `Đã cập nhật ${selectedOption.singular} thành công.`
          : `Đã thêm ${selectedOption.singular} thành công.`
      );
      toast.success(editingItem ? 'Đã lưu thay đổi.' : 'Đã thêm dữ liệu mới.');
      setEditingItem(null);

      await qc.invalidateQueries({
        queryKey: ['archive-lookups'],
      });
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? String(err.response?.data?.message ?? '')
        : '';
      setError(
        message ||
          'Không thể lưu dữ liệu. Vui lòng kiểm tra thông tin và thử lại.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeItem = async () => {
    if (!deletingItem || isDeleting) return;
    try {
      setIsDeleting(true);
      setDeleteError('');
      await archiveApi.deleteLookup(kind, deletingItem.id);
      setDeletingItem(null);
      toast.success(`Đã xóa ${selectedOption.singular}.`);
      await qc.invalidateQueries({ queryKey: ['archive-lookups'] });
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? String(err.response?.data?.message ?? '')
        : '';
      setDeleteError(message || 'Không thể xóa dữ liệu. Vui lòng thử lại.');
      toast.error('Không thể xóa dữ liệu.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className='min-h-screen bg-[#F8F9FA] p-4 md:p-6 lg:p-8'>
      <div className='mx-auto max-w-[1500px]'>
        {/* PAGE HEADER */}
        <div className='mb-8'>
          <p className='text-xs font-semibold uppercase tracking-[0.16em] text-[#E4722C]'>
            Kho lưu trữ
          </p>

          <h1 className='mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#212B36] md:text-3xl'>
            Nghệ sĩ, nhạc cụ & phân loại
          </h1>

          <p className='mt-2 max-w-2xl text-sm leading-6 text-[#637381]'>
            Quản lý các dữ liệu nền được sử dụng để phân loại, tìm kiếm và xây
            dựng bối cảnh cho các bản thu trong kho lưu trữ.
          </p>
        </div>

        {/* KIND SELECTION */}
        <section className='mb-6 rounded-2xl border border-[#E8ECEF] bg-white p-5 shadow-sm md:p-6'>
          <div className='mb-5'>
            <h2 className='font-semibold text-[#212B36]'>Chọn loại dữ liệu</h2>

            <p className='mt-1 text-sm text-[#637381]'>
              Chọn nhóm dữ liệu bạn muốn quản lý.
            </p>
          </div>

          <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-6'>
            {TAXONOMY_OPTIONS.map(option => {
              const Icon = option.icon;

              const active = kind === option.value;

              return (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => changeKind(option.value)}
                  className={[
                    'group rounded-2xl border p-4 text-left transition',
                    active
                      ? 'border-[#E4722C] bg-[#FFF7F2] shadow-[0_0_0_1px_rgba(228,114,44,0.08)]'
                      : 'border-[#E5E9EC] bg-white hover:border-[#D6DCE1] hover:bg-[#FAFBFC]',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'mb-4 grid h-10 w-10 place-items-center rounded-xl transition',
                      active
                        ? 'bg-[#E4722C] text-white'
                        : 'bg-[#F4F6F8] text-[#637381] group-hover:text-[#E4722C]',
                    ].join(' ')}
                  >
                    <Icon size={18} />
                  </div>

                  <p
                    className={[
                      'text-sm font-semibold',
                      active ? 'text-[#C95F20]' : 'text-[#212B36]',
                    ].join(' ')}
                  >
                    {option.label}
                  </p>

                  <p className='mt-1 text-xs leading-5 text-[#919EAB]'>
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* CONTENT */}
        <div className='grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,.95fr)]'>
          {/* FORM */}
          <form
            key={editingItem?.id ?? `create-${kind}`}
            onSubmit={submit}
            className='rounded-2xl border border-[#E8ECEF] bg-white shadow-sm'
          >
            {/* FORM HEADER */}
            <div className='border-b border-[#EEF1F3] px-5 py-5 md:px-6'>
              <div className='flex items-center gap-3'>
                <div className='grid h-10 w-10 place-items-center rounded-xl bg-[#FFF2EA] text-[#E4722C]'>
                  {editingItem ? <Pencil size={19} /> : <Plus size={19} />}
                </div>

                <div>
                  <h2 className='font-semibold text-[#212B36]'>
                    {editingItem ? 'Chỉnh sửa' : 'Thêm'}{' '}
                    {selectedOption.singular}
                  </h2>

                  <p className='mt-0.5 text-xs text-[#919EAB]'>
                    {editingItem
                      ? 'Cập nhật dữ liệu nhưng giữ nguyên các liên kết bản thu'
                      : 'Tạo dữ liệu mới cho kho lưu trữ'}
                  </p>
                </div>
              </div>
            </div>

            <div className='space-y-7 p-5 md:p-6'>
              {/* BASIC */}
              <FormSection
                title='Thông tin cơ bản'
                description={`Thông tin định danh của ${selectedOption.singular}.`}
              >
                <FormField label={selectedOption.nameLabel} required>
                  <input
                    name='name'
                    value={name}
                    onChange={event => handleNameChange(event.target.value)}
                    required
                    placeholder={selectedOption.placeholder}
                    className={inputClass}
                  />
                </FormField>

                <FormField
                  label='Slug'
                  required
                  hint='Được dùng trong URL và định danh nội bộ.'
                >
                  <div className='relative'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-[#919EAB]'>
                      /
                    </span>

                    <input
                      name='slug'
                      value={slug}
                      onChange={event => {
                        setSlugTouched(true);

                        setSlug(slugify(event.target.value));
                      }}
                      required
                      placeholder='ten-dinh-danh'
                      className={`${inputClass} pl-7 font-mono text-sm`}
                    />
                  </div>

                  {name && slug && (
                    <div className='mt-2 flex items-center gap-1.5 text-xs text-[#919EAB]'>
                      <span>URL:</span>

                      <code className='rounded bg-[#F4F6F8] px-1.5 py-0.5 text-[#637381]'>
                        /{slug}
                      </code>
                    </div>
                  )}
                </FormField>
              </FormSection>

              {/* ERA */}
              {kind === 'eras' && (
                <>
                  <FormSection
                    title='Khoảng thời gian'
                    description='Xác định mốc bắt đầu và kết thúc của thời kỳ.'
                  >
                    <div className='grid gap-4 sm:grid-cols-2'>
                      <FormField label='Năm bắt đầu'>
                        <div className='relative'>
                          <CalendarRange
                            size={17}
                            className='absolute left-3 top-1/2 -translate-y-1/2 text-[#919EAB]'
                          />

                          <input
                            name='startYear'
                            type='number'
                            defaultValue={editingItem?.startYear}
                            placeholder='Ví dụ: 1986'
                            className={`${inputClass} pl-10`}
                          />
                        </div>
                      </FormField>

                      <FormField label='Năm kết thúc'>
                        <div className='relative'>
                          <CalendarRange
                            size={17}
                            className='absolute left-3 top-1/2 -translate-y-1/2 text-[#919EAB]'
                          />

                          <input
                            name='endYear'
                            type='number'
                            defaultValue={editingItem?.endYear}
                            placeholder='Ví dụ: 2000'
                            className={`${inputClass} pl-10`}
                          />
                        </div>
                      </FormField>
                    </div>
                  </FormSection>

                  {/* VI */}
                  <LanguageSection
                    code='VI'
                    title='Nội dung tiếng Việt'
                    description='Nội dung chính hiển thị trên phiên bản tiếng Việt.'
                  >
                    <FormField label='Tên thời kỳ'>
                      <input
                        name='titleVi'
                        defaultValue={
                          editingItem?.translations?.find(
                            item => item.locale === 'vi'
                          )?.title
                        }
                        placeholder='Ví dụ: Đổi mới và giao thoa'
                        className={inputClass}
                      />
                    </FormField>

                    <FormField
                      label='Tóm tắt'
                      hint='Mô tả ngắn về giai đoạn này.'
                    >
                      <textarea
                        name='summaryVi'
                        defaultValue={
                          editingItem?.translations?.find(
                            item => item.locale === 'vi'
                          )?.summary
                        }
                        rows={4}
                        placeholder='Giới thiệu bối cảnh chung của thời kỳ...'
                        className={textareaClass}
                      />
                    </FormField>

                    <FormField
                      label='Bối cảnh âm nhạc'
                      hint='Mô tả những thay đổi, xu hướng hoặc đặc điểm âm nhạc nổi bật.'
                    >
                      <textarea
                        name='musicalContextVi'
                        defaultValue={
                          editingItem?.translations?.find(
                            item => item.locale === 'vi'
                          )?.musicalContext
                        }
                        rows={5}
                        placeholder='Âm nhạc trong giai đoạn này có những đặc điểm...'
                        className={textareaClass}
                      />
                    </FormField>
                  </LanguageSection>

                  {/* EN */}
                  <LanguageSection
                    code='EN'
                    title='English content'
                    description='Content shown on the English version of the timeline.'
                  >
                    <FormField label='Era title'>
                      <input
                        name='titleEn'
                        defaultValue={
                          editingItem?.translations?.find(
                            item => item.locale === 'en'
                          )?.title
                        }
                        placeholder='For example: Reform and Cultural Exchange'
                        className={inputClass}
                      />
                    </FormField>

                    <FormField label='Summary'>
                      <textarea
                        name='summaryEn'
                        defaultValue={
                          editingItem?.translations?.find(
                            item => item.locale === 'en'
                          )?.summary
                        }
                        rows={4}
                        placeholder='A short introduction to this era...'
                        className={textareaClass}
                      />
                    </FormField>

                    <FormField label='Musical context'>
                      <textarea
                        name='musicalContextEn'
                        defaultValue={
                          editingItem?.translations?.find(
                            item => item.locale === 'en'
                          )?.musicalContext
                        }
                        rows={5}
                        placeholder='Describe the musical landscape and important changes during this era...'
                        className={textareaClass}
                      />
                    </FormField>
                  </LanguageSection>
                </>
              )}

              {/* MESSAGES */}
              {error && (
                <div className='flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3'>
                  <AlertCircle
                    size={18}
                    className='mt-0.5 shrink-0 text-red-500'
                  />

                  <p className='text-sm leading-6 text-red-600'>{error}</p>
                </div>
              )}

              {success && (
                <div className='flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3'>
                  <CheckCircle2
                    size={18}
                    className='mt-0.5 shrink-0 text-emerald-600'
                  />

                  <p className='text-sm leading-6 text-emerald-700'>
                    {success}
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className='flex items-center justify-between gap-3 border-t border-[#EEF1F3] bg-[#FAFBFC] px-5 py-4 md:px-6'>
              {editingItem ? (
                <button
                  type='button'
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className='inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#637381] hover:bg-[#EEF1F3] disabled:opacity-50'
                >
                  <X size={16} />
                  Hủy chỉnh sửa
                </button>
              ) : (
                <span />
              )}
              <button
                type='submit'
                disabled={isSubmitting || !name.trim() || !slug.trim()}
                className='inline-flex min-w-[120px] items-center justify-center gap-2 rounded-xl bg-[#E4722C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#D56829] disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className='animate-spin' />
                    {editingItem ? 'Đang lưu...' : 'Đang thêm...'}
                  </>
                ) : (
                  <>
                    {editingItem ? <Pencil size={16} /> : <Plus size={16} />}
                    {editingItem ? 'Lưu thay đổi' : 'Thêm mới'}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* LIST */}
          <section className='h-fit overflow-hidden rounded-2xl border border-[#E8ECEF] bg-white shadow-sm xl:sticky xl:top-6'>
            <div className='border-b border-[#EEF1F3] p-5 md:p-6'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <h2 className='font-semibold text-[#212B36]'>
                    {selectedOption.label}
                  </h2>

                  <p className='mt-1 text-xs text-[#919EAB]'>
                    {data?.[key]?.length ?? 0} mục trong hệ thống
                  </p>
                </div>

                <span className='rounded-full bg-[#FFF2EA] px-3 py-1 text-xs font-semibold text-[#D56629]'>
                  {data?.[key]?.length ?? 0}
                </span>
              </div>

              <div className='relative mt-5'>
                <Search
                  size={17}
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-[#919EAB]'
                />

                <input
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder={`Tìm ${selectedOption.singular}...`}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div className='max-h-[680px] overflow-y-auto'>
              {isLoading ? (
                <ListSkeleton />
              ) : isError ? (
                <div className='px-6 py-12 text-center'>
                  <AlertCircle size={30} className='mx-auto text-[#919EAB]' />

                  <p className='mt-3 text-sm text-[#637381]'>
                    Không thể tải dữ liệu.
                  </p>
                </div>
              ) : items.length === 0 ? (
                <div className='px-6 py-14 text-center'>
                  <div className='mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#F4F6F8] text-[#919EAB]'>
                    <selectedOption.icon size={20} />
                  </div>

                  <p className='mt-4 text-sm font-medium text-[#637381]'>
                    {search
                      ? 'Không tìm thấy kết quả phù hợp.'
                      : `Chưa có ${selectedOption.singular}.`}
                  </p>
                </div>
              ) : (
                <ul className='divide-y divide-[#EEF1F3]'>
                  {items.map((item, index) => {
                    const title = item.name ?? item.title;

                    return (
                      <li
                        key={item.id}
                        className='group flex items-center gap-4 px-5 py-4 transition hover:bg-[#FAFBFC] md:px-6'
                      >
                        <div className='grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F4F6F8] text-xs font-semibold text-[#919EAB]'>
                          {String(index + 1).padStart(2, '0')}
                        </div>

                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm font-semibold text-[#212B36]'>
                            {title}
                          </p>

                          <p className='mt-1 truncate font-mono text-xs text-[#919EAB]'>
                            /{item.slug}
                          </p>
                        </div>
                        <div className='flex shrink-0 items-center gap-1'>
                          <button
                            type='button'
                            onClick={() => startEditing(item)}
                            disabled={isDeleting}
                            className='inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-[#637381] transition hover:bg-[#EEF1F3] hover:text-[#212B36] disabled:opacity-50'
                          >
                            <Pencil size={14} />
                            Sửa
                          </button>
                          <button
                            type='button'
                            onClick={() => {
                              setDeletingItem(item);
                              setDeleteError('');
                            }}
                            disabled={isDeleting}
                            className='inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50'
                          >
                            <Trash2 size={14} />
                            Xóa
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
      <Dialog
        open={Boolean(deletingItem)}
        onOpenChange={open => {
          if (!open && !isDeleting) {
            setDeletingItem(null);
            setDeleteError('');
          }
        }}
      >
        <DialogContent className='max-w-md p-6'>
          <DialogHeader>
            <DialogTitle className='text-left text-xl'>
              Xóa {selectedOption.singular}?
            </DialogTitle>
            <DialogDescription className='text-left leading-6'>
              Bạn đang chuẩn bị xóa dữ liệu sau. Nếu dữ liệu đang được bản thu
              sử dụng, hệ thống sẽ không cho phép xóa.
            </DialogDescription>
          </DialogHeader>
          <div className='rounded-xl border border-[#E8ECEF] bg-[#FAFBFC] p-4'>
            <p className='font-semibold text-[#212B36]'>
              {deletingItem?.name ?? deletingItem?.title}
            </p>
            <p className='mt-1 font-mono text-xs text-[#919EAB]'>
              /{deletingItem?.slug}
            </p>
          </div>
          {deleteError && (
            <div className='rounded-xl border border-red-100 bg-red-50 p-4'>
              <p className='text-sm font-semibold text-red-700'>
                Không thể xóa dữ liệu
              </p>
              <p className='mt-1 text-sm leading-6 text-red-600'>
                {deleteError}
              </p>
              <p className='mt-1 text-xs text-red-500'>
                Hãy cập nhật các bản thu trước khi xóa.
              </p>
            </div>
          )}
          <DialogFooter>
            <button
              type='button'
              onClick={() => setDeletingItem(null)}
              disabled={isDeleting}
              className='rounded-xl border border-[#DFE3E8] px-4 py-2.5 text-sm font-semibold text-[#637381] hover:bg-[#F4F6F8] disabled:opacity-50'
            >
              Hủy
            </button>
            <button
              type='button'
              onClick={removeItem}
              disabled={isDeleting}
              className='inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50'
            >
              {isDeleting && <Loader2 size={16} className='animate-spin' />}
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

const inputClass =
  'h-11 w-full rounded-xl border border-[#DFE3E8] bg-white px-3 text-sm text-[#212B36] outline-none transition placeholder:text-[#B5BEC7] focus:border-[#E4722C] focus:ring-2 focus:ring-[#E4722C]/10';

const textareaClass =
  'w-full resize-y rounded-xl border border-[#DFE3E8] bg-white p-3 text-sm leading-6 text-[#212B36] outline-none transition placeholder:text-[#B5BEC7] focus:border-[#E4722C] focus:ring-2 focus:ring-[#E4722C]/10';

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className='mb-4'>
        <h3 className='text-sm font-semibold text-[#212B36]'>{title}</h3>

        {description && (
          <p className='mt-1 text-xs leading-5 text-[#919EAB]'>{description}</p>
        )}
      </div>

      <div className='space-y-4'>{children}</div>
    </section>
  );
}

function FormField({
  label,
  hint,
  required = false,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className='block'>
      <span className='mb-2 block text-sm font-medium text-[#454F5B]'>
        {label}

        {required && <span className='ml-1 text-[#E4722C]'>*</span>}
      </span>

      {children}

      {hint && (
        <span className='mt-1.5 block text-xs leading-5 text-[#919EAB]'>
          {hint}
        </span>
      )}
    </label>
  );
}

function LanguageSection({
  code,
  title,
  description,
  children,
}: {
  code: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className='rounded-2xl border border-[#E7EBEE] bg-[#FAFBFC] p-4 md:p-5'>
      <div className='mb-5 flex items-start gap-3'>
        <div className='grid h-8 min-w-8 place-items-center rounded-lg bg-white text-[10px] font-bold text-[#E4722C] shadow-sm'>
          {code}
        </div>

        <div>
          <h3 className='text-sm font-semibold text-[#212B36]'>{title}</h3>

          {description && (
            <p className='mt-1 text-xs leading-5 text-[#919EAB]'>
              {description}
            </p>
          )}
        </div>
      </div>

      <div className='space-y-4'>{children}</div>
    </section>
  );
}

function ListSkeleton() {
  return (
    <div className='divide-y divide-[#EEF1F3]'>
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className='flex animate-pulse items-center gap-4 px-6 py-4'
        >
          <div className='h-9 w-9 rounded-xl bg-[#EEF1F3]' />

          <div className='flex-1'>
            <div className='h-3 w-2/5 rounded bg-[#E8ECEF]' />

            <div className='mt-2 h-2.5 w-1/4 rounded bg-[#F0F2F4]' />
          </div>
        </div>
      ))}
    </div>
  );
}
