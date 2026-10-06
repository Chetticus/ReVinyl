import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HeaderSection } from '@/components/common/HeaderSection';

const FAQS_LIST = [
  {
    question: 'Vinyl Heritage Vietnam là gì?',
    answer:
      'Vinyl Heritage Vietnam là không gian số nhằm sưu tầm, lưu trữ và kể lại những câu chuyện làm nên di sản âm nhạc Việt Nam qua đĩa vinyl — từ bản thu, bìa đĩa, nghệ sĩ đến bối cảnh văn hóa phía sau mỗi ấn phẩm.',
  },
  {
    question: 'Website dành cho ai?',
    answer:
      'Dành cho người yêu đĩa nhạc, nhà sưu tầm, nhà nghiên cứu, sinh viên và bất kỳ ai muốn tìm hiểu âm nhạc Việt Nam qua tư liệu vinyl một cách dễ tiếp cận.',
  },
  {
    question: 'Tôi có thể xem những nội dung gì trên nền tảng?',
    answer:
      'Bạn có thể khám phá bộ sưu tập đĩa, chuyên đề theo chủ đề, câu chuyện phía sau từng bản thu, thông tin nghệ sĩ và các tư liệu liên quan được hệ thống hóa để dễ tìm và đối chiếu.',
  },
  {
    question: 'Tôi có cần tạo tài khoản để xem nội dung không?',
    answer:
      'Một số nội dung mở miễn phí để mọi người tiếp cận. Để lưu yêu thích, theo dõi tiến độ chuyên đề hoặc nhận cập nhật mới, bạn nên đăng ký tài khoản.',
  },
  {
    question: 'Chuyên đề trên Vinyl Heritage khác gì một bài viết thông thường?',
    answer:
      'Mỗi chuyên đề được tổ chức theo chủ đề, có thể gồm nhiều phần tư liệu, hình ảnh và câu chuyện liên kết với nhau — giúp bạn đi sâu hơn thay vì chỉ đọc một trang đơn lẻ.',
  },
  {
    question: 'Thông tin trên website có được kiểm chứng không?',
    answer:
      'Chúng tôi ưu tiên ghi rõ nguồn và đối chiếu tư liệu khi có thể. Những nội dung chưa xác minh đầy đủ sẽ được đánh dấu minh bạch để cộng đồng cùng góp ý và bổ sung.',
  },
  {
    question: 'Tôi có thể đóng góp tư liệu hoặc câu chuyện không?',
    answer:
      'Có. Nếu bạn sở hữu đĩa, ảnh, tư liệu hoặc ký ức liên quan đến âm nhạc vinyl Việt Nam, hãy liên hệ với chúng tôi qua trang Liên hệ. Mỗi đóng góp đều giúp kho di sản phong phú hơn.',
  },
  {
    question: 'Vinyl Heritage có bán đĩa thật không?',
    answer:
      'Hiện tại nền tảng tập trung vào việc giới thiệu, lưu trữ và kể chuyện về di sản đĩa nhạc. Nếu có hoạt động mua bán hoặc sự kiện liên quan, chúng tôi sẽ thông báo rõ trên website.',
  },
  {
    question: 'Làm sao để nhận tin tức và nội dung mới?',
    answer:
      'Bạn có thể đăng ký nhận bản tin qua form email trên trang chủ, hoặc theo dõi các kênh mạng xã hội của Vinyl Heritage Vietnam để cập nhật chuyên đề và câu chuyện mới.',
  },
  {
    question: 'Khi cần hỗ trợ tôi liên hệ ở đâu?',
    answer:
      'Vui lòng gửi tin nhắn qua trang Liên hệ, hoặc email / hotline được liệt kê trên website. Đội ngũ sẽ phản hồi trong thời gian sớm nhất.',
  },
];

function FaqPage() {
  return (
    <div className='bg-white'>
      <HeaderSection title='FAQS' label='Trang chủ' subLabel='FAQS' />
      <div className='py-12 lg:py-32 px-6 md:max-w-3xl max-w-sm lg:max-w-5xl xl:max-w-7xl mx-auto w-full flex flex-col items-center justify-center h-full'>
        <div className='font-bold text-2xl leading-9 lg:text-3xl lg:leading-12 text-[#212B36]'>
          Những câu hỏi thường gặp
        </div>
        <Accordion
          type='single'
          collapsible
          className='lg:w-[60%] mt-6 lg:mt-10'
        >
          {FAQS_LIST.map(item => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className='text-[#212B36] bg-[#F4F6F8]'>
                {item.question}
              </AccordionTrigger>
              <AccordionContent className='text-[#212B36]'>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default FaqPage;
