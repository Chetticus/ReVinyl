'use client';

import Image from 'next/image';
import { Fragment } from 'react';
import { VIET_VALUES } from '@/constants/vinyl-home';
import { usePublicI18n } from '@/i18n/PublicI18nProvider';

function ValueColumn({
  item,
}: {
  item: {
    letter: string;
    title: string;
    description: string;
    image: string;
    topSpacer: number;
    contentHeight: number;
    bottomSpacer: number;
  };
}) {
  return (
    <div className='group relative h-[720px] flex-1 overflow-hidden bg-[var(--wood-darkest)] md:h-[900px]'>
      {/* Hover: ảnh mờ nhẹ, tối — lộ hình bóng như thiết kế */}
      <div className='absolute inset-0 overflow-hidden'>
        <Image
          src={item.image}
          alt=''
          fill
          aria-hidden
          className='scale-105 object-cover opacity-0 brightness-75 saturate-75 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-[0.42] group-hover:blur-[8px]'
          sizes='(max-width:768px) 80vw, 25vw'
        />
        <div className='absolute inset-0 bg-[var(--wood-darkest)] opacity-0 transition-opacity duration-500 group-hover:opacity-[0.62]' />
      </div>

      <div className='relative z-10 flex h-full flex-col'>
        {item.topSpacer > 0 && (
          <div
            className='hidden shrink-0 md:block'
            style={{ height: item.topSpacer }}
            aria-hidden
          />
        )}

        <div
          className='flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center text-[var(--parchment)] md:flex-none md:justify-center'
          style={{ height: item.contentHeight }}
        >
          <span className='font-[family-name:var(--font-display)] text-[140px] uppercase leading-[0.9] text-[var(--gold)] md:text-[280px] xl:text-[400px] xl:leading-[360px]'>
            {item.letter}
          </span>
          <h3 className='text-xl font-semibold leading-8 md:text-2xl'>{item.title}</h3>
          <p className='max-w-[220px] text-sm leading-6 text-[var(--parchment-dim)] transition-colors duration-500 group-hover:text-[var(--parchment)] md:text-base'>
            {item.description}
          </p>
        </div>

        {item.bottomSpacer > 0 && (
          <div
            className='hidden shrink-0 md:block'
            style={{ height: item.bottomSpacer }}
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}

export default function ValueSection() {
  const { dictionary: d } = usePublicI18n();
  return (
    <section className='bg-[var(--wood-darkest)]'>
      <div className='mx-auto flex h-[720px] max-w-[1280px] items-center justify-center overflow-hidden px-4 md:h-[900px] md:px-10'>
        <div className='flex h-full w-full overflow-x-auto md:overflow-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {VIET_VALUES.map((item, index) => (
            <Fragment key={item.letter}>
              {index > 0 && (
                <div className='hidden w-[2px] shrink-0 self-stretch bg-[var(--gold)]/10 md:block' />
              )}
              <div className='w-[80vw] shrink-0 md:w-auto md:min-w-0 md:flex-1'>
                <ValueColumn item={{ ...item, ...d.home.values[index] }} />
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
