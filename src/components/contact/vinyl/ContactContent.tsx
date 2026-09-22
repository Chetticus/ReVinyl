'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CallCalling, Sms, Location } from 'iconsax-react';
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
import { usePublicI18n } from '@/i18n/PublicI18nProvider';

export default function ContactContent() {
  const { dictionary: d } = usePublicI18n();
  const c = d.contact;
  const schema = z.object({
    name: z.string().trim().min(2, c.validation.name),
    email: z.string().trim().email(c.validation.email),
    topic: z.string().trim().min(2, c.validation.topic),
    message: z.string().trim().min(2, c.validation.message),
  });
  type Values = z.infer<typeof schema>;
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', topic: '', message: '' },
  });
  const { isSubmitting, isSubmitSuccessful } = form.formState;
  const info = [
    {
      title: c.email,
      value: 'example@gmail.com',
      href: 'mailto:example@gmail.com',
      Icon: Sms,
    },
    {
      title: c.phone,
      value: '+84 345622468',
      href: 'tel:+84345622468',
      Icon: CallCalling,
    },
    {
      title: c.address,
      value: c.addressValue,
      href: undefined,
      Icon: Location,
    },
  ];
  const submit = async (_values: Values) => {
    await Promise.resolve();
    form.reset();
  };
  const fieldClass =
    'h-[54px] rounded-[10px] border border-[rgba(145,158,171,0.32)] px-[14px] focus-visible:border-[#E4722C] focus-visible:ring-0';
  return (
    <>
      <section className='bg-transparent py-16 md:py-24'>
        <SectionContainer className='flex max-w-[1200px] flex-col items-center gap-12'>
          <div className='max-w-[880px] text-center'>
            <p className='text-lg font-semibold text-[#E4722C]'>{c.label}</p>
            <h1 className='mt-3 text-2xl font-bold leading-snug text-[#EFE3CD] md:text-[32px]'>
              {c.title}
            </h1>
          </div>
          <div className='grid w-full gap-4 md:grid-cols-3'>
            {info.map(({ title, value, href, Icon }) => {
              const content = (
                <>
                  <div className='flex-1'>
                    <p className='text-xl font-semibold text-[#302A26]'>
                      {title}
                    </p>
                    <p className='mt-1 text-[#65584D]'>{value}</p>
                  </div>
                  <Icon size={28} color='#E4722C' variant='Bold' />
                </>
              );
              const classes =
                'flex items-start gap-4 rounded-2xl border border-[#D8C8B3] bg-[#EDE2D0] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.12)]';
              return href ? (
                <a key={title} href={href} className={classes}>
                  {content}
                </a>
              ) : (
                <div key={title} className={classes}>
                  {content}
                </div>
              );
            })}
          </div>
        </SectionContainer>
      </section>
      <section className='pb-20 pt-10'>
        <SectionContainer className='max-w-[800px]'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submit)}
              className='space-y-6 rounded-2xl border border-[#D8C8B3] bg-[#EDE2D0] p-6 text-[#302A26] shadow-[0_16px_40px_rgba(0,0,0,0.16)] md:p-10'
              noValidate
            >
              <div>
                <p className='font-semibold text-[#212B36]'>{c.formLabel}</p>
                <h2 className='text-2xl font-bold text-[#E4722C]'>
                  {c.formTitle}
                </h2>
                {isSubmitSuccessful && (
                  <p role='status' className='mt-2 text-sm text-emerald-600'>
                    {c.success}
                  </p>
                )}
              </div>
              <div className='grid gap-5 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{c.name}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={c.namePlaceholder}
                          invalid={fieldState.invalid}
                          className={fieldClass}
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
                    <FormItem>
                      <FormLabel>{c.email}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='email'
                          placeholder='you@example.com'
                          invalid={fieldState.invalid}
                          className={fieldClass}
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
                    <FormItem className='md:col-span-2'>
                      <FormLabel>{c.topic}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={c.topicPlaceholder}
                          invalid={fieldState.invalid}
                          className={fieldClass}
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
                    <FormItem className='md:col-span-2'>
                      <FormLabel>{c.message}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={c.messagePlaceholder}
                          invalid={fieldState.invalid}
                          className='min-h-[140px] focus-visible:ring-0'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <button
                disabled={isSubmitting}
                className='h-12 rounded-full bg-[#E4722C] px-7 font-bold text-white disabled:opacity-60'
              >
                {isSubmitting ? c.submitting : c.submit}
              </button>
            </form>
          </Form>
        </SectionContainer>
      </section>
      <NewsletterSection />
    </>
  );
}
