export type Locale = 'vi' | 'en';
export type AudioType = 'DIGITAL' | 'VINYLIZED';

export interface ArchiveLookup {
  id: string;
  slug: string;
  name?: string;
  title?: string;
  startYear?: number;
  endYear?: number;
  order?: number;
  translations?: Array<{
    locale: Locale;
    title: string;
    summary?: string;
    musicalContext?: string;
  }>;
}
export interface RecordingAudio {
  id: string;
  type: AudioType;
  url: string;
  originalFilename: string;
  sourceNote?: string;
  rightsNote?: string;
}
export interface RecordingTranslation {
  locale: Locale;
  title: string;
  alternativeTitle?: string;
  shortSummary?: string;
  historicalContext?: string;
  culturalContext?: string;
  lyricsMeaning?: string;
  lyricsNotes?: string;
  whatToListenFor?: string;
  preservationValue?: string;
  fullLyrics?: string;
  lyricsRightsStatus?: string;
}
export interface ArchiveRecording {
  id: string;
  slug: string;
  year?: number;
  coverImage?: string;
  status: 'DRAFT' | 'PUBLISHED';
  updatedAt: string;
  artist?: ArchiveLookup;
  album?: ArchiveLookup;
  era?: ArchiveLookup & {
    translation?: { title: string; summary?: string; musicalContext?: string };
  };
  genre?: ArchiveLookup;
  region?: ArchiveLookup;
  translation?: RecordingTranslation;
  requestedTranslationAvailable: boolean;
  translations: RecordingTranslation[];
  audio: RecordingAudio[];
  instruments: Array<{
    instrument: ArchiveLookup;
    roleVi?: string;
    roleEn?: string;
    confidence?: number;
  }>;
  references: Array<{
    verificationStatus?: string;
    reference: {
      id: string;
      title: string;
      url?: string;
      type?: string;
      publisher?: string;
      publishedYear?: number;
      notes?: string;
    };
  }>;
  related?: ArchiveRecording[];
}
export interface ArchiveResponse {
  data: ArchiveRecording[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
export interface Lookups {
  artists: ArchiveLookup[];
  albums: ArchiveLookup[];
  eras: ArchiveLookup[];
  genres: ArchiveLookup[];
  regions: ArchiveLookup[];
  instruments: ArchiveLookup[];
}

export interface ArchiveAdminDashboard {
  recordings: { total: number; published: number; draft: number };
  taxonomies: {
    total: number;
    artists: number;
    albums: number;
    eras: number;
    genres: number;
    regions: number;
    instruments: number;
  };
  contributions: {
    total: number;
    pending: number;
    underReview: number;
    approved: number;
    rejected: number;
  };
  recentContributions: Array<{
    id: string;
    type: ContributionType;
    title: string;
    status: ContributionStatus;
    createdAt: string;
    submitter: { id: string; fullName: string; email: string } | null;
    recording: { id: string; slug: string; title: string } | null;
  }>;
}

export interface CreateContributionInput {
  type: ContributionType;
  locale: Locale;
  title: string;
  content: string;
  recordingId?: string;
  proposedRecordingTitle?: string;
  proposedArtistName?: string;
  proposedYear?: number;
  resources?: ContributionResourceInput[];
  creditConsent: boolean;
}

export type ContributionType =
  | 'NEW_RECORDING'
  | 'INFORMATION'
  | 'CORRECTION'
  | 'STORY'
  | 'REFERENCE';
export type ContributionResourceType =
  | 'SOURCE'
  | 'IMAGE'
  | 'AUDIO'
  | 'VIDEO'
  | 'DOCUMENT'
  | 'OTHER';
export interface ContributionResourceInput {
  type: ContributionResourceType;
  url: string;
  title?: string;
  note?: string;
  rightsNote?: string;
}
export interface ContributionResource extends ContributionResourceInput {
  id: string;
  createdAt: string;
}

export type ContributionStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED';
export type VerificationReviewStatus = 'NOT_REVIEWED' | 'VERIFIED' | 'ISSUE';
export type RightsReviewStatus =
  | 'NOT_REVIEWED'
  | 'CLEARED'
  | 'RESTRICTED'
  | 'UNKNOWN';
export type DuplicateReviewStatus = 'NOT_REVIEWED' | 'UNIQUE' | 'DUPLICATE';
export interface ModerateContributionInput {
  status: ContributionStatus;
  moderatorNote?: string;
  sourceReviewStatus: VerificationReviewStatus;
  rightsReviewStatus: RightsReviewStatus;
  accuracyReviewStatus: VerificationReviewStatus;
  duplicateReviewStatus: DuplicateReviewStatus;
}

export interface Contribution {
  id: string;
  title: string;
  content: string;
  sourceUrl?: string;
  type: ContributionType;
  locale?: Locale;
  creditConsent: boolean;
  proposedRecordingTitle?: string;
  proposedArtistName?: string;
  proposedYear?: number;
  resources: ContributionResource[];
  status: ContributionStatus;
  moderatorNote?: string;
  sourceReviewStatus: VerificationReviewStatus;
  rightsReviewStatus: RightsReviewStatus;
  accuracyReviewStatus: VerificationReviewStatus;
  duplicateReviewStatus: DuplicateReviewStatus;
  createdAt: string;
  reviewedAt?: string;
  submitter?: { id: string; fullName: string; email: string; avatar?: string };
  recording?: {
    slug: string;
    translations: Array<{ locale: Locale; title: string }>;
  };
}
