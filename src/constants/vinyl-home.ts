export const VINYL_IMAGES = {
  logoPrimary: '/images/revinyl-wordmark-dark.svg',
  logoWhite: '/images/revinyl-wordmark-light.svg',
  flagVn: '/images/vinyl-home/flag-vn.svg',
  hero: '/images/vinyl-home/hero.png',
  about: [
    '/images/vinyl-home/about-1.png',
    '/images/vinyl-home/about-2.png',
    '/images/vinyl-home/about-3.png',
    '/images/vinyl-home/about-4.png',
    '/images/vinyl-home/about-5.png',
  ],
  collection: [
    '/images/vinyl-home/collection-1.png',
    '/images/vinyl-home/collection-2.png',
    '/images/vinyl-home/collection-3.png',
    '/images/vinyl-home/collection-4.png',
  ],
  story: ['/images/vinyl-home/story-1.png', '/images/vinyl-home/story-2.png'],
  viet: [
    '/images/vinyl-home/viet-v.png',
    '/images/vinyl-home/viet-i.png',
    '/images/vinyl-home/viet-e.png',
    '/images/vinyl-home/viet-t.png',
  ],
  reviewers: [
    '/images/vinyl-home/reviewer-1.png',
    '/images/vinyl-home/reviewer-2.png',
    '/images/vinyl-home/reviewer-3.png',
  ],
  newsletterBg: '/images/vinyl-home/newsletter-bg.png',
  quote: '/images/vinyl-home/quote.svg',
} as const;

export const ABOUT_CARDS = [
  {
    image: VINYL_IMAGES.about[0],
    lines: ['Bạn yêu', 'đĩa nhạc xưa'],
    align: 'end',
  },
  {
    image: VINYL_IMAGES.about[1],
    lines: ['Bạn muốn', 'hiểu từng bản thu'],
    align: 'start',
  },
  {
    image: VINYL_IMAGES.about[2],
    lines: ['Bạn trân trọng', 'âm nhạc Việt'],
    align: 'center',
  },
  {
    image: VINYL_IMAGES.about[3],
    lines: ['Bạn cần', 'tư liệu dễ tìm'],
    align: 'start',
  },
  {
    image: VINYL_IMAGES.about[4],
    lines: ['Bạn tìm kiếm', 'những câu chuyện'],
    align: 'end',
  },
] as const;

export const VIET_VALUES = [
  {
    letter: 'V',
    title: 'Vững nguồn tư liệu',
    description:
      'Thông tin được tập hợp, đối chiếu và ghi rõ nguồn tham khảo. Những nội dung chưa được xác minh sẽ được đánh dấu minh bạch.',
    image: VINYL_IMAGES.viet[0],
    topSpacer: 0,
    contentHeight: 630,
    bottomSpacer: 270,
  },
  {
    letter: 'I',
    title: 'Ích chung cộng đồng',
    description:
      'Kho tư liệu được xây dựng để mọi người đều có thể tiếp cận, tìm hiểu và đóng góp vào việc gìn giữ di sản âm nhạc Việt Nam.',
    image: VINYL_IMAGES.viet[1],
    topSpacer: 135,
    contentHeight: 765,
    bottomSpacer: 0,
  },
  {
    letter: 'E',
    title: 'Gắn kết trải nghiệm',
    description:
      'Mỗi chiếc đĩa không chỉ được giới thiệu bằng dữ liệu, còn được kết nối với nghệ sĩ, tác phẩm, thời đại và ký ức của người nghe.',
    image: VINYL_IMAGES.viet[2],
    topSpacer: 0,
    contentHeight: 810,
    bottomSpacer: 90,
  },
  {
    letter: 'T',
    title: 'Tiếp nối di sản',
    description:
      'Những giá trị âm nhạc của quá khứ được lưu giữ, kể lại và truyền cảm hứng cho công chúng hôm nay cũng như các thế hệ mai sau.',
    image: VINYL_IMAGES.viet[3],
    topSpacer: 270,
    contentHeight: 630,
    bottomSpacer: 0,
  },
] as const;

// Add only approved testimonials, with permission to publish the name, photo and quote.
export const REVIEWERS: Array<{
  name: string;
  role: string;
  quote: string;
  image: string;
}> = [];
