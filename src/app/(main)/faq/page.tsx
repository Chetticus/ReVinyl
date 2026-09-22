'use client';

import React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { usePublicI18n } from '@/i18n/PublicI18nProvider';

function FaqPage() {
  const { dictionary: d } = usePublicI18n();

  return (
    <main className='vinyl-striped-bg min-h-screen pt-[72px] text-[#EFE3CD]'>
      <header className='border-b border-[#4A341F] px-4 py-14 text-center md:py-20'>
        <p className='text-sm text-[#C4B298]'>
          {d.faq.homeLabel} / {d.faq.breadcrumbLabel}
        </p>
        <h1 className='mt-4 text-4xl font-semibold'>{d.faq.headerTitle}</h1>
      </header>

      <section className='mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-16 md:px-8 lg:py-24'>
        <div className='max-w-2xl text-center'>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-[#E3C272]'>
            {d.faq.eyebrow}
          </p>

          <h2 className='mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#EFE3CD] md:text-4xl'>
            {d.faq.title}
          </h2>

          <p className='mt-4 text-sm leading-7 text-[#C4B298] md:text-base'>
            {d.faq.description}
          </p>
        </div>

        <Accordion type='single' collapsible className='mt-10 w-full max-w-3xl'>
          {d.faq.items.map((item, index) => (
            <AccordionItem
              key={`${index}-${item.question}`}
              value={`faq-${index}`}
              className='border-b border-[#6B4A2A]'
            >
              <AccordionTrigger className='py-5 text-left text-base font-semibold text-[#EFE3CD] hover:text-[#E3C272] hover:no-underline md:text-lg'>
                {item.question}
              </AccordionTrigger>

              <AccordionContent className='pb-6 text-sm leading-7 text-[#C4B298] md:text-base'>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
}

export default FaqPage;
