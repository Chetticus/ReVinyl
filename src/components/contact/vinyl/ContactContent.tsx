'use client';

import React from 'react';
import Image from 'next/image';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, CallCalling, Sms, Location } from 'iconsax-react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/text-area';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { SectionContainer } from '@/components/home/vinyl/shared';
import NewsletterSection from '@/components/home/vinyl/NewsletterSection';
import {
  VINYL_CONTACT_COPY,
  VINYL_CONTACT_IMAGES,
  VINYL_CONTACT_INFO,
} from '@/constants/vinyl-contact';

const FormSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().trim().email({ message: 'Email is invalid.' }),
  topic: z.string().trim().min(2, { message: 'Topic must be at least 2 characters.' }),
  message: z.string().trim().min(2, { message: 'Message must be at least 2 characters.' }),
  company: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof FormSchema>;

const inputClass =
  'h-[54px] rounded-[10px] border border-[rgba(145,158,171,0.32)] px-[14px] text-base text-[#212B36] placeholder:text-[#919EAB] shadow-none focus-visible:border-[#E4722C] focus-visible:ring-0';

const iconMap = {
  email: Sms,
  phone: CallCalling,
  address: Location,
} as const;

export default function ContactContent() {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      topic: '',
      message: '',
      company: '',
    },
  });

  const { isSubmitting, isSubmitSuccessful } = form.formState;

  async function onSubmit(values: FormValues) {
    if (values.company) return;
    // TODO: gọi API thực tế tại đây
    console.log('contact payload ->', values);
    form.reset({ name: '', email: values.email, topic: '', message: '', company: '' });
  }

  return (
    <>
      <section className='relative overflow-hidden bg-gradient-to-br from-[#E4722C]/15 via-[#FDF6F1] to-[#4FC1DE]/15 pb-10 pt-16 md:pb-16 md:pt-24'>
        <SectionContainer className='flex max-w-[1200px] flex-col items-center gap-10 md:gap-16'>
          <div className='flex max-w-[880px] flex-col items-center gap-3 text-center'>
            <p className='text-lg font-semibold text-[#E4722C]'>
              {VINYL_CONTACT_COPY.hero.label}
            </p>
            <h1 className='text-2xl font-bold leading-snug text-[#212B36] md:text-[32px] md:leading-[48px]'>
              {VINYL_CONTACT_COPY.hero.title}
            </h1>
          </div>

          <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:gap-6'>
            {VINYL_CONTACT_INFO.map(item => {
              const Icon = iconMap[item.type];
              const content = (
                <>
                  <div className='flex-1'>
                    <p className='text-xl font-semibold text-[#212B36]'>{item.title}</p>
                    <p className='mt-1 text-base text-[#637381]'>{item.value}</p>
                  </div>
                  <div className='flex size-14 shrink-0 items-center justify-center rounded-full bg-[#E4722C]/12'>
                    <Icon size={28} color='#E4722C' variant='Bold' />
                  </div>
                </>
              );

              const className =
                'flex items-start gap-4 rounded-2xl bg-white p-6 shadow-[0_12px_24px_-4px_rgba(145,158,171,0.12)] ring-1 ring-[#919EAB3D] transition-shadow hover:shadow-md md:p-8';

              return item.href ? (
                <a key={item.title} href={item.href} className={className}>
                  {content}
                </a>
              ) : (
                <div key={item.title} className={className}>
                  {content}
                </div>
              );
            })}
          </div>
        </SectionContainer>
      </section>

      {/* <section className='pb-16 pt-6 md:pb-[120px] md:pt-10'>
        <SectionContainer className='max-w-[1200px]'>
          <Form {...form}>
            <div className='flex flex-col gap-8 lg:flex-row lg:items-stretch'>
              <div className='relative min-h-[320px] w-full overflow-hidden rounded-2xl lg:min-h-[560px] lg:w-1/2'>
                <Image
                  src={VINYL_CONTACT_IMAGES.form}
                  alt='Liên hệ Vinyl Heritage Vietnam'
                  fill
                  priority
                  className='object-cover'
                  sizes='(min-width: 1024px) 50vw, 100vw'
                />
              </div>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex w-full flex-col gap-6 rounded-2xl bg-white p-6 shadow-[0_12px_24px_-4px_rgba(145,158,171,0.12)] ring-1 ring-[#919EAB3D] md:p-10 lg:w-1/2'
                noValidate
              >
                <div className='space-y-2'>
                  <p className='text-base font-semibold text-[#212B36] md:text-lg'>
                    {VINYL_CONTACT_COPY.form.label}
                  </p>
                  <h2 className='text-2xl font-bold leading-tight text-[#E4722C] md:text-[32px] md:leading-[48px]'>
                    {VINYL_CONTACT_COPY.form.title}
                  </h2>
                  {isSubmitSuccessful && (
                    <p
                      className='text-sm text-emerald-600'
                      role='status'
                      aria-live='polite'
                    >
                      {VINYL_CONTACT_COPY.form.success}
                    </p>
                  )}
                </div>

                <input
                  type='text'
                  tabIndex={-1}
                  autoComplete='off'
                  className='hidden'
                  {...form.register('company')}
                />

                <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field, fieldState }) => (
                      <FormItem className='col-span-1'>
                        <FormLabel>
                          Họ và tên <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='Nguyễn Văn A'
                            invalid={fieldState.invalid}
                            autoComplete='name'
                            aria-invalid={fieldState.invalid}
                            className={inputClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field, fieldState }) => (
                      <FormItem className='col-span-1'>
                        <FormLabel>
                          Email <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='you@example.com'
                            type='email'
                            inputMode='email'
                            autoComplete='email'
                            invalid={fieldState.invalid}
                            aria-invalid={fieldState.invalid}
                            className={inputClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='topic'
                    render={({ field, fieldState }) => (
                      <FormItem className='col-span-1 lg:col-span-2'>
                        <FormLabel>
                          Chủ đề <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='Ví dụ: Trao đổi tư liệu đĩa nhạc'
                            invalid={fieldState.invalid}
                            aria-invalid={fieldState.invalid}
                            autoComplete='off'
                            className={inputClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='message'
                    render={({ field, fieldState }) => (
                      <FormItem className='col-span-1 lg:col-span-2'>
                        <FormLabel>
                          Tin nhắn <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='Chia sẻ ngắn gọn nội dung bạn muốn trao đổi...'
                            invalid={fieldState.invalid}
                            aria-invalid={fieldState.invalid}
                            className='min-h-[120px] rounded-[10px] border-[rgba(145,158,171,0.32)] text-base shadow-none focus-visible:border-[#E4722C] focus-visible:ring-0'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#E4722C] px-[22px] text-[15px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit'
                >
                  {isSubmitting
                    ? VINYL_CONTACT_COPY.form.submitting
                    : VINYL_CONTACT_COPY.form.submit}
                  <ArrowRight size={24} color='white' />
                </button>
              </form>
            </div>
          </Form>
        </SectionContainer>
      </section> */}

      <NewsletterSection />
    </>
  );
}
