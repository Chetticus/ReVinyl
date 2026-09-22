'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Call, Sms } from 'iconsax-react';
import { VINYL_IMAGES } from '@/constants/vinyl-home';
import { usePublicI18n } from '@/i18n/PublicI18nProvider';
import { buildLocalePath } from '@/i18n/config';

function Column({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className='flex flex-col gap-6'>
      <h3 className='font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--parchment)]'>{title}</h3>
      <ul className='flex flex-col gap-2'>
        {links.map(link => (
          <li key={link.label}>
            <Link
              href={link.href}
              className='text-base text-[var(--parchment-dim)] hover:text-[var(--gold-bright)]'
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default function Footer() {
  const { locale, dictionary: d } = usePublicI18n();
  const local = (path = '/') => buildLocalePath(locale, path);
  const company = [
    { label: d.navigation.home, href: local() },
    { label: d.navigation.archive, href: local('/archive') },
    { label: d.navigation.timeline, href: local('/timeline') },
    // { label: d.navigation.topics, href: local('/topics') },
  ];
  const support = [
    { label: d.navigation.about, href: local('/about') },
    { label: d.navigation.contact, href: local('/contact') },
    { label: d.navigation.faq, href: local('/faq') },
  ];
  return (
    <footer className='border-t border-dashed border-[var(--gold)]/25 bg-[var(--wood-darkest)]'>
      <div className='mx-auto max-w-[1280px] px-4 py-8 md:px-6 md:pt-[120px]'>
        <div className='flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between'>
          <div className='max-w-[580px] space-y-4'>
            <h2 className='whitespace-pre-line font-[family-name:var(--font-display)] text-[32px] font-semibold leading-[48px] text-[var(--parchment)]'>
              {d.footer.headline}
            </h2>
            <p className='text-base leading-6 text-[var(--parchment-dim)]'>
              {d.footer.description}
            </p>
          </div>
          <Link href={local()} className='relative block h-10 w-[210px]'>
            <Image
              src={VINYL_IMAGES.logoWhite}
              alt='Vinyl Heritage Vietnam'
              fill
              className='object-contain object-left'
            />
          </Link>
        </div>
        <div className='my-8 h-px bg-[var(--gold)]/20' />
        <div className='flex flex-col gap-12 xl:flex-row xl:justify-between'>
          <div className='space-y-8'>
            <a
              href='mailto:example@gmail.com'
              className='flex items-center gap-4 text-[var(--parchment-dim)] hover:text-[var(--gold-bright)]'
            >
              <Sms size={26} />
              <span>
                <strong className='block text-[var(--parchment)]'>
                  {d.contact.email}
                </strong>
                example@gmail.com
              </span>
            </a>
            <a
              href='tel:+84345622468'
              className='flex items-center gap-4 text-[var(--parchment-dim)] hover:text-[var(--gold-bright)]'
            >
              <Call size={26} />
              <span>
                <strong className='block text-[var(--parchment)]'>
                  {d.contact.phone}
                </strong>
                +84 345622468
              </span>
            </a>
          </div>
          <div className='grid gap-10 sm:grid-cols-2 lg:gap-[100px]'>
            <Column title={d.footer.company} links={company} />
            <Column title={d.footer.support} links={support} />
          </div>
        </div>
        <div className='mt-10 flex flex-col gap-4 border-t border-[var(--gold)]/15 pt-8 md:flex-row md:justify-between'>
          <p className='text-[var(--parchment-dim)]'>
            © {new Date().getFullYear()}{' '}
            <strong className='text-[var(--parchment)]'>Vinyl Heritage Vietnam.</strong>{' '}
            {d.footer.rights}
          </p>
          <div className='flex gap-6 text-[var(--parchment-dim)]'>
            <span>{d.footer.terms}</span>
            <span>{d.footer.privacy}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
