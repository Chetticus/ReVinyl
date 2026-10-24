import content from '@/data/website-content.json';
import { telephoneHref } from '@/lib/contact';

export const VINYL_CONTACT_IMAGES = {
  form: '/images/contact.png',
  formFallback: '/images/vinyl-home/story-2.png',
} as const;
const contact = content.vi.contact;
export const VINYL_CONTACT_COPY = {
  hero: { label: contact.label, title: contact.title },
  form: {
    label: contact.formLabel,
    title: contact.formTitle,
    submit: contact.submit,
    submitting: contact.submitting,
    success: contact.success,
  },
} as const;
export const VINYL_CONTACT_INFO = [
  {
    title: contact.email,
    value: contact.emailValue,
    href: `mailto:${contact.emailValue}`,
    type: 'email',
  },
  {
    title: contact.phone,
    value: contact.phoneValue,
    href: telephoneHref(contact.phoneValue),
    type: 'phone',
  },
  {
    title: contact.address,
    value: contact.addressValue,
    href: undefined,
    type: 'address',
  },
] as const;
