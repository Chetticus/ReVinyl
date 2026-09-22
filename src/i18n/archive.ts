import { Locale } from '@/modules/archive/types';
import { isLocale, SUPPORTED_LOCALES } from './config';

export const supportedLocales: Locale[] = [...SUPPORTED_LOCALES];

export const copy = {
  vi: {
    // =========================================================
    // ARCHIVE PAGE
    // =========================================================

    archive: 'Kho âm nhạc',

    archiveIntro:
      'Khám phá những bản thu Việt Nam qua âm thanh, câu chuyện, bối cảnh văn hóa và những lớp ký ức được lưu giữ theo thời gian.',

    listen: 'Nghe',
    understand: 'Hiểu',
    explore: 'Khám phá',

    search: 'Tìm theo ca khúc, nghệ sĩ hoặc album...',
    searchAction: 'Tìm',

    filters: 'Bộ lọc',
    clearFilters: 'Xóa bộ lọc',

    era: 'Thời kỳ',
    genre: 'Thể loại',
    region: 'Vùng miền',
    instrument: 'Nhạc cụ',

    all: 'Tất cả',

    collection: 'Khám phá kho lưu trữ',

    emptyTitle: 'Chưa tìm thấy bản thu phù hợp',

    emptyDescription:
      'Hãy thử thay đổi từ khóa hoặc bỏ bớt bộ lọc để tiếp tục khám phá.',

    errorTitle: 'Không thể tải kho lưu trữ',

    errorDescription: 'Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.',

    // =========================================================
    // RECORDING DETAIL — GENERAL
    // =========================================================

    backToArchive: 'Quay lại kho âm nhạc',

    recordingNotFound: 'Không tìm thấy bản thu',

    recordingNotFoundDescription:
      'Bản thu này có thể đã được di chuyển, chưa được xuất bản hoặc không còn tồn tại.',

    unavailable:
      'Nội dung tiếng Anh của bản thu này chưa đầy đủ. Một số nội dung đang được hiển thị bằng tiếng Việt.',

    listeningExperience: 'Trải nghiệm nghe',

    // =========================================================
    // RECORDING DETAIL — UNDERSTAND
    // =========================================================

    summary: 'Tổng quan bản thu',

    whyItMatters: 'Vì sao bản thu đáng lưu giữ',

    whatToListenFor: 'Điều nên chú ý khi nghe',

    // =========================================================
    // RECORDING DETAIL — CONTEXT
    // =========================================================

    context: 'Lịch sử & bối cảnh',

    historicalContext: 'Bối cảnh lịch sử',

    culturalContext: 'Bối cảnh văn hóa',

    // =========================================================
    // RECORDING DETAIL — LYRICS
    // =========================================================

    lyrics: 'Lời ca & ý nghĩa',

    lyricsMeaning: 'Ý nghĩa lời ca',

    lyricsNotes: 'Chú giải chọn lọc',

    fullLyrics: 'Lời ca đầy đủ',

    rightsStatus: 'Tình trạng quyền sử dụng',

    // =========================================================
    // RECORDING DETAIL — INSTRUMENTS
    // =========================================================

    discoverTheSound: 'Khám phá âm thanh',

    instruments: 'Nhạc cụ trong bản thu',

    instrumentsIntro:
      'Tìm hiểu những nhạc cụ góp phần tạo nên màu sắc, giai điệu và cấu trúc của bản thu.',

    confidence: 'Độ tin cậy',

    noInstrumentInformation:
      'Thông tin về nhạc cụ của bản thu này đang được cập nhật.',

    // =========================================================
    // RECORDING DETAIL — SOURCES
    // =========================================================

    research: 'Tư liệu & kiểm chứng',

    sources: 'Nguồn tham khảo',

    sourcesIntro:
      'Những nguồn tư liệu được sử dụng để xây dựng và kiểm chứng thông tin lịch sử, văn hóa và âm nhạc của bản thu này.',

    verified: 'Đã xác minh',

    pendingVerification: 'Đang kiểm chứng',

    unverified: 'Chưa xác minh',

    noSources: 'Nguồn tham khảo đang được cập nhật.',

    // =========================================================
    // RECORDING DETAIL — RELATED
    // =========================================================

    related: 'Khám phá tiếp',

    relatedIntro:
      'Tiếp tục khám phá những bản thu có liên hệ về nghệ sĩ, thời kỳ, thể loại hoặc nhạc cụ.',

    viewArchive: 'Xem toàn bộ kho âm nhạc',

    noRelated: 'Chưa có bản thu liên quan để khám phá tiếp.',
    digital: 'Digital',

    vinylized: 'Vinylized',

    digitalHelp: 'Phiên bản âm thanh số nguyên bản của bản thu.',

    vinylizedHelp:
      'Phiên bản được xử lý từ nguồn Digital nhằm tạo trải nghiệm nghe lấy cảm hứng từ đĩa vinyl.',

    audioUnavailable: 'Bản thu âm hiện chưa được xuất bản.',

    play: 'Phát',

    pause: 'Tạm dừng',

    seek: 'Tua bản thu',

    volume: 'Âm lượng',
    timeline: 'Dòng thời gian âm nhạc',

    timelineEyebrow: 'Kho lưu trữ · Theo dòng lịch sử',

    timelineIntro:
      'Khám phá âm nhạc Việt Nam qua từng thời kỳ, từ bối cảnh văn hóa và những thay đổi trong đời sống âm nhạc đến các bản thu, nghệ sĩ và album tiêu biểu.',

    timelineStepEra: 'Thời kỳ',
    timelineStepContext: 'Bối cảnh',
    timelineStepMusic: 'Âm nhạc',
    timelineStepExplore: 'Khám phá',

    period: 'Giai đoạn',

    timelinePeriodHint:
      'Mỗi giai đoạn phản ánh một phần câu chuyện phát triển và biến đổi của âm nhạc Việt Nam.',

    musicalEra: 'Thời kỳ âm nhạc',

    musicalContext: 'Bối cảnh âm nhạc',

    featuredRecordings: 'Bản thu tiêu biểu',

    recordingsCount: 'bản thu',

    openRecording: 'Khám phá bản thu',

    notableArtists: 'Nghệ sĩ tiêu biểu',

    notableAlbums: 'Album tiêu biểu',

    timelineErrorTitle: 'Không thể tải dòng thời gian',

    timelineErrorDescription:
      'Đã có lỗi xảy ra khi tải dữ liệu lịch sử âm nhạc. Vui lòng thử lại sau.',

    timelineEmptyTitle: 'Dòng thời gian đang được xây dựng',

    timelineEmptyDescription:
      'Các thời kỳ và tư liệu âm nhạc đang được bổ sung vào kho lưu trữ.',

    contribution: {
      eyebrow: 'Đóng góp',
      title: 'Cùng xây dựng kho lưu trữ âm nhạc Việt Nam',
      description:
        'Mỗi nguồn tư liệu, câu chuyện hoặc thông tin đều có thể giúp kho lưu trữ trở nên đầy đủ hơn.',
      identity: 'Bạn đang đóng góp với tư cách',
      typeStep: '1 — Loại đóng góp',
      types: {
        NEW_RECORDING: [
          'Đề xuất bản thu mới',
          'Đề xuất ca khúc hoặc bản thu chưa có trong kho.',
        ],
        INFORMATION: [
          'Bổ sung tư liệu',
          'Thêm câu chuyện, thông tin hoặc nguồn cho bản thu đã có.',
        ],
        CORRECTION: [
          'Đề xuất chỉnh sửa',
          'Thông báo thông tin sai, thiếu hoặc cần cập nhật.',
        ],
      },
      languageStep: '2 — Ngôn ngữ đóng góp',
      targetStep: '3 — Nội dung liên quan',
      vietnamese: 'Tiếng Việt',
      english: 'English',
      proposedTitle: 'Tên ca khúc / bản thu',
      proposedTitlePlaceholder: 'Tên bản thu bạn muốn đề xuất',
      proposedArtist: 'Nghệ sĩ / người thể hiện',
      proposedYear: 'Năm phát hành nếu biết',
      recording: 'Bản thu liên quan',
      recordingPlaceholder: 'Chọn bản thu',
      contributionStep: '4 — Đóng góp',
      subject: 'Tiêu đề',
      subjectPlaceholder: 'Tóm tắt đóng góp của bạn',
      content: 'Nội dung đóng góp',
      contentPlaceholder:
        'Hãy chia sẻ thông tin, câu chuyện, nội dung cần bổ sung hoặc chi tiết bạn cho rằng cần chỉnh sửa.',
      resourcesStep: '5 — Tư liệu và nguồn tham khảo',
      addResource: 'Thêm liên kết',
      removeResource: 'Xóa',
      resourceType: 'Loại',
      resourceUrl: 'URL',
      resourceTitle: 'Tên / mô tả ngắn',
      resourceNote: 'Ghi chú',
      rightsNote: 'Thông tin về quyền sử dụng, nếu bạn biết',
      resourceTypes: {
        SOURCE: 'Nguồn tham khảo',
        IMAGE: 'Hình ảnh',
        AUDIO: 'Âm thanh',
        VIDEO: 'Video',
        DOCUMENT: 'Tài liệu',
        OTHER: 'Khác',
      },
      creditStep: '6 — Ghi nhận đóng góp',
      creditConsent:
        'Tôi đồng ý để Vinyl Heritage Vietnam ghi nhận tên của tôi nếu đóng góp này được sử dụng.',
      submit: 'Gửi đóng góp',
      submitting: 'Đang gửi...',
      disclaimer:
        'Thông tin bạn gửi sẽ được đội ngũ Vinyl Heritage Vietnam xem xét và kiểm chứng trước khi được sử dụng.',
      successTitle: 'Cảm ơn bạn đã đóng góp.',
      successDescription:
        'Thông tin đã được gửi tới đội ngũ Vinyl Heritage Vietnam để xem xét và kiểm chứng.',
      again: 'Đóng góp thêm',
      explore: 'Khám phá kho âm nhạc',
      error: 'Không thể gửi đóng góp lúc này. Vui lòng thử lại.',
      recordingsError: 'Không thể tải danh sách bản thu.',
      requiredRecording: 'Vui lòng chọn bản thu liên quan.',
      invalidUrl: 'Chỉ chấp nhận URL bắt đầu bằng http:// hoặc https://.',
    },
  },

  en: {
    // =========================================================
    // ARCHIVE PAGE
    // =========================================================

    archive: 'Music Archive',

    archiveIntro:
      'Explore Vietnamese recordings through sound, stories, cultural context, and musical memories preserved across generations.',

    listen: 'Listen',
    understand: 'Understand',
    explore: 'Explore',

    search: 'Search songs, artists or albums...',
    searchAction: 'Search',

    filters: 'Filters',
    clearFilters: 'Clear filters',

    era: 'Era',
    genre: 'Genre',
    region: 'Region',
    instrument: 'Instrument',

    all: 'All',

    collection: 'Explore the archive',

    emptyTitle: 'No recordings found',

    emptyDescription:
      'Try another keyword or remove some filters to continue exploring.',

    errorTitle: 'Unable to load the archive',

    errorDescription:
      'Something went wrong while loading the archive. Please try again.',

    // =========================================================
    // RECORDING DETAIL — GENERAL
    // =========================================================

    backToArchive: 'Back to the archive',

    recordingNotFound: 'Recording not found',

    recordingNotFoundDescription:
      'This recording may have been moved, is not yet published, or is no longer available.',

    unavailable:
      'English content for this recording is not yet fully available. Some sections are currently shown in Vietnamese.',

    listeningExperience: 'Listening experience',

    // =========================================================
    // RECORDING DETAIL — UNDERSTAND
    // =========================================================

    summary: 'Recording overview',

    whyItMatters: 'Why this recording matters',

    whatToListenFor: 'What to listen for',

    // =========================================================
    // RECORDING DETAIL — CONTEXT
    // =========================================================

    context: 'History & Context',

    historicalContext: 'Historical context',

    culturalContext: 'Cultural context',

    // =========================================================
    // RECORDING DETAIL — LYRICS
    // =========================================================

    lyrics: 'Lyrics & Meaning',

    lyricsMeaning: 'Meaning and themes',

    lyricsNotes: 'Selected annotations',

    fullLyrics: 'Full lyrics',

    rightsStatus: 'Rights status',

    // =========================================================
    // RECORDING DETAIL — INSTRUMENTS
    // =========================================================

    discoverTheSound: 'Discover the sound',

    instruments: 'Instruments in this recording',

    instrumentsIntro:
      'Explore the instruments that shape the sound, melody, and musical structure of this recording.',

    confidence: 'Confidence',

    noInstrumentInformation:
      'Instrument information for this recording is currently being updated.',

    // =========================================================
    // RECORDING DETAIL — SOURCES
    // =========================================================

    research: 'Sources & Research',

    sources: 'Sources & References',

    sourcesIntro:
      'Explore the sources used to develop and verify the historical, cultural, and musical information presented for this recording.',

    verified: 'Verified',

    pendingVerification: 'Under review',

    unverified: 'Unverified',

    noSources: 'References are currently being updated.',

    // =========================================================
    // RECORDING DETAIL — RELATED
    // =========================================================

    related: 'Continue exploring',

    relatedIntro:
      'Discover more recordings connected through artists, eras, genres, or instruments.',

    viewArchive: 'View the full archive',

    noRelated: 'No related recordings are available yet.',
    digital: 'Digital',

    vinylized: 'Vinylized',

    digitalHelp: 'The original digital audio version of this recording.',

    vinylizedHelp:
      'A version processed from the Digital source to create a vinyl-inspired listening experience.',

    audioUnavailable: 'Audio for this recording is not yet available.',

    play: 'Play',

    pause: 'Pause',

    seek: 'Seek through recording',

    volume: 'Volume',
    timeline: 'Music Timeline',

    timelineEyebrow: 'Archive · Through musical history',

    timelineIntro:
      'Explore Vietnamese music across different eras, from cultural context and shifts in musical life to notable recordings, artists, and albums.',

    timelineStepEra: 'Era',
    timelineStepContext: 'Context',
    timelineStepMusic: 'Music',
    timelineStepExplore: 'Explore',

    period: 'Period',

    timelinePeriodHint:
      'Each period reflects part of the development and transformation of Vietnamese musical culture.',

    musicalEra: 'Musical era',

    musicalContext: 'Musical context',

    featuredRecordings: 'Featured recordings',

    recordingsCount: 'recordings',

    openRecording: 'Explore recording',

    notableArtists: 'Notable artists',

    notableAlbums: 'Notable albums',

    timelineErrorTitle: 'Unable to load the timeline',

    timelineErrorDescription:
      'Something went wrong while loading the music timeline. Please try again.',

    timelineEmptyTitle: 'The timeline is being developed',

    timelineEmptyDescription:
      'Musical eras and historical materials are currently being added to the archive.',

    contribution: {
      eyebrow: 'Contribute',
      title: 'Help build the Vietnamese music archive',
      description:
        'Every source, story, or piece of information can help make the archive more complete.',
      identity: 'You are contributing as',
      typeStep: '1 — Contribution type',
      types: {
        NEW_RECORDING: [
          'Propose a new recording',
          'Suggest a song or recording that is not yet in the archive.',
        ],
        INFORMATION: [
          'Add information',
          'Add a story, information, or sources to an existing recording.',
        ],
        CORRECTION: [
          'Propose a correction',
          'Flag information that is wrong, incomplete, or outdated.',
        ],
      },
      languageStep: '2 — Contribution language',
      targetStep: '3 — Related content',
      vietnamese: 'Vietnamese',
      english: 'English',
      proposedTitle: 'Song / recording title',
      proposedTitlePlaceholder: 'Name of the recording you are proposing',
      proposedArtist: 'Artist / performer',
      proposedYear: 'Release year, if known',
      recording: 'Related recording',
      recordingPlaceholder: 'Select a recording',
      contributionStep: '4 — Contribution',
      subject: 'Title',
      subjectPlaceholder: 'Summarize your contribution',
      content: 'Contribution',
      contentPlaceholder:
        'Share information, a story, content to add, or details you believe should be corrected.',
      resourcesStep: '5 — Resources and references',
      addResource: 'Add link',
      removeResource: 'Remove',
      resourceType: 'Type',
      resourceUrl: 'URL',
      resourceTitle: 'Short title / description',
      resourceNote: 'Note',
      rightsNote: 'Rights information, if known',
      resourceTypes: {
        SOURCE: 'Reference source',
        IMAGE: 'Image',
        AUDIO: 'Audio',
        VIDEO: 'Video',
        DOCUMENT: 'Document',
        OTHER: 'Other',
      },
      creditStep: '6 — Contributor credit',
      creditConsent:
        'I agree that Vinyl Heritage Vietnam may credit my name if this contribution is used.',
      submit: 'Send contribution',
      submitting: 'Sending...',
      disclaimer:
        'Vinyl Heritage Vietnam will review and verify your information before it is used.',
      successTitle: 'Thank you for contributing.',
      successDescription:
        'Your information has been sent to the Vinyl Heritage Vietnam team for review and verification.',
      again: 'Contribute more',
      explore: 'Explore the music archive',
      error: 'Your contribution could not be sent. Please try again.',
      recordingsError: 'The recording list could not be loaded.',
      requiredRecording: 'Please select a related recording.',
      invalidUrl: 'Only URLs beginning with http:// or https:// are accepted.',
    },
  },
} as const;

export { isLocale };
