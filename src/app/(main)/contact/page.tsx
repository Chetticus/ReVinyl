import { Public_Sans } from 'next/font/google';
import ContactContent from '@/components/contact/vinyl/ContactContent';

const publicSans = Public_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-public-sans',
});

function ContactPage() {
  return (
    <div
      className={`${publicSans.variable} bg-[#FDF6F1] font-[family-name:var(--font-public-sans)]`}
    >
      <ContactContent />
    </div>
  );
}

export default ContactPage;
