import Image from 'next/image';
import { ABOUT_CARDS } from '@/constants/vinyl-home';
import {
  SectionContainer,
  SectionDescription,
  SectionLabel,
  SectionTitle,
  VinylButton,
} from './shared';
import { cn } from '@/lib/utils';

function AboutCard({
  image,
  lines,
  align,
}: {
  image: string;
  lines: readonly [string, string];
  align: 'start' | 'center' | 'end';
}) {
  return (
    <div
      className={cn(
        'flex w-full',
        align === 'end' && 'justify-end',
        align === 'center' && 'justify-center pl-0 md:pl-[200px]',
        align === 'start' && 'justify-start pl-0 md:pl-[60px]',
      )}
    >
      <div className='relative size-[220px] overflow-hidden rounded-[30px] md:size-[250px]'>
        <Image src={image} alt={lines.join(' ')} fill className='object-cover' sizes='250px' />
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-[#180a05]' />
        <div className='absolute inset-x-5 bottom-7 text-center text-xl leading-7 text-white'>
          <p>{lines[0]}</p>
          <p>{lines[1]}</p>
        </div>
      </div>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section className='bg-[#FDF6F1] pb-24 pt-20 md:pb-[100px]'>
      <SectionContainer className='flex flex-col items-center gap-24'>
        <div className='flex max-w-[800px] flex-col items-center gap-8 text-center'>
          <SectionLabel>VỀ CHÚNG TÔI</SectionLabel>
          <SectionTitle>
            Đĩa nhạc không chỉ lưu giữ âm thanh.
            <br />
            Chúng lưu giữ ký ức.
          </SectionTitle>
          <SectionDescription className='text-center'>
            Dự án bảo tồn, hệ thống hóa và lan tỏa những giá trị lịch sử, nghệ thuật
            <br className='hidden md:block' />
            và ký ức được lưu giữ trên các ấn phẩm âm nhạc Việt Nam.
          </SectionDescription>
          <VinylButton href='/topics'>Khám phá ngay!</VinylButton>
        </div>

        <div className='flex w-full flex-col gap-16 md:gap-[100px]'>
          {ABOUT_CARDS.map((card) => (
            <AboutCard key={card.lines.join('-')} {...card} />
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
