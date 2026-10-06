export const VINYL_CONTACT_IMAGES = {
  form: '/images/contact.png',
  formFallback: '/images/vinyl-home/story-2.png',
} as const;

export const VINYL_CONTACT_COPY = {
  hero: {
    label: 'Liên hệ với chúng tôi',
    title:
      'Mỗi câu chuyện đều đáng được lắng nghe. Hãy để lại lời nhắn — chúng tôi sẵn sàng đồng hành cùng bạn trên hành trình gìn giữ di sản âm nhạc Việt Nam.',
  },
  form: {
    label: 'Kết nối với chúng tôi',
    title: 'Gửi tin nhắn cho Vinyl Heritage',
    submit: 'Gửi tin nhắn',
    submitting: 'Đang gửi...',
    success: 'Gửi thành công! Chúng tôi sẽ phản hồi qua email sớm nhất.',
  },
} as const;

export const VINYL_CONTACT_INFO = [
  {
    title: 'Email',
    value: 'example@gmail.com',
    href: 'mailto:example@gmail.com',
    type: 'email' as const,
  },
  {
    title: 'Hotline',
    value: '+84 345622468',
    href: 'tel:+84345622468',
    type: 'phone' as const,
  },
  {
    title: 'Địa chỉ',
    value: 'Hà Nội, Việt Nam',
    href: undefined,
    type: 'address' as const,
  },
] as const;
