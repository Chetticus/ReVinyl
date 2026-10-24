import content from '@/data/website-content.json';

export const VINYL_ABOUT_IMAGES = {
  banner: '/images/vinyl-about/banner.png',
  collage: [
    '/images/vinyl-about/collage-1.png',
    '/images/vinyl-about/collage-2.png',
    '/images/vinyl-about/collage-3.png',
  ],
  workVideo: '/images/vinyl-home/story-1.png',
} as const;

const about = content.vi.about;
export const VINYL_ABOUT_COPY = {
  banner: {
    label: about.bannerLabel,
    title: about.bannerTitle,
    cta: about.bannerCta,
  },
  intro: {
    label: about.introLabel,
    title: about.introTitle,
    subtitle: about.introSubtitle,
    paragraphs: about.introParagraphs,
    cta: about.introCta,
  },
  work: {
    label: about.workLabel,
    title: about.workTitle,
    description: about.workDescription,
    cta: about.workCta,
  },
} as const;
