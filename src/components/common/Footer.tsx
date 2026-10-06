import Image from 'next/image';
import Link from 'next/link';
import { Call, Sms } from 'iconsax-react';
import { ERouteTable } from '@/constants/route';
import { VINYL_IMAGES } from '@/constants/vinyl-home';

const companyLinks = [
  { label: 'Trang chủ', href: ERouteTable.HOME },
  { label: 'Giới thiệu', href: ERouteTable.ABOUT },
  { label: 'Chuyên đề', href: ERouteTable.COURSE },
  // { label: 'Yêu thích', href: ERouteTable.COURSE_FAVORITE },
];

const supportLinks = [
  { label: 'Liên hệ', href: ERouteTable.CONTACT },
  { label: 'Giảng viên', href: ERouteTable.ABOUT },
  { label: 'FAQS', href: ERouteTable.FAQ_PAGE },
];

const socialLinks = [
  { label: 'Facebook', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'Linkedin', href: '#' },
  { label: 'Twitter', href: '#' },
];

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className='flex flex-col gap-6'>
      <h3 className='text-xl font-bold text-[#212B36]'>{title}</h3>
      <ul className='flex flex-col gap-2'>
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className='cursor-pointer text-base text-[#637381] transition-colors hover:text-[#E4722C]'
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className='border-t border-dashed border-[#919EAB3D] bg-[#FDF6F1]'>
      <div className='mx-auto max-w-[1280px] px-4 py-20 md:px-6 md:py-[120px]'>
        <div className='flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between'>
          <div className='max-w-[580px] space-y-4'>
            <h2 className='text-[32px] font-bold leading-[48px] text-[#212B36]'>
              Âm thanh có thể khép lại,
              <br />
              nhưng ký ức vẫn tiếp tục ngân vang.
            </h2>
            <p className='text-base leading-6 text-[#637381]'>
              Vinyl Heritage Vietnam gìn giữ và kể lại những câu chuyện làm nên
              di sản âm nhạc Việt Nam.
            </p>
          </div>

          <Link href={ERouteTable.HOME} className='relative block h-10 w-[210px] shrink-0 cursor-pointer'>
            <Image
              src={VINYL_IMAGES.logoPrimary}
              alt='Vinyl Heritage Vietnam'
              fill
              className='object-contain object-left'
            />
          </Link>
        </div>

        <div className='my-8 h-px w-full bg-[#919EAB3D]' />

        <div className='flex flex-col gap-12 xl:flex-row xl:items-start xl:justify-between'>
          <div className='space-y-10'>
            <div className='flex items-center gap-6'>
              <div className='flex size-16 shrink-0 items-center justify-center rounded-[32px] border border-[#919EAB3D]'>
                <Sms size={26} color='#212B36' />
              </div>
              <div>
                <p className='text-lg text-[#212B36]'>Email</p>
                <a
                  href='mailto:example@gmail.com'
                  className='text-lg text-[#637381] cursor-pointer hover:text-[#E4722C]'
                >
                  example@gmail.com
                </a>
              </div>
            </div>

            <div className='flex items-center gap-6'>
              <div className='flex size-16 shrink-0 items-center justify-center rounded-[32px] border border-[#919EAB3D]'>
                <Call size={26} color='#212B36' />
              </div>
              <div>
                <p className='text-lg text-[#212B36]'>Phone</p>
                <a
                  href='tel:+84345622468'
                  className='text-lg text-[#637381] cursor-pointer hover:text-[#E4722C]'
                >
                  +84 345622468
                </a>
              </div>
            </div>
          </div>

          <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[100px]'>
            <FooterLinkColumn title='Công ty' links={companyLinks} />
            <FooterLinkColumn title='Hỗ trợ' links={supportLinks} />
            <FooterLinkColumn title='Mạng xã hội' links={socialLinks} />
          </div>
        </div>

        <div className='mt-10 flex flex-col gap-4 border-t border-[#919EAB3D] pt-8 md:flex-row md:items-center md:justify-between'>
          <p className='text-base text-[#637381]'>
            ©2025{' '}
            <span className='font-semibold text-[#212B36]'>Vinyl Heritage Vietnam.</span>
          </p>

          <div className='flex flex-wrap items-center gap-6 text-base text-[#637381]'>
            <Link href='#' className='cursor-pointer hover:text-[#E4722C]'>
              Điều khoản &amp; Điều kiện
            </Link>
            <span className='hidden h-4 w-px bg-[#919EAB3D] md:block' />
            <Link href='#' className='cursor-pointer hover:text-[#E4722C]'>
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
