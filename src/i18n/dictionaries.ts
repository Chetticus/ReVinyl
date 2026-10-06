import { Locale } from './config';

const vi = {
  common: {
    explore: 'Khám phá',
    learnMore: 'Tìm hiểu thêm',
    loading: 'Đang tải...',
    signIn: 'Đăng nhập',
    start: 'Bắt đầu miễn phí',
    signOut: 'Đăng xuất',
  },
  navigation: {
    archive: 'Kho âm nhạc',
    timeline: 'Dòng thời gian',
    topics: 'Chuyên đề',
    contribute: 'Đóng góp',
    about: 'Giới thiệu',
    contact: 'Liên hệ',
    home: 'Trang chủ',
    faq: 'Câu hỏi thường gặp',
  },
  faq: {
    headerTitle: 'FAQ',
    homeLabel: 'Trang chủ',
    breadcrumbLabel: 'Câu hỏi thường gặp',

    eyebrow: 'Hỗ trợ & thông tin',

    title: 'Những câu hỏi thường gặp',

    description:
      'Tìm hiểu thêm về Vinyl Heritage Vietnam, cách khám phá kho âm nhạc và cách chúng tôi xây dựng, trình bày và kiểm chứng các tư liệu.',

    items: [
      {
        question: 'Vinyl Heritage Vietnam là gì?',
        answer:
          'Vinyl Heritage Vietnam là một kho lưu trữ âm nhạc số giúp người dùng nghe, tìm hiểu và khám phá các bản thu Việt Nam thông qua âm thanh, câu chuyện, bối cảnh lịch sử, văn hóa, lời ca, nhạc cụ và nguồn tư liệu liên quan.',
      },
      {
        question: 'Website dành cho ai?',
        answer:
          'Nền tảng dành cho người trẻ, người yêu âm nhạc Việt Nam, sinh viên, nhà nghiên cứu và bất kỳ ai muốn khám phá âm nhạc Việt Nam theo một cách trực quan, dễ tiếp cận và có bối cảnh.',
      },
      {
        question: 'Tôi có thể khám phá những nội dung gì?',
        answer:
          'Bạn có thể nghe các bản thu, tìm hiểu nghệ sĩ, album, thời kỳ, thể loại và vùng miền; đọc bối cảnh lịch sử và văn hóa; khám phá ý nghĩa lời ca, nhạc cụ trong bản thu, nguồn tham khảo và các bản thu có liên quan.',
      },
      {
        question: 'Tôi có cần tạo tài khoản để sử dụng kho âm nhạc không?',
        answer:
          'Không. Các nội dung cốt lõi như kho âm nhạc, trang bản thu và dòng thời gian được thiết kế để mọi người có thể truy cập công khai mà không cần đăng nhập.',
      },
      {
        question: 'Digital và Vinylized khác nhau như thế nào?',
        answer:
          'Digital là phiên bản âm thanh số của bản thu. Vinylized là phiên bản được xử lý từ nguồn Digital nhằm tạo trải nghiệm nghe lấy cảm hứng từ đặc tính của đĩa vinyl. Vinylized không có nghĩa là âm thanh được số hóa trực tiếp từ một đĩa vinyl thật.',
      },
      {
        question: 'Thông tin trên website có được kiểm chứng không?',
        answer:
          'Vinyl Heritage Vietnam ưu tiên sử dụng và ghi rõ nguồn tham khảo cho các thông tin lịch sử, văn hóa và âm nhạc. Trạng thái kiểm chứng của nguồn có thể được hiển thị để người đọc phân biệt nội dung đã xác minh và nội dung đang tiếp tục được đối chiếu.',
      },
      {
        question: 'Tại sao một số bản thu không hiển thị toàn bộ lời bài hát?',
        answer:
          'Việc hiển thị toàn bộ lời bài hát phụ thuộc vào tình trạng bản quyền và quyền sử dụng nội dung. Trong những trường hợp không phù hợp để hiển thị toàn bộ lời ca, nền tảng ưu tiên cung cấp phần giải thích ý nghĩa, chủ đề và chú giải chọn lọc.',
      },
      {
        question: 'Dòng thời gian âm nhạc được sử dụng để làm gì?',
        answer:
          'Dòng thời gian giúp người dùng khám phá âm nhạc Việt Nam theo từng giai đoạn, kết nối bối cảnh lịch sử và văn hóa với các bản thu, nghệ sĩ và album tiêu biểu của mỗi thời kỳ.',
      },
      {
        question: 'Tôi có thể góp ý hoặc cung cấp thêm tư liệu không?',
        answer:
          'Có. Nếu bạn phát hiện thông tin cần chỉnh sửa hoặc sở hữu nguồn tư liệu liên quan, bạn có thể liên hệ với Vinyl Heritage Vietnam qua trang Liên hệ. Nội dung đóng góp sẽ được xem xét trước khi được sử dụng trong kho lưu trữ.',
      },
      {
        question: 'Vinyl Heritage Vietnam có bán đĩa vinyl không?',
        answer:
          'Không. Hiện tại Vinyl Heritage Vietnam tập trung vào việc lưu trữ, giới thiệu và hỗ trợ người dùng khám phá di sản âm nhạc Việt Nam. Nền tảng không hoạt động như một cửa hàng bán đĩa.',
      },
      {
        question: 'Khi cần hỗ trợ tôi có thể liên hệ ở đâu?',
        answer:
          'Bạn có thể gửi thông tin thông qua trang Liên hệ hoặc sử dụng các kênh liên hệ được công bố trên website. Đội ngũ sẽ phản hồi khi nhận được yêu cầu.',
      },
    ],
  },
  home: {
    heroEyebrow: 'DI SẢN ÂM NHẠC VIỆT NAM',
    heroTitle: 'Mỗi Chiếc Đĩa\nLưu Giữ',
    heroAccent: 'Một Thời Đại.',
    heroDescription:
      'Không gian số giới thiệu, lưu giữ và kể lại những câu chuyện xoay quanh đĩa nhạc, nghệ sĩ và đời sống âm nhạc Việt Nam.',
    aboutLabel: 'VỀ CHÚNG TÔI',
    aboutTitle: 'Đĩa nhạc không chỉ lưu giữ âm thanh.\nChúng lưu giữ ký ức.',
    aboutDescription:
      'Dự án bảo tồn, hệ thống hóa và lan tỏa những giá trị lịch sử, nghệ thuật và ký ức được lưu giữ trên các ấn phẩm âm nhạc Việt Nam.',
    aboutCta: 'Khám phá ngay!',
    cards: [
      ['Bạn yêu', 'đĩa nhạc xưa'],
      ['Bạn muốn', 'hiểu từng bản thu'],
      ['Bạn trân trọng', 'âm nhạc Việt'],
      ['Bạn cần', 'tư liệu dễ tìm'],
      ['Bạn tìm kiếm', 'những câu chuyện'],
    ],
    collectionLabel: 'BỘ SƯU TẬP SỐ',
    collectionTitle: 'Khám phá di sản trên từng mặt đĩa',
    collectionDescription:
      'Tra cứu các bản thu, nghệ sĩ, hãng đĩa và ấn phẩm tiêu biểu qua nhiều thể loại và giai đoạn của âm nhạc Việt Nam.',
    viewMore: 'Xem thêm',
    all: 'Tất cả',
    reviews: 'Đánh giá',
    topics: 'Chuyên đề',
    readers: 'Người đọc',
    saveTopic: 'Lưu chuyên đề',
    loadingTopics: 'Đang tải chuyên đề...',
    emptyTopics: 'Chưa có chuyên đề trong danh mục này.',
    storyLabel: 'TƯ LIỆU VÀ CÂU CHUYỆN',
    storyTitle: 'Không chỉ là âm nhạc',
    storyIntro:
      'Đi sâu vào bối cảnh ra đời, con người, kỹ thuật thu âm và những câu chuyện ít được biết đến phía sau mỗi ấn phẩm.',
    storyBody:
      'Mỗi chiếc đĩa là kết quả của một hành trình dài — từ ý tưởng sáng tác, phòng thu, giọng hát, nhạc cụ cho đến thiết kế bìa và cách tác phẩm được đưa đến công chúng. Vinyl Heritage Vietnam tìm lại những dấu vết ấy để kể về con người, thời đại và những câu chuyện đã góp phần tạo nên giá trị riêng cho từng bản thu.',
    storyCta: 'Khám phá những câu chuyện',
    newsletterTitle:
      'Mỗi chiếc đĩa là một dấu vết.\nMỗi câu chuyện là một phần di sản.',
    newsletterDescription: 'Cùng nhau gìn giữ, kể lại và truyền cảm hứng.',
    subscribe: 'Đăng ký',
    emailRequired: 'Vui lòng nhập email',
    subscribed: 'Đăng ký nhận tin thành công!',
    values: [
      {
        title: 'Vững nguồn tư liệu',
        description:
          'Thông tin được tập hợp, đối chiếu và ghi rõ nguồn tham khảo. Những nội dung chưa được xác minh sẽ được đánh dấu minh bạch.',
      },
      {
        title: 'Ích chung cộng đồng',
        description:
          'Kho tư liệu được xây dựng để mọi người đều có thể tiếp cận, tìm hiểu và đóng góp vào việc gìn giữ di sản âm nhạc Việt Nam.',
      },
      {
        title: 'Gắn kết trải nghiệm',
        description:
          'Mỗi chiếc đĩa được kết nối với nghệ sĩ, tác phẩm, thời đại và ký ức của người nghe.',
      },
      {
        title: 'Tiếp nối di sản',
        description:
          'Những giá trị âm nhạc của quá khứ được lưu giữ, kể lại và truyền cảm hứng cho các thế hệ mai sau.',
      },
    ],
    communityLabel: 'NHỮNG KẾT NỐI TỪ ÂM NHẠC',
    communityTitle: 'Di sản trở nên sống động\nkhi được cùng nhau sẻ chia',
    communityDescription:
      'Những chia sẻ ấy giúp di sản âm nhạc không chỉ được lưu giữ, mà còn tiếp tục hiện diện trong đời sống hôm nay.',
    reviewers: [
      {
        role: 'Nhà sưu tầm đĩa nhạc',
        quote:
          'Vinyl Heritage Vietnam giúp người xem hiểu bối cảnh văn hóa phía sau mỗi bản thu.',
      },
      {
        role: 'Người nghiên cứu văn hóa',
        quote:
          'Thông tin về nghệ sĩ, tác phẩm, thời kỳ và hiện vật được kết nối thành một câu chuyện dễ tiếp cận.',
      },
      {
        role: 'Người yêu nhạc',
        quote:
          'Di sản âm nhạc và những câu chuyện phía sau mỗi bản thu trở nên gần gũi hơn.',
      },
    ],
    featuredArchiveLabel: 'Từ kho lưu trữ',

    featuredArchiveTitle: 'Những bản thu đáng khám phá',

    featuredArchiveDescription:
      'Bắt đầu hành trình qua âm nhạc Việt Nam với những bản thu được lựa chọn từ kho lưu trữ, cùng câu chuyện, bối cảnh văn hóa và những chi tiết đáng chú ý khi lắng nghe.',

    viewArchive: 'Khám phá toàn bộ kho âm nhạc',

    featuredArchiveEmpty: 'Các bản thu tiêu biểu đang được cập nhật.',

    featuredArchiveErrorTitle: 'Không thể tải các bản thu',

    featuredArchiveErrorDescription:
      'Đã có lỗi xảy ra khi tải nội dung từ kho lưu trữ. Vui lòng thử lại sau.',

    featuredSlideLabel: 'Bản thu',
  },
  about: {
    bannerLabel: 'Tầm nhìn của chúng tôi',
    bannerTitle:
      'Gìn giữ những thanh âm của quá khứ, để di sản âm nhạc Việt Nam tiếp tục được lắng nghe trong tương lai.',
    bannerCta: 'Xem thêm về chúng tôi',
    introLabel: 'VỀ CHÚNG TÔI',
    introTitle: 'Gìn giữ âm thanh, lưu giữ ký ức',
    introSubtitle:
      'Chúng tôi tin rằng mỗi chiếc đĩa Vinyl không chỉ lưu giữ âm nhạc, mà còn lưu giữ một phần ký ức và câu chuyện của văn hóa Việt Nam.',
    introParagraphs: [
      'Chúng tôi được tạo nên với mong muốn sưu tầm, lưu trữ và giới thiệu những giá trị của đĩa nhạc Vinyl Việt Nam đến cộng đồng.',
      'Mỗi bản đĩa là một mảnh ghép của thời gian. Từ những bản thu âm, hình ảnh bìa đĩa, thông tin nghệ sĩ cho đến những câu chuyện phía sau mỗi sản phẩm, tất cả đều góp phần phản ánh một giai đoạn của đời sống âm nhạc và văn hóa Việt Nam.',
      'Chúng tôi mong muốn tạo nên một không gian để những giá trị ấy được ghi nhận, bảo tồn và tiếp tục được khám phá bởi các thế hệ hôm nay và mai sau.',
    ],
    introCta: 'Khám phá ngay hôm nay',
    workLabel: 'Chúng tôi làm việc thế nào',
    workTitle: 'Sưu tầm, lưu trữ và kể lại những câu chuyện',
    workDescription:
      'Vinyl Heritage Vietnam kết hợp công việc sưu tầm tư liệu, đối chiếu nguồn và kể chuyện để mỗi chiếc đĩa không chỉ được nhìn như một ấn phẩm, mà còn như một phần của đời sống âm nhạc Việt Nam.',
    workCta: 'Khám phá kho âm nhạc',
    playVideo: 'Phát video',
  },
  contact: {
    label: 'Liên hệ với chúng tôi',
    title:
      'Mỗi câu chuyện đều đáng được lắng nghe. Hãy để lại lời nhắn — chúng tôi sẵn sàng đồng hành cùng bạn trên hành trình gìn giữ di sản âm nhạc Việt Nam.',
    email: 'Email',
    phone: 'Hotline',
    address: 'Địa chỉ',
    addressValue: 'Hà Nội, Việt Nam',
    formLabel: 'Kết nối với chúng tôi',
    formTitle: 'Gửi tin nhắn cho Vinyl Heritage',
    name: 'Họ và tên',
    topic: 'Chủ đề',
    message: 'Nội dung',
    namePlaceholder: 'Nguyễn Văn A',
    topicPlaceholder: 'Ví dụ: Trao đổi tư liệu đĩa nhạc',
    messagePlaceholder: 'Chia sẻ ngắn gọn nội dung bạn muốn trao đổi...',
    submit: 'Gửi liên hệ',
    submitting: 'Đang gửi...',
    success: 'Gửi thành công! Chúng tôi sẽ phản hồi qua email sớm nhất.',
    validation: {
      name: 'Họ và tên phải có ít nhất 2 ký tự.',
      email: 'Email không hợp lệ.',
      topic: 'Chủ đề phải có ít nhất 2 ký tự.',
      message: 'Nội dung phải có ít nhất 2 ký tự.',
    },
  },
  footer: {
    headline: 'Âm thanh có thể khép lại,\nnhưng ký ức vẫn tiếp tục ngân vang.',
    description:
      'Vinyl Heritage Vietnam gìn giữ và kể lại những câu chuyện làm nên di sản âm nhạc Việt Nam.',
    company: 'Khám phá',
    support: 'Hỗ trợ',
    social: 'Mạng xã hội',
    terms: 'Điều khoản & Điều kiện',
    privacy: 'Chính sách bảo mật',
    rights: 'Bảo lưu mọi quyền.',
  },

  metadata: {
    homeTitle: 'Vinyl Heritage Vietnam',
    homeDescription:
      'Gìn giữ và kể lại những câu chuyện làm nên di sản âm nhạc Việt Nam.',
    aboutTitle: 'Giới thiệu | Vinyl Heritage Vietnam',
    aboutDescription: 'Tìm hiểu sứ mệnh gìn giữ di sản âm nhạc Việt Nam.',
    contactTitle: 'Liên hệ | Vinyl Heritage Vietnam',
    contactDescription: 'Liên hệ với Vinyl Heritage Vietnam.',
  },
} as const;

const en = {
  common: {
    explore: 'Explore',
    learnMore: 'Learn more',
    loading: 'Loading...',
    signIn: 'Sign in',
    start: 'Start exploring',
    signOut: 'Sign out',
  },
  faq: {
    headerTitle: 'FAQ',
    homeLabel: 'Home',
    breadcrumbLabel: 'FAQ',

    eyebrow: 'Help & Information',

    title: 'Frequently Asked Questions',

    description:
      'Learn more about Vinyl Heritage Vietnam, how to explore the music archive, and how our historical, cultural, and musical information is presented and verified.',

    items: [
      {
        question: 'What is Vinyl Heritage Vietnam?',
        answer:
          'Vinyl Heritage Vietnam is a digital music archive designed to help people listen to, understand, and explore Vietnamese recordings through sound, stories, historical and cultural context, lyrics interpretation, instruments, and supporting sources.',
      },
      {
        question: 'Who is the website for?',
        answer:
          'The platform is designed for younger audiences, Vietnamese music enthusiasts, students, researchers, and anyone interested in discovering Vietnamese music through an accessible and contextual experience.',
      },
      {
        question: 'What can I explore on the platform?',
        answer:
          'You can listen to recordings, explore artists, albums, eras, genres, and regions, read historical and cultural context, learn about lyrics and instruments, review references, and discover related recordings.',
      },
      {
        question: 'Do I need an account to access the music archive?',
        answer:
          'No. Core experiences such as the music archive, recording pages, and music timeline are publicly accessible and do not require users to sign in.',
      },
      {
        question: 'What is the difference between Digital and Vinylized?',
        answer:
          'Digital refers to the digital audio version of a recording. Vinylized is a version processed from the Digital source to create a vinyl-inspired listening experience. It does not mean that the audio was digitized directly from a physical vinyl record.',
      },
      {
        question: 'Is the information on the website verified?',
        answer:
          'Vinyl Heritage Vietnam prioritizes clearly referenced sources for historical, cultural, and musical information. Verification status may be displayed so readers can distinguish between verified material and information that is still being reviewed.',
      },
      {
        question: 'Why are full lyrics not available for every recording?',
        answer:
          'The availability of full lyrics depends on copyright and usage rights. When displaying complete lyrics is not appropriate, the archive focuses instead on interpretation, themes, and selected annotations.',
      },
      {
        question: 'What is the purpose of the music timeline?',
        answer:
          'The timeline allows users to explore Vietnamese music across different periods by connecting historical and cultural context with notable recordings, artists, and albums from each era.',
      },
      {
        question: 'Can I suggest corrections or contribute information?',
        answer:
          'Yes. If you notice information that should be corrected or have relevant source material, you can contact Vinyl Heritage Vietnam through the Contact page. Contributions are reviewed before being incorporated into the archive.',
      },
      {
        question: 'Does Vinyl Heritage Vietnam sell vinyl records?',
        answer:
          'No. Vinyl Heritage Vietnam currently focuses on preserving, presenting, and helping audiences explore Vietnamese musical heritage. It does not operate as a vinyl record store.',
      },
      {
        question: 'How can I contact the team for support?',
        answer:
          'You can send a message through the Contact page or use the contact channels published on the website. The team will respond after receiving your request.',
      },
    ],
  },
  navigation: {
    archive: 'Music Archive',
    timeline: 'Timeline',
    topics: 'Topics',
    about: 'About',
    contact: 'Contact',
    contribute: 'Contribute',
    home: 'Home',
    faq: 'FAQ',
  },
  home: {
    heroEyebrow: 'VIETNAMESE MUSIC HERITAGE',
    heroTitle: 'Every Record\nPreserves',
    heroAccent: 'An Era.',
    heroDescription:
      'A digital space that introduces, preserves, and retells stories of records, artists, and Vietnamese musical life.',
    aboutLabel: 'ABOUT US',
    aboutTitle: 'Records preserve more than sound.\nThey preserve memory.',
    aboutDescription:
      'A project preserving, organizing, and sharing the history, artistry, and memories held by Vietnamese music releases.',
    aboutCta: 'Explore now',
    cards: [
      ['You love', 'vintage records'],
      ['You want', 'to understand recordings'],
      ['You cherish', 'Vietnamese music'],
      ['You need', 'accessible sources'],
      ['You seek', 'untold stories'],
    ],
    collectionLabel: 'DIGITAL COLLECTION',
    collectionTitle: 'Discover heritage on every side of a record',
    collectionDescription:
      'Explore notable recordings, artists, labels, and releases across genres and eras of Vietnamese music.',
    viewMore: 'View all',
    all: 'All',
    reviews: 'Reviews',
    topics: 'Topics',
    readers: 'Readers',
    saveTopic: 'Save topic',
    loadingTopics: 'Loading topics...',
    emptyTopics: 'No topics are available in this category.',
    storyLabel: 'SOURCES AND STORIES',
    storyTitle: 'More than music',
    storyIntro:
      'Go deeper into the context, people, recording techniques, and lesser-known stories behind each release.',
    storyBody:
      'Every record is the result of a long journey—from composition and studio sessions to voices, instruments, cover design, and the way music reached its audience. Vinyl Heritage Vietnam retraces those paths to tell the stories of the people and eras that gave each recording its distinct value.',
    storyCta: 'Discover the stories',
    newsletterTitle:
      'Every record leaves a trace.\nEvery story is part of our heritage.',
    newsletterDescription: 'Together, we preserve, retell, and inspire.',
    subscribe: 'Subscribe',
    emailRequired: 'Please enter your email',
    subscribed: 'You are now subscribed!',
    values: [
      {
        title: 'Reliable sources',
        description:
          'Information is gathered, cross-checked, and accompanied by references. Unverified material is clearly identified.',
      },
      {
        title: 'A shared public resource',
        description:
          'The archive is built so everyone can access, study, and help preserve Vietnamese musical heritage.',
      },
      {
        title: 'Connected experiences',
        description:
          'Each record is connected to its artists, works, era, and listeners’ memories.',
      },
      {
        title: 'Heritage carried forward',
        description:
          'The musical values of the past are preserved, retold, and used to inspire future generations.',
      },
    ],
    communityLabel: 'CONNECTIONS THROUGH MUSIC',
    communityTitle: 'Heritage comes alive\nwhen we share it together',
    communityDescription:
      'These perspectives allow musical heritage not only to be preserved, but to remain present in life today.',
    reviewers: [
      {
        role: 'Record collector',
        quote:
          'Vinyl Heritage Vietnam helps audiences understand the cultural context behind each recording.',
      },
      {
        role: 'Cultural researcher',
        quote:
          'Information about artists, works, periods, and artifacts is connected into an accessible story.',
      },
      {
        role: 'Music enthusiast',
        quote:
          'Musical heritage and the stories behind each recording feel closer than ever.',
      },
    ],
    featuredArchiveLabel: 'From the archive',

    featuredArchiveTitle: 'Recordings worth discovering',

    featuredArchiveDescription:
      'Begin your journey through Vietnamese music with selected recordings from the archive, accompanied by cultural context, stories, and details worth listening for.',

    viewArchive: 'Explore the full music archive',

    featuredArchiveEmpty: 'Featured recordings are currently being updated.',

    featuredArchiveErrorTitle: 'Unable to load recordings',

    featuredArchiveErrorDescription:
      'Something went wrong while loading recordings from the archive. Please try again.',

    featuredSlideLabel: 'Recording',
  },
  about: {
    bannerLabel: 'Our vision',
    bannerTitle:
      'Preserving the sounds of the past so Vietnamese musical heritage can continue to be heard in the future.',
    bannerCta: 'Learn more about us',
    introLabel: 'ABOUT US',
    introTitle: 'Preserving sound, safeguarding memory',
    introSubtitle:
      'We believe every vinyl record holds not only music, but also a piece of Vietnam’s cultural memory and story.',
    introParagraphs: [
      'We were created to collect, preserve, and introduce the value of Vietnamese vinyl records to the community.',
      'Every record is a fragment of its time. Its recordings, cover art, artist information, and the stories behind its creation all reflect a period in Vietnam’s musical and cultural life.',
      'We hope to create a space where these values are recognized, preserved, and rediscovered by present and future generations.',
    ],
    introCta: 'Start exploring today',
    workLabel: 'How we work',
    workTitle: 'Collecting, preserving, and retelling stories',
    workDescription:
      'Vinyl Heritage Vietnam combines collecting materials, cross-checking sources, and storytelling so each record can be understood not merely as an object, but as part of Vietnamese musical life.',
    workCta: 'Explore the archive',
    playVideo: 'Play video',
  },
  contact: {
    label: 'Contact us',
    title:
      'Every story deserves to be heard. Leave us a message—we are ready to join you in preserving Vietnamese musical heritage.',
    email: 'Email',
    phone: 'Hotline',
    address: 'Address',
    addressValue: 'Hanoi, Vietnam',
    formLabel: 'Connect with us',
    formTitle: 'Send Vinyl Heritage a message',
    name: 'Full name',
    topic: 'Subject',
    message: 'Message',
    namePlaceholder: 'Your full name',
    topicPlaceholder: 'For example: Sharing record materials',
    messagePlaceholder: 'Briefly tell us what you would like to discuss...',
    submit: 'Send message',
    submitting: 'Sending...',
    success: 'Message sent! We will reply by email as soon as possible.',
    validation: {
      name: 'Full name must be at least 2 characters.',
      email: 'Please enter a valid email.',
      topic: 'Subject must be at least 2 characters.',
      message: 'Message must be at least 2 characters.',
    },
  },
  footer: {
    headline: 'The sound may end,\nbut memory keeps resonating.',
    description:
      'Vinyl Heritage Vietnam preserves and retells the stories that shape Vietnam’s musical heritage.',
    company: 'Explore',
    support: 'Support',
    social: 'Social media',
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
    rights: 'All rights reserved.',
  },
  metadata: {
    homeTitle: 'Vinyl Heritage Vietnam',
    homeDescription:
      'Preserving and retelling the stories that shape Vietnam’s musical heritage.',
    aboutTitle: 'About | Vinyl Heritage Vietnam',
    aboutDescription:
      'Learn about our mission to preserve Vietnamese musical heritage.',
    contactTitle: 'Contact | Vinyl Heritage Vietnam',
    contactDescription: 'Contact Vinyl Heritage Vietnam.',
  },
};

export type PublicDictionary = typeof vi | typeof en;
export const dictionaries: Record<Locale, PublicDictionary> = { vi, en };
export const getDictionary = (locale: Locale) => dictionaries[locale];
