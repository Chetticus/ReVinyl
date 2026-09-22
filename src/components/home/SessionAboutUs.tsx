'use client';

import './index.css';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import { Star1 } from 'iconsax-react';

export const FEEDBACK = [
  {
    id: 1,
    name: 'Nam Anh',
    age: 13,
    image: '/images/feedbak/img_23.png',
    color: '#FFE0B2',
    feedback:
      'Từ khi học, mình biết cách tiết kiệm để mua chiếc xe đạp mới. Giờ thì mình đã có đủ tiền rồi! Cảm ơn các thầy cô rất nhiều!',
  },
  {
    id: 2,
    name: 'Minh Thư',
    age: 13,
    image: '/images/feedbak/img_24.png',
    color: '#CDDFFF',
    feedback:
      "Em cứ nghĩ tiền bạc thật phức tạp, nhưng các Chuyên đề ở đây giống như những trò chơi vậy. Em đã học được cách phân biệt 'cần' và 'muốn' khi đi siêu thị với mẹ!",
  },
  {
    id: 3,
    name: 'Thảo Chi',
    age: 13,
    image: '/images/feedbak/img_25.png',
    color: '#C8E6C9',
    feedback:
      'Bố mẹ em rất bất ngờ khi em biết cách chi tiêu thông minh. Em còn chia sẻ những điều đã học cho các bạn ở lớp nữa. Ai cũng thấy thích!',
  },
  {
    id: 4,
    name: 'Hoàng Long',
    age: 13,
    image: '/images/feedbak/img_26.png',
    color: '#FFE0B2',
    feedback:
      'Em dùng tiền tiêu vặt một cách bừa bãi trước đây, nhưng giờ em đã biết cách lập kế hoạch. Em còn tự làm ra tiền bằng cách giúp bố mẹ dọn dẹp nhà cửa và bỏ vào ống heo.',
  },
  {
    id: 5,
    name: 'Ngọc Trâm',
    age: 13,
    image: '/images/feedbak/img_27.png',
    color: '#CDDFFF',
    feedback:
      'Trước đây, em hay đòi bố mẹ mua đồ chơi. Bây giờ, em đã hiểu phải dùng tiền của mình để mua những gì thật sự cần. Tiền mừng tuổi năm nay của em đã tăng lên rất nhiều rồi đấy!',
  },
  {
    id: 6,
    name: 'Khánh Chi',
    age: 13,
    image: '/images/feedbak/img_28.png',
    color: '#C8E6C9',
    feedback:
      'Em từng nghĩ đầu tư là việc của người lớn, nhưng Chuyên đề này đã giúp em hiểu các khái niệm cơ bản về đầu tư một cách dễ hiểu nhất. Em cảm thấy tự tin hơn rất nhiều về tương lai của mình.',
  },
];

export default function SessionAboutUs() {
  const router = useRouter();

  return (
    <div className='bg-white px-4 md:px-20 md:py-20 py-14'>
      <div className='flex relative flex-col gap-4 justify-center items-center mx-auto'>
        <div className='text-primary-main mb-4 w-max flex items-center font-semibold bg-[#2F57EF14] rounded-full h-12 px-4'>
          Nhận xét
        </div>
        <div className='text-4xl font-extrabold'>
          Những câu chuyện thành công
        </div>
        <div className='text-[#212B36] mt-1 text-center'>
          Xem cách học viên của chúng tôi đạt được thành công nhờ sự <br />{' '}
          hướng dẫn chuyên môn từ cố vấn và kỹ năng thực tế
        </div>
      </div>
      <div className='relative mt-8'>
        <div className='pointer-events-none absolute top-0 left-0 w-0 md:w-50 xl:w-100 h-full z-10 bg-gradient-to-r from-white to-transparent'></div>
        <div className='pointer-events-none absolute top-0 right-0 w-0 md:w-50 xl:w-100 h-full z-10 bg-gradient-to-l from-white to-transparent'></div>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          loop={true}
          breakpoints={{
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 3 },
            1536: { slidesPerView: 3 },
          }}
        >
          {FEEDBACK.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div style={{ backgroundColor: item.color }} className='flex flex-col justify-between p-8 rounded-[40px] min-h-[240px]'>
                <div className='text-center pb-2 border-b h-[100px] border-b-[#919EAB3D]'>{item.feedback}</div>
                <div className="flex justify-between mt-8">
                  <div className='flex items-center gap-4'>
                    <img className='h-12 w-12 rounded-full border-2 border-white' src={item.image} />
                    <div className='text-left'>
                      <div className='font-semibold'>{item.name}</div>
                      <div>Học viên</div>
                    </div>
                  </div>
                  <div className="font-bold flex items-center gap-2 text-xl">5.0 <Star1 size="24" color="#212B36" variant="Bold" /></div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
