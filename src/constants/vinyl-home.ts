export const VINYL_IMAGES = {
  logoPrimary: '/images/vinyl-home/logo-primary.png',
  logoWhite: '/images/vinyl-home/logo-white.png',
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
  { image: VINYL_IMAGES.about[0], lines: ['Bạn yêu', 'đĩa nhạc xưa'], align: 'end' },
  { image: VINYL_IMAGES.about[1], lines: ['Bạn muốn', 'hiểu từng bản thu'], align: 'start' },
  { image: VINYL_IMAGES.about[2], lines: ['Bạn trân trọng', 'âm nhạc Việt'], align: 'center' },
  { image: VINYL_IMAGES.about[3], lines: ['Bạn cần', 'tư liệu dễ tìm'], align: 'start' },
  { image: VINYL_IMAGES.about[4], lines: ['Bạn tìm kiếm', 'những câu chuyện'], align: 'end' },
] as const;

export const COLLECTION_TABS = [
  { id: 'all', label: 'Tất cả', count: 1233 },
  { id: 'featured', label: 'Nổi bật', count: 26 },
  { id: 'popular', label: 'Phổ biến', count: 433 },
  { id: 'trending', label: 'Xu hướng', count: 757 },
  { id: 'latest', label: 'Mới nhất', count: 212 },
] as const;

export const COLLECTION_ITEMS = [
  {
    image: VINYL_IMAGES.collection[0],
    title: 'Tìm hiểu về đĩa Vinyl, âm thanh và văn hóa nghe nhạc',
    authors: 'Anh Tuấn, Quang Anh',
    topics: 12,
    readers: 768,
    rating: 4.5,
    reviews: 15,
  },
  {
    image: VINYL_IMAGES.collection[1],
    title: 'Những bản thu tiêu biểu của nhạc Việt thập niên 60–70',
    authors: 'Vinyl Heritage Team',
    topics: 8,
    readers: 542,
    rating: 4.8,
    reviews: 22,
  },
  {
    image: VINYL_IMAGES.collection[2],
    title: 'Hành trình phát triển của ngành công nghiệp đĩa nhựa Việt Nam',
    authors: 'Nguyễn Minh Hoàng',
    topics: 10,
    readers: 391,
    rating: 4.6,
    reviews: 18,
  },
  {
    image: VINYL_IMAGES.collection[3],
    title: 'Ký ức âm nhạc qua từng vòng quay đĩa',
    authors: 'Trần Ngọc Anh',
    topics: 6,
    readers: 620,
    rating: 4.7,
    reviews: 31,
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

export const REVIEWERS = [
  {
    name: 'Nguyễn Minh Hoàng',
    role: 'Nhà sưu tầm đĩa nhạc',
    quote:
      'Vinyl Heritage Vietnam không chỉ giới thiệu những chiếc đĩa cũ, mà còn giúp người xem hiểu được bối cảnh văn hóa phía sau mỗi bản thu. Đây là điều rất cần thiết để giá trị của đĩa nhạc được nhìn nhận đầy đủ hơn.',
    image: VINYL_IMAGES.reviewers[0],
  },
  {
    name: 'Trần Ngọc Anh',
    role: 'Người nghiên cứu văn hóa',
    quote:
      'Tôi đặc biệt ấn tượng với cách thông tin được kết nối giữa nghệ sĩ, tác phẩm, thời kỳ và hiện vật. Những dữ liệu tưởng như rời rạc đã trở thành một câu chuyện có chiều sâu và dễ tiếp cận.',
    image: VINYL_IMAGES.reviewers[1],
  },
  {
    name: 'Lê Quốc Bảo',
    role: 'Người yêu nhạc',
    quote:
      'Đây là nơi tôi tìm thấy lại những giai điệu tuổi thơ và hiểu thêm về câu chuyện phía sau mỗi bản thu. Di sản âm nhạc trở nên gần gũi hơn bao giờ hết.',
    image: VINYL_IMAGES.reviewers[2],
  },
] as const;
