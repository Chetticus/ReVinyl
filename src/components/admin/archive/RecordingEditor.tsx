'use client';

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Disc3,
  FileAudio,
  FileText,
  ImageIcon,
  Languages,
  Loader2,
  Music2,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { archiveApi } from '@/modules/archive/api';
import {
  ArchiveRecording,
  RecordingTranslation,
} from '@/modules/archive/types';

type Locale = 'vi' | 'en';

type InstrumentItem = {
  instrumentId: string;
  roleVi: string;
  roleEn: string;
  confidence?: number;
};

type ReferenceItem = {
  title: string;
  url: string;
  verificationStatus: string;
};

const emptyTranslation = (
  locale: Locale
): RecordingTranslation => ({
  locale,
  title: '',
  alternativeTitle: '',
  shortSummary: '',
  historicalContext: '',
  culturalContext: '',
  lyricsMeaning: '',
  lyricsNotes: '',
  whatToListenFor: '',
  preservationValue: '',
  fullLyrics: '',
  lyricsRightsStatus: '',
});

const inputClass =
  'h-11 w-full rounded-xl border border-[#DFE3E8] bg-white px-3 text-sm text-[#212B36] outline-none transition placeholder:text-[#B5BEC7] focus:border-[#E4722C] focus:ring-2 focus:ring-[#E4722C]/10';

const textareaClass =
  'w-full resize-y rounded-xl border border-[#DFE3E8] bg-white p-3 text-sm leading-6 text-[#212B36] outline-none transition placeholder:text-[#B5BEC7] focus:border-[#E4722C] focus:ring-2 focus:ring-[#E4722C]/10';

const STATUS_OPTIONS = [
  {
    value: 'DRAFT',
    label: 'Bản nháp',
    description: 'Chỉ hiển thị trong CMS',
  },
  {
    value: 'PUBLISHED',
    label: 'Đã xuất bản',
    description: 'Hiển thị trên kho âm nhạc',
  },
] as const;

const LYRICS_RIGHTS_OPTIONS = [
  {
    value: '',
    label: 'Chưa xác định',
  },
  {
    value: 'ALLOWED',
    label: 'Được phép hiển thị',
  },
  {
    value: 'RESTRICTED',
    label: 'Hạn chế hiển thị',
  },
  {
    value: 'UNKNOWN',
    label: 'Chưa rõ quyền sử dụng',
  },
];

const VERIFICATION_OPTIONS = [
  {
    value: '',
    label: 'Chưa phân loại',
  },
  {
    value: 'VERIFIED',
    label: 'Đã xác minh',
  },
  {
    value: 'PENDING',
    label: 'Đang kiểm chứng',
  },
  {
    value: 'UNVERIFIED',
    label: 'Chưa xác minh',
  },
];

const CONFIDENCE_OPTIONS = [
  { value: '', label: 'Không xác định' },
  { value: '0.5', label: 'Trung bình — 50%' },
  { value: '0.75', label: 'Khá chắc chắn — 75%' },
  { value: '1', label: 'Đã xác nhận — 100%' },
];

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

export function RecordingEditor({
  recording,
}: {
  recording?: ArchiveRecording;
}) {
  const router = useRouter();

  const { data: lookups } = useQuery({
    queryKey: ['archive-lookups'],
    queryFn: archiveApi.lookups,
  });

  const [locale, setLocale] =
    useState<Locale>('vi');

  const [translations, setTranslations] =
    useState<
      Record<
        Locale,
        RecordingTranslation
      >
    >({
      vi: emptyTranslation('vi'),
      en: emptyTranslation('en'),
    });

  const [instruments, setInstruments] =
    useState<InstrumentItem[]>([]);

  const [references, setReferences] =
    useState<ReferenceItem[]>([]);

  const [cover, setCover] =
    useState<File>();

  const [digital, setDigital] =
    useState<File>();

  const [vinylized, setVinylized] =
    useState<File>();

  const [coverPreview, setCoverPreview] =
    useState<string | null>(
      recording?.coverImage ?? null
    );

  const [slug, setSlug] = useState(
    recording?.slug ?? ''
  );

  const [slugTouched, setSlugTouched] =
    useState(Boolean(recording));

  const [status, setStatus] =
    useState(
      recording?.status ?? 'DRAFT'
    );

  const [busy, setBusy] =
    useState(false);

  useEffect(() => {
    if (!recording) return;

    setTranslations({
      vi:
        recording.translations.find(
          item =>
            item.locale === 'vi'
        ) ??
        emptyTranslation('vi'),

      en:
        recording.translations.find(
          item =>
            item.locale === 'en'
        ) ??
        emptyTranslation('en'),
    });

    setInstruments(
      recording.instruments.map(
        item => ({
          instrumentId:
            item.instrument.id,

          roleVi:
            item.roleVi ?? '',

          roleEn:
            item.roleEn ?? '',

          confidence:
            item.confidence,
        })
      )
    );

    setReferences(
      recording.references.map(
        item => ({
          title:
            item.reference.title,

          url:
            item.reference.url ??
            '',

          verificationStatus:
            item.verificationStatus ??
            '',
        })
      )
    );
  }, [recording]);

  /**
   * Preview ảnh local.
   */
  useEffect(() => {
    if (!cover) return;

    const objectUrl =
      URL.createObjectURL(cover);

    setCoverPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(
        objectUrl
      );
    };
  }, [cover]);

  const tr =
    translations[locale];

  const titleVi =
    translations.vi.title;

  useEffect(() => {
    if (
      recording ||
      slugTouched
    ) {
      return;
    }

    if (titleVi) {
      setSlug(
        slugify(titleVi)
      );
    }
  }, [
    titleVi,
    recording,
    slugTouched,
  ]);

  const completion = useMemo(() => {
    const checks = [
      Boolean(
        translations.vi.title.trim()
      ),
      Boolean(slug.trim()),
      Boolean(
        coverPreview
      ),
      Boolean(
        digital ||
        recording?.audio.some(
          item =>
            item.type ===
            'DIGITAL'
        )
      ),
      Boolean(
        translations.vi
          .shortSummary
      ),
      Boolean(
        translations.vi
          .historicalContext
      ),
    ];

    return Math.round(
      (checks.filter(Boolean)
        .length /
        checks.length) *
      100
    );
  }, [
    translations,
    slug,
    coverPreview,
    digital,
    recording,
  ]);

  const updateTranslation = <
    K extends keyof RecordingTranslation,
  >(
    key: K,
    value: RecordingTranslation[K]
  ) => {
    setTranslations(current => ({
      ...current,

      [locale]: {
        ...current[locale],
        [key]: value,
      },
    }));
  };

  const submit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form =
      event.currentTarget;

    const fd =
      new FormData(form);

    try {
      setBusy(true);

      const payload = {
        slug:
          slug.trim(),

        year: fd.get('year')
          ? Number(
            fd.get('year')
          )
          : undefined,

        artistId:
          fd.get('artistId') ||
          undefined,

        albumId:
          fd.get('albumId') ||
          undefined,

        eraId:
          fd.get('eraId') ||
          undefined,

        genreId:
          fd.get('genreId') ||
          undefined,

        regionId:
          fd.get('regionId') ||
          undefined,

        status,

        translations:
          Object.values(
            translations
          ).filter(item =>
            item.title.trim()
          ),

        instruments:
          instruments.filter(
            item =>
              item.instrumentId
          ),

        references:
          references
            .filter(item =>
              item.title.trim()
            )
            .map(item => ({
              ...item,

              url:
                item.url ||
                undefined,
            })),
      };

      const response =
        await archiveApi.save(
          payload,
          recording?.id
        );

      const id =
        recording?.id ??
        String(
          response.data.id
        );

      for (const [
        type,
        file,
      ] of [
        ['DIGITAL', digital],
        [
          'VINYLIZED',
          vinylized,
        ],
      ] as const) {
        if (!file) continue;

        const upload =
          new FormData();

        upload.append(
          'file',
          file
        );

        const prefix =
          type.toLowerCase();

        upload.append(
          'sourceNote',
          String(
            fd.get(
              `${prefix}Source`
            ) ?? ''
          )
        );

        upload.append(
          'rightsNote',
          String(
            fd.get(
              `${prefix}Rights`
            ) ?? ''
          )
        );

        await archiveApi.uploadAudio(
          id,
          type,
          upload
        );
      }

      if (cover) {
        const upload =
          new FormData();

        upload.append(
          'file',
          cover
        );

        await archiveApi.uploadCover(
          id,
          upload
        );
      }

      toast.success(
        recording
          ? 'Đã cập nhật bản thu'
          : 'Đã tạo bản thu'
      );

      router.push(
        '/admin/archive/recordings'
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Không thể lưu bản thu'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className='min-h-screen bg-[#F8F9FA]'
    >
      {/* STICKY HEADER */}
      <header className='sticky top-0 z-30 border-b border-[#E8ECEF] bg-white/95 backdrop-blur'>
        <div className='mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8'>
          <div className='flex min-w-0 items-center gap-4'>
            <Link
              href='/admin/archive/recordings'
              className='grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#637381] transition hover:bg-[#F4F6F8]'
            >
              <ArrowLeft
                size={18}
              />
            </Link>

            <div className='min-w-0'>
              <p className='text-xs font-semibold uppercase tracking-[0.12em] text-[#E4722C]'>
                Kho lưu trữ
              </p>

              <h1 className='truncate text-lg font-semibold text-[#212B36] md:text-xl'>
                {recording
                  ? 'Chỉnh sửa bản thu'
                  : 'Tạo bản thu mới'}
              </h1>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <div className='hidden text-right md:block'>
              <p className='text-[11px] text-[#919EAB]'>
                Mức hoàn thiện
              </p>

              <p className='text-sm font-semibold text-[#637381]'>
                {completion}%
              </p>
            </div>

            <button
              type='submit'
              disabled={busy}
              className='inline-flex h-10 min-w-[110px] items-center justify-center gap-2 rounded-xl bg-[#E4722C] px-4 text-sm font-semibold text-white transition hover:bg-[#D56829] disabled:cursor-not-allowed disabled:opacity-50'
            >
              {busy ? (
                <>
                  <Loader2
                    size={16}
                    className='animate-spin'
                  />
                  Đang lưu
                </>
              ) : (
                <>
                  <Save size={16} />
                  Lưu
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className='mx-auto grid max-w-[1500px] gap-6 px-4 py-6 md:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8'>
        {/* MAIN CONTENT */}
        <div className='space-y-6'>
          {/* BASIC */}
          <EditorSection
            title='Thông tin cơ bản'
            description='Thông tin định danh và phân loại của bản thu.'
            icon={
              <FileText size={18} />
            }
          >
            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                label='Slug'
                required
                hint='Đường dẫn công khai của bản thu.'
              >
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-[#919EAB]'>
                    /
                  </span>

                  <input
                    name='slug'
                    value={slug}
                    required
                    onChange={event => {
                      setSlugTouched(
                        true
                      );

                      setSlug(
                        slugify(
                          event.target
                            .value
                        )
                      );
                    }}
                    placeholder='trong-com'
                    className={`${inputClass} pl-7 font-mono`}
                  />
                </div>
              </FormField>

              <FormField label='Năm phát hành'>
                <input
                  name='year'
                  type='number'
                  defaultValue={
                    recording?.year
                  }
                  placeholder='Ví dụ: 1997'
                  className={inputClass}
                />
              </FormField>

              <TaxonomySelect
                name='artistId'
                label='Nghệ sĩ'
                placeholder='Chọn nghệ sĩ'
                defaultValue={
                  recording
                    ?.artist?.id
                }
                items={
                  lookups?.artists
                }
              />

              <TaxonomySelect
                name='albumId'
                label='Album'
                placeholder='Chọn album'
                defaultValue={
                  recording
                    ?.album?.id
                }
                items={
                  lookups?.albums
                }
              />

              <TaxonomySelect
                name='eraId'
                label='Thời kỳ'
                placeholder='Chọn thời kỳ'
                defaultValue={
                  recording
                    ?.era?.id
                }
                items={
                  lookups?.eras
                }
              />

              <TaxonomySelect
                name='genreId'
                label='Thể loại'
                placeholder='Chọn thể loại'
                defaultValue={
                  recording
                    ?.genre?.id
                }
                items={
                  lookups?.genres
                }
              />

              <TaxonomySelect
                name='regionId'
                label='Vùng miền'
                placeholder='Chọn vùng miền'
                defaultValue={
                  recording
                    ?.region?.id
                }
                items={
                  lookups?.regions
                }
              />
            </div>

            {/* STATUS */}
            <div className='mt-6'>
              <p className='mb-3 text-sm font-medium text-[#454F5B]'>
                Trạng thái xuất bản
              </p>

              <div className='grid gap-3 sm:grid-cols-2'>
                {STATUS_OPTIONS.map(
                  option => {
                    const active =
                      status ===
                      option.value;

                    return (
                      <button
                        key={
                          option.value
                        }
                        type='button'
                        onClick={() =>
                          setStatus(
                            option.value
                          )
                        }
                        className={[
                          'rounded-xl border p-4 text-left transition',
                          active
                            ? 'border-[#E4722C] bg-[#FFF5EF]'
                            : 'border-[#DFE3E8] hover:bg-[#FAFBFC]',
                        ].join(' ')}
                      >
                        <div className='flex items-center gap-2'>
                          <span
                            className={[
                              'h-2 w-2 rounded-full',
                              option.value ===
                                'PUBLISHED'
                                ? 'bg-emerald-500'
                                : 'bg-amber-500',
                            ].join(' ')}
                          />

                          <span className='text-sm font-semibold text-[#212B36]'>
                            {
                              option.label
                            }
                          </span>
                        </div>

                        <p className='mt-2 text-xs text-[#919EAB]'>
                          {
                            option.description
                          }
                        </p>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </EditorSection>

          {/* COVER */}
          <EditorSection
            title='Ảnh bìa'
            description='Artwork đại diện cho bản thu trên Archive và trang chi tiết.'
            icon={
              <ImageIcon size={18} />
            }
          >
            <div className='grid gap-6 md:grid-cols-[220px_1fr]'>
              {/* PREVIEW */}
              <div>
                <p className='mb-2 text-sm font-medium text-[#454F5B]'>
                  Preview
                </p>

                <div className='relative aspect-square overflow-hidden rounded-2xl border border-[#DFE3E8] bg-[#F4F6F8]'>
                  {coverPreview ? (
                    <Image
                      src={
                        coverPreview
                      }
                      alt='Preview ảnh bìa'
                      fill
                      unoptimized={
                        Boolean(
                          cover
                        )
                      }
                      className='object-cover'
                    />
                  ) : (
                    <div className='grid h-full place-items-center text-[#919EAB]'>
                      <div className='text-center'>
                        <ImageIcon
                          size={
                            32
                          }
                          className='mx-auto'
                        />

                        <p className='mt-2 text-xs'>
                          Chưa có ảnh
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* UPLOAD */}
              <div className='flex flex-col justify-center'>
                <label className='group cursor-pointer rounded-2xl border border-dashed border-[#D5DADE] bg-[#FAFBFC] p-6 text-center transition hover:border-[#E4722C] hover:bg-[#FFF9F5]'>
                  <div className='mx-auto grid h-11 w-11 place-items-center rounded-xl bg-white text-[#E4722C] shadow-sm'>
                    <Upload
                      size={20}
                    />
                  </div>

                  <p className='mt-4 text-sm font-semibold text-[#212B36]'>
                    Chọn ảnh bìa
                  </p>

                  <p className='mt-1 text-xs leading-5 text-[#919EAB]'>
                    JPG, JPEG, PNG hoặc WEBP
                  </p>

                  <input
                    type='file'
                    accept='.jpg,.jpeg,.png,.webp'
                    className='hidden'
                    onChange={event =>
                      setCover(
                        event.target
                          .files?.[0]
                      )
                    }
                  />
                </label>

                {cover && (
                  <div className='mt-3 flex items-center justify-between rounded-xl bg-[#F4F6F8] px-3 py-2'>
                    <div className='min-w-0'>
                      <p className='truncate text-xs font-medium text-[#454F5B]'>
                        {
                          cover.name
                        }
                      </p>

                      <p className='mt-0.5 text-[11px] text-[#919EAB]'>
                        {formatFileSize(
                          cover.size
                        )}
                      </p>
                    </div>

                    <button
                      type='button'
                      onClick={() => {
                        setCover(
                          undefined
                        );

                        setCoverPreview(
                          recording?.coverImage ??
                          null
                        );
                      }}
                      className='grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#919EAB] hover:bg-white hover:text-red-500'
                    >
                      <X
                        size={15}
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </EditorSection>

          {/* CONTENT */}
          <EditorSection
            title='Nội dung'
            description='Nội dung biên tập được hiển thị trên trang bản thu.'
            icon={
              <Languages size={18} />
            }
          >
            {/* LANGUAGE TABS */}
            <div className='mb-6 flex w-fit rounded-xl bg-[#F4F6F8] p-1'>
              {(
                [
                  'vi',
                  'en',
                ] as const
              ).map(
                item => (
                  <button
                    key={item}
                    type='button'
                    onClick={() =>
                      setLocale(
                        item
                      )
                    }
                    className={[
                      'rounded-lg px-5 py-2 text-sm font-semibold transition',
                      locale ===
                        item
                        ? 'bg-white text-[#E4722C] shadow-sm'
                        : 'text-[#637381]',
                    ].join(
                      ' '
                    )}
                  >
                    {item ===
                      'vi'
                      ? 'Tiếng Việt'
                      : 'English'}
                  </button>
                )
              )}
            </div>

            {/* LANGUAGE STATUS */}
            <div className='mb-6 flex items-center gap-2 rounded-xl bg-[#FAFBFC] px-4 py-3 text-xs text-[#637381]'>
              {tr.title ? (
                <>
                  <CheckCircle2
                    size={15}
                    className='text-emerald-500'
                  />
                  Nội dung{' '}
                  {locale.toUpperCase()}{' '}
                  đã được bắt đầu.
                </>
              ) : (
                <>
                  <AlertCircle
                    size={15}
                    className='text-amber-500'
                  />
                  Chưa có nội dung{' '}
                  {locale.toUpperCase()}.
                </>
              )}
            </div>

            <div className='space-y-6'>
              <FormField
                label='Tên bản thu'
                required={
                  locale === 'vi'
                }
              >
                <input
                  value={
                    tr.title
                  }
                  required={
                    locale === 'vi'
                  }
                  onChange={event =>
                    updateTranslation(
                      'title',
                      event.target
                        .value
                    )
                  }
                  placeholder={
                    locale ===
                      'vi'
                      ? 'Ví dụ: Trống Cơm'
                      : 'Recording title'
                  }
                  className={inputClass}
                />
              </FormField>

              <FormField label='Tên thay thế'>
                <input
                  value={
                    tr.alternativeTitle ??
                    ''
                  }
                  onChange={event =>
                    updateTranslation(
                      'alternativeTitle',
                      event.target
                        .value
                    )
                  }
                  placeholder='Tên gọi khác nếu có'
                  className={inputClass}
                />
              </FormField>

              <FormField
                label='Tóm tắt'
                hint='Giới thiệu ngắn giúp người dùng hiểu bản thu trong vài câu.'
              >
                <textarea
                  rows={4}
                  value={
                    tr.shortSummary ??
                    ''
                  }
                  onChange={event =>
                    updateTranslation(
                      'shortSummary',
                      event.target
                        .value
                    )
                  }
                  className={textareaClass}
                />
              </FormField>

              <div className='grid gap-6 lg:grid-cols-2'>
                <FormField label='Bối cảnh lịch sử'>
                  <textarea
                    rows={6}
                    value={
                      tr.historicalContext ??
                      ''
                    }
                    onChange={event =>
                      updateTranslation(
                        'historicalContext',
                        event.target
                          .value
                      )
                    }
                    className={textareaClass}
                  />
                </FormField>

                <FormField label='Bối cảnh văn hóa'>
                  <textarea
                    rows={6}
                    value={
                      tr.culturalContext ??
                      ''
                    }
                    onChange={event =>
                      updateTranslation(
                        'culturalContext',
                        event.target
                          .value
                      )
                    }
                    className={textareaClass}
                  />
                </FormField>
              </div>

              <div className='grid gap-6 lg:grid-cols-2'>
                <FormField label='Ý nghĩa lời ca'>
                  <textarea
                    rows={6}
                    value={
                      tr.lyricsMeaning ??
                      ''
                    }
                    onChange={event =>
                      updateTranslation(
                        'lyricsMeaning',
                        event.target
                          .value
                      )
                    }
                    className={textareaClass}
                  />
                </FormField>

                <FormField label='Chú giải lời ca'>
                  <textarea
                    rows={6}
                    value={
                      tr.lyricsNotes ??
                      ''
                    }
                    onChange={event =>
                      updateTranslation(
                        'lyricsNotes',
                        event.target
                          .value
                      )
                    }
                    className={textareaClass}
                  />
                </FormField>
              </div>

              <div className='grid gap-6 lg:grid-cols-2'>
                <FormField label='Điều nên chú ý khi nghe'>
                  <textarea
                    rows={5}
                    value={
                      tr.whatToListenFor ??
                      ''
                    }
                    onChange={event =>
                      updateTranslation(
                        'whatToListenFor',
                        event.target
                          .value
                      )
                    }
                    className={textareaClass}
                  />
                </FormField>

                <FormField label='Giá trị lưu giữ'>
                  <textarea
                    rows={5}
                    value={
                      tr.preservationValue ??
                      ''
                    }
                    onChange={event =>
                      updateTranslation(
                        'preservationValue',
                        event.target
                          .value
                      )
                    }
                    className={textareaClass}
                  />
                </FormField>
              </div>

              <FormField label='Lời ca đầy đủ'>
                <textarea
                  rows={8}
                  value={
                    tr.fullLyrics ??
                    ''
                  }
                  onChange={event =>
                    updateTranslation(
                      'fullLyrics',
                      event.target
                        .value
                    )
                  }
                  className={textareaClass}
                />
              </FormField>

              <FormField
                label='Tình trạng quyền sử dụng lời ca'
                hint='Nên chọn option thay vì nhập text tự do để dữ liệu thống nhất.'
              >
                <select
                  value={
                    tr.lyricsRightsStatus ??
                    ''
                  }
                  onChange={event =>
                    updateTranslation(
                      'lyricsRightsStatus',
                      event.target
                        .value
                    )
                  }
                  className={inputClass}
                >
                  {LYRICS_RIGHTS_OPTIONS.map(
                    item => (
                      <option
                        key={
                          item.value
                        }
                        value={
                          item.value
                        }
                      >
                        {
                          item.label
                        }
                      </option>
                    )
                  )}
                </select>
              </FormField>
            </div>
          </EditorSection>

          {/* AUDIO */}
          <EditorSection
            title='Audio MP3'
            description='Quản lý hai phiên bản Digital và Vinylized độc lập.'
            icon={
              <FileAudio size={18} />
            }
          >
            <div className='grid gap-5 lg:grid-cols-2'>
              <AudioUploadCard
                title='Digital'
                description='Nguồn âm thanh Digital chính của bản thu.'
                currentFile={
                  recording?.audio.find(
                    item =>
                      item.type ===
                      'DIGITAL'
                  )
                }
                file={digital}
                setFile={
                  setDigital
                }
                sourceName='digitalSource'
                rightsName='digitalRights'
              />

              <AudioUploadCard
                title='Vinylized'
                description='Phiên bản xử lý tạo trải nghiệm vinyl-inspired.'
                currentFile={
                  recording?.audio.find(
                    item =>
                      item.type ===
                      'VINYLIZED'
                  )
                }
                file={vinylized}
                setFile={
                  setVinylized
                }
                sourceName='vinylizedSource'
                rightsName='vinylizedRights'
              />
            </div>
          </EditorSection>

          {/* INSTRUMENTS */}
          <EditorSection
            title='Nhạc cụ'
            description='Xác định các nhạc cụ xuất hiện trong bản thu và vai trò của chúng.'
            icon={
              <Music2 size={18} />
            }
            action={
              <button
                type='button'
                onClick={() =>
                  setInstruments(
                    current => [
                      ...current,
                      {
                        instrumentId:
                          '',
                        roleVi: '',
                        roleEn: '',
                      },
                    ]
                  )
                }
                className='inline-flex items-center gap-1.5 rounded-lg border border-[#DFE3E8] px-3 py-2 text-xs font-semibold text-[#637381] transition hover:bg-[#F4F6F8]'
              >
                <Plus size={14} />
                Thêm nhạc cụ
              </button>
            }
          >
            {instruments.length ===
              0 ? (
              <EmptyInlineState text='Chưa thêm nhạc cụ nào.' />
            ) : (
              <div className='space-y-4'>
                {instruments.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className='rounded-2xl border border-[#E7EBEE] bg-[#FAFBFC] p-4'
                    >
                      <div className='mb-4 flex items-center justify-between'>
                        <p className='text-sm font-semibold text-[#212B36]'>
                          Nhạc cụ{' '}
                          {index +
                            1}
                        </p>

                        <button
                          type='button'
                          onClick={() =>
                            setInstruments(
                              current =>
                                current.filter(
                                  (
                                    _,
                                    itemIndex
                                  ) =>
                                    itemIndex !==
                                    index
                                )
                            )
                          }
                          className='grid h-8 w-8 place-items-center rounded-lg text-[#919EAB] hover:bg-red-50 hover:text-red-500'
                        >
                          <Trash2
                            size={
                              15
                            }
                          />
                        </button>
                      </div>

                      <div className='grid gap-4 md:grid-cols-2'>
                        <FormField label='Nhạc cụ'>
                          <select
                            value={
                              item.instrumentId
                            }
                            onChange={event =>
                              setInstruments(
                                current =>
                                  current.map(
                                    (
                                      row,
                                      itemIndex
                                    ) =>
                                      itemIndex ===
                                        index
                                        ? {
                                          ...row,
                                          instrumentId:
                                            event
                                              .target
                                              .value,
                                        }
                                        : row
                                  )
                              )
                            }
                            className={inputClass}
                          >
                            <option value=''>
                              Chọn nhạc cụ
                            </option>

                            {lookups?.instruments.map(
                              instrument => (
                                <option
                                  key={
                                    instrument.id
                                  }
                                  value={
                                    instrument.id
                                  }
                                >
                                  {
                                    instrument.name
                                  }
                                </option>
                              )
                            )}
                          </select>
                        </FormField>

                        <FormField label='Độ tin cậy'>
                          <select
                            value={
                              item.confidence ??
                              ''
                            }
                            onChange={event =>
                              setInstruments(
                                current =>
                                  current.map(
                                    (
                                      row,
                                      itemIndex
                                    ) =>
                                      itemIndex ===
                                        index
                                        ? {
                                          ...row,
                                          confidence:
                                            event
                                              .target
                                              .value
                                              ? Number(
                                                event
                                                  .target
                                                  .value
                                              )
                                              : undefined,
                                        }
                                        : row
                                  )
                              )
                            }
                            className={inputClass}
                          >
                            {CONFIDENCE_OPTIONS.map(
                              option => (
                                <option
                                  key={
                                    option.value
                                  }
                                  value={
                                    option.value
                                  }
                                >
                                  {
                                    option.label
                                  }
                                </option>
                              )
                            )}
                          </select>
                        </FormField>

                        <FormField label='Vai trò — VI'>
                          <textarea
                            rows={3}
                            value={
                              item.roleVi
                            }
                            onChange={event =>
                              setInstruments(
                                current =>
                                  current.map(
                                    (
                                      row,
                                      itemIndex
                                    ) =>
                                      itemIndex ===
                                        index
                                        ? {
                                          ...row,
                                          roleVi:
                                            event
                                              .target
                                              .value,
                                        }
                                        : row
                                  )
                              )
                            }
                            className={textareaClass}
                          />
                        </FormField>

                        <FormField label='Role — EN'>
                          <textarea
                            rows={3}
                            value={
                              item.roleEn
                            }
                            onChange={event =>
                              setInstruments(
                                current =>
                                  current.map(
                                    (
                                      row,
                                      itemIndex
                                    ) =>
                                      itemIndex ===
                                        index
                                        ? {
                                          ...row,
                                          roleEn:
                                            event
                                              .target
                                              .value,
                                        }
                                        : row
                                  )
                              )
                            }
                            className={textareaClass}
                          />
                        </FormField>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </EditorSection>

          {/* REFERENCES */}
          <EditorSection
            title='Nguồn tham khảo'
            description='Lưu các nguồn dùng để xây dựng và kiểm chứng nội dung.'
            icon={
              <FileText size={18} />
            }
            action={
              <button
                type='button'
                onClick={() =>
                  setReferences(
                    current => [
                      ...current,
                      {
                        title: '',
                        url: '',
                        verificationStatus:
                          '',
                      },
                    ]
                  )
                }
                className='inline-flex items-center gap-1.5 rounded-lg border border-[#DFE3E8] px-3 py-2 text-xs font-semibold text-[#637381] transition hover:bg-[#F4F6F8]'
              >
                <Plus size={14} />
                Thêm nguồn
              </button>
            }
          >
            {references.length ===
              0 ? (
              <EmptyInlineState text='Chưa thêm nguồn tham khảo.' />
            ) : (
              <div className='space-y-4'>
                {references.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className='rounded-2xl border border-[#E7EBEE] bg-[#FAFBFC] p-4'
                    >
                      <div className='mb-4 flex justify-between'>
                        <p className='text-sm font-semibold text-[#212B36]'>
                          Nguồn{' '}
                          {index +
                            1}
                        </p>

                        <button
                          type='button'
                          onClick={() =>
                            setReferences(
                              current =>
                                current.filter(
                                  (
                                    _,
                                    itemIndex
                                  ) =>
                                    itemIndex !==
                                    index
                                )
                            )
                          }
                          className='grid h-8 w-8 place-items-center rounded-lg text-[#919EAB] hover:bg-red-50 hover:text-red-500'
                        >
                          <Trash2
                            size={
                              15
                            }
                          />
                        </button>
                      </div>

                      <div className='grid gap-4 md:grid-cols-2'>
                        <FormField label='Tên nguồn'>
                          <input
                            value={
                              item.title
                            }
                            onChange={event =>
                              setReferences(
                                current =>
                                  current.map(
                                    (
                                      row,
                                      itemIndex
                                    ) =>
                                      itemIndex ===
                                        index
                                        ? {
                                          ...row,
                                          title:
                                            event
                                              .target
                                              .value,
                                        }
                                        : row
                                  )
                              )
                            }
                            placeholder='Ví dụ: VOV'
                            className={inputClass}
                          />
                        </FormField>

                        <FormField label='Trạng thái kiểm chứng'>
                          <select
                            value={
                              item.verificationStatus
                            }
                            onChange={event =>
                              setReferences(
                                current =>
                                  current.map(
                                    (
                                      row,
                                      itemIndex
                                    ) =>
                                      itemIndex ===
                                        index
                                        ? {
                                          ...row,
                                          verificationStatus:
                                            event
                                              .target
                                              .value,
                                        }
                                        : row
                                  )
                              )
                            }
                            className={inputClass}
                          >
                            {VERIFICATION_OPTIONS.map(
                              option => (
                                <option
                                  key={
                                    option.value
                                  }
                                  value={
                                    option.value
                                  }
                                >
                                  {
                                    option.label
                                  }
                                </option>
                              )
                            )}
                          </select>
                        </FormField>

                        <div className='md:col-span-2'>
                          <FormField label='URL'>
                            <input
                              type='url'
                              value={
                                item.url
                              }
                              onChange={event =>
                                setReferences(
                                  current =>
                                    current.map(
                                      (
                                        row,
                                        itemIndex
                                      ) =>
                                        itemIndex ===
                                          index
                                          ? {
                                            ...row,
                                            url:
                                              event
                                                .target
                                                .value,
                                          }
                                          : row
                                    )
                                )
                              }
                              placeholder='https://...'
                              className={inputClass}
                            />
                          </FormField>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </EditorSection>
        </div>

        {/* SIDE PANEL */}
        <aside className='space-y-5 lg:sticky lg:top-[92px] lg:self-start'>
          <div className='rounded-2xl border border-[#E8ECEF] bg-white p-5 shadow-sm'>
            <h2 className='text-sm font-semibold text-[#212B36]'>
              Tổng quan
            </h2>

            <div className='mt-4'>
              <div className='mb-2 flex items-center justify-between text-xs'>
                <span className='text-[#919EAB]'>
                  Mức hoàn thiện
                </span>

                <span className='font-semibold text-[#637381]'>
                  {completion}%
                </span>
              </div>

              <div className='h-2 overflow-hidden rounded-full bg-[#EEF1F3]'>
                <div
                  className='h-full rounded-full bg-[#E4722C] transition-all'
                  style={{
                    width: `${completion}%`,
                  }}
                />
              </div>
            </div>

            <div className='mt-5 space-y-3 border-t border-[#EEF1F3] pt-5 text-xs'>
              <ChecklistItem
                done={Boolean(
                  translations.vi.title
                )}
                label='Tên bản thu'
              />

              <ChecklistItem
                done={Boolean(
                  slug
                )}
                label='Slug'
              />

              <ChecklistItem
                done={Boolean(
                  coverPreview
                )}
                label='Ảnh bìa'
              />

              <ChecklistItem
                done={Boolean(
                  digital ||
                  recording?.audio.some(
                    item =>
                      item.type ===
                      'DIGITAL'
                  )
                )}
                label='Digital MP3'
              />

              <ChecklistItem
                done={Boolean(
                  translations.vi
                    .historicalContext
                )}
                label='Bối cảnh lịch sử'
              />
            </div>
          </div>

          <div className='rounded-2xl border border-[#E8ECEF] bg-white p-5 shadow-sm'>
            <h2 className='text-sm font-semibold text-[#212B36]'>
              Trạng thái
            </h2>

            <div className='mt-4'>
              {status ===
                'PUBLISHED' ? (
                <span className='inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700'>
                  <span className='h-2 w-2 rounded-full bg-emerald-500' />
                  Đã xuất bản
                </span>
              ) : (
                <span className='inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700'>
                  <span className='h-2 w-2 rounded-full bg-amber-500' />
                  Bản nháp
                </span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}

/* =========================================================
   SUB COMPONENTS
========================================================= */

function EditorSection({
  title,
  description,
  icon,
  action,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className='overflow-hidden rounded-2xl border border-[#E8ECEF] bg-white shadow-sm'>
      <div className='flex items-start justify-between gap-4 border-b border-[#EEF1F3] px-5 py-5 md:px-6'>
        <div className='flex gap-3'>
          <div className='grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFF2EA] text-[#E4722C]'>
            {icon}
          </div>

          <div>
            <h2 className='font-semibold text-[#212B36]'>
              {title}
            </h2>

            {description && (
              <p className='mt-1 text-xs leading-5 text-[#919EAB]'>
                {description}
              </p>
            )}
          </div>
        </div>

        {action}
      </div>

      <div className='p-5 md:p-6'>
        {children}
      </div>
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

        {required && (
          <span className='ml-1 text-[#E4722C]'>
            *
          </span>
        )}
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

function TaxonomySelect({
  name,
  label,
  placeholder,
  defaultValue,
  items,
}: {
  name: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  items?: Array<{
    id: string;
    name?: string;
    title?: string;
  }>;
}) {
  return (
    <FormField label={label}>
      <select
        name={name}
        defaultValue={
          defaultValue ?? ''
        }
        className={inputClass}
      >
        <option value=''>
          {placeholder}
        </option>

        {items?.map(item => (
          <option
            key={item.id}
            value={item.id}
          >
            {item.name ??
              item.title}
          </option>
        ))}
      </select>
    </FormField>
  );
}

function AudioUploadCard({
  title,
  description,
  currentFile,
  file,
  setFile,
  sourceName,
  rightsName,
}: {
  title: string;
  description: string;
  currentFile?: {
    originalFilename?: string;
    sourceNote?: string;
    rightsNote?: string;
  };
  file?: File;
  setFile: (
    file?: File
  ) => void;
  sourceName: string;
  rightsName: string;
}) {
  return (
    <div className='rounded-2xl border border-[#E7EBEE] bg-[#FAFBFC] p-4 md:p-5'>
      <div className='flex items-center gap-3'>
        <div className='grid h-9 w-9 place-items-center rounded-xl bg-white text-[#E4722C] shadow-sm'>
          <Disc3 size={17} />
        </div>

        <div>
          <h3 className='text-sm font-semibold text-[#212B36]'>
            {title}
          </h3>

          <p className='mt-0.5 text-xs text-[#919EAB]'>
            {description}
          </p>
        </div>
      </div>

      <label className='mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#D6DCE1] bg-white px-4 py-5 text-sm font-medium text-[#637381] transition hover:border-[#E4722C] hover:text-[#E4722C]'>
        <Upload size={16} />

        {file
          ? 'Thay file MP3'
          : 'Chọn file MP3'}

        <input
          type='file'
          accept='.mp3,audio/mpeg'
          className='hidden'
          onChange={event =>
            setFile(
              event.target
                .files?.[0]
            )
          }
        />
      </label>

      {(file ||
        currentFile?.originalFilename) && (
          <div className='mt-3 flex items-center justify-between rounded-xl bg-white px-3 py-3'>
            <div className='min-w-0'>
              <p className='truncate text-xs font-medium text-[#454F5B]'>
                {file?.name ??
                  currentFile
                    ?.originalFilename}
              </p>

              {file && (
                <p className='mt-0.5 text-[11px] text-[#919EAB]'>
                  {formatFileSize(
                    file.size
                  )}
                </p>
              )}
            </div>

            {file && (
              <button
                type='button'
                onClick={() =>
                  setFile(
                    undefined
                  )
                }
                className='grid h-8 w-8 place-items-center rounded-lg text-[#919EAB] hover:bg-[#F4F6F8]'
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

      <div className='mt-4 space-y-3'>
        <FormField label='Ghi chú nguồn'>
          <input
            name={sourceName}
            defaultValue={
              currentFile?.sourceNote
            }
            className={inputClass}
          />
        </FormField>

        <FormField label='Ghi chú quyền sử dụng'>
          <input
            name={rightsName}
            defaultValue={
              currentFile?.rightsNote
            }
            className={inputClass}
          />
        </FormField>
      </div>
    </div>
  );
}

function EmptyInlineState({
  text,
}: {
  text: string;
}) {
  return (
    <div className='rounded-2xl border border-dashed border-[#D9DEE2] bg-[#FAFBFC] px-5 py-10 text-center text-sm text-[#919EAB]'>
      {text}
    </div>
  );
}

function ChecklistItem({
  done,
  label,
}: {
  done: boolean;
  label: string;
}) {
  return (
    <div className='flex items-center gap-2'>
      {done ? (
        <CheckCircle2
          size={15}
          className='text-emerald-500'
        />
      ) : (
        <AlertCircle
          size={15}
          className='text-[#C4CDD5]'
        />
      )}

      <span
        className={
          done
            ? 'text-[#637381]'
            : 'text-[#919EAB]'
        }
      >
        {label}
      </span>
    </div>
  );
}

function formatFileSize(
  bytes: number
) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    1024 /
    1024
  ).toFixed(1)} MB`;
}