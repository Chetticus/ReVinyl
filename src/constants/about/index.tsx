import { Book1, Heart, Profile2User } from 'iconsax-react';

export const LIST_FOUNDATION = [
  {
    title: 'Lớp học linh hoạt',
    description:
      'Các Chuyên đề được thiết kế phù hợp với nhiều đối tượng và lịch trình, cho phép học viên tự do lựa chọn thời gian và tiến độ học tập phù hợp với bản thân.',
    icon: (
      <div className='h-12 w-12 rounded-full bg-[#03A9F429] flex items-center justify-center'>
        <Heart size={24} color='#0288D1' />
      </div>
    ),
  },
  {
    title: 'Học ở bất cứ đâu',
    description:
      'Chỉ cần có thiết bị kết nối internet, học viên có thể truy cập kho bài giảng phong phú của Vinyl Heritage mọi lúc, mọi nơi, đảm bảo quá trình học tập không bị gián đoạn.',
    icon: (
      <div className='h-12 w-12 rounded-full bg-[#DCB48429] flex items-center justify-center'>
        <Book1 size={24} color='#FFB145' />
      </div>
    ),
  },
  {
    title: 'Đội ngũ giảng viên giàu kinh nghiệm',
    description:
      'Vinyl Heritage quy tụ những giảng viên xuất sắc, có nhiều năm kinh nghiệm trong giảng dạy và nghiên cứu, cam kết mang đến những bài giảng chất lượng cao, dễ hiểu và truyền cảm hứng.',
    icon: (
      <div className='h-12 w-12 rounded-full bg-[#4CAF5029] flex items-center justify-center'>
        <Profile2User size={24} color='#388E3C' />
      </div>
    ),
  },
];
